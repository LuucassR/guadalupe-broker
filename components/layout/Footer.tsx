import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG, BRANCHES } from "@/constants/site";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/coberturas", label: "Coberturas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/clientes", label: "Clientes" },
  { href: "/faq", label: "FAQ" },
];

const mainBranch = BRANCHES[0];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/logo-icon-white.png"
                alt={SITE_CONFIG.name}
                width={36}
                height={66}
                className="h-9 w-auto"
              />
              <span className="text-sm font-semibold tracking-wide">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="border border-gray-800 px-4 py-1.5 text-xs font-medium text-gray-400">
                SSN Matriculado
              </span>
              <span className="border border-gray-800 px-4 py-1.5 text-xs font-medium text-gray-400">
                Santa Fe, Argentina
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold tracking-[0.15em] text-gray-500 uppercase">
              Navegacion
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={true}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold tracking-[0.15em] text-gray-500 uppercase">
              Contacto
            </h3>
            <div className="space-y-3">
              <a
                href={`tel:${mainBranch.phones[0]}`}
                className="block text-sm text-gray-400 transition-colors hover:text-white"
              >
                {mainBranch.phones[0]}
              </a>
              <a
                href={`https://wa.me/${mainBranch.cell}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-whatsapp flex items-center gap-2 text-sm text-gray-400 transition-colors"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <a
                href={`mailto:${mainBranch.email}`}
                className="hover:text-brand-accent block text-sm text-gray-400 transition-colors"
              >
                {mainBranch.email}
              </a>
              <Link
                href="/nosotros"
                prefetch={true}
                className="text-brand-purple block pt-1 text-sm font-medium transition-colors hover:text-white"
              >
                Ver las {BRANCHES.length} sucursales →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  );
}
