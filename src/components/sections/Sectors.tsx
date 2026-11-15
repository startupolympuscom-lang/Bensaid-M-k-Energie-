import type { StaticImageData } from "next/image";
import { EditorialSplit } from "@/components/sections/EditorialSplit";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

type SectorsProps = {
  id?: string;
  eyebrow: string;
  title: string;
  sectors: string[];
  image: StaticImageData;
  imageAlt: string;
};

/**
 * Sectors shown simply as text, separated by thin vertical rules.
 * The leading rule of each wrapped line is clipped by the wrapper, so the
 * separators always sit *between* items whatever the screen width.
 */
export function Sectors({
  id = "secteurs",
  eyebrow,
  title,
  sectors,
  image,
  imageAlt,
}: SectorsProps) {
  const titleId = `${id}-title`;

  return (
    <EditorialSplit
      id={id}
      labelledBy={titleId}
      image={image}
      imageAlt={imageAlt}
      imagePosition="right"
      aspectClassName="aspect-[16/9] sm:aspect-[2.4/1] lg:aspect-[2.6/1]"
      objectPositionClassName="object-[30%_50%]"
    >
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h2 id={titleId} className="type-h2 mt-6 max-w-[15ch]">
        {title}
      </h2>
      <div className="mt-8 overflow-hidden lg:mt-10">
        <ul className="-ml-[calc(1rem+1px)] flex flex-wrap gap-y-3.5 text-[1.0625rem] text-ink-soft xl:text-[1.125rem]">
          {sectors.map((sector) => (
            <li key={sector} className="mr-4 border-l border-charcoal/20 pl-4 leading-[1.15]">
              {sector}
            </li>
          ))}
        </ul>
      </div>
    </EditorialSplit>
  );
}
