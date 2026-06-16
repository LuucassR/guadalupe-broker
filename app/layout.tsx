import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html
      lang="es"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  )
}
