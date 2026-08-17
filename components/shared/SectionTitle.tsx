import { ReactNode, ElementType } from "react";

export default function SectionTitle({
  children,
  as: Tag = "h2",
  tone = "dark",
  size = "lg",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  tone?: "dark" | "light";
  size?: "lg" | "md";
  className?: string;
}) {
  const toneClass = tone === "light" ? "text-white" : "text-brand-dark";
  const sizeClass =
    size === "md"
      ? "text-[clamp(22px,3vw,28px)]"
      : "text-[clamp(28px,3.5vw,40px)]";

  return (
    <Tag
      className={`font-heading leading-[1.08] font-bold tracking-[-0.02em] ${sizeClass} ${toneClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
