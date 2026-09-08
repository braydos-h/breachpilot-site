import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="bg-grid">
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg border bg-card">
          <FileQuestion className="h-6 w-6 text-muted-foreground" aria-hidden />
        </span>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          TARGET_NOT_FOUND
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">The requested route is outside the current scope.</h1>
        <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
          Nothing at this path. It may have moved, or it was never in the allowlist.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Return home
          </Link>
          <Link
            href="/docs"
            className="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Open docs
          </Link>
        </div>
      </div>
    </div>
  );
}
