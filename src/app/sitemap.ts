import type { MetadataRoute } from "next";
import { absoluteUrl, contentLastUpdated } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${contentLastUpdated}T00:00:00.000Z`);
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/a-propos"), lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.8 },
  ];
}
