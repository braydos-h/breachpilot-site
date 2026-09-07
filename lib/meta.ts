import generated from "@/generated/project-meta.json";

/**
 * Build-time project metadata, derived from the adjacent BreachPilot
 * checkout by scripts/generate-meta.mjs (see `meta.method` for how each
 * number was counted). Committed so local dev and host builds without the
 * sibling repo still work; CI regenerates with STRICT_META=1 and fails if
 * the upstream checkout is missing.
 */
export type ProjectMeta = typeof generated;

export const META: ProjectMeta = generated;

/** Warn (once, server-side at build) when serving stale/regenerated metadata. */
if (META.stale && typeof process !== "undefined" && process.env?.STRICT_META === "1") {
  throw new Error(
    "project-meta.json is stale (upstream BreachPilot checkout was missing at build time)"
  );
}

if (META.stale && typeof window === "undefined") {
  console.warn("meta: using stale generated/project-meta.json — run npm run build with the BreachPilot checkout beside this repo");
}

/** Exact derived counts for display; each label names the counting method. */
export const DERIVED_METRICS = [
  { value: String(META.skills ?? "—"), label: "advisory skills (skills/ SKILL.md)" },
  { value: String(META.mcpTools ?? "—"), label: "MCP tools (tools/mcp_tools/)" },
  { value: String(META.attackFamilies ?? "—"), label: "attack-module families" },
  { value: String(META.swarmAgents ?? "—"), label: "specialist swarm agents" },
  { value: String(META.toolFamilies ?? "—"), label: "MCP tool families" },
] as const;

export const VERSION = META.version ?? "unknown";
export const COMMIT_SHORT = META.commitShort ?? null;
export const LATEST_TAG = META.latestTag ?? null;
