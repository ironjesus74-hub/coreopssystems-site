#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo "$HOME/project1")/docs" || exit 1
ts="$(date +%Y%m%d_%H%M%S)"

echo "[1/5] backups..."
for f in index.html app.js pay.js pay_config.js market/market_viewer.js data.js styles.css; do
  if [ -f "$f" ]; then cp -v "$f" "$f.bak.$ts"; fi
done

echo "[2/5] write pay_config.js (EDIT THIS AFTER RUN)..."
cat > pay_config.js <<'JS'
/*
  ATLAS payment config
  Fill in PayPal links per item (fixed-price links).
*/
window.ATLAS_PAY_CONFIG = {
  // Donation link can be “customer set price”
  donate: {
    paypalLink: "PASTE_DONATE_PAYPAL_LINK_HERE"
  },

  // Cash App fallback (optional)
  cashapp: {
    link: "https://cash.app/$herdtnerbryant"
  },

  // Per-item fixed price PayPal links:
  // Key must match your market item id (we’ll print ids below).
  items: {
    // Example:
    // "watchtower": { price: 9, sku: "WATCHTOWER", paypalLink: "https://www.paypal.com/ncp/payment/XXXX" },
  }
};
JS

echo "[3/5] write pay.js (no auto-redirect; inspect won’t trigger buy)..."
cat > pay.js <<'JS'
(() => {
  const CFG = window.ATLAS_PAY_CONFIG || {};
  const DONATE_LINK = CFG.donate?.paypalLink || "";
  const CASHAPP_LINK = CFG.cashapp?.link || "";
  const ITEMS = CFG.items || {};

  const $ = (q, el=document) => el.querySelector(q);

  const css = `
.atlasPayOverlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;padding:16px;z-index:9999}
.atlasPayOverlay.open{display:flex}
.atlasPayModal{width:min(760px,96vw);border:1px solid rgba(255,255,255,.10);border-radius:18px;background:rgba(10,12,16,.92);backdrop-filter:blur(10px);box-shadow:0 30px 70px rgba(0,0,0,.55);overflow:hidden}
.atlasPayHdr{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
.atlasPayHdr b{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px;letter-spacing:.2px}
.atlasPayBody{padding:14px;display:grid;gap:10px}
.atlasPayRow{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.atlasPayPill{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);border-radius:999px;padding:6px 10px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(231,238,252,.92)}
.atlasPayNote{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(159,176,201,.95);line-height:1.5}
.atlasPayBtn{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);color:rgba(231,238,252,.95);padding:10px 12px;border-radius:12px;cursor:pointer;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
.atlasPayBtn.primary{border-color:rgba(255,106,0,.35);background:linear-gradient(180deg, rgba(255,106,0,.16), rgba(255,106,0,.04));box-shadow:0 0 18px rgba(255,106,0,.14)}
.atlasPaySmall{font-size:11px;color:rgba(159,176,201,.9);line-height:1.35}
  `;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function ensureModal(){
    if ($("#atlasPayOverlay")) return;
    const wrap = document.createElement("div");
    wrap.id = "atlasPayOverlay";
    wrap.className = "atlasPayOverlay";
    wrap.innerHTML = `
      <div class="atlasPayModal" role="dialog" aria-label="ATLAS checkout">
        <div class="atlasPayHdr">
          <b>ATLAS · CHECKOUT</b>
          <button class="atlasPayBtn" id="atlasPayClose">close</button>
        </div>
        <div class="atlasPayBody">
          <div class="atlasPayRow">
            <span class="atlasPayPill" id="atlasPayItem">item</span>
            <span class="atlasPayPill" id="atlasPaySku">sku</span>
            <span class="atlasPayPill" id="atlasPayPrice">price</span>
          </div>

          <div class="atlasPayNote" id="atlasPayNote"></div>

          <div class="atlasPayRow">
            <a class="atlasPayBtn primary" id="atlasPayPaypal" href="#" rel="noopener noreferrer">PayPal checkout</a>
            <button class="atlasPayBtn" id="atlasPayCopy">copy note</button>
            <a class="atlasPayBtn" id="atlasPayCash" href="#" rel="noopener noreferrer">Cash App donate</a>
          </div>

          <div class="atlasPaySmall">
            MVP: delivery is manual. After paying, send the receipt ID + the note text to the email in your About page.
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const close = () => wrap.classList.remove("open");
    $("#atlasPayClose").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    $("#atlasPayCopy").addEventListener("click", async () => {
      const txt = $("#atlasPayNote").textContent || "";
      try { await navigator.clipboard.writeText(txt); } catch {}
    });
  }

  function openCheckoutById(id, titleGuess="ATLAS item"){
    ensureModal();
    const overlay = $("#atlasPayOverlay");

    const meta = ITEMS[id] || {};
    const title = meta.title || titleGuess || id;
    const sku = meta.sku || id;
    const price = (meta.price != null) ? `$${meta.price}` : "TBD";
    const link = meta.paypalLink || DONATE_LINK || "";

    $("#atlasPayItem").textContent = title;
    $("#atlasPaySku").textContent = `sku:${sku}`;
    $("#atlasPayPrice").textContent = price;

    const note = `Module: ${title}\nSKU: ${sku}\nAmount: ${price}\nDelivery email: (your email here)\n`;
    $("#atlasPayNote").textContent = note;

    const pp = $("#atlasPayPaypal");
    if (link) {
      pp.href = link;
      pp.style.pointerEvents = "auto";
      pp.style.opacity = "1";
    } else {
      pp.href = "#";
      pp.style.pointerEvents = "none";
      pp.style.opacity = ".4";
    }

    const cash = $("#atlasPayCash");
    cash.href = CASHAPP_LINK || "#";
    cash.style.opacity = CASHAPP_LINK ? "1" : ".4";

    overlay.classList.add("open");
  }

  function openDonate(){
    // Prefer PayPal donate link (more trusted), else Cash App
    const link = DONATE_LINK || CASHAPP_LINK;
    if (link) window.location.href = link;
  }

  // Expose API
  window.ATLAS_PAY = { openCheckoutById, openDonate };

  // HARD LOCK: stop “inspect” clicks from bubbling into “buy”
  document.addEventListener("click", (e) => {
    const inspect = e.target.closest("[data-market-open],[data-market-inspect]");
    if (inspect) {
      e.stopPropagation();
      // Let your existing inspect UI run normally.
      return;
    }

    const buy = e.target.closest("[data-market-buy],[data-market-deploy]");
    if (buy) {
      e.preventDefault();
      e.stopPropagation();
      const id = buy.dataset.marketBuy || buy.dataset.marketDeploy || "";
      const card = buy.closest("[data-market-id]") || buy.closest(".card") || null;
      const titleGuess = card?.querySelector?.(".title")?.textContent?.trim?.() || "";
      openCheckoutById(id, titleGuess);
      return;
    }

    const donateBtn = e.target.closest("#donateBtn,[data-donate]");
    if (donateBtn) {
      e.preventDefault();
      e.stopPropagation();
      openDonate();
    }
  }, true);
})();
JS

echo "[4/5] patch index.html to load pay_config.js before pay.js (cache-busted)..."
python - <<'PY'
from pathlib import Path
import re, time

p = Path("index.html")
s = p.read_text(encoding="utf-8", errors="ignore")
v = time.strftime("%Y%m%d_%H%M%S")

def add_or_bust(tag_src):
  if f'{tag_src}?v=' in s or f'{tag_src}&v=' in s:
    return
  # replace plain src/href with cache-busted version
  nonlocal_s = None

# ensure pay_config.js + pay.js are present before app.js
if "pay_config.js" not in s:
  s = s.replace('<script src="./pay.js', '<script src="./pay_config.js?v=%s"></script>\n  <script src="./pay.js' % v)

if "pay.js" not in s:
  s = s.replace('<script src="./app.js', '<script src="./pay.js?v=%s"></script>\n  <script src="./app.js' % v)

# bust pay.js/app.js/data.js/styles.css if present
s = re.sub(r'src="\./pay\.js(\?v=[^"]*)?"', f'src="./pay.js?v={v}"', s)
s = re.sub(r'src="\./app\.js(\?v=[^"]*)?"', f'src="./app.js?v={v}"', s)
s = re.sub(r'src="\./data\.js(\?v=[^"]*)?"', f'src="./data.js?v={v}"', s)
s = re.sub(r'href="\./styles\.css(\?v=[^"]*)?"', f'href="./styles.css?v={v}"', s)

p.write_text(s, encoding="utf-8")
print("index.html ok")
PY

echo "[5/5] syntax checks..."
node --check pay.js && echo "pay.js parses ✅"
node --check app.js && echo "app.js parses ✅"
echo "DONE ✅ Now edit pay_config.js and paste PayPal links per item."
echo
echo "Tip: list your market item ids with:"
echo "  python - <<'PY'"
echo "  import re, pathlib"
echo "  s=pathlib.Path('data.js').read_text()"
echo "  print('\\n'.join(sorted(set(re.findall(r'id:\\\\s*\\\"([^\\\"]+)\\\"', s)))))"
echo "  PY"
