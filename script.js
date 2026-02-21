/* Forge Atlas — Spartan Demo Layer (static) */

const $ = (s) => document.querySelector(s);

const state = {
  ttsOn: false,
  license: "Personal",
  selected: null,
  basePrices: {
    starter: 9,
    vps: 15,
    creator: 12
  },
  coupon: null
};

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function addLine(el, text, cls="") {
  const div = document.createElement("div");
  div.className = `out__line ${cls}`.trim();
  div.textContent = text;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}
function speak(text) {
  if (!state.ttsOn) return;
  if (!("speechSynthesis" in window)) return;

  try {
    const synth = window.speechSynthesis;
    synth.cancel();

    const u = new SpeechSynthesisUtterance(String(text || ""));

    const pickVoice = () => {
      const voices = synth.getVoices() || [];
      if (!voices.length) return null;

      const en = voices.filter(v => /en/i.test(v.lang || ""));
      const pool = en.length ? en : voices;

      const prefer = /(male|daniel|fred|alex|google|en[-_]?us|english)/i;

      const score = (v) => {
        let n = 0;
        if (prefer.test(v.name || "")) n += 2;
        if ((v.lang || "").toLowerCase().includes("en")) n += 1;
        return n;
      };

      pool.sort((a,b) => score(b) - score(a));
      return pool[0] || null;
    };

    const chosen = pickVoice();
    if (chosen) u.voice = chosen;

    // “Spartan” tuning (deep-ish + controlled)
    u.rate = 0.92;
    u.pitch = 0.72;
    u.volume = 1.0;

    // Keep voice list fresh (some Android builds load voices after first interaction)
    synth.onvoiceschanged = () => {};

    synth.speak(u);
  } catch (_) {}
}


function setTTS(btn, on) {
  state.ttsOn = on;
  btn.setAttribute("aria-pressed", String(on));
  btn.textContent = `Voice: ${on ? "On" : "Off"}`;
}

function thinkingSequence(el, finalText) {
  const steps = [
    "Assessing objective…",
    "Mapping environment…",
    "Selecting modules…",
    "Composing response…",
    "Ready."
  ];
  let i = 0;

  const runStep = () => {
    if (i < steps.length) {
      addLine(el, `[${nowTime()}] ${steps[i]}`, "out__brand");
      i += 1;
      setTimeout(runStep, 260 + Math.random() * 220);
      return;
    }
    addLine(el, finalText, "");
    speak(finalText);
  };

  runStep();
}

function atlasRespond(q) {
  const lower = q.toLowerCase();

  // Defensive, legit suggestions only (no harmful instructions)
  if (lower.includes("hack") || lower.includes("steal") || lower.includes("ddos")) {
    return "Denied. Objective conflicts with defensive posture. Try diagnostics or hardening guidance.";
  }

  if (lower.includes("termux")) {
    return [
      "Termux Loadout (Demo):",
      "✔ pkg update && pkg upgrade",
      "✔ pkg install git nodejs openssh curl jq",
      "✔ git config --global user.name \"...\"",
      "✔ git config --global user.email \"...\"",
      "Next: deploy a module from the marketplace and keep it versioned.",
    ].join("\n");
  }

  if (lower.includes("vps") || lower.includes("hardening") || lower.includes("nginx") || lower.includes("ubuntu")) {
    return [
      "VPS Hardening (Demo Preview):",
      "# (redacted) baseline updates + firewall policy",
      "sudo apt update && sudo apt -y upgrade",
      "sudo ufw default deny incoming",
      "sudo ufw default allow outgoing",
      "sudo ufw allow OpenSSH",
      "# ... (full pack includes SSH hardening + fail2ban checklist + audit notes)",
      "Recommendation: Deploy 'VPS Hardening Module' for full versioned pack.",
    ].join("\n");
  }

  if (lower.includes("youtube") || lower.includes("creator")) {
    return [
      "Creator Ops (Demo):",
      "• Capture checklist (audio, lights, scene)",
      "• Upload pipeline (naming, tags, chapters)",
      "• Backup strategy (local + cloud)",
      "• Automation idea: a one-click project folder generator + asset checklist.",
      "Recommendation: 'YouTube Ops Toolkit' module.",
    ].join("\n");
  }

  if (lower.includes("freelance") || lower.includes("client")) {
    return [
      "Freelance Deploy (Demo):",
      "• Pick stack: static / Node / Next / WordPress",
      "• Add uptime + error logging",
      "• Basic security headers + backup plan",
      "Recommendation: Deploy 'Forge Starter Loadout' + add-on modules per client.",
    ].join("\n");
  }

  return [
    "Acknowledged.",
    "Try a specific objective:",
    "• 'termux dev setup'",
    "• 'demo vps hardening script'",
    "• 'creator ops workflow'",
    "• 'recommend a module for X'",
  ].join("\n");
}

