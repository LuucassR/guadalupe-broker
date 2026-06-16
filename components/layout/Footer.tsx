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
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-32">
        <div className="grid gap-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-rose to-brand-violet text-xs font-bold tracking-wide text-white">
                GB
              </span>
              <span className="text-sm font-semibold tracking-wide">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-gray-800 px-4 py-1.5 text-xs font-medium text-gray-500">
                SSN Matriculado
              </span>
              <span className="rounded-full border border-gray-800 px-4 py-1.5 text-xs font-medium text-gray-500">
                Santa Fe, Argentina
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
              Navegacion
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
              Contacto
            </h3>
            <div className="space-y-6">
              {BRANCHES.map((branch, i) => (
                <div key={i}>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Sucursal {i + 1}
                  </p>
                  <p className="text-sm text-gray-400">{branch.address}</p>
                  {branch.phones.map((p) => (
                    <p key={p} className="text-sm text-gray-400">
                      {p}
                    </p>
                  ))}
                  <a
                    href={`mailto:${branch.email}`}
                    className="text-sm text-gray-400 transition-colors hover:text-brand-rose"
                  >
                    {branch.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  )
}
