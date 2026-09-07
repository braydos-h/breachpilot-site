import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, CodeSnippet } from "@/components/ui";
import { META } from "@/lib/meta";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "BreachPilot architecture: operator → WebUI/API → goal engine → exploit agent → MCP tool layer → target-locked execution, with swarm, memory, providers, evidence and audit.",
  alternates: { canonical: "https://breachpilot.dev/architecture" },
};

const LAYERS = [
  ["Operator", "Starts runs, approves gated actions, reviews evidence. The only authority that matters."],
  ["WebUI / API", "Loopback-only console at 127.0.0.1:8765 — bearer-token auth, real-time events over WebSocket. Transport-neutral AssessmentService underneath."],
  ["Goal Engine / Planner", "Resolves preset or custom goals, gates by risk profile (SAFE / GATED / HIGH), builds the AttackPlan DAG."],
  ["Exploit Agent", "The Flow A loop: understand → hypothesize → plan → execute → interpret → reflect → recover → validate. Policy-gated."],
  ["MCP Tool Layer", `${META.mcpTools ?? "120+"} tools across ${META.toolFamilies ?? "29"} families, registered via collect_tools() with @audit_tool / @require_allowlist decorators.`],
  ["Target-locked execution", "Disposable sandbox worker + target-IP allowlist lock. Off-allowlist destinations are BLOCKED; sandbox failures fail closed."],
];

const SIDE = [
  ["Swarm Orchestrator", "Six specialists on a shared blackboard for single-target depth."],
  ["Autonomous Orchestrator", "Persistent multi-phase campaigns with adaptive aggression and resume."],
  ["Skills + Memory", `${META.skills ?? "140+"} advisory skills, semantic memory, experience store, attack memory.`],
  ["Provider layer", "Pluggable chat/generate adapters (Ollama, OpenCode Go, ChatGPT) behind one ModelClient contract."],
  ["Evidence / OutcomeJudge", "Execution outcome vs evidential outcome — CONFIRMED / REFUTED / EXHAUSTED."],
  ["Finding verifier + Reports", "Validation scoring, Markdown/HTML reports, MITRE export, ticketing."],
  ["Audit chain", "Tamper-evident SHA-256 chain over every action, denial and scope event."],
  ["Sandbox worker", "Hardened per-run container with default-DROP network containment."],
];

export default function ArchitecturePage() {
  return (
    <div>
      <PageHero
        eyebrow="Architecture"
        title="One pipeline, fully instrumented"
        lede="Flow A is the modern runtime: an MCP-based exploitation engine with a WebUI console, a policy-gated agent loop and a target-locked tool layer. Legacy research-loop components are frozen in legacy/ — the docs mark exactly where."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Main path</h2>
            <ol className="mt-4">
              {LAYERS.map(([t, b], i) => (
                <li key={t} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < LAYERS.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-border" aria-hidden />}
                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-xs font-semibold" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="rounded-lg border bg-card p-4">
                    <h3 className="font-semibold tracking-tight">{t}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Alongside</h2>
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
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Conceptual pipeline</h2>
          <div className="mt-4">
            <CodeSnippet
              code={`Mission → Scope/Risk → Planner → Tasks → Tools → Observer → Outcome → Memory/Graph/Evidence → Verification → Report`}
              title="runtime pipeline"
            />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Engineering depth:{" "}
            <Link href="/docs/architecture" className="font-medium text-foreground underline underline-offset-4">architecture</Link>
            {" · "}
            <Link href="/docs/runtime-flows" className="font-medium text-foreground underline underline-offset-4">runtime flows</Link>
            {" · "}
            <Link href="/docs/mcp-wiring" className="font-medium text-foreground underline underline-offset-4">MCP wiring</Link>
            {" · "}
            <Link href="/docs/sandbox" className="font-medium text-foreground underline underline-offset-4">sandbox</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
