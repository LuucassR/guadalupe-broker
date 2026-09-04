# Valuacion de autos del multicotizador

## Que hay hoy (nivel gratis)

Arg Autos (la API que se usaba antes) tenia un limite de 3 pedidos/min sin
key, y una cotizacion completa dispara 4 llamados seguidos (marcas, modelos,
versiones, valor) - se agotaba con un solo usuario. Se reemplazo por un
catalogo propio:

1. **`scripts/import-cca-catalog.ts`** descarga la Lista de Precios oficial de
   la CCA (Camara del Comercio Automotor, `cca.org.ar`) en PDF, la parsea y
   guarda el resultado en la tabla `VehicleCatalogCache` (marca -> modelo ->
   versión -> precio en USD por año-modelo).
2. **`.github/workflows/import-cca-catalog.yml`** corre ese script una vez por
   mes (dia 2, 06:00 UTC) via GitHub Actions - gratis, y no depende de donde
   este deployada la app. Para que funcione hay que cargar `DATABASE_URL` como
   secret del repo (Settings → Secrets and variables → Actions → New repository
   secret) - sin eso el workflow corre pero no tiene a donde escribir.
3. **`lib/vehicle-valuation.ts`** lee ese catalogo (nunca llama a un servicio
   externo por cada cotizacion) y convierte el precio USD a ARS con la
   cotizacion oficial del dia (Bluelytics, cacheada 1 hora).

Costo: US$0/mes. Sin límite de pedidos - el catálogo vive en la base de datos
que ya tenía la app.

### Puesta en marcha (una sola vez)

Se agregó el modelo `VehicleCatalogCache` a `prisma/schema.prisma`. Este
proyecto sincroniza el esquema con `db push` (no hay carpeta
`prisma/migrations`), así que para crear la tabla en la base real:

```bash
pnpm install          # trae tsx, que quedó declarado en package.json
npx prisma db push    # crea VehicleCatalogCache en la base
pnpm import:cca        # primera carga del catalogo
```

### Como correrlo a mano (después de la primera vez)

```bash
pnpm import:cca
```

Requiere `pdftotext` instalado (paquete `poppler-utils`) y `DATABASE_URL`
apuntando a la base real. Corrélo una vez ahora para poblar el catálogo por
primera vez - sin eso, `fetchVehicleBrands()` tira el error
"Todavia no se importo el catalogo de autos".

## Autos anteriores a 2012 (DNRPA)

La Lista de la CCA solo trae año-modelo 2012+. Para autos más viejos (2002 a
2011) usamos la **Tabla de Valuación de Automotores de la DNRPA**, la fuente
oficial y gratuita de valor fiscal (`dnrpa.gov.ar/valuacion`).

1. **`scripts/import-dnrpa-catalog.ts`** descarga el PDF vigente
   (`informacion/01-MM-AAAA.pdf`), lo parsea y guarda el resultado en
   `VehicleCatalogCache` bajo la key **`dnrpa:catalog`** (marca -> "modelo"
   -> valor **en ARS** por año-modelo; el PDF ya viene en pesos, sin
   conversión). El catálogo DNRPA no tiene nivel "versión": la descripción de
   modelo ya es esa granularidad.
2. **`.github/workflows/import-dnrpa-catalog.yml`** lo corre el día 3 de cada
   mes (mismo `DATABASE_URL` secret que la CCA).
3. **`lib/vehicle-valuation.ts`** enruta por año: `isLegacyYear(year)` (2002-2011)
   pega al catálogo DNRPA, el resto a la CCA. `fetchVehicleBrands()` devuelve
   la **unión** de marcas de los dos catálogos. El front (`Cotizador.tsx`)
   saltea el paso de versión para años legacy y rotula el número como
   **"valor fiscal de referencia (DNRPA)"**.

```bash
npx prisma db push     # (ya existe VehicleCatalogCache; no hay tabla nueva)
pnpm import:dnrpa       # primera carga del catálogo DNRPA
```

