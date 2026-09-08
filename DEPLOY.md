# Deploying breachpilot.dev

Static Next.js export (`output: "export"`). Any static host works.

```bash
npm ci
npm run build    # prebuild syncs docs from the sibling BreachPilot checkout; output in out/
```

Serve `out/` at `https://breachpilot.dev`.

## Critical: installer routes

`/install.sh` and `/install.ps1` are real files in `public/` and are copied
verbatim into `out/`. They **must return the script bytes** with a script
content type — never an HTML page:

- `/install.sh` → `Content-Type: text/x-shellscript; charset=utf-8`
- `/install.ps1` → `Content-Type: text/plain; charset=utf-8`

Rules:

1. **No SPA fallback rewrites for these paths.** If the host rewrites unknown
   paths to `index.html` (common SPA default), add explicit pass-throughs for
   `/install.sh` and `/install.ps1` first. `public/_headers` documents the
   Netlify / Cloudflare Pages header format.
2. **Short cache.** `Cache-Control: public, max-age=300` so installer updates
   propagate within minutes. The scripts hand off to the repository's own
   `install.sh` / `install.bat` after clone, so most churn lives there — but
   keep this cache short anyway.
3. **Verify after deploy:**

```bash
curl -sI https://breachpilot.dev/install.sh | grep -i "content-type"
curl -s https://breachpilot.dev/install.sh | head -n 3   # must be #!/usr/bin/env bash
curl -sI https://breachpilot.dev/install.ps1 | grep -i "content-type"
```

## Security headers

`public/_headers` lists the recommended set (CSP, nosniff, referrer,
permissions, framing). Translate to your host's format — e.g. `vercel.json`
`headers`, nginx `add_header`, or Cloudflare Transform Rules. The CSP is
deliberately static-site shaped (`script-src 'self' 'unsafe-inline'` covers
the Next.js runtime + theme init; no external scripts are loaded).

## Notes

- No server component needs a server: GitHub stats load client-side from
  `api.github.com` and degrade gracefully offline.
- Docs are synced at build time from the sibling BreachPilot checkout
  (`scripts/sync-docs.mjs`); the synced `content/docs/` copies are committed,
  and `public/.well-known/security.txt` is regenerated each build (fresh
  `Expires`). Never hand-edit either — fix the generator or upstream docs.
- next.config.mjs leaves `trailingSlash` unset (extensionless clean URLs).
  Whatever the host does for `/install` vs `/install/`, assert the exact
  `/install.sh` and `/install.ps1` paths return script bytes with no
  redirect or rewrite (see the curl checks above).
- GitHub Pages is not a supported target (no `.nojekyll`: Jekyll would 404
  `_next` assets). Use Netlify, Cloudflare Pages, Vercel static, or any
  plain static host.
- No analytics ship with the site. If any are added later, prefer
  privacy-preserving analytics and document them on `/privacy`.
