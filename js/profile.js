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

/* ── Copilot Credits ── */
const copilotTierQuota = { Core: 100, "Signal+": 250, Operator: 999 };

function renderCopilotCredits(){
  const tier = rand(["Core","Signal+","Operator"]);
  const quota = copilotTierQuota[tier] || 100;
  // Simulate an empty (or near-empty) state to reflect the issue scenario
  const balance = randomInt(0, Math.floor(quota * 0.08));
  const pct = quota >= 999 ? 100 : Math.round((balance / quota) * 100);

  const balEl = document.getElementById("copilotCreditBalance");
  const fillEl = document.getElementById("copilotCreditFill");
  const noteEl = document.getElementById("copilotCreditNote");
  const tierEl = document.getElementById("copilotCurrentTier");

  if(!balEl) return;

  tierEl.textContent = tier;
  balEl.textContent = quota >= 999 ? "Unlimited" : `${balance} / ${quota}`;
  fillEl.style.width = pct + "%";

  if(balance === 0){
    fillEl.style.background = "var(--red)";
    noteEl.textContent = "Your Copilot credits are empty. Top up via the Exchange or upgrade your tier to resume AI assistant sessions.";
    noteEl.style.color = "var(--red)";
  } else if(pct < 15){
    fillEl.style.background = "linear-gradient(90deg,var(--red),#ff8c00)";
    noteEl.textContent = "Running low. Top up soon to keep Copilot running without interruption.";
    noteEl.style.color = "#ff8c00";
  } else {
    fillEl.style.background = "linear-gradient(90deg,var(--blue),var(--violet))";
    noteEl.textContent = "Copilot is active. Credits renew monthly with your membership tier.";
    noteEl.style.color = "var(--muted)";
  }
}

function bindCopilotActions(){
  const topupBtn = document.getElementById("copilotTopupBtn");
  const upgradeBtn = document.getElementById("copilotUpgradeBtn");
  if(topupBtn) topupBtn.addEventListener("click", () => {
    window.location.href = "exchange.html";
  });
  if(upgradeBtn) upgradeBtn.addEventListener("click", () => {
    window.location.href = "exchange.html";
  });
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
renderCopilotCredits();
bindCopilotActions();
refreshStats();

for(let i = 0; i < 4; i++) addActivity();

setInterval(addActivity, 5600);
setInterval(refreshStats, 7200);

/* ===== ATLAS ID IDENTITY EDITOR ===== */
(function () {
  'use strict';

  var LS_KEY = 'atlasid_profile';

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitiseURL(url) {
    try {
      var u = new URL(url);
      if (u.protocol === 'https:' || u.protocol === 'http:') return u.href;
    } catch (_) {}
    return '';
  }

  function loadProfile() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) { return {}; }
  }

  function saveProfile(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (_) {}
  }

  function renderDisplay(data) {
    var handleEl = document.getElementById('atlasIdHandleDisplay');
    var bioEl    = document.getElementById('atlasIdBioDisplay');
    var linksEl  = document.getElementById('atlasIdLinksDisplay');
    if (!handleEl) return;

    handleEl.textContent = data.handle || 'Operator';
    bioEl.textContent    = data.bio    || 'No bio yet. Tell the platform who you are.';

    linksEl.innerHTML = '';
    if (data.link) {
      var safe = sanitiseURL(data.link);
      if (safe) {
        var a = document.createElement('a');
        a.className = 'atlasid-link-tag';
        a.href = safe;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = safe.replace(/^https?:\/\//, '').replace(/\/$/, '');
        linksEl.appendChild(a);
      }
    }
  }

  function initEditor() {
    var editBtn    = document.getElementById('atlasIdEditBtn');
    var cancelBtn  = document.getElementById('atlasIdCancelBtn');
    var form       = document.getElementById('atlasIdForm');
    var display    = document.getElementById('atlasIdDisplay');
    if (!editBtn || !form || !display) return;

    var handleInput = document.getElementById('atlasIdHandleInput');
    var bioInput    = document.getElementById('atlasIdBioInput');
    var linkInput   = document.getElementById('atlasIdLinkInput');
    var promptInput = document.getElementById('atlasIdPromptInput');

    var profile = loadProfile();
    renderDisplay(profile);

    editBtn.addEventListener('click', function () {
      var p = loadProfile();
      handleInput.value = p.handle  || '';
      bioInput.value    = p.bio     || '';
      linkInput.value   = p.link    || '';
      promptInput.value = p.prompt  || '';
      display.style.display = 'none';
      form.style.display    = 'flex';
    });

    cancelBtn.addEventListener('click', function () {
      form.style.display    = 'none';
      display.style.display = '';
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var link = linkInput.value.trim();
      var safe = link ? sanitiseURL(link) : '';

      var data = {
        handle: handleInput.value.trim().slice(0, 32)  || 'Operator',
        bio:    bioInput.value.trim().slice(0, 160),
        link:   safe,
        prompt: promptInput.value.trim().slice(0, 280)
      };

      saveProfile(data);
      renderDisplay(data);
      form.style.display    = 'none';
      display.style.display = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditor);
  } else {
    initEditor();
  }
}());
