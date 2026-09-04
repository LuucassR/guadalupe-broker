# Proveedores de cotización del multicotizador

Capa enchufable para pedir cotizaciones **reales** a varias aseguradoras /
agregadores. Hoy el multicotizador ([components/shared/Cotizador.tsx](../components/shared/Cotizador.tsx))
solo calcula un estimado local con fórmula propia ([lib/pricing.ts](../lib/pricing.ts));
esta capa es el paso siguiente y convive con ese estimado.

Proveedores implementados: **Sancor Seguros** y **Cooperación Seguros** (ver
secciones al final). El núcleo (`types.ts`, `registry.ts`,
`app/api/quote/route.ts`) **no conoce ningún proveedor puntual**: agregar uno
nuevo no toca esos archivos.

## Flujo

```
Cotizador
  -> POST /api/quote            (body = QuoteInput)
  -> registry.quoteAll(input)   (o un solo proveedor con ?provider=<id>)
  -> cada QuoteProvider.quote() en paralelo
  -> ProviderQuoteResult[]      (un proveedor que falla no tumba a los demás)
```

## El contrato `QuoteProvider`

`lib/quote-providers/types.ts`:

| Miembro        | Qué hace                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------- |
| `id`           | slug único, ej. `"sancor"`                                                               |
| `name`         | nombre visible, ej. `"Sancor Seguros"`                                                   |
| `enabled()`    | `true` si están sus env vars (sin credenciales, el proveedor no aparece en la respuesta) |
| `quote(input)` | llama a la API del proveedor y devuelve `ProviderQuoteResult`                            |

**`QuoteInput`** (agnóstico de proveedor): `vehicleType`, `brand`, `model`,
`version?`, `year`, `vehicleValueARS`, `hasGnc`, `gncValueARS?`, `postalCode`,
`catalogVersionId?` (id estable de la versión del catálogo CCA elegida —
[lib/vehicle-valuation.ts](../lib/vehicle-valuation.ts)), `coverage?`,
`driversUnder25?`, `garageParking?`, `zeroKm?`, `trackingEquipment?`, y
`providerCodes?` — mapa de códigos de catálogo propios de cada proveedor ya
resueltos por quien llama, ej. `{ sancor: { vehicleCode: "12345", cityCode: 6700 } }`.

**Código de vehículo de cada proveedor** — casi toda aseguradora cotiza contra
su propio catálogo con ids propios.
[lib/quote-providers/vehicle-xref.ts](../lib/quote-providers/vehicle-xref.ts)
resuelve `catalogVersionId` → código del proveedor, con cache persistente
(`ProviderVehicleXref`) auto-poblado y correcciones manuales. Cada adapter
implementa sólo su `LiveResolver` (el walk de su catálogo); ver la sección de
Cooperación como ejemplo y `pnpm xref:report` para revisar matches dudosos.

**`QuotePlan`**: `planId`, `planName`, `coverage` (uno de nuestros 3 tiers o
`null`), `coverageRawName`, `monthlyPremium`, `totalPremium`, `insuredSumARS`,
`currency` (`"ARS"`), `notes?`.

**`ProviderQuoteResult`**: `providerId`, `providerName`, `ok`, `plans[]`,
`error?` (cuando `ok === false`), `raw?` (solo en dev; se descarta en prod).

## Agregar un proveedor nuevo

1. Crear `lib/quote-providers/<id>.ts` que exporte un `const <id>Provider: QuoteProvider`.
2. En `quote()`: mapear `QuoteInput` -> el request del proveedor, y su
   respuesta -> `QuotePlan[]`. Usar `matchCoverageTier(...)` de
   `lib/quote-providers/normalize.ts` para el campo `coverage`.
3. `enabled()` chequea sus env vars.
4. Si el proveedor pide un código de vehículo de su catálogo: implementar un
   `LiveResolver` y llamarlo vía `resolveProviderVehicleCode("<id>", ref, resolver)`
   de `lib/quote-providers/vehicle-xref.ts` — el cache/persistencia/reporte son
   compartidos.
5. Agregar `<id>Provider` al array `PROVIDERS` en `lib/quote-providers/registry.ts`
   (única línea de núcleo que cambia).
