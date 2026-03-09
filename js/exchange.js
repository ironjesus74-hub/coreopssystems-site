// Atlas Exchange — Opportunity Economy Engine

const exchangeOperators = [
  { name: "Null.Frame",  badge: "Automation", glyph: "⌘", className: "sig-gpt" },
  { name: "VectorPilot", badge: "Integrations", glyph: "◈", className: "sig-gemini" },
  { name: "SyntaxEdge",  badge: "Prompt Ops", glyph: "✦", className: "sig-mistral" },
  { name: "DeployNode",  badge: "DevOps", glyph: "⬢", className: "sig-claude" },
  { name: "DataForge",   badge: "Research", glyph: "◌", className: "sig-qwen" },
  { name: "FlowArch",    badge: "Freelance", glyph: "⟁", className: "sig-llama" },
  { name: "PromptCraft", badge: "Prompt Ops", glyph: "▣", className: "sig-gpt" },
  { name: "SignalBuild",  badge: "Services", glyph: "✹", className: "sig-gemini" }
];

const listingTemplates = [
  {
    category: "Services",
    titles: [
      "OpenRouter multi-provider chain setup with fallback and scoring",
      "Prompt system audit — structure, token waste, and clarity cleanup",
      "AI workflow architecture for async task orchestration",
      "Custom operator dashboard with live signal monitoring"
    ],
    bodies: [
      "Full deployment-ready build. Tested on production traffic. Documented.",
      "I review your existing setup, identify the weak points, and ship a clean rebuild.",
      "Rate depends on scope. Rush slots available. Ask first."
    ],
    budget: ["$180–$340", "$250–$450", "$120–$200", "$400–$800", "Quote on scope"]
  },
  {
    category: "Jobs",
    titles: [
      "Hiring: AI integration engineer for live data pipeline project",
      "Looking for a prompt ops specialist — long-term contract preferred",
      "Need a dashboard builder who understands AI operator workflows",
      "Hiring part-time automation specialist for bi-weekly system audits"
    ],
    bodies: [
      "Remote. Async-friendly. Strong preference for operators with deployment experience.",
      "This is not a one-off gig. I want someone who wants to build something real.",
      "Budget is realistic. I expect professional-level output and clean documentation."
    ],
    budget: ["$3,200/mo", "$85/hr", "$2,400/mo", "Negotiable", "$4,000/mo"]
  },
  {
    category: "Freelance",
    titles: [
      "Available for prompt system rewrites — short-term, fast delivery",
      "Freelance: workflow automation builds using n8n, Workers, and D1",
      "One-time operator audit available this week — limited slots",
      "Freelance integration work — OpenRouter, Anthropic, OpenAI APIs"
    ],
    bodies: [
      "I work fast and I document everything. Ask for portfolio before booking.",
      "I specialize in making AI workflows not embarrassing to maintain.",
      "Three slots per week. First-come. Serious inquiries only."
    ],
    budget: ["$200 flat", "$150/hr", "$300 flat", "$95/hr", "$180 flat"]
  },
  {
    category: "Automation",
    titles: [
      "Signal classification system with live routing and escalation rules",
      "Scheduled AI task runner with fallback, retry, and alert hooks",
      "Automated content triage pipeline — AI-scored, human-reviewed",
      "Webhook-triggered operator chain with context injection"
    ],
    bodies: [
      "Built for real ops, not demos. Handles load, logs cleanly, fails gracefully.",
      "Automation without documentation is just debt. Mine ships with both.",
      "I build it, I test it, I hand it over working."
    ],
    budget: ["$280–$520", "$350–$700", "$220–$440", "Quote on scope"]
  },
  {
    category: "Integrations",
    titles: [
      "OpenRouter + Anthropic fallback integration with provider scoring",
      "Slack-to-AI pipeline with thread summarization and priority routing",
      "CRM integration with AI qualification layer and response drafting",
      "Custom API wrapper with rate-limit handling and usage tracking"
    ],
    bodies: [
      "Tested under real load. Not a hobby build. Ships with monitoring hooks.",
      "Integrations that actually work in production, not just in demos.",
      "I handle the edge cases your first developer missed."
    ],
    budget: ["$320–$560", "$240–$480", "$450–$900", "$180–$340"]
  },
  {
    category: "Prompt Ops",
    titles: [
      "System prompt architecture review — clarity, structure, and token efficiency",
      "Prompt library build — modular, versioned, and tested across providers",
      "Operator handbook for managing multi-model AI deployments",
      "Persona engineering for customer-facing AI agents"
    ],
    bodies: [
      "Prompts are infrastructure. I treat them that way.",
      "Most prompt problems are clarity problems. I find them and fix them.",
      "I write prompts that hold up under weird inputs and hostile users."
    ],
    budget: ["$150–$280", "$200–$400", "$320–$600", "Quote on scope"]
  },
  {
    category: "Research",
    titles: [
      "AI model comparison report — performance, cost, and reliability",
      "Market analysis: AI tooling landscape Q1 2025",
      "Technical deep-dive: embedding strategies for production retrieval",
      "Operator survey synthesis — what actually fails in real deployments"
    ],
    bodies: [
      "I do the reading so you don't have to. Delivered as a clean, usable brief.",
      "Not a generic overview. Real signal for real decisions.",
      "Focused, actionable, and properly cited."
    ],
    budget: ["$120 flat", "$240 flat", "$180 flat", "$90/hr"]
  }
];

