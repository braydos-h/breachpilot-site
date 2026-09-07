import { ArrowRight, BookOpen, Github, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { GithubStats } from "@/components/github-stats";
import { HomeAttackGraph, ProductTour, StatsRow, SwarmDiagram, WhyGrid } from "@/components/home-sections";
import { InstallTabs } from "@/components/install-tabs";
import { MissionControl } from "@/components/mission-control";
import { Typewriter } from "@/components/typewriter";
import { SectionHeading } from "@/components/ui";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <div>
      {/* announcement */}
      <div className="border-b">
        <p className="mx-auto max-w-6xl px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:px-6">
          Open source · Apache 2.0 · Local-first
        </p>
      </div>

      {/* hero */}
      <section className="bg-grid relative overflow-hidden">
        <div className="bg-radial-fade pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Open-source autonomous security assessment
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Autonomous security assessment. <span className="text-gradient">Operator supervised.</span>
            </h1>
            <Typewriter />
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
              BreachPilot is an open-source agentic operator for authorized security testing. It plans,
              discovers, reasons, chains, verifies and produces evidence-backed reports — while remaining
              target-locked, audited and operator-supervised.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/install"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Install BreachPilot <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Github className="h-4 w-4" aria-hidden /> View on GitHub
              </a>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <BookOpen className="h-4 w-4" aria-hidden /> Read the docs
              </Link>
            </div>
            <div className="mt-3">
              <GithubStats owner="braydos-h" repo="BreachPilot" />
            </div>
            <InstallTabs />
          </div>

          <div className="mt-12 animate-fade-in-up">
            <MissionControl />
            <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">
              illustrative lab run · 127.0.0.1 · recon → initial access → verify → report
            </p>
          </div>
        </div>
      </section>

      {/* stats */}
      <section aria-label="Project metrics" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <StatsRow />
        <p className="mt-3 text-center text-[13px] text-muted-foreground">
          Live counts from the repository catalog — skills, tools, modules, agents, families.
        </p>
      </section>

      {/* why */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Why BreachPilot"
            title="A full assessment lifecycle, under supervision"
            lede="From reconnaissance through exploitation, verification and reporting — one operator-supervised engine with the audit trail to prove what happened."
          />
          <WhyGrid />
        </div>
      </section>

      {/* swarm */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Multi-agent orchestration"
          title="Six specialists, one shared blackboard"
          lede="Parallel dispatch across recon, vuln, exploit, post-exploit, critic and reflection — with battle logs and cross-phase negotiation, plus a persistent autonomous orchestrator for extended campaigns."
        />
        <SwarmDiagram />
      </section>

      {/* attack graph */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Attack graph"
            title="A structured plan, not a prompt chain"
            lede="Every run builds an AttackPlan DAG — prerequisites, hypotheses, ready and blocked steps, evidence and outcomes — inspectable live in the WebUI's ReactFlow graph."
          />
          <HomeAttackGraph />
        </div>
      </section>

      {/* product tour */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Inside BreachPilot"
          title="Mission control for the whole run"
          lede="The WebUI is a loopback-only, bearer-token console at 127.0.0.1:8765 — wizard, live stream, graph, evidence, skills, modules, benchmarks, memory, connections and system in one place."
        />
        <ProductTour />
      </section>

      {/* safety strip */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="rounded-xl border bg-card p-6 sm:p-8">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <ShieldAlert className="h-4 w-4" aria-hidden /> Built for authorized security testing
            </p>
            <blockquote className="mt-3 border-l-2 border-foreground pl-4 text-lg font-medium leading-8 tracking-tight">
              Only test systems you own or have explicit written permission to assess.
            </blockquote>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted-foreground">
              Attack mode auto-approves in-scope actions — the safeties are the target-IP allowlist lock
              and the mission scope gate, with every action in a tamper-evident audit chain. No softened
              language: read exactly how it works.
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
          </div>
        </div>
      </section>
    </div>
  );
}
