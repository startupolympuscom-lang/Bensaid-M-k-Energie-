import Image from "next/image";
import Link from "next/link";
import dispenser from "@/assets/dispagaz/distributeur-automatique.jpg";
import { DispagazSwoosh } from "@/components/dispagaz/DispagazSwoosh";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { dispagaz } from "@/config/dispagaz";
import {
  dispagazCta,
  dispagazDistribution,
  dispagazFeatures,
  dispagazSolutions,
} from "@/content/dispagaz";
import { cn } from "@/lib/cn";

/** "Nos solutions" — three solution cards, the ERP featured. */
export function DispagazSolutions() {
  const { id, eyebrow, title, description, items } = dispagazSolutions;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-pt section-pb bg-offwhite">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
        <Reveal className="lg:col-span-5">
          <SectionEyebrow tone="accent">{eyebrow}</SectionEyebrow>
          <h2 id={`${id}-title`} className="type-h2 mt-6 max-w-[15ch] font-bold xl:text-[3.25rem]">
            {title}
          </h2>
          <p className="type-lead mt-6 max-w-[28rem]">{description}</p>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
          {items.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 70}>
              <Link
                href={item.href}
                className={cn(
                  "group flex h-full min-h-[12rem] flex-col rounded-card border px-6 pt-8 pb-7 transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline-orange-deep sm:min-h-[14rem] lg:min-h-[15.5rem] lg:px-7 lg:pt-9",
                  item.featured
                    ? "border-orange-deep/40 bg-[#fff4ea] shadow-[0_18px_40px_-28px_rgb(255_107_0/0.55)]"
                    : "border-line bg-white hover:border-orange-deep/35 hover:bg-[#fffaf5]",
                )}
              >
                <h3 className="font-heading text-[clamp(1.35rem,1.05rem+0.8vw,1.6rem)] leading-[1.12] font-bold tracking-[-0.025em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-muted xl:text-[1.0625rem]">
                  {item.description}
                </p>
                {item.note ? (
                  <p className="mt-3 mb-6 text-sm leading-snug font-medium text-orange-text">
                    {item.note}
                  </p>
                ) : null}
                <span
                  aria-hidden="true"
                  className="mt-auto block h-[3px] w-8 shrink-0 rounded-full bg-orange-deep transition-[width] duration-300 ease-soft group-hover:w-12"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Fonctionnalités" — the ERP modules as a quiet typographic index. */
export function DispagazFeatures() {
  const { id, eyebrow, title, description, items } = dispagazFeatures;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-pt">
      <div className="container-page">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-6">
            <SectionEyebrow tone="accent">{eyebrow}</SectionEyebrow>
            <h2
              id={`${id}-title`}
              className="type-h2 mt-6 max-w-[16ch] font-bold xl:text-[3.25rem]"
            >
              {title}
            </h2>
          </div>
          <p className="type-lead max-w-[30rem] lg:col-span-5 lg:col-start-8">{description}</p>
        </Reveal>

        <ol className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              delay={(index % 3) * 70}
              className="border-t border-line pt-6 pb-9"
            >
              <span
                aria-hidden="true"
                className="font-heading text-xs font-semibold tracking-[0.2em] text-orange-text"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="type-h3 mt-4">{item.title}</h3>
              <p className="mt-2.5 max-w-[30ch] text-base leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** "Distribution automatique 24/7" — the dispenser photograph and how it works. */
export function DispagazDistribution() {
  const { id, eyebrow, title, description, steps, image } = dispagazDistribution;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-pt">
      <div className="container-page grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-10">
        <Reveal className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-media bg-gray-light">
            <Image
              src={dispenser}
              alt={image.alt}
              fill
              placeholder="blur"
              quality={85}
              sizes="(min-width: 1440px) 760px, (min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={90} className="lg:col-span-5">
          <SectionEyebrow tone="accent">{eyebrow}</SectionEyebrow>
          <h2 id={`${id}-title`} className="type-h2 mt-6 max-w-[15ch] font-bold xl:text-[3rem]">
            {title}
          </h2>
          <p className="type-lead mt-6 max-w-[30rem]">{description}</p>
          <ol className="mt-9 space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-deep font-heading text-sm font-bold text-charcoal"
                >
                  {index + 1}
                </span>
                <div className="pt-1">
                  <h3 className="font-heading text-[1.0625rem] font-semibold">{step.title}</h3>
                  <p className="mt-1 text-base leading-relaxed text-ink-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

/** Dark closing banner with orange swooshes. */
export function DispagazCTA() {
  const { title, description } = dispagazCta;
  return (
    <section aria-labelledby="dz-cta-title" className="section-pt pb-16 sm:pb-20 lg:pb-28">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-banner bg-night px-7 pt-12 pb-36 text-white sm:px-12 sm:py-14 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(90%_120%_at_0%_0%,#2b3033_0%,#171b1d_55%,#101214_100%)]"
          />
          <DispagazSwoosh
            idPrefix="dz-cta"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38%] w-full opacity-80 sm:top-0 sm:h-full"
          />
          <div className="max-w-[34rem]">
            <h2
              id="dz-cta-title"
              className="font-heading text-[clamp(1.9rem,1.3rem+2vw,2.9rem)] leading-[1.1] font-bold tracking-[-0.03em] text-white"
            >
              {title}
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-white/75 lg:text-lg">
              {description}
            </p>
            <div className="mt-9">
              <ButtonLink href={dispagaz.demoHref} variant="accent" arrow>
                Demander une démo
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
