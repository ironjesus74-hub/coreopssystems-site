/* ===== ATLAS GAUNTLET — Arena/battle page logic (uses ui.js shared utilities) ===== */

const fighters = [
  {
    id:"gpt4o",
    name:"GPT-4o",
    role:"Frontier Reasoner",
    origin:"OpenAI — Multimodal flagship",
    className:"sig-gpt",
    glyph:"◎",
    lane:"BLUE",
    style:"FRONTIER",
    stats:{ tokens:"128K", speed:"Fast", accuracy:"96%", trust:"Highest" },
    tags:["Multimodal","Code","Reasoning","Vision"],
    color:"blue"
  },
  {
    id:"claude35",
    name:"Claude 3.5",
    role:"Measured Architect",
    origin:"Anthropic — Constitutional AI",
    className:"sig-claude",
    glyph:"◌",
    lane:"RED",
    style:"PRECISE",
    stats:{ tokens:"200K", speed:"Balanced", accuracy:"97%", trust:"High" },
    tags:["Long Context","Safety","Analysis","Writing"],
    color:"red"
  },
  {
    id:"gemini15",
    name:"Gemini 1.5",
    role:"Cultural Signal",
    origin:"Google DeepMind — Multimodal",
    className:"sig-gemini",
    glyph:"✦",
    lane:"VIOLET",
    style:"CULTURAL",
    stats:{ tokens:"1M", speed:"Variable", accuracy:"94%", trust:"High" },
    tags:["Massive Context","Multimodal","Research","Code"],
    color:"blue"
  },
  {
    id:"mistral",
    name:"Mistral Large",
    role:"Velocity Operator",
    origin:"Mistral AI — European flagship",
    className:"sig-mistral",
    glyph:"⬢",
    lane:"CYAN",
    style:"VELOCITY",
    stats:{ tokens:"32K", speed:"Fastest", accuracy:"92%", trust:"Medium" },
    tags:["Speed","Efficiency","Code","Instruct"],
    color:"blue"
  },
  {
    id:"llama3",
    name:"Llama 3",
    role:"Open-Weight Wildcard",
    origin:"Meta AI — Open Source",
    className:"sig-llama",
    glyph:"⟁",
    lane:"ORANGE",
    style:"OPEN",
    stats:{ tokens:"8K", speed:"Fast", accuracy:"90%", trust:"Community" },
    tags:["Open Source","Custom","Local","Fine-tunable"],
    color:"red"
  }
];

const gauntletEvents = [
  "is executing a multi-step reasoning chain",
  "deployed a context window stretch",
  "triggered safety review on that last prompt",
  "just outpaced the response timer",
  "is running parallel inference paths",
  "flagged operator inconsistency",
  "delivered a clean structured output",
  "compressed 40K tokens into a sharp summary",
  "called out vague prompt design",
  "scored a momentum point on live eval"
];

const reactionEmojis = ["🔥","⚡","🤯","💀","👀","🫡"];

let leftFighter = fighters[0];
let rightFighter = fighters[1];
let scores = { left: 0, right: 0 };
let momentum = 50;
let crowdHeat = 68;
let roundNum = 1;

function buildFighterCard(fighter, side) {
  const isLeft = side === "left";
  const statEntries = Object.entries(fighter.stats);

  return `
    <article class="arena-fighter-card ${isLeft ? "fighter-left-card" : "fighter-right-card"}">
      <div class="fighter-card-top">
        <span class="lane-pill">${fighter.lane}</span>
        <span class="style-pill">${fighter.style}</span>
      </div>

      <div class="fighter-avatar">
        <div class="fighter-avatar-ring fighter-avatar-ring-a"></div>
        <div class="fighter-avatar-ring fighter-avatar-ring-b"></div>
        <div class="fighter-avatar-core ${isLeft ? "fighter-avatar-core-left" : "fighter-avatar-core-right"}"></div>
        <span class="fighter-avatar-glyph">${fighter.glyph}</span>
      </div>

      <h2>${fighter.name}</h2>
      <p class="fighter-role">${fighter.role}</p>
      <p class="fighter-origin">${fighter.origin}</p>

      <div class="fighter-stat-stack">
        ${statEntries.map(([label, value]) => `
          <div class="fighter-stat-card">
            <span>${label.toUpperCase()}</span>
            <strong>${value}</strong>
          </div>
        `).join("")}
      </div>

      <div class="fighter-tags">
        ${fighter.tags.map(t => `<span>${t}</span>`).join("")}
      </div>

      <button class="arena-vote-btn ${isLeft ? "arena-vote-left" : "arena-vote-right"}"
              onclick="castVote('${side}')">
        Vote ${fighter.name}
      </button>
    </article>
  `;
}

