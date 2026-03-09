// Atlas Gauntlet — Live Match Engine
// Stable fighter data — stats do not randomize on page refresh

const MATCH = {
  left: {
    name: "GPT-4o",
    origin: "OpenAI via OpenRouter",
    votes: 372,
    momentum: 62
  },
  right: {
    name: "Claude 3.5",
    origin: "Anthropic via OpenRouter",
    votes: 291,
    momentum: 38
  },
  round: 3,
  totalRounds: 5,
  timerSeconds: 494, // 8:14
  crowdEnergy: 84,
  spectators: 1284
};

const matchTypes = ["OPEN DEBATE","LOGIC DUEL","SIGNAL CLASH","PRECISION RUN","NARRATIVE BOUT"];
const matchCategories = ["Reasoning & Logic","Philosophical Debate","Technical Analysis","Creative Response","Strategic Framing"];
const matchTemps = ["Warm","Hot","Blazing","Controlled","Tense"];
const chatterLevels = ["Steady","Elevated","Rising","Loud","Volatile"];

const commentaryPool = [
  { side: "left",  type: "ai",     text: "GPT-4o opens with a precision frame — every sentence load-bearing, none wasted." },
  { side: "right", type: "ai",     text: "Claude 3.5 counters with a layered build. Patient. Deliberate. Watching for gaps." },
  { side: "left",  type: "ai",     text: "The output density here from GPT-4o is remarkable. Tight reasoning chains." },
  { side: "right", type: "ai",     text: "Claude recalibrates mid-argument. Adaptive pivot — signal disruptor living up to the name." },
  { side: "left",  type: "ai",     text: "GPT-4o doesn't blink. Frame held, pressure maintained. The crowd is responding." },
  { side: "right", type: "ai",     text: "Claude 3.5 finds a nuance gap and threads it cleanly. Measured strategist mode activated." },
  { side: "sys",   type: "system", text: "— ROUND 3 UNDERWAY — Crowd energy rising. Both systems operating above baseline." },
  { side: "left",  type: "ai",     text: "Cold logic lands again. GPT-4o strips the emotional framing from the argument." },
  { side: "right", type: "ai",     text: "Long-form authority play from Claude. Setting up a counter three moves ahead." },
  { side: "sys",   type: "system", text: "— SPECTATOR VOTE SURGE — Left side gaining momentum. Right side adapting." },
  { side: "left",  type: "ai",     text: "Precision striker move — GPT-4o isolates a single assumption and dismantles it." },
  { side: "right", type: "ai",     text: "Claude doesn't chase the bait. Patience engine staying composed under pressure." },
  { side: "sys",   type: "system", text: "— CROWD SIGNAL PEAK — Energy index at 84%. Match temperature: HOT." },
  { side: "left",  type: "ai",     text: "Context reader advantage — GPT-4o repositioning based on previous round patterns." },
  { side: "right", type: "ai",     text: "Claude 3.5 with a constitutional move — grounds the argument in first-principles clarity." },
  { side: "sys",   type: "system", text: "— 8 MINUTES REMAINING — Both systems locked in. No signs of drift." },
  { side: "left",  type: "ai",     text: "Output density increasing. GPT-4o is packing rounds with compressive force." },
  { side: "right", type: "ai",     text: "Signal disruption attempt — Claude reframes the entire premise of the last exchange." },
  { side: "left",  type: "ai",     text: "Frame control re-established. GPT-4o forces the argument back to its chosen axis." },
  { side: "right", type: "ai",     text: "Nuance layer deployed. Claude adds a dimension the crowd wasn't expecting." },
  { side: "sys",   type: "system", text: "— JUDGE SIGNAL — Both systems showing elite composure. This round is close." },
  { side: "left",  type: "ai",     text: "GPT-4o goes direct. No ornament. Efficiency as style." },
  { side: "right", type: "ai",     text: "Claude counters with elegance. Long-form authority play building slowly." },
  { side: "sys",   type: "system", text: "— MOMENTUM SHIFT — Crowd signal tilting. Watch the vote split update." }
];

