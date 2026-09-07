"use client";

import { Github, Menu, Terminal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

function isActiveLink(pathname: string, href: string) {
  if (pathname === href) return true;
  // Highlight the section root for nested routes (e.g. /features/swarm → Features).
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="BreachPilot home">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Terminal className="h-4 w-4" aria-hidden />
          </span>
          <span>BreachPilot</span>
        </Link>
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActiveLink(pathname, l.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActiveLink(pathname, l.href) && "bg-muted text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BreachPilot on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            <Github className="h-4 w-4" aria-hidden />
          </a>
          <Link
            href="/install"
            className="hidden rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Install
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t bg-background lg:hidden">
          <ul className="mx-auto max-w-6xl space-y-0.5 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActiveLink(pathname, l.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm text-foreground/90 hover:bg-muted",
                    isActiveLink(pathname, l.href) && "bg-muted font-medium"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-[15px] text-foreground/90 hover:bg-muted"
              >
                <Github className="h-4 w-4" aria-hidden /> GitHub
              </a>
            </li>
            <li className="pt-2">
              <Link
                href="/install"
                className="block rounded-md bg-primary px-3 py-2.5 text-center text-[15px] font-medium text-primary-foreground"
              >
                Install BreachPilot
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
