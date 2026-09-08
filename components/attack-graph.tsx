import { useId } from "react";
import { cn } from "@/lib/cn";

export type GraphNode = { id: string; label: string; sub?: string; state: "done" | "active" | "todo" | "finding" };

const DEFAULT_NODES: GraphNode[] = [
  { id: "target", label: "Target", sub: "127.0.0.1 · allowlisted", state: "done" },
  { id: "recon", label: "Recon", sub: "ports · services · OS", state: "done" },
  { id: "http", label: "HTTP :443", sub: "fingerprint · WAF check", state: "done" },
  { id: "analysis", label: "Web Analysis", sub: "surface scoring", state: "done" },
  { id: "hypothesis", label: "Hypothesis", sub: "H-03 · testable claim", state: "active" },
  { id: "verify", label: "Verification", sub: "oracle probe · evidence", state: "todo" },
  { id: "finding", label: "Finding", sub: "CONFIRMED / REFUTED", state: "finding" },
  { id: "report", label: "Report", sub: "timeline · CVSS · chains", state: "todo" },
];

const STATE_LABEL: Record<GraphNode["state"], string> = {
  done: "done",
  active: "active",
  todo: "todo",
  finding: "finding",
};

function nodeStyles(state: GraphNode["state"]): string {
  switch (state) {
    case "done":
      return "border-foreground/30 bg-muted/60";
    case "active":
      return "border-foreground bg-background shadow-[0_0_0_1px_hsl(var(--foreground)/0.4)]";
    case "finding":
      return "border-foreground/40 bg-primary text-primary-foreground [&_p]:text-primary-foreground/70";
    default:
      return "border-border bg-card";
  }
}

/**
 * Monochrome attack-plan DAG. Horizontal on desktop, vertical on mobile
 * (responsive fallback — no pan/zoom dependency for the marketing page).
 *
 * Server component: pure presentational SVG + HTML, no state or effects.
 * `useId` output is sanitized — raw colons break SVG `url(#…)` references.
 */
export function AttackGraph({ nodes = DEFAULT_NODES }: { nodes?: GraphNode[] }) {
  const flowId = useId().replace(/:/g, "");
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-4 py-2.5">
        <span className="min-w-0 truncate font-mono text-xs uppercase tracking-wider text-muted-foreground">
          attack plan · dag
        </span>
        <span className="flex shrink-0 items-center gap-3 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden /> done
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden /> active
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" aria-hidden /> todo
          </span>
        </span>
      </div>

      {/* desktop: horizontal flow */}
      <svg viewBox="0 0 960 150" className="hidden w-full md:block" role="img" aria-label="Attack plan flow from target to report">
        <defs>
          <marker id={`${flowId}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9" fill="none" strokeWidth="1.5" className="stroke-muted-foreground" />
          </marker>
        </defs>
        {nodes.map((n, i) => {
          const x = 14 + i * 118;
          return (
            <g key={n.id}>
              {i > 0 && (
                <line
                  x1={x - 8}
                  y1="75"
                  x2={x - 2}
                  y2="75"
                  strokeWidth="1.5"
                  strokeDasharray={n.state === "todo" ? "4 4" : undefined}
                  className={n.state === "active" ? "stroke-foreground animate-dash-flow" : "stroke-border"}
                  markerEnd={`url(#${flowId}-arrow)`}
                />
              )}
              <rect
                x={x}
                y="38"
                width="110"
                height="74"
                rx="8"
                className={n.state === "done" ? "fill-muted" : n.state === "finding" ? "fill-primary" : "fill-card stroke-border"}
                strokeWidth={n.state === "active" || n.state === "finding" ? 2 : 1}
                stroke={n.state === "active" ? "currentColor" : undefined}
              />
              {n.state === "active" && <circle cx={x + 12} cy="50" r="3.5" className="fill-amber-500 animate-node-pulse" />}
              {n.state === "done" && <circle cx={x + 12} cy="50" r="3.5" className="fill-emerald-500" />}
            </g>
          );
        })}
      </svg>
      {/* desktop labels as HTML for crisp text */}
      <ol className="hidden grid-cols-8 gap-0 px-2 pb-4 md:grid" aria-hidden>
        {nodes.map((n) => (
          <li key={n.id} className="px-1.5 text-center">
            <p className="text-[12px] font-semibold leading-4">{n.label}</p>
            <p className="mt-1 font-mono text-[10px] leading-3 text-muted-foreground">{n.sub}</p>
          </li>
        ))}
      </ol>
      {/* screen-reader node list: the desktop label row above is aria-hidden */}
      <ol className="sr-only">
        {nodes.map((n) => (
          <li key={n.id}>
            {n.label}
            {n.sub ? ` — ${n.sub}` : ""} ({STATE_LABEL[n.state]})
          </li>
        ))}
      </ol>

      {/* mobile: vertical list */}
      <ol className="space-y-0 p-4 md:hidden">
        {nodes.map((n, i) => (
          <li key={n.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < nodes.length - 1 && <span className="absolute left-[13px] top-7 h-[calc(100%-20px)] w-px bg-border" aria-hidden />}
            <span
              className={cn(
                "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-[10px] font-semibold",
                n.state === "done" && "border-emerald-500/50",
                n.state === "active" && "border-amber-500"
              )}
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={cn("flex-1 rounded-lg border p-2.5", nodeStyles(n.state))}>
              <span className="block text-[13px] font-semibold leading-4">{n.label}</span>
              {n.sub && <span className="mt-0.5 block font-mono text-xs text-muted-foreground">{n.sub}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
