import Link from "next/link"
import { SITE_CONFIG, BRANCHES } from "@/constants/site"

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/coberturas", label: "Coberturas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/clientes", label: "Clientes" },
  { href: "/faq", label: "FAQ" },
]

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="mx-auto max-w-[1140px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-rose to-brand-violet text-[10px] font-bold text-white">
                GB
              </span>
              <span className="text-sm font-semibold">{SITE_CONFIG.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-gray-700 px-3 py-1 text-[11px] text-gray-400">
                SSN Matriculado
              </span>
              <span className="rounded-full border border-gray-700 px-3 py-1 text-[11px] text-gray-400">
                Santa Fe, Argentina
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-gray-400">
              Navegación
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-gray-400">
              Contacto
            </h3>
            <div className="space-y-6">
              {BRANCHES.map((branch, i) => (
                <div key={i}>
                  <p className="mb-1 text-sm font-medium text-white">
                    Sucursal {i + 1}
                  </p>
                  <p className="mb-1 text-sm text-gray-400">{branch.address}</p>
                  {branch.phones.map((phone) => (
                    <p key={phone} className="text-sm text-gray-400">
                      {phone}
                    </p>
                  ))}
                  <p className="text-sm text-gray-400">{branch.cell}</p>
                  <a
                    href={`mailto:${branch.email}`}
                    className="text-sm text-brand-rose transition-colors hover:text-brand-violet"
                  >
                    {branch.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  )
}
