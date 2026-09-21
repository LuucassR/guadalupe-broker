import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel | Guadalupe Broker",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-900">{children}</div>;
}
