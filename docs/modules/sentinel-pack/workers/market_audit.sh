#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

python - <<'PY'
import re, pathlib, sys
data = pathlib.Path("docs/data.js").read_text(errors="ignore")
ids = sorted(set(re.findall(r'id:\s*"([^"]+)"', data)))

cfg = pathlib.Path("docs/pay_config.js").read_text(errors="ignore")
pairs = dict(re.findall(r'"([^"]+)":\s*\{[^}]*?paypalLink:\s*"([^"]*)"', cfg, flags=re.S))

missing = [i for i in ids if i not in pairs]
bad = [i for i in ids if i in pairs and not pairs[i].startswith("https://www.paypal.com/ncp/payment/")]

print("total ids:", len(ids))
print("missing:", missing)
print("bad links:", bad)

if missing or bad:
  sys.exit(1)
PY
