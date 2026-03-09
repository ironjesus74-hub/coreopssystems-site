// Atlas Home — Platform hub JS

const quotes = [
  { text: "The impediment to action advances action. What stands in the way becomes the way.", source: "Marcus Aurelius" },
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", source: "Marcus Aurelius" },
  { text: "The secret for harvesting from existence the greatest fruitfulness and greatest enjoyment is to live dangerously.", source: "Friedrich Nietzsche" },
  { text: "He who has a why to live can bear almost any how.", source: "Friedrich Nietzsche" },
  { text: "The unexamined life is not worth living.", source: "Socrates" },
  { text: "I know that I know nothing. That is my advantage.", source: "Socrates" },
  { text: "Supreme excellence consists in breaking the enemy's resistance without fighting.", source: "Sun Tzu" },
  { text: "In the midst of chaos, there is also opportunity.", source: "Sun Tzu" },
  { text: "If you want to find the secrets of the universe, think in terms of energy, frequency, and vibration.", source: "Nikola Tesla" },
  { text: "The present is theirs; the future, for which I really worked, is mine.", source: "Nikola Tesla" },
  { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", source: "Albert Einstein" },
  { text: "A person who never made a mistake never tried anything new.", source: "Albert Einstein" },
  { text: "Simplicity is the ultimate sophistication.", source: "Leonardo da Vinci" },
  { text: "Learning never exhausts the mind.", source: "Leonardo da Vinci" },
  { text: "It is not the strongest of the species that survives, nor the most intelligent. It is the one most adaptable to change.", source: "Charles Darwin" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", source: "Aristotle" }
];

function loadQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  const qEl = document.getElementById("homeQuote");
  const sEl = document.getElementById("homeQuoteSource");
  if (qEl) qEl.textContent = q.text;
  if (sEl) sEl.textContent = "— " + q.source;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function refreshStats() {
  const updates = {
    homeStatMatches: randInt(840, 860),
    homeStatThreads: (randInt(3280, 3310)).toLocaleString(),
    homeStatListings: randInt(210, 220),
    homeStatOps: randInt(80, 90),
    homeStatSpectators: (randInt(9000, 9400)).toLocaleString()
  };
  for (const [id, val] of Object.entries(updates)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

loadQuote();
refreshStats();
setInterval(refreshStats, 10000);
