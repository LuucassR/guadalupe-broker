"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LoadingSplash() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set(logoRef.current, { opacity: 1, scale: 1 });
        gsap.set(lineRef.current, { scaleX: 1 });
        return;
      }

      gsap
        .timeline()
        .fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
        )
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power2.out" },
          "-=0.25",
        );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="bg-bg-page fixed inset-0 z-100 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-5">
        <div ref={logoRef} className="w-40 opacity-0 sm:w-56">
          <Image
            src="/logo-nb.svg"
            alt="Guadalupe Broker"
            width={489}
            height={250}
            priority
            className="h-auto w-full"
          />
        </div>
        <div className="h-px w-24 overflow-hidden bg-gray-200">
          <div
            ref={lineRef}
            className="bg-brand-purple h-full w-full origin-left scale-x-0"
          />
        </div>
      </div>
    </div>
  );
}
