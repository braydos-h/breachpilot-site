import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  KeyRound,
  Layers,
  Lock,
  Server,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, CodeSnippet, SectionHeading, StatusDot } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { PROVIDERS, SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/providers", {
  title: "AI Providers",
  description:
    "BreachPilot's provider-pluggable architecture: Ollama, OpenCode Go and ChatGPT behind one ModelClient contract, with role-based routing and optional embeddings.",
});

type ProviderMeta = {
  icon: typeof Server;
  badge: string;
  bestFor: string;
  highlights: string[];
};

const PROVIDER_META: Record<string, ProviderMeta> = {
  ollama: {
    icon: Server,
    badge: "Default · Local or Cloud",
    bestFor: "Local-first runs and air-gapped labs",
    highlights: ["Local daemon or Cloud endpoint", "Context-window translation built in", "Model catalog sync"],
  },
  opencode_go: {
    icon: Waypoints,
    badge: "Hosted · OpenAI-compatible",
    bestFor: "Strong reasoning over HTTPS",
    highlights: ["OpenAI Responses API", "Automatic model discovery", "Cached /models listing"],
  },
  chatgpt: {
    icon: Sparkles,
    badge: "Opt-in · Browser OAuth",
    bestFor: "Reusing an existing ChatGPT plan",
    highlights: ["Loopback OAuth proxy", "Tokens stay in OAuth store", "Existence-checked, never inlined"],
  },
};

function metaFor(id: string): ProviderMeta {
  return (
    PROVIDER_META[id] ?? {
      icon: Layers,
      badge: "Provider",
      bestFor: "Pluggable backend",
      highlights: [],
    }
  );
}

const ROUTING_ROWS = [
  {
    role: "Planning",
    does: "Breaks the authorized objective into scoped steps",
    note: "Benefits from the strongest reasoning model",
  },
  {
    role: "Exploitation",
    does: "Selects capabilities and drafts payloads for operator-approved targets",
    note: "Benefits from precise instruction following",
  },
  {
    role: "Peer consult",
    does: "Second opinion on findings and strategy",
    note: "Advisory only — no tools, no execution",
  },
  {
    role: "Titling",
    does: "Names runs, steps, and report sections",
    note: "A small fast model is plenty",
  },
] as const;

