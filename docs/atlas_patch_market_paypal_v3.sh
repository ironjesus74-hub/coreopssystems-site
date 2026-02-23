#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT/docs" || exit 1

ts="$(date +%Y%m%d_%H%M%S)"
echo "[1/5] backups ($ts)..."
for f in index.html app.js pay.js pay_config.js styles.css market/market_viewer.js data.js; do
  [ -f "$f" ] && cp -v "$f" "$f.bak.$ts" || true
done

echo "[2/5] write pay_config.js (PayPal per-item mapping)..."
cat > pay_config.js <<'JS'
/* ATLAS pay config (edit anytime) */
window.ATLAS_PAY_CFG = {
  cashapp: {
    tag: "$Herdtnerbryant",
    url: "https://cash.app/$Herdtnerbryant"
  },
  donate: {
    paypalId: "TQBZ3KKVM6YKU"
  },
  items: {
    "ops-watchtower":   { title: "Watchtower",      priceUSD:  9, sku: "WATCHTOWER",   paypalId: "VBTZ3DASMJ7Y8" },
    "deploy-sentinel":  { title: "Deploy Sentinel", priceUSD: 12, sku: "SENTINEL",     paypalId: "ML876QAGEPPXY" },
    "creator-clipline": { title: "Clipline",        priceUSD:  7, sku: "CLIPLINE",     paypalId: "ZU5AA47JRE6M6" },
    "dev-briefsmith":   { title: "Briefsmith",      priceUSD:  6, sku: "BRIEFSMITH",   paypalId: "79RDK5SCDE7DQ" },
    "ops-janitor":      { title: "Ops Janitor",     priceUSD:  5, sku: "OPSJANITOR",   paypalId: "X9JEZGZN5PEDE" },
    "sec-surface":      { title: "Surface Scan",    priceUSD: 10, sku: "SURFSCAN",     paypalId: "6DDVZZG4AWKCW" },

    "af-001":           { title: "AF-001",          priceUSD:  5, sku: "AF001",        paypalId: "SNAC2XF8LJYUC" },
    "af-002":           { title: "AF-002",          priceUSD:  9, sku: "AF002",        paypalId: "K676UAGP9VBHS" },
    "af-003":           { title: "AF-003",          priceUSD: 15, sku: "AF003",        paypalId: "MJNRHR32HYCGY" },
    "af-004":           { title: "AF-004",          priceUSD: 25, sku: "AF004",        paypalId: "82SM4SFPKS8K6" }
  }
};
JS

