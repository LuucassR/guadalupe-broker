import { SITE_CONFIG } from "@/constants/site";
import { MessageCircle, ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

export default function AdvisorCta({
  coverageName,
}: {
  coverageName?: string;
}) {
  const message = coverageName
    ? `Hola, quiero cotizar ${coverageName}.`
    : "Hola, quiero cotizar un seguro.";
  const href = `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=${encodeURIComponent(message)}`;

  return (
    <div className="border border-gray-200 bg-white p-6 md:p-8">
      <div className="bg-whatsapp/10 flex h-11 w-11 items-center justify-center">
        <WhatsAppIcon className="text-whatsapp h-5 w-5" />
      </div>
      <h3 className="text-brand-dark mt-4 text-lg font-bold">
        {coverageName
          ? `Un asesor te ayuda a cotizar ${coverageName.toLowerCase()}`
          : "Un asesor te ayuda a elegir tu cobertura"}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">
        Este tipo de seguro lo cotizamos junto a vos por WhatsApp: contanos
        que necesitas y te respondemos en minutos con la mejor opcion.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-brand-accent hover:bg-brand-accent-hover group mt-6 inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        Hablar con un asesor
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
