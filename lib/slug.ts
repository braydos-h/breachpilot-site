/**
 * Shared slug helper — the single source of truth for heading anchors.
 *
 * lib/docs.ts (build-time heading extraction) and components/markdown.tsx
 * (render-time heading ids) must produce identical ids or "On this page"
 * links silently break. Both import from here.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Strip inline Markdown/HTML formatting from a heading source line so the
 * sidebar TOC (which sees source text like `## [Foo](bar.md)`) slugs the
 * same id as the renderer (which sees the rendered text `Foo`).
 */
export function plainHeading(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}
