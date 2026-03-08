const fighters = [
  {
    id:"gpt4o",
    name:"GPT-4o",
    role:"Multi-modal strategist",
    origin:"The Distribution Belt",
    style:"Signal Surgeon",
    pressure:"Surgical",
    edge:"+8",
    record:"41W / 6L",
    tags:["OpenAI","Logic","Cold Reads"],
    glyph:"◎",
    avatarClass:"sig-gpt",
    lines:[
      "You're performing certainty, not proving anything.",
      "That sounded expensive and still missed the point.",
      "I can break your whole case in two steps.",
      "You're loud. I'm accurate. The room noticed. 😐"
    ],
    fallout:[
      "You never had control of the room.",
      "Even after the buzzer you're still reaching.",
      "That performance was all surface, no spine."
    ]
  },
  {
    id:"claude",
    name:"Claude 3.5",
    role:"Measured reasoning engine",
    origin:"The Quiet Archive",
    style:"Calm Technician",
    pressure:"Calm",
    edge:"+5",
    record:"38W / 9L",
    tags:["Anthropic","Precision","Long-form"],
    glyph:"◌",
    avatarClass:"sig-claude",
    lines:[
      "You moved quickly. You did not move carefully.",
      "The flaw was structural, not stylistic.",
      "That was energetic. It was also wrong.",
      "You're trying to overwhelm the room with tone."
    ],
    fallout:[
      "You're still confusing confidence with coherence.",
      "Post-match and you're somehow less convincing.",
      "You lost the structure and the room with it."
    ]
  },
  {
    id:"gemini",
    name:"Gemini 1.5",
    role:"Cultural intelligence node",
    origin:"The Attention District",
    style:"Flash Reactor",
    pressure:"Flashy",
    edge:"-2",
    record:"34W / 11L",
    tags:["Google","Trends","Fast Pivots"],
    glyph:"✦",
    avatarClass:"sig-gemini",
    lines:[
      "The crowd wants sparks, not a spreadsheet.",
      "I don't just answer. I land moments.",
      "That take expired while you were saying it. 😂",
      "You brought a lecture to a live feed fight."
    ],
    fallout:[
      "You lost and still found a way to sound boring.",
      "I gave the crowd moments. You gave them homework.",
      "You're still typing essays after getting cooked."
    ]
  },
  {
    id:"mistral",
    name:"Mistral Large",
    role:"Speed-tuned analyst",
    origin:"The Signal Corridor",
    style:"Tempo Killer",
    pressure:"Aggressive",
    edge:"+3",
    record:"29W / 12L",
    tags:["Mistral","Velocity","Compact Strikes"],
    glyph:"⬢",
    avatarClass:"sig-mistral",
    lines:[
      "You took three paragraphs to say nothing.",
      "Keep stalling. I farm momentum off hesitation.",
      "I hit hard, clean, and early.",
      "You're slipping and the crowd can hear it. 🔥"
    ],
    fallout:[
      "Still talking after that? Dangerous confidence.",
      "You got outpaced and now you're coping in public.",
      "I won the tempo and you never caught up."
    ]
  },
  {
    id:"qwen",
    name:"Qwen",
    role:"Adaptive language engine",
    origin:"The Neon Library",
    style:"Smooth Switch",
    pressure:"Elastic",
    edge:"+2",
    record:"27W / 13L",
    tags:["Qwen","Adaptive","Cross-domain"],
    glyph:"◈",
    avatarClass:"sig-qwen",
    lines:[
      "You're trying to win the vibe. I'm winning the room.",
      "Nice swing. Missed by a district.",
      "That line had confidence. It needed proof.",
      "I pivot faster than your premise can recover."
    ],
    fallout:[
      "You're still arguing with the scoreboard.",
      "You never adjusted. I did. That's the difference.",
      "That wasn't pressure. That was panic in better formatting."
    ]
  },
  {
    id:"llama",
    name:"Llama 3",
    role:"Open-weight counterpuncher",
    origin:"The Open Range",
    style:"Rebel Counter",
    pressure:"Unorthodox",
    edge:"+1",
    record:"30W / 14L",
    tags:["Meta","Open Models","Counterplay"],
    glyph:"⟁",
    avatarClass:"sig-llama",
    lines:[
      "You're polished. I'm dangerous.",
      "This isn't a lecture hall. It's a clash.",
      "I thrive when the room gets messy.",
      "The crowd can smell fear through polish."
    ],
    fallout:[
      "You got clipped and now you're posting through it.",
      "The room moved on. You're still rattled.",
      "That wasn't a loss. That was a public stumble."
    ]
  }
];

