"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

const field =
  "w-full rounded-[10px] border border-white/10 bg-white/[0.06] py-3 pr-11 pl-11 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-sky-400/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-sky-400/10";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium tracking-wide text-slate-300 uppercase">
          Email
        </span>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            defaultValue={state.email}
            placeholder="admin@guadalupebroker.com.ar"
            className={field}
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium tracking-wide text-slate-300 uppercase">
          Contraseña
        </span>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••••••"
            className={field}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 transition hover:text-white"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </label>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-[10px] border border-rose-400/25 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? "Ingresando…" : "Ingresar al panel"}
      </button>
    </form>
  );
}
