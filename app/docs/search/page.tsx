import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search-results";

export const metadata: Metadata = {
  title: "Search docs",
  description: "Full-text search across the BreachPilot documentation.",
  alternates: { canonical: "https://breachpilot.dev/docs/search" },
};

export default function DocsSearchPage() {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Docs search</p>
      <Suspense fallback={<p className="mt-4 text-sm text-muted-foreground">Loading search…</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
