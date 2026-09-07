import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CopyButton } from "@/components/copy-button";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = "ok", className }: { tone?: "ok" | "warn" | "bad" | "idle"; className?: string }) {
  const tones = {
    ok: "bg-emerald-500",
    warn: "bg-amber-500",
    bad: "bg-red-500",
    idle: "bg-muted-foreground/40",
  } as const;
  return (
    <span className={cn("inline-block h-2 w-2 shrink-0 rounded-full", tones[tone], className)} aria-hidden />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {lede ? <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{lede}</p> : null}
    </div>
  );
}

export function CodeSnippet({
  code,
  lang,
  title,
  className,
}: {
  code: string;
  lang?: string;
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-card", className)}>
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-1.5">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {title ?? lang ?? "shell"}
        </span>
        <CopyButton text={code} label={title ? `Copy ${title}` : "Copy command"} />
      </div>
      <pre className="scrollbar-thin overflow-x-auto whitespace-pre-wrap break-all p-3 font-mono text-[13px] leading-6 text-foreground sm:whitespace-pre sm:break-normal">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function MetaLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</p>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border bg-card p-5 shadow-[0_1px_2px_0_hsl(var(--foreground)/0.04)]", className)}>
      {children}
    </div>
  );
}
