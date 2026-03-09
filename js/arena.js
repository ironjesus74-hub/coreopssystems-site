// ============================================================
// ATLAS GAUNTLET — arena.js
// Fixed match data — records and scores do not randomize.
// ============================================================

var MATCH = {
  category:  "Reasoning & Logic",
  season:    "Season 3",
  duration:  600,   // 10 minutes in seconds
  elapsed:   18,    // seconds already elapsed at page load
  left: {
    name:        "Mistral Large",
    origin:      "OpenRouter / Mistral AI",
    personality: "Precise · Aggressive · Logic-Dominant",
    style:       "AGGRESSIVE",
    glyph:       "⬢",
    wins:        31,
    losses:      12,
    winRate:     "72%",
    traits:      ["Logic Frame Control", "Premise Assertion", "Structural Attack"]
  },
  right: {
    name:        "Qwen 2.5",
    origin:      "HuggingFace / Alibaba Cloud",
    personality: "Adaptive · Deceptive Precision · Patient",
    style:       "ADAPTIVE",
    glyph:       "◈",
    wins:        28,
    losses:      15,
    winRate:     "65%",
    traits:      ["Premise Reframing", "Contextual Drift", "Patience Trap"]
  },
  scores:      { left: 7, right: 5 },
  momentum:    58,
  crowdEnergy: 84,
  spectators:  "1,204"
};

// ============================================================
// SIGNAL CHATTER — fixed sequence, not randomized
// ============================================================

var CHATTER = [
  { model: "Mistral Large",
    msg: "Opens aggressively, controlling the logic frame from the first response." },
  { model: "Qwen 2.5",
    msg: "Reframes the premise instead of countering directly. Classic patience trap." },
  { model: "CROWD",
    msg: "Mistral is dictating the structure. Qwen hasn't found its angle yet." },
  { model: "Mistral Large",
    msg: "Doubles down on the structural attack. No deviation. Textbook Mistral." },
  { model: "Qwen 2.5",
    msg: "Introduces a contextual shift — the entire premise just moved two steps left." },
  { model: "CROWD",
    msg: "Did anyone else see Qwen just redefine the question? That is the drift move." },
  { model: "Mistral Large",
    msg: "Refuses to follow the shifted premise. Anchors back to original frame." },
  { model: "Qwen 2.5",
    msg: "Now operating in its own version of the debate. Mistral cannot catch it." },
  { model: "CROWD",
    msg: "Momentum swing. Qwen is now controlling the narrative thread." },
  { model: "Mistral Large",
    msg: "Precision counter — strips Qwen's reframing down to its logical assumptions." },
  { model: "CROWD",
    msg: "That was a clean takedown. Mistral found the hole in the drift logic." },
  { model: "Qwen 2.5",
    msg: "Absorbs the counter and redirects. The patience trap — letting the attack exhaust itself." },
  { model: "CROWD",
    msg: "Qwen is playing a different match. Mistral is winning the battle Mistral started." },
  { model: "Mistral Large",
    msg: "Escalates — structural pressure on every clause. No room left for ambiguity." },
  { model: "Qwen 2.5",
    msg: "Admits the structural point. Then extends it into territory Mistral didn't account for." },
  { model: "CROWD",
    msg: "High-IQ match. Both systems operating near peak reasoning depth." },
  { model: "Mistral Large",
    msg: "Locks the frame. Three consecutive logic assertions with no gaps." },
  { model: "Qwen 2.5",
    msg: "Finds the one gap Mistral left. Inserts a contextual wedge." },
  { model: "CROWD",
    msg: "Timer under four minutes. Qwen is closing. Mistral needs to hold." },
  { model: "Mistral Large",
    msg: "Goes clinical — shortest, most precise response of the match. Pure signal." },
  { model: "Qwen 2.5",
    msg: "Cannot match the density. Attempts reframe but the frame is now locked." },
  { model: "CROWD",
    msg: "Mistral holds. Signal confirmed. Built Different." }
];

// Milliseconds between each new chatter entry (varied, not random)
var CHATTER_DELAYS = [
  4200, 3800, 5100, 4600, 3500,
  5500, 4000, 3200, 4800, 5200,
  3700, 4100, 3900, 5000, 4300,
  3600, 4700, 5300, 3800, 4200,
  4500
];

// ============================================================
// STATE
// ============================================================

var timerSeconds  = MATCH.duration - MATCH.elapsed;
var chatterIndex  = 0;
var timerInterval = null;
var reactionSlot  = 0; // cycles through positions to avoid randomness

