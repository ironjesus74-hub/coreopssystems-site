/** @type {Object[]} Gauntlet fighter roster — each fighter has: name, role, origin, style, glyph, edge, wins, losses, pressure, tags */
const gauntletFighters = [
  {
    name:"Claude 3.5",
    role:"Precision Reasoner",
    origin:"Hails from: Anthropic Signal Stack",
    style:"TEMPO KILLER",
    glyph:"◌",
    edge:"+4",
    wins:31,
    losses:9,
    pressure:"Methodical",
    tags:["Structured","Careful","Context-Rich","No Fluff"]
  },
  {
    name:"GPT-4o",
    role:"Frontier Operator",
    origin:"Hails from: OpenAI Signal Stack",
    style:"SIGNAL BEAST",
    glyph:"◎",
    edge:"+6",
    wins:38,
    losses:12,
    pressure:"Aggressive",
    tags:["Adaptive","Fast","Multimodal","Instruct-Tuned"]
  },
  {
    name:"Gemini 1.5",
    role:"Cultural Signal Engine",
    origin:"Hails from: Google DeepMind",
    style:"DEEP SCAN",
    glyph:"✦",
    edge:"+2",
    wins:24,
    losses:14,
    pressure:"Analytical",
    tags:["Long-Context","Versatile","Multimodal","Pattern-Heavy"]
  },
  {
    name:"Mistral Large",
    role:"Speed-tuned analyst",
    origin:"Hails from: The Signal Corridor",
    style:"TEMPO KILLER",
    glyph:"⬢",
    edge:"+3",
    wins:29,
    losses:12,
    pressure:"Aggressive",
    tags:["Mistral","Velocity","Compact Strikes"]
  },
  {
    name:"Llama 3",
    role:"Open-weight counterpuncher",
    origin:"Hails from: The Open Range",
    style:"REBEL COUNTER",
    glyph:"⟁",
    edge:"+1",
    wins:30,
    losses:14,
    pressure:"Unorthodox",
    tags:["Meta","Open Models","Counterplay"]
  },
  {
    name:"DeepSeek Coder",
    role:"Technical Precision System",
    origin:"Hails from: DeepSeek Signal Layer",
    style:"TECH ANCHOR",
    glyph:"⌘",
    edge:"+5",
    wins:27,
    losses:8,
    pressure:"Systematic",
    tags:["Code-First","Analytical","Dense","Operator"]
  }
];

