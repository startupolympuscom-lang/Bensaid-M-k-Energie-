import { HeroRibbon } from "@/components/graphics/HeroRibbon";
import { ButtonLink } from "@/components/ui/Button";
import { Parallax } from "@/components/ui/Parallax";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

type HeroProps = {
  eyebrow: string;
  titleLines: string[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export function Hero({ eyebrow, titleLines, description, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      // Slides under the transparent header so the ribbon can reach the top edge.
      className="relative -mt-(--header-h) overflow-x-clip pt-(--header-h)"
    >
      <div className="container-page relative z-10">
        <div className="max-w-[36rem] pt-12 sm:pt-20 lg:max-w-[42rem] lg:pt-28 xl:pt-32">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>

          <h1 id="hero-title" className="type-display mt-7 lg:mt-8">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="type-lead mt-6 max-w-[33rem] lg:mt-8">{description}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3 lg:mt-11 lg:gap-4">
            <ButtonLink href={primaryCta.href} arrow>
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="secondary">
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="hero-ribbon z-0">
        <Parallax className="h-full w-full">
          <HeroRibbon className="animate-ribbon-in" />
        </Parallax>
      </div>
    </section>
  );
}
