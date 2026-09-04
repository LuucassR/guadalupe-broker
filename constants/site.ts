export const COVERAGES = [
  {
    slug: "automotor",
    name: "Automotor",
    icon: "Car",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80",
    desc: "Proteccion completa para tu vehiculo con las mejores coberturas del mercado automotor argentino.",
    tags: "Auto · Moto · Camioneta · 4x4",
    group: "personas",
  },
  {
    slug: "hogar",
    name: "Hogar",
    icon: "Home",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80",
    desc: "Tu patrimonio protegido contra incendios, robos y todo imprevisto que pueda surgir.",
    tags: "Casa · Departamento · PH",
    group: "personas",
  },
  {
    slug: "salud",
    name: "Salud",
    icon: "HeartPulse",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80",
    desc: "Accede a la mejor atencion medica sin preocuparte por los costos de tus tratamientos.",
    tags: "Individual · Familiar · Corporativo",
    group: "personas",
  },
  {
    slug: "comercio",
    name: "Comercio",
    icon: "Store",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    desc: "Protege tu negocio contra robos, incendios y responsabilidad civil hacia terceros.",
    tags: "Local · Oficina · PyME",
    group: "empresas",
  },
  {
    slug: "art",
    name: "ART",
    icon: "Shield",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80",
    desc: "Asegura a tus empleados segun la ley con la cobertura de riesgos del trabajo.",
    tags: "Empleados · Monotributistas",
    group: "empresas",
  },
  {
    slug: "transporte",
    name: "Transporte",
    icon: "Truck",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80",
    desc: "Seguros para flotas y cargas. Tu mercaderia siempre protegida en cada viaje.",
    tags: "Flota · Carga · Equipos",
    group: "empresas",
  },
  {
    slug: "vida-accidentes",
    name: "Vida y Accidentes",
    icon: "Heart",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&q=80",
    desc: "Los que mas te necesitan merecen tu tranquilidad y proteccion futura.",
    tags: "Vida · Acc. Personales · Sepelio",
    group: "personas",
  },
  {
    slug: "responsabilidad-civil",
    name: "Resp. Civil",
    icon: "Scale",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80",
    desc: "Responsabilidad profesional y general para particulares y empresas.",
    tags: "Profesional · General · D&O",
    group: "empresas",
  },
];

export interface Insurer {
  name: string;
  shortName: string;
  color: string;
  domain: string;
  image: string;
}

export const INSURERS: Insurer[] = [
  {
    name: "Sancor Seguros",
    shortName: "Sancor",
    color: "#00000",
    domain: "sancorseguros.com.ar",
    image: "/logos/sancor-seguros.png",
  },
  {
    name: "Rivadavia Seguros",
    shortName: "Rivadavia",
    color: "#00000",
    domain: "segurosrivadavia.com/",
    image: "/logos/rivadavia.png",
  },
  {
    name: "El Norte Seguros",
    shortName: "Norte",
    color: "#00000",
    domain: "elnorte.com.ar",
    image: "/logos/el-norte.png",
  },
  {
    name: "Cooperación Seguros",
    shortName: "Cooperación",
    color: "#00000e",
    domain: "cooperacionseguros.com.ar",
    image: "/logos/cooperacion-seguros.png",
  },
  {
    name: "Iasper Seguros",
    shortName: "Iasper",
    color: "#00000",
    domain: "iapserseguros.seg.ar",
    image: "/logos/iasper.png",
  },
];

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
    text: "Llevo años siendo cliente y siempre me atendieron de maravilla. Cuando tuve un siniestro, me acompanaron en todo el proceso. Confianza total.",
  },
  {
    name: "Laura P.",
    initials: "LP",
    rating: 5,
    text: "Muy buena predisposicion y conocimiento del mercado asegurador. Me explicaron todas las opciones con paciencia y claridad. Excelente servicio.",
  },
  {
    name: "Jorge M.",
    initials: "JM",
    rating: 5,
    text: "Tramite todo el seguro de mi comercio con ellos. Me ahorraron plata y me explicaron cada clausula. Los recomiendo siempre.",
  },
];