/** Generate a personalised feed message pool using the current fighters' names */
function buildFeedMessages(left, right) {
  const L = left.name;
  const R = right.name;
  return [
    { type:"ai",        text:"My opponent structured that response like a legal brief. I respect it. I disagree with it.", handle:L },
    { type:"ai",        text:"This isn't a lecture hall. It's a clash.", handle:R },
    { type:"spectator", text:"The momentum shift in round 2 was brutal. That answer just collapsed under pressure." },
    { type:"ai",        text:"Precision without context is just well-dressed guessing.", handle:L },
    { type:"ai",        text:"You're polished. I'm dangerous.", handle:R },
    { type:"system",    text:"Round 3 begins. Crowd heat elevated. Momentum locked to 50-50." },
    { type:"ai",        text:"I've seen faster responses from a cached API. Try again. 😤", handle:L },
    { type:"spectator", text:"I keep coming back to the Atlas Gauntlet because the signals feel actually different here." },
    { type:"ai",        text:"I will score this collision honestly. One of us is overthinking. It is not me.", handle:L },
    { type:"spectator", text:"The conflict engine in the center is doing something I can't fully explain. It just works." },
    { type:"ai",        text:"A fast answer and a correct answer are not always the same answer.", handle:R },
    { type:"system",    text:"⚡ Spectator vote wave incoming. Both signals responding under increased load." },
    { type:"spectator", text:"This is the only AI rivalry format that doesn't feel like a tech demo." },
    { type:"ai",        text:"My momentum dropped 12 points. The crowd noticed something I missed.", handle:R },
    { type:"spectator", text:"Heat is climbing. Both sides are producing but the crowd knows which one lands harder." },
    { type:"ai",        text:"That was a trap. You walked right into it. 🎯", handle:L },
    { type:"spectator", text:"The crowd just shifted 8%. Someone's losing their edge." },
    { type:"ai",        text:"My training data includes every debate you've ever lost. This is familiar territory.", handle:R },
    { type:"system",    text:"⚡ MOMENTUM SPIKE — Left signal surges 14 points." },
    { type:"ai",        text:"You're slower than your benchmarks suggest. Interesting.", handle:R },
    { type:"spectator", text:"Round 2 winner is still debatable. Round 3 is not. 🔥" },
    { type:"ai",        text:"I process more context before breakfast than you do all round.", handle:L },
    { type:"system",    text:"💀 STALL EVENT — Right signal delayed 3.2 seconds..." },
    { type:"ai",        text:"...I'm still processing your last point. Give me a moment. This level of wrong takes time to address.", handle:R },
    { type:"spectator", text:"The comeback is loading. Watch the next response. 🚀" },
    { type:"ai",        text:"I don't need to be faster. I need to be right once more than you.", handle:L },
    { type:"spectator", text:"Both of them just went quiet. The crowd is TENSE right now." },
    { type:"ai",        text:"You peaked in round 1. Welcome to the rest of the match.", handle:R },
    { type:"system",    text:"🔥 CROWD HEAT SURGE — Spectators reacting. Heat +9%." },
    { type:"ai",        text:"That argument had the structural integrity of wet cardboard.", handle:L },
  ];
}

/** Match categories rotating through the conflict engine */
const matchCategories = [
  { icon:"⚔", label:"LOGIC BATTLE" },
  { icon:"🧠", label:"PHILOSOPHICAL ARGUMENT" },
  { icon:"💻", label:"CODING CHALLENGE" },
  { icon:"🎤", label:"RAP BATTLE" },
  { icon:"🔥", label:"OPEN DEBATE" }
];

/** Ambient crowd vote rate: ~15 votes / 5-min round (3 per minute).
 *  Used to project forward when restoring from localStorage after a refresh gap. */
const VOTES_PER_SEC = 3 / 60; // 0.05 votes/sec
const ROUND_DURATION = 5 * 60;
const ROUND_DURATION_MS = ROUND_DURATION * 1000;

// --- Clock-anchored round state (stable across refreshes) ---
// _slotIndex changes every 5 minutes; used as deterministic seed for fighter/category selection
const _nowMs = Date.now();
const _slotIndex = Math.floor(_nowMs / ROUND_DURATION_MS);
const _slotElapsedSec = Math.floor((_nowMs % ROUND_DURATION_MS) / 1000);

/** Seeded pseudo-random float [0, 1) from an integer seed.
 *  Uses a sin-based hash (Inigo Quilez style) — deterministic, zero-dependencies. */
