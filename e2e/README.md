# Tests del multicotizador

Corren con Playwright como runner (`pnpm test:e2e`). Cuatro archivos, de menos a
más dependencias:

| Archivo                     | Qué prueba                                                                                                                                                                                                        | Necesita            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `formula-prices.spec.ts`    | Precios de la **columna clásica** (`lib/pricing.ts`): valores de referencia, zona, franquicia, GNC, orden de coberturas.                                                                                          | nada (función pura) |
| `cotizador-ui.spec.ts`      | El paso 2 del flujo **Auto** muestra la estimación propia **+ una columna por aseguradora** (`PROVIDER_COLUMNS`: Sancor y Cooperación con sus marcas) y todas con precios. **Red mockeada** (sin DB ni catálogo). | `pnpm dev`          |
| `quote-api.spec.ts`         | `POST /api/quote` real con el `.env`: estructura de la respuesta de Sancor, validación del body, y precios si Sancor ya está operativo.                                                                           | `pnpm dev` + `.env` |
| `quote-cooperacion.spec.ts` | `POST /api/quote?provider=cooperacion` real con el `.env`: estructura de la respuesta de Cooperación (y precios si ya está operativo).                                                                            | `pnpm dev` + `.env` |

```bash
pnpm test:e2e                              # todo
pnpm test:e2e formula-prices               # solo la fórmula
pnpm test:e2e --reporter=list quote-api    # ver la respuesta de Sancor en consola
```

El `webServer` de Playwright levanta `next dev` en el puerto **3100**
(`E2E_PORT` / `E2E_BASE_URL` para cambiarlo) y reusa uno si ya está corriendo.

## Ver la respuesta cruda de las aseguradoras sin Next

```bash
pnpm sancor:smoke                          # genera el token con lo que haya en .env
pnpm sancor:smoke -- --vehicle-code 12345  # además pide una cotización

pnpm cooperacion:smoke                          # sólo genera el token
pnpm cooperacion:smoke -- --cmp 28571 --cp 2600 # + localidad + cotización
```

Imprimen lo que responde cada endpoint de auth y de cotización. Útil para
depurar credenciales / códigos. Ver [../docs/quote-providers.md](../docs/quote-providers.md).
