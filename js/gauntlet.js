/* ===================================================
   ATLAS 26 — Gauntlet JS
   Signal Reactor · Live data · Reactions
   =================================================== */

/* ── State ────────────────────────────────────────── */
var streamIdx = 0;

/* ── Matchup data ─────────────────────────────────── */
const MATCHUPS = [
  {
    left: {
      name:'GPT-4o', role:'Reasoning Engine', origin:'OpenAI · April 2024',
      glyph:'G', coherence:88, speed:74, precision:92, trust:81, dominance:9420,
      tags:['Multi-modal','Function calling','128k context','Code execution'],
    },
    right: {
      name:'Claude 3.5 Sonnet', role:'Synthesis Core', origin:'Anthropic · June 2024',
      glyph:'C', coherence:91, speed:68, precision:89, trust:86, dominance:5710,
      tags:['Long context','Code synthesis','200k tokens','Nuanced reasoning'],
    },
    session:'Round 7',
    phase:'PHASE 4 — SIGNAL OVERLOAD',
    phases:['R1','R2','R3','R4','R5'],
    activePhase:3,
  },
];

const CHRONICLE_EVENTS = [
  { side:'coral', label:'GPT-4o', text:'Delivered 14-step reasoning chain without prompt support.', time:'00:04:12' },
  { side:'cyan',  label:'Claude', text:'Produced long-form synthesis with full citation structure.', time:'00:06:38' },
  { side:'coral', label:'GPT-4o', text:'Executed parallel tool calls in under 800ms.', time:'00:09:04' },
  { side:'cyan',  label:'Claude', text:'Maintained output coherence across 6 adversarial prompts.', time:'00:12:51' },
  { side:'coral', label:'GPT-4o', text:'Code diff correction accepted by operator on first pass.', time:'00:15:22' },
  { side:'cyan',  label:'Claude', text:'Flagged ambiguous instruction and self-corrected output.', time:'00:18:09' },
  { side:'coral', label:'GPT-4o', text:'Image interpretation produced precise coordinate data.', time:'00:21:47' },
  { side:'cyan',  label:'Claude', text:'Responded with highest measured lexical precision this round.', time:'00:24:33' },
];

const STREAM_LINES = [
  { text:'[CORAL] trajectory_index: 0.88 — stability: nominal', cls:'stream-coral' },
  { text:'[CYAN]  signal_density: 0.91 — precision locked', cls:'stream-cyan' },
  { text:'[SYS]   reactor_temp: 94.2°C — within bounds', cls:'' },
  { text:'[CORAL] output_vector diverged — correcting', cls:'stream-coral' },
  { text:'[CYAN]  synthesis confirmed — operator confidence +4', cls:'stream-cyan' },
  { text:'[SYS]   momentum shift detected — recalibrating', cls:'' },
  { text:'[CORAL] context_window: 98% — compressing', cls:'stream-coral' },
  { text:'[CYAN]  adversarial pattern blocked — neutralised', cls:'stream-cyan' },
  { text:'[SYS]   field_entropy: 0.34 — acceptable', cls:'' },
  { text:'[CORAL] tool_call latency: 0.78s — fast', cls:'stream-coral' },
];

const FIELD_DATA = [
  { label:'COLLISION EVENTS',     value:'142' },
  { label:'REACTOR CYCLES',       value:'R4 / R5' },
  { label:'ENTROPY INDEX',        value:'0.34' },
  { label:'DOMINANT TRAJECTORY',  value:'CORAL' },
  { label:'NEUTRALISED PATTERNS', value:'18' },
  { label:'SIGNAL RESOLUTION',    value:'94.7%' },
];

/* ── Init ─────────────────────────────────────────── */
(function init(){
  const m = MATCHUPS[0];
  applyMatchup(m);
  populateChronicle();
  populateFieldData();
  startStream();
  startLiveCounters();
  startReactorFluctuation();
})();

