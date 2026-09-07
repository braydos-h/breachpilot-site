import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "BreachPilot privacy: no analytics, no tracking, no accounts. Your theme choice stays in your browser; GitHub stats load client-side only.",
  alternates: { canonical: `${SITE.url}/privacy` },
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
        <h2 className="text-lg font-semibold tracking-tight">What we collect: nothing</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>No tracking scripts, no advertising identifiers, no cross-site cookies.</li>
          <li>No accounts, no forms — nothing you type leaves your browser.</li>
          <li>Installer downloads are plain static files — no telemetry, no phone-home.</li>
          <li>Your theme preference stays in your browser&rsquo;s local storage only.</li>
        </ul>
        <h2 className="mt-8 text-lg font-semibold tracking-tight">The only third-party request</h2>
        <p className="mt-2 text-muted-foreground">
          The homepage loads public repository statistics client-side from api.github.com. It sets nothing, sends no
          identifier, and the page renders fine when that request fails.
        </p>
        <h2 className="mt-8 text-lg font-semibold tracking-tight">Questions</h2>
        <p className="mt-2 text-muted-foreground">
          If privacy-preserving analytics are ever added, they will be documented here first. Until then, anything
          unclear —{" "}
          <Link href={`${SITE.repo}/issues`} className="font-medium text-foreground underline underline-offset-4">
            open an issue
          </Link>{" "}
          or see{" "}
          <Link href="/security" className="font-medium text-foreground underline underline-offset-4">
            how to report a security concern
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
