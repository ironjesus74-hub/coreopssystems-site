(() => {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const KEY = "atlas_profile_v1";

  const defaults = {
    displayName: "Atlas Operator",
    handle: "built-different",
    bio: "I ship automation from the edge — Android-native workflows, production discipline, zero fluff.",
    accent: "#39c6ff",
    link1: "https://github.com/Ironjesus74-hub",
    link2: "mailto:ironjesus74@gmail.com",
    link3: ""
  };

  function safeParse(s){
    try { return JSON.parse(s); } catch { return null; }
  }

  function load(){
    const fromStore = safeParse(localStorage.getItem(KEY) || "");
    return { ...defaults, ...(fromStore || {}) };
  }

  function save(data){
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function setAccent(accent){
    const bar = $("#accentBar");
    if (bar) bar.style.background = `linear-gradient(135deg, ${accent}, #7c5cff, #ff7a18)`;
  }

  function renderPreview(data){
    const name = $("#pvName");
    const handle = $("#pvHandle");
    const bio = $("#pvBio");
    const links = $("#pvLinks");

    if (name) name.textContent = data.displayName || defaults.displayName;
    if (handle) handle.textContent = "@" + (data.handle || defaults.handle);
    if (bio) bio.textContent = data.bio || defaults.bio;

    setAccent(data.accent || defaults.accent);

    if (links){
      links.innerHTML = "";
      const items = [data.link1, data.link2, data.link3].filter(Boolean);
      items.forEach((href) => {
        const a = document.createElement("a");
        a.href = href;
        a.target = href.startsWith("http") ? "_blank" : "";
        a.rel = "noopener noreferrer";
        a.textContent = href.startsWith("mailto:") ? "Email" : href.includes("github.com") ? "GitHub" : "Link";
        links.appendChild(a);
      });
      if (!items.length){
        const span = document.createElement("div");
        span.className = "muted";
        span.textContent = "Add links to make your profile pop.";
        links.appendChild(span);
      }
    }
  }

  function fillForm(data){
    $("#fName").value = data.displayName || "";
    $("#fHandle").value = data.handle || "";
    $("#fBio").value = data.bio || "";
    $("#fAccent").value = data.accent || "#39c6ff";
    $("#fLink1").value = data.link1 || "";
    $("#fLink2").value = data.link2 || "";
    $("#fLink3").value = data.link3 || "";
  }

  function readForm(){
    const data = {
      displayName: ($("#fName").value || "").trim(),
      handle: ($("#fHandle").value || "").trim().replaceAll(" ", "-"),
      bio: ($("#fBio").value || "").trim(),
      accent: ($("#fAccent").value || "").trim() || "#39c6ff",
      link1: ($("#fLink1").value || "").trim(),
      link2: ($("#fLink2").value || "").trim(),
      link3: ($("#fLink3").value || "").trim()
    };
    return data;
  }

  function exportProfile(data){
    const t = $("#exportBox");
    if (t) t.value = JSON.stringify(data, null, 2);
  }

  function importProfile(){
    const t = $("#exportBox");
    if (!t) return;
    const parsed = safeParse(t.value);
    if (!parsed) {
      alert("Invalid JSON. Paste a valid exported profile.");
      return;
    }
    const merged = { ...defaults, ...parsed };
    save(merged);
    fillForm(merged);
    renderPreview(merged);
    alert("Imported. Saved to this device.");
  }

  function resetProfile(){
    save(defaults);
    fillForm(defaults);
    renderPreview(defaults);
    exportProfile(defaults);
  }

  // Boot
  const data = load();
  fillForm(data);
  renderPreview(data);
  exportProfile(data);

  // Live preview
  const form = $("#profileForm");
  if (form){
    form.addEventListener("input", () => {
      const d = readForm();
      renderPreview(d);
    });
  }

  // Save
  const saveBtn = $("#saveProfile");
  if (saveBtn){
    saveBtn.addEventListener("click", () => {
      const d = readForm();
      save(d);
      exportProfile(d);
      alert("Saved. (Local-only for now — backend later.)");
    });
  }

  // Export
  const exportBtn = $("#exportProfile");
  if (exportBtn){
    exportBtn.addEventListener("click", () => {
      const d = readForm();
      exportProfile(d);
      $("#exportBox").scrollIntoView({ behavior:"smooth", block:"center" });
    });
  }

  // Import
  const importBtn = $("#importProfile");
  if (importBtn) importBtn.addEventListener("click", importProfile);

  // Reset
  const resetBtn = $("#resetProfile");
  if (resetBtn) resetBtn.addEventListener("click", resetProfile);
})();
