import { test, expect } from "@playwright/test";

// Prueba el endpoint del multicotizador (POST /api/quote) de verdad, con el
// .env real. Sirve para ver la respuesta de Sancor sin tener que pasar por toda
// la UI. Imprime el resultado en consola.

const AUTO_BODY = {
  vehicleType: "Auto" as const,
  brand: "Toyota",
  model: "Corolla",
  version: "2.0 XEI CVT",
  year: 2022,
  vehicleValueARS: 25_000_000,
  hasGnc: false,
  postalCode: "3000",
  providerCodes: { sancor: { vehicleCode: "1" } },
};

// Mensajes de "todavia falta configurar algo" que consideramos aceptables
// mientras no esten las credenciales/codigos reales de Sancor.
const PENDING =
  /token|productor|organizador|COVER_MODULE|vehicleCode|TokenGenerator|401|403|500/i;

test("POST /api/quote responde con la estructura del proveedor Sancor", async ({
  request,
}) => {
  const res = await request.post("/api/quote?provider=sancor", {
    data: AUTO_BODY,
  });
  const body = await res.json();
  console.log("[/api/quote] status", res.status());
  console.log("[/api/quote] body", JSON.stringify(body, null, 2));

  expect(res.ok()).toBeTruthy();
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data).toHaveLength(1);

  const sancor = body.data[0];
  expect(sancor.providerId).toBe("sancor");
  expect(sancor.providerName).toBe("Sancor Seguros");
  expect(typeof sancor.ok).toBe("boolean");

  if (sancor.ok) {
    // Ya hay cotizacion real: validamos que los precios sean numeros positivos.
    expect(Array.isArray(sancor.plans)).toBe(true);
    expect(sancor.plans.length).toBeGreaterThan(0);
    for (const p of sancor.plans) {
      expect(typeof p.planName).toBe("string");
      if (p.monthlyPremium != null) {
        expect(p.monthlyPremium).toBeGreaterThan(0);
      }
      expect(["rc", "terceros-completo", "todo-riesgo", null]).toContain(
        p.coverage,
      );
    }
    console.log(
      "[/api/quote] PLANES:",
      sancor.plans.map(
        (p: { planName: string; monthlyPremium: number | null }) =>
          `${p.planName}: ${p.monthlyPremium}`,
      ),
    );
  } else {
    // Todavia sin credenciales/codigos: el error debe ser uno de los conocidos.
    console.log("[/api/quote] Sancor aun no operativo:", sancor.error);
    expect(sancor.error).toMatch(PENDING);
  }
});

test("POST /api/quote valida el body (400 con datos invalidos)", async ({
  request,
}) => {
  const res = await request.post("/api/quote", {
    data: { vehicleType: "Auto", year: 2022 },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.error).toBeTruthy();
});

test("POST /api/quote sin ?provider corre todos los habilitados", async ({
  request,
}) => {
  const res = await request.post("/api/quote", { data: AUTO_BODY });
  const body = await res.json();
  console.log("[/api/quote all] body", JSON.stringify(body, null, 2));
  expect(res.ok()).toBeTruthy();
  expect(Array.isArray(body.data)).toBe(true);
  // Con SANCOR_API_CLIENT_ID en el .env, Sancor cuenta como habilitado.
  const ids = body.data.map((r: { providerId: string }) => r.providerId);
  expect(ids).toContain("sancor");
});