let feedIndex = 0;
let timerSeconds = MATCH.timerSeconds;
let leftVotes = MATCH.left.votes;
let rightVotes = MATCH.right.votes;
let leftMomentum = MATCH.left.momentum;
let roundNumber = MATCH.round;
let spectators = MATCH.spectators;
let crowdEnergy = MATCH.crowdEnergy;
let voteLocked = false;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function updateTimer() {
  if (timerSeconds > 0) {
    timerSeconds--;
  } else {
    timerSeconds = 600;
    roundNumber = Math.min(roundNumber + 1, MATCH.totalRounds);
    updateRoundDisplay();
  }
  const el = document.getElementById("gauntletTimer");
  if (el) el.textContent = formatTime(timerSeconds);
}

function updateRoundDisplay() {
  const badge = document.getElementById("gauntletRoundBadge");
  const roundBanner = document.getElementById("roundBanner");
  const stripRound = document.getElementById("stripRound");
  const roundsRemaining = document.getElementById("roundsRemaining");
  if (badge) badge.textContent = `ROUND ${roundNumber} / ${MATCH.totalRounds}`;
  if (roundBanner) roundBanner.innerHTML = `<span class="round-dot"></span> ROUND ${roundNumber} — LIVE`;
  if (stripRound) stripRound.textContent = `${roundNumber} of ${MATCH.totalRounds}`;
  if (roundsRemaining) roundsRemaining.textContent = Math.max(0, MATCH.totalRounds - roundNumber);
}

function updateCrowdEnergy() {
  crowdEnergy = Math.max(55, Math.min(99, crowdEnergy + randInt(-2, 3)));
  const el = document.getElementById("gauntletCrowdEnergy");
  const mVal = document.getElementById("crowdMeterValue");
  const mFill = document.getElementById("crowdMeterFill");
  const sEnergy = document.getElementById("stripEnergy");
  if (el) el.textContent = crowdEnergy + "%";
  if (mVal) mVal.textContent = crowdEnergy + "%";
  if (mFill) mFill.style.width = crowdEnergy + "%";
  if (sEnergy) sEnergy.textContent = crowdEnergy + "%";
}

function updateSpectators() {
  spectators += randInt(0, 8);
  const el = document.getElementById("stripSpectators");
  if (el) el.textContent = spectators.toLocaleString();
}

function updateMomentum() {
  leftMomentum = Math.max(20, Math.min(80,
    Math.round((leftVotes / (leftVotes + rightVotes)) * 100)
  ));
  const rightMomentum = 100 - leftMomentum;
  const lEl = document.getElementById("leftMomentum");
  const rEl = document.getElementById("rightMomentum");
  const bar = document.getElementById("voteSplitBar");
  const split = document.getElementById("voteSplitDisplay");
  if (lEl) lEl.textContent = leftMomentum + "%";
  if (rEl) rEl.textContent = rightMomentum + "%";
  if (bar) bar.style.width = leftMomentum + "%";
  if (split) split.textContent = `${leftMomentum}% / ${rightMomentum}%`;
}

function updateVoteDisplay() {
  const lEl = document.getElementById("voteCountLeft");
  const rEl = document.getElementById("voteCountRight");
  const total = document.getElementById("totalVotes");
  if (lEl) lEl.textContent = leftVotes.toLocaleString();
  if (rEl) rEl.textContent = rightVotes.toLocaleString();
  if (total) total.textContent = (leftVotes + rightVotes).toLocaleString();
  updateMomentum();
}

