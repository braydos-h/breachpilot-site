# Changelog

All notable changes to the breachpilot.dev site. Dates in UTC.

## [Unreleased]

- CI workflow (lint, typecheck, build) with BreachPilot docs fetched as the prebuild sync source.
- README, deploy notes, `.gitignore`.

## [0.1.0] — 2026-09-07

- Initial site: home, features (+ swarm), architecture, benchmarks, install, docs (+ search), plugins, providers, safety, security, privacy, legal, contributing.
- Docs synced at build time from the main BreachPilot repo (`scripts/sync-docs.mjs`); search index generated at prebuild.
- Static export (`output: "export"`) served from `out/`; installer entrypoints at `/install.sh` and `/install.ps1`.
