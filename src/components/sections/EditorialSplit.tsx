import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type EditorialSplitProps = {
  id?: string;
  labelledBy?: string;
  image: StaticImageData;
  imageAlt: string;
  imagePosition?: "left" | "right";
  /** Aspect ratio classes for the photograph container. */
  aspectClassName?: string;
  /** Focal point for cropping on narrow screens. */
  objectPositionClassName?: string;
  children: ReactNode;
};

/**
 * Two-column editorial composition: a large rounded photograph and a block
 * of typography. Stacks to a full-width image on mobile.
 */
export function EditorialSplit({
  id,
  labelledBy,
  image,
  imageAlt,
  imagePosition = "left",
  aspectClassName = "aspect-[16/10] sm:aspect-[2/1]",
  objectPositionClassName = "object-center",
  children,
}: EditorialSplitProps) {
  const imageRight = imagePosition === "right";

  return (
    <section id={id} aria-labelledby={labelledBy} className="section-pt">
      <div className="container-page grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-10">
        <Reveal
          className={cn(
            imageRight ? "lg:order-2 lg:col-span-7 lg:col-start-6" : "lg:col-span-6 lg:col-start-1",
          )}
        >
          <div
            className={cn("relative overflow-hidden rounded-media bg-gray-light", aspectClassName)}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              placeholder="blur"
              quality={85}
              sizes="(min-width: 1440px) 720px, (min-width: 1024px) 52vw, 100vw"
              className={cn("object-cover", objectPositionClassName)}
            />
          </div>
        </Reveal>

        <Reveal
          delay={90}
          className={cn(
            imageRight ? "lg:order-1 lg:col-span-5 lg:col-start-1" : "lg:col-span-5 lg:col-start-8",
          )}
        >
          {children}
        </Reveal>
      </div>
    </section>
  );
}
