import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CodeSnippet } from "@/components/ui";
import { COMMIT_SHORT, LATEST_TAG, META, VERSION } from "@/lib/meta";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "BreachPilot release channels: stable tags, edge builds, pinned installs and what the upstream repository must publish for checksum verification.",
  alternates: { canonical: "https://breachpilot.dev/releases" },
};

export default function ReleasesPage() {
  const tag = LATEST_TAG ?? `v${VERSION}`;
  return (
    <div>
      <PageHero
        eyebrow="Releases"
        title="Stable by default, edge when you ask"
        lede="The hosted installers pin a stable tag — never a moving branch. Everything below is derived from the upstream repository at build time, not a hand-kept changelog."
      />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Latest stable tag</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{tag}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              <a href={`${SITE.repo}/releases/tag/${tag}`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
                Release notes →
              </a>
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Package version</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">v{VERSION}</p>
            <p className="mt-2 text-sm text-muted-foreground">From upstream pyproject.toml at build time.</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Built from commit</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{COMMIT_SHORT ?? "—"}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {META.stale ? (
                <span className="font-medium text-amber-600 dark:text-amber-400">Stale metadata — upstream checkout was missing at build.</span>
              ) : (
                <>Site metadata generated from this commit.</>
              )}
            </p>
          </div>
        </div>

        <h2 className="mt-12 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Install a channel</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Stable (default)</h3>
            <div className="mt-3">
              <CodeSnippet code={`curl -fsSL ${SITE.installSh} | bash -s -- --version ${tag}`} title="pinned stable install" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Resolves the newest <code className="rounded border bg-muted px-1 font-mono text-[13px]">v*</code> tag and checks it out detached — no branch movement. Omit{" "}
              <code className="rounded border bg-muted px-1 font-mono text-[13px]">--version</code> to take the latest tag automatically.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Edge (main)</h3>
            <div className="mt-3">
              <CodeSnippet code={`curl -fsSL ${SITE.installSh} | bash -s -- --channel edge`} title="edge install" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Tracks <code className="rounded border bg-muted px-1 font-mono text-[13px]">main</code> tip. Moves under you — only for contributors testing unreleased work.
            </p>
          </div>
        </div>

        <h2 className="mt-12 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Verify what you installed</h2>
        <div className="mt-3">
          <CodeSnippet
            code={`BREACHPILOT_SHA256=<expected> bash install.sh --version ${tag}`}
            title="checksum-pinned install"
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Every install prints the exact ref and commit SHA. Hard checksum verification needs the upstream repository to
          publish <code className="rounded border bg-muted px-1 font-mono text-[13px]">SHA256SUMS</code> per release tag — until then, pin with{" "}
          <code className="rounded border bg-muted px-1 font-mono text-[13px]">BREACHPILOT_SHA256</code>. See the installer header for the full upstream requirement.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Full history:{" "}
          <a href={`${SITE.repo}/releases`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
            GitHub releases →
          </a>{" "}
          · Install guide: <Link href="/install" className="font-medium text-foreground underline underline-offset-4">/install →</Link>
        </p>
      </section>
    </div>
  );
}
