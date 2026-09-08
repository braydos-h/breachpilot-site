import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, CodeSnippet, SectionHeading } from "@/components/ui";
import { PROVIDERS, SITE } from "@/lib/site";
import { routeMetadata } from "@/lib/metadata";

export const metadata: Metadata = routeMetadata("/providers", {
  title: "AI Providers",
  description:
    "BreachPilot's provider-pluggable architecture: Ollama, OpenCode Go and ChatGPT behind one ModelClient contract, with role-based routing and optional embeddings.",
});

export default function ProvidersPage() {
  return (
    <div>
      <PageHero
        eyebrow="AI providers"
        title="One contract, any backend"
        lede="Chat and generate go through a provider registry — every backend behavior lives inside its adapter, and engine code only ever sees the canonical ModelClient contract. Ollama is one optional provider, not the internal protocol."
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/docs/providers"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Configure a provider →
          </Link>
          <Link
            href="/safety"
            className="inline-flex rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Safety model
          </Link>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          For authorized testing only — only run BreachPilot against systems you own or have explicit written
          permission to assess.
        </p>
      </PageHero>
      <section aria-label="Provider catalog" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow={`${PROVIDERS.length} backends · one contract`}
          title="Provider catalog"
          lede="Swap backends without touching engine code. Keys stay in the environment — never in config."
          align="left"
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROVIDERS.map((p) => (
            <li key={p.id}>
              <Card className="h-full">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{p.id}</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{p.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.desc}</p>
                <p className="mt-3 break-words font-mono text-[12px] leading-5">{p.config}</p>
                <p className="mt-2 break-words font-mono text-[12px] leading-5 text-muted-foreground">{p.auth}</p>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card>
            <h3 className="text-sm font-semibold tracking-tight">Role-based model routing</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The model router maps aliases to clients, so planning, exploitation, peer consult, and titling can
              each run on a different model. Peer consultation is advisory only: consulted models get no tool
              schemas and can&rsquo;t execute anything.
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold tracking-tight">Embeddings stay local and optional</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Semantic memory and skill matching embed over nomic-embed-text on the local host by default — or
              disable embeddings and fall back to keyword storage and deterministic matching. Zero network, zero
              env reads.
            </p>
          </Card>
        </div>
        <div className="mt-8">
          <CodeSnippet
            code={`models:\n  provider: opencode_go   # ollama | opencode_go | chatgpt\nproviders:\n  opencode_go:\n    api_key_env: OPENCODE_GO_API_KEY   # env-only, never in config`}
            title="config.yaml — provider selection"
          />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Full reference:{" "}
          <Link href="/docs/providers" className="font-medium text-foreground underline underline-offset-4">providers</Link>
          {" · "}
          <Link href="/docs/provider-development" className="font-medium text-foreground underline underline-offset-4">provider development</Link>
        </p>
      </section>
    </div>
  );
}
