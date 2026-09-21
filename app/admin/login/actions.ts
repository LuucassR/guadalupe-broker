"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DUMMY_HASH, verifyPassword } from "@/lib/admin/password";
import { createSession } from "@/lib/admin/session";

export interface LoginState {
  error?: string;
  // React 19 vacia los campos tras una accion de formulario: se devuelve el
  // email para no obligar a reescribirlo despues de un error.
  email?: string;
}

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const BAD_CREDENTIALS = "Email o contraseña incorrectos.";

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: BAD_CREDENTIALS, email };

  const user = await prisma.adminUser.findUnique({ where: { email } });

  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    const mins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return { error: `Demasiados intentos fallidos. Probá de nuevo en ${mins} min.`, email };
  }

  // Se verifica siempre (con un hash de relleno si el email no existe) para que
  // el tiempo de respuesta no revele si la cuenta existe.
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !user.active || !valid) {
    if (user) {
      const attempts = user.failedAttempts + 1;
      const lock = attempts >= MAX_ATTEMPTS;
      await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          failedAttempts: lock ? 0 : attempts,
          lockedUntil: lock ? new Date(Date.now() + LOCK_MS) : null,
        },
      });
    }
    return { error: BAD_CREDENTIALS, email };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });
  await createSession(user.id);
  redirect("/admin");
}
