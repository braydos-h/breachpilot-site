import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, SectionHeading } from "@/components/ui";
import { SWARM_AGENTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Six-Agent Swarm",
  description:
    "BreachPilot's six specialist agents — recon, vuln, exploit, post_exploit, critic, reflection — on a shared blackboard, plus persistent autonomous campaign orchestration.",
  alternates: { canonical: "https://breachpilot.dev/features/swarm" },
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
        lede="Six specialists share one blackboard with a battle log: parallel dispatch, phase-aware skill hints and cross-phase negotiation — orchestrated via tools/swarm/orchestrator.py."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWARM_AGENTS.map((a) => (
            <Card key={a.id}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{a.id}</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">{a.name}</h2>
              <p className="mt-1 text-sm font-medium text-foreground/80">{a.job}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{DETAIL[a.id]}</p>
            </Card>
          ))}
        </div>
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
                target across the six specialists: parallel recon plus vuln research, critic pre-check, reflection
                shifts. Best for going deep on a high-value box.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold tracking-tight">Persistent campaign orchestration</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Without <code className="rounded border bg-muted px-1 font-mono text-[13px]">--swarm</code>, the
                autonomous campaign drives a persistent multi-phase queue — recon → exploit → privesc → lateral →
                validation — with adaptive aggression, resume and checkpoints across one or many targets. Combine
                both on high-value targets. Same target-IP lock and permission model either way.
              </p>
            </Card>
          </div>
          <p className="mt-8 text-sm">
            <Link href="/docs/swarm" className="font-medium underline underline-offset-4">
              Swarm engineering docs →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
