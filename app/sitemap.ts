import type { MetadataRoute } from "next";
import { getAllDocSlugs } from "@/lib/docs";
import { SITE } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/features",
  "/features/swarm",
  "/architecture",
  "/providers",
  "/plugins",
  "/benchmarks",
  "/safety",
  "/install",
  "/docs",
  "/contributing",
  "/security",
  "/privacy",
  "/legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
  const docEntries: MetadataRoute.Sitemap = getAllDocSlugs().map((slug) => ({
    url: `${SITE.url}/docs/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticEntries, ...docEntries];
}
