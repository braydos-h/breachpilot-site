import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  FileCheck,
  Filter,
  Gauge,
  KeyRound,
  Lock,
  Route,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, CodeSnippet, SectionHeading, StatusDot } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/safety", {
  title: "Safety",
  description:
    "BreachPilot safety model: operator supervision, target allowlist lock, mission scope gate, permission modes, sandbox isolation, tamper-evident audit chain. Authorized testing only.",
});

type Layer = {
  icon: typeof Lock;
  title: string;
  body: string;
  limit: string;
};

const LAYERS: Layer[] = [
  {
    icon: Lock,
    title: "Disposable execution sandbox",
    body: "Hardened per-run container with default-DROP network containment that authorizes only the effective target allowlist. Sandbox failures fail closed.",
    limit: "Not a complete sandbox. The operator-box filesystem is unrestricted by design.",
  },
  {
    icon: ScrollText,
    title: "Mission authorization",
    body: "mission.yaml lists allowed and disallowed assets, forbidden actions, rate limits, testing modes, and risk profile before anything runs.",
    limit: "A declaration, not a detector. It only protects what you wrote down accurately.",
  },
  {
    icon: Filter,
    title: "Scope gate",
    body: "Exact domains, wildcards, IPs, CIDRs, explicit denies, forbidden action types, third-party detection, and per-target rate limits.",
    limit: "Denies with a SCOPE_DENIED audit row. It cannot judge whether your scope itself was authorized.",
  },
  {
    icon: Gauge,
    title: "Risk + budget enforcement",
    body: "Action risk classification with per-session command budgets and human approval required for high-risk actions.",
    limit: "Budgets cap volume, not intent. An approved budget spent in-scope is still spent.",
  },
  {
    icon: Route,
    title: "Tool routing controls",
    body: "Controls which tools may run, where outputs land, and how secrets get redacted before they reach logs or reports.",
    limit: "Redaction covers known secret shapes. Treat all output as sensitive until reviewed.",
  },
  {
    icon: KeyRound,
    title: "Exploit permission modes",
    body: "read_only proposes recon only · approve_only pauses for operator approval with denials audited · full_access is lab attack posture.",
    limit: "Modes relax approvals, never the target allowlist or scope gate.",
  },
  {
    icon: Eye,
    title: "OPSEC advisory layer",
    body: "Target-aware pacing and noise suggestions to help you stay quiet during authorized engagements.",
    limit: "Advisory only, never a gate. The command always executes.",
  },
  {
    icon: FileCheck,
    title: "Audit + evidence",
    body: "Evidence store, state-transition audit log, exploit-session timelines, and encrypted credential handling.",
    limit: "Tamper-evident, not tamper-proof. Export and protect the chain yourself.",
  },
];

const OPERATOR_RULES: Array<{ title: string; body: string }> = [
  {
    title: "Written permission first",
    body: "A signed scope, a testing window, and named contacts. Verbal approval does not count. Without a scope document, there is no run.",
  },
  {
    title: "Your lab first",
    body: "Prove every new workflow against systems you own (a throwaway lab box on an isolated network) before any client engagement.",
  },
  {
    title: "Least privilege always",
    body: "Start in read_only, move up to approve_only, and save full_access for disposable lab targets. Never lead with the strongest mode.",
  },
  {
    title: "Watch the run",
    body: "Operator supervision is part of the safety model. Budgets and approvals assume a human is present, reading output, ready to stop.",
  },
  {
    title: "Protect the evidence",
    body: "Findings contain live credentials and exploitable detail. Encrypt, limit distribution, and retain only as long as the engagement requires.",
  },
  {
    title: "Stop and disclose on drift",
    body: "Out-of-scope host, third-party asset, production impact, or unexpected egress: halt, preserve the audit chain, and notify the asset owner.",
  },
];

const RESIDUAL_RISKS: Array<[string, string]> = [
  ["In-scope destruction is allowed", "In full_access there is no command-content inspection. Against an authorized target, wiping data or dropping shells is working as configured."],
  ["Scope text is trusted", "A typo in an allow rule or CIDR can widen the blast radius. Review mission.yaml in diff form before every run."],
  ["The lab box is expendable", "Assume the operator filesystem can be changed by any run. Never point BreachPilot at a workstation you care about."],
];