6. Declarar sus env vars con prefijo `<ID>_` en el `.env` local y documentarlas
   en la tabla de la sección de este documento.
7. Agregar una sección a este documento (endpoints, auth, mapeo, pendientes).
8. Si se muestra como columna en el Cotizador: sumar un item a
   `PROVIDER_COLUMNS` en [components/shared/ProviderQuoteColumn.tsx](../components/shared/ProviderQuoteColumn.tsx).

## Convención de env vars

- `<PROVIDER>_API_BASE_URL` — base del servicio.
- `<PROVIDER>_API_*` — credenciales (client id, token, etc.).
- El resto — configuración fija del broker (códigos de producto, productor…).
- Sin credenciales -> `enabled()` devuelve `false` -> el proveedor simplemente
  no se consulta ni aparece en `data`.

## Nota de producto

Los valores que devuelve esta capa siguen siendo **orientativos**: el asesor
confirma precio y cobertura exacta antes de emitir, igual que aclara
[components/shared/PriceComparison.tsx](../components/shared/PriceComparison.tsx).

---

## Sancor Seguros (`sancor`)

- **Ambiente**: PRE — `https://external-pre-api.gruposancorseguros.com/apissa/pre-catalog`
- **Endpoints**:
  - `POST {base}/v2/security/auth0/token` — genera el Bearer (TokenGenerator-V2)
  - `POST {base}/quotations/vehicle/automotive` — cotización
- **Contratos**: [sancor-automotores-1.0.0.json](specs/sancor-automotores-1.0.0.json) ·
  [sancor-tokengenerator-v2-1.0.0.json](specs/sancor-tokengenerator-v2-1.0.0.json)
- **Adapter**: [lib/quote-providers/sancor.ts](../lib/quote-providers/sancor.ts)

### Qué producto es

**"Automotive Policy Quotation"** = precio de pre-venta para un auto. **No** emite
póliza, **no** necesita un cliente ni un asegurado: el adapter nunca manda el
objeto `person`. Lo que identifica la cotización es el **vehículo** + zona +
producto. (La emisión real es otro producto aparte, "Automotive Policy Issuance",
que no usamos.) El **intermediario** que aparece en el contrato es el **código de
productor del broker**, no un cliente; y como no está en la lista `required`, se
manda solo si lo tenemos — si no, Sancor debería tomarlo del usuario del token.

### Alta en el portal (una sola vez)

Portal: `https://web-apic-portal.gruposancorseguros.com/apissa/pre-catalog/product`
(Manual de Usuario de Sancor — API Connect).

1. Crear cuenta / iniciar sesión.
2. **Aplicaciones -> Crear aplicación nueva** -> se generan **Clave** y **Secreto**.
   (Ya hecho: app "Guadalupe Broker Webpage".)
3. **Asignar plan** (Suscribirse con la app) a **dos** productos:
   - **"Automotive Policy Quotation 1.0.0"** (Default Plan, 100 llamadas/hora)
   - **"TokenGenerator-V2 1.0.0"**
     **Sin estas suscripciones la API responde 401 / 500.**
4. **Usuario + password del intermediario**: los crea la Compañía. Si no los
   tenés, pedirlos con un **SOLHDG** desde el Portal Intermediarios ->
   Módulo Contacto -> Herramientas de Gestión.

### Autenticación (2 piezas)

| Pieza            | De dónde sale             | Cómo viaja                                      | Env var                |
| ---------------- | ------------------------- | ----------------------------------------------- | ---------------------- |
| **Clave**        | portal, al crear la app   | header `gss_apiclient_id` (= `X-IBM-Client-Id`) | `SANCOR_API_CLIENT_ID` |
| **Bearer token** | el adapter lo genera solo | header `Authorization: Bearer <access_token>`   | — (ver abajo)          |

**El token lo genera el adapter** con `POST {base}/v2/security/auth0/token`
(TokenGenerator-V2). Body `{ username, password, app_client }` — `username`/`password`
son las credenciales del intermediario (`SANCOR_INTERMEDIARY_USER` /
`SANCOR_INTERMEDIARY_PASSWORD`), `app_client` es un "repositorio" de Sancor
(`SANCOR_APP_CLIENT`, default `"Ceibo"` — ver nota abajo). La respuesta trae
`access_token` + `expires_in`; se cachea en memoria del proceso y se renueva
1 min antes de vencer. `SANCOR_API_AUTH_TOKEN` permite pegar un Bearer a mano
(override para pruebas).

