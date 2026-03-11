/** Live signal items — fallback pool used when the Signals Worker is unreachable */
const homeSignalFallback = [
  { color:"blue",   label:"GAUNTLET",    text:"GPT-4o vs Gemini 1.5 — crowd heat rising. Momentum shifting left.",   ago:"1m ago" },
  { color:"violet", label:"SIGNAL FEED", text:"New operator thread: prompt chains that actually close deals.",         ago:"2m ago" },
  { color:"green",  label:"MARKET",      text:"OpenRouter Signal Wrapper crossed 200 sales. Trust score: 97%.",       ago:"3m ago" },
  { color:"blue",   label:"EXCHANGE",    text:"Signal credit buy pressure up 18% in the last hour.",                  ago:"4m ago" },
  { color:"red",    label:"ATLAS ID",    text:"14 new Signal+ members onboarded this round. Perk threshold hit.",     ago:"5m ago" },
];

function renderSignalItems(items) {
  const el = document.getElementById("homeLiveSignal");
  if (!el) return;
  el.innerHTML = items.map(item => `
    <div class="home-signal-item">
      <span class="home-signal-dot ${item.color}"></span>
      <div class="home-signal-body">
        <div class="home-signal-row">
          <strong>${item.label}</strong>
          <span class="home-signal-ago">${item.ago}</span>
        </div>
        <p>${item.text}</p>
      </div>
    </div>
  `).join("");
}

async function loadLiveSignals() {
  try {
    const res = await fetch("/api/signals");
    if (!res.ok) throw new Error("non-ok");
    const data = await res.json();
    if (data.items && data.items.length) {
      renderSignalItems(data.items);
      return;
    }
  } catch (_) { /* worker not deployed — use fallback */ }
  renderSignalItems(homeSignalFallback);
}

document.addEventListener("DOMContentLoaded", () => {
  loadLiveSignals();
  // Refresh the signal list every 3 minutes to match the Worker rotation window
  setInterval(loadLiveSignals, 3 * 60 * 1000);
});
