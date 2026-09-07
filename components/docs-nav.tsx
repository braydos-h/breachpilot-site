"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

export type NavDoc = { slug: string; title: string; path: string };
export type NavGroup = { category: string; docs: NavDoc[] };

export function DocsSidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, docs: g.docs.filter((d) => d.title.toLowerCase().includes(q) || d.slug.includes(q)) }))
      .filter((g) => g.docs.length > 0);
  }, [groups, query]);

  const list = (
    <div>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <span className="sr-only">Filter documentation pages</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter docs…"
          aria-label="Filter documentation pages"
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground"
        />
      </label>
      <div className="mt-4 space-y-5">
        {filtered.map((g) => (
          <nav key={g.category} aria-label={`Docs — ${g.category}`}>
            <h2 className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {g.category}
            </h2>
            <ul className="mt-1.5 space-y-0.5">
              {g.docs.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={d.path}
                    aria-current={pathname === d.path ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground",
                      pathname === d.path && "bg-muted font-medium text-foreground"
                    )}
                  >
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        {filtered.length === 0 && <p className="px-2 text-sm text-muted-foreground">No pages match “{query}”.</p>}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="docs-sidebar-panel"
          className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium"
        >
          {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          {open ? "Close contents" : "Browse docs"}
        </button>
      </div>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-[4.5rem] max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 scrollbar-thin">{list}</div>
      </aside>
      {open && (
        <div id="docs-sidebar-panel" className="mb-6 rounded-lg border bg-card p-4 lg:hidden">
          {list}
        </div>
      )}
    </>
  );
}

export function DocsSearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      aria-label="Documentation search"
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/docs/search?q=${encodeURIComponent(q.trim())}`);
      }}
      className="relative"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <label htmlFor="docs-search" className="sr-only">Search documentation</label>
      <input
        id="docs-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the docs…"
        className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-3 text-[15px] placeholder:text-muted-foreground"
      />
    </form>
  );
}
