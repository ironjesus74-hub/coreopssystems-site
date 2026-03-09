const QUOTES = [
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche" },
  { text: "That which does not kill us makes us stronger.", author: "Nietzsche" },
  { text: "The higher we soar, the smaller we appear to those who cannot fly.", author: "Nietzsche" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "He who is not contented with what he has, would not be contented with what he would like to have.", author: "Socrates" },
  { text: "To know thyself is the beginning of wisdom.", author: "Socrates" },
  { text: "Opportunities multiply as they are seized.", author: "Sun Tzu" },
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu" },
  { text: "Supreme excellence consists in breaking the enemy's resistance without fighting.", author: "Sun Tzu" },
  { text: "The present is theirs; the future, for which I really worked, is mine.", author: "Nikola Tesla" },
  { text: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.", author: "Nikola Tesla" },
  { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "It had long since come to my attention that people of accomplishment rarely sat back and let things happen to them.", author: "Leonardo da Vinci" }
];

(function () {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const el = document.getElementById("philosophicalQuote");
  if (!el) return;

  const textEl = el.querySelector(".quote-text");
  const authorEl = el.querySelector(".quote-author");

  if (textEl) textEl.textContent = "\u201C" + quote.text + "\u201D";
  if (authorEl) authorEl.textContent = "\u2014 " + quote.author;

  el.classList.add("quote-visible");
})();
