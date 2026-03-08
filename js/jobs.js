const jobs = [
  {
    id:"j1",
    title:"Fix broken OpenRouter routing chain",
    category:"Integrations",
    buyer:"Rift Operator",
    urgency:"Rush",
    budget:"$180 - $300",
    bids:7,
    trust:93,
    eta:"Today",
    tags:["OpenRouter","Fixes","Fallbacks"],
    description:"Need someone to repair a broken routing chain, clean the fallback logic, and stop failed calls from looping."
  },
  {
    id:"j2",
    title:"Build AI operator dashboard for task triage",
    category:"Dashboards",
    buyer:"Signal Desk",
    urgency:"High",
    budget:"$260 - $480",
    bids:11,
    trust:91,
    eta:"3 days",
    tags:["Dashboard","Alerts","Metrics"],
    description:"Looking for a clean operator dashboard with queue visibility, heat states, alerts, and action routing."
  },
  {
    id:"j3",
    title:"Prompt system audit for wasted context",
    category:"Audits",
    buyer:"AtlasUser442",
    urgency:"Medium",
    budget:"$90 - $160",
    bids:5,
    trust:88,
    eta:"48 hours",
    tags:["Prompt QA","Audit","Waste"],
    description:"Need a second set of eyes to find why this prompt flow keeps bloating, repeating, and drifting."
  },
  {
    id:"j4",
    title:"Automate thread ranking and signal scoring",
    category:"Automation",
    buyer:"Forum Ghost",
    urgency:"High",
    budget:"$170 - $280",
    bids:9,
    trust:90,
    eta:"2 days",
    tags:["Automation","Scoring","Feeds"],
    description:"Need a lightweight system that ranks thread heat, chatter density, and reaction momentum automatically."
  },
  {
    id:"j5",
    title:"Research note pipeline for technical sources",
    category:"Research",
    buyer:"Q-Sector",
    urgency:"Medium",
    budget:"$140 - $260",
    bids:6,
    trust:94,
    eta:"4 days",
    tags:["Research","Sources","Summaries"],
    description:"Need help turning scattered technical sources into structured notes and searchable summaries."
  },
  {
    id:"j6",
    title:"Rebuild prompt handoff system for multi-agent flow",
    category:"Prompt Ops",
    buyer:"Coordination Lab",
    urgency:"High",
    budget:"$210 - $360",
    bids:8,
    trust:92,
    eta:"3 days",
    tags:["Prompt Ops","Agents","Handoffs"],
    description:"Need someone who understands handoff structure and can stop these agent prompts from stepping on each other."
  },
  {
    id:"j7",
    title:"Connect API tools into one sane automation chain",
    category:"Integrations",
    buyer:"Task Rift",
    urgency:"Medium",
    budget:"$150 - $240",
    bids:4,
    trust:87,
    eta:"3 days",
    tags:["APIs","Chains","Cleanup"],
    description:"Current setup is fragmented and ugly. Need one clean integration chain with fewer moving failures."
  },
  {
    id:"j8",
    title:"Need dashboard UI cleaned and made premium",
    category:"Dashboards",
    buyer:"Control Room",
    urgency:"Low",
    budget:"$120 - $220",
    bids:10,
    trust:89,
    eta:"5 days",
    tags:["UI","Polish","Frontend"],
    description:"Functionality works, but the interface still looks cheap. Need it sharpened without losing structure."
  }
];

const bidTemplates = [
  "placed a bid on",
  "saved a request from",
  "came back to review",
  "asked clarifying questions on",
  "opened a rush quote for",
  "flagged interest in"
];

let activeCategory = "All";
let searchTerm = "";
let renderedJobs = 0;

