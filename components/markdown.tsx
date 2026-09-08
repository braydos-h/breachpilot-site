import type { ReactNode } from "react";
import { isValidElement } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { resolveDocSlug, upstreamDocUrl } from "@/lib/docs";
import { slugify } from "@/lib/slug";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/**
 * Render synced repo Markdown with heading anchors, rewritten doc links,
 * and copyable code blocks.
 *
 * Server component: react-markdown + remark-gfm run at build time so docs
 * pages ship zero parser JS. Only CodeBlock (the copy button) hydrates.
 *
 * Upstream docs link relatively (`api/auth.md`, `../safety-model.md`);
 * those resolve to /docs/<slug> routes. Links with no synced target fall
 * back to the upstream GitHub file instead of 404ing.
 */
function components(slug: string): Components {
  // Shared across h2/h3 in document order — duplicate headings get -1/-2
  // suffixes. Same rule as lib/docs.ts extractMeta, so TOC hrefs agree.
  const seen = new Map<string, number>();
  const uniqueId = (base: string): string => {
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
  const heading = (Tag: "h2" | "h3", children: ReactNode) => {
    const id = uniqueId(slugify(textOf(children)));
    return (
      <Tag id={id} className="scroll-mt-20">
        <a href={`#${id}`} aria-label={`Link to ${textOf(children)}`} className="heading-anchor">
          {children}
        </a>
      </Tag>
    );
  };
  return {
    h2({ children }) {
      return heading("h2", children);
    },
    h3({ children }) {
      return heading("h3", children);
    },
    pre({ children }) {
      return <CodeBlock code={textOf(children).replace(/\n$/, "")}>{children}</CodeBlock>;
    },
    table({ children }) {
      return (
        <div className="table-scroll" role="region" aria-label="Data table" tabIndex={0}>
          <table>{children}</table>
        </div>
      );
    },
    a({ href, children }) {
      if (!href) return <span>{children}</span>;
      // Block non-navigable / executable schemes; allow http(s), mailto,
      // anchors, and site-absolute paths.
      if (/^(javascript|data|vbscript|file):/i.test(href.trim())) {
        return <span>{children}</span>;
      }
      const target = resolveDocSlug(slug, href);
      if (target) {
        const anchor = href.includes("#") ? href.slice(href.indexOf("#")) : "";
        return <a href={`/docs/${target}${anchor}`}>{children}</a>;
      }
      if (/\.md(#|\?|$)/.test(href) && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href) && !href.startsWith("/")) {
        const upstream = upstreamDocUrl(slug, href);
        if (upstream) {
          return (
            <a href={upstream} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }
      }
      if (/^https?:\/\//.test(href)) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return <a href={href}>{children}</a>;
    },
  };
}

export function Markdown({ slug, body }: { slug: string; body: string }) {
  return (
    <div className="docs-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components(slug)}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
