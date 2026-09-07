import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Card, CodeSnippet } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contributing",
  description:
    "Contribute to BreachPilot: Apache 2.0 open source, mocked test suite, CI with lint/types/CodeQL, contribution guide and AGENTS.md.",
  alternates: { canonical: "https://breachpilot.dev/contributing" },
};

export default function ContributingPage() {
  return (
    <div>
      <PageHero
        eyebrow="Open source"
        title="Contribute on GitHub"
        lede="Apache 2.0, public repository, mocked test suite, CI on every push and PR. Read the guide and AGENTS.md, keep changes focused, and verify flags and config still match reality before you open a PR."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Contribute on GitHub
          </a>
          <a
            href={`${SITE.repo}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Contribution guide
          </a>
        </div>
      </PageHero>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Tests", "~250 mocked test files — no live Nmap, everything mocks subprocess and network. New safety-relevant code needs regression tests."],
            ["CI", "Mocked suite on Python 3.11–3.13, coverage, ruff check + format, mypy over tools/, package build, WebUI build + tests, mocked eval suite."],
            ["Quality gates", "CodeQL (Python + JS/TS), dependency review, weekly Dependabot for pip, Actions and npm."],
            ["Python", "3.11+ required; ruff line-length 120; strict mypy on security-sensitive hot files."],
            ["TypeScript / WebUI", "tsc + vite build + vitest in webui/ — run all three if you touch the UI."],
            ["Docs discipline", "Adding a flag, tool or config key means updating the user-facing docs in the same PR."],
          ].map(([t, b]) => (
            <Card key={t}>
              <h2 className="font-semibold tracking-tight">{t}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <CodeSnippet
            code={`python -m pytest tests/ -v\nruff check .\nruff format --check .\nmypy --follow-imports=skip tools`}
            title="checks to run before a PR"
          />
        </div>
      </section>
    </div>
  );
}
