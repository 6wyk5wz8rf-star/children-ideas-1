(function () {
  "use strict";

  const C = window.WORKSHOP_CONTENT;
  const main = document.querySelector("#main");
  const modalRoot = document.querySelector("#modal-root");
  const STORAGE_KEY = "the-workshop-library";
  const SETTINGS_KEY = "the-workshop-settings";
  const ONBOARDING_KEY = "the-workshop-onboarding";
  const DATA_VERSION = 1;

  const defaults = { sound: false, reducedMotion: false, largeText: false, simplified: false };
  let settings = readJSON(SETTINGS_KEY, defaults);
  let library = loadLibrary();
  let view = { name: "home" };
  let current = null;
  let saveTimer = null;
  let drag = null;

  const iconPaths = {
    world: '<path d="M4 18 8 6l4 4 3-6 5 14Z"/><path d="M2 20h20M7 14c3-2 6-2 10 0"/>',
    mystery: '<path d="M4 19V7l5-3 6 3 5-2v12l-5 3-6-3-5 2Z"/><path d="M9 4v13M15 7v13"/><circle cx="12" cy="11" r="2"/>',
    evidence: '<rect x="4" y="4" width="7" height="6" rx="1"/><rect x="13" y="14" width="7" height="6" rx="1"/><path d="m11 7 5 7M7.5 10v5h5"/>',
    inventor: '<path d="M5 15h14l-2 5H7l-2-5Z"/><path d="m8 15 1-6h6l1 6M11 9V5l2-2 2 2-2 2M4 11h3M17 11h3"/>',
    consequence: '<path d="M12 4v16M12 9 6 5M12 14l6-4M6 5v4M18 10v4"/><circle cx="12" cy="4" r="2"/><circle cx="6" cy="10" r="2"/><circle cx="18" cy="15" r="2"/><circle cx="12" cy="20" r="2"/>',
    save: '<path d="M5 4h12l2 2v14H5Z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/>',
    print: '<path d="M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7Z"/>',
    present: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="m9 21 3-4 3 4"/>',
    back: '<path d="m15 5-7 7 7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    shuffle: '<path d="M4 7h3c4 0 6 10 10 10h3M17 14l3 3-3 3M4 17h3c1.5 0 2.8-1.4 4-3M14 7h3M17 4l3 3-3 3"/>',
    review: '<path d="M5 3h14v18H5Z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
    trash: '<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
    copy: '<rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
    link: '<path d="M10 13a4 4 0 0 0 5.7 0l2.1-2.1a4 4 0 1 0-5.7-5.7L11 6.3M14 11a4 4 0 0 0-5.7 0l-2.1 2.1a4 4 0 1 0 5.7 5.7l1.1-1.1"/>',
    mapPin: '<path d="M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/>',
    test: '<path d="m9 3 6 0M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8"/>',
    replay: '<path d="M4 7v5h5M5.5 16A8 8 0 1 0 5 8"/>'
  };

  function icon(name, cls = "") {
    return `<svg class="${cls}" aria-hidden="true" viewBox="0 0 24 24">${iconPaths[name] || iconPaths.review}</svg>`;
  }

  function nodeIcon(name) {
    const paths = {
      harbour: '<path d="M3 17h18M6 17l2-5h8l2 5M9 12V7h6v5M12 7V3M8 20h8"/>',
      tower: '<path d="M7 21h10L15 4H9L7 21ZM9 9h6M8 15h8"/>',
      tree: '<path d="M12 21v-6M7 15h10L14 11h3l-5-8-5 8h3l-3 4Z"/>',
      star: '<path d="m12 3 2.7 5.6 6.3.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.5l6.3-.9L12 3Z"/>',
      water: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
      home: '<path d="m4 11 8-7 8 7v9H4v-9ZM9 20v-6h6v6"/>',
      gate: '<path d="M5 21V8a7 7 0 0 1 14 0v13M9 21V9a3 3 0 0 1 6 0v12M3 21h18"/>',
      gear: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
      flag: '<path d="M6 21V4M6 5h10l-2 4 2 4H6"/>'
    };
    return `<svg viewBox="0 0 24 24">${paths[name] || paths.mapPin || iconPaths.mapPin}</svg>`;
  }

  function evidenceVisual(e){
    const common='viewBox="0 0 120 58" role="img"';
    if(e.type==="map")return `<div class="evidence-visual"><svg ${common} aria-label="Simple map source"><path d="M8 45 29 13l25 22 19-25 39 35M18 42c23-12 42 12 68-10"/><circle cx="73" cy="10" r="4"/></svg></div>`;
    if(["measurement","graph","comparison"].includes(e.type))return `<div class="evidence-visual"><svg ${common} aria-label="Simple measurement graph"><path d="M12 8v40h98M18 41l21-12 20 5 22-23 22 9"/><circle cx="81" cy="11" r="3"/></svg></div>`;
    if(e.type==="timeline")return `<div class="evidence-visual"><svg ${common} aria-label="Simple timeline"><path d="M10 30h100M25 22v16M57 22v16M92 22v16"/><circle cx="25" cy="30" r="5"/><circle cx="57" cy="30" r="5"/><circle cx="92" cy="30" r="5"/></svg></div>`;
    if(["weather","light","temperature","water","environment"].includes(e.type))return `<div class="evidence-visual"><svg ${common} aria-label="Environmental observation"><circle cx="31" cy="20" r="10"/><path d="M31 4v6M13 20h8M41 20h8M65 42c6-21 29-22 38 0M58 43h53"/></svg></div>`;
    if(e.type==="object")return `<div class="evidence-visual"><svg ${common} aria-label="Object record drawing"><path d="M42 45 33 17l27-8 25 20-12 18-31-2Z"/><path d="m40 21 34 18M52 12l18 32"/></svg></div>`;
    return `<div class="evidence-visual"><svg ${common} aria-label="Written source"><path d="M29 7h61v44H29Z"/><path d="M40 18h39M40 27h31M40 36h36"/></svg></div>`;
  }

  function uid(prefix = "id") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>'"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
  }

  function nl2br(value = "") { return escapeHTML(value).replace(/\n/g, "<br>"); }
  function deepCopy(value) { return JSON.parse(JSON.stringify(value)); }
  function readJSON(key, fallback) {
    try { return Object.assign(Array.isArray(fallback) ? [] : {}, fallback, JSON.parse(localStorage.getItem(key) || "null") || {}); }
    catch { return deepCopy(fallback); }
  }

  function loadLibrary() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!parsed || !Array.isArray(parsed.items)) return { version: DATA_VERSION, items: [] };
      return { version: DATA_VERSION, items: parsed.items };
    } catch { return { version: DATA_VERSION, items: [] }; }
  }

  function persistLibrary() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }

  function applySettings() {
    document.documentElement.style.setProperty("--text-scale", settings.largeText ? "1.12" : "1");
    document.documentElement.style.setProperty("--motion", settings.reducedMotion ? "0" : "1");
    document.body.classList.toggle("simplified", !!settings.simplified);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
  }

  function announce(message) {
    const region = document.querySelector("#toast-region");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    region.append(toast);
    window.setTimeout(() => toast.remove(), 2600);
  }

  function tone() {
    if (!settings.sound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + .13);
    } catch { /* sound is optional */ }
  }

  function svgHero() {
    return `<svg viewBox="0 0 280 230" role="img" aria-label="A line drawing of five creative rooms">
      <path d="M20 204h240M37 204V81l45-26 44 26v123M126 204V61l38-24 37 24v143M201 204v-88l23-17 22 17v88"/>
      <path d="M53 204v-76h57v76M68 111V89h27v22M144 204v-82h38v82M212 204v-51h22v51"/>
      <path d="M58 146h18v19H58zM86 146h18v19H86zM148 77h32M151 91h26M218 126h10"/>
      <circle cx="30" cy="43" r="8"/><path d="M30 25v7M30 54v7M12 43h7M41 43h7"/>
    </svg>`;
  }

  function appIcon(name) { return `<span class="workspace-badge">${icon(name)}</span>`; }

  function appButton(app, label = "Open") {
    return `<button class="button" type="button" data-action="open-app" data-app="${app}">${label} ${icon("arrow")}</button>`;
  }

  function renderHome() {
    view = { name: "home" };
    current = null;
    document.body.classList.remove("presentation-mode");
    const recent = [...library.items].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);
    main.innerHTML = `<div class="page">
      <section class="hero">
        <div class="hero-object decorative">${svgHero()}</div>
        <div class="hero-copy">
          <p class="eyebrow">Five creative spaces</p>
          <h1>A quiet place to <span>think with your hands.</span></h1>
          <p class="lede">Build a world. Follow a clue. Connect evidence. Test an invention. Make a difficult choice.</p>
        </div>
      </section>

      <div class="section-heading"><div><p class="eyebrow">Choose a doorway</p><h2>Where will you work today?</h2></div></div>
      <section class="door-grid" aria-label="The five Workshop spaces">
        ${Object.entries(C.apps).map(([key, app]) => {
          const latest = [...library.items].filter(i => i.app === key).sort((a,b) => b.updatedAt-a.updatedAt)[0];
          return `<article class="door" style="--accent:${app.accent}">
            <div class="door-icon">${icon(key)}</div>
            <h3>${app.name}</h3><p>${app.description}</p>
            <div class="door-preview">${app.preview}</div>
            <div class="door-actions">
              ${appButton(key, "Start")}
              ${latest ? `<button class="button secondary" type="button" data-action="continue" data-id="${latest.id}">Continue</button>` : ""}
            </div>
          </article>`;
        }).join("")}
      </section>

      <div class="section-heading"><div><p class="eyebrow">On this device</p><h2>Recent creations</h2></div><button class="text-button" data-action="library">View all saved work</button></div>
      <section class="recent-strip">
        ${recent.length ? recent.map(item => `<article class="recent-card">
          <span class="app-label">${C.apps[item.app]?.name || "Workshop"}</span>
          <strong>${escapeHTML(item.title)}</strong><span class="muted small">Edited ${formatDate(item.updatedAt)}</span>
          <button class="button secondary" data-action="continue" data-id="${item.id}">Continue</button>
        </article>`).join("") : `<p class="empty-copy">Your worlds, investigations, designs and decisions will appear here after you begin.</p>`}
      </section>
    </div>`;
    window.scrollTo(0, 0);
  }

  function workspaceHeader(app, subtitle) {
    const meta = C.apps[app];
    return `<div class="workspace-head" style="--accent:${meta.accent}">
      <div class="workspace-title">${appIcon(app)}<div><h1>${meta.name}</h1><p>${escapeHTML(subtitle || meta.description)}</p></div></div>
      <div class="workspace-actions">
        ${current ? `<span class="status-pill">Saved on this device</span>` : ""}
        <button class="button secondary" type="button" data-action="home" aria-label="Return to The Workshop">${icon("back")}<span>Workshop</span></button>
        ${current ? `<button class="button secondary" type="button" data-action="manual-save" aria-label="Save this work">${icon("save")}<span>Save</span></button>
        <button class="button secondary" type="button" data-action="review" aria-label="Review this work">${icon("review")}<span>Review</span></button>` : ""}
      </div>
    </div>`;
  }

  function welcomeLayout(app, title, copy, body) {
    return `<div class="workspace-shell">${workspaceHeader(app)}<div class="workspace-body">
      <section class="welcome-panel"><div><p class="eyebrow">Welcome</p><h2>${title}</h2><p class="lede">${copy}</p>${body}</div></section>
    </div></div>`;
  }

  function openApp(app, itemId) {
    view = { name: "app", app };
    current = itemId ? deepCopy(library.items.find(i => i.id === itemId) || null) : null;
    if (current) renderCurrent();
    else renderWelcome(app);
    window.scrollTo(0, 0);
  }

  function renderWelcome(app) {
    current = null;
    if (app === "world") {
      main.innerHTML = welcomeLayout(app, "Make a place worth wondering about.", "Begin with empty ground, a coherent world seed or one of three fully made examples.", `<div class="welcome-choices">
        <button class="button" data-action="world-start" data-kind="blank">Blank world</button>
        <button class="button secondary" data-action="world-start" data-kind="generated">Generate a world seed</button>
      </div><div class="example-grid">${C.world.examples.map((w,i) => `<button class="choice-card" data-action="world-example" data-index="${i}"><span class="mini-tag">Example world</span><h3>${w.title}</h3><p>${w.problem}</p></button>`).join("")}</div>`);
    } else if (app === "mystery") {
      main.innerHTML = welcomeLayout(app, "A map never tells the whole story.", "Choose a case. Visit places in any order, keep only the clues that matter and build a theory before the reveal.", `<div class="scenario-grid">${C.mysteries.map(m => `<button class="choice-card" data-action="mystery-start" data-id="${m.id}"><span class="mini-tag">Complete mystery</span><h3>${m.title}</h3><p>${m.intro}</p></button>`).join("")}</div>`);
    } else if (app === "evidence") {
      main.innerHTML = welcomeLayout(app, "Move the evidence. Change your mind.", "Place sources on the board, group and connect them, then make a claim that can survive a difficult question.", `<div class="scenario-grid">${C.evidenceSets.map(s => `<button class="choice-card" data-action="evidence-start" data-id="${s.id}"><span class="mini-tag">${s.subject}</span><h3>${s.title}</h3><p>${s.question}</p></button>`).join("")}</div>`);
    } else if (app === "inventor") {
      main.innerHTML = welcomeLayout(app, "Useful ideas begin with a real problem.", "Choose a brief, select materials for their properties, make a labelled design and test its trade-offs.", `<div class="welcome-choices"><button class="button secondary" data-action="inventor-custom">Write a custom brief</button></div><div class="brief-grid">${C.inventor.briefs.map(b => `<button class="choice-card" data-action="inventor-start" data-id="${b.id}"><span class="mini-tag">Design brief</span><h3>${b.title}</h3><p>${b.problem}</p></button>`).join("")}</div>`);
    } else {
      main.innerHTML = welcomeLayout(app, "A choice is only the beginning.", "Explore balanced situations where every option helps someone, costs something or creates a result you did not expect.", `<div class="welcome-choices"><button class="button secondary" data-action="consequence-create">Create your own scenario</button></div><div class="scenario-grid">${C.consequences.map(s => `<button class="choice-card" data-action="consequence-start" data-id="${s.id}"><span class="mini-tag">Decision scenario</span><h3>${s.title}</h3><p>${s.setting}</p></button>`).join("")}</div>`);
    }
  }

  function createItem(app, title, data) {
    current = { id: uid(app), app, title, createdAt: Date.now(), updatedAt: Date.now(), data };
    library.items.push(deepCopy(current));
    persistLibrary();
    announce("Saved on this device"); tone();
    return current;
  }

  function queueSave(silent = false) {
    if (!current) return;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => saveCurrent(silent), 350);
  }

  function saveCurrent(silent = true) {
    if (!current) return;
    current.updatedAt = Date.now();
    const index = library.items.findIndex(i => i.id === current.id);
    if (index >= 0) library.items[index] = deepCopy(current);
    else library.items.push(deepCopy(current));
    persistLibrary();
    if (!silent) { announce("Saved on this device"); tone(); }
  }

  function renderCurrent() {
    if (!current) return;
    view = { name: "app", app: current.app };
    if (current.app === "world") renderWorld();
    if (current.app === "mystery") renderMystery();
    if (current.app === "evidence") renderEvidence();
    if (current.app === "inventor") renderInventor();
    if (current.app === "consequence") renderConsequence();
  }

  function steps(items, active) {
    const activeIndex = items.findIndex(i => i.id === active);
    return `<nav class="stepper" aria-label="Activity steps">${items.map((s,i) => `<button class="step ${i === activeIndex ? "current" : ""} ${i < activeIndex ? "done" : ""}" data-action="set-stage" data-stage="${s.id}" ${i > activeIndex ? "disabled" : ""}><span>${i < activeIndex ? "✓" : i+1}</span>${s.label}</button>`).join("")}</nav>`;
  }

  function field(label, name, value, kind = "input", hint = "") {
    const control = kind === "textarea"
      ? `<textarea data-field="${name}">${escapeHTML(value || "")}</textarea>`
      : `<input data-field="${name}" value="${escapeHTML(value || "")}">`;
    return `<label class="field"><span>${label}</span>${control}${hint ? `<small class="field-hint">${hint}</small>` : ""}</label>`;
  }

  function worldBlank() {
    return { stage: "build", terrain: "forest", climate: "", scale: "", inhabitants: "", creatures: "", resources: "", dangers: "", rules: "", customs: "", secret: "", problem: "", promptNotes: [], currentPrompt: C.world.prompts[0], locations: [], links: [], selectedLocation: null };
  }

  function generatedWorld() {
    const g = C.world.generator;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const name = `${pick(["Whisper", "Moss", "Copper", "Silver", "Wandering", "Quiet", "Rain"])} ${pick(["Reach", "Hollow", "Harbour", "Vale", "Crossing", "Circle"] )}`;
    const terrain = pick(g.terrains);
    const locations = g.locationNames.slice().sort(() => Math.random() - .5).slice(0, 3).map((n,i) => ({ id: uid("loc"), name: n, symbol: ["home","tree","gate"][i], x: [17,60,39][i], y: [28,25,67][i], notes: "" }));
    return { ...worldBlank(), title: name, terrain, climate: pick(g.climates), scale: pick(g.scales), inhabitants: pick(g.inhabitants), creatures: pick(g.creatures), resources: pick(g.resources), dangers: pick(g.dangers), rules: pick(g.rules), customs: pick(g.customs), secret: pick(g.secrets), problem: pick(g.problems), locations, links: [[locations[0].id, locations[2].id],[locations[1].id, locations[2].id]] };
  }

  function startWorld(kind, exampleIndex) {
    let data;
    if (kind === "example") data = { ...deepCopy(C.world.examples[exampleIndex]), stage: "build", currentPrompt: C.world.prompts[0], selectedLocation: null };
    else data = kind === "generated" ? generatedWorld() : { ...worldBlank(), title: "Untitled world" };
    createItem("world", data.title, data);
    renderWorld();
  }

  function renderWorld() {
    const d = current.data;
    if (d.stage === "review") return renderReview("world");
    const selected = d.locations.find(l => l.id === d.selectedLocation);
    main.innerHTML = `<div class="workspace-shell">${workspaceHeader("world", current.title)}<div class="workspace-body">
      ${steps([{id:"build",label:"Shape the world"},{id:"review",label:"World profile"}], d.stage)}
      <div class="panel-grid wide-side">
        <aside class="panel stack">
          <div class="panel-header"><div><p class="eyebrow">World notes</p><h2>What is this place?</h2></div></div>
          ${field("World name", "title", current.title)}
          <label class="field"><span>Terrain</span><select data-field="terrain">
            ${[["forest","Forest and roots"],["islands","Islands and water"],["desert","Dry land and stone"],["night","Night landscape"]].map(([v,l]) => `<option value="${v}" ${d.terrain === v ? "selected" : ""}>${l}</option>`).join("")}
          </select></label>
          ${field("Climate", "climate", d.climate)}
          ${field("Scale", "scale", d.scale)}
          ${field("Inhabitants", "inhabitants", d.inhabitants, "textarea")}
          ${field("Creatures", "creatures", d.creatures, "textarea")}
          ${field("Resources", "resources", d.resources, "textarea")}
          ${field("Dangers", "dangers", d.dangers, "textarea")}
          ${field("Important rule", "rules", d.rules, "textarea")}
          ${field("Custom", "customs", d.customs, "textarea")}
          ${field("Secret", "secret", d.secret, "textarea")}
          ${field("Current problem", "problem", d.problem, "textarea")}
        </aside>
        <section class="stack">
          <div class="canvas-panel">
            <div class="panel-header"><div><p class="eyebrow">World board</p><h2>Place the important locations</h2></div><button class="button small-button" data-action="world-add">${icon("plus")} Add place</button></div>
            <div class="map-board terrain-${escapeHTML(d.terrain)}" data-board="world" aria-label="World map. Drag locations to move them.">
              ${worldLinks(d)}
              ${d.locations.length ? d.locations.map(l => `<button class="board-node ${l.id === d.selectedLocation ? "selected" : ""}" style="left:${l.x}%;top:${l.y}%" data-drag-type="world" data-id="${l.id}" data-action="world-select" aria-label="${escapeHTML(l.name)}. Drag to move."><span class="node-symbol">${nodeIcon(l.symbol)}</span><span class="node-name">${escapeHTML(l.name)}</span></button>`).join("") : `<div class="board-empty"><p>Add the first important place to begin the map.</p></div>`}
            </div>
          </div>
          ${selected ? `<div class="panel stack"><div class="panel-header"><h2>Selected place</h2><button class="button danger small-button" data-action="world-delete-location">${icon("trash")} Remove</button></div>
            ${field("Place name", "selected.name", selected.name)}
            <label class="field"><span>Symbol</span><select data-field="selected.symbol">${["home","tree","water","tower","gate","harbour","gear","flag","star"].map(v => `<option ${selected.symbol === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>
            ${field("Notes", "selected.notes", selected.notes, "textarea", "What happens here? Who uses it? What might be found?")}
            <label class="field"><span>Connect this place to</span><select id="world-link-target"><option value="">Choose another place</option>${d.locations.filter(l => l.id !== selected.id).map(l => `<option value="${l.id}">${escapeHTML(l.name)}</option>`).join("")}</select></label>
            <button class="button secondary" data-action="world-link">${icon("link")} Add connection</button>
          </div>` : ""}
          <div class="prompt-card"><p>${escapeHTML(d.currentPrompt)}</p><div class="row wrap"><button class="button small-button" data-action="world-keep-prompt">Keep this question</button><button class="button secondary small-button" data-action="world-shuffle-prompt">${icon("shuffle")} Another</button><button class="text-button" data-action="world-dismiss-prompt">Dismiss</button></div></div>
          ${d.promptNotes.length ? `<div class="panel"><h3>Questions kept for later</h3><ul>${d.promptNotes.map((p,i) => `<li>${escapeHTML(p)} <button class="text-button" data-action="world-remove-prompt" data-index="${i}">remove</button></li>`).join("")}</ul></div>` : ""}
        </section>
      </div>
    </div></div>`;
  }

  function worldLinks(d) {
    const lines = d.links.map(([a,b]) => {
      const p1 = d.locations.find(l => l.id === a), p2 = d.locations.find(l => l.id === b);
      if (!p1 || !p2) return "";
      return `<line x1="${p1.x + 5}" y1="${p1.y + 7}" x2="${p2.x + 5}" y2="${p2.y + 7}"/>`;
    }).join("");
    return `<svg class="board-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>`;
  }

  function startMystery(id) {
    const m = C.mysteries.find(x => x.id === id);
    createItem("mystery", m.title, { stage: "investigate", mysteryId: id, visited: [], selectedLocation: m.locations[0].id, clues: [], clueLinks: [], notes: "", theory: { text: "", evidenceIds: [], hard: "", alternative: "", next: "" }, revealed: false });
    renderMystery();
  }

  function mysteryData() { return C.mysteries.find(m => m.id === current.data.mysteryId); }

  function renderMystery() {
    const d = current.data, m = mysteryData();
    d.clueLinks ||= [];
    if (d.stage === "review") return renderReview("mystery");
    if (d.stage === "theory") return renderMysteryTheory();
    const loc = m.locations.find(l => l.id === d.selectedLocation) || m.locations[0];
    main.innerHTML = `<div class="workspace-shell">${workspaceHeader("mystery", m.question)}<div class="workspace-body">
      ${steps([{id:"investigate",label:"Explore"},{id:"theory",label:"Build a theory"},{id:"review",label:"Case record"}], d.stage)}
      <div class="mystery-layout">
        <aside class="panel"><p class="eyebrow">Case file</p><h2>${m.title}</h2><p>${m.intro}</p><p><strong>Central question</strong><br>${m.question}</p>
          <label class="field"><span>Investigator notes</span><textarea data-field="notes" placeholder="Notice patterns, questions and possible explanations…">${escapeHTML(d.notes)}</textarea></label>
        </aside>
        <section class="stack">
          <div class="mystery-map" aria-label="Mystery locations">
            <svg class="map-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M16 18C30 30 34 38 48 46S65 54 78 67M20 63C35 60 48 46 72 20"/></svg>
            ${m.locations.map(l => `<button class="map-location ${d.visited.includes(l.id) ? "visited" : ""} ${loc.id === l.id ? "active" : ""}" style="left:${l.x}%;top:${l.y}%" data-action="mystery-location" data-id="${l.id}">${icon("mapPin")}<strong>${escapeHTML(l.name)}</strong></button>`).join("")}
          </div>
          <article class="scene-card"><div class="scene-illustration">${sceneArt(m.id, loc.id)}</div><p class="eyebrow">${loc.name}</p><h2>Look closely</h2><p>${loc.scene}</p><blockquote>${loc.character}</blockquote>
            <div class="clue-list">${loc.clues.map(clue => {
              const collected = d.clues.find(c => c.id === clue.id);
              return `<div class="clue-card"><strong>${clue.title}</strong><p>${clue.text}</p>${collected ? `<span class="status-pill">Collected · ${collected.status}</span>` : `<button class="button small-button" data-action="collect-clue" data-id="${clue.id}">Collect clue</button>`}</div>`;
            }).join("")}</div>
          </article>
        </section>
        <aside class="panel"><div class="panel-header"><div><p class="eyebrow">Clue tray</p><h2>${d.clues.length} collected</h2></div></div>
          <div class="clue-list">${d.clues.length ? d.clues.map(c => {
            const clue = findMysteryClue(m, c.id);
            const linked=d.clueLinks.find(pair=>pair.includes(c.id));
            return `<div class="clue-card"><strong>${clue.title}</strong><p>${clue.text}</p><label class="field"><span>My judgement</span><select data-clue-status="${c.id}">${["important","uncertain","connected","possibly misleading"].map(s => `<option ${c.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></label><label class="field"><span>Connect with</span><select data-clue-link="${c.id}"><option value="">No connection</option>${d.clues.filter(other=>other.id!==c.id).map(other=>{const otherClue=findMysteryClue(m,other.id);return`<option value="${other.id}" ${linked?.includes(other.id)?"selected":""}>${escapeHTML(otherClue.title)}</option>`}).join("")}</select></label></div>`;
          }).join("") : `<p class="empty-copy">Collected clues will stay here while you move around the map.</p>`}</div>
          <button class="button" data-action="set-stage" data-stage="theory" ${d.clues.length < 2 ? "disabled" : ""}>Build my theory ${icon("arrow")}</button>
        </aside>
      </div>
    </div></div>`;
  }

  function sceneArt(mystery, location) {
    const seed = (mystery + location).split("").reduce((n,c) => n + c.charCodeAt(0), 0);
    const x = 30 + (seed % 45);
    return `<svg viewBox="0 0 320 190" aria-hidden="true"><path d="M20 164h280M42 164V76l65-35 64 35v88M171 164v-63l53-30 54 30v63"/><path d="M65 164v-53h37v53M118 96h28v31h-28M195 164v-40h34v40M244 113h19v26h-19"/><path d="M${x} 42c18 4 25 17 29 32M${x+29} 74c13-9 29-8 42 1"/><circle cx="270" cy="43" r="15"/></svg>`;
  }

  function findMysteryClue(m, id) {
    for (const l of m.locations) { const c = l.clues.find(x => x.id === id); if (c) return c; }
    return { id, title: "Clue", text: "" };
  }

  function renderMysteryTheory() {
    const d = current.data, m = mysteryData();
    main.innerHTML = `<div class="workspace-shell">${workspaceHeader("mystery", m.question)}<div class="workspace-body">
      ${steps([{id:"investigate",label:"Explore"},{id:"theory",label:"Build a theory"},{id:"review",label:"Case record"}], d.stage)}
      <div class="panel-grid wide-side"><aside class="panel"><p class="eyebrow">Your clue tray</p><h2>Choose supporting clues</h2><div class="clue-list">${d.clues.map(c => { const clue=findMysteryClue(m,c.id); return `<label class="clue-card row"><input type="checkbox" data-theory-clue="${c.id}" ${d.theory.evidenceIds.includes(c.id)?"checked":""}><span><strong>${clue.title}</strong><small>${clue.text}</small></span></label>`; }).join("")}</div><button class="button secondary" data-action="set-stage" data-stage="investigate">Return to map</button></aside>
      <section class="panel stack"><p class="eyebrow">Theory builder</p><h2>${m.question}</h2>
        ${field("What do you think happened?", "theory.text", d.theory.text, "textarea")}
        ${field("Which clue is hardest to explain?", "theory.hard", d.theory.hard, "textarea")}
        ${field("Is there another possible explanation?", "theory.alternative", d.theory.alternative, "textarea")}
        ${field("What would you investigate next?", "theory.next", d.theory.next, "textarea")}
        <div class="prompt-card"><p>A strong theory explains several clues and notices what still does not fit.</p></div>
        <button class="button" data-action="mystery-reveal" ${!d.theory.text.trim() || !d.theory.evidenceIds.length ? "disabled" : ""}>Reveal the resolution</button>
      </section></div>
    </div></div>`;
  }

  function startEvidence(id) {
    const set = C.evidenceSets.find(s => s.id === id);
    createItem("evidence", set.title, { stage: "board", setId: id, placed: [], hidden: [], selected: null, connections: [], claim: "", support: [], contradiction: "", uncertainty: "", nextQuestion: "", notes: [] });
    renderEvidence();
  }

  function evidenceSet() { return C.evidenceSets.find(s => s.id === current.data.setId); }

  function evidenceLinks(d) {
    return `<svg class="board-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${d.connections.map(c => {
      const a=d.placed.find(p=>p.id===c.a), b=d.placed.find(p=>p.id===c.b); if(!a||!b)return"";
      const mx=(a.x+b.x)/2+8,my=(a.y+b.y)/2+6;
      return `<line x1="${a.x+8}" y1="${a.y+7}" x2="${b.x+8}" y2="${b.y+7}"/><text class="connection-label" x="${mx}" y="${my}">${escapeHTML(c.label)}</text>`;
    }).join("")}</svg>`;
  }

  function renderEvidence() {
    const d=current.data,set=evidenceSet();
    if(d.stage==="review") return renderReview("evidence");
    if(d.stage==="claim") return renderEvidenceClaim();
    const available=set.evidence.filter(e=>!d.placed.some(p=>p.id===e.id)&&!d.hidden.includes(e.id));
    const selected=d.placed.find(p=>p.id===d.selected);
    main.innerHTML=`<div class="workspace-shell">${workspaceHeader("evidence",set.question)}<div class="workspace-body">
      ${steps([{id:"board",label:"Arrange evidence"},{id:"claim",label:"Build a claim"},{id:"review",label:"Explanation"}],d.stage)}
      <div class="evidence-layout">
        <aside class="panel"><p class="eyebrow">Evidence tray</p><h2>${set.title}</h2><p>${set.context}</p><p><strong>${set.question}</strong></p><p class="muted small">This is a fictional classroom case using evidence types found in real investigations.</p>
          <div class="evidence-tray">${available.map(e=>`<button class="list-card" data-action="evidence-add" data-id="${e.id}">${evidenceVisual(e)}<span class="evidence-type">${e.type}</span><strong>${e.title}</strong><small>${e.text}</small></button>`).join("")||`<p class="muted small">All visible evidence is on the board.</p>`}</div>
          ${d.hidden.length?`<button class="button secondary small-button" data-action="evidence-restore">Reopen ${d.hidden.length} hidden</button>`:""}
        </aside>
        <section class="canvas-panel"><div class="panel-header"><div><p class="eyebrow">Reasoning board</p><h2>Move, group and connect</h2></div><button class="button small-button" data-action="evidence-note">${icon("plus")} Sticky note</button></div>
          <div class="evidence-board" data-board="evidence" aria-label="Evidence board. Drag evidence cards to arrange them.">${evidenceLinks(d)}
            ${d.placed.map(p=>{const e=set.evidence.find(x=>x.id===p.id)||d.notes.find(x=>x.id===p.id);return e?`<button class="evidence-card ${d.selected===p.id?"selected":""}" data-group="${p.group||""}" style="left:${p.x}%;top:${p.y}%" data-id="${p.id}" data-drag-type="evidence" data-action="evidence-select"><span class="evidence-type">${e.type||"note"}</span><h4>${escapeHTML(e.title)}</h4><p>${escapeHTML(e.text)}</p></button>`:""}).join("")}
            ${!d.placed.length?`<div class="board-empty"><p>Choose evidence from the tray, then place related items near each other.</p></div>`:""}
          </div>
        </section>
        <aside class="panel stack"><p class="eyebrow">Board tools</p><h2>${selected?"Selected evidence":"Select a card"}</h2>
          ${selected?`<div class="chip-list">${["blue","sage","clay","gold"].map(g=>`<button class="chip ${selected.group===g?"active":""}" data-action="evidence-group" data-group="${g}">${g}</button>`).join("")}</div>
            <label class="field"><span>Connect to</span><select id="evidence-link-target"><option value="">Choose evidence</option>${d.placed.filter(p=>p.id!==selected.id).map(p=>{const e=set.evidence.find(x=>x.id===p.id)||d.notes.find(x=>x.id===p.id);return`<option value="${p.id}">${escapeHTML(e?.title||"Note")}</option>`}).join("")}</select></label>
            <label class="field"><span>Relationship</span><select id="evidence-link-label">${["supports","contradicts","caused","happened before","may explain","raises a question","probably unrelated"].map(x=>`<option>${x}</option>`).join("")}</select></label>
            <button class="button secondary" data-action="evidence-link">${icon("link")} Connect</button>
            <button class="button danger small-button" data-action="evidence-hide">Hide from board</button>`:`<p class="empty-copy">Select a card to colour-code it, connect it or hide it.</p>`}
          <div class="prompt-card"><p>Observation: what the source directly shows. Inference: what you think it may mean.</p></div>
          <button class="button" data-action="set-stage" data-stage="claim" ${d.placed.length<2?"disabled":""}>Build a claim ${icon("arrow")}</button>
        </aside>
      </div>
    </div></div>`;
  }

  function renderEvidenceClaim() {
    const d=current.data,set=evidenceSet();
    const unused=d.placed.filter(p=>!d.support.includes(p.id)&&!d.notes.some(n=>n.id===p.id));
    main.innerHTML=`<div class="workspace-shell">${workspaceHeader("evidence",set.question)}<div class="workspace-body">
      ${steps([{id:"board",label:"Arrange evidence"},{id:"claim",label:"Build a claim"},{id:"review",label:"Explanation"}],d.stage)}
      <div class="panel-grid wide-side"><aside class="panel"><p class="eyebrow">Evidence on your board</p><h2>Attach support</h2><div class="clue-list">${d.placed.map(p=>{const e=set.evidence.find(x=>x.id===p.id)||d.notes.find(x=>x.id===p.id);return e?`<label class="clue-card row"><input type="checkbox" data-support-evidence="${p.id}" ${d.support.includes(p.id)?"checked":""}><span><strong>${escapeHTML(e.title)}</strong><small>${escapeHTML(e.text)}</small></span></label>`:""}).join("")}</div><button class="button secondary" data-action="set-stage" data-stage="board">Return to board</button></aside>
        <section class="panel stack"><p class="eyebrow">Theory panel</p><h2>${set.question}</h2>
          ${field("My main claim", "claim", d.claim, "textarea", "Say what you think explains the evidence.")}
          ${field("Conflicting evidence I must address", "contradiction", d.contradiction, "textarea")}
          ${field("What remains uncertain?", "uncertainty", d.uncertainty, "textarea")}
          ${field("What should be investigated next?", "nextQuestion", d.nextQuestion, "textarea")}
          <div class="panel"><h3>Reasoning check</h3><ul>
            <li>${d.support.length>=2?"Your claim has several pieces of support.":"Attach at least two pieces of evidence to strengthen the claim."}</li>
            <li>${unused.length?`${unused.length} board item${unused.length===1?" is":"s are"} not yet used. That can be sensible, but check them.`:"You have considered every board item."}</li>
            <li>${d.contradiction.trim()?"You have noticed evidence that may not fit.":"No contradiction is addressed yet."}</li>
            <li>${d.nextQuestion.trim()?"You have named a useful next question.":"Add one question that the evidence cannot yet answer."}</li>
          </ul></div>
          <button class="button" data-action="review" ${!d.claim.trim()||d.support.length<1?"disabled":""}>Create explanation view</button>
        </section>
      </div>
    </div></div>`;
  }

  function startInventor(id, custom) {
    const brief=custom||C.inventor.briefs.find(b=>b.id===id);
    createItem("inventor", brief.title, { stage:"design", brief:deepCopy(brief), parts:[], selected:null, connections:[], tests:null, iterations:[], strength:"", weakness:"", changeReason:"" });
    renderInventor();
  }

  function designLinks(d) {
    return `<svg class="board-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="design-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" fill="rgba(48,59,100,.55)"/></marker></defs>${d.connections.map(c=>{const a=d.parts.find(p=>p.id===c.a),b=d.parts.find(p=>p.id===c.b);return a&&b?`<line marker-end="url(#design-arrow)" x1="${a.x+5}" y1="${a.y+5}" x2="${b.x+5}" y2="${b.y+5}"/>`:""}).join("")}</svg>`;
  }

  function renderInventor() {
    const d=current.data;
    if(d.stage==="review") return renderReview("inventor");
    if(d.stage==="test") return renderInventorTest();
    const selected=d.parts.find(p=>p.id===d.selected);
    main.innerHTML=`<div class="workspace-shell">${workspaceHeader("inventor",d.brief.problem)}<div class="workspace-body">
      ${steps([{id:"design",label:"Build a design"},{id:"test",label:"Test and improve"},{id:"review",label:"Design sheet"}],d.stage)}
      <div class="design-layout"><aside class="panel"><p class="eyebrow">Parts and materials</p><h2>Choose for a reason</h2><div class="parts-tray">${C.inventor.materials.map(m=>`<button class="part-button" data-action="inventor-add" data-id="${m.id}"><strong>${m.name}</strong><small>${m.properties.slice(0,2).join(" · ")}</small></button>`).join("")}</div></aside>
        <section class="canvas-panel"><div class="panel-header"><div><p class="eyebrow">Design brief</p><h2>${escapeHTML(d.brief.title)}</h2><p>${escapeHTML(d.brief.problem)} <strong>${escapeHTML(d.brief.limits||"")}</strong></p></div></div>
          <div class="design-board" data-board="inventor" aria-label="Design board. Drag parts to move them.">${designLinks(d)}${d.parts.map(p=>{const m=C.inventor.materials.find(x=>x.id===p.material);return`<button class="design-part ${p.id===d.selected?"selected":""}" data-id="${p.id}" data-drag-type="inventor" data-action="inventor-select" style="left:${p.x}%;top:${p.y}%;width:${p.w}px;height:${p.h}px;transform:rotate(${p.rotation}deg)"><span class="part-name">${escapeHTML(p.label||m.name)}</span></button>`}).join("")}${!d.parts.length?`<div class="board-empty"><p>Select materials from the bench. Place only what your idea needs.</p></div>`:""}</div>
        </section>
        <aside class="panel stack"><p class="eyebrow">Design tools</p><h2>${selected?"Selected part":"Your design"}</h2>
          ${selected?`${field("Label", "part.label", selected.label)}${field("What is its job?", "part.job", selected.job, "textarea")}${field("Movement note", "part.movement", selected.movement||"", "textarea", "For example: turns, pulls, slides or stays still")}
            <label class="field"><span>Size</span><input type="range" min="70" max="180" value="${selected.w}" data-field="part.size"></label>
            <div class="row wrap"><button class="button secondary small-button" data-action="inventor-rotate">Rotate 15°</button><button class="button danger small-button" data-action="inventor-remove">Remove</button></div>
            <label class="field"><span>Connect to</span><select id="inventor-link-target"><option value="">Choose a part</option>${d.parts.filter(p=>p.id!==selected.id).map(p=>`<option value="${p.id}">${escapeHTML(p.label||C.inventor.materials.find(m=>m.id===p.material).name)}</option>`).join("")}</select></label><button class="button secondary" data-action="inventor-link">${icon("link")} Connect parts</button>`:`<p class="empty-copy">Select a part to label, resize, rotate or connect it.</p>`}
          <div class="prompt-card"><p>A useful label explains what a part does, not only what it is.</p></div>
          <button class="button" data-action="set-stage" data-stage="test" ${d.parts.length<2?"disabled":""}>Test the design ${icon("test")}</button>
        </aside>
      </div>
    </div></div>`;
  }

  function testDesign() {
    const d=current.data, priorities=d.brief.priorities||["strength","stability","ease"];
    const result={};
    for(const p of priorities){
      const values=d.parts.map(part=>C.inventor.materials.find(m=>m.id===part.material)?.scores[p]??2);
      result[p]=values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length*20):0;
    }
    if(priorities.includes("parts")) result.parts=Math.max(20,100-d.parts.length*9);
    const mats=d.parts.map(p=>C.inventor.materials.find(m=>m.id===p.material));
    const messages=[];
    if(d.parts.length>7) messages.push("It may work, but many parts create more joins that could fail.");
    if(mats.some(m=>m.id==="weight")&&priorities.includes("light")) messages.push("Extra weight may improve stability but makes the design harder to carry.");
    if(mats.some(m=>m.id==="plastic")&&mats.some(m=>m.id==="fabric")) messages.push("Flexible coverings are light, but the joins need careful planning.");
    if(mats.some(m=>m.id==="wheel")&&!mats.some(m=>m.id==="axle")) messages.push("Wheels usually need an axle or another clear way to turn.");
    if(mats.some(m=>m.id==="pulley")&&!mats.some(m=>m.id==="string")) messages.push("A pulley needs a flexible line to transfer the pull.");
    if(!messages.length) messages.push("The parts form a simple system. Look closely at its weakest join and how a person would control it.");
    d.tests={scores:result,messages,number:(d.tests?.number||0)+1,date:Date.now()};
    queueSave();
  }

  function renderInventorTest() {
    const d=current.data;
    main.innerHTML=`<div class="workspace-shell">${workspaceHeader("inventor",d.brief.problem)}<div class="workspace-body">
      ${steps([{id:"design",label:"Build a design"},{id:"test",label:"Test and improve"},{id:"review",label:"Design sheet"}],d.stage)}
      <div class="panel-grid wide-side"><aside class="panel"><p class="eyebrow">Simplified test</p><h2>${escapeHTML(d.brief.title)}</h2><p>This is a reasoning model, not a real scientific simulation. A physical prototype may behave differently.</p><p><strong>Priorities</strong></p><div class="chip-list">${(d.brief.priorities||[]).map(p=>`<span class="tag">${p}</span>`).join("")}</div><button class="button" data-action="inventor-run-test">${icon("test")} ${d.tests?"Test again":"Run first test"}</button><button class="button secondary" data-action="set-stage" data-stage="design">Return to design</button></aside>
        <section class="panel stack"><p class="eyebrow">Test results</p><h2>${d.tests?`Iteration test ${d.tests.number}`:"Ready to test"}</h2>
          ${d.tests?`<div class="stack">${Object.entries(d.tests.scores).map(([k,v])=>`<div class="test-meter"><strong>${k}</strong><div class="meter-track"><div class="meter-fill" style="width:${v}%"></div></div><span>${ratingWord(v)}</span></div>`).join("")}</div><div class="prompt-card"><ul>${d.tests.messages.map(m=>`<li>${escapeHTML(m)}</li>`).join("")}</ul></div>`:`<p class="empty-copy">The test will use material properties and your brief’s priorities to reveal trade-offs.</p>`}
          ${field("One strength", "strength", d.strength, "textarea")}${field("One weakness", "weakness", d.weakness, "textarea")}${field("What will you change, and why may it help?", "changeReason", d.changeReason, "textarea")}
          <div class="row wrap"><button class="button secondary" data-action="inventor-save-iteration" ${!d.tests?"disabled":""}>Save this iteration</button><button class="button" data-action="review" ${!d.tests||!d.strength.trim()||!d.weakness.trim()?"disabled":""}>Create design sheet</button></div>
          ${d.iterations.length?`<div class="panel"><h3>Saved iterations</h3><ol>${d.iterations.map((it,i)=>`<li><strong>Version ${i+1}</strong> · ${it.parts.length} parts · ${Object.keys(it.tests?.scores||{}).map(k=>`${k}: ${ratingWord(it.tests.scores[k])}`).join(", ")}</li>`).join("")}</ol></div>`:""}
        </section>
      </div>
    </div></div>`;
  }

  function ratingWord(value){return value>=80?"strong":value>=60?"promising":value>=40?"mixed":"needs attention";}

  function startConsequence(id, customScenario) {
    const scenario=customScenario||C.consequences.find(s=>s.id===id);
    createItem("consequence",scenario.title,{stage:"play",scenarioId:customScenario?null:id,customScenario:customScenario?deepCopy(customScenario):null,currentNode:"opening",history:[],complete:false,reflection:{intend:"",unexpected:"",benefit:"",difficulty:"",same:"",newOption:""}});
    renderConsequence();
  }

  function scenarioData(){return current.data.customScenario||C.consequences.find(s=>s.id===current.data.scenarioId);}

  function renderConsequence(){
    const d=current.data,s=scenarioData();
    if(d.stage==="review"||d.complete) return renderReview("consequence");
    if(d.stage==="creator") return renderScenarioCreator();
    const node=d.currentNode==="opening"?s.opening:s.nodes[d.currentNode],latest=d.history.at(-1);
    main.innerHTML=`<div class="workspace-shell">${workspaceHeader("consequence",s.title)}<div class="workspace-body">
      ${steps([{id:"play",label:"Make decisions"},{id:"review",label:"Consequence map"}],"play")}
      <div class="consequence-layout"><section class="story-panel"><p class="eyebrow">${d.history.length?"New information":"Opening situation"}</p><h2>${escapeHTML(s.title)}</h2>
        ${latest?`<div class="panel"><h3>What your last choice changed</h3><p><strong>${escapeHTML(latest.immediate)}</strong></p><p><em>Unexpected:</em> ${escapeHTML(latest.unintended)}</p><div class="perspective-grid">${Object.entries(latest.perspectives||{}).map(([person,copy])=>`<div class="perspective"><strong>${escapeHTML(person)}</strong><p>${escapeHTML(copy)}</p></div>`).join("")}</div></div>`:""}
        <p class="lede">${escapeHTML(d.history.length?(node.info||""):s.setting)}</p><h3>${escapeHTML(node.prompt)}</h3>
        <div class="choice-buttons">${node.choices.map(ch=>`<button class="story-choice" data-action="consequence-choice" data-id="${ch.id}"><strong>${escapeHTML(ch.label)}</strong><span class="muted small">Choose and examine the effects</span></button>`).join("")}</div>
      </section><aside class="panel"><p class="eyebrow">Consequence map</p><h2>Your chain so far</h2><div class="consequence-map">${d.history.length?d.history.map(h=>`<div class="consequence-node"><span class="node-kind">Choice</span><strong>${escapeHTML(h.label)}</strong><p>${escapeHTML(h.immediate)}</p><span class="node-kind">Unexpected</span><p>${escapeHTML(h.unintended)}</p></div>`).join(""):`<p class="empty-copy">Each choice and its later effects will appear here.</p>`}</div></aside></div>
    </div></div>`;
  }

  function scenarioCreatorData() {
    return { title:"",setting:"",prompt:"What should happen?",aLabel:"",aImmediate:"",aUnexpected:"",aNext:"What should happen next?",a1Label:"",a1End:"",a2Label:"",a2End:"",bLabel:"",bImmediate:"",bUnexpected:"",bNext:"What should happen next?",b1Label:"",b1End:"",b2Label:"",b2End:"" };
  }

  function renderScenarioCreator(errors=[]) {
    const d=current.data.creator;
    main.innerHTML=`<div class="workspace-shell">${workspaceHeader("consequence","Create a playable branching scenario")}<div class="workspace-body"><div class="page narrow"><section class="panel stack"><p class="eyebrow">Scenario creator</p><h2>Build two decisions and four possible endings</h2><p>Make both first choices reasonable. A strong scenario has trade-offs, not one obviously wrong button.</p>
      ${errors.length?`<div class="prompt-card" role="alert"><strong>Please finish these parts:</strong><ul>${errors.map(e=>`<li>${escapeHTML(e)}</li>`).join("")}</ul></div>`:""}
      ${field("Scenario title","creator.title",d.title)}${field("Opening situation","creator.setting",d.setting,"textarea")}${field("Opening question","creator.prompt",d.prompt)}
      <div class="review-grid"><div class="panel stack"><h3>First choice A</h3>${field("Choice","creator.aLabel",d.aLabel)}${field("Immediate result","creator.aImmediate",d.aImmediate,"textarea")}${field("Unintended consequence","creator.aUnexpected",d.aUnexpected,"textarea")}${field("Second decision","creator.aNext",d.aNext,"textarea")}${field("Final choice A1","creator.a1Label",d.a1Label)}${field("Ending A1","creator.a1End",d.a1End,"textarea")}${field("Final choice A2","creator.a2Label",d.a2Label)}${field("Ending A2","creator.a2End",d.a2End,"textarea")}</div>
      <div class="panel stack"><h3>First choice B</h3>${field("Choice","creator.bLabel",d.bLabel)}${field("Immediate result","creator.bImmediate",d.bImmediate,"textarea")}${field("Unintended consequence","creator.bUnexpected",d.bUnexpected,"textarea")}${field("Second decision","creator.bNext",d.bNext,"textarea")}${field("Final choice B1","creator.b1Label",d.b1Label)}${field("Ending B1","creator.b1End",d.b1End,"textarea")}${field("Final choice B2","creator.b2Label",d.b2Label)}${field("Ending B2","creator.b2End",d.b2End,"textarea")}</div></div>
      <div class="row wrap"><button class="button" data-action="scenario-validate">Check and play</button><button class="button secondary" data-action="home">Cancel</button></div>
    </section></div></div></div>`;
  }

  function makeCustomScenario(c) {
    return {id:uid("custom"),title:c.title,setting:c.setting,opening:{prompt:c.prompt,choices:[
      {id:"a",label:c.aLabel,immediate:c.aImmediate,unintended:c.aUnexpected,perspectives:{"One person":"This choice may help them in one way and challenge them in another."},next:"a-next"},
      {id:"b",label:c.bLabel,immediate:c.bImmediate,unintended:c.bUnexpected,perspectives:{"Another person":"They may experience the choice differently."},next:"b-next"}
    ]},nodes:{"a-next":{info:c.aUnexpected,prompt:c.aNext,choices:[{id:"a1",label:c.a1Label,immediate:"The plan changes.",unintended:"A new question remains.",ending:c.a1End},{id:"a2",label:c.a2Label,immediate:"The alternative is tried.",unintended:"It creates a different trade-off.",ending:c.a2End}]},"b-next":{info:c.bUnexpected,prompt:c.bNext,choices:[{id:"b1",label:c.b1Label,immediate:"The plan changes.",unintended:"A new question remains.",ending:c.b1End},{id:"b2",label:c.b2Label,immediate:"The alternative is tried.",unintended:"It creates a different trade-off.",ending:c.b2End}]}}};
  }

  function renderReview(app) {
    current.data.stage="review";
    queueSave(true);
    const content=reviewContent(app);
    main.innerHTML=`<button class="button presentation-exit" data-action="exit-present">Exit presentation</button><div class="workspace-shell">${workspaceHeader(app,current.title)}<div class="workspace-body">
      <div class="review-toolbar no-print"><button class="button secondary" data-action="return-edit">${icon("back")} Keep editing</button><button class="button" data-action="present">${icon("present")} Present</button><button class="button secondary" data-action="print">${icon("print")} Print</button><button class="button secondary" data-action="export">${icon("download")} Export text</button>${app==="mystery"?`<button class="button secondary" data-action="mystery-reset">${icon("replay")} Replay case</button>`:""}</div>
      <article class="review-sheet">${content}</article>
    </div></div>`;
  }

  function reviewContent(app) {
    const d=current.data;
    if(app==="world") return `<header class="review-hero"><p class="eyebrow">World profile</p><h1>${escapeHTML(current.title)}</h1><p class="lede">${escapeHTML(d.scale||"A newly imagined place")} · ${escapeHTML(d.climate||"Climate not yet described")}</p></header><div class="review-grid">
      <section class="review-section"><h3>World overview</h3><p><strong>Inhabitants:</strong> ${nl2br(d.inhabitants||"Not yet decided")}</p><p><strong>Creatures:</strong> ${nl2br(d.creatures||"Not yet decided")}</p><p><strong>Resources:</strong> ${nl2br(d.resources||"Not yet decided")}</p></section>
      <section class="review-section"><h3>Rules and customs</h3><p>${nl2br(d.rules||"No rule recorded")}</p><p>${nl2br(d.customs||"No custom recorded")}</p></section>
      <section class="review-section" style="grid-column:1/-1"><h3>World map</h3><div class="map-board review-board terrain-${escapeHTML(d.terrain)}">${worldLinks(d)}${d.locations.map(l=>`<div class="board-node" style="left:${l.x}%;top:${l.y}%"><span class="node-symbol">${nodeIcon(l.symbol)}</span><span class="node-name">${escapeHTML(l.name)}</span></div>`).join("")}</div></section>
      <section class="review-section"><h3>Key locations</h3><ul>${d.locations.map(l=>`<li><strong>${escapeHTML(l.name)}</strong> — ${escapeHTML(l.notes||"An important place")}</li>`).join("")||"<li>No locations placed yet.</li>"}</ul></section>
      <section class="review-section"><h3>Pressure and possibility</h3><p><strong>Danger:</strong> ${nl2br(d.dangers||"Unknown")}</p><p><strong>Current problem:</strong> ${nl2br(d.problem||"Not yet decided")}</p><p><strong>Secret:</strong> ${nl2br(d.secret||"Still hidden")}</p></section>
      <section class="review-section"><h3>Unanswered questions</h3><ul>${d.promptNotes.map(p=>`<li>${escapeHTML(p)}</li>`).join("")||"<li>What might change here tomorrow?</li>"}</ul></section>
      <section class="review-section"><h3>Possible story openings</h3><ul><li>The day the usual rule stopped working…</li><li>A visitor arrives at ${escapeHTML(d.locations[0]?.name||"the edge of the world")} carrying something impossible…</li><li>Someone discovers the truth about ${escapeHTML(d.secret||"an old secret")}…</li></ul></section>
    </div>`;
    if(app==="mystery") {
      const m=mysteryData(); const selected=d.theory.evidenceIds.map(id=>findMysteryClue(m,id));
      return `<header class="review-hero"><p class="eyebrow">Investigation record</p><h1>${m.title}</h1><p class="lede">${m.question}</p></header><div class="review-grid">
        <section class="review-section"><h3>Final theory</h3><p>${nl2br(d.theory.text||"No theory recorded")}</p></section>
        <section class="review-section"><h3>Supporting clues</h3><ul>${selected.map(c=>`<li><strong>${c.title}</strong> — ${c.text}</li>`).join("")||"<li>No clues selected.</li>"}</ul></section>
        <section class="review-section"><h3>Reasoning comparison</h3>${m.resolutionClues.filter(id=>d.theory.evidenceIds.includes(id)).length>=2?"<p><strong>Strongly supported:</strong> Your theory uses several clues that matter to the resolution.</p>":"<p><strong>Possible but missing evidence:</strong> Revisit the clues that connect a location, an object and the timing.</p>"}<ul>${selected.map(c=>`<li><strong>${m.resolutionClues.includes(c.id)?"Strongly supported":c.role==="distraction"?"Contradicted by the resolution":"Thoughtful supporting detail"}:</strong> ${escapeHTML(c.title)}</li>`).join("")}</ul><p><strong>Hardest clue:</strong> ${nl2br(d.theory.hard||"Not recorded")}</p></section>
        <section class="review-section"><h3>Resolution</h3><p>${m.solution}</p></section>
        <section class="review-section"><h3>Alternative explanation</h3><p>${nl2br(d.theory.alternative||"None recorded")}</p></section>
        <section class="review-section"><h3>Next investigation</h3><p>${nl2br(d.theory.next||"No next step recorded")}</p></section>
      </div>`;
    }
    if(app==="evidence") {
      const set=evidenceSet(); const supports=d.support.map(id=>set.evidence.find(e=>e.id===id)||d.notes.find(n=>n.id===id)).filter(Boolean);
      return `<header class="review-hero"><p class="eyebrow">Evidence explanation</p><h1>${set.title}</h1><p class="lede">${set.question}</p></header><div class="review-grid">
        <section class="review-section" style="grid-column:1/-1"><h3>Evidence board</h3><div class="evidence-board review-board">${evidenceLinks(d)}${d.placed.map(p=>{const e=set.evidence.find(x=>x.id===p.id)||d.notes.find(x=>x.id===p.id);return e?`<div class="evidence-card" data-group="${p.group||""}" style="left:${p.x}%;top:${p.y}%"><span class="evidence-type">${e.type||"note"}</span><h4>${escapeHTML(e.title)}</h4><p>${escapeHTML(e.text)}</p></div>`:""}).join("")}</div></section>
        <section class="review-section"><h3>Main claim</h3><p>${nl2br(d.claim||"No claim recorded")}</p></section>
        <section class="review-section"><h3>Supporting evidence</h3><ul>${supports.map(e=>`<li><strong>${e.title}</strong> — ${e.text}</li>`).join("")||"<li>No supporting evidence attached.</li>"}</ul></section>
        <section class="review-section"><h3>Conflicting evidence</h3><p>${nl2br(d.contradiction||"No contradiction recorded")}</p></section>
        <section class="review-section"><h3>Remaining uncertainty</h3><p>${nl2br(d.uncertainty||"No uncertainty recorded")}</p></section>
        <section class="review-section"><h3>Next question</h3><p>${nl2br(d.nextQuestion||"No next question recorded")}</p></section>
        <section class="review-section"><h3>Board summary</h3><p>${d.placed.length} evidence items placed · ${d.connections.length} relationships drawn · ${d.hidden.length} hidden items</p></section>
      </div>`;
    }
    if(app==="inventor") {
      return `<header class="review-hero"><p class="eyebrow">Final design sheet</p><h1>${escapeHTML(current.title)}</h1><p class="lede">${escapeHTML(d.brief.problem)}</p></header><div class="review-grid">
        <section class="review-section" style="grid-column:1/-1"><h3>Labelled plan</h3><div class="design-board review-board">${designLinks(d)}${d.parts.map(p=>{const m=C.inventor.materials.find(x=>x.id===p.material);return`<div class="design-part" style="left:${p.x}%;top:${p.y}%;width:${p.w}px;height:${p.h}px;transform:rotate(${p.rotation}deg)"><span class="part-name">${escapeHTML(p.label||m.name)}</span></div>`}).join("")}</div></section>
        <section class="review-section"><h3>Chosen materials</h3><ul>${d.parts.map(p=>{const m=C.inventor.materials.find(x=>x.id===p.material);return`<li><strong>${escapeHTML(p.label||m.name)}</strong> — ${escapeHTML(p.job||"job not yet explained")}${p.movement?` Movement: ${escapeHTML(p.movement)}.`:""} <small>(${m.properties.join(", ")})</small></li>`}).join("")}</ul></section>
        <section class="review-section"><h3>Simplified test</h3>${d.tests?Object.entries(d.tests.scores).map(([k,v])=>`<p><strong>${k}:</strong> ${ratingWord(v)}</p>`).join(""):"<p>Not tested yet.</p>"}</section>
        <section class="review-section"><h3>One strength</h3><p>${nl2br(d.strength||"Not recorded")}</p></section>
        <section class="review-section"><h3>One weakness</h3><p>${nl2br(d.weakness||"Not recorded")}</p></section>
        <section class="review-section"><h3>Improvement</h3><p>${nl2br(d.changeReason||"Not recorded")}</p></section>
        <section class="review-section"><h3>Iterations</h3><p>${d.iterations.length} saved version${d.iterations.length===1?"":"s"}. A real prototype is the next test.</p></section>
      </div>`;
    }
    const s=scenarioData();
    return `<header class="review-hero"><p class="eyebrow">Consequence map</p><h1>${escapeHTML(s.title)}</h1><p class="lede">${escapeHTML(s.setting)}</p></header><div class="review-grid">
      <section class="review-section"><h3>Decision chain</h3>${d.history.map((h,i)=>`<p><strong>${i+1}. ${escapeHTML(h.label)}</strong><br>${escapeHTML(h.immediate)}<br><em>Unexpected: ${escapeHTML(h.unintended)}</em></p>`).join("")}</section>
      <section class="review-section"><h3>Where it led</h3><p>${escapeHTML(d.ending||"The outcome is still unfolding.")}</p></section>
      <section class="review-section" style="grid-column:1/-1"><h3>Perspectives affected</h3><div class="perspective-grid">${d.history.flatMap(h=>Object.entries(h.perspectives||{})).map(([person,copy])=>`<div class="perspective"><strong>${escapeHTML(person)}</strong><p>${escapeHTML(copy)}</p></div>`).join("")||"<p>No perspectives recorded.</p>"}</div></section>
      <section class="review-section"><h3>What did you intend?</h3>${field("", "reflection.intend", d.reflection.intend, "textarea")}</section>
      <section class="review-section"><h3>What was unexpected?</h3>${field("", "reflection.unexpected", d.reflection.unexpected, "textarea")}</section>
      <section class="review-section"><h3>Who benefited? Who had difficulty?</h3>${field("Who benefited", "reflection.benefit", d.reflection.benefit, "textarea")}${field("Who had difficulty", "reflection.difficulty", d.reflection.difficulty, "textarea")}</section>
      <section class="review-section"><h3>Would you choose it again?</h3>${field("Your judgement", "reflection.same", d.reflection.same, "textarea")}${field("A new option you would create", "reflection.newOption", d.reflection.newOption, "textarea")}</section>
    </div>`;
  }

  function returnEdit() {
    if(!current)return;
    const stages={world:"build",mystery:"theory",evidence:"claim",inventor:"test",consequence:current.data.complete?"review":"play"};
    current.data.stage=stages[current.app];
    if(current.app==="consequence"&&current.data.complete) current.data.complete=false;
    renderCurrent();
  }

  function renderLibrary() {
    view={name:"library"}; current=null;
    const items=[...library.items].sort((a,b)=>b.updatedAt-a.updatedAt);
    main.innerHTML=`<div class="library-page"><p class="eyebrow">Saved on this device</p><h1>Your creations</h1><p class="lede">Clearing browser data may remove this work. Export or print anything you need to keep elsewhere.</p>
      <div class="row wrap" style="margin-bottom:1.5rem"><button class="button secondary" data-action="home">${icon("back")} Workshop</button>${items.length?`<button class="button danger" data-action="reset-library">Reset all saved work</button>`:""}</div>
      <section class="library-grid">${items.length?items.map(i=>`<article class="library-card"><div><p class="eyebrow">${C.apps[i.app]?.name||"Workshop"}</p><h2>${escapeHTML(i.title)}</h2><p class="muted small">Edited ${formatDate(i.updatedAt)}</p></div><div class="library-preview">${icon(i.app)}</div><div class="library-actions"><button class="button small-button" data-action="continue" data-id="${i.id}">Continue</button><button class="button secondary small-button" data-action="rename-item" data-id="${i.id}">Rename</button><button class="button secondary small-button" data-action="duplicate" data-id="${i.id}">Duplicate</button><button class="button secondary small-button" data-action="library-present" data-id="${i.id}">Present</button><button class="button secondary small-button" data-action="library-print" data-id="${i.id}">Print</button><button class="button danger small-button" data-action="delete-item" data-id="${i.id}" aria-label="Delete ${escapeHTML(i.title)}">${icon("trash")}</button></div></article>`).join(""):`<p class="empty-copy">Nothing is saved yet. Choose a space and begin.</p>`}</section>
    </div>`;
    window.scrollTo(0,0);
  }

  function openModal(content, wide=false) {
    modalRoot.innerHTML=`<div class="modal-backdrop" role="presentation" data-action="modal-backdrop"><section class="modal ${wide?"wide":""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">${content}</section></div>`;
    modalRoot.querySelector("button, input, textarea, select")?.focus();
  }
  function closeModal(){modalRoot.innerHTML="";}

  function settingsModal(){
    openModal(`<div class="modal-header"><div><p class="eyebrow">Settings</p><h2 id="modal-title">Make the space comfortable</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div>
      ${[["sound","Gentle sounds","Short confirmation tones only"],["reducedMotion","Reduced motion","Remove movement effects"],["largeText","Larger text","Increase text throughout the Workshop"],["simplified","Simplified screens","Hide non-essential decoration"]].map(([key,title,copy])=>`<div class="setting-row"><div><strong>${title}</strong><div class="muted small">${copy}</div></div><label class="switch"><input type="checkbox" data-setting="${key}" ${settings[key]?"checked":""}><span></span></label></div>`).join("")}
      <button class="button" data-action="fullscreen">Enter full screen</button>`);
  }

  function helpModal(){
    openModal(`<div class="modal-header"><div><p class="eyebrow">Help</p><h2 id="modal-title">How The Workshop works</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div>
      <div class="stack"><div><h3>Choose a space</h3><p>Each room begins with a complete example, a starting point or a blank option.</p></div><div><h3>Make and investigate</h3><p>Use the large controls. On boards, drag cards or objects with a finger, mouse or trackpad.</p></div><div><h3>Your work stays here</h3><p>Work saves automatically in this browser. It is not uploaded. Clearing browser data may remove it.</p></div><div><h3>Review, present and print</h3><p>Use Review to create a calm final view, then present full-screen, print on A4 or export a text summary.</p></div></div>
      <div class="row wrap"><button class="button secondary" data-action="replay-onboarding">Replay introduction</button><button class="button" data-action="close-modal">Done</button></div>`);
  }

  function onboarding(screen=0){
    const cards=[
      {icon:"world",title:"Choose a space",copy:"Five doorways lead to making, investigation, evidence, design and decisions."},
      {icon:"inventor",title:"Make, investigate or decide",copy:"There are no points to chase. The reward is something you can explain and share."},
      {icon:"save",title:"Saved on this device",copy:"Your work stays in this browser. No account, real name or internet upload is needed."}
    ];
    openModal(`<div class="onboarding" data-screen="${screen}">${cards.map((c,i)=>`<div class="screen ${i===screen?"active":""}"><div class="onboarding-illustration">${icon(c.icon)}</div><p class="eyebrow">${i+1} of 3</p><h2 id="modal-title">${c.title}</h2><p class="lede">${c.copy}</p></div>`).join("")}<div class="row between"><button class="text-button" data-action="onboarding-skip">Skip</button><button class="button" data-action="onboarding-next">${screen===2?"Enter The Workshop":"Next"} ${icon("arrow")}</button></div></div>`);
  }

  function exportText(){
    if(!current)return;
    const temp=document.createElement("div"); temp.innerHTML=reviewContent(current.app);
    const text=`THE WORKSHOP\n${current.title}\n${C.apps[current.app].name}\n\n${temp.innerText.replace(/\n{3,}/g,"\n\n")}`;
    const blob=new Blob([text],{type:"text/plain"}); const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=`${current.title.replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"")||"workshop-creation"}.txt`; a.click(); URL.revokeObjectURL(url); announce("Text summary exported");
  }

  function setNested(root,path,value){
    const bits=path.split("."); let target=root;
    for(let i=0;i<bits.length-1;i++) target=target[bits[i]];
    target[bits.at(-1)]=value;
  }

  function handleField(el){
    if(!current)return;
    const path=el.dataset.field; let value=el.value;
    if(path==="title"){current.title=value||"Untitled world";current.data.title=current.title;}
    else if(path.startsWith("selected.")){const loc=current.data.locations.find(l=>l.id===current.data.selectedLocation);if(loc)setNested(loc,path.replace("selected.",""),value);}
    else if(path.startsWith("part.")){const part=current.data.parts.find(p=>p.id===current.data.selected);if(part){const key=path.slice(5);if(key==="size"){part.w=Number(value);part.h=Math.round(Number(value)*.62);}else part[key]=value;}}
    else if(path.startsWith("creator.")) setNested(current.data.creator,path.slice(8),value);
    else setNested(current.data,path,value);
    queueSave(true);
    refreshActionAvailability();
  }

  function refreshActionAvailability(){
    if(!current)return;
    if(current.app==="mystery"&&current.data.stage==="theory"){
      const button=document.querySelector('[data-action="mystery-reveal"]');
      if(button)button.disabled=!current.data.theory.text.trim()||!current.data.theory.evidenceIds.length;
    }
    if(current.app==="evidence"&&current.data.stage==="claim"){
      const button=document.querySelector('.panel.stack > [data-action="review"]');
      if(button)button.disabled=!current.data.claim.trim()||!current.data.support.length;
    }
    if(current.app==="inventor"&&current.data.stage==="test"){
      const button=document.querySelector('.panel.stack [data-action="review"]');
      if(button)button.disabled=!current.data.tests||!current.data.strength.trim()||!current.data.weakness.trim();
    }
  }

  document.addEventListener("click", event => {
    const el=event.target.closest("[data-action]"); if(!el)return;
    const action=el.dataset.action;
    if(action==="home") return renderHome();
    if(action==="library") return renderLibrary();
    if(action==="help") return helpModal();
    if(action==="settings") return settingsModal();
    if(action==="close-modal") return closeModal();
    if(action==="modal-backdrop"&&event.target===el) return closeModal();
    if(action==="open-app") return openApp(el.dataset.app);
    if(action==="continue") return openApp(library.items.find(i=>i.id===el.dataset.id)?.app,el.dataset.id);
    if(action==="manual-save") return saveCurrent(false);
    if(action==="review") { if(current){current.data.stage="review";saveCurrent(true);renderReview(current.app);} return; }
    if(action==="return-edit") return returnEdit();
    if(action==="print") return window.print();
    if(action==="export") return exportText();
    if(action==="present") {document.body.classList.add("presentation-mode");document.documentElement.requestFullscreen?.().catch(()=>{});return;}
    if(action==="exit-present") {document.body.classList.remove("presentation-mode");if(document.fullscreenElement)document.exitFullscreen?.();return;}
    if(action==="fullscreen") {closeModal();document.documentElement.requestFullscreen?.().catch(()=>announce("Full screen is not available in this browser"));return;}
    if(action==="world-start") return startWorld(el.dataset.kind);
    if(action==="world-example") return startWorld("example",Number(el.dataset.index));
    if(action==="world-select"){current.data.selectedLocation=el.dataset.id;renderWorld();return;}
    if(action==="world-add") return openWorldLocationModal();
    if(action==="world-save-location") return saveWorldLocation();
    if(action==="world-delete-location") return confirmWorldLocationDelete();
    if(action==="confirm-world-location-delete") return deleteWorldLocation();
    if(action==="world-link") {const target=document.querySelector("#world-link-target")?.value,from=current.data.selectedLocation;if(target&&from&&!current.data.links.some(p=>p.includes(from)&&p.includes(target))){current.data.links.push([from,target]);queueSave();renderWorld();}return;}
    if(action==="world-shuffle-prompt"){const others=C.world.prompts.filter(p=>p!==current.data.currentPrompt);current.data.currentPrompt=others[Math.floor(Math.random()*others.length)];renderWorld();queueSave();return;}
    if(action==="world-keep-prompt"){if(!current.data.promptNotes.includes(current.data.currentPrompt))current.data.promptNotes.push(current.data.currentPrompt);announce("Question kept");queueSave();return;}
    if(action==="world-dismiss-prompt"){current.data.currentPrompt="What detail would make this world feel real?";renderWorld();return;}
    if(action==="world-remove-prompt"){current.data.promptNotes.splice(Number(el.dataset.index),1);queueSave();renderWorld();return;}
    if(action==="mystery-start") return startMystery(el.dataset.id);
    if(action==="mystery-location"){current.data.selectedLocation=el.dataset.id;if(!current.data.visited.includes(el.dataset.id))current.data.visited.push(el.dataset.id);queueSave();renderMystery();return;}
    if(action==="collect-clue"){current.data.clues.push({id:el.dataset.id,status:"uncertain"});announce("Clue added to the tray");tone();queueSave();renderMystery();return;}
    if(action==="mystery-reveal"){current.data.revealed=true;current.data.stage="review";saveCurrent(true);renderReview("mystery");return;}
    if(action==="mystery-reset") return confirmMysteryReset();
    if(action==="confirm-mystery-reset") return resetMystery();
    if(action==="evidence-start") return startEvidence(el.dataset.id);
    if(action==="evidence-add"){const n=current.data.placed.length;current.data.placed.push({id:el.dataset.id,x:6+(n%3)*29,y:8+Math.floor(n/3)*23,group:""});queueSave();renderEvidence();return;}
    if(action==="evidence-select"){current.data.selected=el.dataset.id;renderEvidence();return;}
    if(action==="evidence-group"){const p=current.data.placed.find(x=>x.id===current.data.selected);if(p)p.group=el.dataset.group;queueSave();renderEvidence();return;}
    if(action==="evidence-hide"){const id=current.data.selected;current.data.placed=current.data.placed.filter(p=>p.id!==id);current.data.connections=current.data.connections.filter(c=>c.a!==id&&c.b!==id);if(!current.data.notes.some(n=>n.id===id))current.data.hidden.push(id);current.data.selected=null;queueSave();renderEvidence();return;}
    if(action==="evidence-restore"){current.data.hidden=[];queueSave();renderEvidence();return;}
    if(action==="evidence-note") return openEvidenceNoteModal();
    if(action==="evidence-save-note") return saveEvidenceNote();
    if(action==="evidence-link"){const target=document.querySelector("#evidence-link-target")?.value,label=document.querySelector("#evidence-link-label")?.value,from=current.data.selected;if(target&&from){current.data.connections.push({a:from,b:target,label});queueSave();renderEvidence();}return;}
    if(action==="inventor-start") return startInventor(el.dataset.id);
    if(action==="inventor-custom") return openInventorBriefModal();
    if(action==="inventor-save-custom") return saveInventorBrief();
    if(action==="inventor-add"){const n=current.data.parts.length;current.data.parts.push({id:uid("part"),material:el.dataset.id,x:10+(n%4)*20,y:12+Math.floor(n/4)*20,w:100,h:62,rotation:0,label:"",job:"",movement:""});queueSave();renderInventor();return;}
    if(action==="inventor-select"){current.data.selected=el.dataset.id;renderInventor();return;}
    if(action==="inventor-rotate"){const p=current.data.parts.find(x=>x.id===current.data.selected);if(p)p.rotation=(p.rotation+15)%360;queueSave();renderInventor();return;}
    if(action==="inventor-remove"){const id=current.data.selected;current.data.parts=current.data.parts.filter(p=>p.id!==id);current.data.connections=current.data.connections.filter(c=>c.a!==id&&c.b!==id);current.data.selected=null;queueSave();renderInventor();return;}
    if(action==="inventor-link"){const target=document.querySelector("#inventor-link-target")?.value,from=current.data.selected;if(target&&from&&!current.data.connections.some(c=>c.a===from&&c.b===target||c.a===target&&c.b===from)){current.data.connections.push({a:from,b:target});queueSave();renderInventor();}return;}
    if(action==="inventor-run-test"){testDesign();renderInventorTest();return;}
    if(action==="inventor-save-iteration"){current.data.iterations.push({parts:deepCopy(current.data.parts),connections:deepCopy(current.data.connections),tests:deepCopy(current.data.tests),strength:current.data.strength,weakness:current.data.weakness,changeReason:current.data.changeReason});announce("Iteration saved for comparison");queueSave();renderInventorTest();return;}
    if(action==="consequence-start") return startConsequence(el.dataset.id);
    if(action==="consequence-choice") return chooseConsequence(el.dataset.id);
    if(action==="consequence-create"){createItem("consequence","Untitled scenario",{stage:"creator",creator:scenarioCreatorData(),history:[],reflection:{intend:"",unexpected:"",benefit:"",difficulty:"",same:"",newOption:""}});renderScenarioCreator();return;}
    if(action==="scenario-validate") return validateScenario();
    if(action==="set-stage"){current.data.stage=el.dataset.stage;queueSave();renderCurrent();return;}
    if(action==="duplicate") return duplicateItem(el.dataset.id);
    if(action==="rename-item") return renameItemModal(el.dataset.id);
    if(action==="confirm-rename") return renameItem(el.dataset.id);
    if(action==="delete-item") return confirmDelete(el.dataset.id);
    if(action==="confirm-delete") return deleteItem(el.dataset.id);
    if(action==="reset-library") return confirmReset();
    if(action==="confirm-reset"){library={version:DATA_VERSION,items:[]};persistLibrary();closeModal();renderLibrary();announce("Saved work removed from this device");return;}
    if(action==="library-present"||action==="library-print"){const item=library.items.find(i=>i.id===el.dataset.id);if(item){openApp(item.app,item.id);current.data.stage="review";renderReview(item.app);window.setTimeout(()=>action==="library-print"?window.print():document.querySelector('[data-action="present"]')?.click(),100);}return;}
    if(action==="replay-onboarding"){closeModal();onboarding(0);return;}
    if(action==="onboarding-skip"){localStorage.setItem(ONBOARDING_KEY,"done");closeModal();return;}
    if(action==="onboarding-next"){const box=modalRoot.querySelector(".onboarding");const screen=Number(box?.dataset.screen||0);if(screen>=2){localStorage.setItem(ONBOARDING_KEY,"done");closeModal();}else onboarding(screen+1);return;}
  });

  document.addEventListener("input",event=>{const el=event.target;if(el.matches("[data-field]"))handleField(el);});
  document.addEventListener("change",event=>{
    const el=event.target;
    if(el.matches("[data-field]")){handleField(el);if(["terrain","selected.symbol"].includes(el.dataset.field))renderCurrent();}
    if(el.matches("[data-setting]")){settings[el.dataset.setting]=el.checked;applySettings();}
    if(el.matches("[data-clue-status]")){const c=current.data.clues.find(x=>x.id===el.dataset.clueStatus);if(c)c.status=el.value;queueSave();}
    if(el.matches("[data-clue-link]")){const from=el.dataset.clueLink,to=el.value;current.data.clueLinks||=[];current.data.clueLinks=current.data.clueLinks.filter(pair=>!pair.includes(from));if(to){current.data.clueLinks.push([from,to]);const clue=current.data.clues.find(c=>c.id===from);if(clue)clue.status="connected";announce("Clues connected");}queueSave();}
    if(el.matches("[data-theory-clue]")){toggleArray(current.data.theory.evidenceIds,el.dataset.theoryClue,el.checked);queueSave();refreshActionAvailability();}
    if(el.matches("[data-support-evidence]")){toggleArray(current.data.support,el.dataset.supportEvidence,el.checked);queueSave();refreshActionAvailability();}
  });

  function toggleArray(arr,value,on){const i=arr.indexOf(value);if(on&&i<0)arr.push(value);if(!on&&i>=0)arr.splice(i,1);}

  function openWorldLocationModal(){openModal(`<div class="modal-header"><div><p class="eyebrow">World map</p><h2 id="modal-title">Add an important place</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><div class="stack"><label class="field"><span>Place name</span><input id="new-location-name" autofocus></label><label class="field"><span>Symbol</span><select id="new-location-symbol">${["home","tree","water","tower","gate","harbour","gear","flag","star"].map(v=>`<option>${v}</option>`).join("")}</select></label><label class="field"><span>What happens here?</span><textarea id="new-location-notes"></textarea></label><button class="button" data-action="world-save-location">Add to map</button></div>`);}
  function saveWorldLocation(){const name=document.querySelector("#new-location-name")?.value.trim();if(!name)return announce("Give the place a name");const n=current.data.locations.length;const loc={id:uid("loc"),name,symbol:document.querySelector("#new-location-symbol").value,notes:document.querySelector("#new-location-notes").value,x:10+(n%4)*21,y:12+Math.floor(n/4)*23};current.data.locations.push(loc);current.data.selectedLocation=loc.id;closeModal();queueSave();renderWorld();}
  function confirmWorldLocationDelete(){const loc=current.data.locations.find(l=>l.id===current.data.selectedLocation);if(!loc)return;openModal(`<div class="modal-header"><div><p class="eyebrow">World map</p><h2 id="modal-title">Remove ${escapeHTML(loc.name)}?</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><p>The place and its map connections will be removed.</p><div class="row wrap"><button class="button danger" data-action="confirm-world-location-delete">Remove place</button><button class="button secondary" data-action="close-modal">Keep it</button></div>`);}
  function deleteWorldLocation(){const id=current.data.selectedLocation;current.data.locations=current.data.locations.filter(l=>l.id!==id);current.data.links=current.data.links.filter(pair=>!pair.includes(id));current.data.selectedLocation=null;closeModal();queueSave();renderWorld();announce("Place removed");}
  function confirmMysteryReset(){openModal(`<div class="modal-header"><div><p class="eyebrow">Replay case</p><h2 id="modal-title">Start this mystery again?</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><p>Your collected clues, notes and theory in this saved case will be cleared.</p><div class="row wrap"><button class="button danger" data-action="confirm-mystery-reset">Reset and replay</button><button class="button secondary" data-action="close-modal">Keep my work</button></div>`);}
  function resetMystery(){const m=mysteryData();current.data={stage:"investigate",mysteryId:m.id,visited:[],selectedLocation:m.locations[0].id,clues:[],clueLinks:[],notes:"",theory:{text:"",evidenceIds:[],hard:"",alternative:"",next:""},revealed:false};closeModal();saveCurrent(true);renderMystery();announce("Case reset");}
  function openEvidenceNoteModal(){openModal(`<div class="modal-header"><div><p class="eyebrow">Sticky note</p><h2 id="modal-title">Add your thinking</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><div class="stack"><label class="field"><span>Label</span><input id="note-title" value="My note"></label><label class="field"><span>Observation, inference, claim or question</span><select id="note-type"><option>observation</option><option>inference</option><option>claim</option><option>question</option><option>contradiction</option><option>conclusion</option></select></label><label class="field"><span>Your note</span><textarea id="note-text"></textarea></label><button class="button" data-action="evidence-save-note">Place on board</button></div>`);}
  function saveEvidenceNote(){const text=document.querySelector("#note-text")?.value.trim();if(!text)return announce("Write something on the note first");const id=uid("note"),n=current.data.placed.length;current.data.notes.push({id,title:document.querySelector("#note-title").value||"My note",type:document.querySelector("#note-type").value,text});current.data.placed.push({id,x:8+(n%3)*28,y:10+Math.floor(n/3)*22,group:"gold"});closeModal();queueSave();renderEvidence();}
  function openInventorBriefModal(){openModal(`<div class="modal-header"><div><p class="eyebrow">Custom brief</p><h2 id="modal-title">What needs solving?</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><div class="stack"><label class="field"><span>Brief title</span><input id="brief-title"></label><label class="field"><span>Practical problem</span><textarea id="brief-problem"></textarea></label><label class="field"><span>Limits</span><input id="brief-limits" placeholder="For example: use no more than six parts"></label><fieldset class="panel"><legend>Choose three priorities</legend><div class="chip-list">${["strength","stability","light","waterproof","movement","ease","visibility","control","parts"].map(p=>`<label class="chip"><input type="checkbox" name="brief-priority" value="${p}">${p}</label>`).join("")}</div></fieldset><button class="button" data-action="inventor-save-custom">Begin designing</button></div>`);}
  function saveInventorBrief(){const title=document.querySelector("#brief-title")?.value.trim(),problem=document.querySelector("#brief-problem")?.value.trim(),priorities=[...document.querySelectorAll('[name="brief-priority"]:checked')].map(x=>x.value);if(!title||!problem||priorities.length<2)return announce("Add a title, a problem and at least two priorities");closeModal();startInventor(null,{id:uid("brief"),title,problem,priorities:priorities.slice(0,3),limits:document.querySelector("#brief-limits")?.value||""});}
  function chooseConsequence(id){const d=current.data,s=scenarioData(),node=d.currentNode==="opening"?s.opening:s.nodes[d.currentNode],choice=node.choices.find(c=>c.id===id);if(!choice)return;d.history.push({label:choice.label,immediate:choice.immediate,unintended:choice.unintended,perspectives:choice.perspectives||{}});tone();if(choice.ending){d.ending=choice.ending;d.complete=true;d.stage="review";saveCurrent(true);renderReview("consequence");}else{d.currentNode=choice.next;queueSave();renderConsequence();}}
  function validateScenario(){const c=current.data.creator;const labels={title:"scenario title",setting:"opening situation",aLabel:"first choice A",aImmediate:"result of choice A",aUnexpected:"unintended consequence A",aNext:"second decision A",a1Label:"final choice A1",a1End:"ending A1",a2Label:"final choice A2",a2End:"ending A2",bLabel:"first choice B",bImmediate:"result of choice B",bUnexpected:"unintended consequence B",bNext:"second decision B",b1Label:"final choice B1",b1End:"ending B1",b2Label:"final choice B2",b2End:"ending B2"};const errors=Object.entries(labels).filter(([k])=>!String(c[k]||"").trim()).map(([,v])=>v);if(errors.length)return renderScenarioCreator(errors);const scenario=makeCustomScenario(c);current.title=scenario.title;current.data={stage:"play",scenarioId:null,customScenario:scenario,currentNode:"opening",history:[],complete:false,reflection:{intend:"",unexpected:"",benefit:"",difficulty:"",same:"",newOption:""}};saveCurrent(true);renderConsequence();announce("Branches checked — your scenario is ready to play");}
  function duplicateItem(id){const source=library.items.find(i=>i.id===id);if(!source)return;const copy=deepCopy(source);copy.id=uid(copy.app);copy.title=`${copy.title} — copy`;copy.createdAt=copy.updatedAt=Date.now();library.items.push(copy);persistLibrary();renderLibrary();announce("Creation duplicated");}
  function renameItemModal(id){const item=library.items.find(i=>i.id===id);if(!item)return;openModal(`<div class="modal-header"><div><p class="eyebrow">Saved work</p><h2 id="modal-title">Rename this creation</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><div class="stack"><label class="field"><span>Title</span><input id="rename-title" value="${escapeHTML(item.title)}"></label><button class="button" data-action="confirm-rename" data-id="${id}">Save new title</button></div>`);}
  function renameItem(id){const item=library.items.find(i=>i.id===id),title=document.querySelector("#rename-title")?.value.trim();if(!item||!title)return announce("Add a title first");item.title=title;item.updatedAt=Date.now();if(item.data&&"title" in item.data)item.data.title=title;persistLibrary();closeModal();renderLibrary();announce("Creation renamed");}
  function confirmDelete(id){const item=library.items.find(i=>i.id===id);if(!item)return;openModal(`<div class="modal-header"><div><p class="eyebrow">Delete saved work</p><h2 id="modal-title">Remove “${escapeHTML(item.title)}”?</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><p>This cannot be undone after it is removed from this browser.</p><div class="row wrap"><button class="button danger" data-action="confirm-delete" data-id="${id}">Delete permanently</button><button class="button secondary" data-action="close-modal">Keep it</button></div>`);}
  function deleteItem(id){library.items=library.items.filter(i=>i.id!==id);persistLibrary();closeModal();renderLibrary();announce("Saved work removed");}
  function confirmReset(){openModal(`<div class="modal-header"><div><p class="eyebrow">Reset library</p><h2 id="modal-title">Delete every saved creation?</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><p>This removes all Workshop work from this browser and cannot be undone. Export anything important first.</p><div class="row wrap"><button class="button danger" data-action="confirm-reset">Delete everything</button><button class="button secondary" data-action="close-modal">Cancel</button></div>`);}

  document.addEventListener("pointerdown",event=>{
    const el=event.target.closest("[data-drag-type]"); if(!el||!current)return;
    const board=el.closest("[data-board]"); if(!board)return;
    event.preventDefault();
    const type=el.dataset.dragType,id=el.dataset.id,rect=board.getBoundingClientRect();
    drag={type,id,el,board,rect,startX:event.clientX,startY:event.clientY,left:parseFloat(el.style.left)||0,top:parseFloat(el.style.top)||0,moved:false};
    el.setPointerCapture?.(event.pointerId);
  });
  document.addEventListener("pointermove",event=>{
    if(!drag)return; const dx=(event.clientX-drag.startX)/drag.rect.width*100,dy=(event.clientY-drag.startY)/drag.rect.height*100;
    if(Math.abs(dx)+Math.abs(dy)>.5)drag.moved=true;
    const x=Math.max(0,Math.min(86,drag.left+dx)),y=Math.max(0,Math.min(86,drag.top+dy));
    drag.el.style.left=`${x}%`;drag.el.style.top=`${y}%`;
    const list=drag.type==="world"?current.data.locations:drag.type==="evidence"?current.data.placed:current.data.parts;
    const item=list.find(x=>x.id===drag.id);if(item){item.x=Number(x.toFixed(2));item.y=Number(y.toFixed(2));}
  });
  document.addEventListener("pointerup",event=>{if(!drag)return;if(drag.moved){event.preventDefault();event.stopPropagation();queueSave(true);window.setTimeout(()=>{drag=null;},0);}else drag=null;},{capture:true});

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"){if(modalRoot.innerHTML)closeModal();else if(document.body.classList.contains("presentation-mode"))document.querySelector('[data-action="exit-present"]')?.click();return;}
    const el=event.target.closest?.("[data-drag-type]");
    if(!el||!current||!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key))return;
    event.preventDefault();
    const type=el.dataset.dragType,id=el.dataset.id,list=type==="world"?current.data.locations:type==="evidence"?current.data.placed:current.data.parts,item=list.find(x=>x.id===id);
    if(!item)return;
    const amount=event.shiftKey?5:2;
    if(event.key==="ArrowLeft")item.x=Math.max(0,item.x-amount);
    if(event.key==="ArrowRight")item.x=Math.min(86,item.x+amount);
    if(event.key==="ArrowUp")item.y=Math.max(0,item.y-amount);
    if(event.key==="ArrowDown")item.y=Math.min(86,item.y+amount);
    el.style.left=`${item.x}%`;el.style.top=`${item.y}%`;queueSave(true);
  });
  document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement)document.body.classList.remove("presentation-mode");});

  applySettings();
  renderHome();
  if(!localStorage.getItem(ONBOARDING_KEY)) window.setTimeout(()=>onboarding(0),300);
})();
