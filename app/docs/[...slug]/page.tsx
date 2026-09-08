import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getAllDocSlugs, getDoc, prevNext } from "@/lib/docs";
import { SITE } from "@/lib/site";

type Props = { params: { slug: string[] } };

export function generateStaticParams(): Array<{ slug: string[] }> {
  return getAllDocSlugs().map((s) => ({ slug: s.split("/") }));
}

/** First prose paragraph, for a description with actual content. */
function excerpt(body: string): string {
  for (const para of body.split(/\n\s*\n/)) {
    const text = para
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~<>|]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 40) return text.slice(0, 160);
  }
  return "";
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug.join("/");
  const doc = getDoc(slug);
  if (!doc) return { title: "Not found" };
  const bodyExcerpt = excerpt(doc.body);
  return {
    title: doc.title,
    description: bodyExcerpt || `BreachPilot docs: ${doc.title} — generated from the repository (${slug}.md).`,
    alternates: { canonical: `${SITE.url}/docs/${slug}` },
    openGraph: { url: `${SITE.url}/docs/${slug}` },
  };
}

function OnThisPage({ headings }: { headings: Array<{ id: string; text: string; level: number }> }) {
  return (
    <nav aria-label="On this page">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">On this page</h2>
      <ul className="mt-2 space-y-1">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
            <a href={`#${h.id}`} className="text-sm underline-offset-4 hover:underline">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function DocPage({ params }: Props) {
  const slug = params.slug.join("/");
  const doc = getDoc(slug);
  if (!doc) notFound();
  const { prev, next } = prevNext(slug);
  const editUrl =
    slug.toLowerCase() === "readme"
      ? `${SITE.repo}/blob/main/README.md`
      : `${SITE.repo}/blob/main/docs/${slug
          .split("/")
          .map((seg) => encodeURIComponent(seg))
          .join("/")}.md`;

  return (
    <div className="xl:flex xl:gap-10">
      <article className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground">
            docs
          </Link>
          <span aria-hidden> / </span>
          <span>{doc.category}</span>
        </nav>
        <h1 className="mb-4 mt-2 text-3xl font-semibold tracking-tight text-foreground">{doc.title}</h1>
        <Markdown slug={slug} body={doc.body} />

        {doc.headings.length > 0 && (
          <div className="mt-10 rounded-lg border bg-muted/30 p-4 lg:hidden">
            <OnThisPage headings={doc.headings} />
          </div>
        )}

        <div className="mt-10 flex flex-col gap-2 border-t pt-4 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>source: {doc.updatedFrom}</span>
          <a href={editUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
            Edit this page on GitHub →
          </a>
        </div>

        <nav aria-label="Previous and next document" className="mt-6 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={prev.path} className="rounded-lg border p-4 hover:bg-muted">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">← Previous</span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={next.path} className="rounded-lg border p-4 hover:bg-muted sm:text-left">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Next →</span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>

      {doc.headings.length > 0 && (
        <aside className="hidden w-56 shrink-0 lg:block xl:block">
          <div className="sticky top-[4.5rem] max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
            <OnThisPage headings={doc.headings} />
          </div>
        </aside>
      )}
    </div>
  );
}
