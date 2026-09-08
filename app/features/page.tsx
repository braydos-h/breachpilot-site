import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, SectionHeading } from "@/components/ui";
import { META } from "@/lib/meta";
import { routeMetadata } from "@/lib/metadata";

export const metadata: Metadata = routeMetadata("/features", {
  title: "Features",
  description:
    "BreachPilot capabilities: reconnaissance, execution and chaining, adaptive intelligence and evidence-backed reporting.",
});

/** Pipeline overview strip — CSS-only anchors into the four groups below. */
const OVERVIEW = [
  { href: "#recon", step: "Reconnaissance", sub: "Discover" },
  { href: "#execution", step: "Execution", sub: "Chain" },
  { href: "#intelligence", step: "Intelligence", sub: "Learn" },
  { href: "#reporting", step: "Reporting", sub: "Prove" },
];

function Group({ id, eyebrow, title, lede, children, tint = false }: { id: string; eyebrow: string; title: string; lede?: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <section id={id} aria-label={title} className={tint ? "border-t bg-muted/30" : "border-t"}>
      <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} align="left" />
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

const RECON: Array<[string, string, string]> = [
  ["Parallel discovery", "Concurrent TCP + service/OS fingerprint, cached per run.", "quick_scan · run_full_recon"],
  ["Nmap workflows", "Sweep → triage → service → vuln, with priv_fallback.", "pre-flight reachability probes"],
  ["Depth enumerators", "UDP top-ports, SNMP, WAF, vhost, cloud-metadata.", "dns_recon · vhost_enum · AXFR"],
  ["Intel enrichment", "NVD + EPSS + CISA KEV + OSV + GHSA, rate-limited.", "circuit-breaker research tools"],
];

const EXECUTION: Array<[string, string, string]> = [
  [`${META.attackFamilies ?? 15} module families`, "Web, auth, JWT, SMB, privesc, AD, ICS/IoT, supply-chain.", "run_attack_module · 0–100 scoring"],
  ["Prerequisite chaining", "Modules declare requires/produces; planner composes.", "find_producers · phase hints"],
  ["Payloads + bridges", "Crafter/mutator, Metasploit lifecycle, web scanners.", "msfvenom · nuclei · sqlmap"],
  ["Post-exploitation, in scope", "Encrypted vault, Impacket lateral, Kerberoast, cracking.", "hashcat/john · BloodHound CE"],
];

const INTEL: Array<[string, string, string]> = [
  ["Advisory skill pick", "Deterministic tags + lexical + Bayesian feedback.", "top skills per context"],
  ["Campaign memory", "SemanticMemory + ExperienceStore, per-attempt compaction.", "lessons survive runs"],
  ["Telemetry + peer consult", "Tokens/context per call; advisory second opinions.", "consult_peer_models · gated"],
];

const REPORTING: Array<string> = [
  "Findings with timeline, CVSS, chain, and linked evidence",
  "Markdown + HTML reports with decision log and audit chain",
  "MITRE ATT&CK Navigator export + ticket creation",
  "Oracle-verified outcomes — verified ≠ claimed",
];

export default function FeaturesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Capabilities"
        title="Full assessment lifecycle, under supervision"
        lede="Recon, target-locked execution, adaptive intelligence, and evidence-backed reporting — for authorized testing only. Capability overview, not a how-to."
      >
        <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Capability overview">
          {OVERVIEW.map((o) => (
            <li key={o.href} className="min-w-0">
              <a
                href={o.href}
                className="block min-w-0 rounded-lg border bg-background px-4 py-3 transition-colors hover:bg-muted"
              >
                <span className="block text-sm font-semibold">{o.step}</span>
                <span className="mt-0.5 block font-mono text-xs text-muted-foreground">{o.sub}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/install"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Install for your lab
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Read the safety model
          </Link>
        </div>
        <p className="mt-4 flex items-start gap-1.5 text-sm text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            Authorized testing only — only test systems you own or have explicit written permission to assess.
          </span>
        </p>
      </PageHero>

      <Group
        id="recon"
        eyebrow="Reconnaissance"
        title="See the whole surface first"
        lede="Parallel discovery against allowlisted targets — cached per run, enriched with vuln intel."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RECON.map(([t, b, proof]) => (
            <Card key={t}>
              <h3 className="font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">{proof}</p>
            </Card>
          ))}
        </div>
      </Group>

      <Group
        id="execution"
        eyebrow="Execution"
        title="Capability-aware, target-locked"
        lede="Modules, payloads, and bridges compose into chains against explicitly authorized targets."
        tint
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXECUTION.map(([t, b, proof]) => (
            <Card key={t}>
              <h3 className="font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">{proof}</p>
            </Card>
          ))}
        </div>
        <div className="mt-4 rounded-lg border bg-card p-4 text-sm leading-6 text-muted-foreground">
          <span className="font-semibold text-foreground">Guardrail: </span>
          lab targets (RFC1918/loopback) run relaxed; public targets get pacing, jitter, and noise
          accounting — advisory only, the operator always sees the advice. Every action stays
          target-locked to explicitly authorized scope.{" "}
          <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">
            Safety model
          </Link>
        </div>
      </Group>

      <Group
        id="intelligence"
        eyebrow="Intelligence"
        title="Sharper across missions"
        lede="Skills, memory and telemetry turn each run into training data — advisory only, never a bypass."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {INTEL.map(([t, b, proof]) => (
            <Card key={t}>
              <h3 className="font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">{proof}</p>
            </Card>
          ))}
        </div>
      </Group>

      <Group
        id="reporting"
        eyebrow="Reporting"
        title="Evidence-backed, export-ready"
        tint
      >
        <ul className="grid gap-2 text-sm leading-6 sm:grid-cols-2">
          {REPORTING.map((item) => (
            <li key={item} className="rounded-lg border bg-card px-4 py-3 text-foreground">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          <Link href="/benchmarks" className="font-medium underline underline-offset-4">
            See how outcomes are verified →
          </Link>
        </p>
      </Group>
    </div>
  );
}
