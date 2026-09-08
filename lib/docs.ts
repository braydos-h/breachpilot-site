import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";
import categories from "@/lib/doc-categories.json";
import { SITE } from "@/lib/site";
import { plainHeading, slugify } from "@/lib/slug";

const CONTENT_DIR = join(process.cwd(), "content", "docs");
const REPO_DOCS = join(process.cwd(), "..", "docs");

/**
 * Lean sidebar entry — deliberately excludes `body`/`headings`/`updatedFrom`.
 * sidebarGroups()/prevNext() feed client components, so every extra field is
 * serialized into each docs page's RSC payload (159 full bodies × every page).
 */
export type DocEntry = {
  slug: string;
  title: string;
  category: string;
  path: string;
};

export type DocContent = DocEntry & {
  headings: Array<{ id: string; text: string; level: number }>;
  body: string;
  updatedFrom: string;
  /** True when the body contains its own `# …` H1 — the page then skips its injected h1. */
  hasH1: boolean;
};

const CAT_RULES: Array<[RegExp, string]> = categories.rules.map((r) => [new RegExp(r.match), r.category]);
const CATEGORY_ORDER: string[] = categories.order;

function categoryFor(slug: string): string {
  const base = slug.split("/").pop() ?? slug;
  for (const [re, cat] of CAT_RULES) {
    if (re.test(base)) return cat;
  }
  return "Reference";
}

function titleFromFilename(file: string): string {
  return file
    .replace(/\.md$/, "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** Reject anything that could escape CONTENT_DIR: absolute, dot segments, escapes. */
function validSlug(slug: string): boolean {
  if (!slug || slug.includes("\\") || slug.includes("\0")) return false;
  if (slug.startsWith("/") || slug.includes(":") || slug.includes("?") || slug.includes("#")) return false;
  return !slug.split("/").some((seg) => seg === "" || seg === "." || seg === "..");
}

function listMarkdown(dir: string, base: string, out: string[]): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      listMarkdown(full, base, out);
    } else if (entry.endsWith(".md")) {
      const rel = relative(base, full).replace(/\\/g, "/").replace(/\.md$/, "");
      out.push(rel);
    }
  }
}

function readRaw(slug: string): { raw: string; source: string } {
  const synced = join(CONTENT_DIR, `${slug}.md`);
  if (existsSync(synced)) return { raw: readFileSync(synced, "utf8"), source: "repo docs (build sync)" };
  const repo = join(REPO_DOCS, `${slug}.md`);
  if (existsSync(repo)) return { raw: readFileSync(repo, "utf8"), source: "repo docs (live)" };
  throw new Error(`doc not found: ${slug}`);
}

/**
 * Extract title + h2/h3 headings from Markdown source.
 * Fence-aware (a `# ...` line inside a code block is not a heading) and
 * format-aware (plainHeading strips `[links]`, `*emphasis*`, `<html>` so the
 * TOC id matches the id components/markdown.tsx assigns the rendered
 * heading). Duplicate headings get `-1`, `-2` suffixes — same rule as the
 * renderer, iterated in the same order, so ids always agree.
 */
