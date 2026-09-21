import { test, expect, type Page } from "@playwright/test";

// /admin/propuestas: el login protege todo /admin, el formulario actualiza la
// hoja en vivo, los botones de formato se reflejan en la hoja y el PDF sale en
// una sola hoja carta. El login es el del panel (usuario en la DB): hay que
// pasar E2E_ADMIN_EMAIL y E2E_ADMIN_PASSWORD, si no los tests con sesión se saltean.

const EMAIL = process.env.E2E_ADMIN_EMAIL;
const PASSWORD = process.env.E2E_ADMIN_PASSWORD;

async function login(page: Page) {
  test.skip(!EMAIL || !PASSWORD, "faltan E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD");
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(EMAIL!);
  await page.getByLabel("Contraseña", { exact: true }).fill(PASSWORD!);
  await page.getByRole("button", { name: "Ingresar al panel" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/propuestas");
}

test("sin sesión, /admin y sus assets redirigen al login", async ({
  page,
  request,
}) => {
  await page.goto("/admin/propuestas");
  await expect(page).toHaveURL(/\/admin\/login$/);

  const asset = await request.get("/admin/assets/firma-gerente-general.png", {
    maxRedirects: 0,
  });
  expect(asset.status()).toBe(307);
  expect(asset.headers()["location"]).toContain("/admin/login");
});

test("los campos se ven en la hoja en tiempo real, con formato", async ({
  page,
}) => {
  await login(page);
  const sheet = page.getByTestId("proposal-preview");
  // exact: "Cobertura 1" / "Cuota 1" tambien son substring de "Quitar ... 1".
  const field = (label: string) => page.getByLabel(label, { exact: true });

  await field("Rama").fill("Responsabilidad Civil");
  await field("Número de propuesta").fill("PR-1234");
  await field("Vigencia desde").fill("las 12 hs 1/1/2027");
  await field("Nombre y apellido").fill("PEREZ JUAN");
  await field("Domicilio").fill("Calle Falsa 123");
  await field("DNI").fill("30111222");
  await field("Ubicación del riesgo, línea 1").fill("Santa Fe (Santa Fe)");
  await field("Cobertura 1").fill("Comprensiva");
  await field("Suma asegurada 1").fill("$ 500.000,00");
  await field("Recibo 1").fill("515606802");
  await field("Importe 1").fill("$ 2.775,00");
  await field("Cuota 1").fill("1");
  await field("Vencimiento 1").fill("20/04/2027");

  for (const text of [
    "Responsabilidad Civil",
    "Número de propuesta: PR-1234",
    "Desde las 12 hs 1/1/2027",
    "PEREZ JUAN",
    "Domicilio: Calle Falsa 123",
    "DNI: 30111222",
    "Santa Fe (Santa Fe)",
    "• Comprensiva",
    "$ 500.000,00",
    "515606802",
    "20/04/2027",
    "ALEJANDRO SIMON",
  ]) {
    await expect(sheet).toContainText(text);
  }
  // El título reemplaza al "Rama:" fijo: no debe quedar el rótulo.
  await expect(sheet).not.toContainText("Rama:");

  // Formato: negrita + cursiva + subrayado + viñeta en una línea de anexos.
  const anexo = field("Anexos y cláusulas, línea 1");
  await anexo.fill("1 (Condiciones Generales)");
  const anexoRow = anexo.locator(
    "xpath=ancestor::div[contains(@class,'flex')][1]",
  );
  await anexoRow.getByRole("button", { name: "Negrita" }).click();
  await anexoRow.getByRole("button", { name: "Cursiva" }).click();
  await anexoRow.getByRole("button", { name: "Subrayado" }).click();
  await anexoRow.getByRole("button", { name: "Viñeta" }).click();

  const line = sheet.getByText("1 (Condiciones Generales)");
  await expect(line).toContainText("• 1 (Condiciones Generales)");
  await expect(line).toHaveCSS("font-weight", "700");
  await expect(line).toHaveCSS("font-style", "italic");
  await expect(line).toHaveCSS("text-decoration-line", "underline");

  // Filas repetibles: agregar y quitar cuotas del plan de pago.
  await page.getByRole("button", { name: "Agregar cuota" }).click();
  await field("Recibo 2").fill("516140526");
  await expect(sheet).toContainText("516140526");
  await page.getByRole("button", { name: "Quitar cuota 2" }).click();
  await expect(sheet).not.toContainText("516140526");
});

test("el PDF sale en una sola hoja carta", async ({ page }) => {
  await login(page);
  await page
    .getByLabel("Nombre y apellido", { exact: true })
    .fill("PEREZ JUAN");

  const pdf = (await page.pdf({ preferCSSPageSize: true })).toString("latin1");
  const pages = pdf.match(/\/Type\s*\/Page[^s]/g) ?? [];
  expect(pages).toHaveLength(1);
  expect(pdf).toMatch(/\/MediaBox\s*\[\s*0\s+0\s+612\s+792\s*\]/);
});
