import { test, expect, type Page } from "@playwright/test";

// "Retomar cotización": el formulario de Auto se restaura con lo que el visitante
// habia elegido, incluso si abandono antes de elegir la version. Red mockeada.

async function mockLookup(page: Page) {
  await page.route("**/api/vehicle-lookup**", (route) => {
    const action = new URL(route.request().url()).searchParams.get("action");
    const map: Record<string, unknown> = {
      brands: [{ id: 1, name: "Toyota" }],
      models: [{ id: 10, name: "Corolla" }],
      versions: [{ id: 100, name: "2.0 XEI CVT" }],
      value: 25_000_000,
    };
    route.fulfill({ json: { data: map[action ?? ""] ?? [] } });
  });
}

async function fillAuto(page: Page, withVersion: boolean) {
  const cotizador = page.getByTestId("cotizador");
  await page.goto("/");
  await cotizador.scrollIntoViewIfNeeded();
  await cotizador.getByRole("button", { name: "Auto", exact: true }).click();
  await cotizador.getByRole("button", { name: "Siguiente" }).click();
  await cotizador.locator("select").nth(0).selectOption({ label: "Toyota" });
  await cotizador.locator("select").nth(1).selectOption("2022");
  await cotizador.locator("select").nth(2).selectOption({ label: "Corolla" });
  if (withVersion) {
    await cotizador.locator("select").nth(3).selectOption({ label: "2.0 XEI CVT" });
  }
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("gb-last-vehicle")))
    .toContain("Corolla");
}

// Vuelve como en una visita nueva (sessionStorage vacio) y retoma la cotizacion.
async function reenterAndResume(page: Page) {
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  const prompt = page.getByTestId("resume-prompt");
  await expect(prompt).toBeVisible({ timeout: 10_000 });
  await prompt.getByRole("button", { name: /Retomar/ }).click();
  return page.getByTestId("cotizador").locator("select");
}

test("retomar con el vehiculo completo restaura marca, año, modelo y version", async ({
  page,
}) => {
  await mockLookup(page);
  await fillAuto(page, true);
  const selects = await reenterAndResume(page);
  await expect(selects.nth(0).locator("option:checked")).toHaveText("Toyota");
  await expect(selects.nth(1).locator("option:checked")).toHaveText("2022");
  await expect(selects.nth(2).locator("option:checked")).toHaveText("Corolla");
  await expect(selects.nth(3).locator("option:checked")).toHaveText("2.0 XEI CVT");
});

test("se guarda y se retoma con solo la marca elegida", async ({ page }) => {
  await mockLookup(page);
  const cotizador = page.getByTestId("cotizador");
  await page.goto("/");
  await cotizador.scrollIntoViewIfNeeded();
  await cotizador.getByRole("button", { name: "Auto", exact: true }).click();
  await cotizador.getByRole("button", { name: "Siguiente" }).click();
  await cotizador.locator("select").nth(0).selectOption({ label: "Toyota" });
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("gb-last-vehicle")))
    .toContain("Toyota");
  const selects = await reenterAndResume(page);
  await expect(selects.nth(0).locator("option:checked")).toHaveText("Toyota");
});

test("retomar desde el comparador vuelve al paso 2, no al 1", async ({ page }) => {
  await mockLookup(page);
  await fillAuto(page, true);
  const cotizador = page.getByTestId("cotizador");
  await cotizador.getByPlaceholder("Ej: 3000").fill("3000");
  await cotizador.getByRole("button", { name: "Siguiente" }).click();
  await expect(cotizador.getByTestId("estimate-column")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("gb-last-vehicle")))
    .toContain('"step":2');

  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  const prompt = page.getByTestId("resume-prompt");
  await expect(prompt).toBeVisible({ timeout: 10_000 });
  await prompt.getByRole("button", { name: /Retomar/ }).click();
  await expect(cotizador.getByTestId("estimate-column")).toBeVisible();
});

test("retomar sin haber elegido la version restaura marca, año y modelo", async ({
  page,
}) => {
  await mockLookup(page);
  await fillAuto(page, false);
  const selects = await reenterAndResume(page);
  await expect(selects.nth(0).locator("option:checked")).toHaveText("Toyota");
  await expect(selects.nth(1).locator("option:checked")).toHaveText("2022");
  await expect(selects.nth(2).locator("option:checked")).toHaveText("Corolla");
});
