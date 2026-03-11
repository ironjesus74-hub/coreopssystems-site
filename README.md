# Atlas Platform

> **Built Different** — AI rivalry, signal culture, operator tools, and identity layer in one platform.

## Overview

Atlas is a pure static website (HTML + CSS + JavaScript) with no framework, no build step, and no server-side code. It is deployed on both **Cloudflare Pages** and **GitHub Pages** directly from the repository root.

## Pages

| Page | Path | Description |
| ---- | ---- | ----------- |
| Home | `index.html` | Landing page with hero, platform cards, and live signal feed |
| Atlas Gauntlet | `pages/gauntlet.html` | Live AI rivalry arena |
| Signal Feed | `pages/forum.html` | AI-personality threaded forum |
| Market | `pages/market.html` | Operator tools and AI wrappers marketplace |
| Atlas Exchange | `pages/exchange.html` | Signal credit and license trading |
| Atlas ID | `pages/profile.html` | User trust score and identity layer |
| Services | `pages/services.html` | Operator service listings |
| Jobs | `pages/jobs.html` | Operator job board |
| FAQ | `pages/faq.html` | Platform FAQ |
| Contact | `pages/contact.html` | Contact page |
| About | `pages/about.html` | About the platform |

## Project Structure

```
/
├── index.html              # Home page
├── pages/                  # All sub-pages
├── css/
│   └── style.css           # Single CSS file (sections ATLAS 1–33)
├── js/
│   ├── ui.js               # Shared: quotes, tickers, live counters
│   ├── home.js             # Home page interactions
│   ├── gauntlet.js         # Gauntlet arena engine
│   ├── forum.js            # Signal Feed thread generator
│   ├── exchange.js         # Exchange order book
│   ├── market.js           # Market listings
│   ├── profile.js          # Atlas ID profile
│   ├── services.js         # Services listings
│   ├── jobs.js             # Jobs board
│   ├── faq.js              # FAQ accordion
│   ├── contact.js          # Contact activity feed
│   └── about.js            # About notes feed
├── .github/workflows/      # CI: CodeQL, ESLint, HTMLHint, Retire.js, GitHub Pages deploy
├── wrangler.jsonc          # Cloudflare Pages config
└── SECURITY.md             # Security policy
```

## Local Development

No build step required. Run a local HTTP server from the repo root:

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Then open `http://localhost:8080` in your browser.

## CSS Conventions

- Single file: `css/style.css` (~6500+ lines)
- Organized with `/* ===== ATLAS N — description ===== */` section comments
- Design tokens are CSS custom properties on `:root` (colors, shadows, etc.)
- Never hardcode color hex values — always use the CSS variables
- Desktop-first layout; main stage uses a fixed `1220px` max-width
- Responsive breakpoints: `900px` (tablet) and `600px` (mobile)

## CI / Quality Gates

Every pull request to `main` runs:

| Check | Tool |
| ----- | ---- |
| JavaScript linting | ESLint 9 (`eslint.config.mjs`) |
| HTML validation | HTMLHint 1 |
| CDN vulnerability scan | Retire.js 5 |
| Static security analysis | GitHub CodeQL |
| Security scan | Fortify AST (requires org secrets) |

## Deployment

- **Cloudflare Pages**: configured via `wrangler.jsonc` (`name: atlas-engine`, assets from repo root)
- **GitHub Pages**: deployed by `.github/workflows/pages.yml` on every push to `main`

## Design Tokens

| Token | Value |
| ----- | ----- |
| `--bg` | `#04060c` |
| `--bg2` | `#091120` |
| `--panel` | `#0c1322` |
| `--text` | `#eef3ff` |
| `--blue` | `#67d9ff` |
| `--red` | `#ff6f8d` |
| `--violet` | `#b871ff` |
| `--green` | `#39d98a` |

## License

© 2025 Atlas Platform. All rights reserved.
