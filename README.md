# breachpilot-site

Official public website for [BreachPilot](https://github.com/braydos-h/BreachPilot) — live at [breachpilot.dev](https://breachpilot.dev).

Static Next.js 14 export (React 18, Tailwind, TypeScript). No server, no analytics.

## Develop

Requires Node >= 18.18.

```bash
npm ci
npm run dev      # http://localhost:3001
```

## Build

```bash
npm run build    # output in out/
```

`prebuild` runs `scripts/sync-docs.mjs`, which copies Markdown from the sibling BreachPilot checkout (`../docs`, `../BreachPilot/docs`, or `BREACHPILOT_DOCS_DIR`) into `content/docs/` and generates `public/search-index.json`. The synced copies are committed so builds work without the sibling repo (reusing them with a warning); CI sets `STRICT_DOCS=1` to fail instead. Never hand-edit `content/docs/` — fix upstream docs instead.

Other checks:

```bash
npm run lint
npm run typecheck
npm run check:links   # after `npm run build`: broken internal links in out/
npm run check:a11y    # after `npm run build`: accessibility smoke test
npm start             # preview the static export at http://localhost:3001
```

## Deploy

Serve `out/` as static files. See [DEPLOY.md](DEPLOY.md) — notably `/install.sh` and `/install.ps1` must be served as script bytes (no SPA fallback), and security headers live in `public/_headers`.

## Structure

- `app/` — routes: home, features (+ `/swarm`), architecture, benchmarks, install, docs (+ search), plugins, providers, safety, security, privacy, legal, contributing
- `components/` — page sections, docs nav, search, install tabs
- `content/docs/` — synced at prebuild from upstream docs, committed (never hand-edit)
- `lib/` — site constants (`SITE`, metrics, nav), docs helpers
- `public/install.sh`, `public/install.ps1` — installer entrypoints, copied verbatim to `out/`
- `scripts/sync-docs.mjs` — docs sync run at prebuild

## License

Apache 2.0 — see [LICENSE](LICENSE).
