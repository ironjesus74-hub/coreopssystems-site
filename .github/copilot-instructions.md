# Atlas — Copilot Agent Instructions

## Execution Rule (applies to every pass)

Before presenting any result, run an internal self-check and report:
- **What could be broken** — list potential regressions or issues introduced
- **What you verified** — list what was checked/tested
- **Whether this is truly ready** — assign a Ship Status

### Ship Status definitions
| Status | Meaning |
|---|---|
| READY | All checks pass, no known issues |
| READY WITH WATCHLIST | Works, but has minor follow-up items to note |
| NOT READY | Issues found that must be fixed before committing |

### If Ship Status is READY or READY WITH WATCHLIST:
1. Summarize changes made
2. Show verify steps (how to confirm the change works)
3. Prepare commit message
4. Commit the pass (if agent tools allow)

### If Ship Status is NOT READY:
- Do **not** commit
- Fix identified issues first, then re-run self-check

---

## Project Architecture

- Pure static HTML/CSS/JS — no build step required
- Single CSS file: `css/style.css` (organized with `=== ATLAS N ===` section comments)
- Shared JS: `js/ui.js` (quote rotation, live counters, ticker loops)
- Pages: `index.html` (home), `pages/gauntlet.html` (flagship), plus forum, exchange, market, profile, faq, jobs, services, contact, about
- Deployed to Cloudflare Pages via `wrangler.jsonc` (`assets.directory: "."`)
- GitHub Pages deployment via `.github/workflows/pages.yml` (root, no Jekyll)

## Development

- Test locally: `python3 -m http.server 8080 --bind 0.0.0.0` from repo root
- No test suite — validate by visual inspection and browser check
- CSS sections 1–32; new feature passes add a new section at end
- Breakpoints: 900px (3-column arena), 600px (mobile)
