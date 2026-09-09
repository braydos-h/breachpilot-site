"use client";

import { useId, useRef, useState } from "react";
import { CodeSnippet } from "@/components/ui";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";

const TABS = [
  { id: "linux", label: "Linux", lang: "bash", title: "Linux install" },
  { id: "macos", label: "macOS", lang: "bash", title: "macOS install" },
  { id: "windows", label: "Windows", lang: "powershell", title: "Windows install (PowerShell)" },
] as const;

type Os = (typeof TABS)[number]["id"];

function commandFor(os: Os): string {
  return os === "windows" ? `irm ${SITE.installPs1} | iex` : `curl -fsSL ${SITE.installSh} | bash`;
}

function reviewHref(os: Os): string {
  return os === "windows" ? SITE.installPs1 : SITE.installSh;
}

/**
 * OS picker with full tab semantics: arrow-key/Home/End navigation and
 * tab↔panel linkage. The command itself derives from lib/site.ts so the
 * review-first links below can never drift from the one-liner above.
 */
export function InstallTabs({ compact = false }: { compact?: boolean }) {
  const [os, setOs] = useState<Os>("linux");
  const baseId = useId().replace(/:/g, "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = TABS.findIndex((t) => t.id === os);
  const tab = TABS[active] ?? TABS[0];
  const cmd = commandFor(os);

  function onKeyDown(e: React.KeyboardEvent) {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % TABS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active + TABS.length - 1) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next !== null) {
      e.preventDefault();
      const id = TABS[next]?.id;
      if (id) {
        setOs(id);
        tabRefs.current[next]?.focus();
      }
    }
  }

  return (
    <div className={compact ? "" : "mx-auto mt-8 max-w-2xl"}>
      <div role="tablist" aria-label="Operating system" onKeyDown={onKeyDown} className="inline-flex rounded-lg border bg-muted/50 p-1">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`${baseId}-tab-${t.id}`}
            aria-selected={os === t.id}
            aria-controls={`${baseId}-panel`}
            tabIndex={os === t.id ? 0 : -1}
            onClick={() => setOs(t.id)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              os === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${tab.id}`} tabIndex={0} className="mt-3">
        <CodeSnippet code={cmd} lang={tab.lang} title={tab.title} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {compact ? (
          <>
            Quick install above is optional — recommended:{" "}
            <a href={reviewHref(os)} className="font-medium text-foreground underline underline-offset-4">
              Review installer before running →
            </a>
          </>
        ) : (
          <>
            Prefer to read it first?{" "}
            <a href={reviewHref(os)} className="font-medium text-foreground underline underline-offset-4">
              Review installer before running →
            </a>{" "}
            · <a href="/install" className="font-medium text-foreground underline underline-offset-4">Full install guide</a>
          </>
        )}
      </p>
    </div>
  );
}
