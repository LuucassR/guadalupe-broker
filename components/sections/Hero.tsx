"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden bg-brand-dark">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt=""
          className="h-full w-full object-cover grayscale opacity-40"
          fill
          priority
        />
        <div className="absolute inset-0 bg-brand-dark/60" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <h1 className="text-[clamp(3rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-white">
          Tu tranquilidad,{" "}
          <span className="text-brand-rose">
            nuestra herencia
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
          Mas de 60 anos y tres generaciones protegiendo familias y empresas en
          Santa Fe. Encontramos la cobertura ideal para vos.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            prefetch={true}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-brand-rose px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:brightness-110 hover:scale-[1.02]"
          >
            Cotiza ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/nosotros"
            prefetch={true}
            className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide text-white/80 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
          >
            Nuestra historia
          </Link>
        </div>
      </div>
    </section>
  );
}
