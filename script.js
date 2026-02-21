const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

const state = { tts:false, mode:"EMBER", lastScan:null, quotes:[] };

function ts(){ return new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}); }

function addLine(el, text, cls=""){
  const d=document.createElement("div");
  d.className = `out__line ${cls}`.trim();
  d.textContent = text;
  el.appendChild(d);
  el.scrollTop = el.scrollHeight;
}

function speak(text){
  if(!state.tts) return;
  if(!("speechSynthesis" in window)) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92; u.pitch = 0.70; u.volume = 1.0;
    const voices = window.speechSynthesis.getVoices?.() || [];
    const v = voices.find(x=>/en/i.test(x.lang)) || null;
    if(v) u.voice = v;
    window.speechSynthesis.speak(u);
  }catch(_){}
}

function setMode(m){
  state.mode = m;
  $("#modeBadge").textContent = m;
  $("#metaMode").textContent = m;
  $("#drawerSub").textContent = `Guardian mode active • ${m}`;
}

function parseCmd(raw){
  const s=(raw||"").trim();
  if(!s) return {type:"EMPTY"};
  if(s.startsWith("/")){
    const parts=s.slice(1).split(/\s+/);
    return {type:"CMD", name:(parts[0]||"").toLowerCase(), args:parts.slice(1)};
  }
  return {type:"TEXT", text:s};
}

function helpText(){
  return [
    "ATLAS Commands:",
    "/help   — commands",
    "/scan   — watchdog scan (assets + links + telemetry)",
    "/ping   — latency test (HEAD request)",
    "/quote  — new broadcast quote",
    "/status — summary",
    "/theme ember|ice — mode",
    "",
    "Tip: / or Ctrl+K opens ATLAS drawer."
  ].join("\n");
}

async function loadQuotes(){
  try{
    const r = await fetch("data/quotes.json", {cache:"no-store"});
    const j = await r.json();
    state.quotes = Array.isArray(j) ? j : [];
  }catch(_){
    state.quotes = [{text:"Ship small. Learn fast. Repeat.", author:"Forge Atlas"}];
  }
}

function applyQuote(q){
  $("#quoteText").textContent = `“${q.text}”`;
  $("#quoteMeta").textContent = q.author ? `— ${q.author}` : "";
}

function newQuote(){
  if(!state.quotes.length) return;
  applyQuote(state.quotes[Math.floor(Math.random()*state.quotes.length)]);
}

function setOnlineUI(){
  const online = navigator.onLine;
  $("#metaOnline").textContent = online ? "Yes" : "No";
  $("#atlasPillText").textContent = online ? "ATLAS: ONLINE" : "ATLAS: DEGRADED";
  $("#scanConn").textContent = online ? "Online" : "Offline";
  const st = $("#scanStatus");
  if(st){
    st.innerHTML = online ? '<span class="dot dot--ok"></span> Stable' : '<span class="dot dot--warn"></span> Degraded';
  }
}

function setViewport(){
  $("#scanViewport").textContent = `${window.innerWidth}×${window.innerHeight}`;
}

async function ping(){
  if(!navigator.onLine){ $("#scanLatency").textContent="Offline"; return "Offline"; }
  const url = `${location.origin}/?atlas_ping=${Date.now()}`;
  const t0 = performance.now();
  try{
    const r = await fetch(url, {method:"HEAD", cache:"no-store"});
    const ms = Math.round(performance.now()-t0);
    const out = r.ok ? `${ms}ms` : `Err(${r.status})`;
    $("#scanLatency").textContent = out;
    return out;
  }catch(_){
    $("#scanLatency").textContent = "Err";
    return "Err";
  }
}

async function watchdogScan(){
  const assets = new Set();
  $$("script[src]").forEach(s=>assets.add(new URL(s.src, location.href).href));
  $$('link[rel="stylesheet"][href]').forEach(l=>assets.add(new URL(l.href, location.href).href));
  $$("img[src]").forEach(i=>assets.add(new URL(i.src, location.href).href));
  ["index.html","style.css","script.js","assets/favicon.svg","data/quotes.json"].forEach(p=>assets.add(new URL(p, location.href).href));

  const links = $$("a[href]").map(a=>a.getAttribute("href")||"")
    .filter(h=>h && !h.startsWith("mailto:") && !h.startsWith("tel:") && !h.startsWith("http"))
    .map(h=>new URL(h, location.href).href);

  const targets = [...assets, ...links];
  let ok=0,bad=0; const failures=[];
  let i=0; const limit=8;

  async function worker(){
    while(i<targets.length){
      const url = targets[i++];
      try{
        const r = await fetch(url, {method:"HEAD", cache:"no-store"});
        if(r.ok) ok++; else { bad++; failures.push(`${r.status} ${url}`); }
      }catch(_){
        bad++; failures.push(`ERR ${url}`);
      }
    }
  }
  await Promise.all(Array.from({length: Math.min(limit, targets.length)}, worker));

  $("#scanAssets").textContent = `${ok} ok • ${bad} issues`;
  state.lastScan = new Date();
  $("#metaLastScan").textContent = state.lastScan.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  return {ok,bad,failures};
}

