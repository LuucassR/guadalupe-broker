export const COVERAGES = [
  { slug: "automotor", name: "Automotor", icon: "🚗", bg: "#FFF3F8" },
  { slug: "hogar", name: "Hogar", icon: "🏠", bg: "#F0F0FF" },
  { slug: "salud", name: "Salud", icon: "🩺", bg: "#F0FDF4" },
  { slug: "art", name: "ART", icon: "🦺", bg: "#FFF7ED" },
  { slug: "comercio", name: "Comercio", icon: "🏪", bg: "#FDF4FF" },
  { slug: "transporte", name: "Transporte", icon: "🚛", bg: "#EFF8FF" },
  {
    slug: "vida-accidentes",
    name: "Vida y Accidentes",
    icon: "❤️",
    bg: "#FEF0F0",
  },
  { slug: "responsabilidad-civil", name: "Resp. Civil", icon: "⚖️", bg: "#F5F3FF" },
]

export const INSURERS = [
  "Sancor Seguros",
  "Prevención ART",
  "Prevención Salud",
  "Banco del Sol",
  "Prendo",
]

export const REVIEWS = [
  {
    name: "María A.",
    initials: "MA",
    rating: 5,
    text: "Excelente atención, muy profesionales. Me asesoraron perfecto para el seguro de mi auto y conseguí una cobertura mucho mejor a un precio accesible. Los recomiendo sin dudarlo.",
  },
  {
    name: "Carlos R.",
    initials: "CR",
    rating: 5,
    text: "Llevo años siendo cliente y siempre me atendieron de maravilla. Cuando tuve un siniestro, me acompañaron en todo el proceso. Un equipo de confianza total.",
  },
  {
    name: "Laura P.",
    initials: "LP",
    rating: 5,
    text: "Muy buena predisposición y conocimiento del mercado asegurador. Me explicaron todas las opciones con paciencia y claridad. Excelente servicio.",
  },
]

export const STATS = [
  { value: "+60", label: "Años · 3ra generación" },
  { value: "4.9★", label: "Calificación Google" },
  { value: "2", label: "Sucursales en Santa Fe" },
  { value: "+10", label: "Compañías aseguradoras" },
]

export const WHY_US = [
  {
    icon: "target",
    title: "Asesoramiento personalizado",
    desc: "Analizamos tu situación y te recomendamos la cobertura justa, sin excesos ni letra chica.",
  },
  {
    icon: "zap",
    title: "Respuesta rápida",
    desc: "Respondemos consultas y siniestros con agilidad. Tu tiempo es valioso para nosotros.",
  },
  {
    icon: "handshake",
    title: "Trato humano",
    desc: "Conocemos a nuestros clientes por su nombre, no por un número de póliza.",
  },
  {
    icon: "map-pin",
    title: "Presencia local",
    desc: "Dos sucursales en Santa Fe. Siempre cerca cuando más nos necesitás.",
  },
]

export const BRANCHES = [
  {
    address: "25 de Mayo 2516 · Santa Fe, Argentina",
    phones: ["0342-4524513", "0342-4553564"],
    cell: "+54 9 342 613-5470",
    email: "contacto@guadalupebroker.com.ar",
  },
  {
    address: "25 de Mayo 2868 · Santa Fe, Argentina",
    phones: ["0342-4534182"],
    cell: "+54 9 342 536-3888",
    email: "contacto@guadalupebroker.com.ar",
  },
]

export const SITE_CONFIG = {
  name: "Guadalupe Broker",
  tagline: "Corredora de Seguros",
  description:
    "Más de 60 años y 3 generaciones protegiendo familias y empresas en Santa Fe.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493426135470",
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Hola%2C%20quiero%20cotizar%20un%20seguro",
  whatsappUrl: `https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493426135470"}&text=${process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Hola%2C%20quiero%20cotizar%20un%20seguro"}`,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://guadalupebroker.com.ar",
  googleReviewsUrl: "https://www.google.com/search?q=Guadalupe+Broker+Santa+Fe",
}
