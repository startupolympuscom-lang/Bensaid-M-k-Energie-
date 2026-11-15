import { CtaWave } from "@/components/graphics/CtaWave";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

type CTASectionProps = {
  title: string;
  description: string;
  cta: { label: string; href: string };
};

/** Wide charcoal banner with rounded corners and a very subtle wave. */
export function CTASection({ title, description, cta }: CTASectionProps) {
  return (
    <section aria-labelledby="cta-title" className="section-pt pb-16 sm:pb-20 lg:pb-28">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-banner bg-charcoal px-7 py-11 sm:px-12 sm:py-12 lg:px-16 lg:py-14">
          <CtaWave className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[70%] w-auto opacity-80 sm:h-full" />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-12">
            <h2
              id="cta-title"
              className="max-w-[16ch] font-heading text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.025em] text-white sm:text-[2rem] lg:text-[2.15rem]"
            >
              {title}
            </h2>
            <span aria-hidden="true" className="hidden h-16 w-px bg-white/15 lg:block" />
            <p className="max-w-[30rem] text-[1.0625rem] leading-relaxed text-white/72">
              {description}
            </p>
            <div className="pt-2 lg:pt-0">
              <ButtonLink href={cta.href} variant="light" arrow>
                {cta.label}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
