import { ReactNode } from "react";

export default function SectionLabel({
  children,
  tone = "accent",
  className = "",
}: {
  children: ReactNode;
  tone?: "accent" | "purple" | "light";
  className?: string;
}) {
  const toneClass =
    tone === "purple"
      ? "text-brand-purple"
      : tone === "light"
        ? "text-white/70"
        : "text-brand-accent";

  return (
    <span
      className={`inline-block text-[11px] font-bold tracking-[0.2em] uppercase ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
}
