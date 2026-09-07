import type { Metadata } from "next";
import { ArrowRight, Github, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { GithubStats } from "@/components/github-stats";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { HomeAttackGraph, ProductTour, Screenshots, StatsRow, SwarmDiagram, WhyGrid } from "@/components/home-sections";
import { InstallTabs } from "@/components/install-tabs";
import { MissionControl } from "@/components/mission-control";
import { Typewriter } from "@/components/typewriter";
import { SectionHeading } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE.description,
  alternates: { canonical: SITE.url },
};

const SHOT_FILES = ["run-creation.png", "attack-graph.png", "evidence-findings.png", "final-report.png"] as const;

function screenshotAvailability(): Record<string, boolean> {
  const dir = join(process.cwd(), "public", "screenshots");
  return Object.fromEntries(SHOT_FILES.map((f) => [f, existsSync(join(dir, f))]));
}

export default function HomePage() {
  return (
    <div>
      {/* hero */}
      <section className="bg-grid relative overflow-hidden">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pt-12">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border bg-background px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Open source · Apache 2.0 · Local-first
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-[40px] lg:text-5xl">
              Autonomous security assessment. <span className="text-gradient">Operator supervised.</span>
            </h1>
            <Typewriter />
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
              Open-source agentic operator for authorized testing — plans, verifies, and reports with
              evidence, target-locked and audited.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
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
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                Authorized testing only —{" "}
                <Link href="/safety" className="underline underline-offset-4 hover:text-foreground">
                  safety model
                </Link>{" "}
                ·{" "}
                <Link href="/docs" className="underline underline-offset-4 hover:text-foreground">
                  docs
                </Link>
              </span>
            </p>
            <div className="mt-5 max-w-md">
              <InstallTabs compact />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl animate-fade-in-up">
            <MissionControl />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Illustrative lab run against 127.0.0.1 — BreachPilot tests only allowlisted targets and
              blocks everything else.
            </p>
          </div>
        </div>
      </section>

      {/* stats */}
      <section aria-label="Project metrics" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <StatsRow />
        <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          Live counts from the repository catalog.
          <GithubStats owner="braydos-h" repo="BreachPilot" />
        </p>
      </section>

      {/* why */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Why BreachPilot"
            title="A full assessment lifecycle, under supervision"
            lede="Recon to report in one supervised engine, with proof."
          />
          <WhyGrid />
        </div>
      </section>

      {/* swarm */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Multi-agent orchestration"
          title="Six specialists, one shared blackboard"
          lede="Parallel dispatch with battle logs and cross-phase negotiation — plus a persistent orchestrator for extended campaigns."
        />
        <SwarmDiagram />
      </section>

      {/* attack graph */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Attack graph"
            title="A structured plan, not a prompt chain"
            lede="Every run builds an AttackPlan DAG — ready/blocked steps and evidence, live in the WebUI graph."
          />
          <HomeAttackGraph />
        </div>
      </section>

      {/* product tour */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Inside BreachPilot"
          title="Mission control for the whole run"
          lede={`Loopback-only console at 127.0.0.1:${SITE.webuiDefaultPort} — wizard, stream, graph, evidence and more in one place.`}
        />
        <ProductTour />
      </section>

      {/* real screenshots — placeholders until public/screenshots/ is populated */}
      <section className="mx-auto max-w-6xl border-t px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Screenshots"
          title="The real WebUI"
          lede="Console captures from a local lab run — not mockups."
        />
        <Screenshots available={screenshotAvailability()} />
      </section>

      {/* safety strip */}
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
                Attack mode auto-approves in-scope actions — the safeties are the target-IP allowlist
                lock and the mission scope gate, with every action in a tamper-evident audit chain.
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
        </div>
      </section>
    </div>
  );
}
