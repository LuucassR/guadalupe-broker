# Admin: generador de propuestas

`/admin/propuestas` arma la propuesta (hoja carta, una página) completando un
formulario y muestra la hoja en tiempo real al lado. El PDF sale con
**"Imprimir / Guardar PDF"** del navegador (`@page { size: letter; margin: 0 }`).
Imita la primera página de la póliza RC de Sancor: mismas posiciones, tipografía
(Arial) y elementos fijos (logo, caja lateral con el 0800, "Emisión", VIGENCIA,
firma del Gerente General).

## Acceso

Vive dentro del panel `/admin` (sección **Documentos → Propuestas** del menú
lateral) y usa el mismo login que el resto: usuario + contraseña en la base
(`AdminUser`, sesión `gb_admin_session`). [proxy.ts](../proxy.ts) solo corta si
no hay cookie; la validación real la hace `requireAdmin()` en
`app/admin/(panel)/layout.tsx`. Cualquier usuario del panel puede armar
propuestas (no hay permiso específico). Para crear usuarios: `pnpm admin:seed`.

## Cómo está armado

| Archivo                                                                       | Qué hace                                                                                                               |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [lib/proposal.ts](../lib/proposal.ts)                                         | Modelo de datos (`Proposal`), valores vacíos y tamaño de la hoja.                                                      |
| [components/admin/ProposalEditor.tsx](../components/admin/ProposalEditor.tsx) | Formulario + preview. Cada texto tiene negrita / cursiva / subrayado; las listas suman viñeta y agregar/quitar líneas. |
| [components/admin/ProposalSheet.tsx](../components/admin/ProposalSheet.tsx)   | La hoja. Medidas sacadas del PDF original; cada sección tiene alto mínimo para que en blanco quede como el formulario. |
| `app/admin/assets/[file]/route.ts`                                            | Sirve el logo y la firma desde `assets/admin/` (fuera de `public/`), solo con sesión válida (`getAdminUser()`).            |

- Las secciones crecen si hay más contenido; una línea roja punteada en el
  preview marca el fin de la hoja carta (lo que pase va a una 2ª página al imprimir).
- El nombre de archivo que propone el navegador es `Propuesta <número>`.
- "Número de propuesta" reemplaza a "Póliza nro." / "Ref."; se quitaron los datos
  internos de la aseguradora (asociado, org/prod/zona, "Emitida en Sunchales" y
  el texto legal del pie), como en el formulario en blanco.

## Limitaciones conocidas

- No se guarda nada: si se recarga la página se pierde lo cargado (el PDF es el
  resultado).
- Los tamaños de letra son fijos por sección (en el original algunas líneas de
  "Clientes adicionales" son más chicas).

## Tests

`E2E_ADMIN_EMAIL=... E2E_ADMIN_PASSWORD=... pnpm test:e2e admin-proposal` —
login/gate, vista en vivo, formato y PDF de una hoja carta (los tests con sesión
se saltean sin esas variables y necesitan la DB). Ver [../e2e/README.md](../e2e/README.md).
