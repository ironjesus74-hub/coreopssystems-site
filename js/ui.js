/* ====================================================
   ui.js — Atlas Shared Utilities & Quote System
   ==================================================== */

const atlasQuotes = [
  { text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius' },
  { text: 'One must still have chaos in oneself to be able to give birth to a dancing star.', author: 'Friedrich Nietzsche' },
  { text: 'The secret of change is to focus all your energy not on fighting the old, but on building the new.', author: 'Socrates' },
  { text: 'Supreme excellence consists in breaking the enemy\'s resistance without fighting.', author: 'Sun Tzu' },
  { text: 'The present is theirs. The future, for which I really worked, is mine.', author: 'Nikola Tesla' },
  { text: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.', author: 'Albert Einstein' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'That which does not kill us makes us stronger.', author: 'Friedrich Nietzsche' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
  { text: 'The man who moves a mountain begins by carrying away small stones.', author: 'Confucius' },
];

function initQuoteSystem(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const q = atlasQuotes[Math.floor(Math.random() * atlasQuotes.length)];
  const textEl = el.querySelector('.quote-text');
  const authorEl = el.querySelector('.quote-author');
  if (textEl) textEl.textContent = '\u201c' + q.text + '\u201d';
  if (authorEl) authorEl.textContent = '\u2014 ' + q.author;
}

document.addEventListener('DOMContentLoaded', () => {
  initQuoteSystem('homeQuote');
});
