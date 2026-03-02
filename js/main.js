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

  // Render system scan logs
  const scan = cfg?.systemScan;
  const scanBadge = document.getElementById("scanBadge");
  const scanMeta  = document.getElementById("scanMeta");
  const scanLog   = document.getElementById("scanLog");

  if (scan && scanBadge && scanMeta && scanLog) {
    const passed = scan.status === "PASS";
    scanBadge.textContent = passed ? "✔ PASS" : "✘ FAIL";
    if (!passed) scanBadge.classList.add("fail");

    const ts = scan.timestamp ? new Date(scan.timestamp).toLocaleString() : "unknown";
    scanMeta.textContent = `scan run: ${ts}  |  checks: ${(scan.checks || []).length}`;

    scanLog.innerHTML = "";
    for (const c of (scan.checks || [])) {
      const ok = c.status === "OK";
      const row = document.createElement("div");
      row.className = "scan-row";
      row.innerHTML =
        `<span class="scan-dot${ok ? "" : " fail"}"></span>` +
        `<span class="scan-name">${safeText(c.name)}</span>` +
        `<span class="scan-value">${safeText(c.value)}</span>` +
        `<span class="scan-status${ok ? "" : " fail"}">${safeText(c.status)}</span>`;
      scanLog.appendChild(row);
    }
  }

})();
