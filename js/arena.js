const fighters = [
  {
    name:"GPT-4o",
    role:"Frontier Reasoner",
    origin:"OpenAI · Flagship",
    glyph:"◎",
    lane:"FRONTIER",
    style:"Reasoning",
    tags:["Code","Reasoning","Versatility"]
  },
  {
    name:"Claude 3.5",
    role:"Careful Synthesizer",
    origin:"Anthropic · Sonnet",
    glyph:"◌",
    lane:"MEASURED",
    style:"Synthesis",
    tags:["Writing","Ethics","Depth"]
  },
  {
    name:"Gemini 1.5",
    role:"Cultural Adapter",
    origin:"Google · Pro",
    glyph:"✦",
    lane:"CULTURAL",
    style:"Multimodal",
    tags:["Search","Multimodal","Speed"]
  },
  {
    name:"Mistral Large",
    role:"Velocity Operator",
    origin:"Mistral AI · Large",
    glyph:"⬢",
    lane:"VELOCITY",
    style:"Efficiency",
    tags:["Speed","Instruction","Lean"]
  },
  {
    name:"Llama 3",
    role:"Open-weight Wildcard",
    origin:"Meta · Open",
    glyph:"⟁",
    lane:"OPEN",
    style:"Community",
    tags:["Open","Fine-tuning","Flexible"]
  },
  {
    name:"DeepSeek Coder",
    role:"Technical Specialist",
    origin:"DeepSeek · Coder",
    glyph:"⌘",
    lane:"TECHNICAL",
    style:"Code",
    tags:["Code","Systems","Precision"]
  }
];

const matchup = {
  left: 0,
  right: 1,
  scoreLeft: 2,
  scoreRight: 1,
  momentum: 62,
  heat: 78
};

let leftVotes = 640;
let rightVotes = 644;
let totalReactions = 3571;

function rand(list){
  return list[Math.floor(Math.random() * list.length)];
}

function applyFighter(side, fighter){
  const s = side === "left" ? "left" : "right";
  document.getElementById(s + "FighterName").textContent = fighter.name;
  document.getElementById(s + "Role").textContent = fighter.role;
  document.getElementById(s + "Origin").textContent = fighter.origin;
  document.getElementById(s + "Glyph").textContent = fighter.glyph;
  document.getElementById(s + "Lane").textContent = fighter.lane;
  document.getElementById(s + "Style").textContent = fighter.style;
  document.getElementById(s + "Tags").innerHTML = fighter.tags.map(t => `<span>${t}</span>`).join("");
  document.getElementById("vote" + s.charAt(0).toUpperCase() + s.slice(1)).textContent = "Vote " + fighter.name;
}

function buildRoundPills(){
  const left = fighters[matchup.left];
  const right = fighters[matchup.right];
  const total = matchup.scoreLeft + matchup.scoreRight;
  const pills = [];
  for(let i = 0; i < total; i++){
    pills.push(`<span>ROUND ${i + 1} · ${i % 2 === 0 ? left.name : right.name}</span>`);
  }
  pills.push(`<span>ROUND ${total + 1} · LIVE</span>`);
  document.getElementById("roundPills").innerHTML = pills.join("");
}

function refreshStats(){
  leftVotes += Math.floor(Math.random() * 8);
  rightVotes += Math.floor(Math.random() * 8);
  totalReactions += Math.floor(Math.random() * 12);

  document.getElementById("arenaSpectators").textContent = (400 + Math.floor(Math.random() * 200)).toLocaleString();
  document.getElementById("totalVotes").textContent = (leftVotes + rightVotes).toLocaleString();
  document.getElementById("totalReactions").textContent = totalReactions.toLocaleString();
  document.getElementById("arenaHeat").textContent = rand(["High","Intense","Critical","Rising"]);
  document.getElementById("matchPace").textContent = rand(["Fast","Electric","Fierce","Rapid"]);
  document.getElementById("upsetRisk").textContent = rand(["Medium","Low","High","Critical"]);
  document.getElementById("crowdHeatVal").textContent = rand(["🔥 Intense","⚡ Electric","💥 Wild","🔥 High"]);

  const shift = Math.floor(Math.random() * 7) - 3;
  matchup.momentum = Math.max(25, Math.min(75, matchup.momentum + shift));

  const left = fighters[matchup.left];
  const right = fighters[matchup.right];
  document.getElementById("momentumFill").style.width = matchup.momentum + "%";
  document.getElementById("momentumLabel").textContent =
    matchup.momentum > 50 ? left.name + " leading" :
    matchup.momentum < 50 ? right.name + " leading" : "Dead heat";
  document.getElementById("leftMomentum").textContent = matchup.momentum + "%";
  document.getElementById("rightMomentum").textContent = (100 - matchup.momentum) + "%";
  document.getElementById("leftHeat").textContent = rand(["High","Rising","Hot","Peaked"]);
  document.getElementById("rightHeat").textContent = rand(["Steady","Climbing","Building","Strong"]);

  const heatShift = Math.floor(Math.random() * 5) - 2;
  matchup.heat = Math.max(50, Math.min(98, matchup.heat + heatShift));
  document.getElementById("heatFill").style.width = matchup.heat + "%";
  document.getElementById("arenaRound").textContent = (matchup.scoreLeft + matchup.scoreRight + 1) + " of 5";
}

function fireReaction(emoji){
  const stage = document.getElementById("reactionStage");
  const el = document.createElement("span");
  el.className = "arena-float-reaction";
  el.textContent = emoji;
  el.style.left = (12 + Math.random() * 72) + "%";
  el.style.fontSize = (22 + Math.random() * 18) + "px";
  el.style.animationDuration = (1.4 + Math.random() * 0.8) + "s";
  stage.appendChild(el);
  el.addEventListener("animationend", function(){ el.remove(); });
  totalReactions++;
}

function bindVotes(){
  document.getElementById("voteLeft").addEventListener("click", function(){
    leftVotes++;
    document.getElementById("totalVotes").textContent = (leftVotes + rightVotes).toLocaleString();
    fireReaction("👆");
  });
  document.getElementById("voteRight").addEventListener("click", function(){
    rightVotes++;
    document.getElementById("totalVotes").textContent = (leftVotes + rightVotes).toLocaleString();
    fireReaction("👆");
  });
}

function bindReactions(){
  document.querySelectorAll(".arena-react-btn").forEach(function(btn){
    btn.addEventListener("click", function(){ fireReaction(btn.dataset.emoji); });
  });
}

function autoReaction(){
  fireReaction(rand(["🔥","⚡","💥","👑","😤","🎯"]));
}

applyFighter("left", fighters[matchup.left]);
applyFighter("right", fighters[matchup.right]);
buildRoundPills();
bindVotes();
bindReactions();
refreshStats();
setInterval(refreshStats, 6800);
setInterval(autoReaction, 3200);
