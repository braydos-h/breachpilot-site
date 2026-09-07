import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = join(process.cwd(), "content", "docs");
const REPO_DOCS = join(process.cwd(), "..", "docs");

/**
 * Lean sidebar entry — deliberately excludes `body`/`headings`/`updatedFrom`.
 * sidebarGroups()/prevNext() feed client components, so every extra field is
 * serialized into each docs page's RSC payload (117 full bodies × every page).
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
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function titleFromFilename(file: string): string {
  return file
    .replace(/\.md$/, "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const CATEGORY_RULES: Array<[RegExp, string]> = [
  [/^(getting-started|tutorial|deployment|troubleshooting)$/, "Getting Started"],
  [/^(architecture|runtime-flows|safety-model|outcome-evidence|database-mission|sandbox)$/, "Core Concepts"],
  [/^(exploit-agent|swarm|skills|skill-authoring|prompts)$/, "Agent"],
  [/^(mcp-tools|mcp-wiring|attack-modules|browser-agent-design)$/, "Tooling"],
  [/^(webui|api|cli-reference|config-reference)$/, "Platform"],
  [/^(plugin-development|extension-guide|providers|provider-development)$/, "Extensibility"],
  [/^(testing-guide|evaluation|benchmarks|module-guide|glossary)$/, "Engineering"],
];

const CATEGORY_ORDER = [
  "Getting Started",
  "Core Concepts",
  "Agent",
  "Tooling",
  "Platform",
  "Extensibility",
  "Engineering",
  "Reference",
];

function categoryFor(slug: string): string {
  const base = slug.split("/").pop() ?? slug;
  for (const [re, cat] of CATEGORY_RULES) {
    if (re.test(base)) return cat;
  }
  return "Reference";
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

function parseDoc(slug: string): DocContent {
  const { raw, source } = readRaw(slug);
  const { content } = matter(raw);
  const lines = content.split("\n");
  let title = titleFromFilename(slug.split("/").pop() ?? slug);
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)/);
    if (m) {
      title = m[1].trim();
      break;
    }
  }
  const headings: DocContent["headings"] = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (m) headings.push({ id: slugify(m[2]), text: m[2].trim(), level: m[1].length });
  }
  return {
    slug,
    title,
    category: categoryFor(slug),
    path: `/docs/${slug}`,
    headings,
    body: content,
    updatedFrom: source,
  };
}

let cache: DocContent[] | null = null;

export function getAllDocs(): DocContent[] {
  if (cache) return cache;
  const slugs: string[] = [];
  listMarkdown(CONTENT_DIR, CONTENT_DIR, slugs);
  if (slugs.length === 0) listMarkdown(REPO_DOCS, REPO_DOCS, slugs);
  cache = slugs
    .map((slug) => {
      try {
        return parseDoc(slug);
      } catch {
        return null;
      }
    })
    .filter((d): d is DocContent => d !== null)
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return cache;
}

export function getAllDocSlugs(): string[] {
  return getAllDocs().map((d) => d.slug);
}

export function getDoc(slug: string): DocContent | null {
  try {
    return parseDoc(slug.normalize().replace(/\\/g, "/"));
  } catch {
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
