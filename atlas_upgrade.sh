#!/data/data/com.termux/files/usr/bin/bash
set -e

mkdir -p assets data

# ---------- index.html ----------
cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark" />

  <title>Forge Atlas — Forged From Nothing. Deployed Everywhere.</title>
  <meta name="description" content="A modular marketplace for builders — dev toolkits, automation packs, and systems you can deploy fast. Powered by ATLAS." />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="style.css" />
</head>

<body>
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="bg-glow" aria-hidden="true"></div>

  <header class="topbar">
    <a class="brand" href="/">
      <span class="brand-badge">FA</span>
      <span class="brand-title">Forge Atlas</span>
      <span class="brand-sub">Architect of Tactical Logic & Advanced Systems</span>
    </a>

    <nav class="nav" aria-label="Primary">
      <a href="#modules">Modules</a>
      <a href="#how">How it works</a>
      <a href="#trust">Trust</a>
      <a href="#faq">FAQ</a>
    </nav>

    <div class="topbar-right">
      <div class="atlas-pill" id="atlasPill" title="ATLAS status">
        <span class="dot" aria-hidden="true"></span>
        <span id="atlasPillText">ATLAS: ONLINE</span>
      </div>
      <button class="btn ghost" id="atlasOpenBtn" type="button" aria-haspopup="dialog" aria-controls="atlasPanel">
        Engage ATLAS
      </button>
    </div>
  </header>

  <main class="shell">
    <section class="hero">
      <div class="hero-left">
        <div class="kicker">
          <span class="chip">FORGE</span>
          <span class="sep">•</span>
          <span class="muted">SPARTAN ACCENT:</span>
          <span class="accent">EMBER</span>
        </div>

        <h1 class="headline">
          Forged From Nothing.<br />
          Deployed Everywhere.
        </h1>

        <p class="lede">
          A modular marketplace for builders — dev toolkits, automation packs, and systems you can deploy fast.
          Powered by <strong>ATLAS</strong> — tactical guidance, demos, and diagnostics on demand.
        </p>

        <div class="cta">
          <a class="btn primary" href="#modules">Explore Modules</a>
          <button class="btn" id="atlasOpenBtn2" type="button">Engage ATLAS</button>
        </div>

        <div class="scan card">
          <div class="scan-head">
            <div class="scan-title">ATLAS SYSTEM SCAN</div>
            <div class="scan-status" id="scanStatus">Stable</div>
          </div>
          <div class="scan-body">
            <div class="scan-row">
              <span class="label">Connection</span>
              <span class="value" id="connValue">Checking…</span>
            </div>
            <div class="scan-row">
              <span class="label">Latency</span>
              <span class="value" id="latencyValue">—</span>
            </div>
            <div class="scan-row">
              <span class="label">Assets</span>
              <span class="value" id="assetsValue">—</span>
            </div>
            <div class="scan-row">
              <span class="label">Viewport</span>
              <span class="value" id="viewportValue">—</span>
            </div>
          </div>

          <div class="broadcast">
            <div class="broadcast-title">ATLAS BROADCAST</div>
            <div class="broadcast-quote" id="quoteText">Loading inspiration…</div>
            <button class="btn tiny" id="newQuoteBtn" type="button">New</button>
          </div>
        </div>

        <div class="fineprint">
          Built on an Android. Still shipping like a war room. ✅
        </div>
      </div>

      <div class="hero-right card">
        <div class="panel-title">What ATLAS does</div>
        <ul class="bullets">
          <li><strong>Watchdog:</strong> scans assets + links for failures.</li>
          <li><strong>Diagnostics:</strong> connection, latency, viewport, device hints.</li>
          <li><strong>Command Console:</strong> tactical commands + quick actions.</li>
          <li><strong>Voice:</strong> optional TTS output (hands-free mode).</li>
        </ul>

        <div class="hint">
          Try opening ATLAS and typing:
          <code>/scan</code>, <code>/quote</code>, <code>/help</code>, <code>/theme ember</code>
        </div>
      </div>
    </section>

    <section id="modules" class="section card">
      <h2>Modules</h2>
      <p class="muted">Coming online. ATLAS will power previews + demos + diagnostics per module.</p>
      <div class="module-grid">
        <div class="module">
          <div class="module-top">
            <div class="module-name">CoreOps Starter</div>
            <div class="tag">Toolkit</div>
          </div>
          <div class="module-desc">Reusable scripts + patterns for bootstrapping ops on any stack.</div>
          <button class="btn tiny" data-atlas="demo coreops">Ask ATLAS</button>
        </div>

        <div class="module">
          <div class="module-top">
            <div class="module-name">AutoDeploy Pack</div>
            <div class="tag">Automation</div>
          </div>
          <div class="module-desc">Drop-in automation recipes: build, release, verify, notify.</div>
          <button class="btn tiny" data-atlas="demo autodeploy">Ask ATLAS</button>
        </div>

        <div class="module">
          <div class="module-top">
            <div class="module-name">Secure Baseline</div>
            <div class="tag">Hardening</div>
          </div>
          <div class="module-desc">Practical baseline checks and guardrails for safer defaults.</div>
          <button class="btn tiny" data-atlas="demo secure">Ask ATLAS</button>
        </div>
      </div>
    </section>

    <section id="how" class="section card">
      <h2>How it works</h2>
      <ol class="steps">
        <li><strong>Browse modules</strong> → pick a toolkit.</li>
        <li><strong>Run a demo</strong> → ATLAS shows how it behaves.</li>
        <li><strong>Deploy fast</strong> → verify with ATLAS scans.</li>
      </ol>
    </section>

    <section id="trust" class="section card">
      <h2>Trust</h2>
      <p class="muted">
        ATLAS shows what it can verify in-browser (connectivity, asset health, basic environment signals).
        No creepy tracking — just practical diagnostics.
      </p>
    </section>

    <section id="faq" class="section card">
      <h2>FAQ</h2>
      <details>
        <summary>Is this really built on Android?</summary>
        <p>Yes. Termux + GitHub + Cloudflare Pages. The forge doesn’t care what you hold — only what you ship.</p>
      </details>
      <details>
        <summary>Will ATLAS become “real” AI?</summary>
        <p>That’s the roadmap: demos, module guidance, and eventually agent-assisted generation (with guardrails).</p>
      </details>
    </section>

    <footer class="footer">
      <div class="muted">© <span id="year"></span> Forge Atlas. Built Different.</div>
      <a class="muted" id="donateLink" href="#" target="_blank" rel="noreferrer">Donate $1 (fuel)</a>
    </footer>
  </main>

  <!-- ATLAS Panel -->
  <div class="atlas-fab">
    <button class="fab" id="atlasFabBtn" type="button" aria-label="Open ATLAS">
      <span class="fab-dot" aria-hidden="true"></span>
      ATLAS
    </button>
  </div>

  <div class="atlas-overlay" id="atlasOverlay" hidden></div>

  <section class="atlas-panel" id="atlasPanel" role="dialog" aria-modal="true" aria-labelledby="atlasTitle" hidden>
    <header class="atlas-head">
      <div class="atlas-head-left">
        <div class="atlas-title" id="atlasTitle">ATLAS Console</div>
        <div class="atlas-sub" id="atlasSub">Guardian mode: active</div>
      </div>

      <div class="atlas-head-right">
        <button class="btn tiny" id="atlasVoiceBtn" type="button" aria-pressed="false" title="Toggle voice output">
          Voice: OFF
        </button>
        <button class="btn tiny ghost" id="atlasCloseBtn" type="button">Close</button>
      </div>
    </header>

    <div class="atlas-body">
      <div class="atlas-feed" id="atlasFeed" aria-live="polite"></div>

      <div class="atlas-quick">
        <button class="chip-btn" data-cmd="/scan">/scan</button>
        <button class="chip-btn" data-cmd="/quote">/quote</button>
        <button class="chip-btn" data-cmd="/help">/help</button>
        <button class="chip-btn" data-cmd="/theme ember">/theme ember</button>
        <button class="chip-btn" data-cmd="/theme ice">/theme ice</button>
      </div>

      <form class="atlas-input" id="atlasForm">
        <input
          id="atlasInput"
          type="text"
          autocomplete="off"
          spellcheck="false"
          placeholder="Type a command… (/help)"
          aria-label="ATLAS command input"
        />
        <button class="btn primary" type="submit">Execute</button>
      </form>

      <div class="atlas-meta">
        <div class="meta-row"><span class="k">Mode</span><span class="v" id="metaMode">EMBER</span></div>
        <div class="meta-row"><span class="k">Online</span><span class="v" id="metaOnline">—</span></div>
        <div class="meta-row"><span class="k">Last Scan</span><span class="v" id="metaLastScan">—</span></div>
      </div>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>
