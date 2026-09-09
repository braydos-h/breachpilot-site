import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, ShieldCheck, Stethoscope, Terminal } from "lucide-react";
import { InstallTabs } from "@/components/install-tabs";
import { PageHero } from "@/components/page-hero";
import { Badge, Card, CodeSnippet } from "@/components/ui";
import { routeMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/install", {
  title: "Install",
  description:
    "Install BreachPilot: Linux primary platform and Windows secondary. One-line installers, review-first flows, requirements and post-install checks.",
});

const ESSENTIAL: Array<[string, string, string]> = [
  ["Python", "3.11+", "CI matrix 3.11 to 3.13; --doctor rejects older. python --version to check."],
  ["nmap", "on PATH or nmap.path", "Linux -O/-sS need root (nmap.sudo with sudo -n) or priv_fallback auto-downgrade."],
  ["Model endpoint", "Ollama Cloud (default) or local", "Cloud needs OLLAMA_API_KEY; embeddings stay local via ollama.embed_host."],
];

const OPTIONAL: Array<[string, string, string]> = [
  ["Node.js + npm", "Node 18+", `Only for the first WebUI build (auto-built, opens at 127.0.0.1:${SITE.webuiDefaultPort}).`],
  ["Docker", "Engine / Desktop + breachpilot-sandbox image", "Sandbox is default-on; without it attacks degrade or block per config."],
  ["Disk / rights / Git", "~4GB free, admin for installs", "Git required for clone. Linux Kali arsenal optional (metasploit, hydra, impacket…)."],
];

const VERIFY_STEPS = [
  {
    icon: Terminal,
    title: "Launch",
    cmd: "bp",
    blurb: `Starts the local WebUI and opens http://127.0.0.1:${SITE.webuiDefaultPort}. Nothing leaves your machine.`,
  },
  {
    icon: KeyRound,
    title: "Keys",
    cmd: "bp --setup-api-keys",
    blurb: "Stores OLLAMA_API_KEY and friends in secr.json. Keys stay in env / local files, never in config.",
  },
  {
    icon: Stethoscope,
    title: "Doctor",
    cmd: "bp --doctor",
    blurb: "Environment check for Python, nmap, and the model endpoint. Expect all [OK] before your first run.",
  },
  {
    icon: CheckCircle2,
    title: "Self-test",
    cmd: "bp --self-test",
    blurb: "Localhost-only smoke test. No external traffic, safe to run anywhere.",
  },
] as const;

