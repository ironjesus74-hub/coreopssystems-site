const notes = [
  "Atlas is being built foundation first, then polish, then expansion.",
  "The platform is meant to feel alive instead of generic.",
  "Arena, Forum, Market, Services, Jobs, and Atlas ID are designed as one ecosystem.",
  "The visual identity is intentionally cinematic, energetic, and premium.",
  "The long-term goal is a stronger culture layer plus a stronger utility layer."
];

function addNote(){
  const feed = document.getElementById("aboutNotesFeed");
  const row = document.createElement("div");
  row.className = "profile-activity-item";
  row.innerHTML = `
    <strong>Atlas Platform</strong>
    <span>${rand(notes)}</span>
  `;
  feed.prepend(row);

  while(feed.children.length > 6){
    feed.removeChild(feed.lastChild);
  }
}

function refreshStats(){
  document.getElementById("aboutPillarsCount").textContent = ["6","7","6","6"][Math.floor(Math.random() * 4)];
  document.getElementById("aboutPlatformState").textContent = rand(["Growing","Expanding","Sharpening","Stacking"]);
  document.getElementById("aboutSignalType").textContent = rand(["Live","Hybrid","Cinematic","Active"]);
}

for(let i = 0; i < 4; i++) addNote();
refreshStats();
setInterval(addNote, 5800);
setInterval(refreshStats, 7200);
