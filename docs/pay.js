/* ATLAS_DONATE_HARDEN_V1 */
(() => {
  // Capture-phase shield: prevents ANY other click handlers from hijacking Donate.
  // This fixes "Donate opens a product" bugs.
  window.addEventListener("click", (e) => {
    const btn = e.target && (e.target.closest ? e.target.closest("#donateBtn") : null);
    if (!btn) return;

    try { btn.setAttribute("type","button"); } catch {}

    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    const link = (window.ATLAS_PAY_CONFIG && window.ATLAS_PAY_CONFIG.donateLink) || "";
    if (!link) {
      console.warn("[donate] donateLink missing (ATLAS_PAY_CONFIG.donateLink)");
      return;
    }

    // Use anchor-click (often more reliable than window.open on mobile)
    const a = document.createElement("a");
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, true);
})();


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
