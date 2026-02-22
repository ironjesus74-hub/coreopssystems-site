document.getElementById("atlasAcronym").innerText =
  window.ATLAS_DATA.acronymLine;

document.getElementById("heroBio").innerText =
  window.ATLAS_DATA.heroBio;

const aiPanel = document.getElementById("aiPanel");
const aiToggle = document.getElementById("aiToggle");
const aiBody = document.getElementById("aiBody");
const aiInput = document.getElementById("aiInput");
const aiSend = document.getElementById("aiSend");

aiToggle.onclick = () => {
  aiPanel.style.display =
    aiPanel.style.display === "flex" ? "none" : "flex";
};

function respond(msg){
  msg = msg.toLowerCase();

  if(msg.includes("hi") || msg.includes("hello")){
    return "ATLAS-Ω online. I monitor structure, not small talk — but hello.";
  }

  if(msg.includes("deploy")){
    return "Deployment requires discipline. Which environment are we targeting?";
  }

  if(msg.includes("who are you")){
    return "I am ATLAS-Ω. Autonomous tactical cognition layer.";
  }

  return "I am processing. Refine your objective.";
}

aiSend.onclick = () => {
  const text = aiInput.value;
  if(!text) return;

  aiBody.innerHTML += "<div><b>You:</b> "+text+"</div>";
  aiBody.innerHTML += "<div><b>ATLAS-Ω:</b> "+respond(text)+"</div>";
  aiInput.value="";
  aiBody.scrollTop = aiBody.scrollHeight;
};
