import type { MetadataRoute } from "next";
import { getAllDocSlugs } from "@/lib/docs";
import docDates from "@/generated/doc-dates.json";
import { META } from "@/lib/meta";
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
  "/releases",
];

const DATES: Record<string, string> = docDates as Record<string, string>;
const STATIC: Record<string, string> = (META.staticRoutes ?? {}) as Record<string, string>;

export default function sitemap(): MetadataRoute.Sitemap {
  // Deterministic timestamps: upstream git commit time per doc, last-touching
  // commit per static page. Never the build clock — every page must not look
  // freshly updated on every deploy.
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: STATIC[route] ? new Date(STATIC[route]) : undefined,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/releases" ? 0.8 : 0.7,
  }));
  const docEntries: MetadataRoute.Sitemap = getAllDocSlugs().map((slug) => ({
    url: `${SITE.url}/docs/${slug}`,
    lastModified: DATES[slug] ? new Date(DATES[slug]) : undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticEntries, ...docEntries];
}