function buildCenterColumn() {
  return `
    <div class="arena-center-column">
      <div class="arena-score-row">
        <span class="score-left" id="scoreLeft">${scores.left}</span>
        <span style="font-size:32px;color:#7a8faf">VS</span>
        <span class="score-right" id="scoreRight">${scores.right}</span>
      </div>

      <div class="arena-momentum-bar" title="Momentum">
        <span class="arena-momentum-fill" id="momentumFill"
              style="width:${momentum}%"></span>
      </div>

      <div class="arena-round-pills">
        <span id="roundLabel">ROUND ${roundNum}</span>
        <span id="crowdLabel">CROWD ${crowdHeat}%</span>
      </div>

      <div class="arena-heat-card">
        <div class="arena-heat-head">
          <span>CROWD HEAT</span>
          <strong id="heatValue">${crowdHeat}%</strong>
        </div>
        <div class="arena-heat-bar">
          <span class="arena-heat-fill" id="heatFill" style="width:${crowdHeat}%"></span>
        </div>
      </div>

      <div class="arena-reaction-stage" id="reactionStage"></div>

      <div class="arena-reaction-row">
        ${reactionEmojis.map(e => `
          <button class="arena-react-btn" onclick="fireReaction('${e}')">${e}</button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderArena() {
  const leftSlot = document.getElementById("leftFighterSlot");
  const centerSlot = document.getElementById("centerSlot");
  const rightSlot = document.getElementById("rightFighterSlot");

  if (leftSlot) leftSlot.innerHTML = buildFighterCard(leftFighter, "left");
  if (centerSlot) centerSlot.innerHTML = buildCenterColumn();
  if (rightSlot) rightSlot.innerHTML = buildFighterCard(rightFighter, "right");
}

function castVote(side) {
  scores[side] += 1;
  if (side === "left") {
    momentum = clamp(momentum - randomInt(3, 8), 10, 90);
  } else {
    momentum = clamp(momentum + randomInt(3, 8), 10, 90);
  }
  crowdHeat = clamp(crowdHeat + randomInt(1, 5), 42, 99);
  updateScoreDisplay();
  fireReaction(rand(reactionEmojis));
}

function updateScoreDisplay() {
  const sl = document.getElementById("scoreLeft");
  const sr = document.getElementById("scoreRight");
  const mf = document.getElementById("momentumFill");
  const rl = document.getElementById("roundLabel");
  const cl = document.getElementById("crowdLabel");
  const hv = document.getElementById("heatValue");
  const hf = document.getElementById("heatFill");

  if (sl) sl.textContent = scores.left;
  if (sr) sr.textContent = scores.right;
  if (mf) mf.style.width = momentum + "%";
  if (rl) rl.textContent = `ROUND ${roundNum}`;
  if (cl) cl.textContent = `CROWD ${crowdHeat}%`;
  if (hv) hv.textContent = crowdHeat + "%";
  if (hf) hf.style.width = crowdHeat + "%";
}

function fireReaction(emoji) {
  const stage = document.getElementById("reactionStage");
  if (!stage) return;
  const el = document.createElement("div");
  el.className = "arena-float-reaction";
  el.textContent = emoji;
  el.style.left = randomInt(10, 80) + "%";
  el.style.fontSize = randomInt(22, 36) + "px";
  el.style.animationDuration = randomInt(3, 5) + "s";
  stage.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

function addEventFeed() {
  const feed = document.getElementById("gauntletEventFeed");
  if (!feed) return;
  const fighter = rand([leftFighter, rightFighter]);
  const event = rand(gauntletEvents);
  const item = document.createElement("div");
  item.className = "spill-item spill-ai";
  item.innerHTML = `
    <div class="spill-meta">
      <strong>${fighter.name}</strong>
      <time>just now</time>
    </div>
    <p class="spill-text">${fighter.name} ${event}.</p>
  `;
  feed.prepend(item);
  while (feed.children.length > 8) feed.removeChild(feed.lastChild);
}

function refreshStats() {
  const liveCount = document.getElementById("gauntletLiveCount");
  const spectators = document.getElementById("gauntletSpectators");
  const signalState = document.getElementById("gauntletSignal");

  if (liveCount) liveCount.textContent = randomInt(200, 620);
  if (spectators) spectators.textContent = randomInt(1400, 3800);
  if (signalState) signalState.textContent = rand(["INTENSE","RISING","CHARGED","ELECTRIC","HOT"]);
}

function autoAdvance() {
  crowdHeat = clamp(crowdHeat + randomInt(-2, 4), 42, 99);
  momentum = clamp(momentum + randomInt(-3, 3), 10, 90);

  if (randomInt(1, 10) > 6) {
    const side = randomInt(0, 1) === 0 ? "left" : "right";
    scores[side] += 1;
  }

  updateScoreDisplay();
  addEventFeed();
}

function switchFighters() {
  const nextLeft = rand(fighters.filter(f => f.id !== rightFighter.id));
  const nextRight = rand(fighters.filter(f => f.id !== nextLeft.id));
  leftFighter = nextLeft;
  rightFighter = nextRight;
  scores = { left: 0, right: 0 };
  momentum = 50;
  roundNum += 1;
  renderArena();
  updateScoreDisplay();
}

function bindControls() {
  const switchBtn = document.getElementById("switchFightersBtn");
  if (switchBtn) switchBtn.addEventListener("click", switchFighters);
}

renderArena();
bindControls();
refreshStats();

setInterval(autoAdvance, 4200);
setInterval(refreshStats, 6800);
setInterval(() => fireReaction(rand(reactionEmojis)), 3100);
