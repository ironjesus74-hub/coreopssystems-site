// ATLAS-Ω AI Chat Interface — backup before Project Atlas migration
// Pre-migration version: vulnerable to DOM XSS via innerHTML.

const responses = {
  hello: "Hello, operator. ATLAS-Ω online.",
  help: "Available commands: status, scan, deploy, rollback, help.",
  status: "All systems nominal. Core integrity at 100%.",
  scan: "Initiating threat scan... No anomalies detected.",
  deploy: "Deploy sequence requires confirmation. Type 'confirm deploy'.",
  rollback: "Rollback sequence requires confirmation. Type 'confirm rollback'.",
  default: "Command not recognized. Type 'help' for available commands."
};

function respond(input) {
  const key = input.trim().toLowerCase();
  return responses[key] || responses.default;
}

const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send");
const aiBody = document.getElementById("ai-body");
const aiForm = document.getElementById("ai-form");

document.addEventListener("DOMContentLoaded", function () {
  if (aiInput) aiInput.focus();
});

if (aiSend) {
  aiSend.addEventListener("click", handleSend);
}

if (aiForm) {
  aiForm.addEventListener("submit", function(e) { e.preventDefault(); handleSend(); });
}

function handleSend() {
  const text = aiInput.value;
  if(!text) return;

  const youDiv = document.createElement("div");
  const youLabel = document.createElement("b");
  youLabel.textContent = "You:";
  youDiv.appendChild(youLabel);
  youDiv.appendChild(document.createTextNode(" " + text));
  aiBody.appendChild(youDiv);

  const atlasDiv = document.createElement("div");
  const atlasLabel = document.createElement("b");
  atlasLabel.textContent = "ATLAS-Ω:";
  atlasDiv.appendChild(atlasLabel);
  atlasDiv.appendChild(document.createTextNode(" " + respond(text)));
  aiBody.appendChild(atlasDiv);

  aiInput.value="";
  aiBody.scrollTop = aiBody.scrollHeight;
};
