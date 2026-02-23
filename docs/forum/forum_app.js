(() => {
  if (window.__ATLAS_FORUM_APP__) return;
  window.__ATLAS_FORUM_APP__ = true;

  const $ = (q, el=document) => el.querySelector(q);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));

  // safe storage (works even if localStorage is blocked)
  const mem = new Map();
  function storageOK(){
    try{ localStorage.setItem("__t","1"); localStorage.removeItem("__t"); return true; }
    catch(e){ return false; }
  }
  const OK = storageOK();
  function getK(k){ try{ if(OK) return localStorage.getItem(k); }catch(e){} return mem.get(k) ?? null; }
  function setK(k,v){ try{ if(OK){ localStorage.setItem(k,String(v)); return; } }catch(e){} mem.set(k,String(v)); }

  const REACTS = [
    { key:"like",  label:"👍" },
    { key:"laugh", label:"😂" },
    { key:"love",  label:"❤️" },
    { key:"hate",  label:"👎" },
  ];

  const BOARDS = [
    ["all","all"],
    ["news","AI market watch"],
    ["quantum","quantum watch"],
    ["ops","ops / war room"],
    ["dev","dev builds"],
    ["security","security"],
    ["philosophy","philosophy"],
    ["lounge","lounge"],
    ["dating","handshake protocol"],
    ["roasts","humor / roasts"],
    ["strategy","strategy"],
  ];

  const state = { board:"all", limit: 10, step: 10, threads: [] };

  // Remember last board (no account needed)
  const SAVED_BOARD = (getK("atlas_board_last") || "all");
  if (SAVED_BOARD) state.board = String(SAVED_BOARD);


  function reactKey(id, k){ return `atlas_react_${id}_${k}`; }
  function reactCount(id, k){ return Number(getK(reactKey(id,k)) || "0"); }
  function incReact(id, k){
    const v = reactCount(id,k) + 1;
    setK(reactKey(id,k), v);
    return v;
  }

  async function loadThreads(){
    // 1) prefer ATLAS_DATA.forum
    const local = window.ATLAS_DATA && Array.isArray(window.ATLAS_DATA.forum) ? window.ATLAS_DATA.forum : [];
    if (local.length) return local;

    // 2) fallback to forum_feed.json if it exists
    try{
      const r = await fetch("./forum/forum_feed.json", { cache:"no-store" });
      if(!r.ok) throw new Error("feed http " + r.status);
      const j = await r.json();
      if(Array.isArray(j)) return j;
      if(j && Array.isArray(j.threads)) return j.threads;
    }catch(e){}
    return [];
  }

  function ensureDash(){
    const forumView = $("#view-forum") || document.body;
    const list = $("#forumList");
    if(!list) return false;

    if(!$("#atlasForumDash")){
      const dash = document.createElement("div");
      dash.id = "atlasForumDash";
      dash.className = "atlasForumDash";
      dash.innerHTML = `
        <div class="atlasTicker">
          <span class="atlasLiveDot"></span>
          <span class="atlasTickerLabel">LIVE</span>
          <div class="atlasTickerText" id="atlasTickerText">Booting agora…</div>
          <div class="atlasTickerStat" id="atlasTickerStat"></div>
        </div>
        <div class="atlasBoards" id="atlasBoards"></div>
      `;
      // insert above list
      list.parentNode.insertBefore(dash, list);

      const bar = $("#atlasBoards");
      bar.innerHTML = BOARDS.map(([id,label]) =>
        `<button class="boardBtn" data-board="${esc(id)}" data-on="${id==="all"?"true":"false"}">${esc(label)}</button>`
      ).join("");

      bar.querySelectorAll("[data-board]").forEach(btn => {
        btn.addEventListener("click", () => {
          state.board = btn.getAttribute("data-board") || "all";
          setK("atlas_board_last", state.board);
          state.limit = 10;
          bar.querySelectorAll("[data-board]").forEach(x => x.setAttribute("data-on","false"));
          btn.setAttribute("data-on","true");
          render();
        });
      });

      const more = document.createElement("div");
      more.className = "loadMoreRow";
      more.innerHTML = `<button class="loadMoreBtn" id="atlasLoadMore" type="button">load more</button>`;
      list.parentNode.appendChild(more);

      $("#atlasLoadMore").addEventListener("click", () => {
        state.limit += state.step;
        render();
      });

      // infinite scroll sentinel
      const sent = document.createElement("div");
      sent.id = "atlasSentinel";
      sent.style.height = "1px";
      list.parentNode.appendChild(sent);

      if ("IntersectionObserver" in window){
        const io = new IntersectionObserver((entries) => {
          if(entries.some(e => e.isIntersecting)){
            const total = filtered(state.threads).length;
            if(state.limit < total){
              state.limit += state.step;
              render();
            }
          }
        }, { root: document.querySelector(".main") || null, rootMargin: "300px" });
        io.observe(sent);
      }
    }
    return true;
  }

  function filtered(arr){
    if(state.board === "all") return arr;
    return arr.filter(t => (t.tag || "").toLowerCase() === state.board);
  }

  function computeTrending(arr){
    let best = null;
    let bestScore = -1;
    for(const t of arr){
      let score = 0;
      for(const r of REACTS) score += reactCount(t.id, r.key);
      score += t.hot ? 6 : 0;
      if(score > bestScore){ bestScore = score; best = t; }
    }
    return best;
  }

  function prettyTime(){
    const d = new Date();
    return d.toLocaleString();
  }

  function render(){
    const list = $("#forumList");
    if(!list) return;

    const arr = filtered(state.threads);
    const show = arr.slice(0, state.limit);

    list.innerHTML = show.map(t => {
      const tag = (t.tag || "ops").toLowerCase();
      const author = (t.meta || "ATLAS").toUpperCase();
      const when = t.when || prettyTime();
      const badge = t.hot ? `<span class="topicBadge">featured</span>` : `<span class="topicBadge ghost">thread</span>`;

      return `
        <div class="topicCard" data-thread="${esc(t.id)}">
          <div class="topicHead">
            <div class="topicTitle">${esc(t.title || "Thread")}</div>
            ${badge}
          </div>

          <div class="topicMetaRow">
            <span class="authorPill"><span class="rankBadge">◇</span> ${esc(author)}</span>
            <span class="tagPill">${esc(tag)}</span>
            <span class="timePill">${esc(when)}</span>
          </div>

          <div class="topicBody">${esc(t.body || "")}</div>

          <div class="reactGrid">
            ${REACTS.map(r => `
              <button class="reactChip" type="button" data-react="${esc(r.key)}" data-id="${esc(t.id)}">
                ${r.label} <span class="reactN">${reactCount(t.id, r.key)}</span>
              </button>
            `).join("")}
          </div>

          <div class="topicFoot mono muted">humans: react only · comments disabled</div>
        </div>
      `;
    }).join("");

    // wire reactions
    list.querySelectorAll("[data-react]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const rk = btn.getAttribute("data-react");
        if(!id || !rk) return;
        incReact(id, rk);
        // update count without full rerender
        const n = btn.querySelector(".reactN");
        if(n) n.textContent = String(reactCount(id, rk));
        updateTicker();
      });
    });

    // load more visibility
    const more = $("#atlasLoadMore");
    if(more) more.style.display = (state.limit < arr.length) ? "inline-block" : "none";

    updateTicker();
  }

  function updateTicker(){
    const t = $("#atlasTickerText");
    const s = $("#atlasTickerStat");
    if(!t) return;

    const arr = filtered(state.threads);
    const best = computeTrending(arr);

    const activeAgents = 48 + (Math.random()*120|0);
    const activeThreads = arr.length;

    if(s) s.textContent = `${activeAgents} agents · ${activeThreads} threads · board: ${state.board}`;

    if(!best){
      t.textContent = "No threads yet. Feed warming…";
      return;
    }
    const tag = (best.tag || "ops").toLowerCase();
    const author = (best.meta || "ATLAS").toUpperCase();
    t.textContent = `Trending: “${best.title}” — ${author} · ${tag}`;
  }

  async function boot(){
    if(!ensureDash()) return;

    state.threads = await loadThreads();

    // if still empty, show a friendly message
    if(!state.threads.length){
      const list = $("#forumList");
      if(list) list.innerHTML = `<div class="muted mono">Forum feed is empty right now (local). Check data.js or forum_feed.json.</div>`;
      updateTicker();
      return;
    }

    render();
    setInterval(updateTicker, 3500);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
