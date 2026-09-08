/**
 * Generate build metadata from the adjacent main BreachPilot repository.
 *
 * Counts are DERIVED, never guessed — every number carries its methodology in
 * `method`. When the upstream checkout is missing (local dev without the
 * sibling repo), the previous generated file is kept and marked stale; pass
 * STRICT_META=1 (CI does) to fail instead.
 *
 * Usage: node scripts/generate-meta.mjs
 * Output: generated/project-meta.json + generated/doc-dates.json
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
// Single source of truth for static routes (shared with app/sitemap.ts).
// $comment is documentation, not a route.
const STATIC_SOURCES = Object.fromEntries(
  Object.entries(require("../lib/static-routes.json")).filter(([r]) => r === "" || r.startsWith("/"))
);

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(here, "..");
const STRICT = process.env.STRICT_META === "1";

// Same source layouts as sync-docs.mjs: nested (site inside main repo),
// sibling BreachPilot checkout, or bare docs dir. Override with BREACHPILOT_REPO_DIR.
const CANDIDATES = [
  process.env.BREACHPILOT_REPO_DIR,
  process.env.BREACHPILOT_DOCS_DIR ? dirname(process.env.BREACHPILOT_DOCS_DIR) : null,
  join(siteRoot, "..", "BreachPilot"),
  join(siteRoot, ".."),
].filter(Boolean);

function findRepoRoot() {
  for (const d of CANDIDATES) {
    if (existsSync(join(d, "pyproject.toml")) && existsSync(join(d, "docs"))) return d;
  }
  // Bare docs dir (CI copies only docs/): version/counts unavailable.
  const docsOnly = [process.env.BREACHPILOT_DOCS_DIR, join(siteRoot, "..", "docs")].find(
    (d) => d && existsSync(d)
  );
  return docsOnly ? { docsOnly } : null;
}

function git(root, ...args) {
  try {
    return execFileSync("git", ["-C", root, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

function countSkillMd(root) {
  // skills/<name>/SKILL.md — one advisory skill per directory.
  let n = 0;
  const dir = join(root, "skills");
  if (!existsSync(dir)) return null;
  for (const e of readdirSync(dir)) {
    const f = join(dir, e, "SKILL.md");
    try {
      if (statSync(f).isFile()) n += 1;
    } catch { /* skip */ }
  }
  return n;
}

function countPlugins(root) {
  // plugins/<name>/plugin.yaml, excluding shipped examples.
  let n = 0;
  const dir = join(root, "plugins");
  if (!existsSync(dir)) return null;
  for (const e of readdirSync(dir)) {
    if (e.startsWith("example")) continue;
    const f = join(dir, e, "plugin.yaml");
    try {
      if (statSync(f).isFile()) n += 1;
    } catch { /* skip */ }
  }
  return n;
}

function readPy(root, rel) {
  const p = join(root, rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function walkPy(dir, out) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    if (e === "__pycache__") continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walkPy(p, out);
    else if (e.endsWith(".py")) out.push(p);
  }
}

function countMcp(root) {
  // tools/mcp_tools/**: each `register_<family>_tools()` is one tool family;
  // each `@*.tool(` decorator at line start is one registered MCP tool.
  // (Line-start match excludes docstring mentions of "@mcp.tool".)
  const base = join(root, "tools", "mcp_tools");
  if (!existsSync(base)) return null;
  const files = [];
  walkPy(base, files);
  const families = new Set();
  let tools = 0;
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(/^\s*def\s+(register_[a-z0-9_]+_tools)\s*\(/gm)) {
      if (m[1] !== "register_foo_tools") families.add(m[1]);
    }
    tools += text.match(/^\s*@\w+\.tool\s*\(/gm)?.length ?? 0;
  }
  return { tools, families: families.size };
}

function countAttackFamilies(root) {
  // tools/attack_modules/modules/: one file ≈ one family, subdirs (web/, ics/)
  // count once each; ics_iot.py is mid-split into ics/ so it merges, not adds.
  const base = join(root, "tools", "attack_modules", "modules");
  if (!existsSync(base)) return null;
  const fams = new Set();
  for (const e of readdirSync(base)) {
    if (e === "__pycache__" || e === "__init__.py") continue;
    const p = join(base, e);
    if (statSync(p).isDirectory()) {
      const hasPy = readdirSync(p).some((f) => f.endsWith(".py"));
      if (hasPy) fams.add(e.toLowerCase());
    } else if (e.endsWith(".py")) {
      fams.add(e.replace(/\.py$/, "").toLowerCase());
    }
  }
  if (fams.has("ics_iot") && fams.has("ics")) fams.delete("ics_iot");
  return fams.size;
}

function countSwarmAgents(root) {
  // tools/swarm/agents/*_agent.py minus the advisory witness (not orchestrated).
  const base = join(root, "tools", "swarm", "agents");
  if (!existsSync(base)) return null;
  let n = 0;
  let witness = false;
  for (const e of readdirSync(base)) {
    if (!e.endsWith("_agent.py")) continue;
    if (e === "witness_agent.py") witness = true;
    else n += 1;
  }
  return { agents: n, witness };
}

