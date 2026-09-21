"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Car, LayoutDashboard, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/autos", label: "Autos", icon: Car },
  { href: "/admin/motos", label: "Motos", icon: Bike },
];

interface Props {
  user: { name: string; email: string; role: string };
}

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const logout = (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut className="size-4" />
        Cerrar sesión
      </button>
    </form>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0b1f33] lg:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
            <Image src="/logo-icon-white.png" alt="" width={22} height={30} className="h-6 w-auto" />
          </span>
          <div className="leading-tight">
            <p className="font-heading text-sm font-semibold text-white">Guadalupe Broker</p>
            <p className="text-xs text-slate-400">Panel de administración</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
            Consultas
          </p>
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-sky-500/20 to-violet-500/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-sky-400" />
                )}
                <Icon className={`size-[18px] ${active ? "text-sky-300" : ""}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-[14px] border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3 px-1 pb-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-xs font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <span className="mb-2 ml-1 inline-block rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-violet-200 uppercase">
            {user.role}
          </span>
          {logout}
        </div>
      </aside>

      {/* Mobile */}
      <header className="sticky top-0 z-30 flex items-center gap-1 overflow-x-auto bg-[#0b1f33] px-3 py-2.5 lg:hidden">
        <Image src="/logo-icon-white.png" alt="" width={22} height={30} className="mx-2 h-6 w-auto shrink-0" />
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              isActive(href, exact) ? "bg-white/10 text-white" : "text-slate-400"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
        <div className="ml-auto shrink-0">{logout}</div>
      </header>
    </>
  );
}
