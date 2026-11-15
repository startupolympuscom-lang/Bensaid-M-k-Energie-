import { ChemText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import type { Activity } from "@/content/activities";
import { cn } from "@/lib/cn";

type ActivitiesGridProps = {
  id?: string;
  eyebrow: string;
  title: string;
  activities: Activity[];
  /** Heading level for the section title (h2 on the homepage). */
  headingLevel?: "h2" | "h3";
};

/** Four text-first activity cards, differentiated only by a short accent line. */
export function ActivitiesGrid({
  id,
  eyebrow,
  title,
  activities,
  headingLevel: Heading = "h2",
}: ActivitiesGridProps) {
  const titleId = `${id ?? "activites"}-title`;
  const CardHeading = Heading === "h2" ? "h3" : "h4";

  return (
    <section id={id} aria-labelledby={titleId} className="section-pt relative z-10">
      <div className="container-page">
        <Reveal>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <Heading id={titleId} className="type-h2 mt-6 max-w-[17ch]">
            {title}
          </Heading>
        </Reveal>

        <ul className="mt-11 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {activities.map((activity, index) => (
            <Reveal
              as="li"
              key={activity.id}
              delay={index * 70}
              className="flex flex-col rounded-card border border-line/80 bg-offwhite px-7 pt-8 pb-9 shadow-[0_1px_2px_rgb(23_27_29/0.03),0_12px_32px_-18px_rgb(23_27_29/0.10)] sm:min-h-[13rem] lg:min-h-[16rem] lg:px-7 lg:pt-9 xl:px-8"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block h-[3px] w-8 rounded-full",
                  activity.accent === "orange" ? "bg-orange" : "bg-teal",
                )}
              />
              <CardHeading className="type-h3 mt-6 sm:mt-8 lg:mt-10">{activity.title}</CardHeading>
              <p className="mt-3 max-w-[24ch] text-base leading-relaxed text-ink-muted xl:text-[1.0625rem]">
                <ChemText>{activity.description}</ChemText>
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
