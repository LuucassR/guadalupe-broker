export const COVERAGES = [
  { slug: "automotor", name: "Automotor", icon: "Car", desc: "Proteccion completa para tu vehiculo con las mejores coberturas del mercado automotor argentino." },
  { slug: "hogar", name: "Hogar", icon: "Home", desc: "Tu patrimonio protegido contra incendios, robos y todo imprevisto que pueda surgir." },
  { slug: "salud", name: "Salud", icon: "HeartPulse", desc: "Accede a la mejor atencion medica sin preocuparte por los costos de tus tratamientos." },
  { slug: "comercio", name: "Comercio", icon: "Store", desc: "Protege tu negocio contra robos, incendios y responsabilidad civil hacia terceros." },
  { slug: "art", name: "ART", icon: "Shield", desc: "Asegura a tus empleados segun la ley con la cobertura de riesgos del trabajo." },
  { slug: "transporte", name: "Transporte", icon: "Truck", desc: "Seguros para flotas y cargas. Tu mercaderia siempre protegida en cada viaje." },
  { slug: "vida-accidentes", name: "Vida y Accidentes", icon: "Heart", desc: "Los que mas te necesitan merecen tu tranquilidad y proteccion futura." },
  { slug: "responsabilidad-civil", name: "Resp. Civil", icon: "Scale", desc: "Responsabilidad profesional y general para particulares y empresas." },
]

export const BENTO_ITEMS = [
  {
    slug: "automotor",
    name: "Seguro Automotor",
    desc: "Cobertura integral para tu vehiculo con las mejores companias del pais.",
    image: "https://picsum.photos/seed/automotor/800/600",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    slug: "hogar",
    name: "Seguro de Hogar",
    desc: "Proteccion completa para tu patrimonio familiar.",
    image: "https://picsum.photos/seed/hogar/400/300",
    span: "lg:col-span-1 lg:row-span-1",
  },
  {
    slug: "salud",
    name: "Seguro de Salud",
    desc: "Acceso a la mejor atencion medica privada.",
    image: "https://picsum.photos/seed/salud/400/300",
    span: "lg:col-span-1 lg:row-span-1",
  },
  {
    slug: "empresas",
    name: "Seguros Empresariales",
    desc: "Soluciones integrales para tu empresa, comercio o industria.",
    image: "https://picsum.photos/seed/empresas/800/400",
    span: "lg:col-span-2 lg:row-span-1",
  },
]

export const INSURERS = [
  "Sancor Seguros",
  "Prevencion ART",
  "Prevencion Salud",
  "Banco del Sol",
  "Prendo",
]

export const REVIEWS = [
  {
    name: "Maria A.",
    initials: "MA",
    rating: 5,
    text: "Excelente atencion, muy profesionales. Me asesoraron perfecto para el seguro de mi auto y consegui una cobertura mucho mejor a un precio accesible.",
  },
  {
    name: "Carlos R.",
    initials: "CR",
    rating: 5,
    text: "Llevo anos siendo cliente y siempre me atendieron de maravilla. Cuando tuve un siniestro, me acompanaron en todo el proceso. Confianza total.",
  },
  {
    name: "Laura P.",
    initials: "LP",
    rating: 5,
    text: "Muy buena predisposicion y conocimiento del mercado asegurador. Me explicaron todas las opciones con paciencia y claridad. Excelente servicio.",
  },
]

export const WHY_US = [
  {
    title: "Asesoramiento personalizado",
    desc: "Analizamos tu situacion y te recomendamos la cobertura justa, sin excesos ni letra chica.",
    image: "https://picsum.photos/seed/asesor/600/800",
  },
  {
    title: "Respuesta rapida",
    desc: "Respondemos consultas y siniestros con agilidad. Tu tiempo es valioso para nosotros.",
    image: "https://picsum.photos/seed/respuesta/600/800",
  },
  {
    title: "Trato humano",
    desc: "Conocemos a nuestros clientes por su nombre, no por un numero de poliza.",
    image: "https://picsum.photos/seed/trato/600/800",
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
    "Mas de 60 anos y 3 generaciones protegiendo familias y empresas en Santa Fe.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493426135470",
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Hola%2C%20quiero%20cotizar%20un%20seguro",
  whatsappUrl: `https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493426135470"}&text=${process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Hola%2C%20quiero%20cotizar%20un%20seguro"}`,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://guadalupebroker.com.ar",
  googleReviewsUrl: "https://www.google.com/search?q=Guadalupe+Broker+Santa+Fe",
}
