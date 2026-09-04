import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.E2E_PORT || "3100";
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

// E2E reales contra la app corriendo (pnpm dev). Requisitos:
//  - .env con DATABASE_URL valido y el catalogo CCA importado (pnpm import:cca)
//  - opcional: credenciales SANCOR_* para que la columna de Sancor traiga precios;
//    sin ellas la columna muestra su estado "no disponible" y el test lo acepta.
// Ver e2e/README.md.
export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    actionTimeout: 15_000,
  },
  webServer: {
    // Puerto propio para no chocar con otros dev servers en :3000.
    command: `pnpm exec next dev --port ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
