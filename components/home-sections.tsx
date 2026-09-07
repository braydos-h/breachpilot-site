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
import { Badge, Card, MetaLabel, SectionHeading, StatusDot } from "@/components/ui";
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

export function StatsRow() {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3 lg:grid-cols-5">
      {DERIVED_METRICS.map((s) => (
        <div key={s.label} className="bg-card px-5 py-6 text-center">
          <dd className="text-3xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
          <dt className="mt-1 text-[13px] text-muted-foreground">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

const WHY = [
  {
    icon: Network,
    title: "Adversarial planning",
    body: "A structured AttackPlan DAG with prerequisites, hypotheses and automated failure recovery. It retries with refined parameters, switches capabilities and composes prerequisites dynamically — every decision recorded in decision_log.jsonl.",
  },
  {
    icon: Lock,
    title: "Target-locked execution",
    body: "Target-touching actions are constrained by the target allowlist and mission scope. Every destination is extracted from every command; anything off-allowlist is BLOCKED, scope violations land in the audit chain as SCOPE_DENIED.",
  },
  {
    icon: FileCheck2,
    title: "Evidence-based verification",
    body: "Execution success and evidential success are separate. OutcomeJudge returns CONFIRMED, REFUTED or EXHAUSTED — findings require supporting evidence, and oracle probes decide benchmarks, never agent claims.",
  },
  {
    icon: Globe,
    title: "Domain-aware reconnaissance",
    body: "Hand it a domain and the platform resolves and expands the surface — certificate transparency, DNS bruteforce, subfinder/amass — auto-authorizing discovered hosts, flagging dangling-CNAME takeovers, staying scope-aware throughout.",
  },
  {
    icon: Brain,
    title: "Persistent knowledge",
    body: `${META.skills ?? "140+"} advisory skills with deterministic and semantic selection, cross-mission semantic memory over nomic-embed-text, per-attempt attack memory and Bayesian experience scoring. Lessons survive the run.`,
  },
];

export function WhyGrid() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {WHY.map((w) => (
        <Card key={w.title} className="animate-fade-in-up">
          <w.icon className="h-5 w-5 text-foreground" aria-hidden />
          <h3 className="mt-3 font-semibold tracking-tight">{w.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{w.body}</p>
        </Card>
      ))}
      <Card className="flex flex-col justify-between border-dashed">
        <div>
          <ShieldCheck className="h-5 w-5 text-foreground" aria-hidden />
          <h3 className="mt-3 font-semibold tracking-tight">Operator-supervised safety</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Read-only recon, approval gates, disposable sandbox workers and a tamper-evident SHA-256 audit chain.
          </p>
        </div>
        <Link href="/safety" className="mt-4 text-sm font-medium underline underline-offset-4">
          Read the safety model →
        </Link>
      </Card>
    </div>
  );
}

export function SwarmDiagram() {
  return (
    <div className="mt-10">
      {/* orchestrator core */}
      <div className="mx-auto max-w-md rounded-xl border bg-card p-5 text-center shadow-[0_1px_2px_0_hsl(var(--foreground)/0.04)]">
        <MetaLabel>Shared blackboard + battle log</MetaLabel>
        <p className="mt-1 font-semibold">Swarm Orchestrator</p>
        <p className="mt-1 text-sm text-muted-foreground">parallel dispatch · phase-aware skill hints · cross-phase negotiation</p>
      </div>
      {/* connectors + agents */}
      <div className="mx-auto mt-0 grid max-w-4xl gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Six specialist agents">
        {SWARM_AGENTS.map((a) => {
          const Icon = AGENT_ICONS[a.icon] ?? Zap;
          return (
            <div key={a.id} className="relative rounded-lg border bg-card p-4">
              <span className="absolute -top-px left-1/2 h-6 w-px -translate-x-1/2 -translate-y-full bg-border" aria-hidden />
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <Icon className="h-3.5 w-3.5" aria-hidden /> {a.id}
              </p>
              <p className="mt-1 font-semibold">{a.name}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{a.job}</p>
            </div>
          );
        })}
      </div>
      <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
        <Link href="/features/swarm" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
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
  { id: "new-run", label: "New Run", desc: "Configure target (IP or domain), model, goal and execution options, then review and launch. The allowlist is set before anything runs.", rows: ["target  127.0.0.1  ·  allowlisted", "goal  initial_access  [GATED]", "mode  attack · full_access (lab)"] },
  { id: "live-run", label: "Live Run", desc: "Real-time event stream — tool calls, decisions and telemetry over WebSocket. Token-gated and ring-buffered.", rows: ["recon › run_full_recon → 4 ports", "vuln › CVE-2024-xxxx ↔ module 87/100", "critic › scope PASS · in-allowlist"] },
  { id: "graph", label: "Attack Graph", desc: "Interactive ReactFlow DAG with pan, zoom, filtering, path finding and evidence inspection. Backed by AttackPlan ready/blocked steps.", rows: ["8 nodes · 2 ready · 1 blocked", "path: recon → hypothesis H-03", "evidence attached to H-03"] },
  { id: "evidence", label: "Evidence", desc: "Reports, raw Nmap output, findings and the SHA-256 audit chain — tamper-evident, exportable to Markdown and HTML.", rows: ["H-03 PROBE … CONFIRMED", "audit chain · sha256 9f3a…c41d", "report.md + report.html rendered"] },
  { id: "skills", label: "Skills", desc: "Browse the advisory skill catalog and per-run selection — deterministic tags plus semantic matching, re-evaluated mid-run.", rows: ["top-6 selected for this context", "jwt-algorithm-confusion … 0.91", "re-selection on new CVE"] },
  { id: "modules", label: "Modules", desc: "Fifteen attack-module families with applicability scores (0–100) against the target's services, ports and CVEs.", rows: ["web … 87/100 · applicable", "crypto_jwt … 72/100", "privesc … gated on access"] },
  { id: "benchmarks", label: "Benchmarks", desc: "Oracle-verified suites: claimed success vs oracle-verified success, false-positive rate, trial history and regression gates.", rows: ["VERIFIED ≠ claimed", "false_positive_rate tracked", "baseline.json regression gate"] },
  { id: "memory", label: "Memory", desc: "Cross-mission semantic memory and experience-store lessons — what worked, against what, with what evidence.", rows: ["lesson: smb-signing-off → relay", "confidence 0.83 · 4 refs", "nomic-embed-text indexed"] },
  { id: "connections", label: "Connections", desc: "Operator connections, listeners and beacon health — persistent RCE beacons with workspace callback management.", rows: ["listener :4444 · healthy", "beacon beacon-01 · 60s check-in", "SOCKS pivot · idle"] },
  { id: "system", label: "System", desc: "Configuration, secrets, models and providers, skills, plugins and diagnostics. No manual YAML editing required.", rows: ["provider opencode_go · healthy", "sandbox image present", "14 plugins · 3 enabled"] },
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
          <div className="border-b bg-muted/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
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
          <p className="mt-2 text-[15px] leading-7 text-muted-foreground">{active.desc}</p>
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
          <div className="border-b bg-muted/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {s.label}
          </div>
          {available[s.file] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/screenshots/${s.file}`} alt={`BreachPilot WebUI — ${s.label}`} className="aspect-[16/10] w-full object-cover object-top" loading="lazy" />
          ) : (
            <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-1 border-b border-dashed bg-grid-sm p-6 text-center" role="img" aria-label={`Placeholder — ${s.label} screenshot not yet provided`}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">screenshot pending</p>
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
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge>
          <StatusDot tone="ok" /> prerequisites
        </Badge>
        <Badge>
          <StatusDot tone="warn" /> hypotheses
        </Badge>
        <Badge>
          <StatusDot tone="idle" /> blocked steps
        </Badge>
        <Badge>evidence-linked outcomes</Badge>
      </div>
    </div>
  );
}
