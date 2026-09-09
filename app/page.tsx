import type { Metadata } from "next";
import { ArrowRight, Github, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { GithubStats } from "@/components/github-stats";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { HomeAttackGraph, PipelineSteps, Screenshots, StatsRow, SwarmDiagram, WhyGrid } from "@/components/home-sections";
import { ProductTour } from "@/components/product-tour";
import { InstallTabs } from "@/components/install-tabs";
import { MissionControl } from "@/components/mission-control";
import { Typewriter } from "@/components/typewriter";
import { SectionHeading } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/", {
  description: SITE.description,
});

const SHOT_FILES = ["run-creation.png", "attack-graph.png", "evidence-findings.png", "final-report.png"] as const;

function screenshotAvailability(): Record<string, boolean> {
  const dir = join(process.cwd(), "public", "screenshots");
  return Object.fromEntries(SHOT_FILES.map((f) => [f, existsSync(join(dir, f))]));
}

// h1 derives from SITE.tagline so hero copy can't drift from the source of truth.
const tagParts = SITE.tagline.split(". ");
const tagHead = tagParts[0] ?? SITE.tagline;
const tagTail = tagParts.slice(1).join(". ");

export default function HomePage() {
  const shots = screenshotAvailability();
  const hasShots = Object.values(shots).some(Boolean);
  return (
    <div>
      {/* hero */}
      <section aria-label="Introduction" className="bg-grid relative overflow-hidden border-b">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" aria-hidden />
        <div className="animate-scan-hero pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-foreground/[0.06] to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border bg-background px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Open source · {SITE.license} · Local-first
            </p>
            <h1 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {tagHead}. {tagTail ? <span className="text-gradient">{tagTail}</span> : null}
            </h1>
            <Typewriter />
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
              BreachPilot is an open-source operator for authorized security testing. It stays
              target-locked, logs everything it does, and backs each finding with evidence.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/install"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 sm:w-auto"
              >
                Install BreachPilot <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted sm:w-auto"
              >
                <Github className="h-4 w-4" aria-hidden /> View on GitHub
              </a>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                Authorized testing only.{" "}
                <Link href="/safety" className="underline underline-offset-4 hover:text-foreground">
                  safety model
                </Link>{" "}
                ·{" "}
                <Link href="/docs" className="underline underline-offset-4 hover:text-foreground">
                  docs
                </Link>
              </span>
            </p>
            <div className="mx-auto mt-6 max-w-md text-left">
              <InstallTabs compact />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl animate-fade-in-up">
            <MissionControl />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Illustrative lab run against 127.0.0.1. BreachPilot tests only allowlisted targets and
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

      {/* pipeline */}
      <section aria-label="Assessment pipeline" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow="How it works"
            title="One supervised pipeline from recon to report"
            lede="Every run goes through the same five phases. The plan comes first, each finding needs evidence, and the report includes proof."
          />
          <PipelineSteps />
        </div>
      </section>

      {/* why */}
      <section aria-label="Why BreachPilot" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Why BreachPilot"
          title="A full assessment lifecycle, under supervision"
          lede="One supervised engine covers recon to report, and each finding ships with proof."
        />
        <WhyGrid />
      </section>

      {/* swarm */}
      <section aria-label="Multi-agent orchestration" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow="Multi-agent orchestration"
            title="Six specialists, one shared blackboard"
            lede="Specialists dispatch in parallel and log to a shared battle log. A persistent orchestrator carries longer campaigns."
          />
          <SwarmDiagram />
        </div>
      </section>

      {/* attack graph */}
      <section aria-label="Attack graph" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Attack graph"
          title="Each run follows a structured plan"
          lede="Every run builds an AttackPlan DAG. Ready and blocked steps plus evidence show live in the WebUI graph."
        />
        <HomeAttackGraph />
      </section>

      {/* product tour */}
      <section aria-label="Product tour" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow="Inside BreachPilot"
            title="Mission control for the whole run"
            lede={`Loopback-only console at 127.0.0.1:${SITE.webuiDefaultPort} with the wizard, stream, graph, and evidence in one place.`}
          />
          <ProductTour />
        </div>
      </section>

      {/* real screenshots — coming-soon block until public/screenshots/ is populated */}
      <section aria-label="Screenshots" className="mx-auto max-w-6xl border-t px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Screenshots"
          title={hasShots ? "The real WebUI" : "The real WebUI: captures coming soon"}
          lede={
            hasShots
              ? "Console captures from a local lab run."
              : "Real console captures from a local lab run are on the way."
          }
        />
        <Screenshots available={shots} />
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
