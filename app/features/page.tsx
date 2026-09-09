import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Building2,
  FileCheck2,
  FileText,
  FlaskConical,
  GitBranch,
  GraduationCap,
  History,
  KeyRound,
  ListChecks,
  Lock,
  Network,
  Radar,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Ticket,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AttackGraph } from "@/components/attack-graph";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { META } from "@/lib/meta";
import { routeMetadata } from "@/lib/metadata";
import { PLUGINS, PROVIDERS, SITE, SWARM_AGENTS } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/features", {
  description:
    "BreachPilot capabilities: specialist swarm, structured attack graph, oracle-checked evidence and export-ready reporting. For authorized testing only.",
  title: "Features",
});

/** Pipeline overview strip — CSS-only anchors into the four pillars below. */
const OVERVIEW = [
  { href: "#swarm", step: "Swarm", sub: "specialists" },
  { href: "#attack-graph", step: "Attack graph", sub: "structured plan" },
  { href: "#evidence", step: "Evidence", sub: "evidence-backed" },
  { href: "#reporting", step: "Reporting", sub: "export-ready" },
];

type AgentIcon = (typeof SWARM_AGENTS)[number]["icon"];
type AgentId = (typeof SWARM_AGENTS)[number]["id"];

const SWARM_ICONS: Record<AgentIcon, LucideIcon> = {
  Brain,
  KeyRound,
  Radar,
  Search,
  ShieldCheck,
  Zap,
};

const SWARM_PHASE: Record<AgentId, string> = {
  critic: "Gate · Review",
  exploit: "Execute",
  post_exploit: "Consolidate",
  recon: "Discover",
  reflection: "Learn",
  vuln: "Correlate",
};

function Group({
  id,
  eyebrow,
  title,
  lede,
  children,
  tint = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
  tint?: boolean;
}) {
  return (
    <section id={id} aria-label={title} className={tint ? "border-t bg-muted/30" : "border-t"}>
      <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} align="left" />
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  proof,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  proof?: string;
}) {
  return (
    <Card className="group h-full transition-colors hover:border-foreground/30">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-muted/60 transition-colors group-hover:bg-muted">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <h3 className="mt-3 font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{body}</p>
      {proof ? <p className="mt-2 font-mono text-xs text-muted-foreground">{proof}</p> : null}
    </Card>
  );
}

const GRAPH_POINTS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    body: "Capabilities declare what they need and what they produce. The planner composes valid chains, skips dead ends, and keeps every hop target-locked.",
    icon: GitBranch,
    title: "Prerequisite chaining",
  },
  {
    body: "Suspicious observations become testable hypotheses with explicit pass criteria. An independent oracle probe decides each one.",
    icon: FlaskConical,
    title: "Hypothesis lifecycle",
  },
  {
    body: "Ready, blocked and exhausted steps stay visible in the WebUI graph, with the reason attached. A stuck plan says why it stopped.",
    icon: ListChecks,
    title: "Blocked steps stay visible",
  },
];

const EVIDENCE: Array<{ icon: LucideIcon; title: string; body: string; proof: string }> = [
  {
    body: "Running a capability and proving a weakness are separate events. Only an independent probe that observes the claimed effect produces a confirmed finding.",
    icon: FileCheck2,
    proof: "CONFIRMED / REFUTED / EXHAUSTED · oracle probes",
    title: "Oracle-checked verdicts",
  },
  {
    body: "Every proposal, approval, execution and verdict lands in a hash-chained audit log. Rerun the chain to replay the run. Reviewers see the same steps the operator saw.",
    icon: History,
    proof: "SHA-256 audit chain · decision_log.jsonl",
    title: "Tamper-evident audit chain",
  },
  {
    body: "Recovered credentials and collected material rest in an encrypted vault (for example, C:\\BreachPilot\\vault\\…). They never land in chat logs or terminal scrollback.",
    icon: Lock,
    proof: "encrypted vault · allowlist-scoped handling",
    title: "Loot vault, still in scope",
  },
];

