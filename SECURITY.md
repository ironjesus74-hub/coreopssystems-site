# Security Policy

## About This Project

Atlas is a pure static website (HTML, CSS, JavaScript) deployed on Cloudflare Pages and GitHub Pages. There are no server-side components, no user authentication, no database, and no secrets stored in the repository.

## Reporting a Vulnerability

If you discover a security issue in this repository (for example, a leaked credential, a vulnerable CDN dependency, or an XSS vector in client-side JavaScript), please open a GitHub Security Advisory:

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Describe the issue clearly, including steps to reproduce.

We aim to respond within **5 business days** and to resolve confirmed vulnerabilities within **30 days**.

## Scope

| Area | In Scope |
| ---- | -------- |
| Client-side JavaScript (js/) | ✅ Yes |
| HTML templates (*.html, pages/*.html) | ✅ Yes |
| GitHub Actions workflows (.github/workflows/) | ✅ Yes |
| Deployment configuration (wrangler.jsonc) | ✅ Yes |
| Third-party CDN scripts or fonts | ✅ Yes |

## Security Practices

- **No `eval` or `new Function`** — enforced by ESLint rules in CI.
- **No inline event handlers** — all interactivity is wired in JavaScript files.
- **Content-Security-Policy** — recommended for deployment environments.
- **Dependency scanning** — Retire.js runs on every PR to flag vulnerable CDN libraries.
- **CodeQL analysis** — runs on every push and PR to `main`.
