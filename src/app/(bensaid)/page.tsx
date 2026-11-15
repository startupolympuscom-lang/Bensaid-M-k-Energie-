import type { Metadata } from "next";
import gasStorage from "@/assets/images/gas-storage.jpg";
import solar from "@/assets/images/solar.jpg";
import { About } from "@/components/sections/About";
import { ActivitiesGrid } from "@/components/sections/ActivitiesGrid";
import { CTASection } from "@/components/sections/CTASection";
import { EditorialSplit } from "@/components/sections/EditorialSplit";
import { Hero } from "@/components/sections/Hero";
import { Sectors } from "@/components/sections/Sectors";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { activities, sectors } from "@/content/activities";
import {
  aboutSection,
  activitiesSection,
  ctaSection,
  engagementSection,
  hero,
  sectorsSection,
} from "@/content/home";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero {...hero} />

      <ActivitiesGrid
        id={activitiesSection.id}
        eyebrow={activitiesSection.eyebrow}
        title={activitiesSection.title}
        activities={activities}
      />

      <EditorialSplit
        id={engagementSection.id}
        labelledBy={`${engagementSection.id}-title`}
        image={gasStorage}
        imageAlt={engagementSection.image.alt}
        imagePosition="left"
        aspectClassName="aspect-[16/10] sm:aspect-[2/1] lg:aspect-[2.1/1]"
        objectPositionClassName="object-[62%_50%]"
      >
        <SectionEyebrow>{engagementSection.eyebrow}</SectionEyebrow>
        <h2 id={`${engagementSection.id}-title`} className="type-h2 mt-6 max-w-[16ch]">
          {engagementSection.title}
        </h2>
        <p className="type-lead mt-6 max-w-[30rem]">{engagementSection.description}</p>
      </EditorialSplit>

      <Sectors
        id={sectorsSection.id}
        eyebrow={sectorsSection.eyebrow}
        title={sectorsSection.title}
        sectors={sectors}
        image={solar}
        imageAlt={sectorsSection.image.alt}
      />

      <About {...aboutSection} />

      <CTASection {...ctaSection} />
    </>
  );
}
