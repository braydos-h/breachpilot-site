import type { Metadata } from "next";
import { FileText, Scale, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Badge, Card } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/legal", {
  title: "Legal",
  description:
    "BreachPilot legal: Apache-2.0 license, authorized-use notice, and repository license links.",
});

const CONTENTS: Array<{ id: string; label: string }> = [
  { id: "license", label: "License" },
  { id: "authorized-use", label: "Authorized use" },
  { id: "scope", label: "What this page is" },
  { id: "related", label: "Related pages" },
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
              Attack tooling demands a paper trail. Keep your written authorization with
              every run, and keep every run inside it.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/safety"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Read the safety model
              </Link>
              <Link
                href="/security"
                className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Report a vulnerability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LegalPage() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="License and authorized use"
        lede="BreachPilot is open-source software for authorized security testing only. The license gives you the code. The authorization rule governs every use of it."
      >
        <blockquote className="mt-6 max-w-2xl border-l-2 border-foreground pl-4 text-lg font-medium leading-8 tracking-tight">
          Only test systems you own or have explicit written permission to assess.
        </blockquote>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>
            <Scale className="h-3.5 w-3.5" aria-hidden /> {SITE.license}
          </Badge>
          <Badge>
            <FileText className="h-3.5 w-3.5" aria-hidden /> Open source
          </Badge>
          <Badge>
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden /> Authorized testing only
          </Badge>
        </div>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <Toc items={CONTENTS} />
          <article className="max-w-3xl text-[15px] leading-7">
            <section id="license" aria-labelledby="license-heading" className="scroll-mt-24">
              <h2 id="license-heading" className="text-xl font-semibold tracking-tight">
                License
              </h2>
              <p className="mt-3 text-muted-foreground">
                {SITE.name} is open source under {SITE.license}. The full terms live in
                the repository. This page summarizes the posture, it does not replace
                the license text.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`${SITE.repo}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Read the full license
                </a>
                <a
                  href={SITE.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Browse the repository
                </a>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Contributing a change means contributing it under the same {SITE.license}{" "}
                terms. See{" "}
                <Link
                  href="/contributing"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  contributing
                </Link>{" "}
                for the workflow that goes with that grant.
              </p>
            </section>

            <section
              id="authorized-use"
              aria-labelledby="authorized-use-heading"
              className="mt-10 scroll-mt-24"
            >
              <h2 id="authorized-use-heading" className="text-xl font-semibold tracking-tight">
                Authorized use
              </h2>
              <p className="mt-3 text-muted-foreground">
                The license permits running, studying, modifying, and distributing the
                software. It does not permit testing systems without permission. Every
                install, every run, and every report carries the same rule: only test
                systems you own or have explicit written permission to assess.
              </p>
              <div className="mt-5 rounded-lg border bg-card p-4">
                <p className="text-sm leading-6">
                  <strong>Keep the paper trail.</strong> Written authorization, a defined
                  scope, and the tamper-evident audit chain are what separate an
                  assessment from an incident. If a target is not in writing, it is not
                  in scope.
                </p>
              </div>
            </section>

            <section id="scope" aria-labelledby="scope-heading" className="mt-10 scroll-mt-24">
              <h2 id="scope-heading" className="text-xl font-semibold tracking-tight">
                What this page is
              </h2>
              <p className="mt-3 text-muted-foreground">
                This site is the public home of an open-source security tool, not a
                commercial SaaS terms-of-service agreement. There are no accounts, no
                subscriptions, and no hosted assessment service. The binding documents
                are the {SITE.license} license text and whatever written testing
                agreement you hold with the owner of the systems you assess.
              </p>
            </section>

            <section id="related" aria-labelledby="related-heading" className="mt-10 scroll-mt-24">
              <h2 id="related-heading" className="text-xl font-semibold tracking-tight">
                Related pages
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Card>
                  <h3 className="font-semibold tracking-tight">Safety</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Scope gates, permission modes, and audit.
                  </p>
                  <p className="mt-3 text-sm">
                    <Link href="/safety" className="font-medium underline underline-offset-4">
                      Read<span aria-hidden> →</span>
                    </Link>
                  </p>
                </Card>
                <Card>
                  <h3 className="font-semibold tracking-tight">Privacy</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    No analytics, no tracking on this site.
                  </p>
                  <p className="mt-3 text-sm">
                    <Link href="/privacy" className="font-medium underline underline-offset-4">
                      Read<span aria-hidden> →</span>
                    </Link>
                  </p>
                </Card>
                <Card>
                  <h3 className="font-semibold tracking-tight">Security</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    How to report a vulnerability.
                  </p>
                  <p className="mt-3 text-sm">
                    <Link href="/security" className="font-medium underline underline-offset-4">
                      Read<span aria-hidden> →</span>
                    </Link>
                  </p>
                </Card>
              </div>
            </section>
          </article>
        </div>
      </div>

      <SafetyStrip />
    </div>
  );
}
