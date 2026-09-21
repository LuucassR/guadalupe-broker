import { readFile } from "node:fs/promises";
import path from "node:path";
import { getAdminUser } from "@/lib/admin/session";

// Logo y firma de la propuesta viven en /assets (no en /public) para que solo se
// sirvan con sesion de admin. proxy.ts solo mira que exista la cookie, asi que
// la sesion se valida aca (los route handlers no pasan por el layout del panel).
const FILES: Record<string, string> = {
  "sancor-logo.png": path.join(process.cwd(), "assets/admin/sancor-logo.png"),
  "firma-gerente-general.png": path.join(
    process.cwd(),
    "assets/admin/firma-gerente-general.png",
  ),
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  if (!(await getAdminUser())) return new Response("Unauthorized", { status: 401 });

  const { file } = await params;
  const filePath = Object.hasOwn(FILES, file) ? FILES[file] : null;
  if (!filePath) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(await readFile(filePath)), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
