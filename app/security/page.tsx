import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowRight,
  FileCheck,
  HardDrive,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, SectionHeading, StatusDot } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/security", {
  title: "Security",
  description:
    "Found a vulnerability in BreachPilot? Report it privately via GitHub Security Advisories. Sandboxed execution, encrypted credential handling, and local-first design. Authorized testing only.",
});

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Private disclosure",
    body: "Report through GitHub private advisories. Details stay visible only to maintainers until a fix is ready — never a public issue.",
  },
  {
    icon: Lock,
    title: "Sandboxed execution",
    body: "Per-run disposable workers with default-DROP containment scoped to your allowlist. Sandbox failures fail closed.",
  },
  {
    icon: KeyRound,
    title: "Encrypted vault",
    body: "Recovered credentials are encrypted at rest and redacted before logs or reports. Secrets never sit in plaintext config.",
  },
  {
    icon: HardDrive,
    title: "Local-first",
    body: "Runs, evidence, and audit chains live on your machine behind a loopback-only console. No telemetry phones home.",
  },
];

const REPORT_STEPS = [
  {
    step: "01",
    title: "Use the private channel",
    body: "The repository publishes no dedicated security contact, so GitHub private vulnerability reporting is the front door. Only maintainers can see the details while a fix is prepared.",
  },
  {
    step: "02",
    title: "Include what matters",
    body: "What you found, which version or commit, lab-only reproduction steps, and the impact boundary — operator box, target scope, or audit integrity.",
  },
  {
    step: "03",
    title: "Give us time to fix",
    body: "Hold coordinated disclosure until a fix or mitigation ships. We triage privately, patch in the open, and credit reporters who want it.",
  },
];

const GUARANTEES = [
  {
    icon: Lock,
    title: "Sandbox isolation",
    body: "Each run executes in a disposable worker whose network containment authorizes only your effective target allowlist. Off-allowlist destinations are blocked at the tool layer, and a sandbox that cannot prove containment refuses to run.",
    limit: "A destination guard, not a complete sandbox — the operator-box filesystem is unrestricted by design. Run on a throwaway lab host.",
  },
  {
    icon: KeyRound,
    title: "Credential vault",
    body: "Looted credentials, hashes, and session tokens are encrypted at rest, handled as sensitive through the whole pipeline, and redacted from logs and reports by shape before anything is written out.",
    limit: "Redaction covers known secret shapes — treat all run output as sensitive until you have reviewed it.",
  },
  {
    icon: HardDrive,
    title: "Local-first data",
    body: `Runs, evidence, and the tamper-evident audit chain live on your machine, served through a loopback-only console at 127.0.0.1:${SITE.webuiDefaultPort}. Provider keys come from environment variables only and are never written into config files.`,
    limit: "Provider and plugin calls you configure still leave the box — review each integration before you enable it.",
  },
];

const STAYS_ON_BOX = [
  "Run plans, tool output, and evidence store",
  "Encrypted credential material and loot",
  "State-transition audit log and exploit timelines",
  "mission.yaml scope, budgets, and permission modes",
];

const LEAVES_ONLY_IF_YOU_SEND_IT = [
  "The advisory you file through GitHub private reporting",
  "Provider API calls to models you configured",
  "Outbound plugin traffic you enabled (e.g. status webhooks)",
  "Reports and evidence archives you choose to export",
];

