// Crea los roles de Postgres con privilegios acotados (idempotente):
//   broker_admin_app  LOGIN, SELECT/INSERT/UPDATE/DELETE en todas las tablas, sin DDL
//   broker_readonly   LOGIN, SELECT en todas las tablas menos AdminUser/AdminSession
// Ninguno es superusuario ni puede crear roles/bases. Las claves vienen de
// DB_ADMIN_APP_PASSWORD / DB_READONLY_PASSWORD o se generan y se imprimen una vez.
// Uso: pnpm db:roles   (corre con el DATABASE_URL del duenio de la base)
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const lit = (s: string) => `'${s.replace(/'/g, "''")}'`;

async function upsertRole(name: string, password: string) {
  const exists = await prisma.$queryRawUnsafe<{ n: number }[]>(
    `SELECT 1 AS n FROM pg_roles WHERE rolname = ${lit(name)}`,
  );
  const verb = exists.length ? "ALTER" : "CREATE";
  await prisma.$executeRawUnsafe(
    `${verb} ROLE ${name} WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION PASSWORD ${lit(password)}`,
  );
}

async function main() {
  const [{ db, owner }] = await prisma.$queryRaw<{ db: string; owner: string }[]>`
    SELECT current_database() AS db, current_user AS owner`;
  const appPass = process.env.DB_ADMIN_APP_PASSWORD ?? randomBytes(24).toString("base64url");
  const roPass = process.env.DB_READONLY_PASSWORD ?? randomBytes(24).toString("base64url");

  await upsertRole("broker_admin_app", appPass);
  await upsertRole("broker_readonly", roPass);

  const stmts = [
    `GRANT CONNECT ON DATABASE "${db}" TO broker_admin_app, broker_readonly`,
    `GRANT USAGE ON SCHEMA public TO broker_admin_app, broker_readonly`,
    `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO broker_admin_app`,
    `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO broker_admin_app`,
    `GRANT SELECT ON ALL TABLES IN SCHEMA public TO broker_readonly`,
    `REVOKE ALL ON "AdminUser", "AdminSession" FROM broker_readonly`,
    // Tablas que se creen despues heredan los mismos privilegios.
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${owner} IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO broker_admin_app`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${owner} IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO broker_admin_app`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${owner} IN SCHEMA public GRANT SELECT ON TABLES TO broker_readonly`,
  ];
  for (const s of stmts) await prisma.$executeRawUnsafe(s);

  console.log("Roles listos: broker_admin_app, broker_readonly");
  if (!process.env.DB_ADMIN_APP_PASSWORD) console.log(`  broker_admin_app clave: ${appPass}`);
  if (!process.env.DB_READONLY_PASSWORD) console.log(`  broker_readonly  clave: ${roPass}`);
  console.log("(las claves generadas no se vuelven a mostrar)");
}

main().finally(() => prisma.$disconnect());