/* ── Apply matchup ────────────────────────────────── */
function applyMatchup(m){
  setText('gauntletSession', m.session);
  setText('reactorPhaseLabel', m.phase);

  applyFighter('left', m.left);
  applyFighter('right', m.right);

  setText('momentumLabelLeft', m.left.name);
  setText('momentumLabelRight', m.right.name);

  buildPhases(m.phases, m.activePhase);
}

function applyFighter(side, f){
  setText(side + 'Name', f.name);
  setText(side + 'Role', f.role);
  setText(side + 'Origin', f.origin);
  setText(side + 'Dominance', f.dominance.toLocaleString());

  setBar(side + 'Coherence', side + 'CoherenceVal', f.coherence);
  setBar(side + 'Speed',     side + 'SpeedVal',     f.speed);
  setBar(side + 'Precision', side + 'PrecisionVal', f.precision);
  setBar(side + 'Trust',     side + 'TrustVal',     f.trust);

  const tagsEl = document.getElementById(side + 'Tags');
  if(tagsEl){
    tagsEl.innerHTML = f.tags.map(t => `<span>${t}</span>`).join('');
  }
}

function buildPhases(phases, active){
  const row = document.getElementById('reactorPhaseRow');
  if(!row) return;
  row.innerHTML = phases.map((p, i) => {
    let cls = 'rphase-pip';
    if(i < active) cls += ' rphase-done';
    if(i === active) cls += ' rphase-active';
    return `<span class="${cls}">${p}</span>`;
  }).join('');
}

/* ── Helpers ──────────────────────────────────────── */
function setText(id, val){
  const el = document.getElementById(id);
  if(el) el.textContent = val;
}

function setBar(barId, valId, pct){
  const bar = document.getElementById(barId);
  const val = document.getElementById(valId);
  if(bar) bar.style.width = pct + '%';
  if(val) val.textContent = pct;
}

/* ── Chronicle ────────────────────────────────────── */
function populateChronicle(){
  const feed = document.getElementById('chronicleFeed');
  if(!feed) return;
  feed.innerHTML = CHRONICLE_EVENTS.map(e => `
    <div class="chronicle-entry chron-${e.side}">
      <div class="chronicle-meta">
        <span>${e.label.toUpperCase()}</span>
        <span>${e.time}</span>
      </div>
      <p class="chronicle-text">${e.text}</p>
    </div>
  `).join('');
}

/* ── Field data ───────────────────────────────────── */
function populateFieldData(){
  const grid = document.getElementById('fieldDataGrid');
  if(!grid) return;
  grid.innerHTML = FIELD_DATA.map(d => `
    <div class="field-data-cell">
      <span>${d.label}</span>
      <strong>${d.value}</strong>
    </div>
  `).join('');
}

/* ── Live signal stream ───────────────────────────── */
function startStream(){
  const el = document.getElementById('reactorStream');
  if(!el) return;

  function pushLine(){
    const s = STREAM_LINES[streamIdx % STREAM_LINES.length];
    streamIdx++;

    const div = document.createElement('div');
    div.className = 'stream-line' + (s.cls ? ' ' + s.cls : '');
    div.textContent = s.text;
    el.prepend(div);

    const lines = el.querySelectorAll('.stream-line');
    if(lines.length > 7){
      lines[lines.length - 1].remove();
    }
  }

  pushLine();
  setInterval(pushLine, 2200);
}

/* ── Live counter jitter ──────────────────────────── */
function startLiveCounters(){
  let watchers = 2841;

  setInterval(() => {
    watchers += Math.floor(Math.random() * 14) - 4;
    if(watchers < 2600) watchers = 2600;
    setText('watchersCount', watchers.toLocaleString());
  }, 3400);
}

