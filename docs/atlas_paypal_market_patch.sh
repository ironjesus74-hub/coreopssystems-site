#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" || exit 1
cd docs || exit 1

ts="$(date +%Y%m%d_%H%M%S)"

# ---- Your PayPal stuff (from you) ----
PAYPAL_SDK='https://www.paypal.com/sdk/js?client-id=BAAmnjp-TsENOoFWf8leZ3-bzhgspSd9ALcVaG0Z67DmjPyV5guMJSB0Z71d6fXYv-oY5u6TLom-qoCR2M&components=hosted-buttons&enable-funding=venmo&currency=USD'
PAYPAL_BUTTON_ID='CZZ7E3HZGTC6E'
PAYPAL_LINK='https://www.paypal.com/ncp/payment/CZZ7E3HZGTC6E'

# ---- Your Cash App donate link (keep as donate) ----
CASHAPP_LINK='https://cash.app/$Herdtnerbryant'

echo "[1/5] backups..."
for f in index.html app.js data.js styles.css pay.js; do
  [ -f "$f" ] && cp -v "$f" "$f.bak.$ts" || true
done

echo "[2/5] write docs/pay.js (safe)..."
cat > pay.js <<'JS'
(() => {
  const PAYPAL_BUTTON_ID = "CZZ7E3HZGTC6E";
  const PAYPAL_LINK = "https://www.paypal.com/ncp/payment/CZZ7E3HZGTC6E";
  const CASHAPP_LINK = "https://cash.app/$Herdtnerbryant";

  const $ = (q, el=document) => el.querySelector(q);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]
  ));

  const css = `
.atlasPayOverlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;padding:16px;z-index:9999}
.atlasPayOverlay.open{display:flex}
.atlasPayModal{width:min(760px,96vw);border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(10,12,16,.92);backdrop-filter:blur(10px);box-shadow:0 30px 70px rgba(0,0,0,.55);overflow:hidden}
.atlasPayHdr{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
.atlasPayHdr b{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px;letter-spacing:.2px}
.atlasPayBody{padding:14px;display:grid;gap:12px}
.atlasPayRow{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.atlasPayPill{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);border-radius:999px;padding:6px 10px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(231,238,252,.92)}
.atlasPayNote{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(159,176,201,.95);line-height:1.5;white-space:pre-wrap}
.atlasPayBtn{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);color:rgba(231,238,252,.95);padding:10px 12px;border-radius:12px;cursor:pointer;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
.atlasPayBtn.primary{border-color:rgba(0,140,255,.35);background:linear-gradient(180deg, rgba(0,140,255,.16), rgba(0,140,255,.04));box-shadow:0 0 18px rgba(0,140,255,.14)}
.atlasPaySmall{font-size:11px;color:rgba(159,176,201,.9)}
#atlasPaypalHosted{min-height:46px}
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
            <span class="atlasPayPill" id="atlasPayMeta">meta</span>
          </div>

          <div class="atlasPayNote" id="atlasPayNote"></div>

          <div id="atlasPaypalHosted"></div>

          <div class="atlasPayRow">
            <a class="atlasPayBtn primary" id="atlasPayLink" href="#" rel="noopener noreferrer">PayPal checkout</a>
            <button class="atlasPayBtn" id="atlasPayCopy">copy note</button>
            <a class="atlasPayBtn" id="atlasCashDonate" href="#" rel="noopener noreferrer">Cash App donate</a>
          </div>

          <div class="atlasPaySmall">
            MVP mode: delivery is manual. After paying, send your receipt ID + the note text to the email in the About page.
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const close = () => wrap.classList.remove("open");
    $("#atlasPayClose").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if(e.target === wrap) close(); });
    window.addEventListener("keydown", (e) => { if(e.key === "Escape") close(); });

    $("#atlasPayCopy").addEventListener("click", async () => {
      const txt = $("#atlasPayNote").textContent || "";
      try { await navigator.clipboard.writeText(txt); } catch {}
    });
  }

  function findItemFromButton(btn){
    const id =
      btn?.dataset?.marketBuy ||
      btn?.dataset?.marketOpen ||
      btn?.dataset?.marketDeploy ||
      btn?.getAttribute?.("data-market-buy") ||
      btn?.getAttribute?.("data-market-open") ||
      btn?.getAttribute?.("data-market-deploy") ||
      "";

    const list =
      (window.ATLAS_DATA?.market) ||
      (window.ATLAS_DATA?.modules) ||
      (window.ATLAS_DATA?.items) ||
      [];

    let it = (id && Array.isArray(list)) ? list.find(x => x?.id === id) : null;

    // Fallback: scrape card text
    if(!it){
      const card = btn.closest?.(".card, .marketCard, .moduleCard, .atlasCard") || btn.parentElement;
      const title =
        card?.querySelector?.("h1,h2,h3,.title,.name,.cardTitle")?.textContent?.trim() ||
        "ATLAS module";
      const priceText = (card?.textContent || "").match(/\$([0-9]{1,4})/);
      const priceUSD = priceText ? Number(priceText[1]) : null;
      it = { id: id || title.toLowerCase().replace(/[^a-z0-9]+/g,"-"), title, priceUSD };
    }
    return it;
  }

  function renderPayPalHosted(){
    const box = $("#atlasPaypalHosted");
    if(!box) return;
    box.innerHTML = "";
    // If PayPal SDK loaded, render hosted button. If not, it still works via PAYPAL_LINK.
    try{
      if(window.paypal?.HostedButtons){
        window.paypal.HostedButtons({ hostedButtonId: PAYPAL_BUTTON_ID }).render("#atlasPaypalHosted");
      }
    }catch{}
  }

  function openCheckout(it){
    ensureModal();
    const overlay = $("#atlasPayOverlay");
    const title = it?.title || "ATLAS module";
    const sku = it?.sku || it?.id || "ATLAS-SKU";
    const price = (it?.priceUSD != null) ? `$${it.priceUSD}` : "amount shown on card";
    const note = `Module: ${title}\nSKU: ${sku}\nAmount: ${price}\nDelivery email: (put your email here)\n`;

    $("#atlasPayItem").textContent = title;
    $("#atlasPayMeta").textContent = `sku:${sku} · ${price}`;
    $("#atlasPayNote").textContent = note;

    const payLink = $("#atlasPayLink");
    payLink.href = PAYPAL_LINK;

    const cash = $("#atlasCashDonate");
    cash.href = CASHAPP_LINK;

    overlay.classList.add("open");
    renderPayPalHosted();
  }

  function openInspect(it){
    // For now: reuse checkout modal as “details + checkout”
    openCheckout(it);
  }

  // Wire donate buttons if you have them
  document.addEventListener("DOMContentLoaded", () => {
    const donateBtn = document.getElementById("donateBtn");
    const donateMsg = document.getElementById("donateMsg");
    if(donateBtn){
      donateBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Same-tab to avoid popup blockers
        window.location.assign(CASHAPP_LINK);
      });
    }
    if(donateMsg){
      donateMsg.textContent = `Donate: ${CASHAPP_LINK}`;
    }
  });

  // Fix marketplace buttons (deploy/inspect/buy) via event delegation
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button, a");
    if(!btn) return;

    const label = (btn.textContent || "").trim().toLowerCase();
    const hasMarketAttr =
      btn.hasAttribute("data-market-buy") ||
      btn.hasAttribute("data-market-open") ||
      btn.hasAttribute("data-market-deploy") ||
      btn.dataset.marketBuy || btn.dataset.marketOpen || btn.dataset.marketDeploy;

    if(label === "inspect" || btn.hasAttribute("data-market-open") || btn.dataset.marketOpen){
      e.preventDefault(); e.stopPropagation();
      openInspect(findItemFromButton(btn));
      return;
    }

    if(label === "deploy" || label === "buy" || hasMarketAttr){
      e.preventDefault(); e.stopPropagation();
      openCheckout(findItemFromButton(btn));
      return;
    }
  }, true);

})();
JS

echo "[3/5] patch index.html to load PayPal SDK + pay.js..."
python - <<PY
from pathlib import Path
import re, time
p = Path("index.html")
s = p.read_text(encoding="utf-8", errors="ignore")
v = time.strftime("%Y%m%d_%H%M%S")

def bust(src):
  if "?v=" in src: return src
  j = "&" if "?" in src else "?"
  return f"{src}{j}v={v}"

# stop favicon.ico spam
if 'rel="icon" href="data:,' not in s:
  s = s.replace("</title>", '</title>\\n  <link rel="icon" href="data:,">', 1)

# Ensure pay.js loaded
if "pay.js" not in s:
  s = s.replace("</body>", '  <script src="./pay.js"></script>\\n</body>')

# Ensure PayPal SDK loaded (only once)
sdk = "${PAYPAL_SDK}"
if "paypal.com/sdk/js" not in s:
  s = s.replace("</body>", f'  <script src="{sdk}"></script>\\n</body>')

# Cache-bust pay.js too (optional)
s = re.sub(r'src="(\./pay\.js)"', lambda m: f'src="{bust(m.group(1))}"', s)

p.write_text(s, encoding="utf-8")
print("index.html ok")
PY

echo "[4/5] syntax checks..."
node --check pay.js && echo "pay.js parses ✅"

echo "[5/5] done ✅"
echo "PayPal link: $PAYPAL_LINK"
