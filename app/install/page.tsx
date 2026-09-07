import type { Metadata } from "next";
import Link from "next/link";
import { InstallTabs } from "@/components/install-tabs";
import { PageHero } from "@/components/page-hero";
import { CodeSnippet } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Install",
  description:
    "Install BreachPilot: Linux primary platform and Windows secondary. One-line installers, review-first flows, requirements and post-install checks.",
  alternates: { canonical: `${SITE.url}/install` },
};

const ESSENTIAL: Array<[string, string, string]> = [
  ["Python", "3.11+", "CI matrix 3.11–3.13; --doctor rejects older. python --version to check."],
  ["nmap", "on PATH or nmap.path", "Linux -O/-sS need root (nmap.sudo with sudo -n) or priv_fallback auto-downgrade."],
  ["Model endpoint", "Ollama Cloud (default) or local", "Cloud needs OLLAMA_API_KEY; embeddings stay local via ollama.embed_host."],
];

const OPTIONAL: Array<[string, string, string]> = [
  ["Node.js + npm", "Node 18+", `Only for the first WebUI build (auto-built, opens at 127.0.0.1:${SITE.webuiDefaultPort}).`],
  ["Docker", "Engine / Desktop + breachpilot-sandbox image", "Sandbox is default-on; without it attacks degrade or block per config."],
  ["Disk / rights / Git", "~4GB free, admin for installs", "Git required for clone. Linux Kali arsenal optional (metasploit, hydra, impacket…)."],
];

function RequirementsTable({ caption, rows }: { caption: string; rows: Array<[string, string, string]> }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border">
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
        title="Install BreachPilot"
        lede="Linux is the primary platform. Windows is supported as a secondary platform. Never pipe a script you haven't read — every shortcut below has a review-first alternative."
      >
        <div className="mt-6 max-w-2xl">
          <InstallTabs compact />
          <p className="mt-3 text-sm text-muted-foreground">
            For authorized testing only — only test systems you own or have explicit written permission to assess.{" "}
            <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">Safety model →</Link>
          </p>
        </div>
      </PageHero>
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold tracking-tight">Linux — review first</h2>
            <div className="mt-3">
              <CodeSnippet
                code={`curl -fsSL ${SITE.installSh} -o install.sh\nless install.sh\nbash install.sh`}
                title="review-first flow"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Full Kali arsenal: <code className="rounded border bg-muted px-1 font-mono text-[13px]">INSTALL_KALI_TOOLS=1 ./install.sh</code>.
              Lightweight alternative: <code className="rounded border bg-muted px-1 font-mono text-[13px]">./scripts/setup-linux.sh</code>.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold tracking-tight">Windows — review first</h2>
            <div className="mt-3">
              <CodeSnippet
                code={`irm ${SITE.installPs1} -OutFile install.ps1\nGet-Content install.ps1\n.\\install.ps1`}
                title="review-first flow"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Or double-click <code className="rounded border bg-muted px-1 font-mono text-[13px]">install.bat</code> in
              Explorer. Afterwards, <code className="rounded border bg-muted px-1 font-mono text-[13px]">.\START.bat</code> launches the WebUI.
            </p>
          </div>
        </div>

        <h2 className="mt-12 text-xl font-semibold tracking-tight">After install</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Verify the install before your first run — each step is safe to run locally.
        </p>
        <div className="mt-3">
          <CodeSnippet
            code={`bp                  # launch the local WebUI (default, opens http://127.0.0.1:${SITE.webuiDefaultPort})\nbp --setup-api-keys # store OLLAMA_API_KEY and friends in secr.json\nbp --doctor         # environment check — expect all [OK]\nbp --self-test      # safe localhost-only smoke test`}
            title="post-install checks"
          />
        </div>

        <h2 className="mt-12 text-xl font-semibold tracking-tight">Essential requirements</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Install these first — <code className="rounded border bg-muted px-1 font-mono text-[13px]">bp --doctor</code> fails without them.
        </p>
        <RequirementsTable caption="Essential requirements" rows={ESSENTIAL} />

        <h2 className="mt-12 text-xl font-semibold tracking-tight">Optional — skip if WebUI-only</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Needed for sandboxing, the WebUI build, and full tool coverage. Safe to add later.
        </p>
        <RequirementsTable caption="Optional requirements" rows={OPTIONAL} />

        <h2 className="mt-12 text-xl font-semibold tracking-tight">First lab run</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Authorized testing only — run against a local lab target you own, never against hosts you do not own or
          lack explicit written permission to assess. See the{" "}
          <Link href="/safety" className="font-medium text-foreground underline underline-offset-4">safety model</Link>.
        </p>
        <div className="mt-3">
          <CodeSnippet
            code={`docker run --rm -p 8080:80 vulnerables/web-dvwa   # local victim on http://127.0.0.1:8080\nbp --target 127.0.0.1 --mode recon --goal initial_access --yes`}
            title="first lab run against localhost only"
          />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Stuck? <Link href="/docs/troubleshooting" className="font-medium text-foreground underline underline-offset-4">Troubleshooting →</Link>
        </p>
      </section>
    </div>
  );
}