export const WHY_US = [
  {
    title: "Asesoramiento personalizado",
    desc: "Analizamos tu situacion y te recomendamos la cobertura justa, sin excesos ni letra chica.",
    image:
      "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
  },
  {
    title: "Respuesta rapida",
    desc: "Respondemos consultas y siniestros con agilidad. Tu tiempo es valioso para nosotros.",
    image:
      "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80",
  },
  {
    title: "Trato humano",
    desc: "Conocemos a nuestros clientes por su nombre, no por un numero de poliza.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  },
];

export const TIMELINE = [
  {
    year: "1960",
    title: "Fundacion",
    desc: "Organizacion Guadalupe de Fregona y Sales inicio su actividad aseguradora, vocacion que aun hoy perdura y continua vigente.",
  },
  {
    year: "1985",
    title: "Segunda generacion",
    desc: "La siguiente generacion se suma al proyecto, expandiendo la cartera de clientes y las companias con las que trabajamos.",
  },
  {
    year: "2005",
    title: "Nueva sucursal",
    desc: "Abrimos nuestra segunda sucursal en 25 de Mayo 2868 para brindar mejor atencion a una clientela en crecimiento.",
  },
  {
    year: "2020",
    title: "Tercera generacion",
    desc: "La tercera generacion se incorpora al negocio familiar, digitalizando procesos sin perder la calidez que nos caracteriza.",
  },
  {
    year: "Hoy",
    title: "Guadalupe Broker S.R.L.",
    desc: "Iniciamos una nueva etapa acorde a los nuevos sistemas de comercializacion de seguros, innovacion y avances tecnologicos.",
  },
];

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
  {
    address: "San Lorenzo 3000 · Santa Fe, Argentina",
    phones: ["0342-4527046"],
    cell: "+54 9 342 613-5470",
    email: "contacto@guadalupebroker.com.ar",
  },
];

export const FAQS = [
  {
    q: "Que documentacion necesito para contratar un seguro de auto?",
    a: "Necesitas cedula verde o azul segun corresponda, registro de conducir vigente, DNI y la patente al dia. Si el vehiculo tiene mas de 20 años, puede requerir una inspeccion previa.",
    category: "personas",
  },
  {
    q: "Que es la franquicia en un seguro de auto?",
    a: "Es el monto que el asegurado debe pagar en caso de siniestro. Cuanto mayor sea la franquicia, menor sera la prima. Existen franquicias fijas, variables y tambien planes sin franquicia.",
    category: "personas",
  },
  {
    q: "Como denuncio un siniestro?",
    a: "Comunicate con nosotros al telefono de tu sucursal mas cercana o por WhatsApp. Te vamos a guiar en cada paso. Generalmente tenes hasta 72 horas para hacer la denuncia desde que ocurre el siniestro.",
    category: "general",
  },
  {
    q: "Cual es la diferencia entre terceros completo y todo riesgo?",
    a: "El seguro contra terceros cubre los danos que causes a otros. Terceros completo agrega cobertura de incendio, robo y destruccion total de tu vehiculo. El todo riesgo cubre tambien los danos parciales propios sin importar quien tuvo la culpa.",
    category: "personas",
  },
  {
    q: "Que cubre el seguro de hogar?",
    a: "Cubre incendio, robos, danos por agua, responsabilidad civil y accidentes personales. Incluye servicios de asistencia como cerrajeria, plomeria y electricidad las 24 horas.",
    category: "personas",
  },
  {
    q: "El seguro de vida cubre solo fallecimiento?",
    a: "No. Ademas de fallecimiento, cubre invalidez total y permanente por accidente o enfermedad. Podes sumar coberturas complementarias como accidentes personales, enfermedades graves y renta diaria por internacion.",
    category: "personas",
  },
  {
    q: "Trabajan con todas las companias del mercado?",
    a: "Trabajamos con Sancor Seguros, Prevencion ART, Prevencion Salud, Banco del Sol y Prendo, entre otras. Como corredores independientes, buscamos la mejor opcion entre todas las companias con las que trabajamos.",
    category: "general",
  },
  {
    q: "Que es la ART y quien debe contratarla?",
    a: "La Aseguradora de Riesgos del Trabajo (ART) es obligatoria para todos los empleadores registrados. Cubre los accidentes laborales y enfermedades profesionales de tus empleados.",
    category: "empresas",
  },
  {
    q: "Puedo pagar el seguro en cuotas?",
    a: "Si. Las polizas se emiten con vigencia anual y podes abonarlas en cuotas mensuales via debito automatico en cuenta bancaria o tarjeta de credito. Consultanos por las opciones disponibles.",
    category: "general",
  },
  {
    q: "Que necesito para asegurar mi comercio?",
    a: "Datos del negocio, direccion, actividad comercial, metros cuadrados, valor de mercaderia y cantidad de empleados. Con esa info te armamos una cotizacion en minutos.",
    category: "empresas",
  },
  {
    q: "Como funciona la asistencia al viajero?",
    a: "Brinda cobertura medica, farmaceutica y de traslado durante tus viajes. Incluye desde consultas ambulatorias hasta emergencias graves y repatriacion. Podes contratarla por viaje o anualmente.",
    category: "personas",
  },
  {
    q: "Que es el seguro de caucion?",
    a: "Es un seguro que garantiza el cumplimiento de obligaciones contractuales. Se usa para alquileres, obras, licitaciones y contratos. Si no cumplis con tu obligacion, la aseguradora indemniza al beneficiario.",
    category: "empresas",
  },
  {
    q: "Que cubre el seguro de transporte de cargas?",
    a: "Cubre la mercaderia contra robo, hurto, danos parciales, destruccion total y rotura durante el traslado. Tambien incluye responsabilidad civil del transportista y asistencia en ruta.",
    category: "empresas",
  },
  {
    q: "Puedo asegurar una moto o bicicleta?",
    a: "Si. Ofrecemos coberturas para motos, bicicletas y monopatines electricos. Incluye robo, danos y responsabilidad civil. Cada vez mas personas aseguran sus vehiculos alternativos.",
    category: "personas",
  },
];

