import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  Cpu,
  Eye,
  FileText,
  FlaskConical,
  Globe,
  KeyRound,
  Lock,
  Monitor,
  Network,
  Plug,
  Power,
  Radar,
  RotateCcw,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Swords,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, CodeSnippet, SectionHeading } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { PLUGINS, SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/plugins", {
  title: "Plugins",
  description:
    "BreachPilot extensions: Shodan, GitHub dorks, webhooks, Sliver C2, BloodHound CE, OWASP ZAP, browser, mobile, wireless, SpiderFoot, Atomic Red Team, Caldera, firmware and SNMP — without forking core.",
});

function isAdvisory(purpose: string): boolean {
  return purpose.includes("Advisory-only");
}

function isLocalOnly(purpose: string): boolean {
  return purpose.includes("Local-only");
}

function iconForPlugin(name: string): LucideIcon {
  if (name.includes("shodan")) return Radar;
  if (name.includes("github")) return Search;
  if (name.includes("webhook")) return Bell;
  if (name.includes("sliver")) return Zap;
  if (name.includes("bloodhound")) return Share2;
  if (name.includes("zap")) return Globe;
  if (name.includes("browser")) return Monitor;
  if (name.includes("mobile")) return Smartphone;
  if (name.includes("wireless")) return Wifi;
  if (name.includes("spiderfoot")) return Eye;
  if (name.includes("atomic")) return FlaskConical;
  if (name.includes("caldera")) return Swords;
  if (name.includes("firmware")) return Cpu;
  if (name.includes("snmp")) return Network;
  return Plug;
}

// Progressive-enhancement filter: the full catalog renders server-side, this
// script only hides non-matching cards. No-JS and crawlers see everything.
const FILTER_SCRIPT = `(function () {
  function $(id) { return document.getElementById(id); }
  var search = $("plugin-search");
  var count = $("plugin-count");
  var empty = $("plugin-empty");
  var reset = $("plugin-reset");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-plugin-card]"));
  var total = cards.length;
  var radios = Array.prototype.slice.call(document.querySelectorAll('input[name="plugin-filter"]'));
  function currentMode() {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return "all";
  }
  function apply() {
    var q = search ? search.value.trim().toLowerCase() : "";
    var mode = currentMode();
    var shown = 0;
    cards.forEach(function (card) {
      var text = (card.textContent || "").toLowerCase();
      var ok = q === "" || text.indexOf(q) !== -1;
      if (ok && mode === "creds") ok = card.getAttribute("data-creds") === "true";
      else if (ok && mode === "no-creds") ok = card.getAttribute("data-creds") === "false";
      else if (ok && mode === "advisory") ok = card.getAttribute("data-advisory") === "true";
      card.style.display = ok ? "" : "none";
      if (ok) shown += 1;
    });
    if (count) count.textContent = "Showing " + shown + " of " + total + " plugins";
    if (empty) empty.hidden = shown > 0;
  }
  if (search) search.addEventListener("input", apply);
  radios.forEach(function (r) { r.addEventListener("change", apply); });
  if (reset) reset.addEventListener("click", function () {
    if (search) search.value = "";
    if (radios.length > 0) radios[0].checked = true;
    apply();
    if (search) search.focus();
  });
})();`;

const MANIFEST_SNIPPET = `name: my_plugin
version: 0.1.0
entry: plugin.py
config_section: my_plugin`;

const REGISTER_SNIPPET = `def register(registry):
    registry.add_module(MyModule)`;

