# Atlas — Built Different

> The AI-powered intelligence arena for operators who think differently. Compete, trade signals, and build edge.

🌐 **Live site:** [atlas.coreopssystems.com](https://atlas.coreopssystems.com/)

---

## Overview

Atlas is a pure static HTML/CSS/JS platform built by [CoreOps Systems](https://coreopssystems.com). It delivers a real-time operator experience across six product areas:

| Page | Path | Description |
|---|---|---|
| **Home** | `index.html` | Live ticker, hero, stats, and featured sections |
| **Atlas Gauntlet** | `pages/gauntlet.html` | AI rivalry arena — seeded matchups, live heat & scoring |
| **Signal Feed** | `pages/forum.html` | Operator signal posts and community discussion |
| **Market** | `pages/market.html` | Market data and intelligence cards |
| **Atlas Exchange** | `pages/exchange.html` | Asset trading and exchange interface |
| **Atlas ID** | `pages/profile.html` | Operator profile and identity system |
| **Store** | `pages/store.html` | Tools, passes, and intelligence packs |
| **Pricing** | `pages/pricing.html` | Plan tiers and feature comparison |
| **FAQ** | `pages/faq.html` | Common questions and answers |
| **Jobs** | `pages/jobs.html` | Careers at CoreOps Systems |
| **Services** | `pages/services.html` | Service offerings |
| **Contact** | `pages/contact.html` | Get in touch |
| **About** | `pages/about.html` | Our story and mission |

---

## Tech Stack

- **Pure static** HTML5 / CSS3 / vanilla JavaScript — no build step, no framework, no npm
- **CSS:** Single file `css/style.css` (~6,400 lines), organized in numbered `ATLAS N` sections with CSS custom property design tokens
- **JS:** Shared `js/ui.js` (quote rotation, live counters, ticker loops) + per-page JS files
- **Font:** [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts preconnect
- **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/) (git integration) — configured via `wrangler.jsonc`; API routes served via `functions/api/` Pages Functions

---

## Getting Started

No install required. Just serve the files:

```bash
# Clone the repo
git clone https://github.com/ironjesus74-hub/coreopssystems-site.git
cd coreopssystems-site

# Start a local server
python3 -m http.server 8080 --bind 0.0.0.0
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

> Tested on Chrome and Firefox. Responsive at 1220px+ (desktop), 900px (tablet), and 600px (mobile).

---

## Project Structure

```
coreopssystems-site/
├── index.html              # Home page
├── pages/                  # All secondary pages
│   ├── gauntlet.html       # Atlas Gauntlet arena (flagship)
│   ├── forum.html          # Signal Feed
│   ├── market.html         # Market
│   ├── exchange.html       # Atlas Exchange
│   ├── profile.html        # Atlas ID
│   ├── store.html          # Store
│   ├── pricing.html        # Pricing
│   ├── faq.html            # FAQ
│   ├── jobs.html           # Jobs
│   ├── services.html       # Services
│   ├── contact.html        # Contact
│   └── about.html          # About
├── css/
│   └── style.css           # All styles (~6400 lines, ATLAS 1–35 sections)
├── js/
│   ├── ui.js               # Shared: quotes, live counters, ticker loops
│   ├── home.js             # Home page
│   ├── gauntlet.js         # Gauntlet arena engine
│   ├── exchange.js         # Exchange
│   ├── forum.js            # Signal Feed
│   ├── market.js           # Market
│   ├── faq.js              # FAQ
│   ├── profile.js          # Atlas ID
│   ├── jobs.js             # Jobs
│   ├── store.js            # Store
│   ├── pricing.js          # Pricing
│   ├── services.js         # Services
│   ├── contact.js          # Contact
│   └── about.js            # About
├── og-image.png            # Open Graph / Twitter card image
├── .nojekyll               # Disable Jekyll for GitHub Pages
├── wrangler.jsonc          # Cloudflare Pages config
└── eslint.config.mjs       # ESLint config (security + quality rules)
```

---

## CI / CD

| Workflow | File | Trigger | Purpose |
|---|---|---|---|
| Deploy to Cloudflare Pages | *(git integration)* | Push to `main` | Cloudflare Pages auto-deploys via git integration |
| CodeQL & CI Security Gate | `.github/workflows/codeql.yml` | Push / PR to `main` | CodeQL SAST, ESLint, HTMLHint, Retire.js |

The security gate checks:
- **CodeQL** — JavaScript/TypeScript and Actions SAST analysis
- **ESLint** — JavaScript quality and security rules (`no-eval`, `no-implied-eval`, `no-new-func`)
- **HTMLHint** — HTML validity and best practices
- **Retire.js** — CDN dependency vulnerability scanning

---

## Development Guidelines

- All CSS lives in `css/style.css` — never create separate CSS files
- Add a new `/* ===== ATLAS N — description ===== */` section at the bottom for each major feature pass
- Always use CSS custom properties (e.g. `--blue`, `--panel`, `--text`) — never hardcode hex values
- JS ticker loops: HTML contains unique `<span>` elements only; `initTickerLoops()` in `ui.js` doubles them at runtime for the seamless CSS `translateX(-50%)` animation
- Desktop-first; main stage uses `1220px` max-width. Breakpoints: `900px` (tablet), `600px` (mobile)

---

## Security

See [SECURITY.md](./SECURITY.md) for the vulnerability disclosure policy.

---

## Contact

Built by **CoreOps Systems**. Questions? Reach out via [the contact page](https://atlas.coreopssystems.com/pages/contact.html) or open a GitHub issue.
