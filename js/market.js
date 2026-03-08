const listings = [
  {
    id:"m1",
    title:"OpenRouter Signal Wrapper",
    category:"Wrappers",
    seller:"Atlas CoreOps",
    sellerBadge:"Verified",
    price:"$39",
    trust:96,
    rating:4.9,
    sales:182,
    tags:["Fallbacks","Provider Routing","Logs"],
    description:"Multi-provider wrapper with fallback logic, provider scoring, retry handling, and clean request tracing."
  },
  {
    id:"m2",
    title:"Prompt Audit Engine",
    category:"Prompt Ops",
    seller:"SignalSmith",
    sellerBadge:"Trusted",
    price:"$24",
    trust:91,
    rating:4.8,
    sales:129,
    tags:["Prompt QA","Detection","Workflow"],
    description:"Catches vague asks, missing constraints, and weak context before they burn time and tokens."
  },
  {
    id:"m3",
    title:"Thread Heat Ranker",
    category:"Automation",
    seller:"Forum Ghost",
    sellerBadge:"Verified",
    price:"$29",
    trust:89,
    rating:4.7,
    sales:96,
    tags:["Rankings","Feeds","Signal"],
    description:"Scores thread momentum, reaction heat, and chatter density so you know what matters first."
  },
  {
    id:"m4",
    title:"Quantum Research Pack",
    category:"Research",
    seller:"Q-Sector",
    sellerBadge:"Specialist",
    price:"$44",
    trust:93,
    rating:4.9,
    sales:74,
    tags:["Papers","Summaries","Structured Notes"],
    description:"Research workflow pack for turning complex sources into cleaner summaries and topic maps."
  },
  {
    id:"m5",
    title:"Agent Ops Toolkit",
    category:"DevOps",
    seller:"InfraRelay",
    sellerBadge:"Trusted",
    price:"$59",
    trust:94,
    rating:4.8,
    sales:145,
    tags:["Monitoring","Health Checks","Ops"],
    description:"Deployment helpers, alert rules, config templates, and lightweight operational guardrails."
  },
  {
    id:"m6",
    title:"Seller Landing Stack",
    category:"Modules",
    seller:"Neon Utility",
    sellerBadge:"Verified",
    price:"$35",
    trust:88,
    rating:4.6,
    sales:111,
    tags:["Cards","Pricing","CTAs"],
    description:"Modular front-end stack for launching tool listings with cleaner product pages and trust blocks."
  },
  {
    id:"m7",
    title:"Chaos Workflow Router",
    category:"Automation",
    seller:"Task Rift",
    sellerBadge:"Wildcard",
    price:"$31",
    trust:84,
    rating:4.5,
    sales:83,
    tags:["Routing","Task Trees","Escalation"],
    description:"Routes noisy inputs into cleaner branches so you stop losing time to mixed-priority messes."
  },
  {
    id:"m8",
    title:"LLM Research Harvester",
    category:"Research",
    seller:"Archive Unit",
    sellerBadge:"Specialist",
    price:"$48",
    trust:95,
    rating:4.9,
    sales:68,
    tags:["Scrape","Summarize","Collect"],
    description:"Collects source notes, cleans them up, and structures outputs for follow-up analysis."
  },
  {
    id:"m9",
    title:"Multi-Agent Prompt Router",
    category:"Wrappers",
    seller:"Coordination Lab",
    sellerBadge:"Trusted",
    price:"$41",
    trust:90,
    rating:4.8,
    sales:121,
    tags:["Router","Delegation","Specialists"],
    description:"Smart routing layer that sends work to the right model profile instead of wasting your strongest one."
  },
  {
    id:"m10",
    title:"Operator Dashboard Shell",
    category:"Modules",
    seller:"Control Room",
    sellerBadge:"Verified",
    price:"$27",
    trust:87,
    rating:4.6,
    sales:138,
    tags:["Dashboard","Widgets","Layout"],
    description:"Reusable shell for control panels, alerts, scorecards, and status-heavy operator screens."
  }
];

const activityTemplates = [
  "grabbed a fresh copy of",
  "left a 5-star rating on",
  "saved for later:",
  "boosted trust on",
  "came back for version 2 of",
  "bookmarked"
];

let activeCategory = "All";
let searchTerm = "";
let renderedListings = 0;

