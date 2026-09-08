import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { PLUGINS, SITE } from "@/lib/site";
import { routeMetadata } from "@/lib/metadata";

export const metadata: Metadata = routeMetadata("/plugins", {
  title: "Plugins",
  description:
    "BreachPilot extensions: Shodan, GitHub dorks, webhooks, Sliver C2, BloodHound CE, OWASP ZAP, browser, mobile, wireless, SpiderFoot, Atomic Red Team, Caldera, firmware and SNMP — without forking core.",
});

export default function PluginsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Extensibility"
        title="Extend without forking core"
        lede="Plugins are opt-in, trusted Python managed by tools/plugins.py: a plugin.yaml manifest plus a single register(registry) hook contributing attack modules, MCP tools, skill directories and config sections. Target-touching plugin tools carry the same allowlist lock and audit trail as core tools."
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/docs/plugin-development"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Build a plugin →
          </Link>
          <Link
            href="/safety"
            className="inline-flex rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Safety model
          </Link>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          For authorized testing only — only run plugins against systems you own or have explicit written
          permission to assess.
        </p>
      </PageHero>
      <section aria-label="Plugin catalog" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow={`${PLUGINS.length} opt-in extensions`}
          title="Plugin catalog"
          lede="Every plugin is disabled by default. Target-touching plugin tools carry the same allowlist lock and audit trail as core tools."
          align="left"
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLUGINS.map((p) => (
            <li key={p.name}>
              <Card className="h-full">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-mono text-sm font-semibold">{p.name}</h3>
                  {p.needsCredentials ? <Badge>needs credentials</Badge> : <Badge>no credentials</Badge>}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.purpose}</p>
                {p.needsCredentials && (
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    requires API credentials / server config
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-lg border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          <h2 className="font-semibold text-foreground">Safety checklist for plugin authors</h2>
          <p className="mt-1">
            Plugin MCP tools must stack the allowlist / audit decorators, respect the target lock, redact secrets and
            add focused tests. Hard-blocked: log clearing, timestomping, EDR/AV defeat, DoS and malware distribution.
            See <Link href="/docs/plugin-development" className="font-medium text-foreground underline underline-offset-4">plugin development</Link>,{" "}
            <Link href="/docs/extension-guide" className="font-medium text-foreground underline underline-offset-4">extension guide</Link> and{" "}
            <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">safety model</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
