#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "== Site smoke test =="

req=(
  docs/index.html
  docs/app.js
  docs/data.js
  docs/pay.js
  docs/pay_config.js
  docs/styles.css
)
for f in "${req[@]}"; do
  if [ ! -f "$f" ]; then
    echo "MISSING: $f"
    exit 1
  fi
done

# Parse check
node --check docs/app.js
node --check docs/pay.js
node --check docs/pay_config.js

# Quick HTML sanity
grep -q 'data-route="market"' docs/index.html || echo "WARN: market route string not found (may be fine)"
grep -q 'id="donateBtn"' docs/index.html || echo "WARN: donateBtn id not found (may be fine)"

echo "OK"