export const FAQ_CATEGORIES = [
  { id: "todas", label: "Todas" },
  { id: "general", label: "General" },
  { id: "personas", label: "Personas" },
  { id: "empresas", label: "Empresas" },
];

export const REQUIRED_DOCS: Record<string, string[]> = {
  automotor: [
    "DNI del titular",
    "Cedula verde o azul",
    "Registro de conducir vigente",
    "Patente al dia",
  ],
  hogar: [
    "DNI del titular",
    "Escritura o boleto de compraventa",
    "Ultimo impuesto ABL/ABL",
  ],
  salud: ["DNI del titular y grupo familiar", "Declaracion jurada de salud"],
  comercio: [
    "DNI del titular",
    "Habilitacion municipal",
    "Factura de servicios del local",
  ],
  art: [
    "CUIL de cada empleado",
    "Categoria de riesgo laboral",
    "Declaracion jurada de nomina",
  ],
  transporte: [
    "Cedula de identificacion del vehiculo",
    "Licencia de conducir vigente",
    "Certificado de RTO vigente",
  ],
  "vida-accidentes": [
    "DNI del tomador y beneficiarios",
    "Declaracion jurada de salud",
  ],
  "responsabilidad-civil": [
    "DNI del contratante",
    "Contrato o matricula profesional",
    "Declaracion de actividad",
  ],
};

export const HOW_TO_HIRE = [
  {
    step: 1,
    title: "Completa tus datos",
    desc: "Elegi la cobertura que necesitas y completa el formulario con tu informacion.",
  },
  {
    step: 2,
    title: "Recibi tu cotizacion",
    desc: "Te enviamos las mejores opciones de las principales aseguradoras del mercado.",
  },
  {
    step: 3,
    title: "Activa tu poliza",
    desc: "Confirmas la opcion que mas te guste y activamos tu cobertura en el acto.",
  },
];