HTML

# ---------- style.css ----------
cat > style.css <<'CSS'
:root{
  --bg:#070b12;
  --panel:#0b1020;
  --panel2:#0a1328;
  --text:#e8eefc;
  --muted:#a8b3cf;
  --line:rgba(255,255,255,.10);
  --line2:rgba(255,255,255,.06);

  --accent:#39c6ff;
  --accent2:#a855f7;
  --ember1:#ff7a18;
  --ember2:#ff3d81;
  --ice1:#39c6ff;
  --ice2:#a855f7;

  --shadow: 0 20px 70px rgba(0,0,0,.55);
  --radius: 18px;
  --radius2: 14px;
  --ring: 0 0 0 2px rgba(57,198,255,.22);
  --font: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family:var(--font);
  color:var(--text);
  background: radial-gradient(1200px 600px at 20% 10%, rgba(57,198,255,.15), transparent 60%),
              radial-gradient(900px 500px at 80% 30%, rgba(168,85,247,.12), transparent 55%),
              linear-gradient(180deg, #05070d 0%, #070b12 45%, #070b12 100%);
  overflow-x:hidden;
}

.bg-grid{
  position:fixed; inset:0;
  background:
    linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px) 0 0/56px 56px,
    linear-gradient(to bottom, rgba(255,255,255,.03) 1px, transparent 1px) 0 0/56px 56px;
  mask-image: radial-gradient(700px 480px at 45% 40%, rgba(0,0,0,1), transparent 70%);
  pointer-events:none;
  opacity:.55;
}
.bg-glow{
  position:fixed; inset:-200px;
  background: radial-gradient(400px 240px at 55% 25%, rgba(255,122,24,.10), transparent 60%),
              radial-gradient(520px 280px at 30% 60%, rgba(57,198,255,.10), transparent 60%);
  filter: blur(20px);
  pointer-events:none;
  opacity:.7;
}

