import { TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

type AboutProps = {
  id?: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  link?: { label: string; href: string };
};

/** Compact editorial introduction — no statistics, no cards, no icon lists. */
export function About({ id = "a-propos", eyebrow, title, paragraphs, link }: AboutProps) {
  const titleId = `${id}-title`;
  const [lead, ...rest] = paragraphs;

  return (
    <section id={id} aria-labelledby={titleId} className="section-pt">
      <div className="container-page">
        <Reveal className="grid gap-8 border-t border-line pt-12 lg:grid-cols-12 lg:gap-x-10 lg:pt-16">
          <div className="lg:col-span-5">
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h2 id={titleId} className="type-h2 mt-6">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-12">
            {lead ? <p className="type-lead text-ink-soft">{lead}</p> : null}
            {rest.map((paragraph) => (
              <p key={paragraph} className="type-body mt-5">
                {paragraph}
              </p>
            ))}
            {link ? (
              <TextLink href={link.href} className="mt-9">
                {link.label}
              </TextLink>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
