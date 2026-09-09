import type { Metadata } from "next";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  FileCheck2,
  HardDrive,
  KeyRound,
  Lock,
  Radar,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AttackGraph, type GraphNode } from "@/components/attack-graph";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { META } from "@/lib/meta";
import { routeMetadata } from "@/lib/metadata";
import { PROVIDERS, SITE, SWARM_AGENTS } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/architecture", {
  title: "Architecture",
  description:
    "BreachPilot architecture: operator-supervised pipeline over a target-locked MCP tool layer, with evidence-backed verification, local-first data flow, and full audit.",
});

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

const LAYERS: Array<{ name: string; desc: string; tag: string }> = [
  { name: "Operator", desc: "Starts runs, sets scope, approves gated actions. The only authority. Nothing executes without an allowlisted target.", tag: "human" },
  { name: "Planner", desc: "Resolves goals into an AttackPlan DAG, resolves policy gates, and sequences hypotheses.", tag: "control" },
  { name: "Agent", desc: "Flow A loop: hypothesize, execute, validate. Every tool call goes through the policy gate first.", tag: "control" },
  { name: "MCP Tool Layer", desc: `${META.mcpTools ?? "120+"} tools across ${META.toolFamilies ?? "33"} families. Every tool carries @audit_tool + @require_allowlist. No allowlist entry means no execution.`, tag: "enforced" },
  { name: "Sandbox", desc: "Disposable worker locked to the target IP. Fail-closed DROP on anything outside scope.", tag: "enforced" },
  { name: "Evidence", desc: "Execution outcome and evidential outcome stay separate. OutcomeJudge records what the run proved.", tag: "proven" },
  { name: "Verification", desc: "Validation scoring per claim: CONFIRMED, REFUTED, or EXHAUSTED, with oracle probes and scoring rationale.", tag: "proven" },
  { name: "Report", desc: "Markdown and HTML with timeline, CVSS, and MITRE export, sealed by a SHA-256 audit chain.", tag: "proven" },
];

const FLOW_STEPS: Array<{ step: string; title: string; desc: string }> = [
  { step: "Scope", title: "Allowlist first", desc: "Operator declares targets. The sandbox locks to those IPs. Everything else drops, fail-closed." },
  { step: "Plan", title: "DAG of hypotheses", desc: "Planner builds an AttackPlan DAG of testable hypotheses, each tagged with its policy gate." },
  { step: "Execute", title: "Gated tool calls", desc: "The agent runs MCP tools inside the sandbox. Gated and high-risk actions pause for operator approval." },
  { step: "Judge", title: "Separate signal from noise", desc: "OutcomeJudge splits execution output from evidential outcome, so a crashed tool never becomes a finding." },
  { step: "Verify", title: "Prove or refute", desc: "Oracle probes re-test each claim. Only CONFIRMED findings ship; REFUTED and EXHAUSTED stay in the log." },
  { step: "Report", title: "Sealed output", desc: "Timeline, CVSS, and MITRE-mapped report with a SHA-256 audit chain from plan to finding." },
];

const GATES = [
  { icon: CheckCircle2, name: "SAFE", desc: "Read-only recon and passive checks run without interruption once scope is set." },
  { icon: UserCheck, name: "GATED", desc: "Active testing pauses for operator approval. One click in the WebUI, full context attached." },
  { icon: Lock, name: "HIGH", desc: "High-impact actions need explicit approval plus audit justification. Deny-by-default." },
] as const;

const SWARM_ICONS: Record<string, typeof Radar> = {
  recon: Radar,
  vuln: Search,
  exploit: Zap,
  post_exploit: KeyRound,
  critic: ShieldCheck,
  reflection: Brain,
};

