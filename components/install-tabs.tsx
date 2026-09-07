"use client";

import { useState } from "react";
import { CodeSnippet } from "@/components/ui";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";

const LINUX_CMD = "curl -fsSL https://breachpilot.dev/install.sh | bash";
const WINDOWS_CMD = "irm https://breachpilot.dev/install.ps1 | iex";

export function InstallTabs({ compact = false }: { compact?: boolean }) {
  const [os, setOs] = useState<"linux" | "windows">("linux");
  const cmd = os === "linux" ? LINUX_CMD : WINDOWS_CMD;

  return (
    <div className={compact ? "" : "mx-auto mt-8 max-w-2xl"}>
      <div
        role="tablist"
        aria-label="Operating system"
        className="inline-flex rounded-lg border bg-muted/50 p-1"
      >
        {(["linux", "windows"] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={os === v}
            onClick={() => setOs(v)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              os === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {v === "linux" ? "Linux" : "Windows"}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-3">
        <CodeSnippet
          code={cmd}
          lang={os === "linux" ? "bash" : "powershell"}
          title={os === "linux" ? "Linux install" : "Windows install (PowerShell)"}
        />
      </div>
      {!compact && (
        <p className="mt-3 text-sm text-muted-foreground">
          Prefer to read it first?{" "}
          <a href={os === "linux" ? SITE.installSh : SITE.installPs1} className="font-medium text-foreground underline underline-offset-4">
            Review installer before running →
          </a>{" "}
          · <a href="/install" className="font-medium text-foreground underline underline-offset-4">Full install guide</a>
        </p>
      )}
    </div>
  );
}
