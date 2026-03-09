/* ====================================================
   exchange.js — Atlas Exchange Work Hub Engine
   ==================================================== */

const exchangeListings = [
  { id:1, type:'Service', title:'OpenRouter Multi-Route Wrapper', operator:'SignalOps', trust:'97%', price:'$120', delivery:'24h', tags:['Automation','API','Routing'], desc:'Robust fallback chain with provider scoring and live health checks.', category:'Services' },
  { id:2, type:'Contract', title:'Prompt System Architecture Review', operator:'NeuralDraft', trust:'94%', price:'$380', delivery:'3d', tags:['Audit','Prompt Ops','Structure'], desc:'End-to-end prompt chain audit with rewrite recommendations.', category:'Audits' },
  { id:3, type:'Freelance', title:'Custom AI Dashboard Build', operator:'StackForge', trust:'91%', price:'$640', delivery:'5d', tags:['Dashboard','UI','Integration'], desc:'Full-stack operator dashboard with live signal feeds and metrics.', category:'Services' },
  { id:4, type:'Hiring', title:'AI Workflow Integration Engineer', operator:'AtlasOps', trust:'99%', price:'$95/hr', delivery:'Ongoing', tags:['Engineering','Integration','Workflows'], desc:'Seeking a systems engineer to design and maintain our AI workflow infrastructure.', category:'Hiring' },
  { id:5, type:'Service', title:'Token Waste Detection Audit', operator:'PromptLens', trust:'93%', price:'$200', delivery:'48h', tags:['Audit','Tokens','Optimization'], desc:'Identify and eliminate token waste patterns in your prompt chains.', category:'Audits' },
  { id:6, type:'Contract', title:'Signal Feed Data Pipeline', operator:'CoreSignal', trust:'96%', price:'$520', delivery:'4d', tags:['Data','Pipeline','Infrastructure'], desc:'Build a scalable data pipeline for real-time AI signal collection.', category:'Contracts' },
  { id:7, type:'Freelance', title:'Research System for Market Intel', operator:'QueryMind', trust:'88%', price:'$290', delivery:'3d', tags:['Research','Market','Analysis'], desc:'Automated research system for competitive AI market intelligence.', category:'Research' },
  { id:8, type:'Hiring', title:'Prompt Operations Manager', operator:'AtlasOps', trust:'99%', price:'$80/hr', delivery:'Ongoing', tags:['Prompt Ops','Management','Systems'], desc:'Lead the prompt operations strategy and quality control across our AI systems.', category:'Hiring' },
  { id:9, type:'Service', title:'Fallback Chain Design & Testing', operator:'RouteForge', trust:'92%', price:'$175', delivery:'36h', tags:['Routing','Fallback','Reliability'], desc:'Design and stress-test a multi-provider fallback chain for production workloads.', category:'Services' },
  { id:10, type:'Contract', title:'AI Ops Workflow Automation', operator:'FlowBuilds', trust:'95%', price:'$460', delivery:'4d', tags:['Automation','Ops','Workflow'], desc:'End-to-end workflow automation integrating AI decision layers into existing ops.', category:'Contracts' }
];

const featuredOperator = {
  name: 'AtlasOps',
  trust: '99%',
  deliveries: 142,
  specialty: 'AI Workflow Engineering & Prompt Operations',
  badge: 'VERIFIED TIER 1',
  tagline: 'We build the infrastructure other operators run on.',
  stats: [
    { label: 'Trust Score', val: '99%' },
    { label: 'Deliveries', val: '142' },
    { label: 'Response Time', val: '<2h' },
    { label: 'Repeat Clients', val: '78%' }
  ]
};

const activityItems = [
  { action: 'New request', detail: 'Prompt audit — budget $200–400', time: 'just now' },
  { action: 'Offer accepted', detail: 'Signal Feed Pipeline by CoreSignal', time: '2m ago' },
  { action: 'New request', detail: 'OpenRouter integration — 48h window', time: '4m ago' },
  { action: 'Delivery confirmed', detail: 'AI Dashboard by StackForge', time: '7m ago' },
  { action: 'New hire inquiry', detail: 'Prompt Ops Manager role — remote', time: '11m ago' },
];

const moods = ['Focused', 'Active', 'Competitive', 'Sharp', 'Elevated'];
const statusPills = ['REQUESTS ACTIVE', 'OPERATORS ONLINE', 'LISTINGS FRESH', 'WORK MOVING'];

let activeExchangeCategory = 'All';
let exchangeSearchTerm = '';

