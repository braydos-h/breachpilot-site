import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Found a vulnerability in BreachPilot? Report it privately via GitHub Security Advisories. Authorized testing only — never probe systems you don't own.",
  alternates: { canonical: `${SITE.url}/security` },
};

export default function SecurityPage() {
  return (
    <div>
      <PageHero
        eyebrow="Security"
        title="Found a vulnerability? Tell us privately first."
        lede="BreachPilot ships offensive security tooling, so a flaw in BreachPilot itself carries real risk. Report it through private channels — never as a public issue — and give maintainers time to fix it before disclosing."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={`${SITE.repo}/security/advisories/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Report privately on GitHub
          </a>
          <Link
            href="/safety"
            className="inline-flex rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Read the safety model
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          How to report
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="font-semibold tracking-tight">1. Use private reporting</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The repository publishes no dedicated security contact, so use{" "}
              <a
                href={`${SITE.repo}/security/advisories/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-4"
              >
                GitHub private vulnerability reporting
              </a>
              . Details stay visible only to maintainers until a fix is ready — do not open a public issue.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold tracking-tight">2. Include what matters</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              What you found, which version or commit, lab-only reproduction steps, and the impact boundary
              (operator box, target scope, or audit integrity).
            </p>
          </Card>
        </div>
        <div className="mt-4 rounded-xl border bg-card p-6">
          <h3 className="font-semibold tracking-tight">Stay in scope while reporting</h3>
          <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
            Reproduce in a lab you control only. Do not probe systems you don&rsquo;t own — the same
            authorization rule as the tool itself: only test systems you own or have explicit written
            permission to assess.
          </p>
        </div>
      </section>
    </div>
  );
}
