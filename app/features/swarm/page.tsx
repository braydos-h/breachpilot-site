import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, SectionHeading } from "@/components/ui";
import { SITE, SWARM_AGENTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Six-Agent Swarm",
  description:
    "BreachPilot's six specialist agents — recon, vuln, exploit, post_exploit, critic, reflection — on a shared blackboard, plus persistent autonomous campaign orchestration.",
  alternates: { canonical: `${SITE.url}/features/swarm` },
};

const DETAIL: Record<string, string> = {
  recon: "Scanning, fingerprinting and attack-surface scoring. Opens the run and keeps the target model fresh as new services appear.",
  vuln: "CVE and exploit correlation plus module matching — pairs threat intel (NVD, EPSS, KEV) with applicable capabilities.",
  exploit: "Module selection, payload crafting and mutation, execution through the MCP tool layer under policy and allowlist.",
  post_exploit: "Credential and loot handling, lateral-target generation — still inside the same target lock.",
  critic: "Pre-execution scope, risk and policy review. The conscience of the swarm: forbidden actions and disallowed assets die here.",
  reflection: "Strategy review and lessons learned — feeds the experience store so the next run starts smarter.",
};

export default function SwarmPage() {
  return (
    <div>
      <PageHero
        eyebrow="Multi-agent orchestration"
        title="The six-agent swarm"
        lede="Six specialists share one blackboard with a battle log: parallel dispatch, phase-aware skill hints and cross-phase negotiation — supervised, target-locked, and fully audited."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/docs/swarm"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Read the swarm docs
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Safety model
          </Link>
        </div>
      </PageHero>
      <section aria-label="Swarm agents" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="The specialists"
          title="Six agents, one shared mission"
          lede="Each agent owns a phase of the assessment. They read and write shared state instead of passing messages in a chain — for authorized targets only."
          align="left"
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWARM_AGENTS.map((a) => (
            <li key={a.id}>
              <Card className="h-full">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{a.id}</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{a.name}</h3>
                <p className="mt-1 text-sm font-medium text-foreground/80">{a.job}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{DETAIL[a.id]}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            eyebrow="Shared state"
            title="Blackboard + battle log"
            lede="Agents don't pass messages in a chain — they read and write shared state. The blackboard holds the target model, hypotheses, findings and plan; the battle log records who decided what, so runs stay debuggable and resumable."
            align="left"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="font-semibold tracking-tight">Single-target swarm mode</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                <code className="rounded border bg-muted px-1 font-mono text-[13px]">--swarm</code> decomposes one
                authorized target across the six specialists: parallel recon plus vuln research, critic pre-check,
                reflection shifts. Best for going deep on a high-value system you own or have written permission
                to test.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold tracking-tight">Persistent campaign orchestration</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Without <code className="rounded border bg-muted px-1 font-mono text-[13px]">--swarm</code>, the
                autonomous campaign drives a persistent multi-phase queue — recon → exploit → privesc → lateral →
                validation — with adaptive aggression, resume and checkpoints across one or many authorized targets.
                Same target-IP lock and permission model either way.
              </p>
            </Card>
          </div>
          <div className="mt-8 rounded-lg border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Authorized testing only — </span>
            the swarm runs against allowlisted targets under the mission scope gate, with every decision in a
            tamper-evident audit chain. Only test systems you own or have explicit written permission to assess.{" "}
            <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">
              Safety model
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/docs/swarm"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Swarm engineering docs
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              All capabilities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
