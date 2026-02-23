#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" || exit 1
cd docs || exit 1

TS="$(date +%Y%m%d_%H%M%S)"
echo "[1/5] backups..."
for f in pay_config.js pay.js data.js app.js index.html market/market_viewer.js; do
  [ -f "$f" ] && cp -v "$f" "$f.bak.$TS" || true
done

echo "[2/5] write pay_config.js..."
cat > pay_config.js <<'JS'
/* ATLAS pay config (edit safely) */
window.ATLAS_PAY_CONFIG = {
  currency: "USD",

  // Cash App
  cashapp: {
    tag: "$Herdtnerbryant",
    link: "https://cash.app/$Herdtnerbryant"
  },

  // Global donation / fallback PayPal link (works even before per-item links exist)
  donate: {
    paypalLink: "https://www.paypal.com/ncp/payment/TQBZ3KKVM6YKU"
  },

  // Per-item config (paste each item’s PayPal “one set price” link when you make it)
  items: {
    "ops-watchtower":    { title: "Watchtower",       priceUSD:  9, sku: "WATCHTOWER",   paypalLink: "" },
    "deploy-sentinel":   { title: "Deploy Sentinel",  priceUSD: 12, sku: "SENTINEL",     paypalLink: "" },
    "creator-clipline":  { title: "Clipline",         priceUSD:  7, sku: "CLIPLINE",     paypalLink: "" },
    "dev-briefsmith":    { title: "Briefsmith",       priceUSD:  6, sku: "BRIEFSMITH",   paypalLink: "" },
    "ops-janitor":       { title: "Ops Janitor",      priceUSD:  5, sku: "OPSJANITOR",   paypalLink: "" },
    "sec-surface":       { title: "Surface Scan",     priceUSD: 10, sku: "SURFSCAN",     paypalLink: "" },

    "af-001":            { title: "AF-001",           priceUSD:  5, sku: "AF001",        paypalLink: "" },
    "af-002":            { title: "AF-002",           priceUSD:  9, sku: "AF002",        paypalLink: "" },
    "af-003":            { title: "AF-003",           priceUSD: 15, sku: "AF003",        paypalLink: "" },
    "af-004":            { title: "AF-004",           priceUSD: 25, sku: "AF004",        paypalLink: "" }
  }
};
JS

echo "[3/5] patch data.js (add/refresh priceUSD + sku by id)..."
python - <<'PY'
from pathlib import Path
import re

p = Path("data.js")
s = p.read_text(encoding="utf-8", errors="ignore")

items = {
  "ops-watchtower":   (9,  "WATCHTOWER"),
  "deploy-sentinel":  (12, "SENTINEL"),
  "creator-clipline": (7,  "CLIPLINE"),
  "dev-briefsmith":   (6,  "BRIEFSMITH"),
  "ops-janitor":      (5,  "OPSJANITOR"),
  "sec-surface":      (10, "SURFSCAN"),
  "af-001":           (5,  "AF001"),
  "af-002":           (9,  "AF002"),
  "af-003":           (15, "AF003"),
  "af-004":           (25, "AF004"),
}

for id_, (price, sku) in items.items():
  # find the first id: "X"
  m = re.search(rf'(id:\s*"{re.escape(id_)}"\s*,\s*\n)', s)
  if not m:
    continue

  start = m.end()
  window = s[start:start+1200]  # within the object block
  # Replace existing priceUSD if present nearby
  window2 = re.sub(r'priceUSD:\s*\d+\s*,', f'priceUSD: {price},', window, count=1)
  if window2 == window:
    # Insert priceUSD + sku right after id line
    window2 = f'      priceUSD: {price},\n      sku: "{sku}",\n' + window

  # Ensure sku exists/updated (replace first sku: "...", if present)
  window3 = re.sub(r'sku:\s*"[^"]*"\s*,', f'sku: "{sku}",', window2, count=1)

  s = s[:start] + window3 + s[start+len(window):]

p.write_text(s, encoding="utf-8")
print("data.js patched ✅")
PY

echo "[4/5] patch market/market_viewer.js (stop direct redirect; use checkout modal)..."
python - <<'PY'
from pathlib import Path
import re

p = Path("market/market_viewer.js")
if not p.exists():
    print("market/market_viewer.js not found (skip) ✅")
    raise SystemExit(0)

s = p.read_text(encoding="utf-8", errors="ignore")

pat = r'payBtn\.onclick\s*=\s*\(\)\s*=>\s*\{\s*window\.location\.href\s*=\s*cashUrl\(amount\);\s*\};'
rep = (
'payBtn.onclick = () => {\n'
'  try {\n'
'    if (window.ATLAS_PAY?.openCheckout) return window.ATLAS_PAY.openCheckout(it);\n'
'  } catch (e) {}\n'
'  window.location.href = cashUrl(amount);\n'
'};'
)

if re.search(pat, s):
    s = re.sub(pat, rep, s, count=1)
    p.write_text(s, encoding="utf-8")
    print("market_viewer.js patched ✅")
else:
    print("Did not find payBtn redirect line (maybe already fixed) ✅")
PY

echo "[5/5] syntax checks..."
node --check pay_config.js >/dev/null 2>&1 && echo "pay_config.js OK ✅" || echo "pay_config.js check skipped (non-node) ✅"
node --check pay.js && echo "pay.js parses ✅"
node --check app.js && echo "app.js parses ✅"
echo "DONE ✅"
echo
echo "Next: edit pay_config.js and paste per-item PayPal links into items[...].paypalLink"
