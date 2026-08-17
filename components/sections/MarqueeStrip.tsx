import InsurerBadges from "@/components/shared/InsurerBadges";

export default function MarqueeStrip() {
  return (
    <section className="border-t border-b border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-300 px-6">
        <p className="mb-6 text-center text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
          Companias aliadas
        </p>
        <InsurerBadges />
      </div>
    </section>
  );
}
