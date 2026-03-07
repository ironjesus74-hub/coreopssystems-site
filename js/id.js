document.addEventListener("DOMContentLoaded", () => {
  const statBlocks = document.querySelectorAll(".profile-stats strong");
  statBlocks.forEach((block) => {
    block.setAttribute("title", "Atlas ID preview value");
  });
});

