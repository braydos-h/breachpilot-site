import type { MetadataRoute } from "next";
import docDates from "@/generated/doc-dates.json";
import { getAllDocSlugs } from "@/lib/docs";
import { META } from "@/lib/meta";
import { SITE } from "@/lib/site";
import staticRoutes from "@/lib/static-routes.json";

const STATIC_ROUTES = Object.keys(staticRoutes).filter((r) => r === "" || r.startsWith("/")); /* skip $comment */

const DATES: Record<string, string> = docDates as Record<string, string>;
const STATIC_SOURCES: Record<string, string[]> = staticRoutes as Record<string, string[]>;
const STATIC: Record<string, string> = (META.staticRoutes ?? {}) as Record<string, string>;

function validDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  const t = Date.parse(value);
  return Number.isNaN(t) ? undefined : new Date(t);
}

export { STATIC_ROUTES, STATIC_SOURCES };

export default function sitemap(): MetadataRoute.Sitemap {
  // Deterministic timestamps: upstream git commit time per doc, last-touching
  // commit per static page. Never the build clock — every page must not look
  // freshly updated on every deploy.
  // /docs/search is intentionally excluded: it is client-rendered thin
  // content (robots: noindex, see app/docs/search/page.tsx).
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: validDate(STATIC[route]),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/releases" ? 0.8 : 0.7,
  }));
  const docEntries: MetadataRoute.Sitemap = getAllDocSlugs().map((slug) => ({
    url: `${SITE.url}/docs/${slug}`,
    lastModified: validDate(DATES[slug]),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticEntries, ...docEntries];
}
