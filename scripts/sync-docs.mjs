/**
 * Sync repository Markdown into content/docs at build time.
 * Single source of truth stays in the upstream BreachPilot repo
 * (docs/ + README.md); the site renders from the synced copies so docs
 * never drift. Categories come from lib/doc-categories.json — edit there,
 * not here.
 *
 * Also resolves every relative `.md` link against the synced slugs and
 * reports the ones that point nowhere, and builds public/search-index.json
 * (frontmatter-aware titles, code kept searchable, hyphen-safe tokenizing
 * is handled client-side in components/search-results.tsx).
 *
 * Usage: node scripts/sync-docs.mjs
 * Fails when the upstream checkout is missing only with STRICT_DOCS=1
 * (CI sets it); otherwise reuses the committed content/docs fallback.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import matter from "gray-matter";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(here, "..");
const destDocs = join(siteRoot, "content", "docs");

const require = createRequire(import.meta.url);
const CATEGORIES = require("../lib/doc-categories.json");
const CAT_RULES = CATEGORIES.rules.map((r) => [new RegExp(r.match), r.category]);
function categoryFor(slug) {
  const base = slug.split("/").pop();
  return CAT_RULES.find(([re]) => re.test(base))?.[1] ?? "Reference";
}

const STRICT_DOCS = process.env.STRICT_DOCS === "1";

// Source docs live in the main BreachPilot repo. Supported layouts, first hit wins:
//  - nested:  <repo>/web (this site), <repo>/docs
//  - sibling: <parent>/breachpilot-site, <parent>/BreachPilot/docs
// Override with BREACHPILOT_DOCS_DIR.
const CANDIDATES = [
  process.env.BREACHPILOT_DOCS_DIR,
  join(siteRoot, "..", "docs"),
  join(siteRoot, "..", "BreachPilot", "docs"),
].filter(Boolean);
const srcDocs = CANDIDATES.find((d) => existsSync(d));

/** Top-level extras mapped to a slug (main repo README sits next to docs/). */
const EXTRAS = srcDocs ? [{ from: join(dirname(srcDocs), "README.md"), slug: "readme" }] : [];

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dest, entry);
    const st = statSync(s);
    if (st.isDirectory()) {
      if (entry === "node_modules") continue;
      copyDir(s, d);
    } else if (entry.endsWith(".md")) {
      copyFileSync(s, d);
    }
  }
}

function titleFromFilename(file) {
  return file
    .replace(/\.md$/, "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

if (srcDocs) {
  rmSync(destDocs, { recursive: true, force: true });
  mkdirSync(destDocs, { recursive: true });
  copyDir(srcDocs, destDocs);

  // An upstream docs-side README.md would ship as a second /docs/README route
  // that collides with the EXTRAS readme.md copy on case-insensitive
  // filesystems — drop the colliding variant, the root README wins.
  for (const { slug } of EXTRAS) {
    const clash = join(destDocs, `${slug}.md`);
    (function sweep(dir) {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) {
          sweep(p);
          continue;
        }
        if (e.endsWith(".md") && p.toLowerCase() === clash.toLowerCase() && p !== clash) {
          rmSync(p);
          console.warn(`sync-docs: removed case-colliding ${p} (covered by EXTRAS ${slug}.md)`);
        }
      }
    })(destDocs);
  }

  for (const { from, slug } of EXTRAS) {
    if (existsSync(from)) copyFileSync(from, join(destDocs, `${slug}.md`));
  }
} else if (existsSync(destDocs)) {
  // No upstream docs available (e.g. host build without the sibling
  // BreachPilot checkout): reuse the committed content/docs copies.
  const msg = "sync-docs: source docs dir missing, reusing committed content/docs";
  if (STRICT_DOCS) {
    console.error(`${msg} (STRICT_DOCS=1)`);
    process.exit(1);
  }
  console.warn(msg);
} else {
  console.error("sync-docs: no source docs and no committed content/docs fallback");
  process.exit(1);
}

