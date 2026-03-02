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

  // — Login feature —
  const SESSION_KEY = "fa_logged_in";
  const loginBtn   = document.getElementById("loginBtn");
  const logoutBtn  = document.getElementById("logoutBtn");
  const modal      = document.getElementById("loginModal");
  const modalClose = document.getElementById("modalClose");
  const loginForm  = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  function setLoggedIn(state) {
    if (state) {
      sessionStorage.setItem(SESSION_KEY, "1");
      loginBtn.style.display  = "none";
      logoutBtn.style.display = "";
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      loginBtn.style.display  = "";
      logoutBtn.style.display = "none";
    }
  }

  function openModal() {
    modal.classList.add("open");
    document.getElementById("loginEmail").focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    loginForm.reset();
    loginError.textContent = "";
  }

  // Restore session state on page load
  setLoggedIn(sessionStorage.getItem(SESSION_KEY) === "1");

  loginBtn.addEventListener("click", openModal);

  logoutBtn.addEventListener("click", () => {
    setLoggedIn(false);
  });

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailVal = document.getElementById("loginEmail").value.trim();
    const passVal  = document.getElementById("loginPassword").value.trim();

    if (!emailVal || !passVal) {
      loginError.textContent = "Please enter your email and password.";
      return;
    }

    // Placeholder: accept any non-empty credentials
    loginError.textContent = "";
    setLoggedIn(true);
    closeModal();
  });
})();