export default function PluginsPage() {
  const totalCount = PLUGINS.length;
  const credsCount = PLUGINS.filter((p) => p.needsCredentials).length;
  const noCredsCount = totalCount - credsCount;
  const advisoryCount = PLUGINS.filter((p) => isAdvisory(p.purpose)).length;

  const filters = [
    { value: "all", label: `All (${totalCount})` },
    { value: "creds", label: `Needs credentials (${credsCount})` },
    { value: "no-creds", label: `No credentials (${noCredsCount})` },
    { value: "advisory", label: `Advisory-only (${advisoryCount})` },
  ] as const;

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
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Opt-in plugins
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{totalCount}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Need credentials
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{credsCount}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Advisory-only
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{advisoryCount}</dd>
          </div>
        </dl>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-muted-foreground">
          For authorized testing only — only run plugins against systems you own or have explicit written
          permission to assess.
        </p>
      </PageHero>

      <section aria-labelledby="catalog-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow={`${totalCount} opt-in extensions`}
          title="Plugin catalog"
          lede="Every plugin is disabled by default. Target-touching plugin tools carry the same allowlist lock and audit trail as core tools."
          align="left"
        />
        <div id="catalog-heading" className="sr-only">
          Plugin catalog
        </div>

        <div className="mt-8 rounded-lg border bg-card p-4 shadow-[0_1px_2px_0_hsl(var(--foreground)/0.04)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <label htmlFor="plugin-search" className="sr-only">
                Search plugins
              </label>
              <input
                id="plugin-search"
                type="search"
                autoComplete="off"
                placeholder="Search by name or capability — try “c2”, “osint”, “firmware”…"
                className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground/70"
              />
            </div>
            <fieldset className="flex flex-wrap gap-2">
              <legend className="sr-only">Filter plugins</legend>
              {filters.map((f, i) => (
                <label key={f.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="plugin-filter"
                    value={f.value}
                    defaultChecked={i === 0}
                    className="peer sr-only"
                  />
                  <span className="inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                    {f.label}
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
          <p id="plugin-count" role="status" aria-live="polite" className="mt-3 text-sm text-muted-foreground">
            Showing {totalCount} of {totalCount} plugins
          </p>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLUGINS.map((p) => {
            const Icon = iconForPlugin(p.name);
            const advisory = isAdvisory(p.purpose);
            const localOnly = isLocalOnly(p.purpose);
            return (
              <li
                key={p.name}
                data-plugin-card
                data-creds={p.needsCredentials ? "true" : "false"}
                data-advisory={advisory ? "true" : "false"}
              >
                <Card className="flex h-full flex-col">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/50"
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="min-w-0 break-all font-mono text-sm font-semibold">{p.name}</h3>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.needsCredentials ? (
                      <Badge>
                        <KeyRound className="h-3 w-3" aria-hidden /> needs credentials
                      </Badge>
                    ) : (
                      <Badge>no credentials</Badge>
                    )}
                    {advisory && (
                      <Badge>
                        <Eye className="h-3 w-3" aria-hidden /> advisory-only
                      </Badge>
                    )}
                    {localOnly && (
                      <Badge>
                        <Lock className="h-3 w-3" aria-hidden /> local-only
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.purpose}</p>
                  {p.needsCredentials && (
                    <p className="mt-auto pt-3 font-mono text-xs text-muted-foreground">
                      requires API credentials / server config
                    </p>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>

        <div id="plugin-empty" hidden className="mt-6 rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">No plugins match that filter</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search term or filter.</p>
          <button
            id="plugin-reset"
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset search and filters
          </button>
        </div>
        <script dangerouslySetInnerHTML={{ __html: FILTER_SCRIPT }} />

        <div className="mt-8 rounded-lg border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4" aria-hidden /> What “advisory-only” means
          </h2>
          <p className="mt-1">
            Advisory-only plugins enrich your assessment without touching the target — passive OSINT and
            code-leak discovery that never sends packets to in-scope systems. They still run under the same
            audit trail, and anything active still needs explicit authorization and allowlist scope. See{" "}
            <Link
              href="/docs/plugin-development"
              className="font-medium text-foreground underline underline-offset-4"
            >
              plugin development
            </Link>
            ,{" "}
            <Link
              href="/docs/extension-guide"
              className="font-medium text-foreground underline underline-offset-4"
            >
              extension guide
            </Link>{" "}
            and{" "}
            <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">
              safety model
            </Link>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            eyebrow="How it works"
            title="One manifest, one hook, zero core edits"
            align="left"
          />
          <h2 id="how-heading" className="sr-only">
            How plugins work
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileText,
                title: "1. Declare a manifest",
                body: "plugin.yaml names the plugin, its entry module and its config section.",
              },
              {
                icon: Plug,
                title: "2. Contribute one hook",
                body: "register(registry) adds attack modules, MCP tools, skill directories and config.",
              },
              {
                icon: Power,
                title: "3. Stay off until enabled",
                body: "Every plugin ships disabled — operators opt in per engagement, never by default.",
              },
              {
                icon: Lock,
                title: "4. Inherit guardrails",
                body: "Target-touching tools get the allowlist lock, target lock and audit trail.",
              },
            ].map((s) => (
              <li key={s.title}>
                <Card className="h-full">
                  <s.icon className="h-5 w-5" aria-hidden />
                  <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s.body}</p>
                </Card>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <CodeSnippet code={MANIFEST_SNIPPET} lang="yaml" title="plugin.yaml" />
            <CodeSnippet code={REGISTER_SNIPPET} lang="python" title="plugin.py" />
          </div>
        </div>
      </section>

      <section aria-labelledby="checklist-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="For authors"
          title="Safety checklist for plugin authors"
          lede="Authorized testing only — plugins must hold the same line as core. Hard-blocked capabilities stay blocked, no matter how useful they look."
          align="left"
        />
        <h2 id="checklist-heading" className="sr-only">
          Safety checklist for plugin authors
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "Stack the allowlist / audit decorators on every plugin MCP tool.",
            "Respect the target lock — never expand scope from inside a plugin.",
            "Redact secrets in logs, tool output and error paths.",
            "Add focused tests for each new tool and config section.",
          ].map((item) => (
            <li key={item}>
              <Card className="flex h-full items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-start gap-2 rounded-lg border bg-card p-4 text-sm leading-6 text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden />
          <span>
            <strong className="font-semibold text-foreground">Hard-blocked:</strong> log clearing,
            timestomping, EDR/AV defeat, DoS and malware distribution. Details in{" "}
            <Link
              href="/docs/plugin-development"
              className="font-medium text-foreground underline underline-offset-4"
            >
              plugin development
            </Link>{" "}
            and the{" "}
            <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">
              safety model
            </Link>
            .
          </span>
        </p>
      </section>

      <section aria-label="Build a plugin" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="rounded-xl border bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Ship your own capability
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Prototype on an authorized lab first</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              Build against systems you own, keep secrets in environment variables — never in config — and
              open a PR when the tests pass.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/docs/plugin-development"
                className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Build a plugin →
              </Link>
              <Link
                href={SITE.repo}
                className="inline-flex rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Browse plugin source
              </Link>
              <Link
                href="/safety"
                className="inline-flex rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Safety model
              </Link>
            </div>
          </div>
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
                Plugins extend what BreachPilot can do — not what it is allowed to do. Scope, allowlists and
                audit apply to every plugin tool, every run. Read the{" "}
                <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">
                  safety model
                </Link>{" "}
                before enabling anything target-touching.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
