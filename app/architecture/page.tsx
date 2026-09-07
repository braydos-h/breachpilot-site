import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AttackGraph, type GraphNode } from "@/components/attack-graph";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui";
import { META } from "@/lib/meta";
import { PROVIDERS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "BreachPilot architecture: operator → planner → agent → MCP tool layer → sandbox → evidence → verification → report, with swarm, memory, providers and audit alongside.",
  alternates: { canonical: `${SITE.url}/architecture` },
};

const PIPELINE_NODES: GraphNode[] = [
  { id: "operator", label: "Operator", sub: "approves gated", state: "done" },
  { id: "planner", label: "Planner", sub: "AttackPlan DAG", state: "done" },
  { id: "agent", label: "Agent", sub: "Flow A loop", state: "active" },
  { id: "mcp", label: "MCP Tools", sub: `${META.mcpTools ?? "120+"} · ${META.toolFamilies ?? "33"} fam.`, state: "active" },
  { id: "sandbox", label: "Sandbox", sub: "allowlist-locked", state: "todo" },
  { id: "evidence", label: "Evidence", sub: "CONF / REFUTED", state: "todo" },
  { id: "verify", label: "Verification", sub: "oracle · score", state: "finding" },
  { id: "report", label: "Report", sub: "md · html · MITRE", state: "todo" },
];

const LAYERS = [
  ["Operator", "Starts runs, approves gated actions. The only authority."],
  ["Planner", "Resolves goals, gates SAFE / GATED / HIGH, builds the AttackPlan DAG."],
  ["Agent", "Flow A loop: hypothesize → execute → validate. Policy-gated."],
  ["MCP Tool Layer", `${META.mcpTools ?? "120+"} tools / ${META.toolFamilies ?? "33"} families — @audit_tool + @require_allowlist.`],
  ["Sandbox", "Disposable worker, target-IP lock, fail-closed DROP."],
  ["Evidence", "Execution vs evidential outcome — OutcomeJudge."],
  ["Verification", "Validation scoring: CONFIRMED / REFUTED / EXHAUSTED."],
  ["Report", "Markdown/HTML, MITRE export, SHA-256 audit chain."],
];

const SIDE = [
  ["Swarm Orchestrator", "Six specialists on a shared blackboard."],
  ["Autonomous Orchestrator", "Persistent campaigns with resume."],
  ["Skills + Memory", `${META.skills ?? "140+"} advisory skills, semantic + experience memory.`],
  ["Provider layer", `${PROVIDERS.map((p) => p.name).join(" · ")} behind one contract.`],
];

export default function ArchitecturePage() {
  return (
    <div>
      <PageHero
        eyebrow="Architecture"
        title="One pipeline, fully instrumented"
        lede="Operator-supervised assessment engine: a policy-gated agent loop over a target-locked MCP tool layer, with evidence-backed verification and reporting. For authorized testing only."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/install"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Install for your lab
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Read the safety model
          </Link>
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>Authorized testing only — every action is allowlist-gated and audited.</span>
        </p>
      </PageHero>
      {/* pipeline diagram — the page's main visual */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6" aria-label="Runtime pipeline">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Runtime pipeline
        </h2>
        <div className="mt-4">
          <AttackGraph nodes={PIPELINE_NODES} />
        </div>
        <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
          operator → planner → agent → mcp tools → sandbox → evidence → verification → report
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-label="Pipeline stages">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Main path — one supervised run</h2>
            <ol className="mt-4">
              {LAYERS.map(([t, b], i) => (
                <li key={t} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < LAYERS.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-border" aria-hidden />}
                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-xs font-semibold" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 rounded-lg border bg-card px-4 py-3">
                    <h3 className="font-semibold tracking-tight">{t}</h3>
                    <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Alongside — every run</h2>
            <div className="mt-4 space-y-3">
              {SIDE.map(([t, b]) => (
                <Card key={t} className="p-4">
                  <h3 className="text-[15px] font-semibold tracking-tight">{t}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{b}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="border-t bg-muted/30" aria-label="Further reading and next steps">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Go deeper</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Engineering depth:{" "}
            <Link href="/docs/architecture" className="font-medium text-foreground underline underline-offset-4">architecture</Link>
            {" · "}
            <Link href="/docs/runtime-flows" className="font-medium text-foreground underline underline-offset-4">runtime flows</Link>
            {" · "}
            <Link href="/docs/mcp-wiring" className="font-medium text-foreground underline underline-offset-4">MCP wiring</Link>
            {" · "}
            <Link href="/docs/sandbox" className="font-medium text-foreground underline underline-offset-4">sandbox</Link>
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/install"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Install for your lab
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              See what it can do
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