export default function SafetyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Safety model"
        title="Built for authorized security testing."
        lede="Layered controls with honest language about what each layer does and what it cannot do. The attack path is unrestricted but target-locked, and recon stays fully gated."
      >
        <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Enforcement status">
          <Badge>
            <StatusDot tone="ok" /> Scope gate enforced
          </Badge>
          <Badge>
            <StatusDot tone="ok" /> Allowlist lock enforced
          </Badge>
          <Badge>
            <StatusDot tone="warn" /> OPSEC advisory only
          </Badge>
        </div>
        <blockquote className="mt-6 max-w-2xl border-l-2 border-foreground pl-4 text-lg font-medium leading-8 tracking-tight">
          Only test systems you own or have explicit written permission to assess.
        </blockquote>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/docs/safety-model"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Read the safety model <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/install"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Install for your lab
          </Link>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          {SITE.name} is {SITE.license}-licensed and local-first. Safety is enforced in the open. Every control below
          is auditable in the repository.
        </p>
      </PageHero>

      <section aria-labelledby="layers-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="The layers"
          title={`${LAYERS.length} controls, no single point of trust`}
          lede="Each layer narrows what the agent may do. Scope, risk, routing, and audit must all agree before a target-touching action runs."
          align="left"
        />
        <div id="layers-heading" className="sr-only">
          Safety layers
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {LAYERS.map((layer, i) => (
            <li key={layer.title}>
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/60"
                    aria-hidden
                  >
                    <layer.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-semibold tracking-tight">{layer.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{layer.body}</p>
                <p className="mt-3 flex gap-2 border-t pt-3 text-[13px] leading-6 text-muted-foreground">
                  <AlertTriangle className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>
                    <span className="sr-only">Limitation: </span>
                    {layer.limit}
                  </span>
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="full-access-heading" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="Full-access mode"
            title="Attack posture, stated plainly"
            lede="For authorized lab targets only. Approvals relax here. The destination guard and the scope gate do not."
            align="left"
          />
          <h2 id="full-access-heading" className="sr-only">
            Full-access mode details
          </h2>
          <div className="mt-8 rounded-xl border border-destructive/30 bg-card p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-destructive">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Lab only, never against third parties
            </p>
            <p className="mt-4 text-[15px] leading-7">
              In <code className="rounded border bg-muted px-1.5 font-mono text-sm">full_access</code>, the policy
              auto-approves every in-scope action <strong>with no command-content inspection</strong>. Destructive
              commands, egress, reverse shells, credential dumping, Metasploit and Python write/run are all allowed
              against authorized targets. The two safeties that remain:
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-[15px] leading-7">
              <li>
                <strong>The target-IP allowlist lock</strong>, enforced at the MCP tool layer. Every destination is
                extracted from every command (URL authorities, /dev/tcp hosts, LHOST/RHOST, scanner targets, bare
                IPs, hostnames, Python script bodies, MSF RHOSTS and pivot hosts). Anything off-allowlist is{" "}
                <code className="rounded border bg-muted px-1.5 font-mono text-sm">BLOCKED</code>. It is a destination
                guard, <strong>not a complete sandbox</strong>.
              </li>
              <li>
                <strong>The mission scope gate</strong>. Tools mapped to forbidden-action categories, or assets
                outside allow rules / inside disallowed assets, are denied with a{" "}
                <code className="rounded border bg-muted px-1.5 font-mono text-sm">SCOPE_DENIED</code> audit row.
              </li>
            </ol>
            <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
              The operator-box filesystem is unrestricted by design, so run on a throwaway lab box. Every target-touching
              action, denial, and scope event lands in the tamper-evident SHA-256 audit chain.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <CodeSnippet
              title="mission.yaml, scope first"
              lang="yaml"
              code={`mission:
  name: "authorized-lab-assessment"
targets:
  allowed: ["lab-target.example", "192.0.2.0/28"]
  disallowed: ["*.customer-prod.example"]
forbidden_actions: ["data-destruction-outside-lab", "third-party-pivot"]
risk_profile: "lab"
permission_mode: "approve_only  # graduate to full_access only on throwaway hosts"`}
            />
            <Card>
              <h3 className="font-semibold tracking-tight">How to read this example</h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  Allowed targets use documentation ranges. Replace with your own authorized scope.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  Disallowed entries and forbidden actions deny first, even when an allow rule would match.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  approve_only keeps a human on every sensitive action; the denial itself becomes evidence.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section aria-labelledby="operator-heading" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="Scope · risk · policy"
            title="The operator is a safety layer"
            lede="BreachPilot assumes a supervised run: written authorization, reviewed scope, a present human, and protected evidence. Skip any of these and the model breaks down."
            align="left"
          />
          <h2 id="operator-heading" className="sr-only">
            Operator responsibilities
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OPERATOR_RULES.map((rule) => (
              <Card key={rule.title} className="h-full">
                <h3 className="font-semibold tracking-tight">{rule.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{rule.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="residual-heading" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="Honest limits"
            title="What safety does not cover"
            lede="No tool can authorize your test for you. The operator carries these residual risks on every run."
            align="left"
          />
          <h2 id="residual-heading" className="sr-only">
            Residual risks
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {RESIDUAL_RISKS.map(([title, body]) => (
              <Card key={title} className="border-destructive/25">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden /> {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </Card>
            ))}
          </div>
          <div
            role="note"
            aria-label="Authorized testing only"
            className="mt-8 rounded-xl border bg-card p-6 text-[15px] leading-7 sm:p-8"
          >
            <p>
              <strong>Authorized testing only.</strong> Only test systems you own or have explicit written permission
              to assess. If you discover an out-of-scope vulnerability, stop, preserve the audit chain, and disclose
              to the asset owner. Do not verify further without fresh authorization. Misuse reports:{" "}
              <a
                href={`${SITE.repo}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                {SITE.repo}/issues
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="reading-heading" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading eyebrow="Further reading" title="What to read next" align="left" />
          <h2 id="reading-heading" className="sr-only">
            Further reading
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Safety model", "Scope checks, risk checks, permission modes, audit records, secure dev rules.", "/docs/safety-model"],
              ["Sandbox", "Disposable worker architecture, network containment, fail-closed posture, residual risks.", "/docs/sandbox"],
              ["Outcomes & evidence", "Outcome taxonomy, truth-vs-claim, finding verification, report generation.", "/docs/outcome-evidence"],
            ].map(([t, b, href]) => (
              <Card key={href} className="flex h-full flex-col">
                <h3 className="font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{b}</p>
                <p className="mt-3 text-sm">
                  <Link
                    href={href}
                    aria-label={`Read the ${t} docs`}
                    className="font-medium underline underline-offset-4 hover:text-foreground"
                  >
                    Read<span aria-hidden> →</span>
                  </Link>
                </p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Full source:{" "}
            <a
              href={`${SITE.repo}/blob/main/docs/safety-model.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4"
            >
              docs/safety-model.md
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