function SafetyStrip({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-center gap-1.5 text-sm text-muted-foreground ${className}`}>
      <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        Authorized testing only. Every action is allowlist-gated and audited.{" "}
        <Link href="/safety" className="underline underline-offset-4 hover:text-foreground">
          Safety model
        </Link>
      </span>
    </p>
  );
}

export default function ArchitecturePage() {
  return (
    <div>
      <PageHero
        eyebrow="Architecture"
        title="Local-first engine, operator-supervised at every gate"
        lede="One supervised pipeline (plan, execute, prove, report) over a target-locked tool layer. Your data stays in your lab. Only your approvals move the run forward. For authorized testing only."
      >
        <p className="mt-5 inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-full border bg-background px-3 py-1 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
          {SITE.pipeline}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/install"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Install for your lab <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Read the safety model
          </Link>
        </div>
        <SafetyStrip className="mt-4" />
      </PageHero>

      {/* runtime pipeline diagram */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6" aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Runtime pipeline
        </h2>
        <div className="mt-4">
          <AttackGraph nodes={PIPELINE_NODES} />
        </div>
        <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
          operator → planner → agent → mcp tools → sandbox → evidence → verification → report
        </p>
      </section>

      {/* layers: CSS stack diagram + descriptions */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="layers-heading">
        <SectionHeading
          align="left"
          eyebrow="Layers"
          title="The stack, top to bottom"
          lede="Authority flows down, evidence flows up. The enforcement line between planning and execution turns scope into physics: no allowlist entry, no packets."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div aria-label="Layer stack diagram">
            <ol className="overflow-hidden rounded-xl border bg-card">
              {LAYERS.map((l, i) => (
                <li
                  key={l.name}
                  className={`flex items-center gap-3 border-b px-4 py-3 last:border-b-0 ${i >= 3 && i <= 4 ? "bg-muted/50" : ""}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-[11px] font-semibold" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{l.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{l.tag}</p>
                  </div>
                  {i === 2 && (
                    <span className="hidden shrink-0 rounded-full border border-dashed px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
                      enforcement line
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-3 flex items-start gap-1.5 text-[13px] leading-6 text-muted-foreground">
              <Lock className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden />
              Highlighted rows run inside the sandbox lock: target-IP pinned, fail-closed DROP on anything outside scope.
            </p>
          </div>
          <ol className="space-y-0">
            {LAYERS.map((l, i) => (
              <li key={l.name} className="relative flex gap-4 pb-5 last:pb-0">
                {i < LAYERS.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-border" aria-hidden />}
                <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-xs font-semibold" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 rounded-lg border bg-card px-4 py-3">
                  <h3 className="font-semibold tracking-tight">{l.name}</h3>
                  <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{l.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* data flow */}
      <section className="border-t bg-muted/30" aria-labelledby="flow-heading">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="Data flow"
            title="How one finding gets made"
            lede="Six stages from scope to sealed report. Each stage does its own job and leaves the next one alone."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FLOW_STEPS.map((f, i) => (
              <li key={f.step}>
                <Card className="h-full p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} · {f.step}
                  </p>
                  <h3 className="mt-2 font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{f.desc}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* local-first + operator-supervised */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="trust-heading">
        <SectionHeading
          eyebrow="Trust model"
          title="Local-first data, supervised actions"
          lede="Two guarantees that never trade off against each other: your lab data stays yours, and no consequential action runs without a human."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <p className="flex items-center gap-2 font-semibold tracking-tight">
              <HardDrive className="h-4 w-4" aria-hidden /> Local-first
            </p>
            <ul className="mt-3 space-y-2.5 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-2"><Database className="mt-1 h-4 w-4 shrink-0" aria-hidden /> Runs, evidence, and memory live on your machine. Serve the WebUI on localhost (default port {SITE.webuiDefaultPort}).</li>
              <li className="flex gap-2"><FileCheck2 className="mt-1 h-4 w-4 shrink-0" aria-hidden /> Reports generate locally as Markdown and HTML with a SHA-256 audit chain. No cloud round-trip required.</li>
              <li className="flex gap-2"><Brain className="mt-1 h-4 w-4 shrink-0" aria-hidden /> {META.skills ?? "140+"} advisory skills and semantic memory are file-backed and inspectable in your workspace.</li>
            </ul>
          </Card>
          <Card className="p-6">
            <p className="flex items-center gap-2 font-semibold tracking-tight">
              <UserCheck className="h-4 w-4" aria-hidden /> Operator-supervised
            </p>
            <ul className="mt-3 space-y-2.5 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-2"><ShieldCheck className="mt-1 h-4 w-4 shrink-0" aria-hidden /> You set scope; the sandbox enforces it. Out-of-scope destinations drop, fail-closed.</li>
              <li className="flex gap-2"><UserCheck className="mt-1 h-4 w-4 shrink-0" aria-hidden /> Gated and high-impact actions pause with full context. Approve or deny from the WebUI.</li>
              <li className="flex gap-2"><FileCheck2 className="mt-1 h-4 w-4 shrink-0" aria-hidden /> Every approval, tool call, and verdict lands in the audit log. Authorized testing only.</li>
            </ul>
          </Card>
        </div>

        <h3 id="gates-heading" className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Policy gates
        </h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3" aria-labelledby="gates-heading">
          {GATES.map((g) => (
            <li key={g.name}>
              <Card className="h-full p-5">
                <p className="flex items-center gap-2">
                  <g.icon className="h-4 w-4" aria-hidden />
                  <span className="font-mono text-sm font-semibold tracking-wider">{g.name}</span>
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{g.desc}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* alongside every run */}
      <section className="border-t bg-muted/30" aria-labelledby="alongside-heading">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="Alongside every run"
            title="Orchestration, memory, and models"
            lede="Three systems run next to the pipeline: specialists that split up the work, memory that carries lessons forward, and a provider layer behind one contract."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 font-semibold tracking-tight">
                Swarm orchestrator <Badge>{META.swarmAgents ?? SWARM_AGENTS.length} agents</Badge>
              </h3>
              <ul className="mt-4 space-y-2.5">
                {SWARM_AGENTS.map((a) => {
                  const Icon = SWARM_ICONS[a.id] ?? Radar;
                  return (
                    <li key={a.id} className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div>
                        <p className="text-sm font-semibold">{a.name}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{a.job}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold tracking-tight">Provider layer: one contract</h3>
                <ul className="mt-4 space-y-2.5">
                  {PROVIDERS.map((p) => (
                    <li key={p.id} className="rounded-lg border bg-card px-4 py-3">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{p.desc}</p>
                      <p className="mt-1.5 font-mono text-xs text-muted-foreground">{p.config}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="p-5">
                <h3 className="text-[15px] font-semibold tracking-tight">Skills + memory</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {META.skills ?? "140+"} advisory skills guide planning without executing anything;
                  semantic and experience memory carry fingerprints, layouts, and lessons across runs. All on disk, all inspectable.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* go deeper + CTA */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="deeper-heading">
        <h2 id="deeper-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Go deeper</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Engineering depth:{" "}
          <Link href="/docs/architecture" className="font-medium text-foreground underline underline-offset-4">architecture</Link>
          {" · "}
          <Link href="/docs/runtime-flows" className="font-medium text-foreground underline underline-offset-4">runtime flows</Link>
          {" · "}
          <Link href="/docs/mcp-wiring" className="font-medium text-foreground underline underline-offset-4">MCP wiring</Link>
          {" · "}
          <Link href="/docs/sandbox" className="font-medium text-foreground underline underline-offset-4">sandbox</Link>
          {" · "}
          <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">source</a>
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/install"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Install for your lab <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            See what it can do
          </Link>
        </div>
        <SafetyStrip className="mt-5" />
      </section>
    </div>
  );
}
