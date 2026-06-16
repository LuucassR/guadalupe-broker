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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        mounted && scrolled
          ? "bg-brand-dark/90 backdrop-blur-xl shadow-lg shadow-black/10"
          : mounted
            ? "bg-transparent"
            : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xs font-bold tracking-wide text-white ring-1 ring-white/20 backdrop-blur transition-all group-hover:bg-white/20">
            GB
          </span>
          <span className={`text-sm font-semibold tracking-wide transition-colors ${mounted && scrolled ? "text-white" : "text-white"}`}>
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gradient-to-br from-brand-rose to-brand-violet px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white shadow-lg shadow-brand-rose/20 transition-all hover:shadow-xl hover:shadow-brand-rose/30 hover:scale-[1.02]"
          >
            Cotizá ahora
          </Link>
        </nav>

        <button
          className="flex items-center gap-1.5 text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute left-0 right-0 top-18 z-50 mx-4 rounded-2xl border border-white/10 bg-brand-dark/95 p-5 shadow-2xl backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-white/10" />
              <Link
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-gradient-to-br from-brand-rose to-brand-violet px-4 py-3 text-center text-sm font-semibold text-white"
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
