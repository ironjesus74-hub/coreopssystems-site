#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" || exit 1
cd docs || exit 1

TS="$(date +%Y%m%d_%H%M%S)"
echo "[1/3] backup pay_config.js..."
[ -f pay_config.js ] && cp -v pay_config.js "pay_config.js.bak.$TS" || {
  echo "pay_config.js not found in docs/. Run the earlier pay patch first."
  exit 1
}

echo "[2/3] patch pay_config.js with PayPal links..."
python - <<'PY'
from pathlib import Path
import re, sys

p = Path("pay_config.js")
s = p.read_text(encoding="utf-8", errors="ignore")

updates = {
  "sec-surface":      "https://www.paypal.com/ncp/payment/6DDVZZG4AWKCW",  # Surface Scan
  "dev-briefsmith":   "https://www.paypal.com/ncp/payment/79RDK5SCDE7DQ",  # Briefscan/Briefsmith
  "ops-janitor":      "https://www.paypal.com/ncp/payment/X9JEZGZN5PEDE",  # Ops Janitor
  "creator-clipline": "https://www.paypal.com/ncp/payment/ZU5AA47JRE6M6",  # Dev-Clipline
  "deploy-sentinel":  "https://www.paypal.com/ncp/payment/ML876QAGEPPXY",  # Deploy Sentinel
}

def set_link(text: str, item_id: str, link: str) -> str:
  # find:  "id": { ... paypalLink: "...." }
  # replace paypalLink value inside that object
  pat_block = rf'("{re.escape(item_id)}"\s*:\s*\{{.*?\}})'
  m = re.search(pat_block, text, flags=re.S)
  if not m:
    raise ValueError(f"Could not find item id in pay_config.js: {item_id}")
  block = m.group(1)
  # replace paypalLink: "..."
  if re.search(r'paypalLink\s*:\s*"', block):
    block2 = re.sub(r'paypalLink\s*:\s*"[^"]*"', f'paypalLink: "{link}"', block, count=1)
  else:
    # insert paypalLink if missing
    block2 = re.sub(r'\{\s*', '{ paypalLink: "' + link + '", ', block, count=1)
  return text[:m.start(1)] + block2 + text[m.end(1):]

changed = []
for item_id, link in updates.items():
  s = set_link(s, item_id, link)
  changed.append(item_id)

p.write_text(s, encoding="utf-8")
print("Updated PayPal links for:", ", ".join(changed))
PY

echo "[3/3] quick sanity check..."
grep -n "paypalLink" pay_config.js | head -n 50 || true
echo "DONE ✅"
