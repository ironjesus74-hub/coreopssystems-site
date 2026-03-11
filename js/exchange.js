/** @type {Object[]} Exchange trading pairs — each pair: { id, title, category, rate, trend, up (bool), volume, description, tags (string[]) } */
const exchangePairs = [
  {
    id:"ex1",
    title:"Signal Credits / USD",
    category:"Credits",
    rate:"$0.42",
    trend:"+8.2%",
    up:true,
    volume:"$4,820",
    description:"Core Atlas platform credit. Earned through Arena participation, tool ratings, and Signal Feed contributions.",
    tags:["Earnable","Tradeable","Redeemable"]
  },
  {
    id:"ex2",
    title:"Tool License: OpenRouter Wrapper",
    category:"Licenses",
    rate:"$31",
    trend:"+2.4%",
    up:true,
    volume:"$1,240",
    description:"Single-seat license transfer for the OpenRouter Signal Wrapper. Full feature access included.",
    tags:["Transferable","Full License","No Expiry"]
  },
  {
    id:"ex3",
    title:"Signal+ Access Tier",
    category:"Access",
    rate:"$18",
    trend:"-1.1%",
    up:false,
    volume:"$980",
    description:"Exchange your Signal+ tier credit for another Atlas ID or redeem perks directly.",
    tags:["Tier Swap","Identity Layer","Perks Included"]
  },
  {
    id:"ex4",
    title:"Operator Perk Bundle A",
    category:"Perks",
    rate:"$24",
    trend:"+5.7%",
    up:true,
    volume:"$2,140",
    description:"Bundle of 4 operator perks including early Market access, profile signal boost, and forum presence badge.",
    tags:["Bundle","4 Perks","Stackable"]
  },
  {
    id:"ex5",
    title:"Tool License: Prompt Audit Engine",
    category:"Licenses",
    rate:"$19",
    trend:"+1.8%",
    up:true,
    volume:"$760",
    description:"Transferable single-seat license for the Prompt Audit Engine. Works immediately on transfer.",
    tags:["Transferable","Audit Tool","Workflow"]
  },
  {
    id:"ex6",
    title:"Arena Spectator Credits",
    category:"Credits",
    rate:"$0.08",
    trend:"-0.4%",
    up:false,
    volume:"$640",
    description:"Credits earned per Gauntlet spectator session. Redeemable for perk unlocks and market discounts.",
    tags:["Spectator","Earnable","Micro-Credit"]
  },
  {
    id:"ex7",
    title:"Seller Readiness Token",
    category:"Access",
    rate:"$45",
    trend:"+11.3%",
    up:true,
    volume:"$2,700",
    description:"Unlocks Atlas ID seller features early. High demand from operators preparing to list tools.",
    tags:["Seller Layer","Early Access","High Demand"]
  },
  {
    id:"ex8",
    title:"Operator Perk Bundle B",
    category:"Perks",
    rate:"$29",
    trend:"+3.2%",
    up:true,
    volume:"$1,740",
    description:"Bundle B includes rush slot access, perk tier pricing discount, and Arena recognition credits.",
    tags:["Bundle","3 Perks","Operator Boost"]
  }
];

const activityTemplates = [
  { action:"bought", signal:"buy" },
  { action:"sold", signal:"sell" },
  { action:"swapped into", signal:"buy" },
  { action:"listed", signal:"sell" },
  { action:"transferred", signal:"buy" }
];

const handleNames = [
  "SignalOps","CoreBuild","NeonLayer","ArchOp","VaultSignal",
  "TraceUnit","DataEdge","FluxNode","PrimeBuild","SilentOp"
];

let activePair = "All";
let searchTerm = "";
let rendered = 0;
const PAGE = 6;

