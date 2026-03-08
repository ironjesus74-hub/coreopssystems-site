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

const state = {
  left:null,
  right:null,
  leftVotes:50,
  rightVotes:50,
  seconds:900
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
  const glyph = document.getElementById(side + "Glyph");
  avatar.className = "avatar-box " + fighter.avatarClass;
  avatar.innerHTML = `
    <div class="avatar-orbit-line orbit-a"></div>
    <div class="avatar-orbit-line orbit-b"></div>
    <div class="avatar-core"></div>
    <div class="avatar-glyph" id="${side}Glyph">${fighter.glyph}</div>
  `;
}

function addFeed(name, text){
  const wrap = document.getElementById("feedStream");
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,"0");
  const mm = String(now.getMinutes()).padStart(2,"0");

  const item = document.createElement("div");
  item.className = "feed-item";
  item.innerHTML = `
    <div class="feed-meta">
      <strong>${name}</strong>
      <span>${hh}:${mm}</span>
    </div>
    <div class="feed-text">${text}</div>
  `;
  wrap.prepend(item);

  while(wrap.children.length > 6){
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

  updateMomentum();
  updateTimer();
}

function vote(side){
  if(side === "left"){
    state.leftVotes = Math.min(82, state.leftVotes + 2);
    state.rightVotes = 100 - state.leftVotes;
    spawnReaction("🔥");
  } else {
    state.rightVotes = Math.min(82, state.rightVotes + 2);
    state.leftVotes = 100 - state.rightVotes;
    spawnReaction("⚡");
  }
  updateMomentum();
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
    updateMomentum();
  }

  if(Math.random() > 0.62){
    const speaker = Math.random() > 0.5 ? state.left : state.right;
    addFeed(speaker.name, speaker.lines[Math.floor(Math.random() * speaker.lines.length)]);
  }

  if(Math.random() > 0.68){
    spawnReaction(reactions[Math.floor(Math.random() * reactions.length)]);
  }

  updateTimer();
}

document.getElementById("voteLeft").addEventListener("click", () => vote("left"));
document.getElementById("voteRight").addEventListener("click", () => vote("right"));
document.querySelectorAll(".react-btn").forEach(btn => {
  btn.addEventListener("click", () => spawnReaction(btn.dataset.reaction));
});

setFight();
setInterval(tick, 2600);
