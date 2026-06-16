import { ReactNode } from "react"

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-brand-rose">
      {children}
    </span>
  )
}
