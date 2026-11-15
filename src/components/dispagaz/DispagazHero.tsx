import { DashboardMockup } from "@/components/dispagaz/DashboardMockup";
import { DispagazSwoosh } from "@/components/dispagaz/DispagazSwoosh";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { PlayIcon } from "@/components/ui/Icons";
import { dispagaz } from "@/config/dispagaz";
import { dispagazHero } from "@/content/dispagaz";
import { isProvided } from "@/lib/company";

export function DispagazHero() {
  const { badge, title, description, secondaryCta, mockupCaption } = dispagazHero;
  const hasVideo = isProvided(dispagaz.videoUrl);

  return (
    <section
      aria-labelledby="dz-hero-title"
      className="relative isolate -mt-(--header-h) overflow-hidden bg-night pt-(--header-h) text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(110%_80%_at_12%_0%,#2b3033_0%,#171b1d_48%,#101214_100%)]"
      />
      <DispagazSwoosh
        idPrefix="dz-hero"
        // Phones/tablets: kept to the lower part, behind the laptop, never behind the text.
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[40%] w-full opacity-90 lg:top-0 lg:h-full"
      />

      <div className="container-page grid items-center gap-14 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:pt-20 lg:pb-24 xl:pb-28">
        {/* Container: on desktop the headline is sized to this column (cqw) so
            "Digitalisez et pilotez" (≈9.9em) always holds on one line. */}
        <div className="@container max-w-[38rem] lg:max-w-none">
          <p className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.9375rem] text-white/85 backdrop-blur-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-orange-deep" />
            {badge}
          </p>

          <h1
            id="dz-hero-title"
            className="mt-7 font-heading text-[clamp(2.3rem,1.5rem+3.2vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.035em] text-white lg:text-[min(4.4rem,9.6cqw)]"
          >
            {title.lead.map((line) => (
              <span key={line} className="lg:block">
                {line}{" "}
              </span>
            ))}
            <span className="block text-orange-deep">{title.highlight}</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-[1.125rem] leading-relaxed text-white/75 lg:text-[1.25rem]">
            {description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 lg:mt-11 lg:gap-4">
            <ButtonLink href={dispagaz.demoHref} variant="accent" arrow>
              Demander une démo
            </ButtonLink>
            {hasVideo ? (
              <a
                href={dispagaz.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("outlineDark")}
              >
                <PlayIcon width={20} height={20} />
                <span>Voir la vidéo</span>
              </a>
            ) : (
              <ButtonLink href={secondaryCta.href} variant="outlineDark">
                {secondaryCta.label}
              </ButtonLink>
            )}
          </div>
        </div>

        <div className="relative">
          <DashboardMockup
            caption={mockupCaption}
            className="lg:origin-left lg:[transform:perspective(2400px)_rotateY(-9deg)_rotateX(2deg)]"
          />
        </div>
      </div>
    </section>
  );
}
