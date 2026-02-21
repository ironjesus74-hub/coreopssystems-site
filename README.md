# ATLAS Guard (nano-bot) starter pack

This adds a GitHub Actions workflow that prevents broken pushes by checking:

- `index.html`, `style.css`, `script.js` exist
- `node --check script.js` passes (catches syntax errors that break buttons)

## Install (copy/paste)

From your repo root (the folder that has `index.html`), run:

```bash
unzip atlas-guard-starter.zip -d .
git add .github/workflows/atlas-guard.yml
git commit -m "CI: add ATLAS Guard"
git push origin main
```

## Live logs (from Termux)

```bash
gh run list --limit 10
RID=$(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
gh run watch "$RID"
```

## Optional: run on *all* branches

Edit `.github/workflows/atlas-guard.yml` and change:

```yaml
branches: ["main"]
```

to:

```yaml
branches: ["**"]
```

(or remove the `branches:` line entirely).

## Recommended: protect main (2 taps)

GitHub repo → Settings → Branches → Add rule for `main`:
- Require status checks to pass before merging
- Select **ATLAS Guard**