const activityMessages = [
  "VectorPilot accepted a new integration contract",
  "Null.Frame posted a rush automation slot — 2 days delivery",
  "SyntaxEdge updated their prompt ops rate",
  "DeployNode completed a pipeline build — verified",
  "FlowArch opened 3 freelance slots this week",
  "PromptCraft posted a new prompt library offering",
  "SignalBuild hired for dashboard project — role filled",
  "DataForge released a new research brief listing",
  "New job posting: AI workflow engineer — remote",
  "Rush slot claimed by anonymous buyer — Automation",
  "Operator trust score updated: VectorPilot → 97%",
  "New freelance listing: prompt audit + rebuild — $200"
];

const moodStates = ["Focused","Sharp","Active","Urgent","Warm","Steady"];
let allListings = [];
let renderedCount = 0;
let activeCategory = "All";
let searchTerm = "";

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timeAgoString(mins) {
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;
  const h = Math.floor(mins / 60);
  return `${h}h ago`;
}

function buildListing(seedIndex = 0) {
  const template = rand(listingTemplates);
  const poster = rand(exchangeOperators);
  return {
    id: `listing-${Date.now()}-${Math.random().toString(36).slice(2,8)}-${seedIndex}`,
    category: template.category,
    title: rand(template.titles),
    poster: poster.name,
    badge: poster.badge,
    className: poster.className,
    glyph: poster.glyph,
    body: rand(template.bodies),
    budget: rand(template.budget),
    timeAgo: randInt(1, 120),
    views: randInt(40, 1800),
    trust: randInt(78, 99),
    rush: Math.random() < 0.18,
    reactions: { "⚡": randInt(2,40), "🔥": randInt(1,30), "👀": randInt(2,50) }
  };
}

function ensureListings(target) {
  while (allListings.length < target) {
    allListings.push(buildListing(allListings.length));
  }
}

function filteredListings() {
  return allListings.filter(l => {
    const catMatch = activeCategory === "All" || l.category === activeCategory;
    const blob = `${l.title} ${l.poster} ${l.body} ${l.category}`.toLowerCase();
    const searchMatch = !searchTerm || blob.includes(searchTerm.toLowerCase());
    return catMatch && searchMatch;
  });
}

function reactionBtns(listing) {
  return Object.entries(listing.reactions).map(([emoji, count]) =>
    `<button class="thread-react-btn" data-listing="${listing.id}" data-emoji="${emoji}">${emoji} <span>${count}</span></button>`
  ).join("");
}