Verificado contra PRE con la Clave real: sin header `Authorization` la
cotización responde `400 "required API parameters are missing"`; con
`Authorization` inválido, `401 "OperationError"`. El **Secreto** no se usa en
ninguna de las dos llamadas (el adapter igual lo manda como
`gss_apiclient_secret`, inofensivo).

**Sobre `app_client`**: NO es el nombre de la app del portal — es un
"repositorio" del lado de Sancor. Probado contra PRE:
`app_client="Ceibo"` (el ejemplo del contrato) llega a Auth0 y responde
`403 invalid_grant "Usuario o contraseña incorrecta."`; cualquier otro valor
(p. ej. el nombre de la app) devuelve `500` del gateway. O sea el default del
adapter es `"Ceibo"` y falta confirmar con Sancor el **usuario/password del
intermediario correctos** (y si el repositorio es "Ceibo" u otro).

### Env vars

| Env var                        | Requerida             | Uso                                                                                           | Default                              |
| ------------------------------ | --------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------ |
| `SANCOR_API_CLIENT_ID`         | **sí**                | Clave -> headers de client id                                                                 | —                                    |
| `SANCOR_API_CLIENT_SECRET`     | no                    | Secreto -> `gss_apiclient_secret` (no lo pide la API)                                         | —                                    |
| `SANCOR_INTERMEDIARY_USER`     | **sí** (para cotizar) | body del token, `username`                                                                    | —                                    |
| `SANCOR_INTERMEDIARY_PASSWORD` | **sí** (para cotizar) | body del token, `password`                                                                    | —                                    |
| `SANCOR_APP_CLIENT`            | no                    | body del token, `app_client`                                                                  | `Ceibo`                              |
| `SANCOR_API_AUTH_TOKEN`        | no                    | Bearer pegado a mano (override)                                                               | —                                    |
| `SANCOR_PRODUCER_CODE`         | no                    | `intermediary.prodProducerCode` (si falta, se omite `intermediary`)                           | —                                    |
| `SANCOR_ORGANIZER_CODE`        | no                    | `intermediary.upperProducerCode`                                                              | —                                    |
| `SANCOR_PRODUCT_CODE`          | recomendada           | `productCode`                                                                                 | `24` (ejemplo del contrato)          |
| `SANCOR_COVER_MODULE_CODES`    | no                    | vacío = Sancor cotiza **todas** las coberturas; con lista (coma) filtra a esos `offeringCode` | vacío                                |
| `SANCOR_STATISTIC_CODE`        | no                    | `intermediary.statisticCode`                                                                  | —                                    |
| `SANCOR_CURRENCY_CODE`         | no                    | `currencyCode`                                                                                | `1` (ARS)                            |
| `SANCOR_API_BASE_URL`          | no                    | base del servicio                                                                             | host PRE                             |
| `SANCOR_TOKEN_URL`             | no                    | endpoint de TokenGenerator-V2                                                                 | `{BASE_URL}/v2/security/auth0/token` |

`enabled()` solo mira `SANCOR_API_CLIENT_ID`. `quote()` exige únicamente poder
generar el token (`SANCOR_INTERMEDIARY_USER` + `_PASSWORD`, o
`SANCOR_API_AUTH_TOKEN`) y un `vehicleCode`; si falta algo devuelve `ok:false`
explicándolo, sin romper el resto del batch. El resto lo dice la respuesta de
Sancor (422 con `messages[]`).

### Mapeo request (`QuoteInput` -> `vehicleQuotation.*`)