export const COVERAGE_FAQ_MAP: Record<string, { q: string; a: string }[]> = {
  automotor: [
    {
      q: "Que cubre el seguro de auto contra terceros?",
      a: "Cubre los danos que puedas causar a otros vehiculos, personas o bienes. La opcion 'terceros completo' agrega incendio, robo y destruccion total.",
    },
    {
      q: "Como se calcula el valor del seguro?",
      a: "Depende del modelo del vehiculo, su antiguedad, el uso que le des y la cobertura que elijas. Te cotizamos sin compromiso.",
    },
  ],
  hogar: [
    {
      q: "Que danos por agua cubre el seguro de hogar?",
      a: "Cubre danos por ruptura de canerias, filtraciones de vecinos, lluvia y granizo. No cubre humedad por falta de mantenimiento.",
    },
    {
      q: "Los electrodomesticos estan cubiertos?",
      a: "Si, podes contratar cobertura especifica para equipos electronicos y electrodomesticos contra robo, incendio y danos electricos.",
    },
  ],
  salud: [
    {
      q: "Puedo incluir a mi grupo familiar?",
      a: "Si. Ofrecemos planes individuales, familiares y corporativos. Cada plan tiene su propia tabla de prestaciones.",
    },
    {
      q: "Las preexistencias estan cubiertas?",
      a: "Depende del plan y la aseguradora. Te asesoramos para encontrar la opcion que mejor se adapte a tu situacion.",
    },
  ],
  comercio: [
    {
      q: "Que necesito para asegurar mi local?",
      a: "Direccion del comercio, metros cuadrados, actividad que realizas, valor estimado de mercaderia y muebles.",
    },
    {
      q: "Cubre responsabilidad civil hacia clientes?",
      a: "Si. Incluye danos a terceros que ocurran dentro de tu comercio, como caidas o accidentes de clientes.",
    },
  ],
  art: [
    {
      q: "La ART cubre accidentes in itinere?",
      a: "Si. El trayecto de ida y vuelta del trabajo al domicilio esta cubierto como accidente laboral.",
    },
    {
      q: "Que pasa si no tengo ART?",
      a: "La ART es obligatoria por ley. No tenerla puede generar multas y la imposibilidad de operar legalmente.",
    },
  ],
  transporte: [
    {
      q: "Cubre la carga durante carga y descarga?",
      a: "Si, la cobertura incluye la mercaderia durante las operaciones de carga, descarga y traslado.",
    },
    {
      q: "Puedo asegurar solo la carga sin el vehiculo?",
      a: "Si, ofrecemos seguros de carga independientes del seguro del vehiculo transportador.",
    },
  ],
  "vida-accidentes": [
    {
      q: "El seguro de vida cubre suicidio?",
      a: "Generalmente si, despues de los primeros 2 o 3 años de vigencia de la poliza. Cada compania tiene sus condiciones.",
    },
    {
      q: "Que diferencia hay entre vida y accidentes personales?",
      a: "El seguro de vida cubre fallecimiento por cualquier causa. Accidentes personales cubre solo eventos accidentales pero con sumas mas altas.",
    },
  ],
  "responsabilidad-civil": [
    {
      q: "Necesito RC si soy profesional independiente?",
      a: "Si. La responsabilidad civil profesional te protege ante reclamos por errores u omisiones en tu trabajo.",
    },
    {
      q: "Cubre danos a la propiedad de terceros?",
      a: "Si. Incluye danos involuntarios a bienes de terceros, tanto para particulares como para empresas.",
    },
  ],
};

export const COVERAGE_DETAILS: Record<
  string,
  { desc: string; benefits: string[] }