const REPORTING: Array<{ icon: LucideIcon; title: string; body: string; proof: string }> = [
  {
    body: "Each finding ships with timeline, severity, attack chain and linked probe output. A defender gets the evidence needed to reproduce the result.",
    icon: FileText,
    proof: "Markdown + HTML · CVSS · chain view",
    title: "Findings reviewers trust",
  },
  {
    body: "Confirmed techniques map to tactics and export for Navigator. The report plugs straight into detection-gap reviews.",
    icon: Network,
    proof: "ATT&CK Navigator export",
    title: "ATT&CK-mapped output",
  },
  {
    body: "Findings convert to tickets with severity, reproduction context and evidence links attached, so remediation starts from proof.",
    icon: Ticket,
    proof: "ticket creation · evidence-linked",
    title: "Handoff to remediation",
  },
];

const USE_CASES: Array<{ icon: LucideIcon; title: string; body: string; scope: string }> = [
  {
    body: "Scope a release or network segment, let the swarm work the allowlist in parallel, and hand stakeholders a report where every claim links to probe output.",
    icon: Building2,
    scope: "Scope: systems your team owns or is contracted to test.",
    title: "Internal assessment teams",
  },
  {
    body: "Emulate adversary behavior against lab infrastructure, then check which techniques your detections caught. The audit chain works as exercise notes.",
    icon: GraduationCap,
    scope: "Scope: isolated lab ranges and cyber-range targets.",
    title: "Labs and detection validation",
  },
  {
    body: "Re-run authorized assessments on a schedule and diff the findings. Reflection memory and the experience store give each cycle a head start on the last.",
    icon: RefreshCw,
    scope: "Scope: standing written authorization, same allowlist discipline.",
    title: "Continuous authorized validation",
  },
];