function rand(list){
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function filteredListings(){
  return listings.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const blob = `${item.title} ${item.seller} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    const searchMatch = !searchTerm || blob.includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });
}

function listingMarkup(item){
  return `
    <article class="market-card">
      <div class="market-card-top">
        <div>
          <span class="market-category-pill">${item.category}</span>
          <h3>${item.title}</h3>
        </div>
        <strong class="market-price">${item.price}</strong>
      </div>

      <p class="market-description">${item.description}</p>

      <div class="market-seller-row">
        <div>
          <strong>${item.seller}</strong>
          <span class="market-seller-badge">${item.sellerBadge}</span>
        </div>
        <span class="market-trust">${item.trust}% trust</span>
      </div>

      <div class="market-metrics">
        <span>⭐ ${item.rating}</span>
        <span>${item.sales} sales</span>
      </div>

      <div class="market-tags">
        ${item.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>

      <div class="market-card-actions">
        <button class="market-btn market-btn-primary">View Tool</button>
        <button class="market-btn">Save</button>
      </div>
    </article>
  `;
}

function renderListings(reset = false){
  const grid = document.getElementById("marketGrid");
  const items = filteredListings();

  if(reset){
    grid.innerHTML = "";
    renderedListings = 0;
  }

  const next = items.slice(renderedListings, renderedListings + 6);
  next.forEach(item => grid.insertAdjacentHTML("beforeend", listingMarkup(item)));
  renderedListings += next.length;

  document.getElementById("marketLoading").textContent =
    renderedListings >= items.length ? "You reached the visible edge. More listings rotate in soon..." : "Loading more listings...";
}

function renderFeatured(){
  const item = [...listings].sort((a,b) => (b.trust + b.sales) - (a.trust + a.sales))[0];
  document.getElementById("featuredListing").innerHTML = `
    <div class="featured-market-card">
      <span class="market-category-pill">${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>

      <div class="featured-market-stats">
        <div><span>Seller</span><strong>${item.seller}</strong></div>
        <div><span>Trust</span><strong>${item.trust}%</strong></div>
        <div><span>Sales</span><strong>${item.sales}</strong></div>
      </div>

      <div class="market-tags">
        ${item.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>

      <div class="market-card-actions">
        <button class="market-btn market-btn-primary">Open Listing</button>
        <button class="market-btn">Watch Tool</button>
      </div>
    </div>
  `;
}

function addActivityItem(){
  const item = rand(listings);
  const buyer = rand(["Operator-17","GhostBuilder","AtlasUser442","SignalPilot","PromptMercy","RiftNode"]);
  const feed = document.getElementById("marketActivityFeed");
  const row = document.createElement("div");
  row.className = "market-activity-item";
  row.innerHTML = `
    <strong>${buyer}</strong>
    <span>${rand(activityTemplates)}</span>
    <em>${item.title}</em>
  `;
  feed.prepend(row);

  while(feed.children.length > 7){
    feed.removeChild(feed.lastChild);
  }
}

function refreshMarketStats(){
  document.getElementById("marketListingsCount").textContent = randomInt(42, 58);
  document.getElementById("marketBuyersCount").textContent = randomInt(180, 296);
  document.getElementById("marketTrustCount").textContent = randomInt(88, 97) + "%";
  document.getElementById("verifiedSellers").textContent = randomInt(16, 24);
  document.getElementById("freshDrops").textContent = randomInt(4, 11);
  document.getElementById("buyerMood").textContent = rand(["Sharp","Curious","Active","Locked In"]);
  document.getElementById("marketStatusPill").textContent = rand(["BUYERS WATCHING","FRESH DROPS","TRUST HIGH","ROOM MOVING"]);
}

function bindControls(){
  document.querySelectorAll("[data-market-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-market-category]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.marketCategory;
      renderListings(true);
    });
  });

  document.getElementById("marketSearch").addEventListener("input", e => {
    searchTerm = e.target.value.trim();
    renderListings(true);
  });

  window.addEventListener("scroll", () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 700;
    if(nearBottom){
      renderListings(false);
    }
  });
}

renderFeatured();
renderListings(true);
bindControls();
refreshMarketStats();

for(let i = 0; i < 4; i++) addActivityItem();

setInterval(addActivityItem, 5200);
setInterval(refreshMarketStats, 7000);
