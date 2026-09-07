import { Activity, Crosshair, FileCheck2, GitBranch, Lock, Terminal } from "lucide-react";
import { StatusDot } from "@/components/ui";

/**
 * Simulated BreachPilot mission-control panel for the hero.
 * Illustrative lab data only — mirrors the WebUI's visual language
 * (thin borders, status pills, mono metadata, evidence rows).
 */
export function MissionControl() {
  return (
    <div
      className="overflow-hidden rounded-xl border bg-card text-left shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.15)]"
      role="img"
      aria-label="Illustrative BreachPilot mission-control interface showing a lab assessment against 127.0.0.1"
    >
      {/* window bar */}
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-border" />
          <i className="h-2.5 w-2.5 rounded-full bg-border" />
          <i className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">breachpilot · live run · lab</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border bg-background px-2 py-0.5 text-[11px] font-medium">
          <StatusDot tone="ok" />
          RUNNING
        </span>
      </div>

      <div className="grid sm:grid-cols-[1fr_1.1fr]">
        {/* left: target + stages */}
        <div className="border-b p-4 sm:border-b-0 sm:border-r">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Target</p>
          <p className="mt-1 flex items-center gap-2 font-mono text-sm">
            <Crosshair className="h-4 w-4 text-muted-foreground" aria-hidden />
            127.0.0.1 <span className="text-muted-foreground">· lab</span>
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 font-mono text-[11px]">
            <Lock className="h-3 w-3" aria-hidden /> allowlist: 127.0.0.1 · LOCKED
          </p>

          <ol className="mt-4 space-y-2">
            {[
              { label: "Recon", state: "done", note: "quick_scan · 4 ports" },
              { label: "Initial Access", state: "active", note: "hypothesis H-03 · testing" },
              { label: "Verify", state: "todo", note: "oracle probe queued" },
              { label: "Report", state: "todo", note: "evidence-linked draft" },
            ].map((s) => (
              <li key={s.label} className="flex items-center gap-2.5 text-sm">
                <StatusDot tone={s.state === "done" ? "ok" : s.state === "active" ? "warn" : "idle"} />
                <span className={s.state === "todo" ? "text-muted-foreground" : "font-medium"}>{s.label}</span>
                <span className="ml-auto hidden font-mono text-[11px] text-muted-foreground min-[400px]:block">{s.note}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* right: agent activity + evidence */}
        <div className="bg-grid-sm p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Activity className="h-3.5 w-3.5" aria-hidden /> Agent activity
          </p>
          <ul className="mt-2 space-y-1.5 font-mono text-[12px] leading-5">
            <li className="truncate rounded border bg-background px-2 py-1">
              <span className="text-muted-foreground">recon ›</span> run_full_recon → 443/http open
            </li>
            <li className="truncate rounded border bg-background px-2 py-1">
              <span className="text-muted-foreground">vuln ›</span> CVE-2024-xxxx ↔ web module (87/100)
            </li>
            <li className="truncate rounded border bg-background px-2 py-1">
              <span className="text-muted-foreground">critic ›</span> scope check PASS · in-allowlist
            </li>
            <li className="truncate rounded border bg-background px-2 py-1">
              <span className="text-muted-foreground">exploit ›</span> craft_exploit → attempt A-12
            </li>
          </ul>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <FileCheck2 className="h-3.5 w-3.5" aria-hidden /> Evidence
          </p>
          <ul className="mt-2 space-y-1.5 text-[12px]">
            <li className="flex items-center gap-2 rounded border bg-background px-2 py-1">
              <GitBranch className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              <span className="font-mono">H-03 PROBE</span>
              <span className="ml-auto rounded-full border px-1.5 py-px font-mono text-[10px]">CONFIRMED</span>
            </li>
            <li className="flex items-center gap-2 rounded border bg-background px-2 py-1">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              <span className="font-mono">audit chain · sha256</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">9f3a…c41d</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
