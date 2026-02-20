/**
 * Atlas (UI demo)
 * Later we can replace respondAtlas() with a real Worker/API call.
 */

function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt) e.textContent = txt;
  return e;
}

function addMsg(chat, who, text, isUser=false){
  const row = el("div", "msg" + (isUser ? " user" : ""));
  const w = el("div", "who", who);
  const t = el("div", "text", text);
  row.appendChild(w);
  row.appendChild(t);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function respondAtlas(input){
  // simple “professional” canned responses for now
  const s = input.toLowerCase();

  if (s.includes("hello") || s.includes("hi")) {
    return "Hello. I’m Atlas. What are we building today — site, scripts, or deployment?";
  }
  if (s.includes("domain") || s.includes("dns")) {
    return "For domains: we’ll point your root (@) + www to your Pages deployment, then enable SSL + redirects.";
  }
  if (s.includes("windows")) {
    return "Windows packaging: we can ship PowerShell + EXE wrappers, signed releases, and an installer bundle.";
  }
  if (s.includes("coreops")) {
    return "CoreOps Systems: security automation, cross-platform toolkits, and an AI-first operator experience.";
  }

  return "Acknowledged. Give me your goal in one sentence, and I’ll map the next 3 steps.";
}

function buildModal(){
  const modal = el("div", "atlas-modal");
  modal.id = "atlasModal";

  const panel = el("div", "atlas-panel");

  const head = el("div", "atlas-head");
  const badge = el("div", "badge");
  const dot = el("span", "badge-dot");
  badge.appendChild(dot);
  badge.appendChild(document.createTextNode("Atlas Console"));

  const close = el("button", "close-btn", "×");
  close.type = "button";
  close.onclick = () => modal.classList.remove("open");

  head.appendChild(badge);
  head.appendChild(close);

  const body = el("div", "atlas-body");
  const chat = el("div", "chat");
  chat.id = "atlasChat";

  const inputRow = el("div", "input-row");
  const input = document.createElement("input");
  input.id = "atlasInput";
  input.placeholder = "Ask Atlas… (ex: 'How do we deploy on Cloudflare Pages?')";
  input.autocomplete = "off";

  const send = el("button", "", "Send");
  send.id = "atlasSend";
  send.type = "button";

  function sendNow(){
    const v = (input.value || "").trim();
    if (!v) return;
    addMsg(chat, "YOU", v, true);
    input.value = "";
    const r = respondAtlas(v);
    addMsg(chat, "ATLAS", r, false);
  }

  send.onclick = sendNow;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendNow();
    if (e.key === "Escape") modal.classList.remove("open");
  });

  inputRow.appendChild(input);
  inputRow.appendChild(send);

  body.appendChild(chat);
  body.appendChild(inputRow);

  panel.appendChild(head);
  panel.appendChild(body);
  modal.appendChild(panel);

  document.body.appendChild(modal);

  // greeting
  addMsg(chat, "ATLAS", "Systems online. Ask a question to begin.", false);
}

document.addEventListener("DOMContentLoaded", () => {
  buildModal();

  const btn = document.getElementById("atlasBtn");
  const modal = document.getElementById("atlasModal");
  const input = document.getElementById("atlasInput");

  btn.addEventListener("click", () => {
    modal.classList.add("open");
    setTimeout(() => input.focus(), 50);
  });

  // click outside to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
});
