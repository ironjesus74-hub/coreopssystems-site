const perks = [
  {
    title:"Early Tool Access",
    desc:"See selected market drops before the wider feed picks them up."
  },
  {
    title:"Profile Signal Boost",
    desc:"Stronger presence visuals across Atlas ID surfaces and future seller cards."
  },
  {
    title:"Saved Operator Priority",
    desc:"Keep your preferred builders and service providers one click closer."
  },
  {
    title:"Perk Tier Pricing",
    desc:"Future discounts on selected tools, services, and premium listings."
  },
  {
    title:"Arena Recognition",
    desc:"Your Atlas ID can be surfaced as an active spectator in future live events."
  },
  {
    title:"Forum Presence Badge",
    desc:"Stand out in Signal Forum interactions with trust-forward profile markers."
  },
  {
    title:"Seller Readiness Layer",
    desc:"Prepares your identity for future marketplace selling and community trust signals."
  }
];

const savedItems = [
  { type:"Tool", title:"OpenRouter Signal Wrapper", meta:"Saved from Market • Trust 96%" },
  { type:"Service", title:"Prompt Ops Cleanup", meta:"Watching operator response times" },
  { type:"Tool", title:"Agent Ops Toolkit", meta:"Saved for future workflow build" },
  { type:"Service", title:"Workflow Automation Design", meta:"Operator bookmarked" },
  { type:"Tool", title:"LLM Research Harvester", meta:"Saved for research stack" },
  { type:"Service", title:"Deployment Sanity Pass", meta:"Considering rush request" }
];

const historyEntries = [
  "Watched GPT-4o vs Gemini 1.5 in Atlas Arena",
  "Saved OpenRouter Signal Wrapper from Market",
  "Reacted to a Signal Forum thread in Drama",
  "Opened a service listing for Prompt Ops Cleanup",
  "Followed a dashboard build operator",
  "Browsed active requests in Jobs board"
];

const activityTemplates = [
  "saved a new tool from Market",
  "watched a fresh Arena matchup",
  "checked an operator profile in Services",
  "followed a live Signal Forum thread",
  "reviewed a rush request in Jobs",
  "unlocked a new perk threshold"
];

function rand(list){
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderPerks(){
  const wrap = document.getElementById("profilePerksList");
  wrap.innerHTML = perks.map(perk => `
    <div class="profile-perk-card">
      <strong>${perk.title}</strong>
      <p>${perk.desc}</p>
    </div>
  `).join("");
}

function renderSaved(){
  const wrap = document.getElementById("profileSavedGrid");
  wrap.innerHTML = savedItems.map(item => `
    <div class="profile-saved-card">
      <span class="profile-saved-type">${item.type}</span>
      <strong>${item.title}</strong>
      <p>${item.meta}</p>
    </div>
  `).join("");
}

function renderHistory(){
  const wrap = document.getElementById("profileHistoryList");
  wrap.innerHTML = historyEntries.map((entry, index) => `
    <div class="profile-history-item">
      <span class="profile-history-dot"></span>
      <div>
        <strong>${entry}</strong>
        <p>${index + 1} recent profile movement</p>
      </div>
    </div>
  `).join("");
}

function addActivity(){
  const feed = document.getElementById("profileActivityFeed");
  const row = document.createElement("div");
  row.className = "profile-activity-item";
  row.innerHTML = `
    <strong>Atlas ID</strong>
    <span>${rand(activityTemplates)}</span>
  `;
  feed.prepend(row);

  while(feed.children.length > 7){
    feed.removeChild(feed.lastChild);
  }
}

function refreshStats(){
  document.getElementById("profileTrust").textContent = randomInt(91, 97) + "%";
  document.getElementById("profileTier").textContent = rand(["Signal+","Core","Prime","Operator"]);
  document.getElementById("profilePerks").textContent = randomInt(6, 9);

  document.getElementById("memberTierCard").textContent = rand(["Signal+","Core","Prime","Operator"]);
  document.getElementById("sellerStatusCard").textContent = rand(["Pending","Not Active","Ready Soon","Applying"]);
  document.getElementById("forumPresenceCard").textContent = rand(["Visible","Strong","Recognized","Rising"]);

  document.getElementById("savedToolsCount").textContent = randomInt(9, 18);
  document.getElementById("watchedMatchesCount").textContent = randomInt(31, 58);
  document.getElementById("serviceFollowsCount").textContent = randomInt(5, 14);

  document.getElementById("profileSignalText").textContent = rand([
    "Strong visibility across the Atlas ecosystem.",
    "Profile trust is trending upward across live surfaces.",
    "Your identity layer is gaining stronger ecosystem weight.",
    "Atlas ID presence is becoming more recognizable."
  ]);
}

renderPerks();
renderSaved();
renderHistory();
refreshStats();

for(let i = 0; i < 4; i++) addActivity();

setInterval(addActivity, 5600);
setInterval(refreshStats, 7200);
