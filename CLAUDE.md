# breachpilot-site

Static marketing + docs site for BreachPilot. Next.js 14 with `output: "export"`, React 18, Tailwind, TypeScript. No server, no analytics, no external scripts.

## Commands

```bash
npm run dev        # localhost:3001
npm run build      # prebuild syncs docs, output in out/
npm run lint
npm run typecheck  # tsc --noEmit
```

Node >= 18.18. Serve `out/` as static files (see DEPLOY.md).

## Docs sync (important)

`npm run build` runs `scripts/sync-docs.mjs` first: it wipes and re-copies Markdown from the sibling `../docs` dir (the main BreachPilot repo — clone this repo next to it) into `content/docs/`, and regenerates `public/search-index.json`. The synced copies are committed. Never hand-edit `content/docs/` — fix upstream docs instead.

## Conventions

- `lib/site.ts` is the single source of truth: `SITE` (urls, tagline), `METRICS`, `NAV_LINKS`, `FOOTER_COLS`, swarm/plugin/provider catalogs. Update numbers there, not in components.
- Path alias `@/` maps to repo root (`components/`, `lib/`).
- Theme: `localStorage` key `breachpilot-theme`, init script in `app/layout.tsx` — keep it inline (CSP allows `'unsafe-inline'`, no external scripts).
- Dev/start port is 3001 (3000 is typically taken by the main BreachPilot WebUI).

## Deploy gotchas

- `public/install.sh` and `public/install.ps1` are copied verbatim into `out/` and must be served as script bytes — no SPA fallback rewrites on those paths. Verify with the curl checks in DEPLOY.md.
- Security headers live in `public/_headers` (Netlify/Cloudflare format) — translate per host.

## Content rules

- Every page touching attack tooling must keep the authorized-testing-only framing (see the safety strip on `app/page.tsx`, `/safety` route). Don't soften it.
- No hardcoded absolute local paths or personal usernames in docs examples — use placeholders like `C:\BreachPilot\...`.
