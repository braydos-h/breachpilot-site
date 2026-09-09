import { ShieldAlert, Terminal } from "lucide-react";
import Link from "next/link";
import { FOOTER_COLS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="BreachPilot home">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Terminal className="h-4 w-4" aria-hidden />
              </span>
              <span>BreachPilot</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Open-source autonomous platform for authorized security testing. {SITE.pipeline}.
            </p>
            <p className="mt-4 flex max-w-xs gap-2 rounded-md border bg-background p-3 text-xs leading-5 text-muted-foreground">
              <ShieldAlert className="h-4 w-4 shrink-0 text-foreground" aria-hidden />
              <span>Only test systems you own or have explicit written permission to assess.</span>
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={`Footer: ${col.title}`}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {col.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) =>
                  l.href.startsWith("http") ? (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1 text-sm text-foreground/80 hover:text-foreground hover:underline hover:underline-offset-4"
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="inline-block py-1 text-sm text-foreground/80 hover:text-foreground hover:underline hover:underline-offset-4"
                      >
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>BreachPilot · Open source under {SITE.license}</p>
          <p className="font-mono text-xs">breachpilot.dev · local-first · operator-supervised</p>
        </div>
      </div>
    </footer>
  );
}
