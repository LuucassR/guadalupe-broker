import Image from "next/image";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getAdminUser } from "@/lib/admin/session";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await getAdminUser()) redirect("/admin");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1f33] px-4 py-12">
      <div className="pointer-events-none absolute -top-40 -left-32 size-[34rem] rounded-full bg-sky-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 -bottom-40 size-[34rem] rounded-full bg-violet-600/25 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur">
            <Image src="/logo-icon-white.png" alt="Guadalupe Broker" width={36} height={48} className="h-9 w-auto" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">
            Panel de administración
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">Guadalupe Broker · Acceso restringido</p>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <LoginForm />
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="size-3.5" />
          Sesión protegida · se cierra sola a las 8 h
        </p>
      </div>
    </main>
  );
}
