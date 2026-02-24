#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "== Link probe (best-effort) =="

# Extract links from pay_config.js
python3 - <<'PY' 2>/dev/null || python - <<'PY'
import re, pathlib
p = pathlib.Path("docs/pay_config.js")
s = p.read_text(errors="ignore")

# donateLink can appear as assignment OR in object; capture both styles
donate = ""
m = re.search(r'donateLink\s*=\s*"([^"]+)"', s)
if m: donate = m.group(1)
else:
    m2 = re.search(r'donateLink:\s*"([^"]+)"', s)
    if m2: donate = m2.group(1)

cash = ""
m = re.search(r'cashappLink\s*=\s*"([^"]+)"', s)
if m: cash = m.group(1)
else:
    m2 = re.search(r'cashappLink:\s*"([^"]+)"', s)
    if m2: cash = m2.group(1)

# per-item paypal links
links = re.findall(r'paypalLink:\s*"([^"]+)"', s)

# Keep unique, non-empty
uniq = []
seen = set()
for x in [donate, cash, *links]:
    x = (x or "").strip()
    if not x or x in seen: 
        continue
    seen.add(x)
    uniq.append(x)

print("COUNT", len(uniq))
for u in uniq[:30]:
    print(u)
PY

# Probe them (do not fail job)
echo ""
echo "Probing up to 30 links (2xx/3xx is OK):"
python3 - <<'PY' 2>/dev/null || python - <<'PY'
import subprocess, sys, re
lines = sys.stdin.read().splitlines()
# Accept piped input too (if any)
PY
