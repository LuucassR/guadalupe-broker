// Crea (o actualiza) el superusuario del panel /admin.
//   ADMIN_EMAIL=... [ADMIN_PASSWORD=...] [ADMIN_NAME=...] pnpm admin:seed
// Sin ADMIN_PASSWORD genera una al azar y la imprime UNA vez. Si el usuario ya
// existe, solo se pisa la clave con --reset-password.
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/admin/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error("Falta ADMIN_EMAIL");
  const name = process.env.ADMIN_NAME?.trim() || "Superusuario";
  const reset = process.argv.includes("--reset-password");

  let password = process.env.ADMIN_PASSWORD;
  if (password && password.length < 12) throw new Error("ADMIN_PASSWORD: minimo 12 caracteres");
  const generated = !password;
  password ??= randomBytes(18).toString("base64url");

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    await prisma.adminUser.update({
      where: { email },
      data: {
        role: "SUPERUSER",
        permissions: ["*"],
        active: true,
        ...(reset ? { passwordHash: await hashPassword(password), failedAttempts: 0, lockedUntil: null } : {}),
      },
    });
    console.log(`Usuario ${email} ya existia: rol SUPERUSER asegurado.`);
    if (!reset) return;
  } else {
    await prisma.adminUser.create({
      data: {
        email,
        name,
        passwordHash: await hashPassword(password),
        role: "SUPERUSER",
        permissions: ["*"],
      },
    });
    console.log(`Superusuario ${email} creado.`);
  }
  if (generated) console.log(`Clave generada (no se vuelve a mostrar): ${password}`);
}

main().finally(() => prisma.$disconnect());