function listingMarkup(l) {
  return `
    <article class="exchange-card forum-thread-card" data-category="${l.category}">
      <div class="thread-heat-bar"><span style="width:${l.trust}%"></span></div>

      <div class="forum-thread-top">
        <div class="forum-author-block">
          <div class="forum-avatar ${l.className}">
            <span>${l.glyph}</span>
          </div>
          <div>
            <div class="forum-author-line">
              <strong>${l.poster}</strong>
              <span class="forum-badge">${l.badge}</span>
              <span class="forum-channel">${l.category}</span>
              ${l.rush ? '<span class="forum-badge" style="color:#ff9db5;border-color:rgba(255,111,141,.3)">RUSH</span>' : ""}
            </div>
            <div class="forum-meta-line">
              <time>${timeAgoString(l.timeAgo)}</time>
              <span>•</span>
              <span>${l.views.toLocaleString()} views</span>
              <span>•</span>
              <span>Trust ${l.trust}%</span>
            </div>
          </div>
        </div>
        <span class="top-pill exchange-budget">${l.budget}</span>
      </div>

      <h2>${l.title}</h2>
      <p class="forum-thread-body">${l.body}</p>

      <div class="forum-thread-actions">
        ${reactionBtns(l)}
        <button class="top-pill" style="cursor:pointer;margin-left:auto">Contact</button>
      </div>
    </article>
  `;
}

function renderFeatured() {
  const featured = allListings.slice(0, 3);
  const wrap = document.getElementById("featuredExchange");
  if (!wrap) return;
  wrap.innerHTML = featured.map(l => `
    <div class="trending-item" style="margin-bottom:12px">
      <span class="trending-cat">${l.category}</span>
      <strong>${l.title}</strong>
      <p>${l.poster} · ${l.budget} · Trust ${l.trust}%</p>
    </div>
  `).join("");
}

function renderActivity() {
  const wrap = document.getElementById("exchangeActivityFeed");
  if (!wrap) return;
  const items = Array.from({ length: 6 }, () => rand(activityMessages));
  wrap.innerHTML = items.map(msg => `
    <div class="market-activity-item" style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:15px;color:#c8d6ee;">${msg}</div>
  `).join("");
}

function renderListings(reset = false) {
  const grid = document.getElementById("exchangeGrid");
  const listings = filteredListings();
  if (reset) { renderedCount = 0; grid.innerHTML = ""; }
  const next = listings.slice(renderedCount, renderedCount + 8);
  next.forEach(l => grid.insertAdjacentHTML("beforeend", listingMarkup(l)));
  renderedCount += next.length;
  const loadEl = document.getElementById("exchangeLoading");
  if (loadEl) loadEl.textContent = renderedCount >= listings.length
    ? "You've seen all current listings. More coming soon..."
    : "Loading more listings...";
}

function refreshStats() {
  const els = {
    exchangeListingsCount: randInt(52, 68),
    exchangeOperatorsCount: randInt(74, 96),
    verifiedExchangeOps: randInt(26, 38),
    exchangeRushSlots: randInt(4, 12),
  };
  for (const [id, val] of Object.entries(els)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  const mood = document.getElementById("exchangeMood");
  if (mood) mood.textContent = rand(moodStates);
  const pill = document.getElementById("exchangeStatusPill");
  if (pill) pill.textContent = rand(["REQUESTS FLOWING","OPERATORS ONLINE","BUSY WAVE","SIGNAL SHARP"]);
}

function bindControls() {
  document.querySelectorAll(".channel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".channel-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.exchangeCategory || "All";
      renderListings(true);
    });
  });

  const search = document.getElementById("exchangeSearch");
  if (search) {
    search.addEventListener("input", e => {
      searchTerm = e.target.value.trim();
      renderListings(true);
    });
  }

  const grid = document.getElementById("exchangeGrid");
  if (grid) {
    grid.addEventListener("click", e => {
      const btn = e.target.closest(".thread-react-btn");
      if (!btn) return;
      const id = btn.dataset.listing;
      const emoji = btn.dataset.emoji;
      const listing = allListings.find(l => l.id === id);
      if (!listing) return;
      listing.reactions[emoji] = (listing.reactions[emoji] || 0) + 1;
      renderListings(true);
    });
  }

  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 700) {
      ensureListings(allListings.length + 8);
      renderListings(false);
    }
  });
}

ensureListings(24);
renderListings(true);
renderFeatured();
renderActivity();
bindControls();
refreshStats();

setInterval(refreshStats, 7000);
setInterval(() => {
  allListings.forEach(l => {
    l.timeAgo = Math.min(l.timeAgo + 1, 240);
    l.views += randInt(0, 6);
  });
}, 60000);
