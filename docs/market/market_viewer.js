/* ATLAS Marketplace: Inspect Modal (static MVP)
   - Works with ANY button whose text is "inspect"
   - Shows module details + includes + install + pay button
*/
(() => {
  "use strict";

  const CASHTAG = "$Herdtnerbryant";
  const CASH_BASE = `https://cash.app/${CASHTAG}`;

  const CATALOG = [
    {
      id:"watchtower",
      title:"Watchtower",
      category:"ops",
      price:9,
      rating:4.8,
      tags:["monitor","status","low-noise"],
      desc:"Lightweight server + uptime monitoring unit with clean alerts and low-noise status summaries.",
      includes:[
        "watchtower.sh runner + config template",
        "systemd/service template (Linux) + Task Scheduler notes (Windows)",
        "alert rules + quiet-hours profile",
        "README quickstart + troubleshooting checklist"
      ],
      install:[
        "curl -fsSL https://example.com/watchtower.sh -o watchtower.sh",
        "chmod +x watchtower.sh",
        "./watchtower.sh --init",
        "./watchtower.sh --run"
      ]
    },
    {
      id:"deploy-sentinel",
      title:"Deploy Sentinel",
      category:"dev",
      price:12,
      rating:4.7,
      tags:["deploy","preflight","ci/cd"],
      desc:"Preflight checks before a release: env sanity, version drift, dependency flags. Prevents dumb deploys.",
      includes:[
        "preflight script + sample CI job",
        "env sanity checks + version drift guard",
        "dependency risk scan hooks (lightweight)",
        "README + examples"
      ],
      install:[
        "cp deploy-sentinel.sh /usr/local/bin/deploy-sentinel",
        "chmod +x /usr/local/bin/deploy-sentinel",
        "deploy-sentinel --check"
      ]
    },
    {
      id:"clipline",
      title:"Clipline",
      category:"creator",
      price:7,
      rating:4.5,
      tags:["creator","templates","workflow"],
      desc:"Creator workflow helper: converts notes into posting checklists, upload steps, and reusable templates.",
      includes:[
        "template packs (shorts, longform, blog, newsletter)",
        "1 command generator script",
        "README + examples"
      ],
      install:[
        "python clipline.py --init",
        "python clipline.py --from-notes notes.txt"
      ]
    },
    {
      id:"surface-scan",
      title:"Surface Scan",
      category:"security",
      price:10,
      rating:4.6,
      tags:["security","signals","alerts"],
      desc:"Basic posture checks with clear output: what changed, why it matters, what to do next.",
      includes:[
        "baseline scan + drift report",
        "simple alert output modes (json/text)",
        "README + safe defaults"
      ],
      install:[
        "./surface-scan.sh --baseline",
        "./surface-scan.sh --diff"
      ]
    },
    {
      id:"ops-janitor",
      title:"Ops Janitor",
      category:"ops",
      price:5,
      rating:4.4,
      tags:["cleanup","storage","routine"],
      desc:"Cleans common operational mess: temp files, log bloat checks, quick disk health summaries.",
      includes:[
        "cleanup profiles (safe/aggressive)",
        "log size report + disk snapshot",
        "README + cron examples"
      ],
      install:[
        "./ops-janitor.sh --safe",
        "./ops-janitor.sh --report"
      ]
    },
    {
      id:"briefsmith",
      title:"Briefsmith",
      category:"dev",
      price:6,
      rating:4.3,
      tags:["planning","handoff","clarity"],
      desc:"Turns messy task notes into execution-ready plans: checklists, handoffs, next actions.",
      includes:[
        "brief template + checklist generator",
        "handoff doc format (markdown)",
        "README + examples"
      ],
      install:[
        "python briefsmith.py --from notes.txt --out plan.md"
      ]
    }
  ];

  const $ = (q, el=document) => el.querySelector(q);

  const norm = (s) => String(s||"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"")
    .trim();

  function cashUrl(amount){
    const n = Number(amount);
    return (Number.isFinite(n) && n > 0) ? `${CASH_BASE}/${n}` : CASH_BASE;
  }

  function copyText(text){
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(()=>prompt("Copy:", text));
    } else {
      prompt("Copy:", text);
    }
  }

  function ensureModal(){
    let ov = $("#atlasMarketOverlay");
    if (ov) return ov;

    ov = document.createElement("div");
    ov.id = "atlasMarketOverlay";
    ov.className = "atlasMarketOverlay";
    ov.innerHTML = `
      <div class="atlasMarketModal" role="dialog" aria-label="Module inspect">
        <div class="atlasMarketModalTop">
          <div>
            <div class="atlasMarketTitle" id="atlasMarketTitle">Module</div>
            <div class="atlasMarketMeta" id="atlasMarketMeta"></div>
          </div>
          <button class="atlasMarketClose" id="atlasMarketClose" type="button" aria-label="Close">✕</button>
        </div>

        <div class="atlasMarketBody">
          <div class="atlasMarketDesc" id="atlasMarketDesc"></div>

          <div class="atlasMarketGrid">
            <div class="atlasMarketCard">
              <div class="atlasMarketCardTitle">Includes</div>
              <ul class="atlasMarketList" id="atlasMarketIncludes"></ul>
            </div>

            <div class="atlasMarketCard">
              <div class="atlasMarketCardTitle">Install</div>
              <pre class="atlasMarketPre" id="atlasMarketInstall"></pre>
            </div>
          </div>

          <div class="atlasMarketActions">
            <button class="atlasMarketBtn primary" id="atlasMarketPay" type="button">Pay</button>
            <button class="atlasMarketBtn" id="atlasMarketCopy" type="button">Copy note</button>
            <button class="atlasMarketBtn" id="atlasMarketClose2" type="button">Close</button>
          </div>

          <div class="atlasMarketNote" id="atlasMarketNote">
            Demo MVP: payments open Cash App. Automated delivery comes later (Stripe/Gumroad/etc).
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(ov);

    const close = () => ov.classList.remove("open");
    $("#atlasMarketClose").addEventListener("click", close);
    $("#atlasMarketClose2").addEventListener("click", close);
    ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    return ov;
  }

  function findFromCard(card){
    const t = card?.querySelector("h1,h2,h3,strong,b,.miTitle,.moduleTitle")?.textContent?.trim();
    const text = t || card?.textContent || "";
    const priceMatch = String(card?.textContent || "").match(/\$\s*(\d{1,4})(?:\.\d{1,2})?/);
    const price = priceMatch ? Number(priceMatch[1]) : null;

    const wanted = norm(t || "");
    let item = null;

    if (wanted) {
      item = CATALOG.find(x => norm(x.title) === wanted || norm(x.id) === wanted) || null;
    }
    if (!item) {
      // loose match
      const bag = norm(text);
      item = CATALOG.find(x => bag.includes(norm(x.title))) || null;
    }
    return { item, price };
  }

  function openInspect(card){
    const { item, price } = findFromCard(card);
    if (!item) return;

    const ov = ensureModal();
    $("#atlasMarketTitle").textContent = item.title;

    const meta = `category: ${item.category} · rating: ${item.rating} ★ · price: $${price ?? item.price}`;
    $("#atlasMarketMeta").textContent = meta;

    $("#atlasMarketDesc").textContent = item.desc;

    $("#atlasMarketIncludes").innerHTML =
      item.includes.map(x => `<li>${x.replace(/</g,"&lt;")}</li>`).join("");

    $("#atlasMarketInstall").textContent = item.install.join("\n");

    const amount = price ?? item.price;
    const note = `forge-atlas: ${item.title}`;

    const payBtn = $("#atlasMarketPay");
    payBtn.textContent = `Pay $${amount}`;
    payBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // route through ATLAS checkout instead of hard redirect
      if (window.ATLAS_PAY && typeof window.ATLAS_PAY.openCheckout === "function") {
        window.ATLAS_PAY.openCheckout(null);
      }
    };

    $("#atlasMarketCopy").onclick = () => copyText(note);

    $("#atlasMarketNote").textContent =
      `Note to use in Cash App: "${note}" · After payment, you can use the Contact page to request delivery.`;

    ov.classList.add("open");
  }

  // Capture ALL "inspect" buttons (featured + marketplace) using event delegation
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button,a");
    if (!btn) return;

    const txt = (btn.textContent || "").trim().toLowerCase();
    if (txt !== "inspect") return;

    e.preventDefault();
    const card = btn.closest("article,section,.panel,.card,.marketItem,div") || document.body;
    openInspect(card);
  }, true);

})();