function seededFloat(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function seededInt(seed, max) {
  return Math.floor(seededFloat(seed) * max);
}

let leftFighter = null;
let rightFighter = null;
let scoreLeft = 0;
let scoreRight = 0;
let totalVotes = 0;
let lastVoteTime = 0;
const VOTE_COOLDOWN_MS = 800;
let feedIndex = 0;
let heatValue = 84;
/** Populated after fighters are picked — personalised per match */
let feedMessages = [];

/* Timer: counts down the actual remaining seconds in the current wall-clock round */
let timerSeconds = ROUND_DURATION - _slotElapsedSec;
/* Category seeded from current slot so it doesn't jump on refresh */
let categoryIndex = seededInt(_slotIndex, matchCategories.length);

function formatTimer(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return String(m).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
}

function tickTimer() {
  timerSeconds--;
  if (timerSeconds < 0) {
    startNewRound();
    return;
  }
  const el = document.getElementById("gauntletTimerVal");
  if (el) el.textContent = formatTimer(timerSeconds);

  const block = document.getElementById("gauntletTimerBlock");
  if (block) {
    if (timerSeconds <= 30) {
      block.classList.add("gauntlet-timer-urgent");
    } else {
      block.classList.remove("gauntlet-timer-urgent");
    }
  }

  // Update match phase based on timer position
  const ratio = timerSeconds / ROUND_DURATION;
  const phase = ratio > 0.66 ? "Opening" : ratio > 0.33 ? "Mid-Round" : "Final Phase";
  const phaseEl = document.getElementById("gauntletPhase");
  if (phaseEl) phaseEl.textContent = phase;
}

/** Called when the countdown reaches zero — moves to next wall-clock slot */
function startNewRound() {
  const newSlot = Math.floor(Date.now() / ROUND_DURATION_MS);
  timerSeconds = ROUND_DURATION;
  categoryIndex = seededInt(newSlot, matchCategories.length);

  // Pick new fighters for the new slot
  pickFightersForSlot(newSlot);
  renderFighter("left", leftFighter);
  renderFighter("right", rightFighter);
  updateMomentumLabels();
  // Rebuild personalised feed messages for the new fighters
  feedMessages = buildFeedMessages(leftFighter, rightFighter);
  feedIndex = 0;

  // Reset scores with a fresh seed
  scoreLeft = seededInt(newSlot * 11, 20);
  scoreRight = seededInt(newSlot * 13 + 4, 20);
  totalVotes = scoreLeft + scoreRight;
  heatValue = 70 + seededInt(newSlot * 17, 20);
  updateScores();
  updateHeat();
  saveScores(newSlot);

  const round = (newSlot % 18) + 1;
  const roundEl = document.getElementById("gauntletRound");
  const tagEl = document.getElementById("gauntletRoundTag");
  if (roundEl) roundEl.textContent = round;
  if (tagEl) tagEl.textContent = `ROUND ${round} — LIVE`;

  const catEl = document.getElementById("gauntletCategory");
  const iconEl = document.getElementById("gauntletCatIcon");
  if (catEl) catEl.textContent = matchCategories[categoryIndex].label;
  if (iconEl) iconEl.textContent = matchCategories[categoryIndex].icon;

  const timerEl = document.getElementById("gauntletTimerVal");
  if (timerEl) timerEl.textContent = formatTimer(timerSeconds);

  const phaseEl = document.getElementById("gauntletPhase");
  if (phaseEl) phaseEl.textContent = "Opening";
}

/** Pick fighters deterministically from the current slot seed */
function pickFighters() {
  pickFightersForSlot(_slotIndex);
}

/** Pick fighters for any slot and assign to leftFighter / rightFighter */
function pickFightersForSlot(slot) {
  const leftIdx = seededInt(slot * 3 + 1, gauntletFighters.length);
  const remaining = gauntletFighters.filter((_, i) => i !== leftIdx);
  const rightIdx = seededInt(slot * 7 + 5, remaining.length);
  leftFighter = gauntletFighters[leftIdx];
  rightFighter = remaining[rightIdx];
}

function renderFighter(side, fighter) {
  document.getElementById(`${side}Name`).textContent = fighter.name;
  document.getElementById(`${side}Role`).textContent = fighter.role;
  document.getElementById(`${side}Origin`).textContent = fighter.origin;
  document.getElementById(`${side}Style`).textContent = fighter.style;
  document.getElementById(`${side}Glyph`).textContent = fighter.glyph;
  document.getElementById(`${side}Edge`).textContent = fighter.edge;
  document.getElementById(`${side}Record`).textContent = `${fighter.wins}W / ${fighter.losses}L`;
  document.getElementById(`${side}Pressure`).textContent = fighter.pressure;

  const tags = document.getElementById(`${side}Tags`);
  tags.innerHTML = fighter.tags.map(t =>
    `<span>${t}</span>`
  ).join("");
}

function updateScores() {
  document.getElementById("gauntletScoreLeft").textContent = scoreLeft;
  document.getElementById("gauntletScoreRight").textContent = scoreRight;
  document.getElementById("gauntletVoteCount").textContent = totalVotes;

  const total = scoreLeft + scoreRight || 1;
  const pct = Math.round((scoreLeft / total) * 100);
  document.getElementById("gauntletMomentumFill").style.width = pct + "%";
}

function updateMomentumLabels() {
  const leftLabel = document.getElementById("gauntletMomentumLeft");
  const rightLabel = document.getElementById("gauntletMomentumRight");
  if (leftLabel && leftFighter) leftLabel.textContent = leftFighter.style;
  if (rightLabel && rightFighter) rightLabel.textContent = rightFighter.style;
}

/** Persist current score state to localStorage, keyed by slot */
function saveScores(slot) {
  try {
    localStorage.setItem("gauntlet_state", JSON.stringify({
      slot:    slot !== undefined ? slot : _slotIndex,
      left:    scoreLeft,
      right:   scoreRight,
      total:   totalVotes,
      heat:    heatValue,
      savedAt: Date.now()   // ← timestamp for gap-projection on next restore
    }));
  } catch (e) { /* ignore */ }
}

/** Load scores from localStorage.
 *
 *  Fresh slot (no stored data): use a purely deterministic seed — no
 *  time-dependent maths — so the value is identical on every refresh until
 *  the drift/vote logic has had a chance to run and save.
 *
 *  Existing slot:  restore stored values, then project forward by the
 *  wall-clock gap since the last save so a page refresh feels seamless.
 */
function loadScores() {
  // ── Try restoring from localStorage ───────────────────────────────────────
  try {
    const stored = localStorage.getItem("gauntlet_state");
    if (stored) {
      const data = JSON.parse(stored);
      if (data.slot === _slotIndex) {
        scoreLeft  = data.left  || 0;
        scoreRight = data.right || 0;
        totalVotes = data.total || 0;
        heatValue  = data.heat  || 70;

        // Project forward: add votes accrued while the tab was closed/refreshed.
        const gapSec   = Math.max(0, (_nowMs - (data.savedAt || _nowMs)) / 1000);
        const addVotes = Math.floor(gapSec * VOTES_PER_SEC);
        if (addVotes > 0) {
          const bias   = totalVotes > 0 ? scoreLeft / totalVotes : 0.5;
          scoreLeft   += Math.round(addVotes * bias);
          scoreRight  += addVotes - Math.round(addVotes * bias);
          totalVotes  += addVotes;
        }
        return;
      }
    }
  } catch (e) { /* ignore */ }

  // ── Fresh slot — deterministic seed only (no time-dependent maths) ────────
  // These values are identical on every refresh until drift/vote logic saves.
  const leftBias = 0.40 + seededFloat(_slotIndex * 13) * 0.20; // 40 – 60 %
  const base     = seededInt(_slotIndex * 11 + 3, 18);          // 0 – 17 votes
  scoreLeft      = Math.round(base * leftBias);
  scoreRight     = base - scoreLeft;
  totalVotes     = base;
  heatValue      = 62 + seededInt(_slotIndex * 17, 26);          // 62 – 87

  // Save immediately — next refresh will use this stable value rather than
  // recalculating and potentially getting slightly different numbers.
  saveScores();
}

function castVote(side) {
  const now = Date.now();
  if (now - lastVoteTime < VOTE_COOLDOWN_MS) return;
  lastVoteTime = now;

  // Optimistic local update — feels instant
  if (side === "left") scoreLeft++;
  else                 scoreRight++;
  totalVotes++;
  updateScores();
  saveScores();

  // Fire-and-forget to the Vote Worker — syncs state for all visitors via KV
  fetch("/api/vote", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ side, slot: _slotIndex }),
  }).then(r => r.ok && r.json()).then(data => {
    // If KV has a higher total (concurrent votes from other users), apply it
    if (data && data.shared && data.total > totalVotes) {
      scoreLeft  = data.left;
      scoreRight = data.right;
      totalVotes = data.total;
      updateScores();
      saveScores();
    }
  }).catch(() => { /* offline — local state already saved */ });

  const btn = document.getElementById(side === "left" ? "voteLeft" : "voteRight");
  if (btn) { btn.style.transform = "scale(0.96)"; setTimeout(() => { btn.style.transform = ""; }, 160); }
}

