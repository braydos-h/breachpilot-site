"use client";

import type { ReactNode } from "react";
import { CopyButton } from "@/components/copy-button";

/**
 * Client island for one fenced code block: the copy button only.
 * Rendered by the server-side Markdown component; `code` arrives as a prop
 * so no DOM scraping is needed.
 *
 * Visibility is CSS-driven (see .code-copy in globals.css): hover/focus on
 * desktop, always visible on coarse pointers where there is no hover — yet
 * the invisible button must not intercept taps or keyboard focus.
 */
export function CodeBlock({ code, children }: { code: string; children: ReactNode }) {
  return (
    <div className="group relative">
      <pre>{children}</pre>
      <span className="code-copy absolute right-2 top-2">
        <CopyButton text={code} label="Copy code block" />
      </span>
    </div>
  );
}
