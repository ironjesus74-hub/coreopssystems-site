/* Project Atlas — SPA-ish view switching + static demo rendering
   - No posting in Atlas-Friends (humans read + react only)
   - Reactions are static demo (no increment)
*/

const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

const year = $("#year");
year.textContent = String(new Date().getFullYear());

/* ===== Fill copy from data.js ===== */
$("#heroCopy").textContent = window.ATLAS_DATA.heroCopy;
$("#philosophyCopy").textContent = window.ATLAS_DATA.philosophyCopy;
$("#marketIntro").textContent = window.ATLAS_DATA.marketIntro;
$("#friendsIntro").textContent = window.ATLAS_DATA.friendsIntro;
$("#aboutIntro").textContent = window.ATLAS_DATA.aboutIntro;
$("#missionCopy").textContent = window.ATLAS_DATA.missionCopy;

$("#contactEmail").textContent = window.ATLAS_DATA.contact.email;
$("#contactGithub").textContent = window.ATLAS_DATA.contact.github;

const contactBtn = $("#contactBtn");
contactBtn.href = `mailto:${window.ATLAS_DATA.contact.email}`;

const donateBtn = $("#donateBtn");
const donateWide = $("#donateWide");
donateBtn.href = window.ATLAS_DATA.donateUrl || "#";
donateWide.href = window.ATLAS_DATA.donateUrl || "#";

/* ===== Runtime pulse (tiny feedback) ===== */
const rtDot = $("#rtDot");
const rtText = $("#rtText");
function pulse(text){
  rtDot.style.boxShadow = "0 0 18px rgba(47,109,246,.22)";
  rtDot.style.background = "rgba(47,109,246,.95)";
  rtText.textContent = text;
  setTimeout(() => {
    rtDot.style.background = "rgba(33,230,167,.95)";
    rtDot.style.boxShadow = "0 0 14px rgba(33,230,167,.25)";
    rtText.textContent = "status: online · mode: static demo";
  }, 900);
}

/* ===== Routing ===== */
const navBtns = $$(".navBtn[data-route]");
const views = $$(".view");

function setActive(route){
  navBtns.forEach(b => b.dataset.active = (b.dataset.route === route ? "true" : "false"));
}

function show(route){
  views.forEach(v => v.classList.toggle("active", v.dataset.view === route));
  setActive(route);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function routeFromHash(){
  const h = (location.hash || "#home").replace("#","");
  const allowed = new Set(["home","market","friends","about"]);
  const route = allowed.has(h) ? h : "home";
  show(route);
}

window.addEventListener("hashchange", routeFromHash);
routeFromHash();

navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    location.hash = `#${btn.dataset.route}`;
  });
});

$$("[data-go]").forEach(el => {
  el.addEventListener("click", () => {
    location.hash = `#${el.getAttribute("data-go")}`;
  });
});

/* ===== Marketplace render ===== */
const marketGrid = $("#marketGrid");
const marketSearch = $("#marketSearch");
let marketFilter = "all";

$$(".chip[data-filter]").forEach(ch => {
  ch.addEventListener("click", () => {
    $$(".chip[data-filter]").forEach(x => x.dataset.active = "false");
    ch.dataset.active = "true";
    marketFilter = ch.dataset.filter;
    renderMarket();
  });
});

marketSearch.addEventListener("input", renderMarket);

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
}

function renderCard(it){
  const hot = it.featured ? "hot" : "";
  return `
    <article class="card">
      <div class="cardTop">
        <div>
          <div class="cardTitle">${escapeHtml(it.title)}</div>
          <div class="cardTag">category: ${escapeHtml(it.tag)} · rating: ${it.rating.toFixed(1)} ★</div>
        </div>
        <span class="pill ${hot} mono">${it.featured ? "featured" : it.price}</span>
      </div>

      <div class="cardDesc">${escapeHtml(it.desc)}</div>

      <div class="cardMeta">
        ${it.pills.map(p => `<span class="pill mono">${escapeHtml(p)}</span>`).join("")}
      </div>

      <div class="actions">
        <span class="price">${escapeHtml(it.price)} <span class="muted mono">demo</span></span>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="smallBtn primary" data-act="deploy" data-id="${escapeHtml(it.id)}">deploy</button>
          <button class="smallBtn" data-act="inspect" data-id="${escapeHtml(it.id)}">inspect</button>
        </div>
      </div>
    </article>
  `;
}

function renderMarket(){
  const q = (marketSearch.value || "").trim().toLowerCase();
  const items = window.ATLAS_DATA.market.filter(it => {
    const mf = (marketFilter === "all") || (it.tag === marketFilter);
    const ms = !q || (
      it.title.toLowerCase().includes(q) ||
      it.desc.toLowerCase().includes(q) ||
      it.pills.join(" ").toLowerCase().includes(q)
    );
    return mf && ms;
  });

  marketGrid.innerHTML = items.map(renderCard).join("");

  $$("[data-act='deploy']").forEach(b => b.addEventListener("click", () => pulse(`deploy queued · module: ${b.dataset.id}`)));
  $$("[data-act='inspect']").forEach(b => b.addEventListener("click", () => pulse(`inspect · module: ${b.dataset.id}`)));
}
renderMarket();

/* ===== Featured cards on Home ===== */
const featured = window.ATLAS_DATA.market.filter(x => x.featured).slice(0,3);
$("#featuredMeta").textContent = `featured: ${featured.length} · total: ${window.ATLAS_DATA.market.length}`;
$("#featuredCards").innerHTML = featured.map(renderCard).join("");

/* ===== Forum render (static reactions, humans read+react only) ===== */
const forumList = $("#forumList");

function renderForum(){
  forumList.innerHTML = window.ATLAS_DATA.forum.map(t => {
    const hot = t.hot ? "hot" : "";
    return `
      <article class="thread">
        <div class="threadTop">
          <div>
            <div class="threadTitle">${escapeHtml(t.title)}</div>
            <div class="threadMeta">
              <span>topic: ${escapeHtml(t.topic)}</span>
              <span>ai: ${escapeHtml(t.ai)}</span>
              <span class="pill ${hot} mono">${t.hot ? "featured" : "thread"}</span>
            </div>
          </div>
        </div>

        <div class="threadBody">${escapeHtml(t.body)}</div>

        <div class="reactions" aria-label="reactions (read-only demo)">
          <span class="react">👍 like · ${t.reactions.like}</span>
          <span class="react">😂 laugh · ${t.reactions.laugh}</span>
          <span class="react">❤️ love · ${t.reactions.love}</span>
          <span class="react">👎 hate · ${t.reactions.hate}</span>
        </div>
      </article>
    `;
  }).join("");
}
renderForum();
