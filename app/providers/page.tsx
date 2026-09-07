import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, CodeSnippet } from "@/components/ui";
import { PROVIDERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Providers",
  description:
    "BreachPilot's provider-pluggable architecture: Ollama, OpenCode Go and ChatGPT behind one ModelClient contract, with role-based routing and optional embeddings.",
  alternates: { canonical: "https://breachpilot.dev/providers" },
};

export default function ProvidersPage() {
  return (
    <div>
      <PageHero
        eyebrow="AI providers"
        title="Provider-pluggable by design"
        lede="Chat and generate go through a provider registry — every backend behavior lives inside its adapter, and engine code only ever sees the canonical ModelClient contract. Ollama is one optional provider, not the internal protocol."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {PROVIDERS.map((p) => (
            <Card key={p.id}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{p.id}</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">{p.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.desc}</p>
              <p className="mt-3 font-mono text-[12px] leading-5">{p.config}</p>
              <p className="mt-2 font-mono text-[12px] leading-5 text-muted-foreground">{p.auth}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Role-based model routing</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The model router maps aliases to clients, so different roles — planning, exploitation, peer consult,
              titling — can run on different models. Peer consultation is advisory only: consulted models get no tool
              schemas and can&rsquo;t execute anything.
            </p>
          </div>
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Embeddings stay local and optional</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Semantic memory and skill matching embed over nomic-embed-text via the local host by default — or disable
              embeddings entirely and fall back to keyword storage and deterministic matching. Zero network, zero env reads.
            </p>
          </div>
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
