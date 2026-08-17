import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";
import { Calculator, Shield, MessageCircle, ArrowRight } from "lucide-react";

const ACTIONS = [
  {
    icon: Calculator,
    title: "Cotizá tu seguro",
    desc: "Auto o moto, en 3 pasos y sin costo.",
    href: "#cotizador",
    external: false,
  },
  {
    icon: Shield,
    title: "Todas las coberturas",
    desc: "Hogar, salud, empresas y mas.",
    href: "/coberturas",
    external: false,
  },
  {
    icon: MessageCircle,
    title: "Hablá con un asesor",
    desc: "Te respondemos por WhatsApp en minutos.",
    href: SITE_CONFIG.whatsappUrl,
    external: true,
  },
];

export default function QuickActions() {
  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="mx-auto grid max-w-300 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          const props = a.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : { prefetch: true };
          return (
            <Link
              key={a.title}
              href={a.href}
              {...props}
              className="group hover:bg-bg-muted flex items-start gap-4 px-6 py-6 transition-colors md:px-8"
            >
              <span className="bg-brand-accent-soft text-brand-accent flex h-10 w-10 shrink-0 items-center justify-center">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="text-brand-dark flex items-center gap-1.5 text-sm font-bold">
                  {a.title}
                  <ArrowRight className="h-3.5 w-3.5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-400" />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-600">
                  {a.desc}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
