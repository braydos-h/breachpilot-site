import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal",
  description: "BreachPilot legal: Apache 2.0 license, authorized-use notice, repository license links.",
  alternates: { canonical: "https://breachpilot.dev/legal" },
};

export default function LegalPage() {
  return (
    <div>
      <PageHero eyebrow="Legal" title="License and authorized use" />
      <section className="mx-auto max-w-3xl px-4 py-12 text-[15px] leading-7 sm:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Apache 2.0</h2>
        <p className="mt-2 text-muted-foreground">
          BreachPilot is open source under the Apache License, Version 2.0. See{" "}
          <a href={`${SITE.repo}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
            LICENSE in the repository
          </a>{" "}
          for the full terms.
        </p>
        <h2 className="mt-8 text-lg font-semibold tracking-tight">Authorized use</h2>
        <p className="mt-2 text-muted-foreground">
          Only test systems you own or have explicit written permission to assess. This site is not a commercial SaaS
          terms agreement — it is the public home of an open-source security tool, and the authorization rule travels
          with every install, run and report.
        </p>
      </section>
    </div>
  );
}
