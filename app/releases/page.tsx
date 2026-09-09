import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpCircle, Bell, FileCheck, GitBranch, History, ShieldCheck, Tag } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, CodeSnippet, SectionHeading } from "@/components/ui";
import { COMMIT_SHORT, LATEST_TAG, META, VERSION } from "@/lib/meta";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/releases", {
  title: "Releases",
  description:
    "BreachPilot release channels: stable tags, edge builds, pinned installs and what the upstream repository must publish for checksum verification.",
});

const TIMELINE = [
  {
    icon: Tag,
    title: "Stable tag is cut upstream",
    body: "Maintainers cut a versioned tag in the upstream repository. The tag is the release — there is no separate binary channel to drift from.",
  },
  {
    icon: GitBranch,
    title: "Hosted installers pin the tag",
    body: "The install scripts resolve the newest tag and check it out detached. Omitting the version flag takes the latest tag automatically; nothing ever follows a moving branch unless you ask for edge.",
  },
  {
    icon: FileCheck,
    title: "You verify what landed",
    body: "Every install prints the exact ref and commit SHA it checked out, so the running tree can be matched back to the published release notes before first run.",
  },
  {
    icon: ArrowUpCircle,
    title: "You upgrade by re-pinning",
    body: "Upgrades are the same pinned command with the new tag. Back up config first, re-pin, verify the SHA, then restart the WebUI.",
  },
] as const;

const UPGRADE_STEPS = [
  "Read the release notes for the target tag, checking for breaking config or WebUI changes.",
  "Back up your config directory (for example, C:\\BreachPilot\\config) so you can roll back.",
  "Re-run the pinned stable install with the new tag — never switch an install to a moving branch to upgrade.",
  "Confirm the printed ref and commit SHA match the published notes, then restart the WebUI.",
] as const;

