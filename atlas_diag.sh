#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "=== ATLAS TERMUX DIAGNOSTICS (SAFE) ==="
echo "Time: $(date)"
echo

echo "[System]"
uname -a || true
echo "PREFIX: ${PREFIX:-"(unset)"}"
echo "HOME:   ${HOME:-"(unset)"}"
echo "PWD:    $(pwd)"
echo

echo "[Tooling Versions]"
command -v git >/dev/null && git --version || echo "git: missing"
command -v node >/dev/null && node --version || echo "node: missing"
command -v npm  >/dev/null && npm --version  || echo "npm: missing"
command -v python >/dev/null && python --version || echo "python: missing"
command -v curl >/dev/null && curl --version | head -n 1 || echo "curl: missing"
echo

echo "[Git sanity (SAFE)]"
if command -v git >/dev/null; then
  git config --global --get user.name 2>/dev/null | sed 's/^/user.name: /' || true
  git config --global --get user.email 2>/dev/null | sed 's/^/user.email: /' || true
  echo "Remotes in current repo (if any):"
  git remote -v 2>/dev/null | sed 's/[[:space:]]\+/ /g' || echo "(not in a repo here)"
fi
echo

echo "[Project Finder]"
echo "Looking for likely website roots under HOME (max depth 4)..."
find "$HOME" -maxdepth 4 -type f \( -name "index.html" -o -name "package.json" -o -name "style.css" \) 2>/dev/null | head -n 60
echo

echo "[Tree (SAFE)]"
echo "If you're inside your site folder, this shows a safe tree (no hidden files):"
find . -maxdepth 2 -type f ! -path "*/.*" 2>/dev/null | sed 's|^\./||' | sort | head -n 200
echo

echo "=== DONE ==="
echo "Tip: if you paste output to me, blur any domain emails if you want privacy."
