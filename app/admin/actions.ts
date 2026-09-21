"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/admin/session";

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
