import Sidebar from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/admin/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <>
      <Sidebar user={{ name: user.name, email: user.email, role: user.role }} />
      <main className="lg:pl-64 print:pl-0">
        <div className="mx-auto max-w-400 px-4 py-8 sm:px-8 sm:py-10 print:max-w-none print:p-0">{children}</div>
      </main>
    </>
  );
}