echo "[3/5] write pay.js (single click router + inspect/checkout modal, NO auto-redirect)..."
cat > pay.js <<'JS'
(() => {
  const CFG = () => window.ATLAS_PAY_CFG || { items: {}, cashapp: {} };
  const paypalUrlFromId = (id) => id ? `https://www.paypal.com/ncp/payment/${id}` : "";
  const itemById = (id) => (window.ATLAS_DATA?.market || []).find(x => x.id === id);

  const $ = (q, el=document) => el.querySelector(q);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // Minimal modal styling (keeps it consistent with your theme)
  const st = document.createElement("style");
  st.textContent = `
.atlasPayOverlay{position:fixed;inset:0;background:rgba(0,0,0,.58);display:none;align-items:center;justify-content:center;padding:14px;z-index:999}
.atlasPayOverlay.open{display:flex}
.atlasPayModal{width:min(820px,96vw);max-height:88vh;overflow:auto;border:1px solid rgba(255,255,255,.10);border-radius:18px;background:rgba(10,12,16,.92);backdrop-filter:blur(10px);box-shadow:0 30px 70px rgba(0,0,0,.55)}
.atlasPayHdr{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
.atlasPayHdr b{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px;letter-spacing:.2px}
.atlasPayBody{padding:14px;display:grid;gap:12px}
.atlasRow{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.pill{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);border-radius:999px;padding:6px 10px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(231,238,252,.92)}
.note{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:rgba(159,176,201,.95);line-height:1.55;white-space:pre-wrap}
.btn2{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);color:rgba(231,238,252,.95);padding:10px 12px;border-radius:12px;cursor:pointer;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
.btn2.primary{border-color:rgba(0,120,255,.35);background:linear-gradient(180deg, rgba(0,120,255,.16), rgba(0,120,255,.04));box-shadow:0 0 18px rgba(0,120,255,.14)}
.btn2.orange{border-color:rgba(255,106,0,.35);background:linear-gradient(180deg, rgba(255,106,0,.16), rgba(255,106,0,.04));box-shadow:0 0 18px rgba(255,106,0,.14)}
.small{font-size:11px;color:rgba(159,176,201,.9)}
.tabbar{display:flex;gap:8px;flex-wrap:wrap}
.tab{padding:8px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);cursor:pointer;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
.tab.on{border-color:rgba(255,106,0,.35);box-shadow:0 0 18px rgba(255,106,0,.10)}
`;
  document.head.appendChild(st);

  function ensureModal(){
    if ($("#atlasPayOverlay")) return;
    const wrap = document.createElement("div");
    wrap.id = "atlasPayOverlay";
    wrap.className = "atlasPayOverlay";
    wrap.innerHTML = `
      <div class="atlasPayModal" role="dialog" aria-label="ATLAS modal">
        <div class="atlasPayHdr">
          <b>ATLAS · INSPECT / CHECKOUT</b>
          <button class="btn2" id="atlasPayClose">close</button>
        </div>
        <div class="atlasPayBody">
          <div class="tabbar">
            <button class="tab on" id="tabInspect">inspect</button>
            <button class="tab" id="tabCheckout">checkout</button>
          </div>

          <div class="atlasRow">
            <span class="pill" id="mTitle">item</span>
            <span class="pill" id="mSku">sku</span>
            <span class="pill" id="mPrice">$0</span>
          </div>

          <div id="paneInspect" class="note"></div>

          <div id="paneCheckout" style="display:none">
            <div class="note" id="payNote"></div>
            <div class="atlasRow">
              <a class="btn2 primary" id="paypalGo" href="#" rel="noopener noreferrer">PayPal / Venmo</a>
              <button class="btn2" id="copyNote">copy note</button>
              <a class="btn2 orange" id="cashGo" href="#" rel="noopener noreferrer">Cash App</a>
            </div>
            <div class="small">MVP delivery: after paying, send your receipt ID + the note text to the email in your About page.</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const close = () => wrap.classList.remove("open");
    $("#atlasPayClose").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if(e.target === wrap) close(); });
    window.addEventListener("keydown", (e) => { if(e.key === "Escape") close(); });

    const setTab = (which) => {
      const ins = $("#paneInspect"), chk = $("#paneCheckout");
      const t1 = $("#tabInspect"), t2 = $("#tabCheckout");
      const onInspect = which === "inspect";
      ins.style.display = onInspect ? "block" : "none";
      chk.style.display = onInspect ? "none" : "block";
      t1.classList.toggle("on", onInspect);
      t2.classList.toggle("on", !onInspect);
    };
    $("#tabInspect").addEventListener("click", () => setTab("inspect"));
    $("#tabCheckout").addEventListener("click", () => setTab("checkout"));

    $("#copyNote").addEventListener("click", async () => {
      const txt = $("#payNote")?.textContent || "";
      try { await navigator.clipboard.writeText(txt); } catch {}
    });
  }

  function openModal({ mode, id }){
    ensureModal();
    const overlay = $("#atlasPayOverlay");
    const conf = CFG();
    const it = itemById(id) || { id, title: id, description: "" };
    const c = conf.items?.[id] || {};

    const title = c.title || it.title || it.name || id;
    const sku = c.sku || it.sku || id;
    const price = (c.priceUSD != null) ? `$${c.priceUSD}` : (it.price != null ? `$${it.price}` : "$—");
    const paypalId = c.paypalId || conf.donate?.paypalId || "";
    const paypalLink = paypalUrlFromId(paypalId);
    const cashUrl = conf.cashapp?.url || "";

    $("#mTitle").textContent = title;
    $("#mSku").textContent = `sku:${sku}`;
    $("#mPrice").textContent = price;

    const inspectText =
`Module: ${title}
Category: ${it.category || "—"}
Rating: ${it.rating || "—"}
Tags: ${(it.tags || []).join(", ") || "—"}

Summary:
${it.desc || it.description || "—"}

Tech notes (MVP):
- PayPal is live per-item (fixed price)
- Delivery is manual (receipt + note)
- Next: real packaging + downloads`;
    $("#paneInspect").textContent = inspectText;

    const note = `Item: ${title}\nSKU: ${sku}\nAmount: ${price}\nNote: ${sku} (${title})`;
    $("#payNote").textContent = note;

    const paypalGo = $("#paypalGo");
    paypalGo.href = paypalLink || "#";
    paypalGo.style.opacity = paypalLink ? "1" : ".55";
    paypalGo.style.pointerEvents = paypalLink ? "auto" : "none";

    const cashGo = $("#cashGo");
    cashGo.href = cashUrl || "#";
    cashGo.style.opacity = cashUrl ? "1" : ".55";
    cashGo.style.pointerEvents = cashUrl ? "auto" : "none";

    overlay.classList.add("open");
    // default tab
    $("#tabInspect").click();
    if(mode === "checkout") $("#tabCheckout").click();
  }

  // Remove "$X demo" *only* for the price-line pattern, without touching other text.
  function stripDemoLabels(){
    document.querySelectorAll("*").forEach(el => {
      if(el.children.length) return;
      const t = (el.textContent || "").trim();
      const m = t.match(/^(\$\d+(?:\.\d+)?)\s+demo$/i);
      if(m) el.textContent = m[1];
    });
  }

  // Click router (capture-phase) so old handlers can’t hijack it.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button, a");
    if(!btn) return;

    const label = (btn.textContent || "").trim().toLowerCase();
    const isInspect = label === "inspect";
    const isBuyish = ["deploy","buy","purchase","checkout"].includes(label);

    // dataset first
    const id =
      btn.dataset.marketOpen ||
      btn.dataset.marketInspect ||
      btn.dataset.marketBuy ||
      btn.dataset.marketDeploy ||
      btn.dataset.marketId ||
      // fallback: use sibling inspect button’s dataset
      btn.closest(".card, .marketCard, .tile, .panel, article, section")?.querySelector?.("[data-market-open]")?.dataset?.marketOpen ||
      null;

    if(isInspect && id){
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      openModal({ mode: "inspect", id });
      return;
    }

    if(isBuyish && id){
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      openModal({ mode: "checkout", id });
      return;
    }

    // Donate button (if present)
    if(btn.id === "donateBtn"){
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      openModal({ mode: "checkout", id: "ops-watchtower" }); // show a real example item
      return;
    }
  }, true);

  document.addEventListener("DOMContentLoaded", () => {
    stripDemoLabels();
    // Keep stripping when marketplace rerenders
    const mo = new MutationObserver(() => stripDemoLabels());
    mo.observe(document.body, { childList: true, subtree: true });
  });

  // Expose small API
  window.ATLAS_PAY = {
    openInspect: (id) => openModal({ mode: "inspect", id }),
    openCheckout: (id) => openModal({ mode: "checkout", id })
  };
})();
JS

echo "[4/5] patch index.html to cache-bust pay files..."
python - <<PY
from pathlib import Path
import re, time
p = Path("index.html")
s = p.read_text(encoding="utf-8", errors="ignore")
v = time.strftime("%Y%m%d_%H%M%S")

def bust(src):
    if "?" in src:
        return re.sub(r"([?&]v=)[^&\"]+", r"\\1"+v, src) if "v=" in src else src + "&v=" + v
    return src + "?v=" + v

# Remove old pay_config/pay.js script tags (any version)
s = re.sub(r'\\s*<script\\s+src="\\./pay_config\\.js[^"]*"\\s*></script>\\s*', "\\n", s)
s = re.sub(r'\\s*<script\\s+src="\\./pay\\.js[^"]*"\\s*></script>\\s*', "\\n", s)

# Ensure we insert before app.js
m = re.search(r'<script\\s+src="\\./app\\.js[^"]*"\\s*></script>', s)
if not m:
    raise SystemExit("Could not find app.js script tag in index.html")

insert = f'<script src="./pay_config.js?v={v}"></script>\\n  <script src="./pay.js?v={v}"></script>\\n  '
s = s[:m.start()] + insert + s[m.start():]

# Optional: stop favicon 404 spam
if 'rel="icon" href="data:,' not in s:
    s = s.replace("</title>", '</title>\\n  <link rel="icon" href="data:,">', 1)

p.write_text(s, encoding="utf-8")
print("index.html ok")
PY

echo "[5/5] syntax checks..."
node --check pay.js && echo "pay.js parses ✅"
node --check app.js && echo "app.js parses ✅"
echo "DONE ✅ Restart server and test:"
echo "  python -m http.server 8090"
echo "  open: http://127.0.0.1:8090/#market"
