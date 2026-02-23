/* ATLAS Pay Wiring (Cash App MVP)
   - Donate -> opens Cash App
   - Deploy buttons -> opens Cash App with detected $amount
   - Works on static hosting (no payment verification)
*/
(() => {
  "use strict";

  const CASHTAG_WITH_DOLLAR = "$Herdtnerbryant";
  const CASH_BASE = `https://cash.app/${CASHTAG_WITH_DOLLAR}`;

  const $ = (q, el=document) => el.querySelector(q);

  function cashUrl(amount) {
    const n = Number(amount);
    if (Number.isFinite(n) && n > 0) {
      // common format: https://cash.app/$Cashtag/10
      return `${CASH_BASE}/${n}`;
    }
    return CASH_BASE;
  }

  function toast(msg) {
    let t = $("#atlasToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "atlasToast";
      t.style.cssText = [
        "position:fixed",
        "left:50%",
        "bottom:18px",
        "transform:translateX(-50%)",
        "z-index:9999",
        "padding:10px 12px",
        "max-width:min(92vw,520px)",
        "border:1px solid rgba(255,255,255,.10)",
        "border-radius:14px",
        "background:rgba(10,12,16,.88)",
        "backdrop-filter:blur(10px)",
        "color:rgba(231,238,252,.95)",
        "font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        "font-size:12px",
        "box-shadow:0 18px 50px rgba(0,0,0,.55)",
        "opacity:0",
        "transition:opacity .12s ease"
      ].join(";");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => { t.style.opacity = "0"; }, 2400);
  }

  function findPriceNear(el) {
    const card = el.closest("article, section, .panel, .card, .marketItem, .moduleCard, div") || document.body;
    // only match values that have a $ in front so we don't accidentally grab rating 4.8
    const m = (card.textContent || "").match(/\$\s*(\d{1,4})(?:\.\d{1,2})?/);
    return m ? m[1] : null;
  }

  function findTitleNear(el) {
    const card = el.closest("article, section, .panel, .card, .marketItem, .moduleCard, div") || document.body;
    const t = card.querySelector("h1,h2,h3,.miTitle,.kitName,strong,b");
    const s = (t && t.textContent ? t.textContent : "").trim();
    return s || "module";
  }

  function openCash(amount, note) {
    const url = cashUrl(amount);
    // mobile-friendly open
    window.location.href = url;
    if (amount) {
      toast(`Cash App: send $${amount} to ${CASHTAG_WITH_DOLLAR} · note: "${note}"`);
    } else {
      toast(`Cash App: send to ${CASHTAG_WITH_DOLLAR} · note: "${note}"`);
    }
  }

  // 1) Wire known donate buttons by id
  function wireDonate() {
    const ids = ["donateBtn", "donateButton"];
    ids.forEach(id => {
      const btn = document.getElementById(id);
      if (btn && !btn.dataset.payWired) {
        btn.dataset.payWired = "1";
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          openCash(null, "donation");
        });
      }
    });
  }

  // 2) Global click capture:
  // - any "Donate" button opens base Cash App link
  // - any "deploy" button opens Cash App with detected amount
  document.addEventListener("click", (e) => {
    const el = e.target.closest("button,a");
    if (!el) return;

    // don't hijack the topbar quick deploy demo button
    if (el.id === "quickDeploy") return;

    const txt = (el.textContent || "").trim().toLowerCase();

    // Donate
    if (txt === "donate" || txt.startsWith("donate")) {
      e.preventDefault();
      openCash(null, "donation");
      return;
    }

    // Deploy -> treat as checkout for MVP
    if (txt === "deploy") {
      e.preventDefault();
      const amount = findPriceNear(el);
      const title = findTitleNear(el);
      openCash(amount, `forge-atlas: ${title}`);
      return;
    }
  }, true);

  // boot
  wireDonate();
  document.addEventListener("DOMContentLoaded", wireDonate);
})();
