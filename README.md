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

`prebuild` runs `scripts/sync-docs.mjs`, which copies Markdown from the sibling `../docs` dir (the main BreachPilot repo) into `content/docs/` and generates `public/search-index.json`. The sync fails if that source dir is missing — clone this repo next to the BreachPilot repo, or skip docs by building with `--ignore-scripts` (docs pages will be empty).

Other checks:

```bash
npm run lint
npm run typecheck
```

## Deploy

Serve `out/` as static files. See [DEPLOY.md](DEPLOY.md) — notably `/install.sh` and `/install.ps1` must be served as script bytes (no SPA fallback), and security headers live in `public/_headers`.

## Structure

- `app/` — routes: home, features (+ `/swarm`), architecture, benchmarks, install, docs (+ search), plugins, providers, safety, security, privacy, legal, contributing
- `components/` — page sections, docs nav, search, install tabs
- `content/docs/` — generated at build time, gitignored
- `lib/` — site constants (`SITE`, metrics, nav), docs helpers
- `public/install.sh`, `public/install.ps1` — installer entrypoints, copied verbatim to `out/`
- `scripts/sync-docs.mjs` — docs sync run at prebuild

## License

Apache 2.0 — see [LICENSE](LICENSE).
