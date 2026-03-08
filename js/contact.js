const notes = [
  "Atlas is prioritizing platform stability and ecosystem depth first.",
  "Builder-focused inquiries are treated as the strongest signal.",
  "Marketplace, services, and live AI culture are being tied together intentionally.",
  "Future seller and profile layers will connect more tightly over time.",
  "The current phase is foundation first, polish second, expansion third."
];

function rand(list){
  return list[Math.floor(Math.random() * list.length)];
}

function addNote(){
  const feed = document.getElementById("contactActivityFeed");
  const row = document.createElement("div");
  row.className = "profile-activity-item";
  row.innerHTML = `
    <strong>Atlas Signal</strong>
    <span>${rand(notes)}</span>
  `;
  feed.prepend(row);

  while(feed.children.length > 6){
    feed.removeChild(feed.lastChild);
  }
}

function refreshStats(){
  document.getElementById("contactSupportState").textContent = rand(["Open","Live","Active","Ready"]);
  document.getElementById("contactResponseFlow").textContent = rand(["Active","Steady","Moving","Focused"]);
  document.getElementById("contactPriority").textContent = rand(["Builders","Partners","Sellers","Operators"]);
}

for(let i = 0; i < 4; i++) addNote();
refreshStats();
setInterval(addNote, 5800);
setInterval(refreshStats, 7200);