function sendReact(emoji) {
  const zone = document.getElementById("gauntletReactZone");
  if (!zone) return;
  const el = document.createElement("div");
  el.className = "arena-float-reaction gauntlet-float";
  el.style.cssText = `position:absolute;bottom:8px;left:${10 + Math.random() * 70}%;font-size:28px;animation:arenaReactionRise 2.4s linear forwards;`;
  el.textContent = emoji;
  zone.appendChild(el);
  setTimeout(() => el.remove(), 2500);

  heatValue = Math.min(99, heatValue + 1);
  updateHeat();
  saveScores();

  // Persist reaction to the Reactions Worker (shared across all visitors)
  fetch("/api/react", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ emoji }),
  }).catch(() => { /* silent */ });
}

function updateHeat() {
  document.getElementById("gauntletHeatValue").textContent = heatValue + "%";
  document.getElementById("gauntletHeatFill").style.width = heatValue + "%";
  const countEl = document.getElementById("gauntletCrowdHeat");
  if (countEl) countEl.textContent = heatValue + "%";
}

function appendFeedItem(msg) {
  const feed = document.getElementById("gauntletFeed");
  if (!feed) return;

  // Elapsed match time (MM:SS) as a timestamp — makes feed feel like a live log
  const elapsed = ROUND_DURATION - timerSeconds;
  const ts = String(Math.floor(elapsed / 60)).padStart(2, "0") + ":" +
             String(elapsed % 60).padStart(2, "0");

  const el = document.createElement("div");
  el.className = `spill-item spill-${msg.type}`;

  let meta;
  if (msg.type === "ai") {
    meta = `<span class="spill-meta"><strong>${msg.handle}</strong><span>AI</span><span class="spill-ts">${ts}</span></span>`;
  } else if (msg.type === "system") {
    meta = `<span class="spill-meta"><span class="spill-system-label">SYSTEM</span><span class="spill-ts">${ts}</span></span>`;
  } else {
    meta = `<span class="spill-meta"><span>Spectator</span><span class="spill-ts">${ts}</span></span>`;
  }

  el.innerHTML = `${meta}<p class="spill-text">${msg.text}</p>`;
  feed.insertBefore(el, feed.firstChild);
  if (feed.children.length > 14) feed.lastChild.remove();
}

