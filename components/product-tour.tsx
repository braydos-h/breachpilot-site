"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const TOUR_VIEWS = [
  { id: "new-run", label: "New Run", desc: "Set target, allowlist, goal. Review, then launch.", rows: ["target  127.0.0.1  ·  allowlisted", "goal  initial_access  [GATED]", "mode  attack · full_access (lab)"] },
  { id: "live-run", label: "Live Run", desc: "Tool calls and decisions stream over WebSocket.", rows: ["recon › run_full_recon → 4 ports", "vuln › CVE-2024-xxxx ↔ module 87/100", "critic › scope PASS · in-allowlist"] },
  { id: "graph", label: "Attack Graph", desc: "Pan/zoom DAG with evidence on every node.", rows: ["8 nodes · 2 ready · 1 blocked", "path: recon → hypothesis H-03", "evidence attached to H-03"] },
  { id: "evidence", label: "Evidence", desc: "Reports plus SHA-256 audit chain, exportable.", rows: ["H-03 PROBE … CONFIRMED", "audit chain · sha256 9f3a…c41d", "report.md + report.html rendered"] },
  { id: "skills", label: "Skills", desc: "Advisory catalog, re-selected mid-run.", rows: ["top-6 selected for this context", "jwt-algorithm-confusion … 0.91", "re-selection on new CVE"] },
  { id: "modules", label: "Modules", desc: "Applicability scored 0–100 per target.", rows: ["web … 87/100 · applicable", "crypto_jwt … 72/100", "privesc … gated on access"] },
  { id: "benchmarks", label: "Benchmarks", desc: "Verified success, never claimed success.", rows: ["VERIFIED ≠ claimed", "false_positive_rate tracked", "baseline.json regression gate"] },
  { id: "memory", label: "Memory", desc: "What worked, against what, with evidence.", rows: ["lesson: smb-signing-off → relay", "confidence 0.83 · 4 refs", "nomic-embed-text indexed"] },
  { id: "connections", label: "Connections", desc: "Listeners and beacon health at a glance.", rows: ["listener :4444 · healthy", "beacon beacon-01 · 60s check-in", "SOCKS pivot · idle"] },
  { id: "system", label: "System", desc: "Providers, plugins, config — no YAML editing.", rows: ["provider opencode_go · healthy", "sandbox image present", "14 plugins · 3 enabled"] },
] as const;

type View = (typeof TOUR_VIEWS)[number];

/**
 * Interactive product-tour tabs — the only client piece of the home page.
 * Full tab semantics: arrow-key/Home/End navigation with roving tabindex
 * and tab↔panel linkage.
 */
export function ProductTour({ initial = "live-run" }: { initial?: string }) {
  const start = TOUR_VIEWS.findIndex((v) => v.id === initial);
  const [index, setIndex] = useState(start === -1 ? 1 : start);
  const active: View = TOUR_VIEWS[index] ?? TOUR_VIEWS[1];
  const baseId = useId().replace(/:/g, "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function select(next: number) {
    setIndex((next + TOUR_VIEWS.length) % TOUR_VIEWS.length);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      select(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      select(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0);
    } else if (e.key === "End") {
      e.preventDefault();
      select(TOUR_VIEWS.length - 1);
    }
  }

  return (
    <div className="mt-10">
      <p className="mb-1 text-right font-mono text-[11px] text-muted-foreground sm:hidden" aria-hidden>
        swipe to explore →
      </p>
      <div className="scrollbar-thin relative -mx-4 overflow-x-auto px-4 pb-2 [mask-image:linear-gradient(to_right,#000_calc(100%-3.5rem),transparent)] sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Product views" onKeyDown={onKeyDown} className="flex min-w-max gap-2">
          {TOUR_VIEWS.map((v, i) => (
            <button
              key={v.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${v.id}`}
              aria-selected={i === index}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              className={cn(
                "min-h-[44px] rounded-md border px-3.5 py-2 text-sm font-medium transition-colors",
                i === index
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]" role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active.id}`} tabIndex={0}>
        <div className="min-w-0 overflow-hidden rounded-xl border bg-card">
          <div className="border-b bg-muted/40 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {active.label} · illustrative
          </div>
          <ul className="space-y-1.5 bg-grid-sm p-4 font-mono text-[12px] leading-5">
            {active.rows.map((r) => (
              <li key={r} title={r} className="truncate rounded border bg-background px-2 py-1.5">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center rounded-xl border bg-muted/30 p-6">
          <h3 className="text-lg font-semibold tracking-tight">{active.label}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{active.desc}</p>
          <p className="mt-4">
            <Link href="/install" className="text-sm font-medium underline underline-offset-4">
              Run it locally →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