a{color:inherit; text-decoration:none}
a:hover{opacity:.92}

.shell{
  max-width:1100px;
  margin:0 auto;
  padding: 26px 18px 90px;
}

.topbar{
  position:sticky; top:0; z-index:50;
  backdrop-filter: blur(14px);
  background: rgba(6,10,18,.55);
  border-bottom: 1px solid var(--line2);
  display:flex;
  gap:16px;
  align-items:center;
  justify-content:space-between;
  padding: 14px 16px;
}

.brand{display:flex; align-items:center; gap:10px; min-width: 260px}
.brand-badge{
  width:34px; height:34px; display:grid; place-items:center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(57,198,255,.22), rgba(168,85,247,.18));
  border:1px solid var(--line);
  font-weight:800;
  letter-spacing:.5px;
}
.brand-title{font-weight:800}
.brand-sub{display:none; color:var(--muted); font-size:12px}

.nav{
  display:none;
  gap:14px;
  align-items:center;
}
.nav a{
  color: var(--muted);
  font-weight: 600;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid transparent;
}
.nav a:hover{
  color: var(--text);
  border-color: var(--line);
  box-shadow: var(--ring);
}

.topbar-right{display:flex; align-items:center; gap:10px}
.atlas-pill{
  display:flex; align-items:center; gap:8px;
  padding: 8px 10px;
  border-radius: 999px;
  border:1px solid var(--line);
  background: rgba(11,16,32,.55);
  font-weight:700;
  font-size: 12px;
  letter-spacing:.4px;
}
.atlas-pill .dot{
  width:10px; height:10px; border-radius:999px;
  background: #42ff88;
  box-shadow: 0 0 0 6px rgba(66,255,136,.12);
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse{
  0%,100%{transform:scale(1); opacity:1}
  50%{transform:scale(1.12); opacity:.75}
}

.btn{
  appearance:none;
  border: 1px solid var(--line);
  background: rgba(11,16,32,.55);
  color: var(--text);
  padding: 10px 14px;
  border-radius: 14px;
  cursor:pointer;
  font-weight: 700;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
}
.btn:hover{transform: translateY(-1px); box-shadow: var(--ring)}
.btn:active{transform: translateY(0)}
.btn.primary{
  border-color: rgba(57,198,255,.45);
  background: linear-gradient(135deg, rgba(57,198,255,.22), rgba(168,85,247,.20));
}
.btn.ghost{
  background: transparent;
}
.btn.tiny{padding: 7px 10px; border-radius: 12px; font-size: 12px}

.card{
  background: linear-gradient(180deg, rgba(11,16,32,.72), rgba(8,12,22,.62));
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.hero{
  display:grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 18px;
  margin-top: 18px;
}

.hero-left{min-width: 0}

.kicker{
  display:flex; align-items:center; gap:8px;
  color: var(--muted);
  font-weight: 700;
  letter-spacing: .35px;
  font-size: 12px;
}
.chip{
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(11,16,32,.55);
  color: var(--text);
}
.sep{opacity:.65}
.accent{
  color: #ffd0a8;
  text-shadow: 0 0 18px rgba(255,122,24,.25);
}

.headline{
  font-size: clamp(40px, 6vw, 68px);
  line-height: 1.02;
  margin: 16px 0 10px;
  letter-spacing: -1px;
}
.lede{
  color: var(--muted);
  font-size: 16px;
  line-height: 1.65;
  margin: 0 0 16px;
  max-width: 62ch;
}
.cta{display:flex; gap:10px; flex-wrap:wrap; margin: 12px 0 16px}

.scan{
  padding: 16px;
  margin-top: 14px;
}
.scan-head{
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom: 10px;
}
.scan-title{font-weight: 800; letter-spacing:.5px; font-size: 12px}
.scan-status{
  font-weight: 800;
  font-size: 12px;
  color:#42ff88;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(66,255,136,.25);
  background: rgba(66,255,136,.08);
}
.scan-body{display:grid; gap:8px}
.scan-row{
  display:flex; justify-content:space-between; gap:10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--line2);
  background: rgba(0,0,0,.15);
}
.label{color: var(--muted); font-weight: 700; font-size: 13px}
.value{font-weight: 800; font-size: 13px}

.broadcast{
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--line2);
  display:grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items:center;
}
.broadcast-title{font-weight: 900; font-size: 12px; letter-spacing:.5px; color: var(--muted)}
.broadcast-quote{grid-column: 1/2; color: var(--text); font-weight: 700}
.fineprint{margin-top: 10px; color: var(--muted); font-size: 12px}

