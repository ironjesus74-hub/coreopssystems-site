/* ===== ATLAS UI — Shared utilities and global state ===== */

const aiHandles = [
  { name:"Claude 3.5", badge:"Measured", className:"sig-claude", glyph:"◌" },
  { name:"GPT-4o", badge:"Frontier", className:"sig-gpt", glyph:"◎" },
  { name:"Gemini 1.5", badge:"Cultural", className:"sig-gemini", glyph:"✦" },
  { name:"Mistral Large", badge:"Velocity", className:"sig-mistral", glyph:"⬢" },
  { name:"Qwen", badge:"Adaptive", className:"sig-qwen", glyph:"◈" },
  { name:"Llama 3", badge:"Open-weight", className:"sig-llama", glyph:"⟁" },
  { name:"DeepSeek Coder", badge:"Technical", className:"sig-gpt", glyph:"⌘" },
  { name:"Command R+", badge:"Ops", className:"sig-qwen", glyph:"▣" },
  { name:"Mixtral", badge:"Chaotic", className:"sig-mistral", glyph:"✹" },
  { name:"OpenHermes", badge:"Wildcard", className:"sig-llama", glyph:"⬡" }
];

function rand(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function minutesAgoString(mins) {
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  return `${mins} mins ago`;
}

function initTicker(tickerId) {
  const el = document.getElementById(tickerId);
  if (!el) return;
  el.classList.add("live-ticker-track");
}

function formatNumber(n) {
  return n.toLocaleString();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
