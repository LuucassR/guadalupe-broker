"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TIMELINE } from "@/constants/site";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";

gsap.registerPlugin(ScrollTrigger);

export default function PinnedShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (!trackRef.current || !sectionRef.current) return;
          const track = trackRef.current;
          const wrapper = sectionRef.current;
          const distance = track.scrollWidth - wrapper.clientWidth;
          if (distance <= 0) return;

          const tween = gsap.to(track, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top top",
              end: () => `+=${distance}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progressRef.current) {
                  progressRef.current.style.width = `${self.progress * 100}%`;
                }
              },
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-brand-dark relative overflow-hidden py-20 md:py-24"
    >
      <div className="mx-auto max-w-300 px-6">
        <div className="mb-12 max-w-2xl">
          <SectionLabel tone="purple">Por que nosotros</SectionLabel>
          <SectionTitle tone="light" className="mt-4">
            Tres generaciones protegiendo a Santa Fe
          </SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            No solo vendemos polizas. Construimos relaciones de confianza que
            atraviesan generaciones en toda la provincia.
          </p>
        </div>
      </div>

      <div className="mx-6 mb-8 hidden h-px bg-white/10 md:block">
        <div
          ref={progressRef}
          className="bg-brand-purple h-px w-0 transition-[width]"
        />
      </div>

      <div
        ref={trackRef}
        className="flex flex-col gap-4 px-6 md:w-max md:flex-row md:gap-6"
        style={{
          paddingLeft: "max(24px, calc((100vw - 1200px) / 2 + 24px))",
          paddingRight: "max(24px, calc((100vw - 1200px) / 2 + 24px))",
        }}
      >
        {TIMELINE.map((item) => (
          <div
            key={item.year}
            className="border-white/15 flex shrink-0 flex-col border bg-white/5 p-6 md:w-85"
          >
            <span className="text-brand-purple font-heading text-4xl font-bold md:text-5xl">
              {item.year}
            </span>
            <h3 className="mt-4 text-base font-bold text-white">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
