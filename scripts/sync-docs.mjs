/**
 * Sync repository Markdown into web/content/docs at build time.
 * Single source of truth stays in ../docs (+ README.md, plugins READMEs);
 * the site renders from the synced copies so docs never drift.
 *
 * Usage: node scripts/sync-docs.mjs
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(here, "..");
const destDocs = join(siteRoot, "content", "docs");

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
      cpSync(s, d);
    }
  }
}

if (srcDocs) {
  rmSync(destDocs, { recursive: true, force: true });
  mkdirSync(destDocs, { recursive: true });
  copyDir(srcDocs, destDocs);

  const { copyFileSync } = await import("node:fs");
  for (const { from, slug } of EXTRAS) {
    if (existsSync(from)) copyFileSync(from, join(destDocs, `${slug}.md`));
  }
} else {
  // No upstream docs available (e.g. Vercel build without the sibling
  // BreachPilot checkout): reuse the committed content/docs copies.
  console.warn("sync-docs: source docs dir missing, reusing committed content/docs");
  if (!existsSync(destDocs)) {
    console.error("sync-docs: no source docs and no committed content/docs fallback");
    process.exit(1);
  }
}

let count = 0;
const index = [];
(function walk(dir, base) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p, base);
    } else if (e.endsWith(".md")) {
      count += 1;
      const slug = p
        .slice(base.length + 1)
        .replace(/\\/g, "/")
        .replace(/\.md$/, "");
      const raw = readFileSync(p, "utf8");
      const titleMatch = raw.match(/^#\s+(.+)/m);
      const plain = raw
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*`\[\]()!|-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 2000);
      index.push({
        slug,
        title: titleMatch ? titleMatch[1].trim() : slug,
        path: `/docs/${slug}`,
        body: plain,
      });
    }
  }
})(destDocs, destDocs);

// Category mirrors lib/docs.ts CATEGORY_RULES so search needs no extra lookup.
const CATEGORY_RULES = [
  [/^(getting-started|tutorial|deployment|troubleshooting)$/, "Getting Started"],
  [/^(architecture|runtime-flows|safety-model|outcome-evidence|database-mission|sandbox)$/, "Core Concepts"],
  [/^(exploit-agent|swarm|skills|skill-authoring|prompts)$/, "Agent"],
  [/^(mcp-tools|mcp-wiring|attack-modules|browser-agent-design)$/, "Tooling"],
  [/^(webui|api|cli-reference|config-reference)$/, "Platform"],
  [/^(plugin-development|extension-guide|providers|provider-development)$/, "Extensibility"],
  [/^(testing-guide|evaluation|benchmarks|module-guide|glossary)$/, "Engineering"],
];
for (const entry of index) {
  const base = entry.slug.split("/").pop();
  entry.category = (CATEGORY_RULES.find(([re]) => re.test(base)) ?? [])[1] ?? "Reference";
}
writeFileSync(join(here, "..", "public", "search-index.json"), JSON.stringify(index));
console.log(`sync-docs: synced ${count} markdown files -> content/docs (+ search-index.json)`);
