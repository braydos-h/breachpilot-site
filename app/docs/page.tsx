import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { DocsSearchBox } from "@/components/docs-nav";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui";
import { sidebarGroups } from "@/lib/docs";
import { routeMetadata } from "@/lib/metadata";

export const metadata: Metadata = routeMetadata("/docs", {
  title: "Documentation",
  description:
    "BreachPilot documentation, generated from the repository Markdown: getting started, architecture, safety, agents, tooling, platform, extensibility and engineering.",
});

/** Pinned entry points — resolved against the synced docs, skipped when absent. */
const START_HERE_SLUGS = ["getting-started", "safety-model", "architecture"];

export default function DocsIndexPage() {
  const groups = sidebarGroups();
  const flat = groups.flatMap((g) => g.docs);
  const startHere = START_HERE_SLUGS.map((slug) =>
    flat.find((d) => d.slug === slug || d.slug.endsWith(`/${slug}`))
  ).filter((d): d is (typeof flat)[number] => d !== undefined);

  return (
    <div>
      <PageHero
        eyebrow="Documentation"
        title="Docs, from the repo itself"
        lede="One source of truth: this section is generated at build time from the repository Markdown — never a duplicate. Pick a guide or search the whole set."
      >
        <div className="mt-6 max-w-xl">
          <DocsSearchBox />
          {flat.length > 0 ? (
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              {flat.length} guides · {groups.length} sections · synced at build time
            </p>
          ) : null}
        </div>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {startHere.length > 0 ? (
          <div>
            <h2 id="docs-start-here" className="text-lg font-semibold tracking-tight">
              Start here
            </h2>
            <ul aria-labelledby="docs-start-here" className="mt-4 grid gap-4 sm:grid-cols-3">
              {startHere.map((d) => (
                <li key={d.slug} className="h-full">
                  <Card className="h-full p-0">
                    <Link
                      href={d.path}
                      className="block h-full rounded-lg p-5 transition-colors hover:bg-muted/50"
                    >
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {d.category}
                      </span>
                      <span className="mt-1 block font-semibold tracking-tight">{d.title}</span>
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {groups.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => (
              <Card key={g.category}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {g.category}{" "}
                  <span className="ml-1 font-mono normal-case tracking-normal">({g.docs.length})</span>
                </h2>
                <ul className="mt-3 space-y-2">
                  {g.docs.map((d) => (
                    <li key={d.slug}>
                      <Link href={d.path} className="text-[15px] font-medium underline-offset-4 hover:underline">
                        {d.title}
                      </Link>
                      <p className="font-mono text-xs text-muted-foreground">{d.slug}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[15px] text-muted-foreground">
            No guides are available right now — the docs sync runs at build time.
          </p>
        )}
        <div className="mt-12 rounded-xl border bg-card p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldAlert className="h-4 w-4" aria-hidden /> Authorized testing only
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            These guides describe attack tooling for systems you own or have explicit written
            permission to assess — the same scope lock and audit chain as the product itself.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/safety"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Read the safety model
            </Link>
            <Link
              href="/install"
              className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Install for your lab
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
