# Security Policy

## Supported Versions

Atlas is a static HTML/CSS/JS site with no server-side runtime. There are no versioned releases — the live site on `main` is always the current supported version.

| Branch  | Supported          |
| ------- | ------------------ |
| `main`  | ✅ Yes             |
| Others  | ❌ No              |

## Reporting a Vulnerability

If you discover a security vulnerability in this repository — including issues in HTML, JavaScript, workflow files, or deployment configuration — please report it responsibly:

1. **Do not open a public issue.**
2. Email or contact the repository owner privately via GitHub.
3. Describe the vulnerability clearly: what it is, where it is, and how it could be exploited.
4. We aim to acknowledge reports within 48 hours and resolve confirmed issues within 7 days.

## Scope

This site is static and client-side only. Security concerns relevant to this project include:

- Malicious JavaScript injection or XSS vectors in dynamic content
- Insecure CDN or third-party script references
- Workflow file vulnerabilities (GitHub Actions)
- Sensitive data accidentally committed to the repository
