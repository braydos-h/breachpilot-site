import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security",
  description: "How to report security issues in BreachPilot responsibly.",
  alternates: { canonical: "https://breachpilot.dev/security" },
};

export default function SecurityPage() {
  return (
    <div>
      <PageHero
        eyebrow="Security"
        title="Report issues responsibly"
        lede="BreachPilot runs powerful security tooling. If you find a vulnerability in BreachPilot itself, we want to hear about it — privately first."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-xl border bg-card p-6 text-[15px] leading-7">
          <p>
            The repository does not publish a dedicated security contact, so please use{" "}
            <a
              href={`${SITE.repo}/security/advisories/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub private vulnerability reporting
            </a>{" "}
            against the BreachPilot repository. That keeps the details visible only to maintainers until a fix is ready.
          </p>
          <p className="mt-4 text-muted-foreground">
            Include: what you found, which version or commit, steps to reproduce in a lab, and what you think the
            impact boundary is (operator box? target scope? audit integrity?). Do not test the report against systems
            you don&rsquo;t own — the same authorization rule as the tool itself.
          </p>
        </div>
      </section>
    </div>
  );
}
