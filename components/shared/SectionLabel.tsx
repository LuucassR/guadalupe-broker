import { ReactNode } from "react"

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-[11px] font-bold uppercase tracking-[0.1em] text-brand-rose">
      {children}
    </span>
  )
}
