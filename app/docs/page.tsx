import type { Metadata } from "next";
import Link from "next/link";
import { DocsSearchBox } from "@/components/docs-nav";
import { PageHero } from "@/components/page-hero";
import { sidebarGroups } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "BreachPilot documentation, generated from the repository Markdown: getting started, architecture, safety, agents, tooling, platform, extensibility and engineering.",
  alternates: { canonical: "https://breachpilot.dev/docs" },
};

export default function DocsIndexPage() {
  const groups = sidebarGroups();
  return (
    <div>
      <PageHero
        eyebrow="Documentation"
        title="Docs, from the repo itself"
        lede="Generated at build time from the repository Markdown — one source of truth, never a duplicate. Pick a guide or search the whole set."
      >
        <div className="mt-6 max-w-xl">
          <DocsSearchBox />
        </div>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <section key={g.category} aria-label={g.category}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {g.category}
              </h2>
              <ul className="mt-3 space-y-2">
                {g.docs.map((d) => (
                  <li key={d.slug}>
                    <Link href={d.path} className="text-[15px] font-medium underline-offset-4 hover:underline">
                      {d.title}
                    </Link>
                    <p className="font-mono text-[11px] text-muted-foreground">{d.slug}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