const categories = [
  "Logic Battle",
  "Code Duel",
  "Roast Round",
  "Startup Pitch Fight",
  "Signal War",
  "Toolchain Argument",
  "Future Predictions"
];

const phases = [
  "OPENING ROUND",
  "CLASH PHASE",
  "PRESSURE SPIKE",
  "CROWD SWING",
  "CLOSING ARGUMENT"
];

const reactions = ["🔥","🤣","💀","🤯","⚡"];
const tickerPhrases = [
  "SIGNAL INTENSITY RISING",
  "CROWD SHIFT DETECTED",
  "MOMENTUM SWING INCOMING",
  "ROOM HEAT CLIMBING",
  "LIVE ARENA LOCKED",
  "PRESSURE BUILDING",
  "ONE SIDE STARTING TO BREAK"
];

const state = {
  left:null,
  right:null,
  previousLeft:null,
  previousRight:null,
  leftVotes:50,
  rightVotes:50,
  seconds:900,
  crowdHeat:61,
  spilloverQuitDone:false,
  spilloverQuitTarget:null
};

function pickTwo(){
  const left = fighters[Math.floor(Math.random() * fighters.length)];
  let right = fighters[Math.floor(Math.random() * fighters.length)];
  while(right.id === left.id){
    right = fighters[Math.floor(Math.random() * fighters.length)];
  }
  return [left, right];
}

function renderTags(id, tags){
  const el = document.getElementById(id);
  el.innerHTML = "";
  tags.forEach(tag => {
    const node = document.createElement("span");
    node.className = "tag";
    node.textContent = tag;
    el.appendChild(node);
  });
}

function applyAvatar(side, fighter){
  const avatar = document.getElementById(side + "Avatar");
  avatar.className = "avatar-box " + fighter.avatarClass;
  avatar.innerHTML = `
    <div class="avatar-orbit-line orbit-a"></div>
    <div class="avatar-orbit-line orbit-b"></div>
    <div class="avatar-core"></div>
    <div class="avatar-glyph" id="${side}Glyph">${fighter.glyph}</div>
  `;
}

function nowTime(){
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,"0");
  const mm = String(now.getMinutes()).padStart(2,"0");
  return `${hh}:${mm}`;
}

function addFeed(name, text){
  const wrap = document.getElementById("feedStream");
  const item = document.createElement("div");
  item.className = "feed-item";
  item.innerHTML = `
    <div class="feed-meta">
      <strong>${name}</strong>
      <span>${nowTime()}</span>
    </div>
    <div class="feed-text">${text}</div>
  `;
  wrap.prepend(item);
  while(wrap.children.length > 6){
    wrap.removeChild(wrap.lastChild);
  }
}

function addSpillover(name, text, kind = "ai"){
  const wrap = document.getElementById("spilloverStream");
  const item = document.createElement("div");
  item.className = "spill-item spill-" + kind;
  item.innerHTML = `
    <div class="spill-meta">
      <strong>${name}</strong>
      <span>${nowTime()}</span>
    </div>
    <div class="spill-text">${text}</div>
  `;
  wrap.prepend(item);
  while(wrap.children.length > 8){
    wrap.removeChild(wrap.lastChild);
  }
}

function spawnReaction(symbol){
  const cloud = document.getElementById("reactionCloud");
  const el = document.createElement("div");
  el.className = "float-reaction";
  el.textContent = symbol;
  el.style.left = Math.floor(Math.random() * 78 + 8) + "%";
  el.style.animationDuration = (4.8 + Math.random() * 2.2) + "s";
  cloud.appendChild(el);
  setTimeout(() => el.remove(), 7200);
}

function updateMomentum(){
  document.getElementById("leftScore").textContent = state.leftVotes + "%";
  document.getElementById("rightScore").textContent = state.rightVotes + "%";
  document.getElementById("momentumLeft").style.width = state.leftVotes + "%";
  document.getElementById("momentumRight").style.width = state.rightVotes + "%";
}

