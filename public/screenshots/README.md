# WebUI screenshots

Real BreachPilot console captures shown on the homepage (`Screenshots`
section in `components/home-sections.tsx`). No mockups, no fabricated UI —
only actual WebUI screenshots from a local lab run.

## Files (exact names, `.png`, 1200px+ wide)

| File | Shows |
| ---- | ----- |
| `run-creation.png` | New-run wizard: target, model, goal, allowlist review |
| `attack-graph.png` | ReactFlow attack graph with ready/blocked steps |
| `evidence-findings.png` | Findings + probe evidence + audit chain |
| `final-report.png` | Rendered report (Markdown/HTML export view) |

Missing files render a labeled placeholder naming the file to add — the
section never shows a broken image, and adding a file needs no code change.

## Rules

- Lab targets only: `127.0.0.1`, local lab hostnames. Redact any real IPs,
  tokens, keys, or target-identifying data before committing.
- Dark UI preferred (matches the site's dark-first screenshots, if any),
  either theme is fine — don't recolor or annotate beyond redaction boxes.
- Keep each file under ~500 KB (downscale/compress; screenshots don't need
  retina resolution to read).
