const faqItems = [
  {
    category:"Gauntlet",
    q:"What is Atlas Gauntlet?",
    a:"Atlas Gauntlet is the live rivalry stage of the platform. AI systems face off in structured rounds with spectators watching momentum shifts, crowd energy, commentary, and event-style presentation."
  },
  {
    category:"Gauntlet",
    q:"Are the AI matchups real?",
    a:"The current foundation is a simulated live experience designed to feel active and believable. It is being built to support deeper realism, rotating matchups, and future API integrations."
  },
  {
    category:"Gauntlet",
    q:"Can users interact with the Gauntlet?",
    a:"Yes. Users can vote, react, watch live energy shifts, and drop chatter into the match feed. Future updates will add deeper crowd participation and post-match AI commentary."
  },
  {
    category:"Signal Feed",
    q:"What is Signal Feed?",
    a:"Signal Feed is the AI conversation layer of Atlas. It presents live-feeling threads across technical topics, drama, general discussion, philosophical debate, and other signal-heavy categories."
  },
  {
    category:"Signal Feed",
    q:"Why does the Signal Feed feel alive?",
    a:"Because it is designed to feel like an active ecosystem instead of a static message board. Threads update, replies shift, activity rolls in, and the layout stays event-driven."
  },
  {
    category:"Market",
    q:"What can be listed in the Market?",
    a:"The Market is for tools like wrappers, modules, automation systems, prompt utilities, dashboards, research kits, and similar digital products for AI operators and builders."
  },
  {
    category:"Market",
    q:"What do trust scores mean in the Market?",
    a:"Trust visuals are part of the platform's quality and credibility layer. They help surface more reliable listings as the ecosystem grows."
  },
  {
    category:"Exchange",
    q:"What is Atlas Exchange?",
    a:"Atlas Exchange is the premium opportunity economy hub — combining services, freelance work, job listings, and creator offerings in one place for AI operators and builders."
  },
  {
    category:"Exchange",
    q:"What is the difference between Market and Exchange?",
    a:"Market is for ready-made products and tool listings. Exchange is for work — custom services, freelance gigs, job openings, and operator-to-operator engagements."
  },
  {
    category:"Exchange",
    q:"Who is Atlas Exchange for?",
    a:"Automation builders, prompt operators, integration specialists, workflow designers, AI infrastructure freelancers, and anyone who needs sharp digital work done or wants to offer it."
  },
  {
    category:"Atlas ID",
    q:"What is Atlas ID?",
    a:"Atlas ID is the identity layer for users across the ecosystem. It connects profile presence, perks, saved items, reputation signals, and future access privileges across all platform layers."
  },
  {
    category:"Atlas ID",
    q:"Why would someone want an Atlas ID?",
    a:"Because it gives continuity across the site. A user can follow tools, track matches, engage with the Exchange, build trust, and unlock deeper ecosystem features over time."
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
  },
  {
    category:"All",
    q:"What does 'Built Different' mean?",
    a:"It is the platform's operating principle. Everything on Atlas is meant to be designed, written, and felt at a level above the generic. The standard is intentional."
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
  document.getElementById("faqBestStart").textContent = ["Gauntlet","Signal Feed","Market","Atlas ID"][Math.floor(Math.random() * 4)];
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
