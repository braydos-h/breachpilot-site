import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/**
 * Route metadata with canonical + Open Graph URL always in agreement.
 * Every page passes its own path so shares/likes advertise the page URL,
 * not the homepage (the root layout only sets site-wide defaults).
 */
export function routeMetadata(path: string, meta: Omit<Metadata, "alternates" | "openGraph"> & { openGraph?: Omit<NonNullable<Metadata["openGraph"]>, "url"> }): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    ...meta,
    alternates: { canonical: url },
    openGraph: { ...(meta.openGraph ?? {}), url },
  };
}