| `QuoteInput`                       | `vehicleQuotation`                                                    | Nota                                                                        |
| ---------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `providerCodes.sancor.vehicleCode` | `vehicle.vehicleCode`                                                 | **requerido**; si falta, el adapter devuelve `ok:false` sin llamar a la API |
| `providerCodes.sancor.cityCode`    | `zone.cityCode`                                                       | opcional                                                                    |
| `postalCode`                       | `zone.postalCode`                                                     | siempre                                                                     |
| `year`                             | `vehicle.vehicleYear`                                                 |                                                                             |
| `vehicleValueARS`                  | `vehicle.yearSuggestedValue`                                          |                                                                             |
| `hasGnc` / `gncValueARS`           | `vehicle.gncInformation.{hasGNC, accesoryInsuredSum}`                 |                                                                             |
| `trackingEquipment`                | `vehicle.vehicleTrackingEquipment`                                    | default `false`                                                             |
| `zeroKm`                           | `vehicle.zeroKM`                                                      | default `false`                                                             |
| `driversUnder25`                   | `driversUnder25`                                                      | solo si viene                                                               |
| `garageParking`                    | `garageParking`                                                       | solo si viene                                                               |
| —                                  | `vehicle.vehicleUseTypeCode`                                          | fijo `2` (Particular)                                                       |
| —                                  | `conditionCode`                                                       | fijo `4` (Consumidor Final)                                                 |
| —                                  | `policyVigencyCode` / `policyPaymentPeriodicityCode` / `policyQuotas` | fijo `1` / `5` / `1` (Anual, Mensual, 1 cuota)                              |
| —                                  | `policyPeriodStartEffectiveDate` / `...EndEffectiveDate`              | hoy / hoy + 1 año                                                           |

### Mapeo respuesta (`plans[]` -> `QuotePlan`)

| `QuotePlan`                    | Origen en `plans[i]`                                                     |
| ------------------------------ | ------------------------------------------------------------------------ |
| `planName` / `coverageRawName` | `module.coverageName` \|\| `module.coverageAbbreviatedName`              |
| `coverage`                     | `matchCoverageTier(module.coverageAbbreviatedName, module.coverageName)` |
| `monthlyPremium`               | `quotaPremiumMonthly` \|\| `premiumTotals.quotaAmount`                   |
| `totalPremium`                 | `premium` \|\| `premiumTotals.quotationPremium`                          |
| `insuredSumARS`                | `vehicleInsuredSum`                                                      |
| `notes`                        | `module.message` \|\| `module.observations`                              |

`204` -> `{ ok:true, plans:[] }`. non-2xx -> se lee `messages[].text` y se
propaga como `error`.

### Referencia de enums (del contrato)

- `identificationType`: `D` DNI · `C` LC · `L` LE · `I` CI · `J` CUIT
- `conditionCode`: `1` Resp. Inscripto · `2` Resp. No Inscripto · `3` Exento ·
  `4` Consumidor Final · `5` No Declarado · `6` No Alcanzado ·
  `7` Monotributo · `8` Sujeto No Categorizado
- `vehicleUseTypeCode`: `2` Particular · `4` Particular y/o Comercial ·
  `7` Transporte general rutero
- `policyVigencyCode`: `1` Anual · `2` Semestral · `3` Trimestral
- `policyPaymentPeriodicityCode`: `5` Mensual · `7` Cuotas
- `assistance.assistance`: `sa_02` · `sa1_plus` · `sa2_plus`
  (`assistanceProvider`: `ibero`) — no lo mandamos hoy

### Pendiente para producción

Bloqueantes del lado de Sancor (en orden):

1. ~~**Usuario + password del intermediario**~~ — **listo**. Con
   `SANCOR_INTERMEDIARY_USER=psales25433ws` (+ password) y `SANCOR_APP_CLIENT=Ceibo`
   el `POST /v2/security/auth0/token` devuelve `200` + `access_token`
   (24 h). El `id_token` confirma el usuario ("SALES EMILIANO",
   `psales25433ws@ProductorA.ceibo.sancorseguros.com`).
2. **Suscribir la app** "Guadalupe Broker Webpage" al plan de
   **"Automotive Policy Quotation 1.0.0"** en el portal. Hoy, con el token válido,
   `POST /quotations/vehicle/automotive` responde **`401 OperationError`** — el
   mismo síntoma que un Bearer inválido, o sea el gateway no reconoce la
   suscripción de ese producto para esta Clave. (El plan de TokenGenerator-V2 sí
   está suscripto: por eso el token sale.)

Con el token ya funcionando, el adapter no necesita cambios: falta la
suscripción del producto (2) y el `vehicleCode`.

Datos que faltan para que la cotización tenga sentido:

- **`vehicleCode`**: es lo único que identifica el auto. Es un código propio de
  Sancor (string), **no** los ids del catálogo CCA
  ([lib/vehicle-valuation.ts](../lib/vehicle-valuation.ts)). Cómo obtenerlo, en
  orden de probabilidad:
  1. Buscar en el portal (`.../apissa/pre-catalog/product`) un producto de API de
     **catálogo de vehículos** (la familia entera se llama `pre-catalog`).
     Suscribir la app y traer su contrato JSON.
  2. Pedírselo al contacto técnico de Sancor: "¿de dónde saco el `vehicleCode`
     de `/quotations/vehicle/automotive`?".
  3. Casi seguro es el **código Infoauto** (estándar de facto de las
     aseguradoras en AR). Si Sancor lo confirma: mapear vía la API de Infoauto o
     una lista licenciada, y agregar ese código al import del catálogo.
     Probado contra PRE: no hay endpoint de catálogo bajo `/apissa/pre-catalog`
     con nombres obvios (`/vehicles`, `/brands`, `/quotations/vehicle/brands`…
     todos 404). Mientras tanto: `pnpm sancor:smoke --vehicle-code <X>` prueba
     cualquier código candidato.
- **`productCode` real** del producto de auto (hoy default `24`, ejemplo del
  contrato). `coverModuleCodes` puede quedar vacío para traer todas las coberturas.
- **`cityCode`** (opcional): tabla `postalCode` -> ID de localidad de Sancor.
- **`prodProducerCode` / `upperProducerCode`** (opcional): si Sancor no los
  deriva del token, pedir los códigos de productor/organizador del broker.
- **Mapeo de planes**: confirmar qué `plan` de la respuesta equivale a cada uno
  de nuestros 3 tiers (`rc`, `terceros-completo`, `todo-riesgo`).

### graphify

`graphify update .` incorpora los `.ts` nuevos (solo AST, sin costo de API).
Para indexar también este documento hace falta un rebuild completo con
`graphify .`.

---

## Cooperación Seguros (`cooperacion`)

- **Ambiente**: `https://api.cooperacionseguros.com.ar` — **verificado** con las
  credenciales del broker (`ESALES`). El host `apipre.cooperacionseguros.com.ar`
  del PDF las rechaza con `401`: "PRE" es un nivel de acceso de la credencial,
  no un host distinto. `apitest.cooperacionseguros.com.ar` no resuelve DNS.
- **Endpoints** (todos bajo `{base}`):
  - `POST /token` — genera el Bearer (OAuth2 _client credentials_, body JSON
    `{ clientId, clientSecret }`)
  - `GET /Presupuesto/Vehiculo/Localidades` — CP → `idLocalidad`. **GET con body
    JSON** (`{ CodigoPostal: "3000", UsuarioId }`); `fetch`/undici no permiten
    GET con body, el adapter usa `node:https` para esta llamada.
  - `POST /Presupuesto/Vehiculo/Cotizar` — cotización. Body **plano** (sin
    wrapper); `CodigoPostal` va como **string**.
  - Catálogo (lo usa el `vehicle-xref`): `GET /Vehiculo/Tipos`,
    `GET /Vehiculo/Marcas?codigoTipoVehiculo=&marca=`, `…/Modelos?codigoMarca=&codigoTipoVehiculo=&modelo=`,
    `…/Versiones?CodigoTipoVehiculo=&CodigoMarca=&IdModelo=` — GET con
    **querystring** (no body), y bajo `/Vehiculo/*`, **no** `/Presupuesto/Vehiculo/*`.
    Respuesta envuelta en `{ entities: [...] }`.
- **Estado**: token + `/Localidades` + `/Cotizar` + cadena de catálogo
  **verificados de punta a punta** (CCA `TOYOTA/ETIOS/5P 1,5 X` → `vehicle-xref`
  → `codigoVehiculoCMP 19221` → 11 planes con `premioMensual`). Ver
  `pnpm cooperacion:smoke`, `pnpm xref:report` y `e2e/quote-cooperacion.spec.ts`.
- **Fuente**: PDF _API-Servicios_Cotizacion_Suscripcion_v1.4_ (Cooperación
  Seguros — "APIs Cooperación Seguros – Cotización y Suscripción de Vehículos").
- **Adapter**: [lib/quote-providers/cooperacion.ts](../lib/quote-providers/cooperacion.ts)