function extractMeta(content: string, slug: string): { title: string; headings: DocContent["headings"]; hasH1: boolean } {
  let title: string | null = null;
  let hasH1 = false;
  const headings: DocContent["headings"] = [];
  const seen = new Map<string, number>();
  const uniqueId = (base: string): string => {
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
  const lines = content.split("\n");
  let fence = false;
  let prevText: string | null = null;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      fence = !fence;
      prevText = null;
      continue;
    }
    if (fence) continue;
    const atx = line.match(/^(#{1,3})\s+(.+)/);
    if (atx) {
      const text = plainHeading(atx[2]);
      if (atx[1].length === 1) {
        hasH1 = true;
        if (title === null) title = text;
      } else {
        headings.push({ id: uniqueId(slugify(text)), text, level: atx[1].length });
      }
      prevText = null;
      continue;
    }
    // Setext h2 (`Title\n---`) — remark renders these as <h2>, so the TOC must too.
    if (/^---+$/.test(line.trim()) && prevText) {
      const text = plainHeading(prevText);
      headings.push({ id: uniqueId(slugify(text)), text, level: 2 });
      prevText = null;
      continue;
    }
    prevText = line.trim() ? line : null;
  }
  return { title: title ?? titleFromFilename(slug.split("/").pop() ?? slug), headings, hasH1 };
}

function parseDoc(slug: string): DocContent {
  const { raw, source } = readRaw(slug);
  // Strip a UTF-8 BOM: it would otherwise hide a leading `# …` H1 from
  // title/heading extraction and leak into the rendered output.
  const { content } = matter(raw.replace(/^\uFEFF/, ""));
  const { title, headings, hasH1 } = extractMeta(content, slug);
  return {
    slug,
    title,
    category: categoryFor(slug),
    path: `/docs/${slug}`,
    headings,
    body: content,
    updatedFrom: source,
    hasH1,
  };
}

let allCache: DocContent[] | null = null;
const docCache = new Map<string, DocContent | null>();

export function getAllDocs(): DocContent[] {
  if (allCache) return allCache;
  const slugs: string[] = [];
  listMarkdown(CONTENT_DIR, CONTENT_DIR, slugs);
  if (slugs.length === 0) listMarkdown(REPO_DOCS, REPO_DOCS, slugs);
  const docs: DocContent[] = [];
  for (const slug of slugs) {
    try {
      const doc = parseDoc(slug);
      docs.push(doc);
      docCache.set(slug, doc);
    } catch (err) {
      // Never silently drop a doc: a broken file must fail the build loudly
      // in CI, not vanish from nav/search/counts.
      console.error(`docs: skipping unparseable ${slug}: ${(err as Error).message}`);
    }
  }
  allCache = docs.sort((a, b) => a.slug.localeCompare(b.slug));
  return allCache;
}

export function getAllDocSlugs(): string[] {
  return getAllDocs().map((d) => d.slug);
}

export function getDoc(rawSlug: string): DocContent | null {
  const slug = rawSlug.normalize().replace(/\\/g, "/");
  if (!validSlug(slug)) return null;
  const cached = docCache.get(slug);
  if (cached !== undefined) return cached;
  try {
    const doc = parseDoc(slug);
    docCache.set(slug, doc);
    return doc;
  } catch {
    docCache.set(slug, null);
    return null;
  }
}

export function sidebarGroups(): Array<{ category: string; docs: DocEntry[] }> {
  const groups = new Map<string, DocEntry[]>();
  for (const d of getAllDocs()) {
    const list = groups.get(d.category) ?? [];
    list.push({ slug: d.slug, title: d.title, category: d.category, path: d.path });
    groups.set(d.category, list);
  }
  return CATEGORY_ORDER.filter((c) => groups.has(c)).map((category) => ({
    category,
    docs: (groups.get(category) ?? []).sort((a, b) => a.title.localeCompare(b.title)),
  }));
}

export function prevNext(slug: string): { prev: DocEntry | null; next: DocEntry | null } {
  const flat = sidebarGroups().flatMap((g) => g.docs);
  const i = flat.findIndex((d) => d.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: flat[i - 1] ?? null, next: flat[i + 1] ?? null };
}

/**
 * Resolve an upstream-authored relative `.md` href (e.g. `api/auth.md`,
 * `../safety-model.md`, `docs/README.md`) against the synced slugs.
 * Returns the target slug, or null when the link points outside the synced
 * tree (the renderer then links the upstream GitHub file instead of 404ing).
 */
export function resolveDocSlug(slug: string, href: string): string | null {
  if (!href || href.startsWith("#") || href.startsWith("/") || !href.includes(".md")) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)) return null;
  const path = href.split("#")[0].split("?")[0];
  if (!/(^|\/)[^/]*\.md$/.test(path)) return null;
  const base = slug.includes("/") ? slug.slice(0, slug.lastIndexOf("/")) : "";
  const stack: string[] = [];
  for (const part of (base ? `${base}/${path}` : path).split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (stack.length > 0) stack.pop();
      continue;
    }
    stack.push(part);
  }
  let res = stack.join("/");
  if (res.endsWith(".md")) res = res.slice(0, -3);
  const slugs = getAllDocSlugs();
  if (slugs.includes(res)) return res;
  if (res.startsWith("docs/") && slugs.includes(res.slice(5))) return res.slice(5);
  const lower = res.toLowerCase();
  for (const s of slugs) {
    if (s.toLowerCase() === lower) return s;
    if (lower.startsWith("docs/") && s.toLowerCase() === lower.slice(5)) return s;
  }
  return null;
}

/** Upstream GitHub URL for a doc-relative href that has no synced target. */
export function upstreamDocUrl(slug: string, href: string): string | null {
  const path = href.split("#")[0].split("?")[0];
  const anchor = href.includes("#") ? href.slice(href.indexOf("#")) : "";
  const base = slug.includes("/") ? slug.slice(0, slug.lastIndexOf("/")) : "";
  const stack: string[] = [];
  // A `..` that pops past the docs root escapes to the repo root
  // (e.g. `../README.md` from a top-level doc means the repo README).
  let rooted = true;
  for (const part of (base ? `${base}/${path}` : path).split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (stack.length > 0) stack.pop();
      else rooted = false;
      continue;
    }
    stack.push(part);
  }
  const rel = stack.join("/");
  if (!rel) return null;
  const prefix = rooted ? "docs/" : "";
  return `${SITE.repo}/blob/main/${prefix}${rel}${anchor}`;
}
