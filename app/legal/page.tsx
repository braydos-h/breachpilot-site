import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/legal", {
  title: "Legal",
  description:
    "BreachPilot legal: Apache-2.0 license, authorized-use notice, and repository license links.",
});

export default function LegalPage() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="License and authorized use"
        lede="BreachPilot is open-source software for authorized security testing only. The license gives you the code — the authorization rule governs every use of it."
      >
        <blockquote className="mt-6 max-w-2xl border-l-2 border-foreground pl-4 text-lg font-medium leading-8 tracking-tight">
          Only test systems you own or have explicit written permission to assess.
        </blockquote>
      </PageHero>
      <section className="mx-auto max-w-3xl px-4 py-12 text-[15px] leading-7 sm:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Apache 2.0</h2>
        <p className="mt-2 text-muted-foreground">
          BreachPilot is open source under {SITE.license}. See{" "}
          <a
            href={`${SITE.repo}/blob/main/LICENSE`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            LICENSE in the repository
          </a>{" "}
          for the full terms.
        </p>
        <h2 className="mt-8 text-lg font-semibold tracking-tight">Authorized use</h2>
        <p className="mt-2 text-muted-foreground">
          Only test systems you own or have explicit written permission to assess. This site is not a
          commercial SaaS terms agreement — it is the public home of an open-source security tool, and
          the authorization rule travels with every install, run, and report.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Card>
            <h3 className="font-semibold tracking-tight">Safety</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Scope gates, permission modes, and audit.
            </p>
            <p className="mt-3 text-sm">
              <Link href="/safety" className="font-medium underline underline-offset-4">
                Read →
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
                Read →
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
                Read →
              </Link>
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
