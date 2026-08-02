(function () {
  "use strict";

  const LIBRARY_KEY = "the-workshop-library";
  const SETTINGS_KEY = "the-workshop-settings";
  const SCHEMA = 2;
  const copy = value => JSON.parse(JSON.stringify(value));
  const uid = (prefix = "item") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const escape = (value = "") => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

  const defaultSettings = {
    sound: true,
    ambience: true,
    reducedSound: false,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    highClarity: false,
    largeText: false,
    lockedCamera: false
  };

  let settings = read(SETTINGS_KEY, defaultSettings);
  let library = loadLibrary();
  let current = null;
  let renderHook = () => {};
  let announceTimer = 0;
  let saveTimer = 0;
  let focusReturn = null;
  const histories = new Map();
  const activePointers = new Map();
  let drag = null;
  let pinch = null;

  function read(key, fallback) {
    try { return Object.assign({}, fallback, JSON.parse(localStorage.getItem(key) || "null") || {}); }
    catch { return copy(fallback); }
  }

  function migrateItem(source) {
    const item = copy(source);
    const isLegacy = Number(source.schema || 1) < SCHEMA;
    item.schema = SCHEMA;
    item.preview = item.preview || null;
    item.legacySnapshot ||= isLegacy ? copy(source.data) : null;
    const d = item.data || {};
    if (item.app === "world") {
      d.tiles ||= Array.from({length: 96}, (_, i) => i > 72 ? "water" : i % 17 < 4 ? "forest" : "meadow");
      d.objects ||= (d.locations || []).map((place, index) => ({id: place.id || uid("place"), type: iconToWorld(place.symbol), name: place.name, x: place.x || 15 + index * 12, y: place.y || 20 + index * 9, note: place.notes || "", state: "calm"}));
      d.people ||= [];
      d.weather ||= "sun";
      d.season ||= "spring";
      d.time ||= "day";
      d.waterLevel ??= 2;
      d.tool ||= "raise";
      d.palette ||= "terrain";
      d.camera ||= {x:0,y:0,zoom:1};
      d.events ||= [];
      d.discoveries ||= [];
      d.tour ||= 0;
    }
    if (item.app === "mystery") {
      d.stage ||= "investigate";
      d.visited ||= [];
      d.clues ||= [];
      d.clueLinks ||= [];
      d.timeline ||= [];
      d.theories ||= d.theory?.text ? [{id:uid("theory"), pieces:{cause:"",object:"",place:"",time:"",action:""}, clueIds:d.theory.evidenceIds || [], note:d.theory.text}] : [];
      d.tool ||= "hand";
      d.hints ||= 0;
      d.replayStep ||= 0;
    }
    if (item.app === "evidence") {
      d.placed ||= [];
      d.hidden ||= [];
      d.connections ||= [];
      d.notes ||= [];
      d.tool ||= "hand";
      d.flipped ||= [];
      d.revealed ||= [];
      d.support ||= [];
      d.claimToken ||= {x:43,y:38};
    }
    if (item.app === "inventor") {
      d.parts ||= [];
      d.connections ||= [];
      d.versions ||= d.iterations || [];
      d.testHistory ||= d.tests ? [d.tests] : [];
      d.environment ||= {wind:2,water:1,slope:1,load:2};
      d.tool ||= "hand";
      d.testMotion ||= null;
    }
    if (item.app === "consequence") {
      d.history ||= [];
      d.savedPaths ||= [];
      d.resources ||= [{id:uid("resource"),type:"water",x:12,y:65},{id:uid("resource"),type:"material",x:22,y:72}];
      d.sceneState ||= {nature:3,people:3,access:3,resources:3,time:0};
      d.comparePath ||= null;
    }
    item.data = d;
    return item;
  }

  function iconToWorld(symbol) {
    return ({home:"village",tree:"treehouse",water:"harbour",tower:"observatory",gate:"gate",harbour:"harbour",gear:"windmill",flag:"market",star:"lighthouse"})[symbol] || "village";
  }

  function loadLibrary() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LIBRARY_KEY) || "null");
      if (!parsed || !Array.isArray(parsed.items)) return {version:SCHEMA,items:[],migratedAt:null};
      const oldVersion = Number(parsed.version || 1);
      const items = parsed.items.map(item => migrateItem({...item, schema:oldVersion}));
      const next = {version:SCHEMA,items,migratedAt:oldVersion < SCHEMA ? Date.now() : parsed.migratedAt || null};
      if (oldVersion < SCHEMA) localStorage.setItem(LIBRARY_KEY, JSON.stringify(next));
      return next;
    } catch {
      return {version:SCHEMA,items:[],migratedAt:null,recoveryError:true};
    }
  }

  function persist(silent = true) {
    try {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
      setSaveState("Saved on this device");
      if (!silent) announce("Saved on this device");
      return true;
    } catch {
      setSaveState("Could not save");
      announce("Storage is full — export this creation");
      return false;
    }
  }

  function queueSave() {
    if (!current) return;
    clearTimeout(saveTimer);
    current.updatedAt = Date.now();
    const index = library.items.findIndex(item => item.id === current.id);
    if (index < 0) library.items.push(copy(current));
    else library.items[index] = copy(current);
    setSaveState("Saving…");
    saveTimer = setTimeout(() => persist(true), 260);
  }

  function setSaveState(text) {
    document.querySelectorAll("[data-save-state]").forEach(el => el.textContent = text);
  }

  function create(app, title, data) {
    current = {id:uid(app),app,title:title || "Untitled",createdAt:Date.now(),updatedAt:Date.now(),schema:SCHEMA,data};
    library.items.push(copy(current));
    histories.set(current.id,{undo:[],redo:[]});
    persist(true);
    announce("Saved on this device");
    return current;
  }

  function open(id) {
    const found = library.items.find(item => item.id === id);
    current = found ? copy(found) : null;
    if (current && !histories.has(id)) histories.set(id,{undo:[],redo:[]});
    return current;
  }

  function saveCurrent(silent = true) {
    if (!current) return false;
    current.updatedAt = Date.now();
    const index = library.items.findIndex(item => item.id === current.id);
    if (index < 0) library.items.push(copy(current));
    else library.items[index] = copy(current);
    return persist(silent);
  }

  function mutate(label, fn, rerender = true) {
    if (!current) return;
    const history = histories.get(current.id) || {undo:[],redo:[]};
    history.undo.push({label,data:copy(current.data),title:current.title});
    if (history.undo.length > 35) history.undo.shift();
    history.redo.length = 0;
    histories.set(current.id,history);
    fn(current.data,current);
    queueSave();
    if (rerender) renderHook();
  }

  function commitSnapshot(label, snapshot, rerender = true) {
    if (!current || JSON.stringify(snapshot.data) === JSON.stringify(current.data)) return;
    const history = histories.get(current.id) || {undo:[],redo:[]};
    history.undo.push({label,data:snapshot.data,title:snapshot.title});
    if (history.undo.length > 35) history.undo.shift();
    history.redo.length = 0;
    histories.set(current.id,history);
    queueSave();
    if (rerender) renderHook();
  }

  function undo() {
    if (!current) return;
    const history = histories.get(current.id);
    const step = history?.undo.pop();
    if (!step) return announce("Nothing to undo");
    history.redo.push({label:step.label,data:copy(current.data),title:current.title});
    current.data = step.data;
    current.title = step.title;
    queueSave();
    renderHook();
    announce(`Undid ${step.label}`);
  }

  function redo() {
    if (!current) return;
    const history = histories.get(current.id);
    const step = history?.redo.pop();
    if (!step) return announce("Nothing to redo");
    history.undo.push({label:step.label,data:copy(current.data),title:current.title});
    current.data = step.data;
    current.title = step.title;
    queueSave();
    renderHook();
    announce(`Redid ${step.label}`);
  }

  function historyState() {
    const h = current ? histories.get(current.id) : null;
    return {undo:!!h?.undo.length,redo:!!h?.redo.length};
  }

  function rename(id, title) {
    const item = library.items.find(x => x.id === id);
    if (!item || !title.trim()) return false;
    item.title = title.trim(); item.updatedAt = Date.now(); persist(true); return true;
  }

  function duplicate(id) {
    const source = library.items.find(x => x.id === id);
    if (!source) return null;
    const item = copy(source); item.id=uid(item.app); item.title += " · copy"; item.createdAt=item.updatedAt=Date.now(); item.schema=SCHEMA;
    library.items.push(item); persist(true); return item;
  }

  function remove(id) {
    library.items = library.items.filter(item => item.id !== id);
    if (current?.id === id) current = null;
    persist(true);
  }

  function resetLibrary() {
    library = {version:SCHEMA,items:[],migratedAt:null}; current=null; histories.clear(); persist(true);
  }

  function applySettings() {
    document.documentElement.dataset.motion = settings.reducedMotion ? "reduced" : "full";
    document.documentElement.dataset.clarity = settings.highClarity ? "high" : "standard";
    document.documentElement.dataset.text = settings.largeText ? "large" : "standard";
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));
  }

  function setSetting(key,value) { settings[key]=value; applySettings(); renderHook(); }

  function announce(message) {
    const live = document.querySelector("#live-region");
    const toast = document.querySelector("#toast-region");
    if (live) { live.textContent=""; requestAnimationFrame(()=>live.textContent=message); }
    if (toast) {
      clearTimeout(announceTimer); toast.textContent=message; toast.classList.add("visible");
      announceTimer=setTimeout(()=>toast.classList.remove("visible"),2200);
    }
  }

  function sound(kind = "place") {
    if (!settings.sound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc=ctx.createOscillator(),gain=ctx.createGain();
      const frequency={place:360,discover:540,test:210,open:420,error:145}[kind]||360;
      osc.type = kind === "test" ? "triangle" : "sine"; osc.frequency.value=frequency;
      gain.gain.setValueAtTime(settings.reducedSound?.018:.035,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.13);
      osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+.14);
      osc.onended=()=>ctx.close();
    } catch { /* Optional sound. */ }
  }

  function speak(text, target) {
    if (!("speechSynthesis" in window)) return announce("Speech is not available here");
    speechSynthesis.cancel();
    document.querySelectorAll(".speaking").forEach(el=>el.classList.remove("speaking"));
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang="en-GB"; utterance.rate=.92;
    if (target) target.classList.add("speaking");
    utterance.onend=()=>target?.classList.remove("speaking");
    utterance.onerror=()=>target?.classList.remove("speaking");
    speechSynthesis.speak(utterance);
  }

  function stopSpeech() { if ("speechSynthesis" in window) speechSynthesis.cancel(); document.querySelectorAll(".speaking").forEach(el=>el.classList.remove("speaking")); }

  function modal(html, options = {}) {
    focusReturn = document.activeElement;
    const root=document.querySelector("#modal-root");
    root.innerHTML=`<div class="modal-shade" data-action="close-modal"><section class="modal ${options.wide?"modal-wide":""}" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-modal>${html}</section></div>`;
    root.querySelectorAll("button").forEach(control=>{if(!control.getAttribute("aria-label")&&!control.textContent.trim())control.setAttribute("aria-label",(control.dataset.action||"control").replace(/-/g," "));});
    root.querySelector("button:not([disabled]),input,select,textarea")?.focus();
  }

  function closeModal() {
    document.querySelector("#modal-root").innerHTML="";
    focusReturn?.focus?.(); focusReturn=null;
  }

  function exportJSON(item = current) {
    const payload = item ? {kind:"workshop-creation",version:SCHEMA,item:copy(item)} : {kind:"workshop-library",version:SCHEMA,library:copy(library)};
    download(`${item?.title || "the-workshop-library"}.workshop.json`,JSON.stringify(payload,null,2),"application/json");
  }

  function exportSummary(html,title) {
    const holder=document.createElement("div");holder.innerHTML=html;
    download(`${title || "workshop-creation"}.txt`,holder.innerText.replace(/\n{3,}/g,"\n\n"),"text/plain");
  }

  function download(name,content,type) {
    const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const link=document.createElement("a");
    link.href=url;link.download=name.replace(/[\\/:*?"<>|]+/g,"-");link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  async function importJSON(file) {
    try {
      const parsed=JSON.parse(await file.text());
      if (parsed.kind === "workshop-creation" && parsed.item?.app) {
        const item=migrateItem(parsed.item); item.id=uid(item.app); item.title=`${item.title} · imported`; item.updatedAt=Date.now();
        library.items.push(item);persist(true);announce("Creation imported");return item;
      }
      if (parsed.kind === "workshop-library" && Array.isArray(parsed.library?.items)) {
        const incoming=parsed.library.items.map(migrateItem).map(item=>({...item,id:uid(item.app),updatedAt:Date.now()}));
        library.items.push(...incoming);persist(true);announce(`${incoming.length} creations imported`);return incoming[0]||null;
      }
      throw new Error("Unrecognised file");
    } catch { announce("That file could not be imported"); return null; }
  }

  function setRender(fn) { renderHook=fn; }
  function snapshot() { return current ? {data:copy(current.data),title:current.title} : null; }

  function beginMove(event, el) {
    const board=el.closest("[data-move-board]");
    if (!board || !current || event.button > 0) return;
    const object=window.WorkshopApp?.findMovable?.(el.dataset.moveKind,el.dataset.move);
    if(object?.locked){announce("Unlock this part first");return;}
    const rect=board.getBoundingClientRect();
    drag={el,board,rect,id:el.dataset.move,kind:el.dataset.moveKind,startX:event.clientX,startY:event.clientY,left:parseFloat(el.style.left)||0,top:parseFloat(el.style.top)||0,moved:false,snapshot:snapshot(),pointerId:event.pointerId};
    el.setPointerCapture?.(event.pointerId); document.body.classList.add("is-dragging"); event.preventDefault();
  }

  document.addEventListener("pointerdown",event=>{
    activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    const moveEl=event.target.closest?.("[data-move]");
    if (moveEl) beginMove(event,moveEl);
    const camera=event.target.closest?.("[data-camera-board]");
    if (camera && activePointers.size===2) {
      const points=[...activePointers.values()]; pinch={board:camera,distance:Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)};
    }
  });

  document.addEventListener("pointermove",event=>{
    if (activePointers.has(event.pointerId)) activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if (pinch && activePointers.size===2) {
      const points=[...activePointers.values()],distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);
      if (Math.abs(distance-pinch.distance)>9) { window.WorkshopApp?.zoom?.(distance > pinch.distance ? .08 : -.08,false); pinch.distance=distance; }
      event.preventDefault(); return;
    }
    if (!drag || drag.pointerId!==event.pointerId) return;
    const dx=(event.clientX-drag.startX)/drag.rect.width*100,dy=(event.clientY-drag.startY)/drag.rect.height*100;
    if (Math.abs(dx)+Math.abs(dy)>.8) drag.moved=true;
    const x=clamp(drag.left+dx,1,88),y=clamp(drag.top+dy,2,86);
    drag.el.style.left=`${x}%`;drag.el.style.top=`${y}%`;
    window.WorkshopApp?.move?.(drag.kind,drag.id,x,y,false);
    event.preventDefault();
  },{passive:false});

  document.addEventListener("pointerup",event=>{
    activePointers.delete(event.pointerId); if(activePointers.size<2)pinch=null;
    if (!drag || drag.pointerId!==event.pointerId) return;
    const ended=drag;drag=null;document.body.classList.remove("is-dragging");
    if (ended.moved) {
      const target=document.elementFromPoint(event.clientX,event.clientY)?.closest?.("[data-drop]");
      if (target && window.WorkshopApp?.drop) window.WorkshopApp.drop(ended.kind,ended.id,target.dataset.drop);
      commitSnapshot("move object",ended.snapshot,false); queueSave();
      event.preventDefault();event.stopPropagation();
    }
  },{capture:true});

  document.addEventListener("pointercancel",event=>{activePointers.delete(event.pointerId);drag=null;pinch=null;document.body.classList.remove("is-dragging");});

  document.addEventListener("keydown",event=>{
    if (event.key === "Escape") { stopSpeech(); if(document.querySelector("[data-modal]"))closeModal(); return; }
    const modal=document.querySelector("[data-modal]");
    if(modal&&event.key==="Tab"){
      const focusable=[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
      if(focusable.length){const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
    }
    if ((event.metaKey||event.ctrlKey) && event.key.toLowerCase()==="z") {event.preventDefault();event.shiftKey?redo():undo();return;}
    if ((event.metaKey||event.ctrlKey) && event.key.toLowerCase()==="y") {event.preventDefault();redo();return;}
    const el=event.target.closest?.("[data-move]");
    if (!el || !["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return;
    event.preventDefault(); const object=window.WorkshopApp?.findMovable?.(el.dataset.moveKind,el.dataset.move); if(!object)return;
    const before=snapshot(),amount=event.shiftKey?5:2;
    if(event.key==="ArrowLeft")object.x=clamp(object.x-amount,1,88);
    if(event.key==="ArrowRight")object.x=clamp(object.x+amount,1,88);
    if(event.key==="ArrowUp")object.y=clamp(object.y-amount,2,86);
    if(event.key==="ArrowDown")object.y=clamp(object.y+amount,2,86);
    commitSnapshot("move object",before);renderHook();
  });

  document.addEventListener("visibilitychange",()=>{if(document.hidden)saveCurrent(true);});
  window.addEventListener("pagehide",()=>saveCurrent(true));
  applySettings();

  window.WorkshopCore = {
    SCHEMA,copy,uid,clamp,escape,get settings(){return settings;},get library(){return library;},get current(){return current;},set current(value){current=value;},
    create,open,saveCurrent,queueSave,persist,mutate,commitSnapshot,snapshot,undo,redo,historyState,rename,duplicate,remove,resetLibrary,
    setSetting,applySettings,announce,sound,speak,stopSpeech,modal,closeModal,exportJSON,exportSummary,importJSON,setRender
  };
})();