function docDates(repoRoot, docsRel, destDocs) {
  // Per-doc lastModified: upstream git commit time for the source file,
  // falling back to the synced copy's mtime. Never the build clock.
  const out = {};
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) {
        walk(p);
        continue;
      }
      if (!e.endsWith(".md")) continue;
      const slug = relative(destDocs, p).replace(/\\/g, "/").replace(/\.md$/, "");
      let date = null;
      if (repoRoot && !repoRoot.docsOnly) {
        const rel = relative(repoRoot, join(docsRel, `${slug}.md`));
        date = git(repoRoot, "log", "-1", "--format=%cI", "--", rel) || null;
      }
      if (!date) {
        try {
          date = statSync(p).mtime.toISOString();
        } catch { /* skip */ }
      }
      if (date) out[slug] = date;
    }
  };
  if (existsSync(destDocs)) walk(destDocs);
  return out;
}

const found = findRepoRoot();
const outDir = join(siteRoot, "generated");

if (!found || found.docsOnly) {
  const prev = join(outDir, "project-meta.json");
  if (STRICT) {
    console.error("generate-meta: upstream BreachPilot checkout missing and STRICT_META=1");
    process.exit(1);
  }
  if (existsSync(prev)) {
    const meta = JSON.parse(readFileSync(prev, "utf8"));
    meta.stale = true;
    writeFileSync(prev, `${JSON.stringify(meta, null, 2)}\n`);
    console.warn("generate-meta: upstream missing, kept previous generated/project-meta.json (stale:true)");
  } else {
    console.error("generate-meta: upstream BreachPilot checkout missing and no previous metadata");
    process.exit(1);
  }
  process.exit(0);
}

const root = found;
const pyproject = readPy(root, "pyproject.toml");
const version = pyproject?.match(/^\s*version\s*=\s*"([^"]+)"/m)?.[1] ?? null;
const commit = git(root, "rev-parse", "HEAD");
const commitDate = git(root, "log", "-1", "--format=%cI");
const describe = git(root, "describe", "--tags", "--always");
const tags = (git(root, "tag", "--sort=-v:refname") ?? "")
  .split("\n")
  .map((t) => t.trim())
  .filter(Boolean);
const versionTags = tags.filter((t) => /^v?\d+\.\d+(\.\d+)?$/.test(t));
const latestTag = versionTags[0] ?? null;

// Deterministic lastModified for static routes: last commit touching the
// page source in THIS repo (not the build clock). Falls back to the upstream
// commit date, never `new Date()`. Route list lives in
// lib/static-routes.json (shared with app/sitemap.ts).

function staticDates(fallback) {
  const out = {};
  for (const [route, files] of Object.entries(STATIC_SOURCES)) {
    let date = null;
    for (const f of files) {
      const d = git(siteRoot, "log", "-1", "--format=%cI", "--", f);
      if (d && (!date || d > date)) date = d;
    }
    out[route] = date ?? fallback ?? null;
  }
  return out;
}

const skills = countSkillMd(root);
const plugins = countPlugins(root);
const mcp = countMcp(root);
const attackFamilies = countAttackFamilies(root);
const swarm = countSwarmAgents(root);
const staticRoutes = staticDates(commitDate);

const meta = {
  version,
  commit: commit ?? null,
  commitShort: commit ? commit.slice(0, 12) : null,
  commitDate: commitDate ?? null,
  describe: describe ?? null,
  latestTag,
  versionTags: versionTags.slice(0, 10),
  staticRoutes,
  skills,
  plugins,
  mcpTools: mcp?.tools ?? null,
  toolFamilies: mcp?.families ?? null,
  attackFamilies,
  swarmAgents: swarm?.agents ?? null,
  witnessAdvisory: swarm ? swarm.witness : null,
  method: {
    version: "pyproject.toml [project] version",
    skills: "count of skills/*/SKILL.md",
    plugins: "count of plugins/*/plugin.yaml excluding example*",
    mcpTools: "AST-shape regex ^\\s*@\\w+\\.tool\\( over tools/mcp_tools/**/*.py",
    toolFamilies: "distinct register_*_tools() in tools/mcp_tools/**/*.py",
    attackFamilies: "tools/attack_modules/modules files+subdirs, ics_iot merged into ics",
    swarmAgents: "tools/swarm/agents/*_agent.py excluding advisory witness_agent.py",
    docDates: "git log -1 --format=%cI per docs file, else synced copy mtime",
  },
  source: "adjacent BreachPilot checkout",
  generatedAt: new Date().toISOString(),
  stale: false,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "project-meta.json"), `${JSON.stringify(meta, null, 2)}\n`);

const destDocs = join(siteRoot, "content", "docs");
const dates = docDates(root, join(root, "docs"), destDocs);
writeFileSync(join(outDir, "doc-dates.json"), `${JSON.stringify(dates, null, 2)}\n`);

console.log(
  `generate-meta: v${version ?? "?"} ${describe ?? ""} skills=${skills ?? "?"} plugins=${plugins ?? "?"} ` +
    `mcpTools=${mcp?.tools ?? "?"} toolFamilies=${mcp?.families ?? "?"} attackFamilies=${attackFamilies ?? "?"} ` +
    `swarmAgents=${swarm?.agents ?? "?"} docDates=${Object.keys(dates).length}`
);