function RequirementsTable({ caption, rows }: { caption: string; rows: Array<[string, string, string]> }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[560px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Need</th>
            <th scope="col">Minimum</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([need, min, notes]) => (
            <tr key={need}>
              <td className="font-medium">{need}</td>
              <td className="font-mono text-[13px]">{min}</td>
              <td className="text-muted-foreground">{notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InstallPage() {
  return (
    <div>
      <PageHero
        eyebrow="Install"
        title="Install BreachPilot in minutes"
        lede="Linux is the primary platform, macOS and Windows are supported. The review-first flow below is recommended. The one-liner picker is an optional shortcut for scripts you have already read."
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge>Linux · primary</Badge>
          <Badge>macOS · supported</Badge>
          <Badge>Windows · secondary</Badge>
        </div>
        <div className="mt-6 max-w-2xl">
          <InstallTabs compact />
          <p className="mt-3 text-sm text-muted-foreground">
            For authorized testing only. Only test systems you own or have explicit written permission to assess.{" "}
            <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">Safety model →</Link>
          </p>
        </div>
      </PageHero>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <section aria-labelledby="review-first">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Trust, then run</p>
          <h2 id="review-first" className="mt-2 text-2xl font-semibold tracking-tight">Review-first install per OS</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted-foreground">
            Never pipe a script you haven&apos;t read. Download it, read it, then run the local copy.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Card>
              <h3 className="font-semibold tracking-tight">Linux</h3>
              <p className="mt-1 text-sm text-muted-foreground">Primary platform. Full Kali arsenal optional.</p>
              <div className="mt-3">
                <CodeSnippet
                  code={`curl -fsSL ${SITE.installSh} -o install.sh\nless install.sh\nbash install.sh`}
                  title="linux review-first"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Full arsenal: <code className="rounded border bg-muted px-1 font-mono text-[13px]">INSTALL_KALI_TOOLS=1 ./install.sh</code>.
                Lightweight: <code className="rounded border bg-muted px-1 font-mono text-[13px]">./scripts/setup-linux.sh</code>.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold tracking-tight">macOS</h3>
              <p className="mt-1 text-sm text-muted-foreground">Same installer as Linux. Xcode CLT + Homebrew recommended.</p>
              <div className="mt-3">
                <CodeSnippet
                  code={`xcode-select --install\ncurl -fsSL ${SITE.installSh} -o install.sh\nless install.sh\nbash install.sh`}
                  title="macos review-first"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                nmap via <code className="rounded border bg-muted px-1 font-mono text-[13px]">brew install nmap</code>.
                Docker Desktop enables the default-on sandbox.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold tracking-tight">Windows</h3>
              <p className="mt-1 text-sm text-muted-foreground">Secondary platform. Run in an elevated PowerShell.</p>
              <div className="mt-3">
                <CodeSnippet
                  code={`irm ${SITE.installPs1} -OutFile install.ps1\nGet-Content install.ps1\n.\\install.ps1`}
                  title="windows review-first"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Or double-click <code className="rounded border bg-muted px-1 font-mono text-[13px]">install.bat</code> in
                Explorer. Afterwards, <code className="rounded border bg-muted px-1 font-mono text-[13px]">.\START.bat</code> launches the WebUI.
              </p>
            </Card>
          </div>
        </section>

        <section aria-labelledby="verify" className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Post-install</p>
          <h2 id="verify" className="mt-2 text-2xl font-semibold tracking-tight">Verify before your first run</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted-foreground">
            Four commands, in order. Each step is safe to run locally. Stop at the first one that fails and check the requirements below.
          </p>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {VERIFY_STEPS.map((s, i) => (
              <li key={s.title}>
                <Card className="h-full">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/60" aria-hidden>
                      <s.icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold"><span className="mr-1.5 font-mono text-muted-foreground">{i + 1}.</span>{s.title}</p>
                  </div>
                  <div className="mt-3">
                    <CodeSnippet code={s.cmd} title={s.title} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.blurb}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="prereqs" className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Prerequisites</p>
          <h2 id="prereqs" className="mt-2 text-2xl font-semibold tracking-tight">What you need first</h2>
          <h3 className="mt-6 font-semibold tracking-tight">Essential</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Install these first. <code className="rounded border bg-muted px-1 font-mono text-[13px]">bp --doctor</code> fails without them.
          </p>
          <RequirementsTable caption="Essential requirements" rows={ESSENTIAL} />
          <h3 className="mt-8 font-semibold tracking-tight">Optional, skip if WebUI only</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Needed for sandboxing, the WebUI build, and full tool coverage. Safe to add later.
          </p>
          <RequirementsTable caption="Optional requirements" rows={OPTIONAL} />
        </section>

        <section aria-labelledby="first-run" className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">First lab run</p>
          <h2 id="first-run" className="mt-2 text-2xl font-semibold tracking-tight">Prove it on localhost</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted-foreground">
            Authorized testing only. Run against a local lab target you own, never against hosts you do not own or
            lack explicit written permission to assess. See the{" "}
            <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">safety model</Link>.
          </p>
          <div className="mt-4">
            <CodeSnippet
              code={`docker run --rm -p 8080:80 vulnerables/web-dvwa   # local victim on http://127.0.0.1:8080\nbp --target 127.0.0.1 --mode recon --goal initial_access --yes`}
              title="first lab run against localhost only"
            />
          </div>
        </section>

        <aside aria-label="Authorized testing only" className="mt-12 flex gap-3 rounded-xl border bg-muted/40 p-5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <p className="text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Authorized testing only.</span> BreachPilot is attack
            tooling for systems you own or have explicit written permission to assess. Unauthorized testing is illegal.{" "}
            <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">Read the safety model</Link>.
          </p>
        </aside>

        <nav aria-label="Install next steps" className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs/troubleshooting"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Stuck? Troubleshooting <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Read the docs
          </Link>
        </nav>
      </main>
    </div>
  );
}
