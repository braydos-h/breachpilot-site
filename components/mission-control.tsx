import { Activity, Crosshair, FileCheck2, GitBranch, Lock, Terminal } from "lucide-react";
import { StatusDot } from "@/components/ui";

/**
 * Simulated BreachPilot mission-control panel for the hero.
 * Illustrative lab data only — mirrors the WebUI's visual language
 * (thin borders, status pills, mono metadata, evidence rows).
 *
 * The blocked off-allowlist row is the one deliberate color exception in
 * an otherwise monochrome panel: destructive-token border + dot only, row
 * text stays foreground so contrast holds in both themes.
 */
export function MissionControl() {
  return (
    <div
      className="overflow-hidden rounded-xl border bg-card text-left shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.15)]"
      role="img"
      aria-label="Illustrative BreachPilot mission-control interface showing a lab assessment against 127.0.0.1, including a blocked off-allowlist action"
    >
      {/* window bar */}
      <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-border" />
          <i className="h-2.5 w-2.5 rounded-full bg-border" />
          <i className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="ml-2 min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">breachpilot · live run · lab</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-background px-2.5 py-0.5 text-xs font-semibold">
          <StatusDot tone="ok" className="animate-heartbeat" />
          RUNNING
        </span>
      </div>

      <div className="grid md:grid-cols-[1fr_1.1fr]">
        {/* left: target + stages */}
        <div className="min-w-0 border-b p-5 md:border-b-0 md:border-r md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            Target — authorized lab only
          </p>
          <p className="mt-2 flex items-center gap-2 font-mono text-sm font-medium">
            <Crosshair className="h-4 w-4 text-muted-foreground" aria-hidden />
            127.0.0.1 <span className="text-muted-foreground">· lab</span>
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-foreground/20 bg-background px-2 py-1 font-mono text-xs font-medium">
            <Lock className="h-3 w-3" aria-hidden /> allowlist: 127.0.0.1 · LOCKED
          </p>

          <ol className="mt-5 space-y-2.5">
            {[
              { label: "Recon", state: "done", note: "quick_scan · 4 ports" },
              { label: "Initial Access", state: "active", note: "hypothesis H-03 · testing" },
              { label: "Verify", state: "todo", note: "oracle probe queued" },
              { label: "Report", state: "todo", note: "evidence-linked draft" },
            ].map((s) => (
              <li key={s.label} className="flex items-center gap-2.5 text-sm">
                <StatusDot tone={s.state === "done" ? "ok" : s.state === "active" ? "warn" : "idle"} />
                <span className={s.state === "todo" ? "text-muted-foreground" : "font-medium text-foreground"}>
                  {s.label}
                </span>
                <span className="ml-auto hidden font-mono text-xs text-muted-foreground min-[400px]:block">
                  {s.note}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* right: agent activity + evidence */}
        <div className="min-w-0 bg-grid-sm p-5 md:p-6">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            <Activity className="h-3.5 w-3.5" aria-hidden /> Agent activity
          </p>
          <ul className="mt-2.5 space-y-1.5 [overflow-wrap:anywhere] font-mono text-[13px] leading-6">
            <li className="rounded border border-foreground/15 bg-background px-2.5 py-1.5 text-foreground sm:truncate">
              <span className="font-semibold text-foreground/60">recon ›</span> run_full_recon → 443/http open
            </li>
            <li className="rounded border border-foreground/15 bg-background px-2.5 py-1.5 text-foreground sm:truncate">
              <span className="font-semibold text-foreground/60">vuln ›</span> CVE-2024-xxxx ↔ web module (87/100)
            </li>
            <li className="rgb-split rounded border border-destructive/50 border-l-4 border-l-destructive bg-destructive/5 px-2.5 py-1.5 font-medium text-foreground sm:truncate" title="critic › BLOCKED egress to non-allowlist host · denied">
              <span className="font-semibold text-destructive">critic ›</span> BLOCKED egress to non-allowlist host · denied
            </li>
            <li className="rounded border border-foreground/15 bg-background px-2.5 py-1.5 text-foreground sm:truncate">
              <span className="font-semibold text-foreground/60">exploit ›</span> craft_exploit → attempt A-12
            </li>
          </ul>
          <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            <FileCheck2 className="h-3.5 w-3.5" aria-hidden /> Evidence
          </p>
          <ul className="mt-2.5 space-y-1.5 text-[13px]">
            <li className="flex min-w-0 items-center gap-2 rounded border border-foreground/20 bg-background px-2.5 py-1.5">
              <GitBranch className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="truncate font-mono font-medium">H-03 PROBE</span>
              <span className="ml-auto shrink-0 rounded-full border border-foreground/30 px-2 py-px font-mono text-xs font-semibold">
                CONFIRMED
              </span>
            </li>
            <li className="flex min-w-0 items-center gap-2 rounded border border-foreground/15 bg-background px-2.5 py-1.5">
              <Terminal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="truncate font-mono">audit chain · sha256</span>
              <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">9f3a…c41d</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