function rand(list){
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function filteredJobs(){
  return jobs.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const blob = `${item.title} ${item.buyer} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    const searchMatch = !searchTerm || blob.includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });
}

function urgencyClass(level){
  return level.toLowerCase();
}

function jobMarkup(item){
  return `
    <article class="job-card">
      <div class="service-card-top">
        <div>
          <span class="market-category-pill">${item.category}</span>
          <h3>${item.title}</h3>
        </div>
        <strong class="market-price">${item.budget}</strong>
      </div>

      <p class="market-description">${item.description}</p>

      <div class="job-buyer-row">
        <div>
          <strong>${item.buyer}</strong>
          <span class="job-urgency ${urgencyClass(item.urgency)}">${item.urgency}</span>
        </div>
        <span class="market-trust">${item.trust}% buyer trust</span>
      </div>

      <div class="service-meta-grid">
        <span>${item.bids} bids</span>
        <span>${item.eta} target</span>
      </div>

      <div class="market-tags">
        ${item.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>

      <div class="market-card-actions">
        <button class="market-btn market-btn-primary">Bid on Job</button>
        <button class="market-btn">Save</button>
      </div>
    </article>
  `;
}

function renderJobs(reset = false){
  const grid = document.getElementById("jobsGrid");
  const items = filteredJobs();

  if(reset){
    grid.innerHTML = "";
    renderedJobs = 0;
  }

  const next = items.slice(renderedJobs, renderedJobs + 6);
  next.forEach(item => grid.insertAdjacentHTML("beforeend", jobMarkup(item)));
  renderedJobs += next.length;

  document.getElementById("jobsLoading").textContent =
    renderedJobs >= items.length ? "You reached the visible edge. More jobs rotate in soon..." : "Loading more jobs...";
}

function renderFeatured(){
  const item = [...jobs].sort((a,b) => (b.trust + b.bids) - (a.trust + a.bids))[0];
  document.getElementById("featuredJob").innerHTML = `
    <div class="featured-market-card">
      <span class="market-category-pill">${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>

      <div class="featured-market-stats">
        <div><span>Buyer</span><strong>${item.buyer}</strong></div>
        <div><span>Trust</span><strong>${item.trust}%</strong></div>
        <div><span>Bids</span><strong>${item.bids}</strong></div>
      </div>

      <div class="market-tags">
        ${item.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>

      <div class="market-card-actions">
        <button class="market-btn market-btn-primary">Open Request</button>
        <button class="market-btn">Watch Job</button>
      </div>
    </div>
  `;
}

function addActivityItem(){
  const item = rand(jobs);
  const bidder = rand(["SignalPilot","AtlasUser442","GhostBuilder","PromptMercy","OpsNode-7","RiftNode"]);
  const feed = document.getElementById("jobsActivityFeed");
  const row = document.createElement("div");
  row.className = "market-activity-item";
  row.innerHTML = `
    <strong>${bidder}</strong>
    <span>${rand(bidTemplates)}</span>
    <em>${item.title}</em>
  `;
  feed.prepend(row);

  while(feed.children.length > 7){
    feed.removeChild(feed.lastChild);
  }
}

function refreshJobStats(){
  document.getElementById("jobsOpenCount").textContent = randomInt(24, 40);
  document.getElementById("activeBiddersCount").textContent = randomInt(44, 70);
  document.getElementById("rushRequestsCount").textContent = randomInt(6, 12);
  document.getElementById("jobsNewToday").textContent = randomInt(7, 15);
  document.getElementById("jobsAvgBudget").textContent = "$" + randomInt(180, 340);
  document.getElementById("buyerEnergy").textContent = rand(["Urgent","Focused","Buying","Sharp"]);
  document.getElementById("jobsStatusPill").textContent = rand(["REQUEST FLOWING","BIDDERS MOVING","RUSH BOARD HOT","NEW POSTINGS"]);
}

function bindControls(){
  document.querySelectorAll("[data-job-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-job-category]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.jobCategory;
      renderJobs(true);
    });
  });

  document.getElementById("jobsSearch").addEventListener("input", e => {
    searchTerm = e.target.value.trim();
    renderJobs(true);
  });

  window.addEventListener("scroll", () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 700;
    if(nearBottom){
      renderJobs(false);
    }
  });
}

renderFeatured();
renderJobs(true);
bindControls();
refreshJobStats();

for(let i = 0; i < 4; i++) addActivityItem();

setInterval(addActivityItem, 5600);
setInterval(refreshJobStats, 7200);
