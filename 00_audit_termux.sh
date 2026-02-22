#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

OUT="atlas-termux-report.txt"
{
  echo "=== ATLAS TERMUX AUDIT ==="
  date
  echo

  echo "== Termux info =="
  echo "PREFIX: $PREFIX"
  echo "HOME:   $HOME"
  echo "PWD:    $PWD"
  echo

  echo "== OS/Arch =="
  uname -a || true
  echo

  echo "== Core tools =="
  for c in git gh curl wget node npm python pip ruby go make gcc clang pkg; do
    if command -v "$c" >/dev/null 2>&1; then
      printf "%-6s : " "$c"
      "$c" --version 2>/dev/null | head -n 1 || echo "(version not available)"
    else
      printf "%-6s : (missing)\n" "$c"
    fi
  done
  echo

  echo "== Storage permission =="
  if [ -d "/storage/emulated/0" ]; then
    echo "OK: /storage/emulated/0 exists (termux-setup-storage likely done)"
  else
    echo "MISSING: run 'termux-setup-storage' (one time) if you want phone storage access"
  fi
  echo

  echo "== pkg list (top 120) =="
  (pkg list-installed 2>/dev/null || true) | head -n 120
  echo

  echo "== Git status (if repo) =="
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git status -sb || true
    echo
    echo "== Remotes =="
    git remote -v || true
  else
    echo "Not inside a git repo in: $PWD"
  fi
  echo

  echo "== IMPORTANT =="
  echo "Do NOT paste tokens here. This report does not read them."
} > "$OUT"

echo "Wrote: $OUT"
echo "Tip: open it with:  nano $OUT"