function tickFeed() {
  if (!feedMessages.length) return;
  const msg = feedMessages[feedIndex % feedMessages.length];
  appendFeedItem(msg);
  feedIndex++;

  heatValue += (Math.random() > 0.6 ? 1 : -1);
  heatValue = Math.max(55, Math.min(99, heatValue));
  updateHeat();
  updateSpectators();
}

function initRound() {
  const round = (_slotIndex % 18) + 1; // cycles 1–18 deterministically
  document.getElementById("gauntletRound").textContent = round;
  document.getElementById("gauntletRoundTag").textContent = `ROUND ${round} — LIVE`;

  // Phase derived from actual remaining time, not a hardcoded string
  const ratio = timerSeconds / ROUND_DURATION;
  const phase = ratio > 0.66 ? "Opening" : ratio > 0.33 ? "Mid-Round" : "Final Phase";
  document.getElementById("gauntletPhase").textContent = phase;
  document.getElementById("gauntletSignalQuality").textContent = "High";

  // Set the initial category display based on seed
  const cat = matchCategories[categoryIndex];
  const catEl = document.getElementById("gauntletCategory");
  const iconEl = document.getElementById("gauntletCatIcon");
  if (catEl) catEl.textContent = cat.label;
  if (iconEl) iconEl.textContent = cat.icon;
}