function rand(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pct() {
  return Math.floor(Math.random() * 80) + 15;
}

function renderFeatured() {
  const el = document.getElementById("exchangeFeatured");
  if (!el) return;
  const pair = rand(exchangePairs.filter(p => p.up));

  el.innerHTML = `
    <div class="featured-market-card">
      <span class="market-category-pill">${pair.category}</span>
      <h3>${pair.title}</h3>
      <p>${pair.description}</p>
      <div class="featured-market-stats">
        <div><span>RATE</span><strong style="color:#b871ff">${pair.rate}</strong></div>
        <div><span>TREND</span><strong style="color:#39d98a">${pair.trend}</strong></div>
        <div><span>24H VOL</span><strong>${pair.volume}</strong></div>
      </div>
      <div class="exchange-card-actions">
        <button class="exchange-btn exchange-btn-buy">Buy</button>
        <button class="exchange-btn exchange-btn-sell">Sell</button>
        <button class="exchange-btn">Watch</button>
      </div>
    </div>
  `;
}

function renderActivity() {
  const el = document.getElementById("exchangeActivityFeed");
  if (!el) return;

  function addItem() {
    const handle = rand(handleNames);
    const pair = rand(exchangePairs);
    const tmpl = rand(activityTemplates);
    const item = document.createElement("div");
    item.className = "exchange-activity-item";
    item.innerHTML = `<strong>${handle}</strong> <span class="${tmpl.signal}-signal">${tmpl.action}</span> ${pair.title}`;
    el.insertBefore(item, el.firstChild);
    if (el.children.length > 8) el.lastChild.remove();
  }

  for (let i = 0; i < 5; i++) addItem();
  setInterval(addItem, 2800);
}

function renderOrderBook() {
  const bids = document.getElementById("exchangeBids");
  const asks = document.getElementById("exchangeAsks");

  function rows(count, basePrice, step, isBid) {
    return Array.from({ length: count }, (_, i) => {
      const price = (basePrice - (isBid ? i : -i) * step).toFixed(2);
      const amount = (Math.random() * 20 + 5).toFixed(1);
      const total = (parseFloat(price) * parseFloat(amount)).toFixed(0);
      return `
        <div class="exchange-order-row ${isBid ? "exchange-bid-row" : "exchange-ask-row"}">
          <span>${isBid ? "BID" : "ASK"}</span>
          <span class="exchange-order-price">$${price}</span>
          <span class="exchange-order-amount">${amount} units · $${total}</span>
        </div>
      `;
    }).join("");
  }

  if (bids) bids.innerHTML = rows(7, 0.41, 0.01, true);
  if (asks) asks.innerHTML = rows(7, 0.43, 0.01, false);

  // Update sidebar metrics
  const bestBid = document.getElementById("exchangeBestBid");
  const bestAsk = document.getElementById("exchangeBestAsk");
  const spread = document.getElementById("exchangeSpread");
  if (bestBid) bestBid.textContent = "$0.41";
  if (bestAsk) bestAsk.textContent = "$0.43";
  if (spread) spread.textContent = "$0.02";

  setInterval(() => {
    if (bids) bids.innerHTML = rows(7, +(0.38 + Math.random() * 0.06).toFixed(2), 0.01, true);
    if (asks) asks.innerHTML = rows(7, +(0.42 + Math.random() * 0.06).toFixed(2), 0.01, false);
  }, 4200);
}

function getFiltered() {
  return exchangePairs.filter(p => {
    if (activePair !== "All" && p.category !== activePair) return false;
    if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });
}

function renderGrid(reset) {
  const grid = document.getElementById("exchangeGrid");
  if (!grid) return;
  if (reset) { grid.innerHTML = ""; rendered = 0; }

  const filtered = getFiltered();
  const slice = filtered.slice(rendered, rendered + PAGE);
  rendered += slice.length;

  slice.forEach(pair => {
    const vol = pct();
    grid.insertAdjacentHTML("beforeend", `
      <div class="exchange-card">
        <div class="exchange-card-top">
          <div>
            <span class="market-category-pill">${pair.category}</span>
            <h3>${pair.title}</h3>
          </div>
          <div style="text-align:right">
            <div class="exchange-rate">${pair.rate}</div>
            <div class="exchange-trend ${pair.up ? "exchange-trend-up" : "exchange-trend-down"}">${pair.up ? "▲" : "▼"} ${pair.trend}</div>
          </div>
        </div>
        <p class="exchange-card-desc">${pair.description}</p>
        <div style="margin-bottom:12px;font-size:13px;color:#9eb0cf">24H VOL: ${pair.volume}</div>
        <div class="exchange-volume-bar">
          <div class="exchange-volume-fill" style="width:${vol}%"></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">
          ${pair.tags.map(t => `<span class="market-tags" style="padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);font-size:13px">${t}</span>`).join("")}
        </div>
        <div class="exchange-card-actions">
          <button class="exchange-btn exchange-btn-buy">Buy</button>
          <button class="exchange-btn exchange-btn-sell">Sell</button>
          <button class="exchange-btn">Watch</button>
        </div>
      </div>
    `);
  });

  const loading = document.getElementById("exchangeLoading");
  if (loading) loading.style.display = rendered >= filtered.length ? "none" : "block";
}

function initExchangeSearch() {
  const input = document.getElementById("exchangeSearch");
  if (!input) return;
  input.addEventListener("input", () => {
    searchTerm = input.value.trim();
    renderGrid(true);
  });
}

function initPairFilter() {
  document.querySelectorAll("[data-exchange-pair]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-exchange-pair]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activePair = btn.dataset.exchangePair;
      renderGrid(true);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeatured();
  renderActivity();
  renderOrderBook();
  renderGrid(true);
  initExchangeSearch();
  initPairFilter();
});
