"use client";

import {
  Brain,
  FileCheck2,
  Globe,
  KeyRound,
  Lock,
  Network,
  Radar,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AttackGraph } from "@/components/attack-graph";
import { Card, MetaLabel, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { DERIVED_METRICS, META } from "@/lib/meta";
import { SWARM_AGENTS } from "@/lib/site";

const AGENT_ICONS: Record<string, typeof Radar> = {
  Radar,
  Search,
  Zap,
  KeyRound,
  ShieldCheck,
  Brain,
};

/** Metrics strip — dividers, not cards. Short labels; full method in title. */
export function StatsRow() {
  return (
    <dl className="flex divide-x overflow-x-auto rounded-xl border bg-card">
      {DERIVED_METRICS.map((s) => (
        <div key={s.label} className="min-w-0 flex-1 px-4 py-5 text-center sm:px-5 sm:py-6">
          <dd className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{s.value}</dd>
          <dt className="mt-1 truncate text-xs text-muted-foreground" title={methodFor(s.label)}>
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

function methodFor(label: string): string | undefined {
  const m = META.method as Record<string, string> | undefined;
  if (!m) return undefined;
  if (label === "advisory skills") return m.skills;
  if (label === "MCP tools") return m.mcpTools;
  if (label === "attack families") return m.attackFamilies;
  if (label === "swarm agents") return "six fixed specialist roles";
  if (label === "tool families") return m.toolFamilies;
  return undefined;
}

const WHY = [
  {
    icon: Network,
    title: "Adversarial planning",
    body: "Structured AttackPlan DAG with retries and failure recovery.",
    proof: "decision_log.jsonl per run",
    wide: true,
  },
  {
    icon: Lock,
    title: "Target-locked execution",
    body: "Allowlist + mission scope gate on every action.",
    proof: "off-allowlist BLOCKED · SCOPE_DENIED logged",
    wide: false,
  },
  {
    icon: FileCheck2,
    title: "Evidence-based verification",
    body: "Execution success and evidential success are separate.",
    proof: "CONFIRMED / REFUTED / EXHAUSTED + oracle probes",
    wide: false,
  },
  {
    icon: Globe,
    title: "Domain-aware recon",
    body: "Domain in, scope-aware attack surface out.",
    proof: "CT / DNS / subfinder · takeover flags",
    wide: false,
  },
  {
    icon: Brain,
    title: "Persistent knowledge",
    body: "Lessons survive the run.",
    proof: `${META.skills ?? "140+"} skills · semantic + Bayesian scoring`,
    wide: false,
  },
];

/** Asymmetric bento: one wide card, then three narrow. Safety folds into the footer link. */
export function WhyGrid() {
  return (
    <div className="mt-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WHY.map((w) => (
          <Card key={w.title} className={cn(w.wide && "sm:col-span-2 lg:col-span-2")}>
            <w.icon className="h-5 w-5 text-foreground" aria-hidden />
            <h3 className="mt-3 font-semibold tracking-tight">{w.title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{w.body}</p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{w.proof}</p>
          </Card>
        ))}
        <Card className="border-dashed">
          <ShieldCheck className="h-5 w-5 text-foreground" aria-hidden />
          <h3 className="mt-3 font-semibold tracking-tight">Operator-supervised</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Approval gates, sandbox workers, SHA-256 audit chain.
          </p>
          <Link href="/safety" className="mt-3 inline-block text-sm font-medium underline underline-offset-4">
            Read the safety model →
          </Link>
        </Card>
      </div>
    </div>
  );
}

/** Short agent summaries for the home lifecycle strip — full detail lives on /features/swarm. */
const AGENT_SHORT: Record<string, string> = {
  recon: "Expand surface, stay in scope",
  vuln: "Match CVEs to capabilities",
  exploit: "Craft, mutate, execute",
  post_exploit: "Loot and lateral targets",
  critic: "Kill out-of-scope actions",
  reflection: "Learn for the next run",
};

export function SwarmDiagram() {
  return (
    <div className="mt-10">
      {/* orchestrator core */}
      <div className="mx-auto max-w-md rounded-xl border bg-card p-5 text-center shadow-[0_1px_2px_0_hsl(var(--foreground)/0.04)]">
        <MetaLabel>Shared blackboard + battle log</MetaLabel>
        <p className="mt-1 font-semibold">Swarm Orchestrator</p>
        <p className="mt-1 text-sm text-muted-foreground">parallel dispatch · cross-phase negotiation</p>
      </div>
      {/* lifecycle strip: six steps, arrows on desktop, stacked on mobile */}
      <ol
        className="mx-auto mt-6 grid max-w-5xl gap-2 sm:grid-cols-2 lg:flex lg:items-stretch"
        aria-label="Six specialist agents"
      >
        {SWARM_AGENTS.map((a, i) => {
          const Icon = AGENT_ICONS[a.icon] ?? Zap;
          return (
            <li key={a.id} className="flex min-w-0 flex-1 items-stretch gap-2">
              {i > 0 && (
                <span className="hidden shrink-0 items-center text-muted-foreground lg:flex" aria-hidden>
                  →
                </span>
              )}
              <Link
                href="/features/swarm"
                className="min-w-0 flex-1 rounded-lg border bg-card p-3 transition-colors hover:bg-muted"
              >
                <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{a.id}</span>
                </p>
                <p className="mt-1 truncate text-sm font-semibold">{a.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {AGENT_SHORT[a.id] ?? a.job}
                </p>
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
        <Link
          href="/features/swarm"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Explore the swarm
        </Link>
        <Link href="/docs/swarm" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
          Swarm engineering docs
        </Link>
      </div>
    </div>
  );
}

const TOUR_VIEWS = [
  { id: "new-run", label: "New Run", desc: "Set target, allowlist, goal. Review, then launch.", rows: ["target  127.0.0.1  ·  allowlisted", "goal  initial_access  [GATED]", "mode  attack · full_access (lab)"] },
  { id: "live-run", label: "Live Run", desc: "Tool calls and decisions stream over WebSocket.", rows: ["recon › run_full_recon → 4 ports", "vuln › CVE-2024-xxxx ↔ module 87/100", "critic › scope PASS · in-allowlist"] },
  { id: "graph", label: "Attack Graph", desc: "Pan/zoom DAG with evidence on every node.", rows: ["8 nodes · 2 ready · 1 blocked", "path: recon → hypothesis H-03", "evidence attached to H-03"] },
  { id: "evidence", label: "Evidence", desc: "Reports plus SHA-256 audit chain, exportable.", rows: ["H-03 PROBE … CONFIRMED", "audit chain · sha256 9f3a…c41d", "report.md + report.html rendered"] },
  { id: "skills", label: "Skills", desc: "Advisory catalog, re-selected mid-run.", rows: ["top-6 selected for this context", "jwt-algorithm-confusion … 0.91", "re-selection on new CVE"] },
  { id: "modules", label: "Modules", desc: "Applicability scored 0–100 per target.", rows: ["web … 87/100 · applicable", "crypto_jwt … 72/100", "privesc … gated on access"] },
  { id: "benchmarks", label: "Benchmarks", desc: "Verified success, never claimed success.", rows: ["VERIFIED ≠ claimed", "false_positive_rate tracked", "baseline.json regression gate"] },
  { id: "memory", label: "Memory", desc: "What worked, against what, with evidence.", rows: ["lesson: smb-signing-off → relay", "confidence 0.83 · 4 refs", "nomic-embed-text indexed"] },
  { id: "connections", label: "Connections", desc: "Listeners and beacon health at a glance.", rows: ["listener :4444 · healthy", "beacon beacon-01 · 60s check-in", "SOCKS pivot · idle"] },
  { id: "system", label: "System", desc: "Providers, plugins, config — no YAML editing.", rows: ["provider opencode_go · healthy", "sandbox image present", "14 plugins · 3 enabled"] },
];

export function ProductTour() {
  const [active, setActive] = useState(TOUR_VIEWS[1]);
  return (
    <div className="mt-10">
      <div className="scrollbar-thin -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" role="tablist" aria-label="Product views">
        <div className="flex min-w-max gap-2">
          {TOUR_VIEWS.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={active.id === v.id}
              onClick={() => setActive(v)}
              className={cn(
                "rounded-md border px-3.5 py-2 text-sm font-medium transition-colors",
                active.id === v.id
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]" role="tabpanel" aria-label={`${active.label} preview`}>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b bg-muted/40 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {active.label} · illustrative
          </div>
          <ul className="space-y-1.5 bg-grid-sm p-4 font-mono text-[12px] leading-5">
            {active.rows.map((r) => (
              <li key={r} className="truncate rounded border bg-background px-2 py-1.5">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center rounded-xl border bg-muted/30 p-6">
          <h3 className="text-lg font-semibold tracking-tight">{active.label}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{active.desc}</p>
          <p className="mt-4">
            <Link href="/install" className="text-sm font-medium underline underline-offset-4">
              Run it locally →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Real WebUI screenshots. Drop PNGs into public/screenshots/ named:
 *   run-creation.png · attack-graph.png · evidence-findings.png · final-report.png
 * (1200px+ wide, redacted lab targets only — 127.0.0.1 / example lab hosts.)
 * Missing files render a labeled placeholder so the section never shows a
 * broken image; add the file and it appears with no code change.
 */
const SCREENSHOTS = [
  { file: "run-creation.png", label: "Run creation", desc: "Target, model, goal and allowlist review before launch." },
  { file: "attack-graph.png", label: "Attack graph", desc: "ReactFlow DAG — ready/blocked steps, hypotheses, evidence links." },
  { file: "evidence-findings.png", label: "Evidence & findings", desc: "Confirmed findings with probe output and the SHA-256 audit chain." },
  { file: "final-report.png", label: "Final report", desc: "Rendered Markdown/HTML report with MITRE export." },
] as const;

export function Screenshots({ available }: { available: Record<string, boolean> }) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2">
      {SCREENSHOTS.map((s) => (
        <figure key={s.file} className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b bg-muted/40 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {s.label}
          </div>
          {available[s.file] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/screenshots/${s.file}`} alt={`BreachPilot WebUI — ${s.label}`} className="aspect-[16/10] w-full object-cover object-top" loading="lazy" />
          ) : (
            <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-1 border-b border-dashed bg-grid-sm p-6 text-center" role="img" aria-label={`Placeholder — ${s.label} screenshot not yet provided`}>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">screenshot pending</p>
              <p className="max-w-xs text-sm text-muted-foreground">Add <code className="rounded border bg-muted px-1 font-mono text-[12px]">public/screenshots/{s.file}</code></p>
            </div>
          )}
          <figcaption className="p-4 text-sm leading-6 text-muted-foreground">{s.desc}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function HomeAttackGraph() {
  return (
    <div className="mt-10">
      <AttackGraph />
      <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
        prerequisites · hypotheses · blocked steps · evidence-linked outcomes
      </p>
    </div>
  );
}