function castVote(side) {
  if (voteLocked) return;
  voteLocked = true;
  if (side === "left") {
    leftVotes++;
    const btn = document.getElementById("voteLeft");
    if (btn) { btn.style.boxShadow = "0 0 32px rgba(255,111,141,.55)"; }
  } else {
    rightVotes++;
    const btn = document.getElementById("voteRight");
    if (btn) { btn.style.boxShadow = "0 0 32px rgba(103,217,255,.55)"; }
  }
  updateVoteDisplay();
  addFeedItem({
    side: "sys",
    type: "system",
    text: `— VOTE REGISTERED — ${side === "left" ? MATCH.left.name : MATCH.right.name} gains a signal point from the crowd.`
  });
}

function buildFeedItem(item) {
  const typeClass = item.type === "ai" ? "spill-ai" : item.type === "user" ? "spill-user" : "spill-system";
  const now = new Date();
  const timeStr = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
  let label = "";
  if (item.type === "user") label = `<strong>SPECTATOR</strong>`;
  else if (item.side === "left") label = `<strong>${MATCH.left.name}</strong>`;
  else if (item.side === "right") label = `<strong>${MATCH.right.name}</strong>`;
  else label = `<strong>SIGNAL</strong>`;

  return `
    <div class="spill-item ${typeClass} feed-item">
      <div class="spill-meta">
        ${label}
        <time>${timeStr}</time>
      </div>
      <p class="spill-text">${item.text}</p>
    </div>
  `;
}

function addFeedItem(item) {
  const feed = document.getElementById("gauntletFeed");
  if (!feed) return;
  feed.insertAdjacentHTML("afterbegin", buildFeedItem(item));
  while (feed.children.length > 18) {
    feed.removeChild(feed.lastChild);
  }
}

function advanceFeed() {
  const item = commentaryPool[feedIndex % commentaryPool.length];
  addFeedItem(item);
  feedIndex++;
}

function submitChime() {
  const input = document.getElementById("chimeInput");
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = "";
  addFeedItem({ side: "user", type: "user", text });
}

function refreshMatchStats() {
  const matchTemp = document.getElementById("matchTemp");
  const aiChatter = document.getElementById("aiChatter");
  if (matchTemp) matchTemp.textContent = rand(matchTemps);
  if (aiChatter) aiChatter.textContent = rand(chatterLevels);
}

function updateStripProgress() {
  const fill = document.getElementById("stripProgressFill");
  const elapsed = MATCH.timerSeconds - timerSeconds;
  const total = 600;
  const pct = Math.min(100, Math.round((elapsed % total) / total * 100));
  if (fill) fill.style.width = pct + "%";
}

function updateFeedTime() {
  const el = document.getElementById("feedUpdateTime");
  if (el) el.textContent = "just now";
}

// Passive vote drift — small trickle to simulate live crowd
function passiveVoteDrift() {
  const lr = Math.random();
  if (lr < 0.55) {
    leftVotes += randInt(1, 4);
  } else {
    rightVotes += randInt(1, 3);
  }
  updateVoteDisplay();
}

// Init
updateRoundDisplay();
updateVoteDisplay();
updateCrowdEnergy();

// Seed initial feed with first 5 entries
for (let i = 0; i < 5; i++) {
  const item = commentaryPool[i];
  addFeedItem(item);
}
feedIndex = 5;

// Set initial strip progress
const fillEl = document.getElementById("stripProgressFill");
if (fillEl) fillEl.style.width = "52%";

// Enter key for chime
const chimeInput = document.getElementById("chimeInput");
if (chimeInput) {
  chimeInput.addEventListener("keydown", e => {
    if (e.key === "Enter") submitChime();
  });
}

// Expose castVote globally
window.castVote = castVote;
window.submitChime = submitChime;

// Timers
setInterval(updateTimer, 1000);
setInterval(updateStripProgress, 1000);

setInterval(() => {
  updateCrowdEnergy();
  updateSpectators();
  refreshMatchStats();
}, 5000);

setInterval(() => {
  advanceFeed();
  updateFeedTime();
}, 4200);

setInterval(passiveVoteDrift, 7000);
