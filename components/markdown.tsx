"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo } from "react";
import { CopyButton } from "@/components/copy-button";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

/** Render synced repo Markdown with heading anchors + copyable code blocks. */
export function Markdown({ body }: { body: string }) {
  const components = useMemo(
    () => ({
      h2({ children }: { children?: React.ReactNode }) {
        const id = slugify(textOf(children));
        return (
          <h2 id={id} className="scroll-mt-20">
            <a href={`#${id}`} className="no-underline hover:underline" aria-label={`Link to ${textOf(children)}`}>
              {children}
            </a>
          </h2>
        );
      },
      h3({ children }: { children?: React.ReactNode }) {
        const id = slugify(textOf(children));
        return (
          <h3 id={id} className="scroll-mt-20">
            <a href={`#${id}`} className="no-underline hover:underline" aria-label={`Link to ${textOf(children)}`}>
              {children}
            </a>
          </h3>
        );
      },
      pre({ children }: { children?: React.ReactNode }) {
        const code = textOf(children).replace(/\n$/, "");
        return (
          <div className="group relative">
            <pre>{children}</pre>
            <span className="absolute right-2 top-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
              <CopyButton text={code} label="Copy code block" />
            </span>
          </div>
        );
      },
    }),
    []
  );
  return (
    <div className="docs-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
