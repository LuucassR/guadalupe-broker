import Image from "next/image";
import { ReactNode } from "react";
import SectionLabel from "./SectionLabel";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  icon,
  backLink,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  image: string;
  icon?: ReactNode;
  backLink?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-brand-dark relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-20">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          className="h-full w-full object-cover opacity-25"
          fill
          priority
        />
        <div className="from-brand-dark via-brand-dark/85 to-brand-accent/50 absolute inset-0 bg-linear-to-br" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1140px] px-6">
        {backLink}

        {icon ? (
          <div className="flex animate-[fade-up_0.6s_ease-out_both] items-center gap-4">
            <div className="border-brand-accent/60 bg-brand-accent/20 flex h-12 w-12 shrink-0 items-center justify-center border">
              {icon}
            </div>
            <div>
              <SectionLabel tone="light">{eyebrow}</SectionLabel>
              <h1 className="font-heading mt-1 text-[clamp(28px,4vw,42px)] leading-[1.05] font-bold tracking-tight text-white">
                {title}
              </h1>
            </div>
          </div>
        ) : (
          <>
            <SectionLabel
              tone="light"
              className="animate-[fade-up_0.6s_ease-out_both]"
            >
              {eyebrow}
            </SectionLabel>
            <h1 className="font-heading mt-4 max-w-3xl animate-[fade-up_0.6s_ease-out_both] text-[clamp(32px,4.5vw,48px)] leading-[1.05] font-bold tracking-tight text-white [animation-delay:80ms]">
              {title}
            </h1>
          </>
        )}

        {description && (
          <p className="mt-4 max-w-xl animate-[fade-up_0.6s_ease-out_both] text-sm leading-relaxed text-gray-300 [animation-delay:160ms]">
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