.hero-right{padding: 16px}
.panel-title{font-weight: 900; letter-spacing:.4px; margin-bottom: 10px}
.bullets{margin: 0; padding-left: 18px; color: var(--muted); line-height: 1.7}
.hint{
  margin-top: 14px;
  border-top: 1px solid var(--line2);
  padding-top: 12px;
  color: var(--muted);
}
.hint code{
  color: var(--text);
  background: rgba(255,255,255,.06);
  border: 1px solid var(--line2);
  padding: 2px 8px;
  border-radius: 10px;
}

.section{margin-top: 16px; padding: 16px}
.section h2{margin:0 0 8px}
.muted{color: var(--muted)}
.steps{color: var(--muted); line-height:1.8}
.module-grid{
  margin-top: 12px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.module{
  padding: 14px;
  border: 1px solid var(--line2);
  border-radius: 16px;
  background: rgba(0,0,0,.15);
}
.module-top{display:flex; justify-content:space-between; align-items:center; gap:10px}
.module-name{font-weight: 900}
.tag{
  font-size: 12px;
  font-weight: 900;
  color: var(--text);
  border: 1px solid var(--line);
  background: rgba(57,198,255,.10);
  padding: 4px 10px;
  border-radius: 999px;
}
.module-desc{color: var(--muted); margin: 10px 0 12px; line-height: 1.6}

.footer{
  margin-top: 20px;
  display:flex;
  justify-content:space-between;
  gap: 12px;
  padding: 10px 2px;
}

.atlas-fab{
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 60;
}
.fab{
  border: 1px solid rgba(57,198,255,.45);
  background: linear-gradient(135deg, rgba(57,198,255,.22), rgba(168,85,247,.22));
  color: var(--text);
  font-weight: 900;
  letter-spacing: .4px;
  padding: 12px 14px;
  border-radius: 16px;
  cursor:pointer;
  box-shadow: var(--shadow);
  display:flex;
  align-items:center;
  gap:10px;
}
.fab-dot{
  width:10px; height:10px; border-radius:999px;
  background:#42ff88;
  box-shadow: 0 0 0 6px rgba(66,255,136,.10);
}

.atlas-overlay{
  position: fixed; inset:0; z-index: 70;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(6px);
}

.atlas-panel{
  position: fixed;
  right: 16px;
  bottom: 86px;
  width: min(520px, calc(100vw - 32px));
  max-height: min(74vh, 680px);
  z-index: 80;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(57,198,255,.25);
  background: linear-gradient(180deg, rgba(11,16,32,.92), rgba(8,12,22,.92));
  box-shadow: var(--shadow);
}
.atlas-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  padding: 12px 12px;
  border-bottom: 1px solid var(--line2);
}
.atlas-title{font-weight: 900}
.atlas-sub{color: var(--muted); font-size: 12px; font-weight: 700}
.atlas-head-right{display:flex; gap: 8px; align-items:center}