export default function FeaturesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Capabilities"
        lede="Specialist agents plan against allowlisted targets, chain capabilities through a structured attack graph, and prove each claim with oracle-checked evidence and export-ready reports. This is a capability overview. For authorized testing only."
        title="Full assessment lifecycle, under supervision"
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge>
            {SWARM_AGENTS.length} swarm specialists
          </Badge>
          <Badge>
            {META.attackFamilies} attack families
          </Badge>
          <Badge>
            {META.mcpTools} MCP tools
          </Badge>
          <Badge>
            {META.skills} advisory skills
          </Badge>
        </div>
        <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Capability overview">
          {OVERVIEW.map((o) => (
            <li key={o.href} className="min-w-0">
              <a
                href={o.href}
                className="block min-w-0 rounded-lg border bg-background px-4 py-3 transition-colors hover:border-foreground/30 hover:bg-muted"
              >
                <span className="block text-sm font-semibold">{o.step}</span>
                <span className="mt-0.5 block font-mono text-xs text-muted-foreground">{o.sub}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <p className="mt-4 flex items-start gap-1.5 text-sm text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            Authorized testing only. Only test systems you own or have explicit written permission to assess.
          </span>
        </p>
      </PageHero>

      <Group
        id="swarm"
        eyebrow="Swarm"
        lede="Parallel specialists read and write one shared blackboard rather than chaining messages. A critic gate kills out-of-scope actions before anything runs. For authorized targets only."
        title="Specialists that negotiate over shared state"
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWARM_AGENTS.map((a) => {
            const Icon = SWARM_ICONS[a.icon];
            const gated = a.id === "critic";
            return (
              <li key={a.id}>
                <Card
                  className={
                    gated
                      ? "group h-full border-foreground/30 transition-colors hover:border-foreground/50"
                      : "group h-full transition-colors hover:border-foreground/30"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-muted/60 transition-colors group-hover:bg-muted">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {gated ? <Badge tone="solid">Safety gate</Badge> : null}
                  </div>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {a.id} · {SWARM_PHASE[a.id]}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{a.name}</h3>
                  <p className="mt-1 text-sm font-medium text-foreground/80">{a.job}</p>
                </Card>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/features/swarm"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Explore the swarm <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/docs/swarm"
            className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Swarm engineering docs
          </Link>
        </div>
      </Group>

      <Group
        id="attack-graph"
        eyebrow="Attack graph"
        lede="Every run builds a structured plan with hypotheses, prerequisites and blocked steps, rendered live in the WebUI graph. Planning stays supervised throughout."
        title="A structured plan with visible state"
        tint
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <ul className="grid gap-4">
            {GRAPH_POINTS.map((g) => (
              <li key={g.title}>
                <FeatureCard icon={g.icon} title={g.title} body={g.body} />
              </li>
            ))}
          </ul>
          <div>
            <AttackGraph />
            <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
              prerequisites · hypotheses · blocked steps · evidence-linked outcomes
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm">
          <Link href="/architecture" className="font-medium underline underline-offset-4">
            How planning fits the architecture →
          </Link>
        </p>
      </Group>

      <Group
        id="evidence"
        eyebrow="Evidence"
        lede="Claims without proof are noise. Execution success and evidential success are tracked separately, and only oracle-observed effects become findings."
        title="Verified, not claimed"
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {EVIDENCE.map((e) => (
            <li key={e.title}>
              <FeatureCard icon={e.icon} title={e.title} body={e.body} proof={e.proof} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          <Link href="/benchmarks" className="font-medium underline underline-offset-4">
            See how outcomes are verified →
          </Link>
        </p>
      </Group>

      <Group
        id="reporting"
        eyebrow="Reporting"
        lede="Reports assemble from the same evidence the operator watched accumulate: timelines, chains and verdicts."
        title="Evidence-backed, export-ready"
        tint
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPORTING.map((r) => (
            <li key={r.title}>
              <FeatureCard icon={r.icon} title={r.title} body={r.body} proof={r.proof} />
            </li>
          ))}
        </ul>
      </Group>

      <Group
        id="use-cases"
        eyebrow="Use cases"
        lede="Where teams point it: systems they own or have explicit written permission to test."
        title="Built for authorized work"
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {USE_CASES.map((u) => (
            <li key={u.title}>
              <Card className="group h-full transition-colors hover:border-foreground/30">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-muted/60 transition-colors group-hover:bg-muted">
                  <u.icon className="h-4 w-4" aria-hidden />
                </span>
                <h3 className="mt-3 font-semibold tracking-tight">{u.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{u.body}</p>
                <p className="mt-2 text-xs font-medium leading-5 text-foreground/80">{u.scope}</p>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-lg border bg-card p-4 text-sm leading-6 text-muted-foreground">
          <span className="font-semibold text-foreground">Extends your workflow: </span>
          {PLUGINS.length} plugins ({PLUGINS.slice(0, 3)
            .map((p) => p.name)
            .join(" · ")}
          , and more) plus {PROVIDERS.length} model-provider routes over {META.mcpTools} tools.{" "}
          <Link href="/plugins" className="font-medium text-foreground underline underline-offset-4">
            Plugins
          </Link>{" "}
          ·{" "}
          <Link href="/providers" className="font-medium text-foreground underline underline-offset-4">
            Providers
          </Link>
        </div>
      </Group>

      <section aria-label="Authorized testing notice" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 rounded-xl border bg-card p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <ShieldAlert className="h-4 w-4" aria-hidden /> Built for authorized security testing
              </p>
              <blockquote className="mt-3 border-l-2 border-foreground pl-4 text-lg font-medium leading-8 tracking-tight">
                Only test systems you own or have explicit written permission to assess.
              </blockquote>
            </div>
            <div>
              <p className="text-sm leading-6 text-muted-foreground">
                Attack mode auto-approves in-scope actions. The target-IP allowlist
                lock and the mission scope gate stay enforced, with every action in a tamper-evident audit chain.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/safety"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Read the safety model
                </Link>
                <Link
                  href="/install"
                  className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Install for your lab
                </Link>
              </div>
              <p className="mt-4 text-sm">
                <a
                  href={SITE.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  Source on GitHub →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
