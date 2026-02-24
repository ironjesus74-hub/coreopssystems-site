#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "node: $(node --version 2>/dev/null || echo missing)"
echo "python: $(python3 --version 2>/dev/null || python --version 2>/dev/null || echo missing)"

node --check docs/app.js
node --check docs/pay.js
node --check docs/pay_config.js
bash -n docs/modules/watchtower/watchtower.sh