function rand(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---- Type badge color mapping ---- */
function typeBadgeClass(type) {
  const map = { 'Service': 'type-service', 'Contract': 'type-contract', 'Freelance': 'type-freelance', 'Hiring': 'type-hiring' };
  return map[type] || 'type-service';
}

/* ---- Render featured operator ---- */
function renderFeaturedOp() {
  const el = document.getElementById('featuredExchangeOp');
  el.innerHTML = `
    <div class="featured-op-head">
      <div class="featured-op-avatar">
        <span>AO</span>
      </div>
      <div class="featured-op-info">
        <strong>${featuredOperator.name}</strong>
        <span class="badge-pill">${featuredOperator.badge}</span>
        <p>${featuredOperator.specialty}</p>
      </div>
    </div>
    <p class="featured-op-tagline">"${featuredOperator.tagline}"</p>
    <div class="featured-op-stats">
      ${featuredOperator.stats.map(s => `
        <div class="featured-op-stat">
          <span>${s.label}</span>
          <strong>${s.val}</strong>
        </div>
      `).join('')}
    </div>
    <button class="vote-btn" style="margin-top:14px;width:100%;">Contact Operator →</button>
  `;
}

/* ---- Render activity feed ---- */
function renderActivityFeed() {
  const el = document.getElementById('exchangeActivityFeed');
  el.innerHTML = activityItems.map(item => `
    <div class="exchange-activity-item">
      <div class="exchange-activity-head">
        <strong>${item.action}</strong>
        <time>${item.time}</time>
      </div>
      <p>${item.detail}</p>
    </div>
  `).join('');
}

/* ---- Build listing card markup ---- */
function exchangeCardMarkup(listing) {
  return `
    <div class="exchange-card" data-category="${listing.category}" data-type="${listing.type}">
      <div class="exchange-card-top">
        <span class="exchange-type-badge ${typeBadgeClass(listing.type)}">${listing.type}</span>
        <span class="exchange-trust">✓ ${listing.trust} Trust</span>
      </div>
      <h3 class="exchange-card-title">${listing.title}</h3>
      <p class="exchange-card-desc">${listing.desc}</p>
      <div class="exchange-card-tags">
        ${listing.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="exchange-card-meta">
        <span class="exchange-operator">by ${listing.operator}</span>
        <span class="exchange-price">${listing.price}</span>
        <span class="exchange-delivery">⏱ ${listing.delivery}</span>
      </div>
      <button class="vote-btn exchange-cta">View Listing →</button>
    </div>
  `;
}

/* ---- Filter listings ---- */
function filteredListings() {
  return exchangeListings.filter(listing => {
    const categoryMatch = activeExchangeCategory === 'All' ||
      listing.category === activeExchangeCategory ||
      listing.type === activeExchangeCategory;
    const textBlob = `${listing.title} ${listing.desc} ${listing.operator} ${listing.tags.join(' ')}`.toLowerCase();
    const searchMatch = !exchangeSearchTerm || textBlob.includes(exchangeSearchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });
}

/* ---- Render exchange grid ---- */
function renderExchangeGrid() {
  const grid = document.getElementById('exchangeGrid');
  const listings = filteredListings();
  if (listings.length === 0) {
    grid.innerHTML = `<div class="exchange-empty"><p>No listings match your filter. Try a different category or search term.</p></div>`;
    return;
  }
  grid.innerHTML = listings.map(exchangeCardMarkup).join('');
  document.getElementById('exchangeLoading').textContent =
    `Showing ${listings.length} listing${listings.length !== 1 ? 's' : ''} — more operators joining soon.`;
}

/* ---- Refresh stats ---- */
function refreshExchangeStats() {
  document.getElementById('exchangeOpenCount').textContent = randomInt(28, 42);
  document.getElementById('exchangeOperatorsCount').textContent = randomInt(22, 36);
  document.getElementById('exchangeAvgDelivery').textContent = (1.8 + Math.random() * 2).toFixed(1) + 'd';
  document.getElementById('verifiedExchangeOps').textContent = randomInt(14, 22);
  document.getElementById('exchangeRushSlots').textContent = randomInt(2, 7);
  document.getElementById('exchangeClientMood').textContent = rand(moods);
  document.getElementById('exchangeStatusPill').textContent = rand(statusPills);
}

/* ---- Bind controls ---- */
function bindExchangeControls() {
  document.querySelectorAll('.channel-btn[data-exchange-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.channel-btn[data-exchange-category]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeExchangeCategory = btn.dataset.exchangeCategory;
      renderExchangeGrid();
    });
  });

  document.getElementById('exchangeSearch').addEventListener('input', e => {
    exchangeSearchTerm = e.target.value.trim();
    renderExchangeGrid();
  });
}

/* ---- Live activity rotation ---- */
let activityPhase = 0;
const activityRotation = [
  { action: 'New request', detail: 'Research system build — timeline 3d', time: 'just now' },
  { action: 'Offer sent', detail: 'Token audit by PromptLens', time: 'just now' },
  { action: 'Hire inquiry', detail: 'AI Workflow Engineer — full-time remote', time: 'just now' },
  { action: 'New request', detail: 'Fallback chain design — urgent', time: 'just now' },
];

function rotateActivity() {
  const feed = document.getElementById('exchangeActivityFeed');
  const item = activityRotation[activityPhase % activityRotation.length];
  const el = document.createElement('div');
  el.className = 'exchange-activity-item feedIn';
  el.innerHTML = `
    <div class="exchange-activity-head">
      <strong>${item.action}</strong>
      <time>${item.time}</time>
    </div>
    <p>${item.detail}</p>
  `;
  feed.insertBefore(el, feed.firstChild);
  if (feed.children.length > 5) feed.removeChild(feed.lastChild);
  activityPhase++;
}

/* ---- Init ---- */
renderFeaturedOp();
renderActivityFeed();
renderExchangeGrid();
refreshExchangeStats();
bindExchangeControls();

setInterval(refreshExchangeStats, 7000);
setInterval(rotateActivity, 9000);
