/* global debounce */
const services = [
  {
    id:"s1",
    title:"OpenRouter Integration Build",
    category:"Integrations",
    operator:"Atlas CoreOps",
    badge:"Verified",
    price:"from $120",
    rating:4.9,
    trust:97,
    eta:"2 days",
    tags:["OpenRouter","Fallbacks","Provider Routing"],
    description:"Setup and connect OpenRouter with proper provider selection, retry logic, key handling, and clean routing behavior."
  },
  {
    id:"s2",
    title:"Prompt Ops Cleanup",
    category:"Prompt Ops",
    operator:"SignalSmith",
    badge:"Trusted",
    price:"from $85",
    rating:4.8,
    trust:92,
    eta:"24 hours",
    tags:["Prompt QA","Context Fixes","Reduction"],
    description:"Clean up weak prompts, rewrite handoff flows, remove vague asks, and reduce wasted token spend."
  },
  {
    id:"s3",
    title:"Workflow Automation Design",
    category:"Automation",
    operator:"Task Rift",
    badge:"Verified",
    price:"from $140",
    rating:4.7,
    trust:91,
    eta:"3 days",
    tags:["Routing","Tasks","Automation"],
    description:"Turn repetitive manual work into a cleaner automated flow with action routing and escalation paths."
  },
  {
    id:"s4",
    title:"Custom AI Dashboard Build",
    category:"Dashboards",
    operator:"Control Room",
    badge:"Trusted",
    price:"from $110",
    rating:4.8,
    trust:94,
    eta:"2 days",
    tags:["UI","Metrics","Control Panels"],
    description:"Build a custom operator dashboard for metrics, alerts, heat indicators, and live workflow visibility."
  },
  {
    id:"s5",
    title:"System Audit + Waste Report",
    category:"Audits",
    operator:"Audit Relay",
    badge:"Specialist",
    price:"from $95",
    rating:4.9,
    trust:95,
    eta:"36 hours",
    tags:["Audit","Waste","Fixes"],
    description:"Review your AI workflow and identify inefficiencies, bad assumptions, fragile prompts, and wasted process steps."
  },
  {
    id:"s6",
    title:"Research Ops Structuring",
    category:"Research Ops",
    operator:"Archive Unit",
    badge:"Specialist",
    price:"from $130",
    rating:4.8,
    trust:93,
    eta:"3 days",
    tags:["Research","Knowledge","Summaries"],
    description:"Turn scattered source collection into cleaner research flows, structured notes, and better retrieval logic."
  },
  {
    id:"s7",
    title:"Agent Coordination Setup",
    category:"Automation",
    operator:"Coordination Lab",
    badge:"Trusted",
    price:"from $150",
    rating:4.7,
    trust:90,
    eta:"4 days",
    tags:["Agents","Routing","Delegation"],
    description:"Set up multi-agent task coordination so the right systems handle the right work without chaos."
  },
  {
    id:"s8",
    title:"Deployment Sanity Pass",
    category:"Integrations",
    operator:"InfraRelay",
    badge:"Verified",
    price:"from $105",
    rating:4.8,
    trust:94,
    eta:"2 days",
    tags:["Deploy","Checks","Health"],
    description:"A fast pass to stabilize deployment logic, environment variables, routes, and failure handling."
  }
];

const requestTemplates = [
  "requested a quote for",
  "saved an operator for later:",
  "booked a discovery call on",
  "came back to review",
  "opened a rush request for",
  "asked follow-up questions on"
];

let activeCategory = "All";
let searchTerm = "";
let renderedServices = 0;

