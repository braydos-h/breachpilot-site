import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, CodeSnippet, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Features",
  description:
    "BreachPilot capabilities: reconnaissance, exploitation and chaining, adaptive intelligence, post-exploitation workflow, operational security and evidence-backed reporting.",
  alternates: { canonical: "https://breachpilot.dev/features" },
};

function Group({ id, eyebrow, title, lede, children }: { id: string; eyebrow: string; title: string; lede?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-label={title} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
      <SectionHeading eyebrow={eyebrow} title={title} lede={lede} align="left" />
      <div className="mt-8">{children}</div>
    </section>
  );
}

const RECON: Array<[string, string]> = [
  ["Parallel TCP discovery", "Concurrent port discovery with service fingerprinting and OS detection, cached per run."],
  ["Nmap workflows", "Ping sweep → triage → service → vuln scans, with priv_fallback auto-downgrade and pre-flight reachability probes."],
  ["Extended enumerators", "UDP top-ports, SNMP, cloud metadata probe, WAF fingerprinting and vhost discovery."],
  ["DNS depth", "Zone-transfer checks, DNSSEC, SPF / DMARC, ASN and WHOIS enrichment."],
  ["Domain recon", "resolve_domain, enumerate_subdomains, dns_recon (AXFR / DNSSEC), vhost_enum (Host-header rotation) and domain_whois — all allowlist-gated."],
  ["Threat intel", "NVD + EPSS + CISA KEV + OSV + GHSA with circuit breaker, rate limiting and GitHub token support for PoC search."],
];

const EXPLOIT: Array<[string, string]> = [
  ["15 attack-module families", "web, auth_creds, crypto_jwt, deserialize, network_smb, privesc, services, ssh, synthesis, supply_chain, persistence, ad, ics_iot, detection and orchestrator_phases."],
  ["Applicability scoring", "Each module scores itself 0–100 against the target's services, ports and CVEs; experience-aware ranking learns across runs."],
  ["Prerequisite modeling", "Modules declare requires / produces / read_only / cost / phase_hint, so the planner composes prerequisites dynamically via find_producers."],
  ["Payload crafting + mutation", "PayloadCrafter and ExploitMutator with parameter-tweak, encoding-change, delivery-swap and context-aware strategies."],
  ["Metasploit bridge", "run_msf_module, msfconsole lifecycle, msfvenom payload generation, session / post-module orchestration and resource scripts."],
  ["Web assessment tooling", "nikto, nuclei, sqlmap, gobuster, feroxbuster, whatweb and wpscan — argv-list execution, which-checked, parsed result blocks."],
];

const ADAPTIVE: Array<[string, string]> = [
  ["Advisory skill selection", "Deterministic tags + lexical search + cross-mission Bayesian feedback pick the top skills for the current context."],
  ["Semantic matching", "Cosine similarity over nomic-embed-text embeddings, with graceful fallback to deterministic matching."],
  ["Cross-mission memory", "SemanticMemoryManager + ExperienceStore persist lessons from every confirmed win."],
  ["Attack memory", "Per-attempt context management with periodic compaction and persistent campaign state."],
  ["Telemetry", "Token counts, context utilization, duration and tokens/sec for every LLM call."],
  ["Peer-model consultation", "Optional advisory second opinions from configured model aliases — no tool access, still gated by policy."],
];

export default function FeaturesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Capabilities"
        title="What BreachPilot can do"
        lede="A product-capabilities overview sourced from the repository — recon, exploitation, adaptive intelligence, post-exploitation, OPSEC and reporting. Capability, not a how-to."
      >
        <nav aria-label="Capability sections" className="mt-6 flex flex-wrap gap-2">
          {[
            ["recon", "Recon"],
            ["exploit", "Exploitation"],
            ["adaptive", "Adaptive intel"],
            ["post", "Post-exploitation"],
            ["opsec", "OPSEC"],
            ["reporting", "Reporting"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted">
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      <Group id="recon" eyebrow="01 · Reconnaissance" title="See the whole surface first">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECON.map(([t, b]) => (
            <Card key={t}>
              <h3 className="font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
            </Card>
          ))}
        </div>
      </Group>

      <div className="border-t bg-muted/30">
        <Group
          id="exploit"
          eyebrow="02 · Exploitation and chaining"
          title="Capability-aware, prerequisite-driven"
          lede="Modules, payloads and bridges compose into chains against in-scope targets. Planning is capability-aware; execution stays target-locked and audited."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPLOIT.map(([t, b]) => (
              <Card key={t}>
                <h3 className="font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
              </Card>
            ))}
          </div>
        </Group>
      </div>

      <Group
        id="adaptive"
        eyebrow="03 · Adaptive intelligence"
        title="It gets sharper across missions"
        lede="Skills, memory and telemetry turn each run into training data for the next — advisory only, never a bypass around scope or policy."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADAPTIVE.map(([t, b]) => (
            <Card key={t}>
              <h3 className="font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
            </Card>
          ))}
        </div>
      </Group>

      <div className="border-t bg-muted/30">
        <Group
          id="post"
          eyebrow="04 · Post-exploitation workflow"
          title="Credentials, loot, lateral targets"
          lede="Encrypted credential vault, Impacket-based lateral execution, Kerberoast and hash cracking (hashcat / john with auto hash-type identification), operator connections with beacon health, and Active Directory tooling including BloodHound CE — all against allowlisted targets, all audited."
        >
          <CodeSnippet
            code={`bp --target 127.0.0.1 --mode attack --goal backdoor\n# loot + credentials land in the run's encrypted store,\n# lateral targets stay inside the same allowlist lock.`}
            title="Post-exploitation stays in scope"
          />
        </Group>
      </div>

      <Group
        id="opsec"
        eyebrow="05 · Operational security"
        title="Target-aware, advisory — never a gate"
        lede="On private / lab targets the posture relaxes automatically so the agent moves freely; on public targets it applies pacing with jitter, rate limits, user-agent rotation, DNS-over-HTTPS, quiet-command rewrites and a noise budget. OPSEC_ADVISORY blocks suggest quieter alternatives — the command always executes, the operator always sees the advice."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="font-semibold tracking-tight">Lab targets</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              RFC1918, loopback, link-local and configured local CIDRs resolve to a relaxed profile. Your lab, full speed.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold tracking-tight">Public targets</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Configured posture stays on: pacing, jitter, rotation and noise accounting with per-command advisories.
            </p>
          </Card>
        </div>
      </Group>

      <div className="border-t bg-muted/30">
        <Group
          id="reporting"
          eyebrow="06 · Reporting"
          title="Evidence-backed, export-ready"
          lede="Findings with timelines, CVSS, exploit chains and linked evidence — rendered to Markdown and HTML, with decision logs, the tamper-evident audit chain, loot and credential tables, graph evidence, MITRE ATT&CK Navigator export and ticket creation for confirmed findings."
        >
          <p className="text-sm">
            <Link href="/benchmarks" className="font-medium underline underline-offset-4">
              See how outcomes are verified →
            </Link>
          </p>
        </Group>
      </div>
    </div>
  );
}
