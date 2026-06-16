import { SITE_CONFIG } from "@/constants/site"
import { MessageCircle } from "lucide-react"

export default function WhatsAppFAB() {
  return (
    <a
      href={SITE_CONFIG.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 animate-[pulse_3s_ease-in-out_infinite] items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
