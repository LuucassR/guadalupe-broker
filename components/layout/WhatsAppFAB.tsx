import { SITE_CONFIG } from "@/constants/site";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

export default function WhatsAppFAB() {
  return (
    <a
      href={SITE_CONFIG.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-whatsapp fixed right-6 bottom-6 z-50 flex h-14 w-14 animate-[pulse_3s_ease-in-out_infinite] items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
