/* ===== Atlas Shared UI — Quote System + Micro Interactions ===== */

/**
 * Philosophical quotes rotated on page load and periodically.
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
  { text: "Built different means built with intention.", author: "Atlas" },
  { text: "The operator who asks the sharpest question wins before the model even responds.", author: "Atlas Operator" },
  { text: "Confidence without calibration is just decoration.", author: "Atlas Signal" },
  { text: "Speed is a feature. Precision is a requirement.", author: "Atlas Engine" },
  { text: "Every bad prompt is a compressed version of an unclear thought.", author: "Atlas Core" }
];

function quoteHTML(quote) {
  return `
    <blockquote class="atlas-quote">
      <p class="atlas-quote-text">${quote.text}</p>
      <cite class="atlas-quote-author">— ${quote.author}</cite>
    </blockquote>
  `;
}

function initQuoteSystem() {
  const containers = document.querySelectorAll(".atlas-quote-block");
  if (!containers.length) return;

  const pool = [...ATLAS_QUOTES].sort(() => Math.random() - 0.5);
  containers.forEach((el, i) => {
    const quote = pool[i % pool.length];
    el.innerHTML = quoteHTML(quote);
    el.classList.add("atlas-quote-loaded");
  });
}

function rotateQuotes() {
  const containers = document.querySelectorAll(".atlas-quote-block");
  if (!containers.length) return;
  const pool = [...ATLAS_QUOTES].sort(() => Math.random() - 0.5);
  containers.forEach((el, i) => {
    const quote = pool[i % pool.length];
    el.classList.remove("atlas-quote-loaded");
    setTimeout(() => {
      el.innerHTML = quoteHTML(quote);
      el.classList.add("atlas-quote-loaded");
    }, 400);
  });
}

/** Double all spans inside every .live-ticker-track for a seamless CSS infinite loop at -50%. */
function initTickerLoops() {
  document.querySelectorAll(".live-ticker-track").forEach(track => {
    const items = [...track.querySelectorAll(":scope > span")];
    if (!items.length) return;
    items.forEach(item => track.appendChild(item.cloneNode(true)));
  });
}

function initLiveCounters() {
  document.querySelectorAll("[data-live-count]").forEach(el => {
    const base = parseInt(el.dataset.liveCount, 10);
    if (isNaN(base)) return;
    el.textContent = base + Math.floor(Math.random() * 7) - 2;
  });
}

function driftLiveCounters() {
  document.querySelectorAll("[data-live-count]").forEach(el => {
    const current = parseInt(el.textContent, 10);
    if (isNaN(current)) return;
    const base = parseInt(el.dataset.liveCount, 10) || current;
    const next = current + (Math.random() > 0.5 ? 1 : -1);
    el.textContent = Math.max(Math.max(1, base - 8), Math.min(base + 8, next));
  });
}

/** Reveal elements with .reveal-on-scroll as they enter the viewport. */
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal-on-scroll");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initTickerLoops();
  initQuoteSystem();
  initLiveCounters();
  initScrollReveal();
  setInterval(driftLiveCounters, 4800);
  setInterval(rotateQuotes, 45000);
});