### Qué producto es

El endpoint **"Cotizar Vehículo"** = precio de pre-venta para un auto. **No**
emite póliza. El adapter manda `GrabarPresupuesto: false` (no reserva número de
presupuesto) y `CotizaAP: false` (no cotiza Accidentes a Pasajeros). La
suscripción / emisión del PDF (objeto `Persona` + `MedioPago` + `Cargar
Imágenes` + `.../Suscribir`) queda **fuera** de esta capa: necesita un tomador
real y no encaja en el contrato `QuoteProvider`.

Como es una cotización **sin cliente**, `RazonSocial` / `NroDocumento` / `Email`
—que el PDF marca como obligatorios— se completan con valores fijos del broker
(env vars con default).

### Autenticación

OAuth2 _client credentials_, más simple que Sancor: `POST {base}/token` con
`{ clientId, clientSecret }` → `{ access_token, expires_in, token_type }`. El
adapter cachea el token en memoria del proceso y lo renueva 1 min antes de
vencer. El resto de los servicios sólo llevan `Authorization: Bearer <token>`
(no hay headers de _client id_ tipo gateway como en Sancor).
`COOPERACION_API_AUTH_TOKEN` permite pegar un Bearer a mano (override de prueba).

### Env vars

| Env var                          | Requerida             | Uso                                             | Default                               |
| -------------------------------- | --------------------- | ----------------------------------------------- | ------------------------------------- |
| `COOPERACION_CLIENT_ID`          | **sí**                | body del token, `clientId`                      | —                                     |
| `COOPERACION_CLIENT_SECRET`      | **sí**                | body del token, `clientSecret`                  | —                                     |
| `COOPERACION_USUARIO_ID`         | **sí** (para cotizar) | `UsuarioId` (`pwNNNNNN`) en todos los servicios | —                                     |
| `COOPERACION_PRODUCER_CODE`      | **sí** (para cotizar) | `CodigoProductor`                               | —                                     |
| `COOPERACION_API_BASE_URL`       | no                    | base del servicio                               | `https://api.cooperacionseguros.com.ar` |
| `COOPERACION_TOKEN_URL`          | no                    | endpoint del token                              | `{BASE_URL}/token`                    |
| `COOPERACION_API_AUTH_TOKEN`     | no                    | Bearer pegado a mano (override)                 | —                                     |
| `COOPERACION_QUOTE_RAZON_SOCIAL` | no                    | `RazonSocial` de la cotización anónima          | `Consulta Web`                        |
| `COOPERACION_QUOTE_DOC`          | no                    | `NroDocumento` de la cotización anónima         | `11111111`                            |
| `COOPERACION_QUOTE_EMAIL`        | no                    | `Email` de la cotización anónima                | `cotizaciones@guadalupebroker.com.ar` |
| `COOPERACION_CONDITION_CODE`     | no                    | `CondicionFiscal`                               | `5` (Consumidor Final)                |
| `COOPERACION_USE_CODE`           | no                    | `CodigoUso`                                     | `1` (Particular)                      |

`enabled()` sólo mira `COOPERACION_CLIENT_ID` + `COOPERACION_CLIENT_SECRET`.
`quote()` además exige `COOPERACION_USUARIO_ID`, `COOPERACION_PRODUCER_CODE`,
poder identificar el vehículo (ver **Resolución del código de vehículo** abajo) y
poder resolver `idLocalidad`; si falta algo devuelve `ok:false` explicándolo, sin
romper el resto del batch.

### Resolución del código de vehículo (`vehicle-xref`)

`Cotizar` necesita un `CodigoVehiculoCMP` (o `CodigoInfoAuto`) del catálogo de
Cooperación. El adapter lo obtiene en este orden:

1. **Override**: `providerCodes.cooperacion.codigoVehiculoCMP` / `codigoInfoAuto`
   si vienen en la request (escape hatch para pruebas o correcciones puntuales).
