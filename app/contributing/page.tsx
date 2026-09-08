import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, CodeSnippet, SectionHeading } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/contributing", {
  title: "Contributing",
  description:
    "Contribute to BreachPilot: Apache 2.0 open source, mocked test suite, CI with lint/types/CodeQL, contribution guide and AGENTS.md.",
});

export default function ContributingPage() {
  return (
    <div>
      <PageHero
        eyebrow="Open source"
        title="Contribute to BreachPilot"
        lede={`${SITE.license} licensed, public repository, fully mocked test suite, CI on every push and PR. Read the guide and AGENTS.md, keep changes focused, and verify flags and config still match reality before you open a PR.`}
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Contribute on GitHub
          </a>
          <a
            href={`${SITE.repo}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Contribution guide
          </a>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          BreachPilot is for authorized testing only — contributions must preserve scope gating, the target
          allowlist lock, and the audit trail.
        </p>
      </PageHero>
      <section aria-label="Contribution expectations" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="What to expect"
          title="Mocked tests, strict gates, docs in the same PR"
          lede="Safety-relevant changes need regression tests. Keep PRs focused and verify every flag and config key still matches reality."
          align="left"
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Tests", "~250 mocked test files — no live Nmap, everything mocks subprocess and network. New safety-relevant code needs regression tests."],
            ["CI", "Mocked suite on Python 3.11–3.13, coverage, ruff check + format, mypy over tools/, package build, WebUI build + tests, mocked eval suite."],
            ["Quality gates", "CodeQL (Python + JS/TS), dependency review, weekly Dependabot for pip, Actions and npm."],
            ["Python", "3.11+ required; ruff line-length 120; strict mypy on security-sensitive hot files."],
            ["TypeScript / WebUI", "tsc + vite build + vitest in webui/ — run all three if you touch the UI."],
            ["Docs discipline", "Adding a flag, tool or config key means updating the user-facing docs in the same PR."],
          ].map(([t, b]) => (
            <li key={t}>
              <Card className="h-full">
                <h3 className="font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Checks to run before a PR
          </h2>
          <div className="mt-4 max-w-3xl">
            <CodeSnippet
              code={`python -m pytest tests/ -v\nruff check .\nruff format --check .\nmypy --follow-imports=skip tools`}
              title="checks to run before a PR"
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Read the <Link href="/docs" className="font-medium text-foreground underline underline-offset-4">docs</Link>{" "}
            and the <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">safety model</Link>{" "}
            before touching scope, policy, or tool-execution code.
          </p>
        </div>
      </section>
    </div>
  );
}
