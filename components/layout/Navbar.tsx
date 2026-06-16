"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { SITE_CONFIG } from "@/constants/site"

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/coberturas", label: "Coberturas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/clientes", label: "Clientes" },
  { href: "/faq", label: "FAQ" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-rose to-brand-violet text-[10px] font-bold text-white">
            GB
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gradient-to-br from-brand-rose to-brand-violet px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Cotizá ahora
          </Link>
        </nav>

        <button
          className="flex items-center gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? (
            <X className="h-5 w-5 text-text-primary" />
          ) : (
            <Menu className="h-5 w-5 text-text-primary" />
          )}
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute left-0 right-0 top-16 z-50 mx-4 rounded-xl border border-border bg-white p-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-muted hover:text-text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              <Link
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-gradient-to-br from-brand-rose to-brand-violet px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Cotizá ahora
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
