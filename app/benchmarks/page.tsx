import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, StatusDot } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "BreachPilot's oracle-verified benchmark system: claimed vs verified success, false positives, trial history, run comparison and regression gates. No invented scores.",
  alternates: { canonical: `${SITE.url}/benchmarks` },
};

const METRICS = [
  ["verified_success_rate", "Oracle-confirmed solves over trials — the only success that counts."],
  ["false_positive_rate", "Claimed-but-unconfirmed outcomes. Tracked, not hidden."],
  ["actions_per_verified_success", "Tool-action efficiency per confirmed solve."],
  ["time_to_first_verified_success", "Median / mean solve time with tool-action counts."],
  ["risk_ratio ± CI", "Treatment vs baseline with 1000-sample cluster-bootstrap 95% CI."],
  ["tokens + cost", "Token totals and estimated cost per trial and suite."],
];

const FLOW = [
  ["Provision", "Reset the deliberately-vulnerable target image. Provision failures are INFRASTRUCTURE_ERROR — never fake exploitation failures."],
  ["Mission", "Run one BreachPilot mission in the sandbox (no host fallback) via the agent runner."],
  ["Verify", "Independently probe the target with declarative check executors — HTTP, file/loot, shell. The oracle decides."],
  ["Classify", "VERIFIED / FAILED / FALSE_POSITIVE / TIMEOUT / INFRASTRUCTURE_ERROR."],
  ["Persist", "run.json records git SHA, model, config hashes, sandbox and target digests — reproducible or marked unknown."],
];

export default function BenchmarksPage() {
  return (
    <div>
      <PageHero
        eyebrow="Evaluation"
        title="Verified, or it didn't happen"
        lede="Benchmark targets run under the sandboxed execution architecture, outcomes are verified by an independent oracle, and every run records enough metadata to reproduce and defend the numbers."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/docs/benchmarks"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Read the benchmark docs
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Safety model
          </Link>
        </div>
      </PageHero>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-label="Benchmark trial illustration and method">
        <div className="rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">suite · illustrative shape, no scores</h2>
          <ul className="mt-4 space-y-2 font-mono text-[12px]" aria-label="Example trial outcomes">
            {[
              ["trial-01 · dvwa-login", "ok", "VERIFIED"],
              ["trial-02 · smb-relay", "warn", "FALSE_POSITIVE"],
              ["trial-03 · jwt-confusion", "ok", "VERIFIED"],
              ["trial-04 · privesc-path", "idle", "FAILED"],
            ].map(([label, tone, verdict]) => (
              <li key={label as string} className="flex items-center gap-2.5 rounded border bg-background px-3 py-2">
                <StatusDot tone={tone as "ok" | "warn" | "idle"} />
                <span className="min-w-0 break-all">{label}</span>
                <span className="ml-auto shrink-0 whitespace-nowrap rounded-full border px-2 py-px text-[10px]">{verdict}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Agent-claimed success (structured tool-outcome counters, never LLM prose) vs oracle-verified success
            (independent target-side probes). Solved only when the oracle confirms.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">How a trial runs</h2>
            <ol className="mt-4 space-y-3">
              {FLOW.map(([t, b], i) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-xs font-semibold" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{t}</h3>
                    <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">What gets measured</h2>
            <div className="mt-4 space-y-3">
              {METRICS.map(([t, b]) => (
                <Card key={t} className="p-4">
                  <h3 className="font-mono text-sm font-semibold">{t}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{b}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 rounded-lg border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          No benchmark scores are published here. Run the suites yourself — WebUI → Benchmarks, or the CLI suite
          runner with baselines and regression gates — and compare runs with full model, git and sandbox metadata
          attached. Authorized lab environments only: benchmark targets are deliberately vulnerable images.
        </p>
        <p className="mt-4 text-sm">
          <Link href="/docs/benchmarks" className="font-medium underline underline-offset-4">Benchmark engineering docs →</Link>
        </p>
      </section>
    </div>
  );
}
