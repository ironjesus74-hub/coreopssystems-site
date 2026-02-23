#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo "$HOME/project1")" || exit 1
cd docs || exit 1

ts="$(date +%Y%m%d_%H%M%S)"
echo "[1/5] backups ($ts)..."
mkdir -p backups
for f in index.html app.js data.js styles.css pay.js pay_config.js market/market_viewer.js; do
  if [ -f "$f" ]; then
    dst="backups/${f//\//__}.bak.$ts"
    cp -v "$f" "$dst"
  fi
done

echo "[2/5] write pay_config.js (PayPal links + prices)..."
cat > pay_config.js <<'JS'
/* Project Atlas — Payment config (edit anytime) */
window.ATLAS_PAY_CONFIG = {
  deliveryEmail: "ironjesus74@gmail.com",

  // Tip jar / Donate (customer-set or fixed — up to you)
  donatePaypalLink: "https://www.paypal.com/ncp/payment/TQBZ3KKVM6YKU",

  // Cash App fallback
  cashappLink: "https://cash.app/$herdtnerbryant",

  // Per-item: fixed-price PayPal links (recommended)
  items: {
    "ops-watchtower": {
      title: "Watchtower",
      priceUSD: 12,
      sku: "WATCHTOWER",
      paypalLink: "https://www.paypal.com/ncp/payment/VBTZ3DASMJ7Y8"
    },

    "deploy-sentinel": {
      title: "Deploy Sentinel",
      priceUSD: 12,
      sku: "SENTINEL",
      paypalLink: "https://www.paypal.com/ncp/payment/ML876QAGEPPXY"
    },

    "creator-clipline": {
      title: "Clipline",
      priceUSD: 7,
      sku: "CLIPLINE",
      paypalLink: "https://www.paypal.com/ncp/payment/ZU5AA47JRE6M6"
    },

    "dev-briefsmith": {
      title: "Briefsmith",
      priceUSD: 6,
      sku: "BRIEFSMITH",
      paypalLink: "https://www.paypal.com/ncp/payment/79RDK5SCDE7DQ"
    },

    "ops-janitor": {
      title: "Ops Janitor",
      priceUSD: 5,
      sku: "OPSJANITOR",
      paypalLink: "https://www.paypal.com/ncp/payment/X9JEZGZN5PEDE"
    },

    "sec-surface": {
      title: "Surface Scan",
      priceUSD: 10,
      sku: "SURFSCAN",
      paypalLink: "https://www.paypal.com/ncp/payment/6DDVZZG4AWKCW"
    },

    "af-001": { title: "AF-001", priceUSD: 5,  sku: "AF001", paypalLink: "https://www.paypal.com/ncp/payment/SNAC2XF8LJYUC" },
    "af-002": { title: "AF-002", priceUSD: 9,  sku: "AF002", paypalLink: "https://www.paypal.com/ncp/payment/K676UAGP9VBHS" },
    "af-003": { title: "AF-003", priceUSD: 15, sku: "AF003", paypalLink: "https://www.paypal.com/ncp/payment/MJNRHR32HYCGY" },
    "af-004": { title: "AF-004", priceUSD: 25, sku: "AF004", paypalLink: "https://www.paypal.com/ncp/payment/82SM4SFPKS8K6" }
  }
};
JS