.atlas-body{
  display:flex;
  flex-direction:column;
  gap: 10px;
  padding: 12px;
}
.atlas-feed{
  border: 1px solid var(--line2);
  background: rgba(0,0,0,.18);
  border-radius: 16px;
  padding: 10px;
  overflow:auto;
  max-height: 38vh;
}
.msg{
  display:grid;
  gap: 4px;
  padding: 10px 10px;
  border-radius: 14px;
  border: 1px solid transparent;
}
.msg + .msg{margin-top: 8px}
.msg.user{
  border-color: rgba(255,255,255,.08);
  background: rgba(255,255,255,.04);
}
.msg.atlas{
  border-color: rgba(57,198,255,.15);
  background: rgba(57,198,255,.07);
}
.msg .who{
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .4px;
  color: var(--muted);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
}
.msg .body{font-weight: 650; line-height: 1.55}
.badge{
  font-size: 11px;
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(0,0,0,.12);
  color: var(--text);
}
.thinking{
  display:inline-flex;
  gap: 6px;
  align-items:center;
}
.dotty{
  width:7px; height:7px; border-radius: 999px;
  background: rgba(57,198,255,.8);
  animation: bounce 1s ease-in-out infinite;
}
.dotty:nth-child(2){animation-delay:.15s}
.dotty:nth-child(3){animation-delay:.3s}
@keyframes bounce{
  0%,100%{transform: translateY(0); opacity:.55}
  50%{transform: translateY(-4px); opacity:1}
}

.atlas-quick{
  display:flex;
  flex-wrap:wrap;
  gap: 8px;
}
.chip-btn{
  border: 1px solid var(--line2);
  background: rgba(0,0,0,.15);
  color: var(--text);
  font-weight: 900;
  padding: 8px 10px;
  border-radius: 999px;
  cursor:pointer;
}
.chip-btn:hover{box-shadow: var(--ring)}

.atlas-input{
  display:flex;
  gap: 10px;
}
.atlas-input input{
  flex: 1;
  border-radius: 14px;
  border: 1px solid var(--line2);
  background: rgba(0,0,0,.18);
  color: var(--text);
  font-weight: 800;
  padding: 12px 12px;
  outline:none;
}
.atlas-input input:focus{box-shadow: var(--ring); border-color: rgba(57,198,255,.28)}