export default function SecurityPage() {
  return (
    <div>
      <PageHero
        eyebrow="Security"
        title="Found a vulnerability? Tell us privately first."
        lede="BreachPilot ships offensive security tooling, so a flaw in BreachPilot itself carries real risk. Report it through private channels — never as a public issue — and give maintainers time to fix it before disclosing."
      >
        <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Security posture">
          <Badge>
            <StatusDot tone="ok" /> Private disclosure open
          </Badge>
          <Badge>
            <StatusDot tone="ok" /> Local-first · no telemetry
          </Badge>
          <Badge>
            <StatusDot tone="warn" /> Lab-only reproduction
          </Badge>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={`${SITE.repo}/security/advisories/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Report privately on GitHub <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center rounded-md border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Read the safety model
          </Link>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          {SITE.name} is {SITE.license}-licensed and local-first. Every control below is auditable in
          the repository — security enforced in the open.
        </p>
      </PageHero>

      <section aria-labelledby="pillars-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Trust at a glance"
          title="Disclosure, sandbox, vault, local-first"
          lede="Four commitments that cover the whole lifecycle: how you tell us, how runs are contained, how secrets are handled, and where your data lives."
          align="left"
        />
        <h2 id="pillars-heading" className="sr-only">
          Security pillars
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <Card key={pillar.title} className="h-full">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/60"
                aria-hidden
              >
                <pillar.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 font-semibold tracking-tight">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="report-heading" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="Coordinated disclosure"
            title="How to report"
            lede="Three steps, one private thread. No dedicated security inbox — the advisory channel below reaches maintainers directly."
            align="left"
          />
          <h2 id="report-heading" className="sr-only">
            How to report a vulnerability
          </h2>
          <ol className="mt-8 grid gap-4 lg:grid-cols-3">
            {REPORT_STEPS.map((item) => (
              <li key={item.step}>
                <Card className="h-full">
                  <p className="font-mono text-xs text-muted-foreground" aria-hidden>
                    {item.step}
                  </p>
                  <h3 className="mt-1 font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  {item.step === "01" ? (
                    <p className="mt-3 text-sm">
                      <a
                        href={`${SITE.repo}/security/advisories/new`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-4 hover:text-foreground"
                      >
                        Open a private advisory<span aria-hidden> →</span>
                      </a>
                    </p>
                  ) : null}
                </Card>
              </li>
            ))}
          </ol>
          <div
            role="note"
            aria-label="Authorized testing only"
            className="mt-6 rounded-xl border bg-card p-6 text-[15px] leading-7 sm:p-8"
          >
            <p className="flex gap-2">
              <ShieldAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden />
              <span>
                <strong>Stay in scope while reporting.</strong> Reproduce in a lab you control only.
                Only test systems you own or have explicit written permission to assess — the same
                authorization rule as the tool itself. Do not probe systems you don&rsquo;t own to
                prove impact.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="guarantees-heading" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="How BreachPilot protects you"
            title="Containment, secrets, and data — stated honestly"
            lede="Each guarantee names its limit next to the promise. A control you misunderstand is a control you will misuse."
            align="left"
          />
          <h2 id="guarantees-heading" className="sr-only">
            Sandbox, vault, and local-first guarantees
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {GUARANTEES.map((item) => (
              <Card key={item.title} className="flex h-full flex-col">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/60"
                  aria-hidden
                >
                  <item.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                <p className="mt-3 flex gap-2 border-t pt-3 text-[13px] leading-6 text-muted-foreground">
                  <AlertTriangle className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>
                    <span className="sr-only">Limitation: </span>
                    {item.limit}
                  </span>
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="data-heading" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="Data handling"
            title="What stays, what leaves"
            lede="Local-first means your assessment data never leaves the box unless you send it. This site follows the same rule: no analytics, no external scripts."
            align="left"
          />
          <h2 id="data-heading" className="sr-only">
            Data handling
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card className="h-full">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                Stays on your machine
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {STAYS_ON_BOX.map((item) => (
                  <li key={item} className="flex gap-2">
                    <StatusDot tone="ok" className="mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="h-full">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                Leaves only when you send it
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {LEAVES_ONLY_IF_YOU_SEND_IT.map((item) => (
                  <li key={item} className="flex gap-2">
                    <StatusDot tone="warn" className="mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            Review the full handling rules in the{" "}
            <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">
              privacy policy
            </Link>{" "}
            and the enforcement details in{" "}
            <Link
              href="/docs/safety-model"
              className="font-medium text-foreground underline underline-offset-4"
            >
              the safety model docs
            </Link>
            .
          </p>
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
              {
                t: "Safety model",
                b: "Scope checks, risk checks, permission modes, audit records, and the operator rules that hold the model together.",
                href: "/safety",
              },
              {
                t: "Sandbox docs",
                b: "Disposable worker architecture, network containment, fail-closed posture, and residual risks.",
                href: "/docs/sandbox",
              },
              {
                t: "Privacy policy",
                b: "What this site collects (nothing behavioral), what the tool stores locally, and how to ask questions.",
                href: "/privacy",
              },
            ].map((card) => (
              <Card key={card.href} className="flex h-full flex-col">
                <h3 className="font-semibold tracking-tight">{card.t}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{card.b}</p>
                <p className="mt-3 text-sm">
                  <Link
                    href={card.href}
                    aria-label={`Read ${card.t}`}
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

      <section aria-label="Authorized testing notice" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 rounded-xl border bg-card p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <ShieldAlert className="h-4 w-4" aria-hidden /> Built for authorized security testing
              </p>
              <blockquote className="mt-3 border-l-2 border-foreground pl-4 text-lg font-medium leading-8 tracking-tight">
                Only test systems you own or have explicit written permission to assess.
              </blockquote>
            </div>
            <div>
              <p className="text-sm leading-6 text-muted-foreground">
                Attack mode auto-approves in-scope actions — the safeties are the target-IP allowlist
                lock and the mission scope gate, with every action in a tamper-evident audit chain.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/safety"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Read the safety model
                </Link>
                <Link
                  href="/install"
                  className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Install for your lab
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