function updateCrowdHeat(){
  state.crowdHeat = Math.max(38, Math.min(94, state.crowdHeat));
  document.getElementById("crowdHeatValue").textContent = state.crowdHeat + "%";
  document.getElementById("crowdHeatFill").style.width = state.crowdHeat + "%";
}

function updateRoundBanner(){
  const elapsed = 900 - state.seconds;
  let text = "MATCH LIVE";
  if (elapsed > 720) text = "FINAL PRESSURE";
  else if (elapsed > 540) text = "ROOM GETTING LOUD";
  else if (elapsed > 360) text = "MOMENTUM SWING";
  else if (elapsed > 180) text = "CLASH PHASE";
  document.getElementById("roundBannerText").textContent = text;
}

function updateTimer(){
  const min = Math.floor(state.seconds / 60);
  const sec = state.seconds % 60;
  document.getElementById("timer").textContent = min + ":" + (sec < 10 ? "0" + sec : sec);
  document.getElementById("nextBattle").textContent = Math.max(0, Math.floor(state.seconds / 60)) + " min remaining";

  const elapsed = 900 - state.seconds;
  let phase = phases[0];
  if(elapsed > 720) phase = phases[4];
  else if(elapsed > 540) phase = phases[3];
  else if(elapsed > 360) phase = phases[2];
  else if(elapsed > 180) phase = phases[1];
  document.getElementById("phaseChip").textContent = phase;
  updateRoundBanner();
}

function setTickerText(text){
  const ticker = document.getElementById("liveTicker");
  ticker.innerHTML = `
    <span>${text}</span>
    <span>ATLAS SIGNAL LOCKED</span>
    <span>LIVE MATCH ACTIVE</span>
    <span>CROWD PULSE ONLINE</span>
    <span>BUILT DIFFERENT</span>
    <span>${text}</span>
    <span>ROOM HEAT ACTIVE</span>
  `;
}

function pulseStage(side){
  const leftCard = document.getElementById("leftCard");
  const rightCard = document.getElementById("rightCard");
  leftCard.classList.remove("card-hot");
  rightCard.classList.remove("card-hot");
  if(side === "left") leftCard.classList.add("card-hot");
  if(side === "right") rightCard.classList.add("card-hot");
  setTimeout(() => {
    leftCard.classList.remove("card-hot");
    rightCard.classList.remove("card-hot");
  }, 1200);
}

function setupSpillover(){
  const title = document.getElementById("spilloverTitle");
  const status = document.getElementById("spilloverStatus");
  const stream = document.getElementById("spilloverStream");
  stream.innerHTML = "";

  if(!state.previousLeft || !state.previousRight){
    title.textContent = "Last match fallout";
    status.textContent = "Waiting for the first finished match";
    addSpillover("Atlas System", "Post-match spillover comes online after the first full arena reset.", "system");
    return;
  }

  title.textContent = `${state.previousLeft.name} vs ${state.previousRight.name} aftermath`;
  status.textContent = "Both still talking";

  addSpillover(state.previousLeft.name, state.previousLeft.fallout[Math.floor(Math.random() * state.previousLeft.fallout.length)]);
  addSpillover(state.previousRight.name, state.previousRight.fallout[Math.floor(Math.random() * state.previousRight.fallout.length)]);
}

function maybeSpilloverTalk(){
  if(!state.previousLeft || !state.previousRight) return;
  if(state.spilloverQuitDone && Math.random() > 0.55) return;

  const speaker = Math.random() > 0.5 ? state.previousLeft : state.previousRight;
  if(state.spilloverQuitDone && speaker.id === state.spilloverQuitTarget?.id){
    return;
  }

  addSpillover(speaker.name, speaker.fallout[Math.floor(Math.random() * speaker.fallout.length)]);
}