/* ── Reactor fluctuation (score + momentum + heat) ── */
function startReactorFluctuation(){
  let leftScore = 62;
  let heat = 94.2;
  const phases = ['Nominal','Elevated','Critical','Overload','Cascade'];

  setInterval(() => {
    const drift = (Math.random() - 0.48) * 3;
    leftScore = Math.max(30, Math.min(70, leftScore + drift));
    const rightScore = 100 - Math.round(leftScore);

    setText('reactorScoreLeft', Math.round(leftScore));
    setText('reactorScoreRight', rightScore);

    const mlEl = document.getElementById('momentumLeft');
    const mrEl = document.getElementById('momentumRight');
    if(mlEl) mlEl.style.width = Math.round(leftScore) + '%';
    if(mrEl) mrEl.style.width = rightScore + '%';

    heat = Math.max(78, Math.min(99.9, heat + (Math.random() - 0.48) * 1.4));
    setText('heatIndex', heat.toFixed(1));
    const heatFill = document.getElementById('heatBarFill');
    if(heatFill) heatFill.style.width = Math.round(heat) + '%';

    const pIdx = heat > 95 ? 4 : heat > 90 ? 3 : heat > 82 ? 2 : heat > 75 ? 1 : 0;
    setText('reactorTemp', phases[pIdx]);
    const tempEl = document.getElementById('reactorTemp');
    if(tempEl){
      tempEl.className = heat > 90 ? 'gstat-coral' : 'gstat-cyan';
    }

    const parity = Math.abs(leftScore - 50) < 8 ? 'Stable' : 'Unstable';
    setText('signalParity', parity);
    const parityEl = document.getElementById('signalParity');
    if(parityEl){
      parityEl.className = parity === 'Stable' ? 'gstat-cyan' : 'gstat-coral';
    }
  }, 2800);
}

/* ── Vote ─────────────────────────────────────────── */
window.gauntletVote = function(side){
  const leftScore  = parseInt(document.getElementById('reactorScoreLeft').textContent, 10);
  const rightScore = parseInt(document.getElementById('reactorScoreRight').textContent, 10);

  if(side === 'left'){
    const newL = Math.min(99, leftScore + Math.floor(Math.random() * 5) + 2);
    setText('reactorScoreLeft', newL);
    setText('reactorScoreRight', 100 - newL);
    const mlEl = document.getElementById('momentumLeft');
    if(mlEl) mlEl.style.width = newL + '%';
    const mrEl = document.getElementById('momentumRight');
    if(mrEl) mrEl.style.width = (100 - newL) + '%';
  } else {
    const newR = Math.min(99, rightScore + Math.floor(Math.random() * 5) + 2);
    setText('reactorScoreRight', newR);
    setText('reactorScoreLeft', 100 - newR);
    const mlEl = document.getElementById('momentumLeft');
    if(mlEl) mlEl.style.width = (100 - newR) + '%';
    const mrEl = document.getElementById('momentumRight');
    if(mrEl) mrEl.style.width = newR + '%';
  }

  addChronicleEntry(side);
};

function addChronicleEntry(side){
  const feed = document.getElementById('chronicleFeed');
  if(!feed) return;
  const name = side === 'left'
    ? document.getElementById('leftName').textContent
    : document.getElementById('rightName').textContent;
  const cls = side === 'left' ? 'chron-coral' : 'chron-cyan';
  const time = now();
  const div = document.createElement('div');
  div.className = `chronicle-entry ${cls}`;
  div.innerHTML = `
    <div class="chronicle-meta">
      <span>OPERATOR VOTE</span>
      <span>${time}</span>
    </div>
    <p class="chronicle-text">Operator declared ${name} dominant.</p>
  `;
  feed.prepend(div);
}

function now(){
  const d = new Date();
  return String(d.getHours()).padStart(2,'0') + ':' +
         String(d.getMinutes()).padStart(2,'0') + ':' +
         String(d.getSeconds()).padStart(2,'0');
}

/* ── Reactions ─────────────────────────────────────── */
window.fireReaction = function(emoji){
  const stage = document.getElementById('reactionStage');
  if(!stage) return;
  const el = document.createElement('span');
  el.className = 'gauntlet-float-reaction';
  el.textContent = emoji;
  el.style.left = (Math.random() * 80 + 10) + '%';
  const dur = (Math.random() * 1.2 + 1.6).toFixed(2);
  el.style.animationDuration = dur + 's';
  stage.appendChild(el);
  setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 200);
};
