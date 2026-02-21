#!/data/data/com.termux/files/usr/bin/bash
set -e

OUT="termux_env_report.txt"
: > "$OUT"

echo "=== Termux Environment Report ===" >> "$OUT"
echo "Date: $(date)" >> "$OUT"
echo "PWD:  $(pwd)" >> "$OUT"
echo "" >> "$OUT"

echo "--- System ---" >> "$OUT"
uname -a >> "$OUT" 2>&1 || true
echo "" >> "$OUT"

echo "--- Termux packages (top) ---" >> "$OUT"
pkg list-installed 2>/dev/null | head -n 80 >> "$OUT" || echo "(pkg list-installed failed)" >> "$OUT"
echo "" >> "$OUT"

echo "--- Node / npm / pnpm / yarn ---" >> "$OUT"
command -v node >/dev/null && echo "node: $(node -v)" >> "$OUT" || echo "node: (missing)" >> "$OUT"
command -v npm  >/dev/null && echo "npm:  $(npm -v)"  >> "$OUT" || echo "npm:  (missing)" >> "$OUT"
command -v pnpm >/dev/null && echo "pnpm: $(pnpm -v)" >> "$OUT" || echo "pnpm: (missing)" >> "$OUT"
command -v yarn >/dev/null && echo "yarn: $(yarn -v)" >> "$OUT" || echo "yarn: (missing)" >> "$OUT"
echo "" >> "$OUT"

echo "--- Global npm packages ---" >> "$OUT"
npm list -g --depth=0 >> "$OUT" 2>&1 || echo "(npm list -g failed)" >> "$OUT"
echo "" >> "$OUT"

echo "--- Git ---" >> "$OUT"
git --version >> "$OUT" 2>&1 || true
echo "Remotes:" >> "$OUT"
git remote -v >> "$OUT" 2>&1 || true
echo "" >> "$OUT"

echo "--- Project files (top) ---" >> "$OUT"
ls -la >> "$OUT" 2>&1 || true
echo "" >> "$OUT"

echo "--- Tree (depth 3) ---" >> "$OUT"
find . -maxdepth 3 -type f | sed 's|^\./||' | head -n 220 >> "$OUT"
echo "" >> "$OUT"

if [ -f package.json ]; then
  echo "--- package.json ---" >> "$OUT"
  cat package.json >> "$OUT"
  echo "" >> "$OUT"
fi

if [ -f vite.config.js ]; then
  echo "--- vite.config.js ---" >> "$OUT"
  cat vite.config.js >> "$OUT"
  echo "" >> "$OUT"
fi

if [ -f wrangler.toml ]; then
  echo "--- wrangler.toml ---" >> "$OUT"
  cat wrangler.toml >> "$OUT"
  echo "" >> "$OUT"
fi

echo "DONE. Wrote: $OUT"