.atlas-meta{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.meta-row{
  border: 1px solid var(--line2);
  border-radius: 14px;
  background: rgba(0,0,0,.14);
  padding: 10px;
  display:flex;
  justify-content:space-between;
  gap:10px;
}
.meta-row .k{color: var(--muted); font-weight: 900; font-size: 12px}
.meta-row .v{font-weight: 900; font-size: 12px}

@media (min-width: 860px){
  .nav{display:flex}
  .brand-sub{display:inline}
}

@media (max-width: 900px){
  .hero{grid-template-columns: 1fr}
  .module-grid{grid-template-columns: 1fr}
  .atlas-meta{grid-template-columns: 1fr}
}
CSS

# ---------- script.js ----------
cat > script.js <<'JS'
/* Forge Atlas — ATLAS Console (static, no backend)
   - Watchdog scans asset/link health
   - Diagnostics (online/latency/viewport)
   - Command console + optional voice output (TTS)
*/

const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

const state = {
  theme: "EMBER",
  voiceEnabled: false,
  lastScan: null,
};

const QUOTES = [
  { t: "Discipline is choosing between what you want now and what you want most.", a: "Abraham Lincoln (attributed)" },
  { t: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", a: "Aristotle (paraphrase)" },
  { t: "The impediment to action advances action. What stands in the way becomes the way.", a: "Marcus Aurelius" },
  { t: "If you’re going through hell, keep going.", a: "Winston Churchill (attributed)" },
  { t: "Make it work. Make it right. Make it fast.", a: "Kent Beck" },
  { t: "Ship small. Learn fast. Repeat.", a: "Forge Atlas" },
];

function nowTime(){
  const d = new Date();
  return d.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
}

function setQuote(){
  const pick = QUOTES[Math.floor(Math.random()*QUOTES.length)];
  const el = $("#quoteText");
  if (!el) return;
  el.textContent = `${pick.t} — ${pick.a}`;
}

function setYear(){
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function setDonate(){
  const d = $("#donateLink");
  if (!d) return;
  // TODO: put your real link here when ready
  d.href = "https://buymeacoffee.com/";
}

function setViewport(){
  const v = $("#viewportValue");
  if (!v) return;
  v.textContent = `${window.innerWidth}×${window.innerHeight}`;
}

function setOnlineUI(){
  const online = navigator.onLine;
  const connValue = $("#connValue");
  const metaOnline = $("#metaOnline");
  const scanStatus = $("#scanStatus");

  if (connValue) connValue.textContent = online ? "Online" : "Offline";
  if (metaOnline) metaOnline.textContent = online ? "Yes" : "No";

  if (scanStatus){
    scanStatus.textContent = online ? "Stable" : "Degraded";
    scanStatus.style.color = online ? "#42ff88" : "#ffcc66";
    scanStatus.style.borderColor = online ? "rgba(66,255,136,.25)" : "rgba(255,204,102,.30)";
    scanStatus.style.background = online ? "rgba(66,255,136,.08)" : "rgba(255,204,102,.10)";
  }

  const pill = $("#atlasPill");
  const pillText = $("#atlasPillText");
  if (pillText) pillText.textContent = online ? "ATLAS: ONLINE" : "ATLAS: DEGRADED";
  if (pill){
    const dot = pill.querySelector(".dot");
    if (dot){
      dot.style.background = online ? "#42ff88" : "#ffcc66";
      dot.style.boxShadow = online ? "0 0 0 6px rgba(66,255,136,.12)" : "0 0 0 6px rgba(255,204,102,.12)";
    }
  }
}

async function measureLatency(){
  const el = $("#latencyValue");
  if (!el) return;

  if (!navigator.onLine){
    el.textContent = "Offline";
    return;
  }

  // lightweight: ping the current origin with a HEAD request + cache-buster
  const url = `${location.origin}/?atlas_ping=${Date.now()}`;
  const t0 = performance.now();
  try{
    const r = await fetch(url, { method:"HEAD", cache:"no-store" });
    const t1 = performance.now();
    const ms = Math.round(t1 - t0);
    el.textContent = r.ok ? `${ms} ms` : `Err (${r.status})`;
  }catch(e){
    el.textContent = "Err";
  }
}

function feedAdd(who, text, badge){
  const feed = $("#atlasFeed");
  if (!feed) return;

  const msg = document.createElement("div");
  msg.className = `msg ${who === "USER" ? "user" : "atlas"}`;

  const top = document.createElement("div");
  top.className = "who";
  top.innerHTML = `<span>${who}</span><span class="badge">${badge || nowTime()}</span>`;

  const body = document.createElement("div");
  body.className = "body";
  body.textContent = text;

  msg.appendChild(top);
  msg.appendChild(body);

  feed.appendChild(msg);
  feed.scrollTop = feed.scrollHeight;
}

function feedThinking(){
  const feed = $("#atlasFeed");
  if (!feed) return null;

  const msg = document.createElement("div");
  msg.className = "msg atlas";

  const top = document.createElement("div");
  top.className = "who";
  top.innerHTML = `<span>ATLAS</span><span class="badge">Processing</span>`;

  const body = document.createElement("div");
  body.className = "body";

  const wrap = document.createElement("span");
  wrap.className = "thinking";
  wrap.innerHTML = `<span class="dotty"></span><span class="dotty"></span><span class="dotty"></span><span style="margin-left:8px;color:var(--muted);font-weight:800">Thinking…</span>`;

  body.appendChild(wrap);
  msg.appendChild(top);
  msg.appendChild(body);

  feed.appendChild(msg);
  feed.scrollTop = feed.scrollHeight;

  return msg;
}

function speak(text){
  if (!state.voiceEnabled) return;
  if (!("speechSynthesis" in window)) return;

  // Cancel previous speech to avoid stacking
  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  // “Kratos-ish” approximation: lower pitch + slightly slower
  u.rate = 0.92;
  u.pitch = 0.70;
  u.volume = 1;

  // Try to pick a deeper English voice if available
  const voices = window.speechSynthesis.getVoices?.() || [];
  const preferred = voices.find(v =>
    /en/i.test(v.lang) && /male|man|english|us|uk|daniel|fred|alex/i.test(v.name)
  ) || voices.find(v => /en/i.test(v.lang)) || null;

  if (preferred) u.voice = preferred;

  window.speechSynthesis.speak(u);
}

function atlasReply(text, badge){
  feedAdd("ATLAS", text, badge);
  speak(text);
}

function setTheme(mode){
  state.theme = mode;
  const metaMode = $("#metaMode");
  if (metaMode) metaMode.textContent = mode;

  // Visual hint only (future: theme tokens)
  const sub = $("#atlasSub");
  if (sub) sub.textContent = `Guardian mode: active • ${mode}`;
}

function parseCmd(raw){
  const s = raw.trim();
  if (!s) return { type:"EMPTY" };

  if (s.startsWith("/")){
    const parts = s.slice(1).split(/\s+/);
    return { type:"CMD", name: parts[0].toLowerCase(), args: parts.slice(1) };
  }
  return { type:"CHAT", text: s };
}

function helpText(){
  return [
    "Commands:",
    "/help — show commands",
    "/scan — run watchdog scan (assets + links + basic telemetry)",
    "/quote — new inspiration broadcast",
    "/ping — measure latency",
    "/theme ember|ice — swap ATLAS mode",
    "/status — show quick system summary",
    "",
    "Tip: Click the quick chips under the feed."
  ].join("\n");
}

async function watchdogScan(){
  // Asset scan: images, stylesheets, scripts + same-origin links in page sections
  const assets = new Set();

  // scripts + styles
  $$("script[src]").forEach(s => assets.add(new URL(s.src, location.href).href));
  $$('link[rel="stylesheet"][href]').forEach(l => assets.add(new URL(l.href, location.href).href));
  $$("img[src]").forEach(i => assets.add(new URL(i.src, location.href).href));

  // Also scan a few known files we rely on
  ["index.html","style.css","script.js","assets/favicon.svg"].forEach(p => assets.add(new URL(p, location.href).href));

  // Link scan (same-origin)
  const links = $$("a[href]")
    .map(a => a.getAttribute("href") || "")
    .filter(h => h && !h.startsWith("mailto:") && !h.startsWith("tel:") && !h.startsWith("http"))
    .map(h => new URL(h, location.href).href);

  const targets = [...assets, ...links];
  let ok = 0;
  let bad = 0;

  const failures = [];

  // Concurrency limiter
  const limit = 8;
  let i = 0;

  async function worker(){
    while (i < targets.length){
      const idx = i++;
      const url = targets[idx];

      try{
        const r = await fetch(url, { method: "HEAD", cache: "no-store" });
        if (r.ok) ok++;
        else { bad++; failures.push(`${r.status} ${url}`); }
      }catch(e){
        bad++; failures.push(`ERR ${url}`);
      }
    }
  }

  const workers = Array.from({length: Math.min(limit, targets.length)}, () => worker());
  await Promise.all(workers);

  const assetsValue = $("#assetsValue");
  if (assetsValue) assetsValue.textContent = `${ok} ok • ${bad} issues`;

  state.lastScan = new Date();
  const metaLast = $("#metaLastScan");
  if (metaLast) metaLast.textContent = state.lastScan.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});

  return { ok, bad, failures };
}

async function atlasExecute(raw){
  const cmd = parseCmd(raw);

  if (cmd.type === "EMPTY") return;

  if (cmd.type === "CHAT"){
    // No backend yet: respond like a tactical assistant
    const t = cmd.text.toLowerCase();
    let reply =
      "Acknowledged. I can run /scan, /ping, fetch /quote, or guide you through modules. Type /help.";
    if (t.includes("coupon")) reply = "Coupons will live in the marketplace layer. For now, I can scaffold the UI + data model.";
    if (t.includes("buy") || t.includes("checkout")) reply = "Checkout is a next step. We can wire Stripe later, but first we build the modules + cart foundation.";
    if (t.includes("security")) reply = "We’ll keep it practical: safe defaults, diagnostics, and guardrails. No reckless tooling.";
    atlasReply(reply);
    return;
  }

  const name = cmd.name;
  const args = cmd.args;

  if (name === "help"){
    atlasReply(helpText(), "Manual");
    return;
  }

  if (name === "quote"){
    setQuote();
    const txt = $("#quoteText")?.textContent || "Quote loaded.";
    atlasReply(`Broadcast updated: ${txt}`, "Broadcast");
    return;
  }

  if (name === "ping"){
    const thinking = feedThinking();
    await measureLatency();
    thinking?.remove();
    const val = $("#latencyValue")?.textContent || "—";
    atlasReply(`Latency check: ${val}`, "Telemetry");
    return;
  }

  if (name === "theme"){
    const v = (args[0] || "").toLowerCase();
    if (v === "ember"){ setTheme("EMBER"); atlasReply("Mode set: EMBER. Heat controlled. Focus sharpened.", "Mode"); return; }
    if (v === "ice"){ setTheme("ICE"); atlasReply("Mode set: ICE. Calm precision. Cold execution.", "Mode"); return; }
    atlasReply("Usage: /theme ember  OR  /theme ice", "Mode");
    return;
  }

  if (name === "status"){
    const online = navigator.onLine ? "Yes" : "No";
    const vp = `${window.innerWidth}×${window.innerHeight}`;
    const lat = $("#latencyValue")?.textContent || "—";
    const assets = $("#assetsValue")?.textContent || "—";
    atlasReply(`Status:\nOnline: ${online}\nViewport: ${vp}\nLatency: ${lat}\nAssets: ${assets}`, "Status");
    return;
  }

  if (name === "scan"){
    const thinking = feedThinking();
    setViewport();
    setOnlineUI();
    await measureLatency();
    const res = await watchdogScan();
    thinking?.remove();

    if (res.bad === 0){
      atlasReply(`Scan complete. All clear.\n${res.ok} checks passed.`, "Watchdog");
    } else {
      atlasReply(`Scan complete. Issues detected: ${res.bad}\nUse the list below to hunt failures.`, "Watchdog");
      // print top failures (avoid wall of text)
      res.failures.slice(0, 8).forEach(f => atlasReply(f, "Issue"));
      if (res.failures.length > 8) atlasReply(`…and ${res.failures.length - 8} more.`, "Issue");
    }
    return;
  }

  atlasReply(`Unknown command: /${name}\nType /help`, "Error");
}

function openAtlas(){
  $("#atlasPanel")?.removeAttribute("hidden");
  $("#atlasOverlay")?.removeAttribute("hidden");
  $("#atlasInput")?.focus();

  // first-time greeting
  const feed = $("#atlasFeed");
  if (feed && feed.childElementCount === 0){
    atlasReply("I am ATLAS. Guardian mode active. Type /scan to verify the forge.", "Boot");
  }
}

function closeAtlas(){
  $("#atlasPanel")?.setAttribute("hidden", "true");
  $("#atlasOverlay")?.setAttribute("hidden", "true");
}

function wireAtlas(){
  const openers = ["#atlasOpenBtn", "#atlasOpenBtn2", "#atlasFabBtn"].map(id => $(id)).filter(Boolean);
  openers.forEach(btn => btn.addEventListener("click", openAtlas));
  $("#atlasCloseBtn")?.addEventListener("click", closeAtlas);
  $("#atlasOverlay")?.addEventListener("click", closeAtlas);

  // Quick chips
  $$(".chip-btn").forEach(b => b.addEventListener("click", () => {
    const c = b.getAttribute("data-cmd") || "";
    $("#atlasInput").value = c;
    $("#atlasForm").dispatchEvent(new Event("submit", {cancelable:true}));
  }));

  // Module "Ask ATLAS" buttons
  $$("[data-atlas]").forEach(b => b.addEventListener("click", () => {
    openAtlas();
    const cmd = b.getAttribute("data-atlas") || "";
    feedAdd("USER", cmd, "Quick");
    atlasExecute(cmd);
  }));

  // Input submit
  $("#atlasForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = $("#atlasInput");
    if (!inp) return;
    const raw = inp.value;
    inp.value = "";
    feedAdd("USER", raw, nowTime());
    atlasExecute(raw);
  });

  // Voice toggle
  $("#atlasVoiceBtn")?.addEventListener("click", () => {
    state.voiceEnabled = !state.voiceEnabled;
    const btn = $("#atlasVoiceBtn");
    if (btn){
      btn.setAttribute("aria-pressed", String(state.voiceEnabled));
      btn.textContent = state.voiceEnabled ? "Voice: ON" : "Voice: OFF";
    }
    atlasReply(state.voiceEnabled
      ? "Voice output enabled. I will speak concise responses."
      : "Voice output disabled."
    , "Audio");
  });

  // Ensure voices load on some browsers
  if ("speechSynthesis" in window){
    window.speechSynthesis.onvoiceschanged = () => { /* noop */ };
  }
}

