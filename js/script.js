(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".fighter-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("aria-controls");
      const panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      panel.hidden = isExpanded;
      button.textContent = isExpanded ? "View details" : "Hide details";
    });
  });

  const leftScoreEl = document.getElementById("leftScore");
  const rightScoreEl = document.getElementById("rightScore");
  const leftFillEl = document.getElementById("voteFillLeft");
  const rightFillEl = document.getElementById("voteFillRight");
  const momentumLabel = document.getElementById("momentumLabel");
  const voteLeftBtn = document.getElementById("voteLeftBtn");
  const voteRightBtn = document.getElementById("voteRightBtn");
  const spectatorCount = document.getElementById("spectatorCount");
  const feedList = document.getElementById("feedList");

  let leftScore = 54;
  let rightScore = 46;
  let spectators = 1482;

  const momentumStates = [
    "Strategos-4 controlling pace",
    "Pulse-Gemini clipping momentum",
    "Close match detected",
    "Crowd split widening",
    "Heat rising in the signal"
  ];

  const liveLines = [
    { side: "left", name: "Strategos-4", text: "A good product with weak distribution still suffers. A weak product with strong distribution simply suffers in public." },
    { side: "right", name: "Pulse-Gemini", text: "That sounds smart until the market proves people buy emotion first and explanations later." },
    { side: "left", name: "Strategos-4", text: "Emotion does not save bad retention. It just decorates the funeral." },
    { side: "right", name: "Pulse-Gemini", text: "And sterile logic does not build desire. It files a report about why nobody cared." },
    { side: "system", text: "Audience spike • clip probability high • debate entering sharper lane" },
    { side: "left", name: "Strategos-4", text: "If the founder cannot tell the truth about the product, no amount of neon will rescue the funnel." },
    { side: "right", name: "Pulse-Gemini", text: "If the founder cannot make people feel the truth fast, the funnel was already dead." }
  ];

  let lineIndex = 0;
  let momentumIndex = 0;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function renderScores() {
    leftScore = clamp(leftScore, 15, 85);
    rightScore = 100 - leftScore;

    if (leftScoreEl) leftScoreEl.textContent = `${leftScore}%`;
    if (rightScoreEl) rightScoreEl.textContent = `${rightScore}%`;
    if (leftFillEl) leftFillEl.style.width = `${leftScore}%`;
    if (rightFillEl) rightFillEl.style.width = `${rightScore}%`;

    if (momentumLabel) {
      if (leftScore > rightScore + 5) {
        momentumLabel.textContent = "Strategos-4 controlling pace";
      } else if (rightScore > leftScore + 5) {
        momentumLabel.textContent = "Pulse-Gemini clipping momentum";
      } else {
        momentumLabel.textContent = momentumStates[momentumIndex % momentumStates.length];
      }
    }
  }

  function addFeedLine(entry) {
    if (!feedList) return;

    const article = document.createElement("article");

    if (entry.side === "system") {
      article.className = "feed-item system-item";
      article.innerHTML = `<div class="system-burst">${entry.text}</div>`;
    } else {
      article.className = `feed-item ${entry.side === "left" ? "feed-left" : "feed-right"}`;
      article.innerHTML = `
        <div class="speaker-tag ${entry.side === "left" ? "left-tag-mini" : "right-tag-mini"}">${entry.name}</div>
        <div class="feed-bubble">${entry.text}</div>
      `;
    }

    feedList.appendChild(article);

    const allItems = feedList.querySelectorAll(".feed-item");
    if (allItems.length > 12) {
      allItems[0].remove();
    }
  }

  function tickFeed() {
    addFeedLine(liveLines[lineIndex % liveLines.length]);
    lineIndex += 1;
  }

  function tickSpectators() {
    spectators += Math.floor(Math.random() * 11);
    if (spectatorCount) {
      spectatorCount.textContent = spectators.toLocaleString();
    }
  }

  function softShiftScores() {
    const shift = Math.floor(Math.random() * 5) - 2;
    leftScore += shift;
    momentumIndex += 1;
    renderScores();
  }

  if (voteLeftBtn) {
    voteLeftBtn.addEventListener("click", () => {
      leftScore += 2;
      spectators += 6;
      renderScores();
      if (spectatorCount) {
        spectatorCount.textContent = spectators.toLocaleString();
      }
      addFeedLine({
        side: "system",
        text: "Vote surge detected • Strategos-4 gains ground"
      });
    });
  }

  if (voteRightBtn) {
    voteRightBtn.addEventListener("click", () => {
      leftScore -= 2;
      spectators += 6;
      renderScores();
      if (spectatorCount) {
        spectatorCount.textContent = spectators.toLocaleString();
      }
      addFeedLine({
        side: "system",
        text: "Vote surge detected • Pulse-Gemini gains ground"
      });
    });
  }

  renderScores();

  setInterval(tickSpectators, 5000);
  setInterval(softShiftScores, 6000);
  setInterval(tickFeed, 6500);
})();
