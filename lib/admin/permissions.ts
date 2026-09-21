export const ROLES = ["SUPERUSER", "ADMIN", "VIEWER"] as const;
export type AdminRole = (typeof ROLES)[number];

export const PERMISSIONS = [
  "consults:read",
  "consults:export",
  "users:manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

// El superusuario tiene todos los privilegios (incluidos los que se agreguen
// despues); el resto solo lo que figure en `permissions`.
export function can(
  user: { role: string; permissions: string[] },
  permission: Permission,
): boolean {
  return user.role === "SUPERUSER" || user.permissions.includes(permission);
}
