"use client";

import type { ReactNode } from "react";
import { CopyButton } from "@/components/copy-button";

/**
 * Client island for one fenced code block: the copy button only.
 * Rendered by the server-side Markdown component; `code` arrives as a prop
 * so no DOM scraping is needed.
 */
export function CodeBlock({ code, children }: { code: string; children: ReactNode }) {
  return (
    <div className="group relative">
      <pre>{children}</pre>
      <span className="absolute right-2 top-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
        <CopyButton text={code} label="Copy code block" />
      </span>
    </div>
  );
}
