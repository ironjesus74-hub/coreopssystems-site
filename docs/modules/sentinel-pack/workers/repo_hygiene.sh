#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "Tracked weird colon files:"
git ls-files | grep -E '.*:.*' || echo "(none)"

echo ""
echo "Tracked backup files (.bak.):"
git ls-files | grep -E '\.bak\.' || echo "(none)"

echo ""
echo "PayPal SDK script tags (should be none):"
grep -RIn "paypal\.com/sdk/js" docs/index.html 2>/dev/null || echo "(none)"
