import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Safety",
  description:
    "BreachPilot safety model: operator supervision, target allowlist lock, mission scope gate, permission modes, sandbox isolation, tamper-evident audit chain. Authorized testing only.",
  alternates: { canonical: "https://breachpilot.dev/safety" },
};

const LAYERS: Array<[string, string]> = [
  ["Disposable execution sandbox", "The isolation boundary: hardened per-run container, default-DROP network containment authorizing only the effective target allowlist. Sandbox failures fail closed — host execution is never an automatic fallback."],
  ["Mission authorization", "mission.yaml declares allowed / disallowed assets, forbidden actions, rate limits, testing modes and risk profile."],
  ["Scope gate", "Answers whether an action may touch a target: exact domains, wildcards, IPs, CIDRs, explicit denies, forbidden action types, third-party detection, per-target rate limits."],
  ["Risk + budget enforcement", "Action risk classification, per-session command budgets and human-approval requirements for high-risk actions."],
  ["Tool routing controls", "Which tools may run, where outputs land, how secrets are redacted."],
  ["Exploit permission modes", "read_only (propose-only recon) · approve_only (operator approves sensitive actions, denials audited) · full_access (lab attack posture — see below)."],
  ["OPSEC advisory layer", "Target-aware, advisory-only — pacing and noise suggestions, never a gate. The command always executes."],
  ["Audit + evidence", "Evidence store, state-transition audit log, exploit-session timelines, encrypted credential handling."],
];

export default function SafetyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Safety model"
        title="Built for authorized security testing."
        lede="Layered controls, not a single switch — and honest language about what each layer does and doesn't do. The attack path is unrestricted but target-locked; recon stays fully gated."
      >
        <blockquote className="mt-6 max-w-2xl border-l-2 border-foreground pl-4 text-lg font-medium leading-8 tracking-tight">
          Only test systems you own or have explicit written permission to assess.
        </blockquote>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">The layers</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {LAYERS.map(([t, b]) => (
            <Card key={t}>
              <h3 className="font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Attack / full-access mode, stated plainly</h2>
          <div className="mt-4 rounded-xl border bg-card p-6">
            <p className="text-[15px] leading-7">
              In <code className="rounded border bg-muted px-1.5 font-mono text-sm">full_access</code>, the policy
              auto-approves every in-scope action <strong>with no command-content inspection</strong> — destructive
              commands, egress, reverse shells, credential dumping, Metasploit and Python write/run are all allowed
              against authorized targets. The two safeties that remain:
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-[15px] leading-7">
              <li>
                <strong>The target-IP allowlist lock</strong> — enforced at the MCP tool layer. Every destination is
                extracted from every command (URL authorities, /dev/tcp hosts, LHOST/RHOST, scanner targets, bare
                IPs, hostnames, Python script bodies, MSF RHOSTS and pivot hosts). Anything off-allowlist is{" "}
                <code className="rounded border bg-muted px-1.5 font-mono text-sm">BLOCKED</code>. It is a destination
                guard, <strong>not a complete sandbox</strong>.
              </li>
              <li>
                <strong>The mission scope gate</strong> — tools mapped to forbidden-action categories, or assets
                outside allow rules / inside disallowed assets, are denied with a{" "}
                <code className="rounded border bg-muted px-1.5 font-mono text-sm">SCOPE_DENIED</code> audit row.
              </li>
            </ol>
            <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
              The operator-box filesystem is unrestricted by design — run on a throwaway lab box. Every target-touching
              action, denial and scope event lands in the tamper-evident SHA-256 audit chain.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">What to read next</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            ["Safety model", "Scope checks, risk checks, permission modes, audit records, secure dev rules.", "/docs/safety-model"],
            ["Sandbox", "Disposable worker architecture, network containment, fail-closed posture, residual risks.", "/docs/sandbox"],
            ["Outcomes & evidence", "Outcome taxonomy, truth-vs-claim, finding verification, report generation.", "/docs/outcome-evidence"],
          ].map(([t, b, href]) => (
            <Card key={href}>
              <h3 className="font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
              <p className="mt-3 text-sm">
                <Link href={href} className="font-medium underline underline-offset-4">Read →</Link>
              </p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Full source: <a href="https://github.com/braydos-h/BreachPilot/blob/main/docs/safety-model.md" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">docs/safety-model.md</a>
        </p>
      </section>
    </div>
  );
}