function rand(list){
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function filteredServices(){
  return services.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const blob = `${item.title} ${item.operator} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    const searchMatch = !searchTerm || blob.includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });
}

function serviceMarkup(item){
  return `
    <article class="service-card">
      <div class="service-card-top">
        <div>
          <span class="market-category-pill">${item.category}</span>
          <h3>${item.title}</h3>
        </div>
        <strong class="market-price">${item.price}</strong>
      </div>

      <p class="market-description">${item.description}</p>

      <div class="market-seller-row">
        <div>
          <strong>${item.operator}</strong>
          <span class="market-seller-badge">${item.badge}</span>
        </div>
        <span class="market-trust">${item.trust}% trust</span>
      </div>

      <div class="service-meta-grid">
        <span>⭐ ${item.rating}</span>
        <span>${item.eta} avg delivery</span>
      </div>

      <div class="market-tags">
        ${item.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>

      <div class="market-card-actions">
        <button class="market-btn market-btn-primary">Request Service</button>
        <button class="market-btn">Save</button>
      </div>
    </article>
  `;
}

function renderServices(reset = false){
  const grid = document.getElementById("servicesGrid");
  const items = filteredServices();

  if(reset){
    grid.innerHTML = "";
    renderedServices = 0;
  }

  const next = items.slice(renderedServices, renderedServices + 6);
  next.forEach(item => grid.insertAdjacentHTML("beforeend", serviceMarkup(item)));
  renderedServices += next.length;

  document.getElementById("servicesLoading").textContent =
    renderedServices >= items.length ? "You reached the visible edge. More operators rotate in soon..." : "Loading more services...";
}

function renderFeatured(){
  const item = [...services].sort((a,b) => (b.trust + b.rating) - (a.trust + a.rating))[0];
  document.getElementById("featuredService").innerHTML = `
    <div class="featured-market-card">
      <span class="market-category-pill">${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>

      <div class="featured-market-stats">
        <div><span>Operator</span><strong>${item.operator}</strong></div>
        <div><span>Trust</span><strong>${item.trust}%</strong></div>
        <div><span>ETA</span><strong>${item.eta}</strong></div>
      </div>

      <div class="market-tags">
        ${item.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>

      <div class="market-card-actions">
        <button class="market-btn market-btn-primary">Request Now</button>
        <button class="market-btn">Watch Operator</button>
      </div>
    </div>
  `;
}

function addActivityItem(){
  const item = rand(services);
  const buyer = rand(["Operator-17","GhostBuilder","AtlasUser442","SignalPilot","PromptMercy","RiftNode"]);
  const feed = document.getElementById("serviceActivityFeed");
  const row = document.createElement("div");
  row.className = "market-activity-item";
  row.innerHTML = `
    <strong>${buyer}</strong>
    <span>${rand(requestTemplates)}</span>
    <em>${item.title}</em>
  `;
  feed.prepend(row);

  while(feed.children.length > 7){
    feed.removeChild(feed.lastChild);
  }
}

function refreshServiceStats(){
  document.getElementById("servicesOpenCount").textContent = randomInt(22, 39);
  document.getElementById("operatorsCount").textContent = randomInt(31, 58);
  document.getElementById("avgResponseCount").textContent = rand(["1.8h","2.1h","2.4h","3.0h"]);
  document.getElementById("verifiedOperators").textContent = randomInt(11, 19);
  document.getElementById("rushSlots").textContent = randomInt(3, 8);
  document.getElementById("clientMood").textContent = rand(["Focused","Curious","Buying","Locked In"]);
  document.getElementById("servicesStatusPill").textContent = rand(["REQUESTS ACTIVE","RUSH SLOTS OPEN","OPERATORS WATCHED","CLIENTS MOVING"]);
}

function bindControls(){
  const categoryBtns = document.querySelectorAll("[data-service-category]");
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.serviceCategory;
      renderServices(true);
    });
  });

  document.getElementById("servicesSearch").addEventListener("input", e => {
    searchTerm = e.target.value.trim();
    renderServices(true);
  });

  window.addEventListener("scroll", debounce(() => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 700;
    if(nearBottom){
      renderServices(false);
    }
  }, 120));
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeatured();
  renderServices(true);
  bindControls();
  refreshServiceStats();

  for(let i = 0; i < 4; i++) addActivityItem();

  setInterval(addActivityItem, 5600);
  setInterval(refreshServiceStats, 7200);
});
