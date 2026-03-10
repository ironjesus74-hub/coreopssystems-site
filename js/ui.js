/* ===== Atlas Shared UI — Quote System + Micro Interactions ===== */

/**
 * Philosophical quotes rotated on page load.
 * Each entry: { text: string, author: string }
 * Rendered into any .atlas-quote-block container on the page.
 */
const ATLAS_QUOTES = [
  { text: "The signal exists before the words.", author: "Atlas System" },
  { text: "Clarity is not simplicity. It is precision under pressure.", author: "Atlas Signal" },
  { text: "Every collision has a winner. Every winner was once the underdog.", author: "Atlas Arena" },
  { text: "The machine does not dream. But it remembers every pattern.", author: "Atlas Core" },
  { text: "Strength is knowing when to route around the obstacle.", author: "Atlas Operator" },
  { text: "The best systems fail gracefully and recover silently.", author: "Atlas Engine" },
  { text: "Rival models are just mirrors showing you what you missed.", author: "Atlas Gauntlet" },
  { text: "Intelligence without intent is just noise wearing a good interface.", author: "Atlas Signal" },
  { text: "The arena does not care what you planned. It cares what you deliver.", author: "Atlas Gauntlet" },
  { text: "Pattern recognition is the oldest form of wisdom.", author: "Atlas Core" },
  { text: "Trust is a score. Earn it once. Lose it in a single bad output.", author: "Atlas ID" },
  { text: "Built different means built with intention.", author: "Atlas" }
];

function initQuoteSystem() {
  const containers = document.querySelectorAll(".atlas-quote-block");
  if (!containers.length) return;

  const quote = ATLAS_QUOTES[Math.floor(Math.random() * ATLAS_QUOTES.length)];

  containers.forEach(el => {
    el.innerHTML = `
      <blockquote class="atlas-quote">
        <p class="atlas-quote-text">${quote.text}</p>
        <cite class="atlas-quote-author">— ${quote.author}</cite>
      </blockquote>
    `;
    el.classList.add("atlas-quote-loaded");
  });
}

function initTickerLoop(tickerId) {
  const track = document.getElementById(tickerId);
  if (!track) return;
  _cloneTickerTrack(track);
}

function _cloneTickerTrack(track) {
  const items = [...track.querySelectorAll("span")];
  if (!items.length) return;
  // Remove any previous clones to avoid double-init
  track.querySelectorAll("[data-ticker-clone]").forEach(el => el.remove());
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute("data-ticker-clone", "1");
    track.appendChild(clone);
  });
}

function initAllTickers() {
  document.querySelectorAll(".live-ticker-track").forEach(_cloneTickerTrack);
}

function initLiveCounters() {
  const counters = document.querySelectorAll("[data-live-count]");
  counters.forEach(el => {
    const base = parseInt(el.dataset.liveCount, 10);
    if (isNaN(base)) return;
    const drift = Math.floor(Math.random() * 7) - 2;
    el.textContent = base + drift;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initQuoteSystem();
  initLiveCounters();
  initAllTickers();
});
