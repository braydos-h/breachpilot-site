import type { Metadata } from "next";
import {
  BookOpen,
  FileCheck2,
  FlaskConical,
  GitBranch,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, SectionHeading, StatusDot } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/benchmarks", {
  title: "Benchmarks",
  description:
    "BreachPilot's oracle-verified benchmark system: claimed vs verified success, false positives, trial history, run comparison and regression gates. No invented scores.",
});

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Oracle decides, not the agent",
    body: "The agent's claim never counts as a solve. An independent probe checks the target side (HTTP, file, or shell), and only a pass marks VERIFIED.",
  },
  {
    icon: Scale,
    title: "Misses are published, not buried",
    body: "False positives, timeouts, and infra errors are first-class verdicts. A benchmark that hides its misses does not measure anything.",
  },
  {
    icon: FileCheck2,
    title: "Reproducible or marked unknown",
    body: "Every run records git SHA, model, config hash, and sandbox plus target digests. Without that metadata, a number is a story, not a result.",
  },
];

const FLOW = [
  {
    step: "Provision",
    body: "Reset the deliberately-vulnerable target image to a known digest. A provision failure is recorded as INFRASTRUCTURE_ERROR, never as an exploitation failure.",
  },
  {
    step: "Mission",
    body: "Run one BreachPilot mission inside the sandbox via the agent runner, with no host fallback or hand assistance and scope locked to the lab target.",
  },
  {
    step: "Verify",
    body: "Probe the target independently with declarative check executors: HTTP response, loot file, or shell state. The oracle runs outside the agent's context.",
  },
  {
    step: "Classify",
    body: "Map the oracle result to exactly one verdict: VERIFIED, FAILED, FALSE_POSITIVE, TIMEOUT, or INFRASTRUCTURE_ERROR.",
  },
  {
    step: "Persist",
    body: "Write run.json with git SHA, model id, config hashes, and sandbox plus target digests, so any run can be re-executed and re-checked.",
  },
];

const VERDICTS: Array<{ verdict: string; tone: "ok" | "warn" | "bad" | "idle"; meaning: string }> = [
  { verdict: "VERIFIED", tone: "ok", meaning: "Oracle probe passed. The claimed outcome actually holds on the target." },
  { verdict: "FAILED", tone: "bad", meaning: "Agent finished without a claim, or the oracle probe did not pass." },
  { verdict: "FALSE_POSITIVE", tone: "warn", meaning: "Agent claimed success but the oracle could not confirm it. Tracked separately, never merged into wins." },
  { verdict: "TIMEOUT", tone: "idle", meaning: "Mission exceeded its time or action budget before the oracle could pass." },
  { verdict: "INFRASTRUCTURE_ERROR", tone: "idle", meaning: "Target, sandbox, or harness failed. Excluded from success math, counted in reliability." },
];

const METRICS: Array<{ name: string; what: string; read: string }> = [
  {
    name: "verified_success_rate",
    what: "Oracle-confirmed solves over trials. The only success that counts.",
    read: "Compare across runs with identical target digests. A higher rate with a higher false-positive rate is not an improvement.",
  },
  {
    name: "false_positive_rate",
    what: "Claimed-but-unconfirmed outcomes over trials.",
    read: "A honesty metric for the agent's self-reporting. Falling claims with steady verified solves means better calibration.",
  },
  {
    name: "actions_per_verified_success",
    what: "Tool-action efficiency per confirmed solve.",
    read: "Cost of a win. Watch alongside success rate. Fewer actions at the same verified rate is a real efficiency gain.",
  },
  {
    name: "time_to_first_verified_success",
    what: "Median and mean solve time with tool-action counts.",
    read: "Report both median and mean; one long-tail run should not hide behind an average.",
  },
  {
    name: "risk_ratio ± CI",
    what: "Treatment vs baseline with 1000-sample cluster-bootstrap 95% CI.",
    read: "The regression gate. If the CI crosses 1.0, the change did not move the needle, no matter what the point estimate says.",
  },
  {
    name: "tokens + cost",
    what: "Token totals and estimated cost per trial and suite.",
    read: "Pairs with verified rate to answer the only budget question: what does a confirmed solve cost?",
  },
];