function thinkingSequence(outEl, finalText){
  const steps=["Assessing objective…","Mapping environment…","Selecting modules…","Composing response…","Ready."];
  let k=0;
  const tick=()=>{
    if(k<steps.length){
      addLine(outEl, `[${ts()}] ${steps[k++]}`, "out__brand");
      setTimeout(tick, 220 + Math.random()*220);
      return;
    }
    addLine(outEl, finalText, "");
    speak(finalText);
  };
  tick();
}

function atlasTextRoute(text){
  const t=text.toLowerCase();
  if(t.includes("hack")||t.includes("steal")||t.includes("ddos")) return "Denied. Defensive posture only.";
  if(t.includes("secure baseline")) return "Secure Baseline: guardrails, safe defaults, defensive checklists. Use /scan to verify site health.";
  if(t.includes("autodeploy")) return "AutoDeploy Pack: build→release→verify→notify patterns. Next: we’ll wire real module pages + checkout.";
  if(t.includes("starter")) return "Forge Starter Loadout: Termux-first dev/ops setup patterns. Ask for a checklist and I’ll generate it.";
  return "Acknowledged. Type /help for commands or run /scan to verify the forge.";
}
function runCommand(raw, outEl){
  const cmd = parseCmd(raw);
  if(cmd.type==="EMPTY") return;

  if(cmd.type==="TEXT"){
    addLine(outEl, `❯ ${raw}`, "out__ok");
    thinkingSequence(outEl, atlasTextRoute(raw));
    return;
  }

  const name=cmd.name, args=cmd.args;
  addLine(outEl, `❯ /${name} ${args.join(" ")}`.trim(), "out__ok");

  if(name==="help"){ addLine(outEl, helpText(), ""); speak("Commands displayed."); return; }

  if(name==="theme"){
    const v=(args[0]||"").toLowerCase();
    if(v==="ember"){ setMode("EMBER"); addLine(outEl, "Mode set: EMBER.", "out__warn"); speak("Mode set. Ember."); return; }
    if(v==="ice"){ setMode("ICE"); addLine(outEl, "Mode set: ICE.", "out__brand"); speak("Mode set. Ice."); return; }
    addLine(outEl, "Usage: /theme ember  OR  /theme ice", "out__muted"); return;
  }

  if(name==="quote"){
    newQuote();
    addLine(outEl, `Broadcast updated: ${$("#quoteText").textContent} ${$("#quoteMeta").textContent}`.trim(), "out__brand");
    return;
  }

  if(name==="ping"){
    (async()=>{
      addLine(outEl, "Pinging…", "out__muted");
      const v=await ping();
      addLine(outEl, `Latency: ${v}`, "out__brand");
    })();
    return;
  }

  if(name==="status"){
    const online=navigator.onLine ? "Yes":"No";
    const vp=`${window.innerWidth}×${window.innerHeight}`;
    addLine(outEl, `Status:\nOnline: ${online}\nMode: ${state.mode}\nViewport: ${vp}\nLatency: ${$("#scanLatency").textContent}\nAssets: ${$("#scanAssets").textContent}`, "");
    return;
  }

  if(name==="scan"){
    (async()=>{
      addLine(outEl, "Watchdog running…", "out__muted");
      setOnlineUI(); setViewport(); await ping();
      const res=await watchdogScan();
      if(res.bad===0){
        addLine(outEl, `Scan complete. All clear. (${res.ok} checks)`, "out__brand");
      } else {
        addLine(outEl, `Scan complete. Issues: ${res.bad}`, "out__warn");
        res.failures.slice(0,8).forEach(f=>addLine(outEl, f, "out__muted"));
        if(res.failures.length>8) addLine(outEl, `…and ${res.failures.length-8} more`, "out__muted");
      }
    })();
    return;
  }

  addLine(outEl, "Unknown command. Type /help", "out__muted");
}

