import { test, expect } from "@playwright/test";

// Prueba el endpoint del multicotizador (POST /api/quote?provider=cooperacion)
// de verdad, con el .env real. Sirve para ver la respuesta de Cooperación sin
// tener que pasar por toda la UI. Imprime el resultado en consola.

const AUTO_BODY = {
  vehicleType: "Auto" as const,
  brand: "Toyota",
  model: "Yaris",
  version: "1.5 XS CVT",
  year: 2022,
  vehicleValueARS: 25_000_000,
  hasGnc: false,
  postalCode: "3000",
  providerCodes: { cooperacion: { codigoInfoAuto: 9100011 } },
};

// Mensajes de "todavia falta configurar algo" que consideramos aceptables
// mientras no esten las credenciales/codigos reales de Cooperación.
const PENDING =
  /configurado|COOPERACION_|token|localidad|codigo de vehiculo|productor|catálogo de Cooperación|401|403|500/i;

// Mismo auto pero sin el override de `providerCodes`: el adapter tiene que
// resolver el `codigoVehiculoCMP` solo, a partir de `catalogVersionId` y el
// nombre, contra el catalogo de Cooperación (ver lib/quote-providers/vehicle-xref.ts).
const AUTO_BODY_XREF = {
  vehicleType: "Auto" as const,
  brand: "Toyota",
  model: "Etios",
  version: "5P 1,5 XS",
  year: 2015,
  vehicleValueARS: 12_000_000,
  hasGnc: false,
  postalCode: "3000",
  catalogVersionId: 1986317945, // id CCA estable de "TOYOTA / ETIOS / 5P 1,5 XS"
};

test("POST /api/quote responde con la estructura del proveedor Cooperación", async ({
  request,
}) => {
  const res = await request.post("/api/quote?provider=cooperacion", {
    data: AUTO_BODY,
  });
  const body = await res.json();
  console.log("[/api/quote] status", res.status());
  console.log("[/api/quote] body", JSON.stringify(body, null, 2));

  expect(res.ok()).toBeTruthy();
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data).toHaveLength(1);

  const cooperacion = body.data[0];
  expect(cooperacion.providerId).toBe("cooperacion");
  expect(cooperacion.providerName).toBe("Cooperación Seguros");
  expect(typeof cooperacion.ok).toBe("boolean");

  if (cooperacion.ok) {
    expect(Array.isArray(cooperacion.plans)).toBe(true);
    for (const p of cooperacion.plans) {
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
      cooperacion.plans.map(
        (p: { planName: string; monthlyPremium: number | null }) =>
          `${p.planName}: ${p.monthlyPremium}`,
      ),
    );
  } else {
    console.log(
      "[/api/quote] Cooperación aun no operativo:",
      cooperacion.error,
    );
    expect(cooperacion.error).toMatch(PENDING);
  }
});

test("POST /api/quote resuelve el codigo de vehiculo desde catalogVersionId (sin providerCodes)", async ({
  request,
}) => {
  const res = await request.post("/api/quote?provider=cooperacion", {
    data: AUTO_BODY_XREF,
  });
  const body = await res.json();
  console.log("[/api/quote xref] status", res.status());
  console.log("[/api/quote xref] body", JSON.stringify(body, null, 2));

  expect(res.ok()).toBeTruthy();
  const cooperacion = body.data[0];
  expect(cooperacion.providerId).toBe("cooperacion");
  expect(typeof cooperacion.ok).toBe("boolean");

  if (cooperacion.ok) {
    expect(Array.isArray(cooperacion.plans)).toBe(true);
    expect(cooperacion.plans.length).toBeGreaterThan(0);
    console.log(
      "[/api/quote xref] PLANES:",
      cooperacion.plans.map(
        (p: { planName: string; monthlyPremium: number | null }) =>
          `${p.planName}: ${p.monthlyPremium}`,
      ),
    );
  } else {
    // aceptable si el catalogo CCA del entorno no tiene esa version, o si
    // Cooperación no la lista: el mensaje lo explica.
    expect(cooperacion.error).toMatch(PENDING);
  }
});