Contra el PDF de agosto 2026: 55 marcas / ~8.500 modelos, ~1.300 filas
descartadas por ambiguas. El script aborta sin pisar el catálogo viejo si un
mes viene con menos de 40 marcas o 3.000 modelos.

**Ojo**: es un valor **fiscal**, típicamente 40-60% por debajo del valor de
mercado. Sirve como referencia orientativa; el asesor confirma. No se hace
gross-up a mercado para no falsear el rótulo.

### Limitaciones conocidas (léelas antes de confiar el número a un cliente)

- **Cobertura de años**: la CCA trae 2012+ y la DNRPA 2002-2011. Autos
  anteriores a 2002 no se cotizan online — el front los manda por "no
  encuentro mi auto" (cotización manual con un asesor).
- **Parser de PDF, no API**: el importador reconstruye la tabla por posición
  de columnas con una heurística (ver comentarios en el script). Contra el
  PDF de agosto 2026 parseó 65 marcas / 660 modelos / ~6.000 versiones con
  solo 12 filas ambiguas descartadas (no inventadas) - buena cobertura, pero
  no es infalible si la CCA cambia el formato del documento. El script aborta
  sin pisar el catálogo viejo si un mes viene con menos de 30 marcas o 3.000
  versiones (probable cambio de formato).
- **Precios en USD**: el PDF cotiza en dólares; la conversión a ARS depende de
  que Bluelytics esté arriba. Si Bluelytics falla y no hay nada cacheado,
  `fetchVehicleValueARS` tira error en vez de devolver un número inventado.
- **Sin respaldo de mercado en vivo**: se evaluó usar la API de Mercado Libre
  como fallback para gaps de cobertura, pero su endpoint de búsqueda pública
  ahora devuelve 403 sin token - requeriría registrar una app y manejar
  OAuth. Se dejó afuera de este nivel por simplicidad; ver "Subir de nivel"
  si hace falta.

## Subir de nivel más adelante

El contrato entre `lib/vehicle-valuation.ts` y el resto de la app
(`fetchVehicleBrands`, `fetchVehicleModels`, `fetchVehicleVersions`,
`fetchVehicleValueARS`) no cambia en ningún escenario de abajo - el único
archivo que se toca es el que puebla `VehicleCatalogCache`.

- **Bajo costo** (mover a infra propia, mismos datos): no cambia código.
  Solo hosting (Railway, un droplet, etc.) y correr el mismo
  `pnpm import:cca` ahí o seguir con GitHub Actions apuntando a la nueva
  `DATABASE_URL`.
- **Medio costo** (mejor fuente de datos - Infoauto): escribir un
  `scripts/import-infoauto-catalog.ts` que llame a su Web Service en vez de
  parsear el PDF de la CCA, pero que escriba el mismo shape en
  `VehicleCatalogCache` bajo la key `cca:catalog` (o migrar la key si se
  quiere correr las dos fuentes en paralelo un tiempo). `lib/vehicle-valuation.ts`
  no necesita cambios. Infoauto también daría **histórico** (reemplazando el
  parche DNRPA para <2012) y el **código Infoauto (codia)** por versión, que
  sirve para mapear a los códigos de las aseguradoras — ver la lista de qué
  pedirles en la conversación con Claude / `docs/quote-providers.md`.
- **Alto costo** (cotizaciones reales por aseguradora): esto ya no es "otra
  fuente de valuación de auto", es reemplazar `lib/pricing.ts` (que hoy
  calcula la prima con una fórmula propia) por integraciones en vivo con cada
  aseguradora. Es una decisión de producto aparte, no un cambio de este
  módulo.

Contexto completo de la comparación de costos (con precios reales donde
existen públicos): ver el documento "Escenarios de presupuesto para el
multicotizador, sin Arg Autos" compartido en la conversación con Claude.
