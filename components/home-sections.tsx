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
import { AttackGraph } from "@/components/attack-graph";
import { Card, MetaLabel, SectionHeading } from "@/components/ui";
import { DERIVED_METRICS, META } from "@/lib/meta";
import { SWARM_AGENTS } from "@/lib/site";

type AgentIcon = (typeof SWARM_AGENTS)[number]["icon"];
type AgentId = (typeof SWARM_AGENTS)[number]["id"];

const AGENT_ICONS: Record<AgentIcon, typeof Radar> = {
  Radar,
  Search,
  Zap,
  KeyRound,
  ShieldCheck,
  Brain,
};

/** Metrics strip — dividers, not cards. Cells keep a min-width so the strip scrolls instead of crushing. */
export function StatsRow() {
  return (
    <dl className="flex divide-x overflow-x-auto rounded-xl border bg-card">
      {DERIVED_METRICS.map((s) => {
        const method = methodFor(s.label);
        const methodId = `metric-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <div key={s.label} className="min-w-[128px] flex-1 px-4 py-5 text-center sm:min-w-[140px] sm:px-5 sm:py-6">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl" aria-describedby={method ? methodId : undefined}>
              {s.value}
            </dd>
            {method ? (
              <span id={methodId} className="sr-only">
                Counting method: {method}
              </span>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}

function methodFor(label: string): string | undefined {
  const m = META.method;
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
  },
  {
    icon: Lock,
    title: "Target-locked execution",
    body: "Allowlist + mission scope gate on every action.",
    proof: "off-allowlist BLOCKED · SCOPE_DENIED logged",
  },
  {
    icon: FileCheck2,
    title: "Evidence-based verification",
    body: "Execution success and evidential success are separate.",
    proof: "CONFIRMED / REFUTED / EXHAUSTED + oracle probes",
  },
  {
    icon: Globe,
    title: "Domain-aware recon",
    body: "Domain in, scope-aware attack surface out.",
    proof: "CT / DNS / subfinder · takeover flags",
  },
  {
    icon: Brain,
    title: "Persistent knowledge",
    body: "Lessons survive the run.",
    proof: `${META.skills ?? "140+"} skills · semantic + Bayesian scoring`,
  },
];

/** Uniform grid — six cards fill every row on sm (2-col) and lg (3-col). */
export function WhyGrid() {
  return (
    <div className="mt-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WHY.map((w) => (
          <Card key={w.title}>
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
const AGENT_SHORT: Record<AgentId, string> = {
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
      {/* lifecycle strip: six numbered steps, arrows on desktop, stacked on mobile */}
      <ol
        className="mx-auto mt-6 grid max-w-5xl gap-2 sm:grid-cols-2 lg:flex lg:items-stretch"
        aria-label="Six specialist agents"
      >
        {SWARM_AGENTS.map((a, i) => {
          const Icon = AGENT_ICONS[a.icon];
          return (
            <li key={a.id} className="flex min-w-0 flex-1 items-stretch gap-2">
              {i > 0 && (
                <span className="hidden shrink-0 items-center text-muted-foreground lg:flex" aria-hidden>
                  →
                </span>
              )}
              <Link
                href="/features/swarm"
                aria-label={`Step ${i + 1} of 6: ${a.name} — ${AGENT_SHORT[a.id]}`}
                className="min-w-0 flex-1 rounded-lg border bg-card p-3 transition-colors hover:bg-muted"
              >
                <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <span className="font-semibold" aria-hidden>
                    {i + 1}
                  </span>
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{a.id}</span>
                </p>
                <p className="mt-1 text-sm font-semibold">{a.name}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{AGENT_SHORT[a.id]}</p>
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
            <img
              src={`/screenshots/${s.file}`}
              alt={`BreachPilot WebUI — ${s.label}`}
              width={1200}
              height={750}
              decoding="async"
              className="aspect-[16/10] w-full border-b object-cover object-top"
              loading="lazy"
            />
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
