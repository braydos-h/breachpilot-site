import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  History,
  KeyRound,
  Radar,
  Search,
  ShieldAlert,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { SITE, SWARM_AGENTS } from "@/lib/site";
import { routeMetadata } from "@/lib/metadata";

export const metadata: Metadata = routeMetadata("/features/swarm", {
  description:
    "BreachPilot's six specialist agents (recon, vuln, exploit, post_exploit, critic, reflection) on a shared blackboard, plus persistent autonomous campaign orchestration.",
  title: "The Six-Agent Swarm",
});

const DETAIL: Record<string, string> = {
  critic:
    "Reviews scope, risk and policy before execution. Forbidden actions and disallowed assets die here, before anything runs.",
  exploit:
    "Selects modules, crafts and mutates payloads, and executes through the MCP tool layer under policy and allowlist.",
  post_exploit:
    "Handles credentials and loot, and generates lateral targets inside the same target lock.",
  recon:
    "Scans, fingerprints, and scores the attack surface. Opens the run and keeps the target model fresh as new services appear.",
  reflection:
    "Reviews strategy and records lessons learned in the experience store so the next run starts smarter.",
  vuln: "CVE and exploit correlation plus module matching, pairing threat intel (NVD, EPSS, KEV) with applicable capabilities.",
};

const ICONS: Record<string, LucideIcon> = {
  Brain,
  KeyRound,
  Radar,
  Search,
  ShieldCheck,
  Zap,
};

const LIFECYCLE: Array<{ agent: string; phase: string; text: string; gate?: boolean }> = [
  {
    agent: "Recon",
    phase: "Phase 1 · Discover",
    text: "Fingerprint the authorized target and score the attack surface. Seeds the blackboard target model.",
  },
  {
    agent: "Vuln",
    phase: "Phase 2 · Correlate",
    text: "Match threat intel and CVEs to applicable capabilities. Raises hypotheses, not payloads.",
  },
  {
    agent: "Critic",
    gate: true,
    phase: "Gate · Review",
    text: "Reviews scope, risk and policy. Forbidden actions and out-of-scope assets are killed here. Nothing executes without a pass.",
  },
  {
    agent: "Exploit",
    phase: "Phase 3 · Execute",
    text: "Selects modules, crafts payloads and executes through the policy-enforced tool layer.",
  },
  {
    agent: "Post Exploit",
    phase: "Phase 4 · Consolidate",
    text: "Handles credentials and loot, and proposes lateral targets inside the same target lock.",
  },
  {
    agent: "Reflection",
    phase: "Phase 5 · Learn",
    text: "Reviews strategy and records lessons to the experience store, so the next loop starts smarter.",
  },
];

