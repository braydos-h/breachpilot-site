import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Breachpilot.dev privacy: minimal data collection, no invasive analytics.",
  alternates: { canonical: "https://breachpilot.dev/privacy" },
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Privacy"
        title="As little data as possible"
        lede="This site ships no analytics. GitHub repository statistics load client-side from api.github.com only — and the page works fine when that request fails."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 text-[15px] leading-7 sm:px-6">
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>No tracking scripts, no advertising identifiers, no cross-site cookies.</li>
          <li>No accounts, no forms, nothing you type leaves your browser.</li>
          <li>Installer downloads are plain static files — no signed telemetry, no phone-home.</li>
          <li>Theme preference is stored in your browser&rsquo;s local storage only.</li>
        </ul>
        <p className="mt-4 text-muted-foreground">
          If privacy-preserving analytics are ever added, they will be documented here first.
        </p>
      </section>
    </div>
  );
}
