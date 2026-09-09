import type { Metadata } from "next";
import { EyeOff, Globe, HardDrive, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Badge, Card } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/privacy", {
  title: "Privacy",
  description:
    "BreachPilot privacy: no analytics, no tracking, no accounts. Your theme choice stays in your browser; repository statistics load client-side only.",
});

const CONTENTS: Array<{ id: string; label: string }> = [
  { id: "promise", label: "Our promise" },
  { id: "browser", label: "Stays in your browser" },
  { id: "network", label: "Network requests" },
  { id: "never", label: "What we never do" },
  { id: "questions", label: "Questions" },
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
              BreachPilot is an assessment tool for your own labs and engagements — scope-gated,
              allowlist-locked, and audited.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/safety"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Read the safety model
              </Link>
              <Link
                href="/legal"
                className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                License and use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Privacy"
        title="As little data as possible"
        lede="This site is a static document, not a service. There are no accounts, no analytics, and no tracking scripts — what little state exists stays in your browser, and every other request is one you choose to make."
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>
            <EyeOff className="h-3.5 w-3.5" aria-hidden /> No analytics
          </Badge>
          <Badge>
            <HardDrive className="h-3.5 w-3.5" aria-hidden /> Local-only preferences
          </Badge>
          <Badge>
            <Globe className="h-3.5 w-3.5" aria-hidden /> Static files only
          </Badge>
        </div>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <Toc items={CONTENTS} />
          <article className="max-w-3xl text-[15px] leading-7">
            <section id="promise" aria-labelledby="promise-heading" className="scroll-mt-24">
              <h2 id="promise-heading" className="text-xl font-semibold tracking-tight">
                Our promise
              </h2>
              <p className="mt-3 text-muted-foreground">
                {SITE.name} exists to help operators assess systems they are allowed to test.
                The marketing site follows the same minimalism as the tool itself: it reads
                like a document because it is one. There is nothing to sign into, nothing
                to submit, and nothing watching you read.
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-lg border bg-card p-4">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-foreground" aria-hidden />
                <p>
                  If privacy-preserving measurement is ever added here, it will be documented
                  on this page first — what it records, why, and how to opt out. Until then,
                  assume the answer is nothing.
                </p>
              </div>
            </section>

            <section id="browser" aria-labelledby="browser-heading" className="mt-10 scroll-mt-24">
              <h2 id="browser-heading" className="text-xl font-semibold tracking-tight">
                Stays in your browser
              </h2>
              <p className="mt-3 text-muted-foreground">
                The only thing this site remembers is your theme choice, stored under a
                single browser key so the page does not flash the wrong color scheme on
                reload. It never leaves your device, it is never sent to a server, and
                clearing site data removes it completely.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>No cross-site cookies and no advertising identifiers of any kind.</li>
                <li>No forms, so nothing you type is transmitted anywhere.</li>
                <li>No local accounts or stored preferences beyond the theme toggle.</li>
              </ul>
            </section>

            <section id="network" aria-labelledby="network-heading" className="mt-10 scroll-mt-24">
              <h2 id="network-heading" className="text-xl font-semibold tracking-tight">
                Network requests
              </h2>
              <p className="mt-3 text-muted-foreground">
                Pages themselves are pre-rendered static files served from {SITE.url}.
                Two kinds of follow-on requests can happen, both narrowly scoped and both
                optional to the reading experience.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Card>
                  <h3 className="font-semibold tracking-tight">Repository statistics</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The homepage loads public repository statistics client-side. The request
                    sets nothing, sends no identifier, and the page renders identically
                    when it fails.
                  </p>
                </Card>
                <Card>
                  <h3 className="font-semibold tracking-tight">Installer downloads</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Installers are plain static files with no telemetry and no phone-home.
                    Downloading one tells us nothing about where it runs.
                  </p>
                </Card>
              </div>
            </section>

            <section id="never" aria-labelledby="never-heading" className="mt-10 scroll-mt-24">
              <h2 id="never-heading" className="text-xl font-semibold tracking-tight">
                What we never do
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>We never sell, share, or broker browsing data — there is none to share.</li>
                <li>We never fingerprint your browser or join your visit to another session.</li>
                <li>We never load third-party fonts, tag managers, or social widgets.</li>
                <li>
                  We never see your assessment targets, findings, or reports — the tool
                  itself runs locally, and this site could not observe it if it tried.
                </li>
              </ul>
            </section>

            <section id="questions" aria-labelledby="questions-heading" className="mt-10 scroll-mt-24">
              <h2 id="questions-heading" className="text-xl font-semibold tracking-tight">
                Questions
              </h2>
              <p className="mt-3 text-muted-foreground">
                Anything here unclear or out of date?{" "}
                <a
                  href={`${SITE.repo}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Open an issue
                </a>{" "}
                in the repository, or see{" "}
                <Link
                  href="/security"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  how to report a security concern
                </Link>
                . For the rules that govern the tool itself, start with{" "}
                <Link
                  href="/safety"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  the safety model
                </Link>
                .
              </p>
            </section>
          </article>
        </div>
      </div>

      <SafetyStrip />
    </div>
  );
}