export default function SwarmPage() {
  return (
    <div>
      <PageHero
        eyebrow="Multi-agent orchestration"
        lede="Six specialists share one blackboard with a battle log: parallel dispatch, phase-aware skill hints and cross-phase negotiation. Supervised, target-locked, and fully audited. For authorized targets only."
        title="The six-agent swarm"
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge>6 specialists</Badge>
          <Badge>Shared blackboard</Badge>
          <Badge>Critic safety gate</Badge>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            href="/docs/swarm"
          >
            Read the swarm docs
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
            href="/safety"
          >
            <ShieldAlert aria-hidden className="h-4 w-4" />
            Safety model
          </Link>
        </div>
      </PageHero>

      <section aria-label="Swarm agents" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          align="left"
          eyebrow="The specialists"
          lede="Each agent owns a phase of the assessment. They read and write shared state instead of passing messages in a chain. For authorized targets only."
          title="Six agents, one shared mission"
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWARM_AGENTS.map((a) => {
            const Icon = ICONS[a.icon] ?? Radar;
            const featured = a.id === "critic" || a.id === "reflection";
            return (
              <li key={a.id}>
                <Card className={featured ? "h-full border-foreground/30" : "h-full"}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-muted/60">
                      <Icon aria-hidden className="h-4 w-4" />
                    </span>
                    {a.id === "critic" ? (
                      <Badge tone="solid">Safety gate</Badge>
                    ) : a.id === "reflection" ? (
                      <Badge>Learns</Badge>
                    ) : null}
                  </div>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {a.id}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{a.name}</h3>
                  <p className="mt-1 text-sm font-medium text-foreground/80">{a.job}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{DETAIL[a.id]}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="lifecycle-heading" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="How a run flows"
            lede="One loop around the swarm: discover, correlate, pass the critic gate, execute, consolidate, learn, then loop with a smarter plan. Every transition is written to the battle log."
            title="The swarm lifecycle"
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {LIFECYCLE.map((step, i) => (
              <li key={step.agent}>
                <Card className={step.gate ? "h-full border-foreground/30 bg-card" : "h-full"}>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs font-semibold text-background"
                    >
                      {i + 1}
                    </span>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {step.phase}
                    </p>
                  </div>
                  <h3 className="mt-3 font-semibold tracking-tight">
                    {step.agent}
                    {step.gate ? (
                      <span className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-foreground/80">
                        <ShieldCheck aria-hidden className="h-4 w-4" />
                        must pass
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </Card>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <History aria-hidden className="mt-1 h-4 w-4 shrink-0" />
            <span>
              The loop repeats until the plan is exhausted or the operator stops it. Reflection output feeds
              the next recon pass, so coverage builds up instead of restarting from zero.
            </span>
          </p>
        </div>
      </section>

      <section aria-labelledby="oversight-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          align="left"
          eyebrow="Why it stays safe"
          lede="Two agents keep the other four honest. They carry no payloads, only veto power and memory."
          title="Critic and reflection: the oversight pair"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2.5">
              <ShieldCheck aria-hidden className="h-5 w-5" />
              <h3 className="font-semibold tracking-tight">Critic reviews before execution</h3>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
              <li>Checks every proposed action against mission scope and the allowlisted target lock.</li>
              <li>Kills forbidden actions and disallowed assets before anything runs.</li>
              <li>Flags high-risk steps for operator confirmation instead of silently proceeding.</li>
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-2.5">
              <Brain aria-hidden className="h-5 w-5" />
              <h3 className="font-semibold tracking-tight">Reflection learns after execution</h3>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
              <li>Reviews what worked, what failed, and what the plan missed.</li>
              <li>Writes lessons to the persistent experience store for future runs.</li>
              <li>Shifts strategy mid-run, for example steering recon toward newly exposed services.</li>
            </ul>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold tracking-tight">Blackboard: shared truth</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The target model, hypotheses, findings and plan live in one shared state store. Agents read
              and write the blackboard instead of chaining messages, so parallel recon and vuln research
              never diverge.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold tracking-tight">Battle log: full audit</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Who decided what, and when. The battle log feeds the tamper-evident audit chain, so every
              run is debuggable, resumable and reviewable. See the{" "}
              <Link className="font-medium text-foreground underline underline-offset-4" href="/safety">
                safety model
              </Link>
              .
            </p>
          </Card>
        </div>
      </section>

      <section aria-label="Run modes" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="Run modes"
            lede="One swarm, two ways to drive it. Same target-IP lock and permission model either way."
            title="Swarm mode or campaign mode"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="font-semibold tracking-tight">Single-target swarm mode</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                <code className="rounded border bg-muted px-1 font-mono text-[13px]">--swarm</code>{" "}
                splits one authorized target across the six specialists: parallel recon plus vuln
                research, critic pre-check, reflection shifts. It fits going deep on a high-value system
                you own or have written permission to test.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold tracking-tight">Persistent campaign orchestration</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Without <code className="rounded border bg-muted px-1 font-mono text-[13px]">--swarm</code>
                , the autonomous campaign drives a persistent multi-phase queue (recon, exploit, privesc,
                lateral, validation) with adaptive aggression, resume and checkpoints across one or many
                authorized targets.
              </p>
            </Card>
          </div>
          <div className="mt-8 rounded-lg border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Authorized testing only. </span>
            the swarm runs against allowlisted targets under the mission scope gate, with every decision in
            a tamper-evident audit chain. Only test systems you own or have explicit written permission to
            assess.{" "}
            <Link className="font-medium text-foreground underline underline-offset-4" href="/safety">
              Safety model
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              href="/docs/swarm"
            >
              Swarm engineering docs
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
              href={SITE.repo}
            >
              Source on GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