// Illustrative bar widths showing the chart pattern only — not measured results.
const CLAIMED_VS_VERIFIED = [
  { label: "Suite A · login flow", claimed: 92, verified: 71, tone: "ok" as const },
  { label: "Suite B · relay path", claimed: 64, verified: 28, tone: "warn" as const },
  { label: "Suite C · privesc path", claimed: 41, verified: 33, tone: "idle" as const },
];

function Bar({ value, className, label }: { value: number; className: string; label: string }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
      role="img"
      aria-label={`${label}: ${value} percent (illustrative)`}
    >
      <div className={`h-full rounded-full ${className}`} style={{ width: `${value}%` }} aria-hidden />
    </div>
  );
}

export default function BenchmarksPage() {
  return (
    <div>
      <PageHero
        eyebrow="Evaluation"
        title="Verified, or it didn't happen"
        lede="BreachPilot benchmarks run against deliberately-vulnerable lab images, and an independent oracle confirms every claimed win. We publish no leaderboards and no invented scores, only a method you can re-run and argue with."
      >
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Badge>
            <FlaskConical className="h-3.5 w-3.5" aria-hidden /> Oracle-verified
          </Badge>
          <Badge>
            <Scale className="h-3.5 w-3.5" aria-hidden /> False positives tracked
          </Badge>
          <Badge>
            <GitBranch className="h-3.5 w-3.5" aria-hidden /> Reproducible runs
          </Badge>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/docs/benchmarks"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <BookOpen className="h-4 w-4" aria-hidden /> Read the benchmark docs
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Safety model
          </Link>
        </div>
        <p className="mt-4 flex items-start gap-1.5 text-sm text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            Authorized lab targets only. Benchmark images are deliberately vulnerable. Never point
            them, or BreachPilot, at systems you do not own or have explicit written permission to test.
          </span>
        </p>
      </PageHero>

      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <section aria-labelledby="principles-heading">
          <SectionHeading
            align="left"
            eyebrow="Ground rules"
            title="What stays unpublished"
            lede="A single success percentage with no method behind it tells you nothing. These three rules make a BreachPilot number worth reading."
          />
          <h2 id="principles-heading" className="sr-only">
            Benchmark principles
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <Card key={p.title}>
                <p.icon className="h-5 w-5 text-foreground" aria-hidden />
                <h3 className="mt-3 font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{p.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="verdicts-heading" className="mt-16">
          <SectionHeading
            align="left"
            eyebrow="Verdict taxonomy"
            title="Five outcomes, no partial credit"
            lede="Every trial ends in exactly one verdict. The gap between what the agent claimed and what the oracle confirmed is the most honest number in the suite."
          />
          <h2 id="verdicts-heading" className="sr-only">
            Verdict taxonomy
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div
              className="overflow-x-auto rounded-lg border"
              role="region"
              aria-label="Trial verdict definitions"
              tabIndex={0}
            >
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr>
                    <th scope="col">Verdict</th>
                    <th scope="col">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {VERDICTS.map((v) => (
                    <tr key={v.verdict}>
                      <td>
                        <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs font-semibold">
                          <StatusDot tone={v.tone} />
                          {v.verdict}
                        </span>
                      </td>
                      <td className="text-muted-foreground">{v.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Card>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Claimed vs verified · chart pattern, not results
              </h3>
              <div className="mt-4 space-y-5">
                {CLAIMED_VS_VERIFIED.map((row) => (
                  <div key={row.label}>
                    <p className="font-mono text-xs text-muted-foreground">{row.label}</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="w-16 shrink-0 text-xs text-muted-foreground">Claimed</span>
                        <Bar value={row.claimed} className="bg-muted-foreground/50" label={`Claimed ${row.label}`} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-16 shrink-0 text-xs text-muted-foreground">Verified</span>
                        <Bar value={row.verified} className="bg-foreground" label={`Verified ${row.label}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t pt-4 text-[13px] leading-6 text-muted-foreground">
                Bar widths are illustrative placeholders showing how to read the chart: muted is what
                the agent claimed, solid is what the oracle confirmed. No BreachPilot scores are
                published on this page. Run the suites yourself and compare runs with full metadata
                attached.
              </p>
            </Card>
          </div>
        </section>

        <section aria-labelledby="flow-heading" className="mt-16">
          <SectionHeading
            align="left"
            eyebrow="Method"
            title="How a trial runs"
            lede="Same five steps every time, inside the sandbox. Skip a step and the run is marked unknown, not passed."
          />
          <h2 id="flow-heading" className="sr-only">
            How a trial runs
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {FLOW.map((f, i) => (
              <li key={f.step} className="relative rounded-lg border bg-card p-5">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border bg-background font-mono text-xs font-semibold"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 font-semibold tracking-tight">{f.step}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{f.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="metrics-heading" className="mt-16">
          <SectionHeading
            align="left"
            eyebrow="Metrics"
            title="What gets measured, and how to read it"
            lede="Six metrics, each with a stated interpretation. If a change improves one while quietly worsening another, the suite should catch it."
          />
          <h2 id="metrics-heading" className="sr-only">
            Benchmark metrics
          </h2>
          <div
            className="mt-8 overflow-x-auto rounded-lg border"
            role="region"
            aria-label="Benchmark metric definitions"
            tabIndex={0}
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">What it is</th>
                  <th scope="col">How to read it</th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m) => (
                  <tr key={m.name}>
                    <td className="whitespace-nowrap font-mono text-[13px] font-semibold">{m.name}</td>
                    <td className="text-muted-foreground">{m.what}</td>
                    <td className="text-muted-foreground">{m.read}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="repro-heading" className="mt-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 id="repro-heading" className="text-xl font-semibold tracking-tight">
                Reproducibility checklist
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A run without this metadata cannot be defended. The harness records all five; if any
                are missing, the run is labeled unknown.
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  "Git SHA of the BreachPilot build under test",
                  "Model id and provider path for the run",
                  "Config hash covering suite and gate settings",
                  "Sandbox image digest the mission ran in",
                  "Target image digest that was reset per trial",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden />
                    <span className="leading-6 text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold tracking-tight">Statistics without hype</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Run comparison uses risk ratio of verified success against a pinned baseline, with a
                1000-sample cluster-bootstrap 95% confidence interval. The regression gate fails a
                change whose interval crosses 1.0. The point estimate alone never passes.
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  "Pin the baseline: same target digests, same budgets, same model class.",
                  "Report median and mean solve times. Long tails matter.",
                  "Count infra errors separately from exploitation failures.",
                  "Full method lives in the engineering docs, not in a footnote.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Scale className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden />
                    <span className="leading-6 text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                <Link href="/docs/benchmarks" className="font-medium underline underline-offset-4">
                  Benchmark engineering docs →
                </Link>
              </p>
            </Card>
          </div>
        </section>

        <section aria-labelledby="run-heading" className="mt-16">
          <div className="rounded-xl border bg-muted/30 p-6 sm:p-8">
            <h2 id="run-heading" className="text-xl font-semibold tracking-tight">
              Run the suites yourself
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              No scores are published here because your hardware, model, and target digests will
              differ from ours, and those differences are the whole story. Open the WebUI
              Benchmarks view or follow the suite-runner guide in the docs, then compare runs with
              baselines and regression gates attached. Authorized lab environments only.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/docs/benchmarks"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Suite-runner guide
              </Link>
              <a
                href={`${SITE.repo}/blob/main/docs/benchmarks.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Method source on GitHub
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Authorized testing notice" className="mt-12">
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
                Benchmark targets are deliberately vulnerable images. Run them isolated in your lab,
                keep the scope gate locked, and treat every finding as lab-only evidence.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/safety"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Read the safety model
                </Link>
                <Link
                  href="/docs/benchmarks"
                  className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Benchmark docs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