export default function ProvidersPage() {
  return (
    <div>
      <PageHero
        eyebrow="AI providers"
        title="One contract. Any backend. You choose where inference runs."
        lede="Every chat and generate call goes through the ModelClient contract and a provider registry. Engine code never talks to a vendor SDK — swap Ollama, OpenCode Go, or ChatGPT in config and your runs, memory, and reports keep working unchanged."
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge>
            <StatusDot tone="ok" />
            {PROVIDERS.length} backends · one contract
          </Badge>
          <Badge>Keys in env only</Badge>
          <Badge>Local embeddings optional</Badge>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/docs/providers"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Configure a provider <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden /> Safety model
          </Link>
          <Link
            href="/docs/provider-development"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Build your own adapter
          </Link>
        </div>
        <div
          className="mt-6 flex max-w-2xl items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/[0.04] px-3.5 py-3"
          role="note"
          aria-label="Authorized testing only"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
          <p className="text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Authorized testing only.</span> Only run
            BreachPilot against systems you own or have explicit written permission to assess.
          </p>
        </div>
      </PageHero>

      {/* Provider catalog */}
      <section aria-labelledby="catalog-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow={`${PROVIDERS.length} backends · one contract`}
          title="Provider catalog"
          lede="Pick the backend that fits your lab. Each card shows the config keys it reads and where its secret lives — always the environment, never the config file."
          align="left"
        />
        <ul className="mt-8 grid gap-4 lg:grid-cols-3" aria-label="Supported AI providers">
          {PROVIDERS.map((p) => {
            const meta = metaFor(p.id);
            const Icon = meta.icon;
            return (
              <li key={p.id} className="h-full">
                <Card className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/60">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="rounded-full border bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {meta.badge}
                    </span>
                  </div>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {p.id}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.desc}</p>
                  <p className="mt-3 text-[13px] font-medium">{meta.bestFor}</p>
                  <ul className="mt-2 space-y-1.5">
                    {meta.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                        <span className="leading-6">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-2 border-t pt-4">
                    <div className="rounded-md bg-muted/60 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Config
                      </p>
                      <p className="mt-1 break-words font-mono text-[12px] leading-5">{p.config}</p>
                    </div>
                    <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/[0.07] px-3 py-2">
                      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                          Auth · env only
                        </p>
                        <p className="mt-0.5 break-words font-mono text-[12px] leading-5 text-muted-foreground">
                          {p.auth}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      {/* How it fits together */}
      <section aria-labelledby="contract-heading" className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="Architecture"
            title="Your run never touches a vendor SDK"
            lede="Every backend behavior lives inside its adapter. The planner, swarm, and memory layers only ever see one stable interface — so a provider swap is a config change, not a code change."
            align="left"
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-3" aria-label="How provider calls flow">
            {[
              {
                step: "1",
                title: "Run asks for a role",
                body: "Planning, exploit drafting, peer consult, or titling requests a named role — not a vendor.",
              },
              {
                step: "2",
                title: "Router resolves the client",
                body: "The model router maps each alias to a registered ModelClient built from your config.",
              },
              {
                step: "3",
                title: "Adapter translates",
                body: "The adapter handles context windows, endpoints, and model discovery for its backend.",
              },
            ].map((s) => (
              <li key={s.step}>
                <Card className="h-full">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Step {s.step}
                  </p>
                  <h3 className="mt-2 text-base font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.body}</p>
                </Card>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Waypoints className="h-4 w-4" aria-hidden /> Role-based routing
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Run planning on your strongest model, titling on the cheapest, and peer consult on a
                different family for a genuine second opinion. Consulted models receive no tool
                schemas and cannot execute anything.
              </p>
            </Card>
            <Card>
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Layers className="h-4 w-4" aria-hidden /> Embeddings stay local and optional
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Semantic memory and skill matching embed over a local model on your own host by
                default. Disable embeddings entirely to fall back to keyword storage — zero network,
                zero secret reads.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Role table */}
      <section aria-labelledby="roles-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Routing"
          title="Give each job the right brain"
          lede="One provider for everything works. Splitting roles across models works better — and peer consult stays safely advisory either way."
          align="left"
        />
        <div
          className="mt-8 overflow-x-auto rounded-lg border"
          role="region"
          aria-label="Model roles and their behavior"
          tabIndex={0}
        >
          <table className="w-full min-w-[560px] border-collapse bg-card text-left">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">What it does</th>
                <th scope="col" className="px-4 py-3">Tip</th>
              </tr>
            </thead>
            <tbody>
              {ROUTING_ROWS.map((r) => (
                <tr key={r.role}>
                  <th scope="row" className="px-4 py-3 text-sm font-semibold">
                    {r.role}
                  </th>
                  <td className="px-4 py-3 text-sm leading-6 text-muted-foreground">{r.does}</td>
                  <td className="px-4 py-3 text-sm leading-6 text-muted-foreground">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Auth + setup */}
      <section aria-labelledby="setup-heading" className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="Secrets"
            title="Secrets live in the environment. Full stop."
            lede="Config files are shareable, diffable, and committable — so they must never contain a key. Each provider declares which variable it reads, and BreachPilot refuses to accept secrets any other way."
            align="left"
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card>
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <KeyRound className="h-4 w-4" aria-hidden /> The rule, on every provider
              </h3>
              <ul className="mt-3 space-y-2.5">
                {PROVIDERS.map((p) => (
                  <li key={p.id} className="flex items-start gap-2 text-sm leading-6">
                    <Lock
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400"
                      aria-hidden
                    />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{p.name}:</span>{" "}
                      <span className="break-words font-mono text-[12px]">{p.auth}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t pt-3 text-sm leading-6 text-muted-foreground">
                If a key ever lands in a config file, log, or shared snippet by mistake — rotate it.
                Treat the config as public.
              </p>
            </Card>
            <div>
              <CodeSnippet
                title="config.yaml — provider selection"
                code={`models:\n  provider: opencode_go   # ollama | opencode_go | chatgpt\nproviders:\n  opencode_go:\n    api_key_env: OPENCODE_GO_API_KEY   # env-only, never in config`}
              />
              <ol className="mt-4 space-y-2.5" aria-label="Setup steps">
                {[
                  "Export the key in your shell — never paste it into config.yaml.",
                  "Set models.provider to the backend you want for this lab.",
                  "Restart the run and confirm the router resolves each role.",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-xs font-semibold text-foreground"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Full reference:{" "}
            <Link href="/docs/providers" className="font-medium text-foreground underline underline-offset-4">
              providers
            </Link>{" "}
            ·{" "}
            <Link
              href="/docs/provider-development"
              className="font-medium text-foreground underline underline-offset-4"
            >
              provider development
            </Link>{" "}
            ·{" "}
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-4"
            >
              GitHub
            </a>
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section aria-labelledby="cta-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="cta-heading" className="text-xl font-semibold tracking-tight">
              Start local, scale to hosted when you need it
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Begin on a local backend for authorized lab work, then point the same contract at a
              hosted model for harder targets — always within scope, always operator supervised.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/docs/providers"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Read the provider docs <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/safety"
              className="inline-flex rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Safety model
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
