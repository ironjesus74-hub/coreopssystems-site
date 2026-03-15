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

- Pure static HTML/CSS/JS — no build step, no framework, no npm
- Single CSS file: `css/style.css` (8600+ lines, organized with `=== ATLAS N ===` section comments; sections 1–41 as of latest pass)
- Shared JS: `js/ui.js` (quote rotation, live counters, ticker loops — included on every page)
- Per-page JS files in `js/`: `home.js`, `gauntlet.js`, `exchange.js`, `forum.js`, `market.js`, `faq.js`, `profile.js`, `jobs.js`, `services.js`, `contact.js`, `about.js`, `store.js`, `pricing.js`, `atlas-assistant.js`
- Pages: `index.html` (home), `pages/gauntlet.html` (flagship arena), `pages/forum.html`, `pages/exchange.html`, `pages/market.html`, `pages/profile.html`, `pages/faq.html`, `pages/jobs.html`, `pages/services.html`, `pages/contact.html`, `pages/about.html`, `pages/store.html`, `pages/pricing.html`
- Deployed to **Cloudflare Pages** (git integration) via `wrangler.jsonc` (`name: "atlas-engine"`, `pages_build_output_dir: "."`)
- API routes served via Cloudflare Pages Functions in `functions/api/` — no separate Worker needed
- `.nojekyll` is present at repo root; `_config.yml` is a safety net only — the primary deploy is Cloudflare Pages, not GitHub Pages

---

## Development

- **Local server:** `python3 -m http.server 8080 --bind 0.0.0.0` from repo root
- **No build step** — edit files directly, refresh browser to verify
- **No test suite** — validate by visual inspection and browser check across Chrome/Firefox
- **Linting:** none automated; keep HTML valid and CSS consistent with existing patterns

---

## CSS Conventions

- All CSS lives in `css/style.css`; never create separate CSS files
- Sections are delimited with `/* ===== ATLAS N — description ===== */` comments
- Each major feature pass appends a **new numbered section** at the end; only edit prior sections to fix bugs or refactor shared patterns — avoid gratuitous changes to settled code
- Design tokens are CSS custom properties on `:root`:
  - Colors: `--bg`, `--bg2`, `--panel`, `--panel2`, `--text`, `--muted`, `--blue`, `--blue2`, `--red`, `--red2`, `--violet`, `--green`
  - Shadows: `--shadow-blue`, `--shadow-red`
  - Line: `--line` (rgba white at 8% opacity)
- **Always use these variables** — never hardcode color hex values
- Desktop-first layout; the main stage uses a fixed `1220px` max-width
- Responsive breakpoints: `@media (max-width: 900px)` (tablets / 3-column collapse), `@media (max-width: 600px)` (mobile)
- Font: `Inter` loaded via Google Fonts preconnect in every HTML `<head>`; body `font-family: 'Inter', Arial, sans-serif`

---

## HTML Conventions

- Every HTML page includes Google Fonts preconnect links and `<link rel="stylesheet" href="../css/style.css">` (or `css/style.css` for root-level pages)
- Nav structure (7 items): Home → Atlas Gauntlet → Signal Feed → Market → Atlas Exchange → Atlas ID → FAQ
- Footer nav mirrors the header nav
- Shared UI script tag: `<script src="../js/ui.js"></script>` (or `js/ui.js` for root pages) before the page-specific script
- Use `class="site-shell"` as the top-level wrapper; flagship Gauntlet page adds `class="site-shell gauntlet-live-page"` for ATLAS 33 overrides

---

## JavaScript Conventions

- `js/ui.js` initializes on `DOMContentLoaded`: quote rotation (`initQuoteSystem`), live counter drift (`initLiveCounters`), and ticker loops (`initTickerLoops`)
- **Ticker loops:** HTML tickers contain only unique `<span>` elements inside `.live-ticker-track`; `initTickerLoops()` doubles them at runtime for seamless CSS animation (`@keyframes tickerMove` goes `translateX(-50%)`)
- **Quotes:** Rendered into any `.atlas-quote-block` container; pool shuffled randomly on each page load
- **Live counters:** Elements with `[data-live-count]` attribute drift ±1–3% on a timer
- Per-page JS files handle page-specific interactions; keep `ui.js` free of page-specific logic

---

## Naming & Class Conventions

- BEM-inspired but not strict; prefer descriptive hyphenated class names (e.g., `gauntlet-arena-mesh`, `conflict-scan-ring`, `fighter-accent-bar`)
- Gauntlet page-specific classes are all prefixed with `gauntlet-` or `conflict-` or `engine-`
- Live data elements use `data-live-count` attribute for auto-drift
- Signal/forum posts use `.signal-post`, `.signal-meta`, `.signal-text` pattern
- Market/exchange cards use `.market-card`, `.exchange-card` pattern

---

## Adding New Features

1. Add HTML markup to the relevant page
2. Add a new CSS section at the bottom of `css/style.css` with the next ATLAS number
3. Add JS logic to the relevant per-page JS file (or `ui.js` if shared across pages)
4. Test locally with `python3 -m http.server 8080 --bind 0.0.0.0`
5. Verify at both 1220px+ desktop and 600px mobile widths
6. Never introduce npm, build tools, or external JS libraries