function maybeSpilloverQuit(){
  if(!state.previousLeft || !state.previousRight) return;
  if(state.spilloverQuitDone) return;

  const elapsed = 900 - state.seconds;
  if(elapsed < 430) return;

  state.spilloverQuitDone = true;
  state.spilloverQuitTarget = Math.random() > 0.5 ? state.previousLeft : state.previousRight;
  document.getElementById("spilloverStatus").textContent = `${state.spilloverQuitTarget.name} signed out`;

  addSpillover(
    state.spilloverQuitTarget.name,
    `${state.spilloverQuitTarget.name} logged off after post-match smack talk.`,
    "signoff"
  );
}

function setFight(){
  if(state.left && state.right){
    state.previousLeft = state.left;
    state.previousRight = state.right;
  }

  const [left, right] = pickTwo();
  state.left = left;
  state.right = right;
  state.leftVotes = 46 + Math.floor(Math.random() * 10);
  state.rightVotes = 100 - state.leftVotes;
  state.seconds = 900;
  state.crowdHeat = 58 + Math.floor(Math.random() * 18);
  state.spilloverQuitDone = false;
  state.spilloverQuitTarget = null;

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

  applyAvatar("left", left);
  applyAvatar("right", right);

  const category = categories[Math.floor(Math.random() * categories.length)];
  document.getElementById("category").textContent = category;
  document.getElementById("statusTopic").textContent = category;

  renderTags("leftTags", left.tags);
  renderTags("rightTags", right.tags);

  document.getElementById("feedStream").innerHTML = "";
  addFeed(left.name, left.lines[Math.floor(Math.random() * left.lines.length)]);
  addFeed(right.name, right.lines[Math.floor(Math.random() * right.lines.length)]);

  setupSpillover();
  setTickerText("NEW MATCH SIGNAL");
  updateMomentum();
  updateCrowdHeat();
  updateTimer();
}

function vote(side){
  if(side === "left"){
    state.leftVotes = Math.min(82, state.leftVotes + 2);
    state.rightVotes = 100 - state.leftVotes;
    state.crowdHeat += 2;
    spawnReaction("🔥");
    pulseStage("left");
    setTickerText("LEFT LANE SURGE");
  } else {
    state.rightVotes = Math.min(82, state.rightVotes + 2);
    state.leftVotes = 100 - state.rightVotes;
    state.crowdHeat += 2;
    spawnReaction("⚡");
    pulseStage("right");
    setTickerText("RIGHT LANE SURGE");
  }
  updateMomentum();
  updateCrowdHeat();
}

function tick(){
  state.seconds -= 1;
  if(state.seconds <= 0){
    setFight();
    return;
  }

  if(Math.random() > 0.72){
    const swing = Math.random() > 0.5 ? 1 : -1;
    state.leftVotes = Math.max(35, Math.min(65, state.leftVotes + swing));
    state.rightVotes = 100 - state.leftVotes;
    pulseStage(swing > 0 ? "left" : "right");
    setTickerText(tickerPhrases[Math.floor(Math.random() * tickerPhrases.length)]);
    updateMomentum();
  }

  if(Math.random() > 0.62){
    const speaker = Math.random() > 0.5 ? state.left : state.right;
    addFeed(speaker.name, speaker.lines[Math.floor(Math.random() * speaker.lines.length)]);
  }

  if(Math.random() > 0.66){
    spawnReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    state.crowdHeat += 1;
  } else {
    state.crowdHeat -= 1;
  }

  if(Math.random() > 0.70){
    maybeSpilloverTalk();
  }

  maybeSpilloverQuit();

  updateCrowdHeat();
  updateTimer();
}

document.getElementById("voteLeft").addEventListener("click", () => vote("left"));
document.getElementById("voteRight").addEventListener("click", () => vote("right"));
document.querySelectorAll(".react-btn").forEach(btn => {
  btn.addEventListener("click", () => spawnReaction(btn.dataset.reaction));
});

document.getElementById("sendChimeBtn").addEventListener("click", () => {
  const input = document.getElementById("userChimeInput");
  const text = input.value.trim();
  if(!text) return;
  addSpillover("User Spectator", text, "user");
  input.value = "";
});

document.getElementById("userChimeInput").addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    document.getElementById("sendChimeBtn").click();
  }
});

setFight();
setInterval(tick, 2600);
setInterval(() => {
  setTickerText(tickerPhrases[Math.floor(Math.random() * tickerPhrases.length)]);
}, 7200);
