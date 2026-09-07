/**
 * Lightweight accessibility smoke test over the static export (out/).
 * No dependencies, no browser: parses exported HTML for high-signal,
 * low-false-positive issues on key pages. This is a smoke test, not a full
 * audit — it catches regressions like missing alt text or lost landmarks,
 * not contrast ratios or keyboard traps.
 *
 * Usage: node scripts/check-a11y.mjs [outDir]
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] ?? join(process.cwd(), "out");
const PAGES = ["/", "/install", "/docs", "/features", "/safety"];

function pageFile(route) {
  const cands =
    route === "/"
      ? [join(outDir, "index.html")]
      : [join(outDir, `${route}.html`), join(outDir, route.slice(1), "index.html")];
  return cands.find((f) => existsSync(f)) ?? null;
}

let failures = 0;
function fail(route, msg) {
  console.error(`a11y [${route}]: ${msg}`);
  failures += 1;
}

for (const route of PAGES) {
  const file = pageFile(route);
  if (!file) {
    fail(route, `page missing from export (${route === "/" ? "index.html" : `${route}.html or ${route}/index.html`})`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const body = html.split("<body")[1] ?? html;

  if (!/<html[^>]*\blang="en"/.test(html)) fail(route, "missing lang=\"en\" on <html>");
  if (!/<title>[^<]+<\/title>/.test(html)) fail(route, "missing <title>");
  if (!/<meta name="description"/.test(html)) fail(route, "missing meta description");
  if (!/<main[^>]*>/.test(body)) fail(route, "missing <main> landmark");
  if (!/<h1[^>]*>/.test(body)) fail(route, "missing <h1>");
  if (!/href="#main-content"/.test(body)) fail(route, "missing skip-to-content link");

  const imgs = [...body.matchAll(/<img\b([^>]*?)>/g)];
  for (const [, attrs] of imgs) {
    if (!/\balt=/.test(attrs)) fail(route, `<img> without alt: ${attrs.slice(0, 80)}`);
  }
  const buttons = [...body.matchAll(/<button\b([^>]*?)>([\s\S]*?)<\/button>/g)];
  for (const [, attrs, inner] of buttons) {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text && !/\baria-label=|\baria-labelledby=/.test(attrs)) {
      fail(route, `<button> without accessible name: ${attrs.slice(0, 80)}`);
    }
  }
  const inputs = [...body.matchAll(/<input\b([^>]*?)>/g)];
  for (const [, attrs] of inputs) {
    if (/type="(hidden|submit)"/.test(attrs)) continue;
    if (!/\baria-label=|\baria-labelledby=/.test(attrs)) {
      const id = attrs.match(/\bid="([^"]+)"/)?.[1];
      if (!id || !new RegExp(`<label[^>]*for="${id}"`).test(body)) {
        fail(route, `<input> without label: ${attrs.slice(0, 80)}`);
      }
    }
  }
}

console.log(`check-a11y: ${PAGES.length} pages, ${failures} failures`);
if (failures > 0) process.exit(1);
