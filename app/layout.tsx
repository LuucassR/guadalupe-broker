import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.guadalupebroker.com.ar"),
  title: "Guadalupe Broker SRL | Corredora de Seguros · Santa Fe",
  description:
    "Más de 60 años y 3 generaciones protegiendo familias y empresas en Santa Fe. Automotor, Hogar, Salud, ART y más.",
  openGraph: {
    title: "Guadalupe Broker SRL | Corredora de Seguros",
    description: "Más de 60 años protegiendo familias y empresas en Santa Fe.",
    siteName: "Guadalupe Broker",
    locale: "es_AR",
    type: "website",
    images: ["/homePageImage.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guadalupe Broker SRL | Corredora de Seguros",
    description: "Más de 60 años protegiendo familias y empresas en Santa Fe.",
    images: ["/homePageImage.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