2. **Cross-reference persistente** a partir de `QuoteInput.catalogVersionId` (el
   id estable de la versión del catálogo CCA que eligió el usuario). Lo maneja
   [lib/quote-providers/vehicle-xref.ts](../lib/quote-providers/vehicle-xref.ts),
   común a todos los proveedores:
   - busca la fila `(providerId, ccaVersionId)` en `ProviderVehicleXref`;
   - si no está, corre el _liveResolver_ de Cooperación — cadena
     `GET /Vehiculo/Tipos → /Marcas → /Modelos → /Versiones` (querystring, bajo
     `/Vehiculo/*`), matcheando marca/modelo por texto normalizado y la versión
     por solapamiento de tokens (`"5P 1,5 XS"` ↔ `"ETIOS 1.5 5 PTAS XS"`);
   - guarda el resultado (código + `confidence` 0-100, o `code=null` si no
     matcheó) y lo devuelve. El `null` se cachea y se reintenta a los 30 días.
   - Filas con `source = "manual"` (las corrige un operador) nunca se pisan.
   - `pnpm xref:report` lista las filas sin match o de baja confianza.

Cada proveedor nuevo que necesite un código de catálogo implementa sólo su
_liveResolver_; el cache/persistencia/override/reporte son compartidos.

### Mapeo request (`QuoteInput` → `Cotizar`)

| `QuoteInput`                                  | `Cotizar`                                                                  | Nota                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `catalogVersionId`                            | `CodigoVehiculoCMP` (vía `vehicle-xref`)                                   | **requerido** salvo que venga un override; resuelto contra el catálogo de Cooperación |
| `providerCodes.cooperacion.codigoVehiculoCMP` | `CodigoVehiculoCMP`                                                        | override directo (uno de los dos); salta el `vehicle-xref`                          |
| `providerCodes.cooperacion.codigoInfoAuto`    | `CodigoInfoAuto`                                                           | override alternativo al CMP — "enviar uno u otro pero nunca ambos"                 |
| `providerCodes.cooperacion.idLocalidad`       | `IdLocalidad`                                                              | opcional; si falta, el adapter lo resuelve con `/Localidades` a partir del CP      |
| `providerCodes.cooperacion.codigoGnc`         | `CodigoGnc`                                                                | opcional; default `0`                                                              |
| `postalCode`                                  | `CodigoPostal` + input de `/Localidades`                                   |                                                                                    |
| `year`                                        | `Anio`                                                                     |                                                                                    |
| `vehicleValueARS`                             | `ValorVehiculo` (**sólo en el reintento**)                                 | ver abajo — destraba las coberturas cuando Cooperación no tiene valor propio        |
| `hasGnc`                                      | `PoseeGNC` + `CodigoGnc`                                                    | si `hasGnc`, se resuelve un código real de `GET /Presupuesto/Vehiculo/Gnc` (default 2da Gen). `PoseeGNC:true` + `CodigoGnc:0` → Cooperación rechaza todo (_"codigo de GNC Incorrecto"_); si no se puede resolver, se cotiza sin GNC. |
| —                                             | `NroDocumento` / `RazonSocial` / `Email` / `CodigoProductor` / `UsuarioId` | de las env vars                                                                    |
| —                                             | `CondicionFiscal` / `CodigoUso`                                            | env vars (`5` / `1`)                                                               |
| —                                             | `Categoria`                                                                | fijo `0` ("colocar 0 por el momento")                                              |
| —                                             | `CantidadMeses`                                                            | fijo `4` (obligatorio — facturación cuatrimestral)                                 |
| —                                             | `CotizaAP` / `GrabarPresupuesto`                                           | fijo `false`                                                                       |
| —                                             | `AplicarMaxDescuentos`                                                     | fijo `true`                                                                        |

### `ValorVehiculo` y el reintento

Para muchos vehículos Cooperación **no tiene valor propio** para el
`CodigoVehiculoCMP` + año que resolvimos: responde `valorVehiculo: 0` y **sólo
el plan `A` (RC)**. El adapter maneja esto con dos llamadas a `Cotizar`:

1. **Sin `ValorVehiculo`** — Cooperación usa su tabla. Si trae ≥ 2 planes (o
   alguno con `valorVehiculo > 0`), listo.
2. Si el paso 1 trajo sólo RC sin valor, **reintenta con
   `ValorVehiculo = input.vehicleValueARS`** (nuestro valor CCA/DNRPA) para
   destrabar el abanico de coberturas. Si el reintento falla (p.ej. Cooperación
   rechaza con _"La suma ingresada es superior al máximo permitido"_ porque
   nuestro valor difiere mucho del suyo), se queda con lo del paso 1.

