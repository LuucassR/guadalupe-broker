import { TIMELINE } from "@/constants/site";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";

export default function PinnedShowcase() {
  return (
    <section className="bg-brand-dark relative py-20 md:py-24">
      <div className="mx-auto max-w-300 px-6">
        <div className="mb-14 max-w-2xl">
          <SectionLabel tone="purple">Por que nosotros</SectionLabel>
          <SectionTitle tone="light" className="mt-4">
            Tres generaciones protegiendo a Santa Fe
          </SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            No solo vendemos polizas. Construimos relaciones de confianza que
            atraviesan generaciones en toda la provincia.
          </p>
        </div>

        <ol className="border-white/15 relative ml-1.5 border-l md:ml-3">
          {TIMELINE.map((item) => (
            <li
              key={item.year}
              className="relative pb-10 pl-8 last:pb-0 md:pl-12"
            >
              <span
                aria-hidden
                className="bg-brand-purple ring-brand-dark absolute top-1.5 -left-1.75 h-3.5 w-3.5 rounded-full ring-4"
              />
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                <span className="text-brand-purple font-heading text-3xl leading-none font-bold md:w-28 md:shrink-0 md:text-4xl">
                  {item.year}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
