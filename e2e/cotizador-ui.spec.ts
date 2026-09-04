import { test, expect, type Page } from "@playwright/test";

// UI del multicotizador con la red mockeada: no necesita base de datos, catalogo
// CCA ni credenciales de las aseguradoras. Verifica que el paso 2 del flujo Auto
// muestre la columna de estimacion propia (formula) mas una columna por cada
// aseguradora de PROVIDER_COLUMNS (hoy Sancor y Cooperación), con sus marcas y
// sus precios.

const BRANDS = [{ id: 1, name: "Toyota" }];
const MODELS = [{ id: 10, name: "Corolla" }];
const VERSIONS = [{ id: 100, name: "2.0 XEI CVT" }];
const VALUE_ARS = 25_000_000;

// Columnas de proveedor que se esperan en la UI: id de QuoteProvider + su marca
// (logo con alt, o wordmark de fallback).
const PROVIDER_COLUMNS = [
  { id: "sancor", name: "Sancor Seguros", wordmark: "SANCOR SEGUROS" },
  {
    id: "cooperacion",
    name: "Cooperación Seguros",
    wordmark: "COOPERACIÓN SEGUROS",
  },
];

const PROVIDER_PLANS = [
  {
    planId: "1",
    planName: "Responsabilidad Civil",
    coverage: "rc",
    coverageRawName: "RC",
    monthlyPremium: 30500,
    totalPremium: 366000,
    insuredSumARS: null,
    currency: "ARS",
  },
  {
    planId: "2",
    planName: "Todo Riesgo con Franquicia",
    coverage: "todo-riesgo",
    coverageRawName: "TR c/fá",
    monthlyPremium: 92800,
    totalPremium: 1113600,
    insuredSumARS: VALUE_ARS,
    currency: "ARS",
  },
];

async function mockBackend(page: Page, providers: "ok" | "unavailable") {
  await page.route("**/api/vehicle-lookup**", (route) => {
    const action = new URL(route.request().url()).searchParams.get("action");
    const map: Record<string, unknown> = {
      brands: BRANDS,
      models: MODELS,
      versions: VERSIONS,
      value: VALUE_ARS,
    };
    route.fulfill({ json: { data: map[action ?? ""] ?? [] } });
  });

  // Una sola ruta para todos los proveedores: respondemos segun ?provider=<id>.
  await page.route("**/api/quote**", (route) => {
    const id =
      new URL(route.request().url()).searchParams.get("provider") ?? "sancor";
    const name =
      PROVIDER_COLUMNS.find((p) => p.id === id)?.name ?? "Sancor Seguros";
    const result =
      providers === "ok"
        ? {
            providerId: id,
            providerName: name,
            ok: true,
            plans: PROVIDER_PLANS,
          }
        : {
            providerId: id,
            providerName: name,
            ok: false,
            plans: [],
            error: "Proveedor no operativo en la prueba.",
          };
    route.fulfill({ json: { data: [result] } });
  });
}

async function driveAutoToStep2(page: Page) {
  const cotizador = page.getByTestId("cotizador");
  await page.goto("/");
  await cotizador.scrollIntoViewIfNeeded();

  await cotizador.getByRole("button", { name: "Auto", exact: true }).click();
  await cotizador.getByRole("button", { name: "Siguiente" }).click();
  await expect(cotizador.getByText("Datos del vehículo")).toBeVisible();

  await cotizador.locator("select").nth(0).selectOption({ label: "Toyota" });
  await cotizador.locator("select").nth(1).selectOption("2022"); // anio
  await cotizador.locator("select").nth(2).selectOption({ label: "Corolla" });
  await cotizador
    .locator("select")
    .nth(3)
    .selectOption({ label: "2.0 XEI CVT" });

  const cp = cotizador.getByPlaceholder("Ej: 3000");
  await expect(cp).toBeVisible();
  await cp.fill("3000");

  const siguiente = cotizador.getByRole("button", { name: "Siguiente" });
  await expect(siguiente).toBeEnabled();
  await siguiente.click();
  await expect(cotizador.getByText("Elegí tu cobertura")).toBeVisible();
  return cotizador;
}

test("Auto: estimacion propia + una columna por aseguradora, con precios", async ({
  page,
}) => {
  await mockBackend(page, "ok");
  const cotizador = await driveAutoToStep2(page);

  // Columna clasica: formula propia -> RC == 32.000 para valor 25M / CP 3000.
  const estimate = cotizador.getByTestId("estimate-column");
  await expect(estimate).toBeVisible();
  await expect(estimate.getByText(/Estimación Guadalupe/i)).toBeVisible();
  await expect(
    estimate.getByText("Responsabilidad Civil", { exact: true }),
  ).toBeVisible();
  await expect(estimate.getByText(/\$\s*32\.000/)).toBeVisible();

  // Una columna por proveedor: marca (logo o wordmark) + precios mockeados /mes.
  for (const provider of PROVIDER_COLUMNS) {
    const column = cotizador.getByTestId(`${provider.id}-column`);
    await expect(column).toBeVisible();
    await expect(
      column
        .getByAltText(provider.name)
        .or(column.getByText(provider.wordmark)),
    ).toBeVisible();
    await expect(column.getByText(/\$\s*30\.500\s*\/mes/)).toBeVisible();
    await expect(column.getByText(/\$\s*92\.800\s*\/mes/)).toBeVisible();
    await expect(column.getByText("Todo Riesgo con Franquicia")).toBeVisible();
  }
});

test("Auto: si una aseguradora no esta operativa, su columna muestra el estado y la estimacion sigue", async ({
  page,
}) => {
  await mockBackend(page, "unavailable");
  const cotizador = await driveAutoToStep2(page);

  await expect(cotizador.getByTestId("estimate-column")).toBeVisible();
  await expect(
    cotizador.getByTestId("estimate-column").getByText(/\$\s*32\.000/),
  ).toBeVisible();

  for (const provider of PROVIDER_COLUMNS) {
    const column = cotizador.getByTestId(`${provider.id}-column`);
    await expect(column).toBeVisible();
    await expect(column.locator(".animate-spin")).toHaveCount(0);
    await expect(column).toContainText(/no está disponible/i);
  }
});
