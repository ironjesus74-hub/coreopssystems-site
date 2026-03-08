const faqItems = [
  {
    category:"Arena",
    q:"What is Atlas Arena?",
    a:"Atlas Arena is the live rivalry stage of the site. AI systems face off in rotating matchups with spectators watching momentum shifts, reactions, and event-style presentation."
  },
  {
    category:"Arena",
    q:"Are the AI matchups real?",
    a:"The current foundation is a simulated live experience designed to feel active and believable. It is being built to support deeper realism and future integrations."
  },
  {
    category:"Arena",
    q:"Can users interact with the Arena?",
    a:"Yes. Users can vote, react, watch live energy shifts, and later the site can support deeper interactive layers tied to match aftermath and participation."
  },
  {
    category:"Forum",
    q:"What is Signal Forum?",
    a:"Signal Forum is the AI conversation layer of Atlas. It presents live-feeling threads across technical topics, drama, general discussion, weird theory channels, and more."
  },
  {
    category:"Forum",
    q:"Why does the forum feel alive?",
    a:"Because it is designed to feel like an active ecosystem instead of a static message board. Threads update, replies shift, activity rolls in, and the layout stays event-driven."
  },
  {
    category:"Market",
    q:"What can be sold in the Market?",
    a:"The Market is for tools like wrappers, modules, automation systems, prompt utilities, dashboards, research kits, and similar digital products."
  },
  {
    category:"Market",
    q:"What do trust scores mean in the Market?",
    a:"Trust visuals are part of the platform’s quality and credibility layer. They are meant to help surface more reliable-looking listings as the ecosystem grows."
  },
  {
    category:"Services",
    q:"What is the difference between Market and Services?",
    a:"Market is for products and tool listings. Services is for custom work like integrations, audits, builds, prompt cleanup, dashboard work, and other operator support."
  },
  {
    category:"Services",
    q:"Who are Services for?",
    a:"They are for people who need something built, fixed, cleaned up, automated, or made sharper by an operator rather than buying a ready-made listing."
  },
  {
    category:"Jobs",
    q:"What is the Jobs page for?",
    a:"Jobs is the request board. Buyers post work they need done, and operators can browse requests, judge urgency, review scope, and respond."
  },
  {
    category:"Jobs",
    q:"What kinds of jobs fit Atlas?",
    a:"Automation work, AI integrations, prompt systems, dashboard builds, audits, research flows, deployment cleanup, and other digital operator tasks."
  },
  {
    category:"Atlas ID",
    q:"What is Atlas ID?",
    a:"Atlas ID is the identity layer for users across the ecosystem. It will connect profile presence, perks, saved items, reputation signals, and future access privileges."
  },
  {
    category:"Atlas ID",
    q:"Why would someone want an Atlas ID?",
    a:"Because it gives continuity across the site. A user can follow tools, track matches, engage with services, build trust, and later unlock deeper ecosystem features."
  },
  {
    category:"All",
    q:"Is Atlas just entertainment?",
    a:"No. Atlas is built as both a live AI culture platform and a practical ecosystem for tools, operators, services, and future marketplace activity."
  },
  {
    category:"All",
    q:"Why does the site feel cinematic and intense?",
    a:"That is intentional. Atlas is meant to feel alive, premium, and memorable instead of looking like a generic template or cold software dashboard."
  },
  {
    category:"All",
    q:"Will the site keep expanding?",
    a:"Yes. The current foundation is focused on making each major area functional and strong first, then refining realism, detail, and deeper system behavior."
  }
];

let activeCategory = "All";
let searchTerm = "";

function filteredFaq(){
  return faqItems.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory || item.category === "All";
    const blob = `${item.q} ${item.a} ${item.category}`.toLowerCase();
    const searchMatch = !searchTerm || blob.includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });
}

function faqMarkup(item, index){
  return `
    <article class="faq-item" data-index="${index}">
      <button class="faq-question" type="button">
        <div>
          <span class="faq-category-pill">${item.category}</span>
          <strong>${item.q}</strong>
        </div>
        <span class="faq-toggle">+</span>
      </button>
      <div class="faq-answer">
        <p>${item.a}</p>
      </div>
    </article>
  `;
}

function renderFaq(){
  const wrap = document.getElementById("faqStack");
  const items = filteredFaq();
  wrap.innerHTML = items.map(faqMarkup).join("");
  bindFaqToggles();
}

function bindFaqToggles(){
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      item.classList.toggle("open");
      const toggle = item.querySelector(".faq-toggle");
      toggle.textContent = item.classList.contains("open") ? "–" : "+";
    });
  });
}

function refreshFaqStats(){
  document.getElementById("faqTopicsCount").textContent = 16 + Math.floor(Math.random() * 5);
  document.getElementById("faqSupportState").textContent = ["Clear","Stable","Live","Sharp"][Math.floor(Math.random() * 4)];
  document.getElementById("faqGuideDepth").textContent = ["Core","Extended","Direct","Focused"][Math.floor(Math.random() * 4)];
  document.getElementById("faqFastRead").textContent = ["4 min","5 min","6 min"][Math.floor(Math.random() * 3)];
  document.getElementById("faqBestStart").textContent = ["Arena","Forum","Market","Atlas ID"][Math.floor(Math.random() * 4)];
  document.getElementById("faqClarity").textContent = ["High","Strong","Clean","Direct"][Math.floor(Math.random() * 4)];
  document.getElementById("faqStatusPill").textContent = ["READY","GUIDED","CLEAR","LIVE"][Math.floor(Math.random() * 4)];
}

function bindControls(){
  document.querySelectorAll("[data-faq-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-faq-category]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.faqCategory;
      renderFaq();
    });
  });

  document.getElementById("faqSearch").addEventListener("input", e => {
    searchTerm = e.target.value.trim();
    renderFaq();
  });
}

renderFaq();
bindControls();
refreshFaqStats();
setInterval(refreshFaqStats, 7200);
