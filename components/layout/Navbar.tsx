"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { SITE_CONFIG } from "@/constants/site"

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/coberturas", label: "Coberturas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/faq", label: "FAQ" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
        scrolled
          ? "top-3"
          : "top-6"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between rounded-2xl px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? "w-[calc(100%-48px)] max-w-[1140px] bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl ring-1 ring-black/5"
            : "w-[calc(100%-48px)] max-w-[1140px] bg-white/10 shadow-lg shadow-black/5 backdrop-blur-md ring-1 ring-white/20"
        }`}
      >
        <Link href="/" className="group flex items-center gap-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-wide transition-all ${
              scrolled
                ? "bg-gradient-to-br from-brand-rose to-brand-violet text-white"
                : "bg-white/20 text-white backdrop-blur"
            }`}
          >
            GB
          </span>
          <span
            className={`text-sm font-semibold tracking-wide transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/80 hover:text-white"
              }`}
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
            Cotiza ahora
          </Link>
        </nav>

        <button
          className={`flex items-center gap-1.5 md:hidden ${
            scrolled ? "text-gray-900" : "text-white"
          }`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
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
          <nav className="absolute left-1/2 top-16 z-50 w-[calc(100%-48px)] max-w-[1140px] -translate-x-1/2 rounded-2xl border border-white/10 bg-brand-dark/95 p-5 shadow-2xl backdrop-blur-xl md:hidden">
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
                Cotiza ahora
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
