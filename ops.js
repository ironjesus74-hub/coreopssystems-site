// ATLAS Ops — fetch status feeds published to atlas-status branches
const REPOS = [
  "ironjesus74-hub/coreopssystems-site",
  "ironjesus74-hub/coreops-starter-kit",
];

function rawStatusUrl(repo) {
  const [owner, name] = repo.split("/");
  return `https://raw.githubusercontent.com/${owner}/${name}/atlas-status/ci/status.json`;
}

function pill(conclusion) {
  const ok = conclusion === "success";
  const el = document.createElement("span");
  el.className = "ops-pill " + (ok ? "ops-ok" : "ops-bad");
  el.textContent = conclusion || "unknown";
  return el;
}

async function loadRepo(repo) {
  const url = rawStatusUrl(repo);
  const card = document.createElement("div");
  card.className = "ops-card";

  const head = document.createElement("div");
  head.className = "ops-head";

  const title = document.createElement("div");
  title.className = "ops-title";
  title.textContent = repo;

  const meta = document.createElement("div");
  meta.className = "ops-meta";
  meta.textContent = "Loading…";

  head.appendChild(title);
  head.appendChild(meta);
  card.appendChild(head);

  const body = document.createElement("div");
  body.className = "ops-meta";
  body.style.marginTop = "10px";
  card.appendChild(body);

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    meta.textContent = `Updated: ${data.generated_at}`;

    const overall = data.overall?.conclusion || "unknown";
    head.appendChild(pill(overall));

    const wf = data.workflows || {};
    const lines = [];
    for (const [name, info] of Object.entries(wf)) {
      if (!info) { lines.push(`${name}: (not found)`); continue; }
      const c = info.conclusion || info.status || "unknown";
      const link = info.html_url ? ` — ${info.html_url}` : "";
      lines.push(`${name}: ${c}${link}`);
    }
    body.textContent = lines.join("\n");
    body.style.whiteSpace = "pre-wrap";
  } catch (e) {
    meta.textContent = `Status feed missing`;
    body.textContent = `Add ATLAS Status Feed workflow to this repo to publish:\n${url}`;
    body.style.whiteSpace = "pre-wrap";
  }

  return card;
}

(async function init() {
  const root = document.querySelector("#ops");
  for (const repo of REPOS) {
    root.appendChild(await loadRepo(repo));
  }
})();