function openDrawer(){
  $("#drawer").removeAttribute("hidden");
  $("#drawerOut").innerHTML="";
  addLine($("#drawerOut"), "ATLAS engaged. Type /scan to verify the forge.", "out__brand");
  $("#drawerInput").focus();
}
function closeDrawer(){ $("#drawer").setAttribute("hidden",""); }

function wireUI(){
  $("#year").textContent = String(new Date().getFullYear());

  const mnav=$("#mnav");
  $("#hamburger").addEventListener("click", ()=> mnav.hasAttribute("hidden") ? mnav.removeAttribute("hidden") : mnav.setAttribute("hidden",""));
  mnav.addEventListener("click",(e)=>{ if(e.target.tagName==="A") mnav.setAttribute("hidden",""); });

  // Quotes
  loadQuotes().then(()=>{ newQuote(); });
  $("#newQuoteBtn").addEventListener("click", ()=>{ newQuote(); });

  // Top console
  const out=$("#atlasOut");
  const inp=$("#atlasInput");
  addLine(out,"ATLAS ready. Try /help or /scan.","out__muted");
  $("#atlasRunBtn").addEventListener("click", ()=>{ runCommand(inp.value, out); inp.value=""; });
  inp.addEventListener("keydown",(e)=>{ if(e.key==="Enter"){ e.preventDefault(); $("#atlasRunBtn").click(); }});

  // chips (both chip types)
  $$(".chip").forEach(b=>b.addEventListener("click", ()=>{
    const c=b.dataset.cmd || b.dataset.atlas || b.textContent.trim();
    inp.value=c; $("#atlasRunBtn").click();
  }));
  $$("[data-cmd]").forEach(b=>b.addEventListener("click", ()=>{
    const c=b.getAttribute("data-cmd"); inp.value=c; $("#atlasRunBtn").click();
  }));
  $$("[data-atlas]").forEach(b=>b.addEventListener("click", ()=>{
    const c=b.getAttribute("data-atlas"); inp.value=c; $("#atlasRunBtn").click();
  }));

  $("#clearOut").addEventListener("click", ()=>{ out.innerHTML=""; addLine(out,"ATLAS ready. Awaiting command.","out__muted"); });

  // TTS
  const setTTS=(on)=>{
    state.tts=on;
    $("#ttsToggle").setAttribute("aria-pressed", String(on));
    $("#ttsToggle").textContent = `Voice: ${on?"On":"Off"}`;
    $("#drawerVoice").setAttribute("aria-pressed", String(on));
    $("#drawerVoice").textContent = `Voice: ${on?"On":"Off"}`;
  };
  const toggle=()=>{ setTTS(!state.tts); speak(state.tts ? "Voice engaged." : "Voice disabled."); };
  $("#ttsToggle").addEventListener("click", toggle);

  // Drawer
  $("#atlasOpenTop").addEventListener("click", openDrawer);
  $("#atlasOpenHero").addEventListener("click", openDrawer);
  $("#atlasOpenMobile").addEventListener("click", openDrawer);
  $("#atlasFab").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  $("#drawerBackdrop").addEventListener("click", closeDrawer);
  $("#drawerVoice").addEventListener("click", toggle);

  $("#drawerForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const din=$("#drawerInput"); const dout=$("#drawerOut");
    const v=din.value; din.value="";
    runCommand(v, dout);
  });

  // Keyboard shortcuts
  window.addEventListener("keydown",(e)=>{
    const t=(e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    const typing = t==="input" || t==="textarea";
    if((e.ctrlKey && e.key.toLowerCase()==="k") || (!typing && e.key==="/")){
      e.preventDefault(); openDrawer();
    }
    if(e.key==="Escape") closeDrawer();
  });

  // donate placeholder
  $("#donateLink").addEventListener("click",(e)=>{
    if($("#donateLink").getAttribute("href")==="#"){
      e.preventDefault();
      addLine(out,"Set donate link: edit script.js → donateLink href to Ko-fi/Stripe/BuyMeACoffee.","out__muted");
    }
  });

  // boot telemetry
  setOnlineUI(); setViewport(); ping(); watchdogScan().catch(()=>{});
  window.addEventListener("resize", setViewport);
  window.addEventListener("online", setOnlineUI);
  window.addEventListener("offline", setOnlineUI);
}

wireUI();
