"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type SearchDoc = {
  slug: string;
  title: string;
  path: string;
  category: string;
  body: string;
};

function snippet(body: string, q: string): string {
  const first = q.toLowerCase().split(/\s+/)[0] ?? "";
  const i = first ? body.toLowerCase().indexOf(first) : -1;
  if (i === -1) return body.slice(0, 160).replace(/\s+/g, " ");
  const start = Math.max(0, i - 80);
  return `${start > 0 ? "…" : ""}${body.slice(start, i + 120).replace(/\s+/g, " ")}…`;
}

export function SearchResults() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const [index, setIndex] = useState<SearchDoc[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((docs) => {
        if (!cancelled) setIndex(docs);
      })
      .catch(() => {
        if (!cancelled) setIndex([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results =
    index === null || terms.length === 0
      ? []
      : index
          .map((d) => {
            const hay = `${d.title}\n${d.body}`.toLowerCase();
            const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
            return { d, score };
          })
          .filter((r) => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 30);

  return (
    <div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        {q ? (
          <>
            {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
          </>
        ) : (
          "Search the docs"
        )}
      </h1>
      {!q && <p className="mt-2 text-sm text-muted-foreground">Use the search box on the docs index to run a query.</p>}
      {q && index === null && <p className="mt-4 text-sm text-muted-foreground">Searching…</p>}
      {q && index !== null && results.length === 0 && (
        <p className="mt-4 text-[15px] text-muted-foreground">
          Nothing matched. Try fewer words, or browse the <Link href="/docs" className="underline underline-offset-4">docs index</Link>.
        </p>
      )}
      <ul className="mt-6 space-y-4">
        {results.map(({ d }) => (
          <li key={d.slug} className="rounded-lg border bg-card p-4">
            <Link href={d.path} className="font-medium underline-offset-4 hover:underline">
              {d.title}
            </Link>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {d.category} · /docs/{d.slug}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{snippet(d.body, q)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        <Link href="/docs" className="underline underline-offset-4">← Back to docs index</Link>
      </p>
    </div>
  );
}
