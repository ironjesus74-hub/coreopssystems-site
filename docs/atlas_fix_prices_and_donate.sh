#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd ~/project1/docs || exit 1

ts="$(date +%Y%m%d_%H%M%S)"
echo "[1/4] backups ($ts)..."
for f in pay_config.js pay.js; do
  [ -f "$f" ] && cp -v "$f" "$f.bak.$ts" || true
done

echo "[2/4] patch pay_config.js (Watchtower $12 + donate PayPal id)..."
python - <<'PY'
from pathlib import Path
import re

p = Path("pay_config.js")
s = p.read_text(encoding="utf-8", errors="ignore")

# 1) Ensure donate PayPal ID is correct
s = re.sub(
    r'(donate\s*:\s*\{\s*paypalId\s*:\s*")[A-Z0-9]+(")',
    r'\1TQBZ3KKVM6YKU\2',
    s
)

# 2) Watchtower: set priceUSD to 12
s = re.sub(
    r'("ops-watchtower"\s*:\s*\{[^}]*?priceUSD\s*:\s*)\d+',
    r'\g<1>12',
    s,
    flags=re.S
)

# 3) Watchtower: set PayPal id to your $12 link
s = re.sub(
    r'("ops-watchtower"\s*:\s*\{[^}]*?paypalId\s*:\s*")[A-Z0-9]+(")',
    r'\g<1>VBTZ3DASMJ7Y8\2',
    s,
    flags=re.S
)

p.write_text(s, encoding="utf-8")
print("pay_config.js updated ✅")
PY

echo "[3/4] patch pay.js (donate opens donate, not watchtower + better demo stripping)..."
python - <<'PY'
from pathlib import Path
import re

p = Path("pay.js")
s = p.read_text(encoding="utf-8", errors="ignore")

# Make donate open donate checkout (not watchtower)
s = s.replace(
    'openModal({ mode: "checkout", id: "ops-watchtower" });',
    'openModal({ mode: "checkout", id: "donate" });'
)

# Make category/tags read more fields (optional polish)
s = re.sub(r'Category:\s*\$\{it\.category\s*\|\|\s*"—"\}',
           'Category: ${it.category || it.cat || it.group || "—"}', s)
s = re.sub(r'Tags:\s*\$\{\(it\.tags\s*\|\|\s*\[\]\)\.join\(", "\)\s*\|\|\s*"—"\}',
           'Tags: ${(it.tags || it.keywords || it.labels || []).join(", ") || "—"}', s)

# Add a stronger label fixer (works even if "$9" and "demo" are in separate spans)
if "atlas_fix_labels_v2" not in s:
    inject = r'''
  // atlas_fix_labels_v2: remove "$X demo" + rename deploy->buy (even if nested spans)
  function atlas_fix_labels_v2(){
    document.querySelectorAll("button").forEach(b=>{
      const t=(b.textContent||"").trim().toLowerCase();
      if(t==="deploy") b.textContent="buy";
    });
    document.querySelectorAll("*").forEach(el=>{
      const t=(el.textContent||"").trim();
      const m=t.match(/^(\$\d+(?:\.\d+)?)\s+demo$/i);
      if(m) el.textContent=m[1];
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    atlas_fix_labels_v2();
    new MutationObserver(atlas_fix_labels_v2).observe(document.body,{childList:true,subtree:true});
  });
'''
    s = s.replace("window.ATLAS_PAY = {", inject + "\nwindow.ATLAS_PAY = {", 1)

p.write_text(s, encoding="utf-8")
print("pay.js updated ✅")
PY

echo "[4/4] syntax check..."
node --check pay.js && echo "pay.js parses ✅"
echo "DONE ✅  Restart server + hard refresh."
