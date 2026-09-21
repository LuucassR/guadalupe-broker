import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Chequeo optimista: sin cookie de sesion no se llega a ninguna pagina del
// panel. La validacion real (token vigente en la DB) la hace requireAdmin() en
// app/admin/(panel)/layout.tsx.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("gb_admin_session");

  if (!hasSession && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: "/admin/:path*" };
