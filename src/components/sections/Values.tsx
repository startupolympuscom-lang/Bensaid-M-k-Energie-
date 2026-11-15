import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

type ValuesProps = {
  eyebrow: string;
  title: string;
  items: { title: string; description: string }[];
};

/** Brand values from the graphic charter, set as a quiet typographic index. */
export function Values({ eyebrow, title, items }: ValuesProps) {
  return (
    <section aria-labelledby="valeurs-title" className="section-pt">
      <div className="container-page">
        <Reveal>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 id="valeurs-title" className="type-h2 mt-6 max-w-[16ch]">
            {title}
          </h2>
        </Reveal>
        <ol className="mt-11 grid gap-x-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              delay={index * 70}
              className="border-t border-line pt-6 pb-8"
            >
              <span
                aria-hidden="true"
                className="font-heading text-xs font-semibold tracking-[0.2em] text-ink-subtle"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="type-h3 mt-4">{item.title}</h3>
              <p className="mt-2.5 max-w-[26ch] text-base leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
