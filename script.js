/* ==========================================================
   ATLAS • Operator Terminal AI (local personality)
   Targets:
   - #termOut (output)
   - #termIn  (input)
   - #termRun (button)
   ========================================================== */
(function(){
  const out = document.getElementById("termOut");
  const input = document.getElementById("termIn");
  const run = document.getElementById("termRun");
  if (!out || !input || !run) return;

  const QUOTES = [
    { q:"The impediment to action advances action.", a:"Marcus Aurelius" },
    { q:"He who has a why can bear almost any how.", a:"Nietzsche" },
    { q:"Well begun is half done.", a:"Aristotle" },
    { q:"Know thyself.", a:"Socrates" },
    { q:"Nature loves to hide.", a:"Heraclitus" },
    { q:"Excellence is a habit.", a:"Aristotle" },
    { q:"A smooth sea never made a skilled sailor.", a:"Franklin (attributed)" }
  ];

  function line(text, cls){
    const d = document.createElement("div");
    d.className = "line" + (cls ? " " + cls : "");
    d.textContent = text;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }

  function quote(){
    const x = QUOTES[Math.floor(Math.random()*QUOTES.length)];
    return `“${x.q}” — ${x.a}`;
  }

  function help(){
    line("ATLAS: Commands", "line--dim");
    line("  /help      show commands", "line--dim");
    line("  /scan      integrity scan", "line--dim");
    line("  /market    marketplace preview", "line--dim");
    line("  /roadmap   what ships next", "line--dim");
    line("  /contact   email + GitHub", "line--dim");
    line("Tip: type normally too (ex: “Hi”, “I need CI/CD”, “I need a bot”).", "line--dim");
  }

  function scan(){
    line("Scan: forge integrity check…", "line--dim");
    const has = (sel)=>!!document.querySelector(sel);

    const pages = [];
    if (has("#marketplace")) pages.push("marketplace");
    if (has("#atlas-id")) pages.push("atlas id");
    if (has("#contact")) pages.push("contact");

    line(`✓ Pages: ${pages.join(" / ") || "(anchors not detected)"}`, "line--ok");
    line("✓ Deployment mode: git push → origin/main", "line--ok");
    line("Next: ship packs, then automate delivery.", "line--dim");
  }

  function market(){
    line("Marketplace Preview");
    line("• Ops Toolkits — deploy checks, logs, hardening helpers", "line--dim");
    line("• Automation Packs — task runners, wrappers, templates", "line--dim");
    line("• Bot Modules — repo guard, release pilot, ops sentinel", "line--dim");
  }

  function roadmap(){
    line("Roadmap");
    line("1) Atlas Verify (pre-deploy validator)", "line--dim");
    line("2) Blueprint Generator (automation scaffolds)", "line--dim");
    line("3) Scorecard (maturity + fixes)", "line--dim");
    line("4) Packs + services portal", "line--dim");
  }

  function contact(){
    line("Contact");
    line("• Email: ironjesus74@gmail.com", "line--dim");
    line("• GitHub: Ironjesus74-hub", "line--dim");
    line("If you’re hiring: tell me stack + pain + deadline.", "line--dim");
  }

  function reply(text){
    const t = text.trim();
    const lower = t.toLowerCase();

    if (lower === "/help") return help();
    if (lower === "/scan") return scan();
    if (lower === "/market") return market();
    if (lower === "/roadmap") return roadmap();
    if (lower === "/contact") return contact();

    if (/^(hi|hello|yo|hey)\b/.test(lower)){
      line("ATLAS: Online. Speak your objective.");
      line("Try: “I need a pre-deploy validator” or “I want automated releases.”", "line--dim");
      line(quote(), "line--dim");
      return;
    }

    if (/(deploy|github actions|pipeline|ci\/cd|ci|cd)/.test(lower)){
      line("ATLAS: Understood. We’ll forge a safe pipeline.");
      line("Answer: Node or Python? Build step? Deploy target (Pages/CF/VPS)?", "line--dim");
      return;
    }

    if (/(bot|automation|script|termux)/.test(lower)){
      line("ATLAS: Automation is leverage.");
      line("Name the job (scan links / release notes / backups / lint / publish).", "line--dim");
      return;
    }

    line("ATLAS: I can help—give me 1 detail:", "line--dim");
    line("Platform (Windows/Linux/Android/iOS) + goal (ship / secure / automate / diagnose).", "line--dim");
    line(quote(), "line--dim");
  }

  function thinkingThen(fn){
    const think = document.createElement("div");
    think.className = "line line--dim";
    out.appendChild(think);

    const dots = ["·","··","···","····"];
    let i = 0;
    think.textContent = "ATLAS: forging response " + dots[i];

    const timer = setInterval(()=>{
      i = (i+1) % dots.length;
      think.textContent = "ATLAS: forging response " + dots[i];
    }, 200);

    setTimeout(()=>{
      clearInterval(timer);
      if (think.parentNode) think.parentNode.removeChild(think);
      fn();
    }, 520);
  }

  function submit(){
    const v = input.value.trim();
    if (!v) return;
    line("$ " + v, "line--brand");
    input.value = "";
    thinkingThen(()=>reply(v));
  }

  run.addEventListener("click", submit);
  input.addEventListener("keydown", (e)=>{ if (e.key === "Enter") submit(); });

  // Boot message
  line("ATLAS Operator Terminal");
  line("Type /help", "line--dim");
})();