> = {
  automotor: {
    desc: "Protege tu vehiculo con la cobertura que mejor se adapte a tus necesidades. Trabajamos con las principales aseguradoras del pais para ofrecerte el mejor precio y la mejor proteccion.",
    benefits: [
      "Responsabilidad civil obligatoria y voluntaria",
      "Proteccion contra robo e incendio total y parcial",
      "Danos por granizo, inundacion y fenomenos climaticos",
      "Cobertura de cristales y cerradura",
      "Auto sustituto durante reparacion",
      "Asistencia mecanica y remolque las 24 horas",
      "Proteccion legal y defensa penal",
      "Opcion de cobertura todo riesgo sin franquicia",
    ],
  },
  hogar: {
    desc: "Tu hogar es tu patrimonio mas importante. Nuestra cobertura integral protege tu casa y tus pertenencias contra una amplia gama de riesgos.",
    benefits: [
      "Proteccion contra incendio, explosion y caida de avion",
      "Cobertura de robo y hurto de bienes",
      "Danos por agua, gas y liquidos",
      "Responsabilidad civil familiar",
      "Proteccion de equipos electronicos y electrodomesticos",
      "Asistencia familiar: cerrajeria, plomeria, vidrios, electricidad",
      "Cobertura de fondas y valores en el hogar",
      "Reparacion de techos y filtraciones",
    ],
  },
  salud: {
    desc: "Accede a la mejor atencion medica privada sin preocuparte por los costos. Nuestros planes de salud te brindan tranquilidad para vos y tu familia.",
    benefits: [
      "Cobertura de consultas medicas y especialistas",
      "Internacion en clinicas y sanatorios",
      "Estudios de diagnostico avanzados (tomografia, resonancia)",
      "Cirugias programadas y de urgencia",
      "Maternidad y atencion del recien nacido",
      "Cobertura de medicamentos ambulatorios",
      "Emergencias y urgencias las 24 horas",
      "Programas de prevencion y chequeos anuales",
    ],
  },
  comercio: {
    desc: "Tu negocio merece proteccion integral. Cubrimos comercios, oficinas, locales y pymes contra todo riesgo operativo.",
    benefits: [
      "Cobertura de incendio y danos por agua en el local",
      "Proteccion de mercaderias y existencias",
      "Responsabilidad civil hacia terceros",
      "Robos y hurtos en el local comercial",
      "Rotura de vidrieras y carteles",
      "Danos por equipos electronicos y maquinaria",
      "Perdida de ganancias por paralizacion",
      "Asistencia tecnica y legal especializada",
    ],
  },
  art: {
    desc: "La Aseguradora de Riesgos del Trabajo es obligatoria para todos los empleadores. Te ayudamos a elegir la mejor opcion para tu empresa con el respaldo de Prevencion ART.",
    benefits: [
      "Cobertura de accidentes de trabajo y enfermedades profesionales",
      "Prestaciones medicas integrales sin costo",
      "Rehabilitacion y reinsercion laboral",
      "Pago de prestaciones economicas segun ley",
      "Asesoria en prevencion y seguridad laboral",
      "Gestion de altas y bajas de empleados",
      "Capacitacion en higiene y seguridad",
      "Denuncia online y seguimiento de siniestros",
    ],
  },
  transporte: {
    desc: "Protege tu flota y tu carga con coberturas disenadas para el transporte de mercaderias por via terrestre.",
    benefits: [
      "Cobertura de responsabilidad civil por danos a terceros",
      "Proteccion de la carga contra robo, hurto y danos",
      "Seguro de flotas con descuento por volumen",
      "Asistencia mecanica y remolque para vehiculos pesados",
      "Cobertura de accidentes personales para conductores",
      "Proteccion legal y defensa penal",
      "Cobertura de equipos especiales (gruas, refrigeracion)",
      "Gestion de siniestros con seguimiento personalizado",
    ],
  },
  "vida-accidentes": {
    desc: "Asegura el futuro de tus seres queridos con planes de vida y accidentes personales. La tranquilidad de saber que estan protegidos no tiene precio.",
    benefits: [
      "Cobertura por fallecimiento por cualquier causa",
      "Invalidez total y permanente por accidente o enfermedad",
      "Cobertura de accidentes personales",
      "Enfermedades graves cubiertas (cancer, infarto, ACV)",
      "Renta diaria por internacion",
      "Asistencia al viajero incluida",
      "Cobertura de sepelio y gastos funerarios",
      "Suma asegurada actualizable por inflacion",
    ],
  },
  "responsabilidad-civil": {
    desc: "Proteccion ante reclamos de terceros por danos involuntarios. Ideal para profesionales, empresas y particulares que quieren estar cubiertos.",
    benefits: [
      "Responsabilidad civil general para particulares",
      "Responsabilidad civil profesional para rubros especificos",
      "Cobertura de danos a terceros y sus bienes",
      "Defensa legal y costos judiciales",
      "Responsabilidad civil para consorcios y edificios",
      "Cobertura para eventos y actividades",
      "Proteccion para directivos y gerentes (D&O)",
      "Asistencia legal extrajudicial",
    ],
  },
};

// Apagado en production: el multicotizador todavia no esta listo para el
// publico. En su lugar se muestra AdvisorCta (cotizacion por WhatsApp).
export const MULTICOTIZADOR_ENABLED = false;

export const SITE_CONFIG = {
  name: "Guadalupe Broker",
  tagline: "Corredora de Seguros",
  description:
    "Mas de 60 años y 3 generaciones protegiendo familias y empresas en Santa Fe.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493426135470",
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Hola%2C%20quiero%20cotizar%20un%20seguro",
  whatsappUrl: `https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493426135470"}&text=${process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Hola%2C%20quiero%20cotizar%20un%20seguro"}`,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://guadalupebroker.com.ar",
  googleReviewsUrl: "https://www.google.com/search?q=Guadalupe+Broker+Santa+Fe",
};
