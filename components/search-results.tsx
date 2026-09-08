"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export type SearchDoc = {
  slug: string;
  title: string;
  path: string;
  category: string;
  body: string;
};

/**
 * Tokenize a query the same way the index stores text: the sync script
 * replaces `-` with a space, so `mcp-wiring` must match `mcp wiring`.
 */
function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function snippet(body: string, terms: string[]) {
  const lower = body.toLowerCase();
  let best = -1;
  for (const t of terms) {
    const i = lower.indexOf(t);
    if (i !== -1 && (best === -1 || i < best)) best = i;
  }
  const raw = best === -1 ? body.slice(0, 160) : body.slice(Math.max(0, best - 80), best + 120);
  const text = `${best > 80 ? "\u2026" : ""}${raw.replace(/\s+/g, " ")}\u2026`;
  // Highlight query terms for scanability; odd split indices are matches.
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text
    .split(new RegExp(`(${escaped.join("|")})`, "gi"))
    .map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>));
}

export function SearchResults() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const [index, setIndex] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/search-index.json", { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`search index ${r.status}`);
        return r.json() as Promise<unknown>;
      })
      .then((docs) => {
        if (Array.isArray(docs)) setIndex(docs as SearchDoc[]);
        else setFailed(true);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setFailed(true);
      });
    return () => ctrl.abort();
  }, []);

  const terms = useMemo(() => tokenize(q), [q]);
  const results = useMemo(() => {
    if (index === null || terms.length === 0) return [];
    return index
      .map((d) => {
        const titleHay = `${d.title} ${d.category}`.toLowerCase();
        const bodyHay = d.body.toLowerCase();
        let score = 0;
        for (const t of terms) {
          if (titleHay.includes(t)) score += 3;
          else if (bodyHay.includes(t)) score += 1;
        }
        return { d, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
  }, [index, terms]);

  return (
    <div>
      <div role="status" aria-live="polite">
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {q ? (
            <>
              {index === null && !failed ? "Searching" : `${results.length} result${results.length === 1 ? "" : "s"}`} for “{q}”
            </>
          ) : (
            "Search the docs"
          )}
        </h1>
        {!q && <p className="mt-2 text-sm text-muted-foreground">Use the search box on the docs index to run a query.</p>}
        {q && index === null && !failed && <p className="mt-4 text-sm text-muted-foreground">Searching…</p>}
        {q && failed && (
          <p className="mt-4 text-[15px] text-muted-foreground">
            Search is unavailable right now. Try browsing the <Link href="/docs" className="underline underline-offset-4">docs index</Link> instead.
          </p>
        )}
        {q && index !== null && !failed && results.length === 0 && (
          <p className="mt-4 text-[15px] text-muted-foreground">
            Nothing matched. Try fewer words, or browse the <Link href="/docs" className="underline underline-offset-4">docs index</Link>.
          </p>
        )}
      </div>
      <ul className="mt-6 space-y-4">
        {results.map(({ d }) => (
          <li key={d.slug} className="rounded-lg border bg-card p-5">
            <Link href={d.path} className="font-medium underline-offset-4 hover:underline">
              {d.title}
            </Link>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {d.category} · /docs/{d.slug}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{snippet(d.body, terms)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        <Link href="/docs" className="underline underline-offset-4">← Back to docs index</Link>
      </p>
    </div>
  );
}