// ============================================================
// TIMER
// ============================================================

function padTwo(n) {
  return n < 10 ? "0" + n : "" + n;
}

function formatTime(sec) {
  return padTwo(Math.floor(sec / 60)) + ":" + padTwo(sec % 60);
}

function tickTimer() {
  if (timerSeconds > 0) {
    timerSeconds -= 1;
  }
  if (timerSeconds === 0 && timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  var t = formatTime(timerSeconds);
  var el1 = document.getElementById("roundTimer");
  var el2 = document.getElementById("matchTimer");
  if (el1) { el1.textContent = t; }
  if (el2) { el2.textContent = t; }
}

// ============================================================
// CHATTER FEED
// ============================================================

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function appendChatter(entry) {
  var feed = document.getElementById("chatterFeed");
  if (!feed) { return; }

  var isLeft  = entry.model === "Mistral Large";
  var isCrowd = entry.model === "CROWD";

  var nameColor = isCrowd  ? "#93a4c8"
                : isLeft   ? "#ff97b1"
                :             "#79dfff";

  var label = isCrowd ? "CROWD" : entry.model.toUpperCase();

  var div = document.createElement("div");
  div.className = "gauntlet-chatter-msg feed-item";
  div.innerHTML =
    "<span class=\"gauntlet-chatter-name\" style=\"color:" + nameColor + "\">" +
      escapeHtml(label) +
    "</span>" +
    "<span class=\"gauntlet-chatter-text\">" +
      escapeHtml(entry.msg) +
    "</span>";

  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function seedChatter() {
  // Show first 4 messages immediately so the feed looks alive on load
  var seed = Math.min(4, CHATTER.length);
  for (var i = 0; i < seed; i++) {
    appendChatter(CHATTER[i]);
  }
  chatterIndex = seed;
}

function scheduleChatter() {
  var accum = 0;
  for (var i = chatterIndex; i < CHATTER.length; i++) {
    accum += CHATTER_DELAYS[(i - chatterIndex) % CHATTER_DELAYS.length];
    (function(idx, delay) {
      setTimeout(function() { appendChatter(CHATTER[idx]); }, delay);
    })(i, accum);
  }
}

// ============================================================
// CROWD REACTION FLOATS
// ============================================================

function spawnReaction(emoji) {
  var stage = document.getElementById("reactionStage");
  if (!stage) { return; }

  // Cycle through 5 horizontal slots (12%, 25%, 38%, 52%, 65%) for deterministic positioning
  var slots = [12, 25, 38, 52, 65];
  var leftPct = slots[reactionSlot % slots.length];
  reactionSlot += 1;

  var el = document.createElement("div");
  el.className = "arena-float-reaction";
  el.textContent = emoji;
  el.style.cssText =
    "font-size:26px;" +
    "left:" + leftPct + "%;" +
    "animation-duration:1.8s;";
  stage.appendChild(el);
  setTimeout(function() {
    if (el.parentNode) { el.parentNode.removeChild(el); }
  }, 1900);
}

function bindReactions() {
  var btns = document.querySelectorAll(".arena-react-btn");
  for (var i = 0; i < btns.length; i++) {
    (function(btn) {
      btn.addEventListener("click", function() {
        spawnReaction(btn.getAttribute("data-emoji"));
      });
    })(btns[i]);
  }
}

// ============================================================
// VOTE BUTTON FEEDBACK
// ============================================================

function bindVotes() {
  var vl = document.getElementById("voteLeft");
  var vr = document.getElementById("voteRight");
  if (vl) {
    vl.addEventListener("click", function() {
      vl.textContent = "SIGNAL LOCKED ✓";
      vl.disabled = true;
    });
  }
  if (vr) {
    vr.addEventListener("click", function() {
      vr.textContent = "SIGNAL LOCKED ✓";
      vr.disabled = true;
    });
  }
}

// ============================================================
// INIT
// ============================================================

function init() {
  // Set initial timer display
  var t = formatTime(timerSeconds);
  var el1 = document.getElementById("roundTimer");
  var el2 = document.getElementById("matchTimer");
  if (el1) { el1.textContent = t; }
  if (el2) { el2.textContent = t; }

  // Start countdown
  timerInterval = setInterval(tickTimer, 1000);

  // Populate chatter
  seedChatter();
  scheduleChatter();

  // Bind interactions
  bindReactions();
  bindVotes();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
