"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG, BRANCHES, MULTICOTIZADOR_ENABLED } from "@/constants/site";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/coberturas", label: "Coberturas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/clientes", label: "Clientes" },
  { href: "/faq", label: "FAQ" },
];

const mainBranch = BRANCHES[0];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="bg-brand-dark hidden items-center justify-between px-8 py-2 text-[11px] font-semibold tracking-wide text-white/70 md:flex">
        <div className="flex items-center gap-6">
          {MULTICOTIZADOR_ENABLED && (
            <Link href="#cotizador" className="uppercase transition-colors hover:text-white">
              Cotizador online
            </Link>
          )}
          <Link
            href={`mailto:${mainBranch.email}?subject=${encodeURIComponent("Dejo mi CV")}`}
            className="uppercase transition-colors hover:text-white"
          >
            Dejanos tu CV
          </Link>
          <Link href="/nosotros" prefetch={true} className="uppercase transition-colors hover:text-white">
            Contactanos
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-purple hover:bg-brand-purple-hover px-4 py-1.5 text-white uppercase transition-colors"
          >
            Denunciar siniestro
          </Link>
          <a
            href={`tel:${mainBranch.phones[0]}`}
            className="flex items-center gap-1.5 text-white transition-colors hover:text-white/80"
          >
            <Phone className="h-3 w-3" />
            {mainBranch.phones[0]}
          </a>
        </div>
      </div>
      <div
        className={`mx-auto flex items-center justify-between py-3.5 transition-shadow duration-300 md:px-8 ${
          scrolled
            ? "bg-white shadow-[0_1px_0_rgba(17,24,39,0.06)]"
            : "bg-white/95 backdrop-blur"
        }`}
      >
        <Link href="/" prefetch={true} className="flex items-center gap-3">
          <Image
            src="/logo-icon.png"
            alt={SITE_CONFIG.name}
            width={32}
            height={59}
            className="h-8 w-auto"
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-gray-900">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className="group text-sm font-medium tracking-wide text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
              <div className="bg-brand-accent h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            prefetch={true}
            className="bg-brand-purple hover:bg-brand-purple-hover px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white shadow-sm transition-colors"
          >
            Cotiza ahora
          </Link>
        </nav>

        <button
          className="flex cursor-pointer items-center gap-1.5 text-gray-900 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-pointer bg-black/10 md:hidden"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute top-full left-0 z-50 w-full border-t border-gray-100 bg-white p-5 shadow-lg md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              <Link
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={true}
                onClick={() => setOpen(false)}
                className="bg-brand-purple px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Cotiza ahora
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
