document.addEventListener("DOMContentLoaded", () => {
  initMarketExpanders();
  initMarketFilters();
});

function initMarketExpanders() {
  const cards = document.querySelectorAll(".market-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const expanded = card.getAttribute("aria-expanded") === "true";
      card.setAttribute("aria-expanded", String(!expanded));
      card.classList.toggle("is-expanded", !expanded);
    });
  });
}

function initMarketFilters() {
  const marketGrid = document.getElementById("marketGrid");
  if (!marketGrid) return;

  const platformButtons = document.querySelectorAll("[data-filter-group='platform'] .market-filter-pill");
  const typeButtons = document.querySelectorAll("[data-filter-group='type'] .market-filter-pill");
  const cards = Array.from(marketGrid.querySelectorAll(".market-card"));

  let activePlatform = "all";
  let activeType = "all";

  platformButtons.forEach((button) => {
    button.addEventListener("click", () => {
      platformButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      activePlatform = button.dataset.filter || "all";
      applyMarketFilters();
    });
  });

  typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      typeButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      activeType = button.dataset.type || "all";
      applyMarketFilters();
    });
  });

  function applyMarketFilters() {
    cards.forEach((card) => {
      const platforms = (card.dataset.platform || "").split(/\s+/).filter(Boolean);
      const types = (card.dataset.type || "").split(/\s+/).filter(Boolean);

      const platformMatch = activePlatform === "all" || platforms.includes(activePlatform);
      const typeMatch = activeType === "all" || types.includes(activeType);

      card.classList.toggle("is-hidden", !(platformMatch && typeMatch));
    });
  }
}