export default function ReleasesPage() {
  const tag = LATEST_TAG ?? `v${VERSION}`;
  const releasesUrl = `${SITE.repo}/releases`;
  const tagUrl = `${SITE.repo}/releases/tag/${tag}`;
  const stableInstall = `curl -fsSL ${SITE.installSh} | bash -s -- --version ${tag}`;
  const edgeInstall = `curl -fsSL ${SITE.installSh} | bash -s -- --channel edge`;

  return (
    <div>
      <PageHero
        eyebrow="Releases"
        title="Stable by default, edge when you ask"
        lede="The hosted installers pin a stable tag — never a moving branch. The version below is derived from the upstream repository at build time, and the full history lives on GitHub."
      >
        <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Current version">
          <Badge tone="solid">
            <Tag className="h-3.5 w-3.5" aria-hidden />
            {tag}
          </Badge>
          <Badge>v{VERSION} package</Badge>
          <Badge>{SITE.license}</Badge>
          <Badge>Commit {COMMIT_SHORT ?? "—"}</Badge>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={tagUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Release notes for {tag}
          </a>
          <Link
            href="/install"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Install guide
          </Link>
          <a
            href={releasesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            <History className="mr-2 h-4 w-4" aria-hidden />
            Full history on GitHub
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          For authorized testing only — run BreachPilot only against systems you own or have explicit
          permission to test.
        </p>
      </PageHero>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section aria-labelledby="current-release">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Latest stable tag
              </p>
              <p className="mt-2 break-all font-mono text-2xl font-semibold tabular-nums">{tag}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Pinned by the hosted installers — never a moving branch.
              </p>
            </Card>
            <Card>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Package version
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">v{VERSION}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                From upstream pyproject.toml at build time.
              </p>
            </Card>
            <Card>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Built from commit
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
                {COMMIT_SHORT ?? "—"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {META.stale ? (
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    Stale metadata — upstream checkout was missing at build.
                  </span>
                ) : (
                  <>Site metadata generated from this commit.</>
                )}
              </p>
            </Card>
          </div>
        </section>

        <section aria-labelledby="channels" className="mt-14">
          <SectionHeading
            align="left"
            eyebrow="Channels"
            title="Install a channel"
            lede="Stable is the default and the only supported choice for assessments. Edge tracks the main tip and moves under you — contributors only."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <h3 id="channels" className="font-semibold tracking-tight">
                Stable (default)
              </h3>
              <div className="mt-3">
                <CodeSnippet code={stableInstall} title="pinned stable install" />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Resolves the newest{" "}
                <code className="rounded border bg-muted px-1 font-mono text-[13px]">v*</code> tag
                and checks it out detached — no branch movement. Omit{" "}
                <code className="rounded border bg-muted px-1 font-mono text-[13px]">--version</code>{" "}
                to take the latest tag automatically.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold tracking-tight">Edge (main)</h3>
              <div className="mt-3">
                <CodeSnippet code={edgeInstall} title="edge install" />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Tracks{" "}
                <code className="rounded border bg-muted px-1 font-mono text-[13px]">main</code> tip.
                Moves under you — only for contributors testing unreleased work. Never use edge for
                an assessment you need to reproduce.
              </p>
            </Card>
          </div>
        </section>

        <section aria-labelledby="timeline" className="mt-14">
          <SectionHeading
            align="left"
            eyebrow="Timeline"
            title="How a release ships"
            lede="No hand-kept changelog on this page — tags, notes, and history are published upstream on GitHub, and this page points at them."
          />
          <ol className="relative mt-6 space-y-4 border-l pl-6" aria-label="Release pipeline">
            {TIMELINE.map((step) => (
              <li key={step.title} className="relative">
                <span
                  className="absolute -left-[37px] flex h-7 w-7 items-center justify-center rounded-full border bg-background"
                  aria-hidden
                >
                  <step.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
                <h3 className="font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="upgrade" className="mt-14">
          <SectionHeading
            align="left"
            eyebrow="Upgrade notes"
            title="Upgrade without surprises"
            lede={`Upgrading is re-pinning to the new tag, then restarting the WebUI (default port ${SITE.webuiDefaultPort}). Read the notes first — breaking changes are announced there, not here.`}
          />
          <Card className="mt-6">
            <ol className="space-y-3" aria-label="Upgrade steps">
              {UPGRADE_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-semibold text-foreground"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <CodeSnippet code={stableInstall} title={`upgrade to ${tag}`} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Replace{" "}
              <code className="rounded border bg-muted px-1 font-mono text-[13px]">{tag}</code> with
              the target tag from the{" "}
              <a
                href={releasesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-4"
              >
                GitHub releases history
              </a>
              . If the new WebUI does not come up, confirm nothing else is bound to port{" "}
              <span className="font-mono tabular-nums">{SITE.webuiDefaultPort}</span> before
              retrying.
            </p>
          </Card>
        </section>

        <section aria-labelledby="verify" className="mt-14">
          <SectionHeading
            align="left"
            eyebrow="Trust"
            title="Verify what you installed"
          />
          <div className="mt-6">
            <CodeSnippet
              code={`BREACHPILOT_SHA256=<expected> bash install.sh --version ${tag}`}
              title="checksum-pinned install"
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Every install prints the exact ref and commit SHA. Hard checksum verification needs the
            upstream repository to publish{" "}
            <code className="rounded border bg-muted px-1 font-mono text-[13px]">SHA256SUMS</code>{" "}
            per release tag — until then, pin with{" "}
            <code className="rounded border bg-muted px-1 font-mono text-[13px]">
              BREACHPILOT_SHA256
            </code>
            . See the installer header for the full upstream requirement.
          </p>
        </section>

        <section aria-labelledby="watch" className="mt-14">
          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="watch" className="flex items-center gap-2 font-semibold tracking-tight">
                <Bell className="h-4 w-4 text-muted-foreground" aria-hidden />
                Never miss a release
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Watch the upstream repository for releases only — security fixes ship as stable tags.
              </p>
            </div>
            <a
              href={`${SITE.repo}/watchers`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Watch on GitHub
            </a>
          </Card>
        </section>

        <aside
          aria-label="Authorized testing only"
          className="mt-10 flex gap-3 rounded-lg border bg-muted/40 p-4"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <p className="text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Authorized testing only.</span> Release
            tooling is for systems you own or have explicit permission to test. Every version —
            stable or edge — carries the same scope and authorization requirements.
          </p>
        </aside>
      </main>
    </div>
  );
}
