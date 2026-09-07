import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Badge, Card } from "@/components/ui";
import { PLUGINS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plugins",
  description:
    "BreachPilot extensions: Shodan, GitHub dorks, webhooks, Sliver C2, BloodHound CE, OWASP ZAP, browser, mobile, wireless, SpiderFoot, Atomic Red Team, Caldera, firmware and SNMP — without forking core.",
  alternates: { canonical: "https://breachpilot.dev/plugins" },
};

export default function PluginsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Extensibility"
        title="Extend without forking core"
        lede="Plugins are opt-in, trusted Python managed by tools/plugins.py: a plugin.yaml manifest plus a single register(registry) hook contributing attack modules, MCP tools, skill directories and config sections. Target-touching plugin tools carry the same allowlist lock and audit trail as core tools."
      >
        <div className="mt-6">
          <Link
            href="/docs/plugin-development"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Build a plugin →
          </Link>
        </div>
      </PageHero>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLUGINS.map((p) => (
            <Card key={p.name}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-mono text-sm font-semibold">{p.name}</h2>
                {p.needsCredentials ? <Badge>needs config</Badge> : <Badge>no creds</Badge>}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.purpose}</p>
              {p.needsCredentials && (
                <p className="mt-2 font-mono text-xs text-muted-foreground">requires API credentials / server config</p>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-8 rounded-lg border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          <p className="font-semibold text-foreground">Safety checklist for plugin authors</p>
          <p className="mt-1">
            Plugin MCP tools must stack the allowlist / audit decorators, respect the target lock, redact secrets and
            add focused tests. Hard-blocked: log clearing, timestomping, EDR/AV defeat, DoS and malware distribution.
            See <Link href="/docs/plugin-development" className="font-medium text-foreground underline underline-offset-4">plugin development</Link> and{" "}
            <Link href="/docs/extension-guide" className="font-medium text-foreground underline underline-offset-4">extension guide</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
