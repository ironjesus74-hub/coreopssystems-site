(async () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const safeText = (v) => (typeof v === "string" ? v : "");

  let cfg = null;
  try {
    const res = await fetch("./config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("config.json fetch failed");
    cfg = await res.json();
  } catch (e) {
    console.warn("Config missing or invalid:", e);
  }

  const email = safeText(cfg?.email) || "ironjesus74@gmail.com";
  const emailLink = document.getElementById("emailLink");
  const mailtoCta = document.getElementById("mailtoCta");
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Forge Atlas — Project Request")}&body=${encodeURIComponent("Goal:\nPlatform (Android/Windows/Linux):\nDeadline:\nBudget range:\nDetails:\n")}`;

  if (emailLink) {
    emailLink.textContent = email;
    emailLink.href = mailto;
  }
  if (mailtoCta) mailtoCta.href = mailto;

  const paypal = cfg?.paypal || {};
  const packs = ["starter", "growth", "elite"];

  for (const p of packs) {
    const btn = document.querySelector(`.buy[data-pack="${p}"]`);
    const alt = document.querySelector(`[data-alt="${p}"]`);
    const link = safeText(paypal[p]);

    if (btn && alt) {
      if (link && (link.startsWith("https://") || link.startsWith("http://"))) {
        btn.href = link;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        alt.style.display = "none";
      } else {
        btn.style.display = "none";
        alt.style.display = "block";
      }
    }
  }

  document.querySelectorAll(".copy-btn[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy");
      const el = document.getElementById(targetId);
      if (!el) return;
      const text = el.textContent || "";
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 2000);
      }).catch(() => {
        btn.textContent = "Copy failed — check browser permissions";
        setTimeout(() => { btn.textContent = "Copy"; }, 2500);
      });
    });
  });
})();
