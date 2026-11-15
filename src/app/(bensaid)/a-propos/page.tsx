import type { Metadata } from "next";
import Image from "next/image";
import gasStorage from "@/assets/images/gas-storage.jpg";
import solar from "@/assets/images/solar.jpg";
import { ActivitiesGrid } from "@/components/sections/ActivitiesGrid";
import { CTASection } from "@/components/sections/CTASection";
import { Sectors } from "@/components/sections/Sectors";
import { Values } from "@/components/sections/Values";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { aboutPage } from "@/content/about";
import { activities, sectors } from "@/content/activities";
import { ctaSection, sectorsSection } from "@/content/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: aboutPage.metaTitle,
  description: aboutPage.metaDescription,
  path: "/a-propos",
});

export default function AboutPage() {
  const [lead, ...rest] = aboutPage.intro;

  return (
    <>
      <section aria-labelledby="about-title" className="pt-12 sm:pt-16 lg:pt-24">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-6">
              <SectionEyebrow>{aboutPage.eyebrow}</SectionEyebrow>
              <h1 id="about-title" className="type-h1 mt-7">
                {aboutPage.title}
              </h1>
            </div>
            <div className="lg:col-span-6 lg:pt-14">
              <p className="type-lead text-ink-soft">{lead}</p>
              {rest.map((paragraph) => (
                <p key={paragraph} className="type-body mt-5">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="relative mt-14 aspect-[16/10] overflow-hidden rounded-media bg-gray-light sm:aspect-[2/1] lg:mt-20 lg:aspect-[2.25/1]">
            <Image
              src={gasStorage}
              alt={aboutPage.image.alt}
              fill
              preload
              placeholder="blur"
              quality={85}
              sizes="(min-width: 1440px) 1240px, 100vw"
              className="object-cover object-[62%_50%]"
            />
          </div>
        </div>
      </section>

      <ActivitiesGrid
        id={aboutPage.activities.id}
        eyebrow={aboutPage.activities.eyebrow}
        title={aboutPage.activities.title}
        activities={activities}
      />

      <Values {...aboutPage.values} />

      <Sectors
        eyebrow={sectorsSection.eyebrow}
        title={sectorsSection.title}
        sectors={sectors}
        image={solar}
        imageAlt={sectorsSection.image.alt}
      />

      <CTASection {...ctaSection} />
    </>
  );
}
