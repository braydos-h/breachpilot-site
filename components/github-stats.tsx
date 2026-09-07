"use client";

import { GitFork, Star } from "lucide-react";
import { useEffect, useState } from "react";

type Stats = { stars: number | null; forks: number | null };

/** Live GitHub stars/forks — degrades gracefully when the API is unreachable. */
export function GithubStats({ owner, repo }: { owner: string; repo: string }) {
  const [stats, setStats] = useState<Stats>({ stars: null, forks: null });

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && j) setStats({ stars: j.stargazers_count ?? null, forks: j.forks_count ?? null });
      })
      .catch(() => {
        /* offline / rate-limited — stay silent, show the repo link only */
      });
    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  if (stats.stars === null && stats.forks === null) return null;

  return (
    <span className="inline-flex items-center gap-3 font-mono text-xs text-muted-foreground" aria-label="GitHub repository statistics">
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
  );
}
