import type { Metadata } from "next";
import { FlaskConical, GitPullRequest, Scale, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, CodeSnippet } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/contributing", {
  title: "Contributing",
  description:
    "Contribute to BreachPilot: Apache 2.0 open source, mocked test suite, CI with lint/types/CodeQL, contribution guide and AGENTS.md.",
});

const CONTENTS: Array<{ id: string; label: string }> = [
  { id: "start", label: "Before you start" },
  { id: "expectations", label: "What to expect" },
  { id: "workflow", label: "How a change flows" },
  { id: "checks", label: "Checks before a PR" },
  { id: "safety", label: "Safety is non-negotiable" },
];

const EXPECTATIONS: Array<[string, string]> = [
  [
    "Tests",
    "The suite is fully mocked. No live scanning; every subprocess and network call is faked. Safety-relevant code needs regression tests that prove the gate still holds.",
  ],
  [
    "CI",
    "Every push and pull request runs the mocked suite plus coverage, lint and format checks, type checking, package builds, and the WebUI build and tests.",
  ],
  [
    "Quality gates",
    "Static analysis and dependency review run on every change, with scheduled updates for packages, actions, and JavaScript dependencies.",
  ],
  [
    "Python",
    "Follow the repository lint and format configuration and keep strict typing on security-sensitive paths. Match the style the file already uses.",
  ],
  [
    "TypeScript / WebUI",
    "Type-check, build, and test the WebUI whenever you touch it. Run all three before asking for review, not after.",
  ],
  [
    "Docs discipline",
    "Adding a flag, tool, or config key means updating the user-facing docs in the same pull request. Undocumented behavior does not ship.",
  ],
];

const WORKFLOW: Array<[string, string]> = [
  ["Read the guide first", "The contribution guide and AGENTS.md describe branching, review, and what a focused change looks like. Start there, not in the code."],
  ["Keep the change focused", "One concern per pull request. A small diff that does one thing gets reviewed in days; a broad one waits for weeks."],
  ["Prove the safety story", "Touching scope, policy, or tool execution means adding or updating the tests that guard it, and saying so in the PR description."],
  ["Update docs alongside", "Flags, tools, and config keys land with their documentation. Link the pages you changed so reviewers can read them."],
];

function Toc({ items }: { items: Array<{ id: string; label: string }> }) {
  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        On this page
      </p>
      <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {items.map((item) => (
          <li key={item.id} className="shrink-0 lg:shrink">
            <a
              href={`#${item.id}`}
              className="inline-flex rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 lg:border-0 lg:bg-transparent lg:px-0 lg:py-1 lg:underline-offset-4 lg:hover:bg-transparent lg:hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SafetyStrip() {
  return (
    <section aria-label="Authorized testing notice" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
              Contributions must preserve scope gating, the target allowlist lock, and the
              audit trail. Those safeties are the feature.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/safety"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Read the safety model
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Browse the docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContributingPage() {
  return (
    <div>
      <PageHero
        eyebrow="Open source"
        title="Contribute to BreachPilot"
        lede={`${SITE.name} is ${SITE.license} licensed and developed in the open. The bar is a focused diff, proven tests, and docs that still match reality. Read the guide and AGENTS.md, then build the smallest change that helps.`}
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <GitPullRequest className="h-4 w-4" aria-hidden /> Contribute on GitHub
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
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>
            <Scale className="h-3.5 w-3.5" aria-hidden /> {SITE.license}
          </Badge>
          <Badge>
            <FlaskConical className="h-3.5 w-3.5" aria-hidden /> Fully mocked tests
          </Badge>
          <Badge>
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden /> Authorized testing only
          </Badge>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          {SITE.name} is for authorized testing only. Contributions must preserve scope
          gating, the target allowlist lock, and the audit trail.
        </p>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <Toc items={CONTENTS} />
          <article className="max-w-3xl text-[15px] leading-7">
            <section id="start" aria-labelledby="start-heading" className="scroll-mt-24">
              <h2 id="start-heading" className="text-xl font-semibold tracking-tight">
                Before you start
              </h2>
              <p className="mt-3 text-muted-foreground">
                The repository is the source of truth for process: the contribution
                guide covers branching and review etiquette, and AGENTS.md covers how
                the codebase expects to be changed. Read both before writing code.
                They answer most review comments in advance.
              </p>
              <p className="mt-3 text-muted-foreground">
                New here? Skim the{" "}
                <Link
                  href="/docs"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  docs
                </Link>{" "}
                and the{" "}
                <Link
                  href="/safety"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  safety model
                </Link>{" "}
                first. Changes to scope, policy, or tool execution only make sense once
                you understand what the gates are protecting.
              </p>
            </section>

            <section
              id="expectations"
              aria-labelledby="expectations-heading"
              className="mt-10 scroll-mt-24"
            >
              <h2 id="expectations-heading" className="text-xl font-semibold tracking-tight">
                What to expect
              </h2>
              <p className="mt-3 text-muted-foreground">
                Mocked tests, strict gates, and docs in the same pull request. The list
                below is the standing contract. If your change weakens any of it, the
                review will ask you to strengthen it instead.
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {EXPECTATIONS.map(([title, body]) => (
                  <li key={title}>
                    <Card className="h-full">
                      <h3 className="font-semibold tracking-tight">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>

            <section id="workflow" aria-labelledby="workflow-heading" className="mt-10 scroll-mt-24">
              <h2 id="workflow-heading" className="text-xl font-semibold tracking-tight">
                How a change flows
              </h2>
              <ol className="mt-4 space-y-3">
                {WORKFLOW.map(([title, body], i) => (
                  <li key={title} className="relative flex gap-4">
                    <span
                      className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-xs font-semibold"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 rounded-lg border bg-card px-4 py-3">
                      <h3 className="font-semibold tracking-tight">{title}</h3>
                      <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="checks" aria-labelledby="checks-heading" className="mt-10 scroll-mt-24">
              <h2 id="checks-heading" className="text-xl font-semibold tracking-tight">
                Checks before a PR
              </h2>
              <p className="mt-3 text-muted-foreground">
                Run the same gates CI will run, locally, before you push. A green local
                run is the entry ticket for review.
              </p>
              <div className="mt-4">
                <CodeSnippet
                  code={`python -m pytest tests/ -v\nruff check .\nruff format --check .\nmypy --follow-imports=skip tools`}
                  title="checks to run before a PR"
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                If you touched the WebUI, also type-check, build, and test it. If you
                added a flag, tool, or config key, verify every reference in the docs
                still matches reality.
              </p>
            </section>

            <section id="safety" aria-labelledby="safety-heading" className="mt-10 scroll-mt-24">
              <h2 id="safety-heading" className="text-xl font-semibold tracking-tight">
                Safety is non-negotiable
              </h2>
              <p className="mt-3 text-muted-foreground">
                {SITE.name} ships attack tooling, so its safeties are load-bearing:
                scope gating decides what may be touched, the target allowlist lock
                blocks everything else, and the audit trail records every decision.
                Contributions that relax any of the three will not merge. Changes
                that strengthen them get the fastest reviews.
              </p>
              <div className="mt-5 rounded-lg border bg-card p-4">
                <p className="text-sm leading-6">
                  <strong>Only test systems you own or have explicit written permission
                  to assess</strong>, including when you are testing your own change.
                  Develop against a lab you control, and keep the authorization in
                  writing.
                </p>
              </div>
            </section>
          </article>
        </div>
      </div>

      <SafetyStrip />
    </div>
  );
}