function runAtlas(q, outEl) {
  addLine(outEl, `❯ ${q}`, "out__ok");
  const response = atlasRespond(q);

  // Render response with “thinking steps”
  thinkingSequence(outEl, response);
}

function initSystemScan() {
  const isSecure = location.protocol === "https:";
  $("#scanConn").textContent = isSecure ? "Secure (HTTPS)" : "Not secure";
  $("#scanConn").style.color = isSecure ? "rgba(34,197,94,.95)" : "rgba(255,178,74,.95)";

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const device = isAndroid ? "Android" : "Desktop/Other";
  $("#scanDevice").textContent = device;

  // Browser guess (simple)
  let browser = "Unknown";
  if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "Chromium (Chrome)";
  if (/Edg\//i.test(ua)) browser = "Edge";
  if (/Firefox\//i.test(ua)) browser = "Firefox";
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
  $("#scanBrowser").textContent = browser;

  // Latency-ish: measure a small timer (client-only)
  const t0 = performance.now();
  setTimeout(() => {
    const ms = Math.round(performance.now() - t0);
    $("#scanLatency").textContent = `${ms}ms`;
  }, 200);
}

async function loadQuotes() {
  try {
    const res = await fetch("data/quotes.json", { cache: "no-store" });
    if (!res.ok) throw new Error("quote fetch failed");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [
      { text: "Discipline is choosing between what you want now and what you want most.", author: "Unknown" },
      { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
      { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
    ];
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function applyQuote(q) {
  $("#quoteText").textContent = `“${q.text}”`;
  $("#quoteMeta").textContent = q.author ? `— ${q.author}` : "";
}

/* Marketplace / Deploy panel demo logic */
function setLicense(btn) {
  document.querySelectorAll(".seg__btn").forEach(b => b.classList.remove("is-on"));
  btn.classList.add("is-on");
  state.license = btn.dataset.license;
  recalcTotal();
}

function selectModule(key) {
  state.selected = key;
  const names = {
    starter: "Forge Starter Loadout",
    vps: "VPS Hardening Module",
    creator: "YouTube Ops Toolkit"
  };
  $("#selectedModule").textContent = names[key] || "Unknown";
  $("#deployNow").disabled = false;
  $("#couponMsg").textContent = "";
  recalcTotal();
}

function recalcTotal() {
  const base = state.selected ? (state.basePrices[state.selected] || 0) : 0;
  // License multipliers
  const mult = state.license === "Personal" ? 1 : state.license === "Freelancer" ? 1.6 : 2.6;
  let total = base * mult;

  if (state.coupon === "FORGED") total *= 0.85;
  if (state.coupon === "EMBER") total -= 2;

  if (total < 0) total = 0;
  $("#total").textContent = `$${total.toFixed(2)}`;
}

function applyCoupon() {
  const code = ($("#coupon").value || "").trim().toUpperCase();
  state.coupon = null;
  if (!code) {
    $("#couponMsg").textContent = "No code entered.";
    recalcTotal();
    return;
  }
  // Demo codes (front-end only)
  if (code === "FORGED") {
    state.coupon = "FORGED";
    $("#couponMsg").textContent = "Code accepted: FORGED (15% off) — demo.";
  } else if (code === "EMBER") {
    state.coupon = "EMBER";
    $("#couponMsg").textContent = "Code accepted: EMBER ($2 off) — demo.";
  } else {
    $("#couponMsg").textContent = "Invalid code (demo). Try FORGED or EMBER.";
  }
  recalcTotal();
}

function wireUI() {
  // Year
  $("#year").textContent = String(new Date().getFullYear());

  // Mobile menu
  const mnav = $("#mnav");
  $("#hamburger").addEventListener("click", () => {
    const open = !mnav.hasAttribute("hidden");
    if (open) mnav.setAttribute("hidden", "");
    else mnav.removeAttribute("hidden");
  });
  // Close mobile nav on click
  mnav.addEventListener("click", (e) => {
    if (e.target && e.target.tagName === "A") mnav.setAttribute("hidden", "");
  });

  // Quotes
  let quotesCache = [];
  loadQuotes().then(qs => {
    quotesCache = qs;
    applyQuote(pickRandom(quotesCache));
  });
  $("#newQuoteBtn").addEventListener("click", () => {
    if (quotesCache.length) applyQuote(pickRandom(quotesCache));
  });

  // Atlas terminal
  const out = $("#atlasOut");
  const input = $("#atlasInput");
  $("#atlasRunBtn").addEventListener("click", () => {
    const q = input.value.trim();
    if (!q) return;
    runAtlas(q, out);
    input.value = "";
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#atlasRunBtn").click();
  });

  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.dataset.q || btn.textContent.trim();
      runAtlas(q, out);
    });
  });

  $("#clearOut").addEventListener("click", () => {
    out.innerHTML = "";
    addLine(out, "ATLAS ready. Awaiting command.", "out__muted");
  });

  // TTS toggle (both buttons mirror)
  const ttsBtn = $("#ttsToggle");
  const ttsBtn2 = $("#ttsToggle2");
  const toggle = () => {
    const next = !state.ttsOn;
    setTTS(ttsBtn, next);
    setTTS(ttsBtn2, next);
    if (next) speak("Voice engaged. Command when ready.");
  };
  ttsBtn.addEventListener("click", toggle);
  ttsBtn2.addEventListener("click", toggle);

  // Engage ATLAS button
  $("#engageBtn").addEventListener("click", () => {
    openDrawer();
    addLine($("#drawerOut"), `[${nowTime()}] Engage request received.`, "out__brand");
    thinkingSequence($("#drawerOut"), "ATLAS engaged. State your objective.");
  });

  // Drawer open/close
  $("#atlasOpenBtn").addEventListener("click", openDrawer);
  $("#atlasOpenBtn2").addEventListener("click", openDrawer);
  $("#atlasCloseBtn").addEventListener("click", closeDrawer);
  $("#drawerBackdrop").addEventListener("click", closeDrawer);

  $("#engageDrawer").addEventListener("click", () => {
    const el = $("#drawerOut");
    addLine(el, `[${nowTime()}] Command mode activated.`, "out__ok");
    speak("Command mode activated.");
  });

  $("#runDrawerDemo").addEventListener("click", () => {
    const el = $("#drawerOut");
    addLine(el, `❯ Run demo overview`, "out__ok");
    thinkingSequence(el,
      [
        "Operational summary:",
        "• Marketplace: Modules + Deploy panel",
        "• Demos: redacted previews",
        "• Voice: manual-only",
        "• Next: wire payments + licenses + downloads",
      ].join("\n")
    );
  });

  // Marketplace demo interactions
  document.querySelectorAll("[data-demo]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.demo;
      runAtlas(`Show demo for module: ${key}`, out);
    });
  });

  document.querySelectorAll("[data-deploy]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.deploy;
      selectModule(key);
      // subtle nudge to ATLAS output
      runAtlas(`Recommend usage steps for module: ${key}`, out);
      location.hash = "#modules";
    });
  });

  document.querySelectorAll(".seg__btn").forEach(btn => {
    btn.addEventListener("click", () => setLicense(btn));
  });

  $("#applyCoupon").addEventListener("click", applyCoupon);

  $("#deployNow").addEventListener("click", () => {
    const el = $("#atlasOut");
    addLine(el, `❯ Deploy initiated (mock)`, "out__warn");
    thinkingSequence(el,
      [
        "Mock deploy only (no payments wired yet).",
        `Selected: ${$("#selectedModule").textContent}`,
        `License: ${state.license}`,
        `Total: ${$("#total").textContent}`,
        "Next step: connect Stripe + Cloudflare Functions for real checkout and license delivery.",
      ].join("\n")
    );
  });

  // Donate link placeholder
  // Replace with your real link later:
  // $("#donateLink").href = "https://buymeacoffee.com/yourname";
  $("#donateLink").addEventListener("click", (e) => {
    if ($("#donateLink").getAttribute("href") === "#") {
      e.preventDefault();
      runAtlas("How do I set up the $1 donate link?", out);
      addLine(out, "Tip: set #donateLink href to your BuyMeACoffee / Ko-fi / Stripe payment link.", "out__muted");
    }
  });

  // Init scan
  initSystemScan();
}

function openDrawer() {
  $("#drawer").removeAttribute("hidden");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  $("#drawer").setAttribute("hidden", "");
  document.body.style.overflow = "";
}

wireUI();

// (patched) removed duplicate ATLAS VOICE ENGINE tail
