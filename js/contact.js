/* global atlasTrack */
const notes = [
  "Atlas is prioritizing platform stability and ecosystem depth first.",
  "Builder-focused inquiries are treated as the strongest signal.",
  "Marketplace, services, and live AI culture are being tied together intentionally.",
  "Future seller and profile layers will connect more tightly over time.",
  "The current phase is foundation first, polish second, expansion third."
];

function rand(list){
  return list[Math.floor(Math.random() * list.length)];
}

function addNote(){
  const feed = document.getElementById("contactActivityFeed");
  if (!feed) return;
  const row = document.createElement("div");
  row.className = "profile-activity-item";
  row.innerHTML = `
    <strong>Atlas Signal</strong>
    <span>${rand(notes)}</span>
  `;
  feed.prepend(row);

  while(feed.children.length > 6){
    feed.removeChild(feed.lastChild);
  }
}

function refreshStats(){
  const supportEl = document.getElementById("contactSupportState");
  const responseEl = document.getElementById("contactResponseFlow");
  const priorityEl = document.getElementById("contactPriority");
  if (supportEl) supportEl.textContent = rand(["Open","Live","Active","Ready"]);
  if (responseEl) responseEl.textContent = rand(["Active","Steady","Moving","Focused"]);
  if (priorityEl) priorityEl.textContent = rand(["Builders","Partners","Sellers","Operators"]);
}

/**
 * Contact form submission handler.
 * Posts form data as JSON to ATLAS_WEBHOOK_URL if defined, otherwise silently
 * succeeds and shows the confirmation UI.  No external service is required.
 */
function initContactForm() {
  const form = document.getElementById("atlasContactForm");
  if (!form) return;

  const btn = document.getElementById("contactSendBtn");
  const confirmEl = document.getElementById("contactConfirm");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const payload = {
      name:    document.getElementById("contactName").value.trim(),
      contact: document.getElementById("contactEmail").value.trim(),
      subject: document.getElementById("contactSubject").value.trim(),
      type:    document.getElementById("contactType").value,
      message: document.getElementById("contactMessage").value.trim(),
      ts:      new Date().toISOString()
    };

    if (!payload.name || !payload.message) {
      const errEl = document.getElementById("contactConfirm");
      if (errEl) {
        errEl.style.display = "block";
        errEl.style.background = "rgba(255,111,141,.10)";
        errEl.style.borderColor = "rgba(255,111,141,.25)";
        errEl.style.color = "var(--red)";
        errEl.textContent = "Please fill in your name and message before sending.";
        setTimeout(() => {
          errEl.style.display = "none";
          errEl.removeAttribute("style");
        }, 4000);
      }
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

    /* Optional webhook — set window.ATLAS_WEBHOOK_URL before this script loads */
    const webhookUrl = typeof window.ATLAS_WEBHOOK_URL === "string" ? window.ATLAS_WEBHOOK_URL : null;

    const finish = function(success) {
      if (btn) { btn.disabled = false; btn.textContent = "Send Signal"; }
      if (confirmEl) { confirmEl.removeAttribute("style"); confirmEl.style.display = "block"; }
      form.reset();
      if (typeof atlasTrack === "function") {
        atlasTrack(success ? "contact_submit_success" : "contact_submit_error", payload.type);
      }
    };

    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(() => finish(true)).catch(() => finish(false));
    } else {
      finish(true);
    }
  });

  const clearBtn = document.getElementById("contactClearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", function() {
      form.reset();
      if (confirmEl) confirmEl.style.display = "none";
    });
  }
}

for(let i = 0; i < 4; i++) addNote();
refreshStats();
setInterval(addNote, 5800);
setInterval(refreshStats, 7200);
initContactForm();
