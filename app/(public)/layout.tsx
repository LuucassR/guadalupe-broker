import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/layout/WhatsAppFAB";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-full flex-1 overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