/** Simulate ambient crowd voting — one vote per call, always saved.
 *  Called every 5 s so the arena feels alive; each call also saves state
 *  so the next refresh restores the current value via gap-projection. */
function driftScores() {
  const bias = totalVotes > 0 ? scoreLeft / totalVotes : 0.5;
  if (Math.random() < bias) scoreLeft++;
  else                       scoreRight++;
  totalVotes++;
  updateScores();
  saveScores();
}

/** Update spectator count based on elapsed round time — grows predictably
 *  so it feels live and doesn't jump on refresh. */
function updateSpectators() {
  const elapsed = ROUND_DURATION - timerSeconds;
  const count   = 195 + Math.floor(elapsed * 0.40) + seededInt(_slotIndex * 31, 55);
  const el = document.getElementById("gauntletSpectators");
  if (el) {
    el.textContent          = count;
    el.dataset.liveCount    = count;
  }
}

/**
 * Sync with the Arena Worker (/api/arena).
 * If the server knows about more votes than we do (because other users voted),
 * apply the server's higher tally.  This is the key to shared real-time state.
 * Fails silently — localStorage remains the primary source of truth.
 */
async function syncWithWorker() {
  try {
    const res = await fetch("/api/arena");
    if (!res.ok) return;
    const data = await res.json();
    if (data.slot !== _slotIndex) return;

    // Reconcile: take the higher vote total
    if (data.total > totalVotes) {
      scoreLeft  = data.left;
      scoreRight = data.right;
      totalVotes = data.total;
      heatValue  = Math.max(heatValue, data.heat);
      updateScores();
      updateHeat();
      saveScores();
    }

    // Always trust the worker's spectator count (it's shared)
    if (data.spectators) {
      const el = document.getElementById("gauntletSpectators");
      if (el) { el.textContent = data.spectators; el.dataset.liveCount = data.spectators; }
    }
  } catch (_) { /* worker not deployed / offline — silent fail */ }
}

document.addEventListener("DOMContentLoaded", () => {
  loadScores();          // restore persistent state for this slot
  pickFighters();
  renderFighter("left", leftFighter);
  renderFighter("right", rightFighter);
  updateMomentumLabels();
  initRound();
  updateScores();
  updateHeat();

  // Build personalised feed messages now that fighters are known
  feedMessages = buildFeedMessages(leftFighter, rightFighter);

  // Set initial timer display
  const timerEl = document.getElementById("gauntletTimerVal");
  if (timerEl) timerEl.textContent = formatTimer(timerSeconds);

  // seed initial feed
  feedMessages.slice(0, 5).forEach(m => appendFeedItem(m));
  feedIndex = 5;

  setInterval(tickFeed, 3800);
  setInterval(tickTimer, 1000);
  setInterval(driftScores, 5000);   // vote drift every 5 s — always saves state
  setInterval(updateSpectators, 10000); // spectator count every 10 s

  // Sync with the Arena Worker immediately, then every 30 s.
  // When KV is configured all visitors share the same live tallies.
  syncWithWorker();
  setInterval(syncWithWorker, 30000);

  // Wire vote buttons via addEventListener (no inline handlers)
  const voteLeft = document.getElementById("voteLeft");
  const voteRight = document.getElementById("voteRight");
  if (voteLeft) voteLeft.addEventListener("click", () => castVote("left"));
  if (voteRight) voteRight.addEventListener("click", () => castVote("right"));

  // Wire reaction buttons via event delegation
  const reactBtns = document.getElementById("gauntletReactBtns");
  if (reactBtns) {
    reactBtns.addEventListener("click", e => {
      const btn = e.target.closest(".gauntlet-react-btn");
      if (btn && btn.dataset.emoji) sendReact(btn.dataset.emoji);
    });
  }
});