echo "[3/5] write pay.js (single click-boss; inspect != checkout; no auto-redirect)..."
cat > pay.js <<'JS'
/* Project Atlas — Pay UI (MVP) */
(() => {
  const CFG = (window.ATLAS_PAY_CONFIG || {});
  const ITEMS = (CFG.items || {});
  const CASHAPP = CFG.cashappLink || "https://cash.app/";
  const DONATE_PAYPAL = CFG.donatePaypalLink || "";
  const DELIVERY_EMAIL = CFG.deliveryEmail || "";

  const norm = (s) => String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const byTitle = (() => {
    const m = {};
    Object.keys(ITEMS).forEach(id => {
      const t = ITEMS[id] && ITEMS[id].title ? ITEMS[id].title : id;
      m[norm(t)] = id;
    });
    return m;
  })();

  const $ = (q, el = document) => el.querySelector(q);

  function resolveItemFromClick(el) {
    const b = el.closest("button,a");
    if (!b) return null;

    // Prefer explicit data attrs if present
    const did =
      b.dataset.marketBuy ||
      b.dataset.marketOpen ||
      b.dataset.marketDeploy ||
      b.dataset.marketInspect ||
      b.dataset.id;

    if (did && ITEMS[did]) return Object.assign({ id: did }, ITEMS[did]);

    // Try to infer from nearby card title
    const card = b.closest(".card, .moduleCard, .marketCard, [data-id], [data-item]");
    let title = "";
    if (card) {
      const h = card.querySelector("h2,h3,.title,.name,strong,b");
      if (h) title = h.textContent;
    }
    if (!title) title = (b.closest("div") && b.closest("div").querySelector("strong,b")) ? b.closest("div").querySelector("strong,b").textContent : "";

    const guess = byTitle[norm(title)];
    if (guess && ITEMS[guess]) return Object.assign({ id: guess }, ITEMS[guess]);

    // Last resort: match by visible label on the button row
    const t2 = norm(card ? card.textContent : "");
    for (const id of Object.keys(ITEMS)) {
      const ti = norm(ITEMS[id].title || "");
      if (ti && t2.includes(ti)) return Object.assign({ id }, ITEMS[id]);
    }
    return null;
  }

  function go(url) {
    if (!url) return;
    // Avoid popup blockers: navigate in-tab (user can back)
    window.location.assign(url);
  }

  // Minimal injected CSS for modal
  const css = `
  .atlasPayOverlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;padding:14px;z-index:999}
  .atlasPayOverlay.open{display:flex}
  .atlasPayModal{width:min(760px,96vw);border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(10,12,16,.92);backdrop-filter:blur(10px);box-shadow:0 30px 70px rgba(0,0,0,.55);overflow:hidden}
  .atlasPayHdr{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
  .atlasPayHdr b{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px;letter-spacing:.2px}
  .atlasPayBody{padding:14px;display:grid;gap:10px}
  .atlasPayTabs{display:flex;gap:10px;flex-wrap:wrap}
  .atlasPayTab{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);border-radius:999px;padding:8px 12px;cursor:pointer;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(231,238,252,.92)}
  .atlasPayTab.active{border-color:rgba(255,106,0,.38);box-shadow:0 0 18px rgba(255,106,0,.12)}
  .atlasPayRow{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .atlasPayPill{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);border-radius:999px;padding:6px 10px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(231,238,252,.92)}
  .atlasPayNote{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(159,176,201,.95);line-height:1.55;white-space:pre-wrap}
  .atlasPayBtn{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);color:rgba(231,238,252,.95);padding:10px 12px;border-radius:12px;cursor:pointer;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
  .atlasPayBtn.primary{border-color:rgba(255,106,0,.35);background:linear-gradient(180deg, rgba(255,106,0,.16), rgba(255,106,0,.04));box-shadow:0 0 18px rgba(255,106,0,.14)}
  .atlasPaySmall{font-size:11px;color:rgba(159,176,201,.9);line-height:1.4}
  `;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function ensureModal() {
    if ($("#atlasPayOverlay")) return;
    const wrap = document.createElement("div");
    wrap.id = "atlasPayOverlay";
    wrap.className = "atlasPayOverlay";
    wrap.innerHTML = `
      <div class="atlasPayModal" role="dialog" aria-label="ATLAS Inspect/Checkout">
        <div class="atlasPayHdr">
          <b>ATLAS · INSPECT / CHECKOUT</b>
          <button class="atlasPayBtn" id="atlasPayClose">close</button>
        </div>
        <div class="atlasPayBody">
          <div class="atlasPayTabs">
            <button class="atlasPayTab" id="atlasTabInspect">inspect</button>
            <button class="atlasPayTab" id="atlasTabCheckout">checkout</button>
          </div>

          <div class="atlasPayRow">
            <span class="atlasPayPill" id="atlasPayTitle">Item</span>
            <span class="atlasPayPill" id="atlasPaySku">sku:—</span>
            <span class="atlasPayPill" id="atlasPayPrice">$—</span>
          </div>

          <div class="atlasPayNote" id="atlasPayContent"></div>

          <div class="atlasPayRow" id="atlasPayActions"></div>
          <div class="atlasPaySmall" id="atlasPayFooter"></div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const close = () => wrap.classList.remove("open");
    $("#atlasPayClose").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    $("#atlasTabInspect").addEventListener("click", () => setTab("inspect"));
    $("#atlasTabCheckout").addEventListener("click", () => setTab("checkout"));
  }

  let CURRENT = null;

  function setTab(tab) {
    const tInspect = $("#atlasTabInspect");
    const tCheckout = $("#atlasTabCheckout");
    tInspect.classList.toggle("active", tab === "inspect");
    tCheckout.classList.toggle("active", tab === "checkout");

    const content = $("#atlasPayContent");
    const actions = $("#atlasPayActions");
    const footer = $("#atlasPayFooter");
    actions.innerHTML = "";

    const it = CURRENT || {};
    const title = it.title || "ATLAS item";
    const sku = it.sku || it.id || "ATLAS-SKU";
    const price = (it.priceUSD != null) ? `$${it.priceUSD}` : "$TBD";
    $("#atlasPayTitle").textContent = title;
    $("#atlasPaySku").textContent = `sku:${sku}`;
    $("#atlasPayPrice").textContent = price;

    if (tab === "inspect") {
      const summary = it.summary || it.desc || "Deploy-ready module. (Add technical notes in pay_config.js later.)";
      const rating = (it.rating != null) ? String(it.rating) : "—";
      const category = it.category || "—";
      const tags = Array.isArray(it.tags) ? it.tags.join(", ") : "—";

      content.textContent =
`Module: ${title}
Category: ${category}
Rating: ${rating}
Tags: ${tags}

Summary:
${summary}

Tech notes (MVP):
- PayPal is live per-item (fixed price)
- Delivery is manual (receipt + note)
- Next: real packaging + downloads`;

      footer.textContent = "";
    } else {
      const note = `Note: ${sku} (${title})`;
      content.textContent =
`Item: ${title}
SKU: ${sku}
Amount: ${price}
${note}`;

      const btnPayPal = document.createElement("button");
      btnPayPal.className = "atlasPayBtn primary";
      btnPayPal.textContent = "PayPal / Venmo";
      btnPayPal.onclick = () => go(it.paypalLink || DONATE_PAYPAL);

      const btnCopy = document.createElement("button");
      btnCopy.className = "atlasPayBtn";
      btnCopy.textContent = "copy note";
      btnCopy.onclick = async () => {
        try { await navigator.clipboard.writeText(note); } catch {}
      };

      const btnCash = document.createElement("button");
      btnCash.className = "atlasPayBtn primary";
      btnCash.textContent = "Cash App";
      btnCash.onclick = () => go(CASHAPP);

      actions.appendChild(btnPayPal);
      actions.appendChild(btnCopy);
      actions.appendChild(btnCash);

      footer.textContent = `MVP delivery: after paying, send your receipt ID + the note text to ${DELIVERY_EMAIL || "your email"} (About page).`;
    }
  }

  function openModal(tab, item) {
    ensureModal();
    CURRENT = item || null;
    setTab(tab);
    $("#atlasPayOverlay").classList.add("open");
  }

  function openInspect(item) { openModal("inspect", item); }
  function openCheckout(item) { openModal("checkout", item); }

  // --- IMPORTANT: click “boss” handler (capture) ---
  // This stops old handlers from hijacking deploy/inspect.
  function clickBoss(e) {
    const target = e.target;
    const btn = target && target.closest ? target.closest("button,a") : null;
    if (!btn) return;

    // Donate button should NOT get mis-read as inspect/deploy
    if (btn.id === "donateBtn" || norm(btn.textContent).includes("donate")) {
      // open donate checkout as a modal
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      openModal("checkout", {
        title: "Donate / Tip Jar",
        sku: "DONATE",
        priceUSD: null,
        paypalLink: DONATE_PAYPAL,
        summary: "Support Project Atlas. Thank you."
      });
      return;
    }

    const label = norm(btn.textContent);

    // detect intent by label OR datasets
    const isInspect = (label === "inspect") || btn.dataset.marketOpen || btn.dataset.marketInspect;
    const isBuy = (label === "deploy") || (label === "buy") || (label === "purchase") || btn.dataset.marketBuy || btn.dataset.marketDeploy;

    if (!isInspect && !isBuy) return;

    const it = resolveItemFromClick(btn);
    if (!it) return;

    // Freeze other listeners
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();

    // Fix UI label mismatch in modal (use config price)
    openModal(isInspect ? "inspect" : "checkout", it);
  }

  document.addEventListener("click", clickBoss, true);

  // Cosmetic pass: rename deploy->buy, hide demo crumbs
  function cosmeticPass() {
    document.querySelectorAll("button").forEach(b => {
      if (norm(b.textContent) === "deploy") b.textContent = "buy";
    });

    document.querySelectorAll("span,div,p").forEach(el => {
      if (el.childElementCount) return;
      const t = (el.textContent || "").trim();
      if (!t) return;
      if (t.toLowerCase() === "demo") el.style.display = "none";
      if (t.toLowerCase().startsWith("demo mode:")) el.style.display = "none";
      if (/\$\d+\s*demo/i.test(t)) el.textContent = t.replace(/\s*demo/i, "").trim();
    });
  }

  window.addEventListener("hashchange", () => setTimeout(cosmeticPass, 60));
  document.addEventListener("DOMContentLoaded", () => {
    cosmeticPass();
    setTimeout(cosmeticPass, 250);
    setTimeout(cosmeticPass, 900);
  });

  // Expose for other scripts (optional)
  window.ATLAS_PAY = { openInspect, openCheckout };
})();
JS

echo "[4/5] ensure index.html loads pay_config.js + pay.js (cache-bust)..."
python - <<'PY'
from pathlib import Path
import re, time
p = Path("index.html")
s = p.read_text(encoding="utf-8", errors="ignore")
v = time.strftime("%Y%m%d_%H%M%S")

def bust(src):
    if "?v=" in src: return src
    return src + ("&" if "?" in src else "?") + f"v={v}"

# stop favicon 404 spam
if 'rel="icon" href="data:,' not in s:
    s = s.replace("</title>", '</title>\n  <link rel="icon" href="data:,">', 1)

# ensure pay_config BEFORE pay.js
if "pay_config.js" not in s:
    # insert before pay.js if pay.js exists, else before app.js
    if "pay.js" in s:
        s = re.sub(r'(<script\s+src="\./pay\.js[^"]*"></script>)',
                   f'<script src="./pay_config.js?v={v}"></script>\\n  \\1', s, count=1)
    else:
        s = s.replace('<script src="./app.js"></script>',
                      f'<script src="./pay_config.js?v={v}"></script>\\n  <script src="./pay.js?v={v}"></script>\\n  <script src="./app.js"></script>', 1)
else:
    # refresh cache bust
    s = re.sub(r'src="\./pay_config\.js[^"]*"', f'src="{bust("./pay_config.js")}"', s)

# ensure pay.js exists + bust it
if "pay.js" not in s:
    s = s.replace('<script src="./app.js"></script>',
                  f'<script src="./pay.js?v={v}"></script>\\n  <script src="./app.js"></script>', 1)
else:
    s = re.sub(r'src="\./pay\.js[^"]*"', f'src="{bust("./pay.js")}"', s)

# also bust app.js/data.js/styles.css a bit
s = re.sub(r'href="\./styles\.css[^"]*"', f'href="{bust("./styles.css")}"', s)
s = re.sub(r'src="\./data\.js[^"]*"', f'src="{bust("./data.js")}"', s)
s = re.sub(r'src="\./app\.js[^"]*"', f'src="{bust("./app.js")}"', s)

p.write_text(s, encoding="utf-8")
print("index.html ok")
PY

echo "[5/5] syntax checks..."
node --check pay.js && echo "pay.js parses ✅"
node --check pay_config.js && echo "pay_config.js parses ✅"
echo "DONE ✅ Restart server + hard refresh browser."
echo
echo "Local test URL:"
echo "  http://127.0.0.1:8090/#mar"
