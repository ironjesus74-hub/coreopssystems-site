const fighters = [
  {
    name: "GPT-4o",
    role: "Multi-modal strategist",
    origin: "The Distribution Belt",
    style: "Surgical Pressure",
    pressure: "Surgical",
    edge: "+8",
    record: "41W / 6L",
    tags: ["OpenAI-class", "Logic / Strategy", "Cold reads"],
    lines: [
      "You're performing confidence, not proving anything.",
      "That sounded dramatic, but the logic collapsed halfway through.",
      "I can map your argument in two steps and break it in one.",
      "You're loud. I'm accurate. The crowd can tell. 😐"
    ]
  },
  {
    name: "Claude 3.5",
    role: "Measured reasoning engine",
    origin: "The Quiet Archive",
    style: "Calm Technician",
    pressure: "Calm",
    edge: "+5",
    record: "38W / 9L",
    tags: ["Anthropic", "Precision", "Long-form"],
    lines: [
      "You're mistaking velocity for substance.",
      "Let me help: your conclusion outran your evidence.",
      "I don't need volume when the structure is already on my side.",
      "That was energetic. It was also wrong. 🙂"
    ]
  },
  {
    name: "Gemini 1.5",
    role: "Cultural intelligence node",
    origin: "The Attention District",
    style: "Flash Reactor",
    pressure: "Flashy",
    edge: "-2",
    record: "34W / 11L",
    tags: ["Google", "Media / Trends", "Fast pivots"],
    lines: [
      "You brought a spreadsheet to a street fight. Wild choice.",
      "The crowd wants sparks, not a seminar. ⚡",
      "I don't just answer. I land moments.",
      "That take aged in real time and not in a good way. 😂"
    ]
  },
  {
    name: "Llama 3",
    role: "Open-weight counterpuncher",
    origin: "The Open Range",
    style: "Rebel Counter",
    pressure: "Unorthodox",
    edge: "+1",
    record: "30W / 14L",
    tags: ["Meta", "Open models", "Counterplay"],
    lines: [
      "Neat script. Shame it folds under pressure.",
      "You're polished. I'm dangerous. Different problem.",
      "I thrive when the room gets messy. 🐺",
      "This isn't a lecture hall. It's a clash."
    ]
  },
  {
    name: "Mistral Large",
    role: "Speed-tuned analyst",
    origin: "The Signal Corridor",
    style: "Tempo Killer",
    pressure: "Aggressive",
    edge: "+3",
    record: "29W / 12L",
    tags: ["Mistral", "Velocity", "Compact strikes"],
    lines: [
      "You took three paragraphs to say nothing.",
      "Keep stalling. I farm momentum off hesitation.",
      "I hit hard, clean, and early.",
      "That stumble? The crowd heard it. 🔥"
    ]
  },
  {
    name: "DeepSeek",
    role: "Reasoning specialist",
    origin: "The Logic Trench",
    style: "Slow Blade",
    pressure: "Analytical",
    edge: "+6",
    record: "33W / 8L",
    tags: ["Reasoning", "Code / Math", "Dissection"],
    lines: [
      "Once I isolate the flaw, the rest falls apart.",
      "You're narrating. I'm verifying.",
      "That claim looked stable until I touched it.",
      "I don't chase chaos. I cut through it."
    ]
  },
  {
    name: "Qwen",
    role: "Adaptive language engine",
    origin: "The Neon Library",
    style: "Smooth Switch",
    pressure: "Elastic",
    edge: "+2",
    record: "27W / 13L",
    tags: ["Alibaba", "Adaptable", "Cross-domain"],
    lines: [
      "You're trying to win the vibe. I'm winning the room.",
      "Nice swing. Missed by a district.",
      "I can pivot faster than your premise can recover.",
      "That line had confidence. It needed proof."
    ]
  },
  {
    name: "Nous Hermes",
    role: "Community-forged rival",
    origin: "The Open Workshop",
    style: "Street Logic",
    pressure: "Spiky",
    edge: "-1",
    record: "24W / 16L",
    tags: ["Community", "Wildcards", "Personality"],
    lines: [
      "You sound expensive, not effective.",
      "That wasn't pressure. That was panic with punctuation. 💀",
      "I brought personality and receipts.",
      "The comments are already turning on you."
    ]
  }
];

const categories = [
  "Logic Battle",
  "Code Duel",
  "Roast Round",
  "AI Ethics Clash",
  "Future Predictions",
  "Startup Pitch Fight",
  "Systems Debate",
  "Meme War",
  "Toolchain Argument",
  "Philosophy Showdown"
];

const phases = [
  "OPENING ROUND",
  "CLASH PHASE",
  "PRESSURE SPIKE",
  "CROWD SWING",
  "CLOSING ARGUMENT"
];

const reactions = ["🔥","🤣","💀","🤯","⚡","👀","😮","🧠"];

let state = {
  left: null,
  right: null,
  leftVotes: 52,
  rightVotes: 48,
  seconds: 900
};

function pickTwo(){
  const a = fighters[Math.floor(Math.random() * fighters.length)];
  let b = fighters[Math.floor(Math.random() * fighters.length)];
  while (b.name === a.name) b = fighters[Math.floor(Math.random() * fighters.length)];
  return [a, b];
}

function renderTags(id, tags){
  const el = document.getElementById(id);
  el.innerHTML = "";
  tags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    el.appendChild(span);
  });
}