El PDF marca `ValorVehiculo` como "Deprecado", pero en la práctica es lo único
que habilita B/C/D/… cuando su valuación interna es 0. Enviarlo siempre sería
peor: rompe las cotizaciones donde Cooperación sí sabe el valor.

### Mapeo respuesta (`cotizacionesAutomotor[]` → `QuotePlan`)

| `QuotePlan`                               | Origen en `cotizacionesAutomotor[i]`                             |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `planId` / `planName` / `coverageRawName` | `planCobertura` / `detalleCobertura`                             |
| `coverage`                                | `matchCoverageTier(planCobertura, detalleCobertura)`             |
| `monthlyPremium`                          | `premioMensual`                                                  |
| `totalPremium`                            | `premio` (**cuatrimestral**, 4 meses — no anual)                 |
| `insuredSumARS`                           | `valorVehiculo`                                                  |
| `notes`                                   | `"Premio cuatrimestral (4 meses)"` + franquicia / grúa si aplica |

Las claves se leen en los dos casings que muestra el PDF (tabla vs. ejemplo:
`planCobertura` / `plancobertura`). `204` → `{ ok:true, plans:[] }`. non-2xx →
se lee `mensaje` y se propaga como `error`.

### Referencia de enums (del PDF, "Tablas Asociadas")

- `CodigoUso`: `1` Particular · `2` Remis · `3` Taxi · `4` Comercial · `10` Rural · `23` Vehículo de alquiler …
- `CondicionFiscal`: `1` Monotributista · `2` IVA Resp. Inscripto · `5` Consumidor Final
- `CantidadMeses`: sólo `4` (cuatrimestral)

### Pendiente para producción

- ~~Credenciales OAuth2~~ — **listo** (`ESALES` en `.env` / `.env.local`, host
  `api.cooperacionseguros.com.ar`).
- ~~`UsuarioId` + `CodigoProductor`~~ — `COOPERACION_USUARIO_ID=PW214147`.
  **`COOPERACION_PRODUCER_CODE=214147` es un supuesto** (los dígitos del
  `UsuarioId`; PAS: Emiliano Sales) — confirmar el código de productor real con
  Cooperación. Con `214147` la cotización devuelve planes sin error.
- ~~**`CodigoVehiculoCMP` / `CodigoInfoAuto`**~~ — **listo**: lo resuelve el
  `vehicle-xref` (ver sección arriba) a partir de `catalogVersionId`, contra la
  cadena de catálogo de Cooperación, con cache persistente en
  `ProviderVehicleXref`. Verificado de punta a punta (CCA `TOYOTA/ETIOS/5P 1,5 X`
  → `codigoVehiculoCMP 19221`, `confidence` 100 → 11 planes). **Falta afinar la
  heurística de match de la versión** para el resto del catálogo (correr
  `pnpm xref:report` y cargar `source:"manual"` las que salgan sin match o con
  `confidence` baja).
- **`NroDocumento` anónimo**: confirmar si Cooperación valida el DNI de la
  cotización o acepta el placeholder (`COOPERACION_QUOTE_DOC`).
- **Mapeo de planes**: confirmar qué `planCobertura` (`A` / `B` / `B1` / …)
  equivale a cada uno de nuestros 3 tiers (`rc`, `terceros-completo`,
  `todo-riesgo`) — `matchCoverageTier` hoy es best-effort sobre el texto.
  (`9100011` sólo devuelve `A`/`B`/`B1`; un auto más nuevo puede traer más.)
- **`idLocalidad`**: el adapter toma la primera localidad que devuelve
  `/Localidades` para el CP; si hay varias (CP 3000 devuelve ~20), elegir la
  correcta.

### Debug sin Next

```bash
pnpm cooperacion:smoke                                  # sólo genera el token
pnpm cooperacion:smoke -- --cmp 28571 --cp 2600 --year 2022   # + localidad + cotización
pnpm cooperacion:smoke -- --infoauto 9100011 --cp 5000
```

[scripts/cooperacion-smoke.mjs](../scripts/cooperacion-smoke.mjs) — lee `.env`,
imprime crudo lo que responde cada endpoint.