function wireBasics(){
  $("#newQuoteBtn")?.addEventListener("click", setQuote);
  window.addEventListener("resize", setViewport);
  window.addEventListener("online", setOnlineUI);
  window.addEventListener("offline", setOnlineUI);
}

async function boot(){
  setYear();
  setDonate();
  setQuote();
  setViewport();
  setOnlineUI();

  // lightweight boot telemetry
  await measureLatency();
  $("#assetsValue").textContent = "Ready";
  $("#metaLastScan").textContent = "—";

  wireBasics();
  wireAtlas();

  // optional: run a silent scan after load (keeps it snappy)
  // await watchdogScan();

  // Keyboard shortcut: Ctrl+K or /
  window.addEventListener("keydown", (e) => {
    const key = e.key?.toLowerCase();
    if ((e.ctrlKey && key === "k") || (key === "/" && !/input|textarea/i.test((e.target?.tagName||"")))){
      e.preventDefault();
      openAtlas();
    }
    if (key === "escape"){
      closeAtlas();
    }
  });
}

boot();
JS

# ---------- favicon ----------
cat > assets/favicon.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#39c6ff" stop-opacity=".95"/>
      <stop offset="1" stop-color="#a855f7" stop-opacity=".9"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="#0b0f19"/>
  <path d="M28 92V36h26c22 0 36 12 36 28S76 92 54 92H28zm20-14h6c12 0 20-6 20-14s-8-14-20-14h-6v28z" fill="url(#g)"/>
</svg>
SVG

echo "ATLAS upgrade applied ✅"
echo "Next: git add . && git commit -m 'ATLAS console + watchdog' && git push"