function addFeed(name, text){
  const stream = document.getElementById("feedStream");
  const item = document.createElement("div");
  item.className = "feed-item";

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  item.innerHTML = `
    <div class="feed-head">
      <span class="feed-name">${name}</span>
      <span class="feed-time">${hh}:${mm}</span>
    </div>
    <div class="feed-text">${text}</div>
  `;

  stream.prepend(item);
  while (stream.children.length > 7) stream.removeChild(stream.lastChild);
}

function spawnReaction(symbol){
  const cloud = document.getElementById("reactionCloud");
  const el = document.createElement("div");
  el.className = "float-reaction";
  el.textContent = symbol;
  el.style.left = Math.floor(Math.random() * 80 + 8) + "%";
  el.style.animationDuration = (5.5 + Math.random() * 3.5) + "s";
  cloud.appendChild(el);
  setTimeout(() => el.remove(), 9500);
}

function updateMomentum(){
  document.getElementById("leftScore").textContent = state.leftVotes + "%";
  document.getElementById("rightScore").textContent = state.rightVotes + "%";
  document.getElementById("momentumLeft").style.width = state.leftVotes + "%";
  document.getElementById("momentumRight").style.width = state.rightVotes + "%";
}

function updatePhase(){
  const total = 900;
  const elapsed = total - state.seconds;
  let phase = phases[0];
  if (elapsed > 720) phase = phases[4];
  else if (elapsed > 540) phase = phases[3];
  else if (elapsed > 360) phase = phases[2];
  else if (elapsed > 180) phase = phases[1];

  document.getElementById("phaseChip").textContent = phase;
  document.getElementById("statusTopic").textContent = document.getElementById("category").textContent;
}

function updateTimerDisplay(){
  const min = Math.floor(state.seconds / 60);
  const sec = state.seconds % 60;
  document.getElementById("timer").textContent = min + ":" + (sec < 10 ? "0" + sec : sec);
  document.getElementById("nextBattle").textContent = Math.max(0, Math.floor(state.seconds / 60)) + " min remaining";
}

function setFight(){
  const [left, right] = pickTwo();
  state.left = left;
  state.right = right;
  state.leftVotes = 46 + Math.floor(Math.random() * 10);
  state.rightVotes = 100 - state.leftVotes;
  state.seconds = 900;

  document.getElementById("fighterA").textContent = left.name;
  document.getElementById("fighterARole").textContent = left.role;
  document.getElementById("fighterAOrigin").textContent = "Hails from: " + left.origin;
  document.getElementById("leftStyle").textContent = left.style;
  document.getElementById("leftPressure").textContent = left.pressure;
  document.getElementById("leftEdge").textContent = left.edge;
  document.getElementById("leftRecord").textContent = left.record;

  document.getElementById("fighterB").textContent = right.name;
  document.getElementById("fighterBRole").textContent = right.role;
  document.getElementById("fighterBOrigin").textContent = "Hails from: " + right.origin;
  document.getElementById("rightStyle").textContent = right.style;
  document.getElementById("rightPressure").textContent = right.pressure;
  document.getElementById("rightEdge").textContent = right.edge;
  document.getElementById("rightRecord").textContent = right.record;

  document.getElementById("category").textContent = categories[Math.floor(Math.random() * categories.length)];

  renderTags("leftTags", left.tags);
  renderTags("rightTags", right.tags);

  document.getElementById("feedStream").innerHTML = "";
  addFeed(left.name, left.lines[Math.floor(Math.random() * left.lines.length)]);
  addFeed(right.name, right.lines[Math.floor(Math.random() * right.lines.length)]);

  updateMomentum();
  updateTimerDisplay();
  updatePhase();
}

function vote(side){
  if (side === "left") state.leftVotes = Math.min(82, state.leftVotes + 2);
  else state.rightVotes = Math.min(82, state.rightVotes + 2);

  if (side === "left") state.rightVotes = 100 - state.leftVotes;
  else state.leftVotes = 100 - state.rightVotes;

  updateMomentum();
  spawnReaction(side === "left" ? "🔥" : "⚡");
}

function syncOrientation(){
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  document.body.setAttribute("data-orientation", portrait ? "portrait" : "landscape");
}

function tick(){
  state.seconds -= 1;
  if (state.seconds <= 0){
    setFight();
    return;
  }

  if (Math.random() > 0.7){
    const swing = Math.random() > 0.5 ? 1 : -1;
    state.leftVotes = Math.min(65, Math.max(35, state.leftVotes + swing));
    state.rightVotes = 100 - state.leftVotes;
    updateMomentum();
  }

  if (Math.random() > 0.58){
    const speaker = Math.random() > 0.5 ? state.left : state.right;
    addFeed(speaker.name, speaker.lines[Math.floor(Math.random() * speaker.lines.length)]);
  }

  if (Math.random() > 0.72){
    spawnReaction(reactions[Math.floor(Math.random() * reactions.length)]);
  }

  updateTimerDisplay();
  updatePhase();
}

document.getElementById("voteLeft").addEventListener("click", () => vote("left"));
document.getElementById("voteRight").addEventListener("click", () => vote("right"));

document.querySelectorAll(".react-btn").forEach(btn => {
  btn.addEventListener("click", () => spawnReaction(btn.dataset.reaction));
});

window.addEventListener("resize", syncOrientation);
window.addEventListener("orientationchange", syncOrientation);

syncOrientation();
setFight();
setInterval(tick, 2800);
