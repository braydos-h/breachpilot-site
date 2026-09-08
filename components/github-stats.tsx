"use client";

import { GitFork, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RepoResponse = { stargazers_count?: unknown; forks_count?: unknown };
type Stats = { stars: number | null; forks: number | null };

function asCount(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : null;
}

/**
 * Live GitHub stars/forks — fetched only when scrolled into view, with a
 * fixed placeholder so the footnote line never shifts when counts arrive.
 * Degrades gracefully when the API is unreachable.
 */
export function GithubStats({ owner, repo }: { owner: string; repo: string }) {
  const [stats, setStats] = useState<Stats>({ stars: null, forks: null });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = new AbortController();
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        fetch(`https://api.github.com/repos/${owner}/${repo}`, { signal: ctrl.signal })
          .then((r) => (r.ok ? (r.json() as Promise<RepoResponse>) : null))
          .then((j) => {
            if (j) setStats({ stars: asCount(j.stargazers_count), forks: asCount(j.forks_count) });
          })
          .catch(() => {
            /* offline / rate-limited — stay silent, show the repo link only */
          });
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctrl.abort();
    };
  }, [owner, repo]);

  return (
    <span ref={ref} className="inline-flex min-h-[1rem] items-center gap-3 font-mono text-xs text-muted-foreground">
      {stats.stars === null && stats.forks === null ? (
        <span aria-hidden className="inline-block w-24" />
      ) : (
        <span aria-label="GitHub repository statistics" className="inline-flex items-center gap-3">
          {stats.stars !== null && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5" aria-hidden />
              <span className="tabular-nums">{stats.stars.toLocaleString()}</span>
              <span className="sr-only">stars</span>
            </span>
          )}
          {stats.forks !== null && (
            <span className="inline-flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" aria-hidden />
              <span className="tabular-nums">{stats.forks.toLocaleString()}</span>
              <span className="sr-only">forks</span>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
