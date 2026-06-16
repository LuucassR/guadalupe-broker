import { ReactNode } from "react"

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[clamp(28px,3.5vw,32px)] font-bold -tracking-[0.02em] text-text-primary">
      {children}
    </h2>
  )
}