// Slug inventory for link resolution (plus a lowercase map so
// `docs/README.md`-style links still find `readme`).
const slugs = new Set();
const lowerSlugs = new Map();
(function walk(dir, base) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p, base);
      continue;
    }
    if (!e.endsWith(".md")) continue;
    const slug = p
      .slice(base.length + 1)
      .replace(/\\/g, "/")
      .replace(/\.md$/, "");
    slugs.add(slug);
    if (!lowerSlugs.has(slug.toLowerCase())) lowerSlugs.set(slug.toLowerCase(), slug);
  }
})(destDocs, destDocs);

const LINK_RE = /\[([^\]]*)\]\(([^)\s]+)\)/g;

/**
 * Resolve a relative `.md` href (as authored upstream, e.g. `api/auth.md`
 * or `../safety-model.md`) to a synced slug. Returns null for external,
 * absolute, anchor-only, and non-doc links — and for doc links whose target
 * was not synced (reported below; the renderer then links upstream GitHub).
 */
function resolveDocSlug(slug, href) {
  if (!href || href.startsWith("#") || href.startsWith("/") || !href.includes(".md")) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)) return null;
  const path = href.split("#")[0].split("?")[0];
  if (!/(^|\/)[^/]*\.md$/.test(path)) return null;
  const base = slug.includes("/") ? slug.slice(0, slug.lastIndexOf("/")) : "";
  const stack = [];
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
  if (slugs.has(res)) return res;
  if (res.startsWith("docs/") && slugs.has(res.slice(5))) return res.slice(5);
  const lower = res.toLowerCase();
  if (lowerSlugs.has(lower)) return lowerSlugs.get(lower);
  if (lower.startsWith("docs/") && lowerSlugs.has(lower.slice(5))) return lowerSlugs.get(lower.slice(5));
  return null;
}

function titleFor(raw, slug) {
  const { data, content } = matter(raw);
  if (typeof data.title === "string" && data.title.trim()) return data.title.trim();
  let fence = false;
  for (const line of content.split("\n")) {
    if (/^\s*```/.test(line)) {
      fence = !fence;
      continue;
    }
    if (!fence) {
      const m = line.match(/^#\s+(.+)/);
      if (m) return m[1].trim();
    }
  }
  return titleFromFilename(slug.split("/").pop() ?? slug);
}

/**
 * Searchable plaintext: frontmatter stripped, fences unwrapped (code stays
 * searchable — flags and command names live there), images dropped.
 */
function excerptFor(raw) {
  const { content } = matter(raw);
  return content
    .replace(/```[^\n]*\n/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*`[\]()!|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

let count = 0;
let rewrites = 0;
const missing = new Map();
const index = [];
(function walk(dir, base) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p, base);
      continue;
    }
    if (!e.endsWith(".md")) continue;
    count += 1;
    const slug = p
      .slice(base.length + 1)
      .replace(/\\/g, "/")
      .replace(/\.md$/, "");
    const raw = readFileSync(p, "utf8");
    for (const m of raw.matchAll(LINK_RE)) {
      const target = resolveDocSlug(slug, m[2]);
      if (target) {
        rewrites += 1;
      } else if (!m[2].startsWith("#") && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(m[2]) && /\.md(#|\?|$)/.test(m[2])) {
        missing.set(`${slug} -> ${m[2]}`, (missing.get(`${slug} -> ${m[2]}`) ?? 0) + 1);
      }
    }
    index.push({
      slug,
      title: titleFor(raw, slug),
      path: `/docs/${slug}`,
      category: categoryFor(slug),
      body: excerptFor(raw),
    });
  }
})(destDocs, destDocs);

writeFileSync(join(siteRoot, "public", "search-index.json"), JSON.stringify(index));
console.log(`sync-docs: synced ${count} markdown files -> content/docs (+ search-index.json), ${rewrites} doc links resolvable`);
if (missing.size > 0) {
  console.warn(`sync-docs: ${missing.size} doc links point outside the synced tree (renderer links these upstream):`);
  for (const k of [...missing.keys()].sort()) console.warn(`  unresolved: ${k}`);
}
