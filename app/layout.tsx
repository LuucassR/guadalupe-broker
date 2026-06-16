import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Guadalupe Broker SRL | Corredora de Seguros · Santa Fe",
  description:
    "Más de 60 años y 3 generaciones protegiendo familias y empresas en Santa Fe. Automotor, Hogar, Salud, ART y más.",
  openGraph: {
    title: "Guadalupe Broker SRL | Corredora de Seguros",
    description:
      "Más de 60 años protegiendo familias y empresas en Santa Fe.",
    siteName: "Guadalupe Broker",
    locale: "es_AR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.className} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
