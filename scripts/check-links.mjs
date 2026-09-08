/**
 * Broken-internal-link check over the static export (out/).
 * Maps every .html file to its route, collects local hrefs, and fails if any
 * target has no corresponding file. No dependencies — runs on `out/` only.
 *
 * Usage: node scripts/check-links.mjs [outDir]
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] ?? join(process.cwd(), "out");

if (!existsSync(outDir)) {
  console.error(`check-links: ${outDir} missing — run npm run build first`);
  process.exit(1);
}

// Route -> file: out/foo.html, out/foo/index.html, out/index.html for /.
const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (e.endsWith(".html")) files.push(p);
  }
})(outDir);

const routes = new Set(["/"]);
for (const f of files) {
  const rel = f.slice(outDir.length);
  if (rel === "/index.html") continue;
  if (rel.endsWith("/index.html")) routes.add(rel.slice(0, -"/index.html".length) || "/");
  else routes.add(rel.slice(0, -".html".length));
}

// Public files (install.sh, og.png, ...) are valid link targets too.
const publicFiles = new Set();
(function walk(dir, base) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p, `${base}/${e}`);
      continue;
    }
    if (e === "_headers" || e.startsWith(".")) continue;
    publicFiles.add(`${base}/${e}`);
  }
})(join(process.cwd(), "public"), "");

// .well-known paths live in public/.well-known but readdir skips dotfiles;
// check them from the export instead.
(function walk(dir, base) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p, `${base}/${e}`);
      continue;
    }
    publicFiles.add(`${base}/${e}`);
  }
})(join(process.cwd(), "public", ".well-known"), "/.well-known");

let broken = 0;
const hrefRe = /href="(\/[^"#?]*?)(\?[^"#]*)?(#[^"]*)?"/g;
for (const f of files) {
  const html = readFileSync(f, "utf8");
  hrefRe.lastIndex = 0;
  let m;
  while ((m = hrefRe.exec(html))) {
    const target = m[1];
    // Raw `.md` hrefs are upstream-doc links the renderer rewrites; an
    // unrewritten one reaching the export is a broken link.
    if (/\.md([?#]|$)/.test(target)) {
      console.error(`unrewritten doc link: ${f.slice(outDir.length)} -> ${target}`);
      broken += 1;
      continue;
    }
    if (/\.(svg|png|jpg|jpeg|webp|ico|css|js|json|xml|txt|webmanifest)$/.test(target)) {
      if (!publicFiles.has(target) && !existsSync(join(outDir, target.slice(1)))) {
        console.error(`broken asset: ${f.slice(outDir.length)} -> ${target}`);
        broken += 1;
      }
      continue;
    }
    const route = target.endsWith("/") && target !== "/" ? target.slice(0, -1) : target;
    if (!routes.has(route)) {
      // Maybe a directory export: out<route>/index.html without trailing slash
      // in routes — already normalized above, so this is genuinely missing.
      console.error(`broken link: ${f.slice(outDir.length)} -> ${target}`);
      broken += 1;
    }
  }
}

console.log(`check-links: ${files.length} pages, ${routes.size} routes, ${broken} broken`);
if (broken > 0) process.exit(1);
