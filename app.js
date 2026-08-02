(function () {
  "use strict";

  const C=window.WORKSHOP_CONTENT, B=C.build2, Core=window.WorkshopCore, V=window.WorkshopVisuals;
  const main=document.querySelector("#main");
  let route={page:"home",mode:"edit",drawer:null};
  let worldPainting=false;
  let pendingConnection=[];

  Core.setRender(render);

  const E=Core.escape;
  const appNames={world:"Tiny World Builder",mystery:"Mystery Map",evidence:"The Evidence Room",inventor:"Inventor’s Bench",consequence:"Choose the Consequence"};
  const appPrompts={world:"Shape your world",mystery:"Look closer",evidence:"Move the evidence",inventor:"Build something that helps",consequence:"What should happen next?"};
  const appColours={world:"#71856f",mystery:"#657d99",evidence:"#826c8e",inventor:"#b8755e",consequence:"#ad843e"};

  function render(){
    document.body.dataset.app=route.page;
    document.body.classList.toggle("presentation",route.mode==="present");
    document.querySelector(".topbar")?.classList.toggle("workspace-topbar",!["home","library"].includes(route.page));
    if(route.page==="home")renderHome();
    else if(route.page==="library")renderLibrary();
    else if(route.page==="world")renderWorld();
    else if(route.page==="mystery")renderMystery();
    else if(route.page==="evidence")renderEvidence();
    else if(route.page==="inventor")renderInventor();
    else if(route.page==="consequence")renderConsequence();
    refreshGlobalBar();
    document.querySelectorAll("button").forEach(control=>{if(!control.getAttribute("aria-label")&&!control.textContent.trim()){control.setAttribute("aria-label",(control.dataset.action||"control").replace(/-/g," "));}});
  }

  function refreshGlobalBar(){
    const isHome=route.page==="home", current=Core.current, history=Core.historyState();
    document.querySelector("[data-brand-title]").textContent=isHome?"The Workshop":appNames[route.page]||"The Workshop";
    document.querySelector("[data-brand-subtitle]").textContent=isHome?"Five living places":appPrompts[route.page]||"Imagine · investigate · build";
    document.querySelectorAll("[data-workspace-only]").forEach(el=>el.hidden=!current||isHome||route.page==="library");
    const u=document.querySelector('[data-action="undo"]'),r=document.querySelector('[data-action="redo"]');
    if(u)u.disabled=!history.undo;if(r)r.disabled=!history.redo;
    const sound=document.querySelector('[data-action="toggle-sound"]'),wave=document.querySelector('[data-sound-wave]'),label=document.querySelector('[data-sound-label]');
    if(sound)sound.setAttribute("aria-label",Core.settings.sound?"Mute sounds":"Turn on sounds");
    if(wave)wave.style.display=Core.settings.sound?"":"none";
    if(label)label.textContent=Core.settings.sound?"Sound":"Muted";
  }

  function button(action,label,icon,extra="",kind="tool-button"){
    return `<button class="${kind}" data-action="${action}" ${extra} aria-label="${E(label)}">${V.icon(icon)}<span>${E(label)}</span></button>`;
  }

  function workspace(app,scene,tray="",context=""){
    return `<section class="play-space app-${app}" aria-label="${appNames[app]}">
      <div class="scene-shell">${scene}</div>
      ${context?`<aside class="context-float" data-context>${context}</aside>`:""}
      ${tray?`<nav class="play-tray" aria-label="Tools">${tray}</nav>`:""}
      <div class="save-whisper"><span class="save-dot"></span><span data-save-state>Saved on this device</span></div>
    </section>`;
  }

  function renderHome(){
    route.mode="edit";Core.saveCurrent(true);Core.current=null;
    const latest=[...Core.library.items].sort((a,b)=>b.updatedAt-a.updatedAt)[0];
    main.innerHTML=`<div class="workshop-home">
      <div class="room-stage">${V.workshopRoom()}
        ${homePortal("world","Map table","Raise a mountain","7%","12%","28%","35%")}
        ${homePortal("mystery","Mystery map","Follow the light","37%","10%","23%","33%")}
        ${homePortal("evidence","Evidence wall","Reveal a clue","65%","7%","30%","38%")}
        ${homePortal("inventor","Inventor’s bench","Make it move","7%","50%","41%","40%")}
        ${homePortal("consequence","Branching road","Change the scene","53%","48%","42%","43%")}
        <button class="portfolio-drawer" data-action="library" aria-label="Open saved creations">${V.icon("folder")}<span>Creation drawer</span><b>${Core.library.items.length}</b></button>
      </div>
      <div class="home-caption"><p>The Workshop</p><h1>Touch a place. See it change.</h1><span>Five worlds for imagining, investigating and building.</span></div>
      ${latest?`<button class="recent-object" data-action="continue" data-id="${latest.id}">${V.icon(latest.app)}<span><small>Last creation</small><strong>${E(latest.title)}</strong></span></button>`:""}
    </div>`;
  }

  function homePortal(app,title,copy,left,top,width,height){
    return `<button class="room-portal portal-${app}" style="left:${left};top:${top};width:${width};height:${height}" data-action="enter-app" data-app="${app}"><span class="portal-pulse">${V.icon(app)}</span><span class="portal-label"><strong>${title}</strong><small>${copy}</small></span></button>`;
  }

  function startDefault(app,id=null){
    pendingConnection=[];
    if(id){Core.open(id);route={page:Core.current.app,mode:"edit",drawer:null};render();return;}
    if(app==="world")Core.create("world","New living world",newWorld("island"));
    if(app==="mystery")Core.create("mystery",C.mysteries[0].title,newMystery(C.mysteries[0].id));
    if(app==="evidence")Core.create("evidence",C.evidenceSets[0].title,newEvidence(C.evidenceSets[0].id));
    if(app==="inventor")Core.create("inventor",C.inventor.briefs[0].title,newInventor(C.inventor.briefs[0]));
    if(app==="consequence")Core.create("consequence",C.consequences[0].title,newConsequence(C.consequences[0].id));
    route={page:app,mode:"edit",drawer:null};render();
    setTimeout(()=>showGesture(app),500);
  }

  function newWorld(seed="island"){
    const tiles=Array.from({length:96},(_,i)=>{
      const row=Math.floor(i/12),col=i%12;
      if(seed==="desert")return row>5?"rock":"sand";
      if(seed==="mountain")return Math.abs(col-6)+Math.abs(row-4)<4?"rock":"meadow";
      if(seed==="forest")return i%5?"forest":"meadow";
      if(seed==="archipelago")return ((col*7+row*3)%11<4)?"meadow":"water";
      if(seed==="valley")return col<3||col>8?"rock":row>5?"water":"meadow";
      if(seed==="strange")return ["snow","forest","sand","water"][(col+row*2)%4];
      if(seed==="blank")return"meadow";
      return row<1||row>6||col<1||col>10?"water":((row+col)%7===0?"forest":"meadow");
    });
    return {schema:2,seed,tiles,elevation:Array(96).fill(1),objects:[],people:[],weather:"sun",season:"spring",time:"day",waterLevel:2,tool:"raise",palette:"terrain",selected:null,camera:{x:0,y:0,zoom:1},events:[],discoveries:[],tour:0,caption:""};
  }

  function newMystery(id){
    const m=C.mysteries.find(x=>x.id===id);
    return {schema:2,mysteryId:id,locationId:m.locations[0].id,visited:[m.locations[0].id],clues:[],clueLinks:[],timeline:[],theories:[],selectedClues:[],tool:"hand",hints:0,replayStep:0,mode:"scene",revealed:false};
  }

  function newEvidence(id){
    const set=C.evidenceSets.find(x=>x.id===id);
    return {schema:2,setId:id,placed:set.evidence.slice(0,3).map((e,i)=>({id:e.id,x:12+i*23,y:18+i*10,rotation:(i-1)*3,scale:1,group:""})),hidden:[],connections:[],selected:[],tool:"hand",flipped:[],revealed:[],support:[],claim:"",claimToken:{x:43,y:42},creator:null};
  }

  function newInventor(brief){
    return {schema:2,brief:Core.copy(brief),parts:[],connections:[],selected:[],tool:"hand",versions:[],testHistory:[],environment:{wind:2,water:1,slope:1,load:2},testMotion:null,camera:{zoom:1}};
  }

  function newConsequence(id){
    return {schema:2,scenarioId:id,currentNode:"opening",history:[],savedPaths:[],resources:[{id:Core.uid("token"),type:"resource",x:12,y:69},{id:Core.uid("token"),type:"people",x:22,y:75}],sceneState:{nature:3,people:3,access:3,resources:3,time:0},complete:false,ending:"",comparePath:null,creator:null};
  }

  function showGesture(app){
    if(localStorage.getItem(`workshop-seen-${app}`))return;
    localStorage.setItem(`workshop-seen-${app}`,"1");
    const messages={world:"Drag a tool across the land",mystery:"Open the glowing object",evidence:"Move two pieces together",inventor:"Place a part on the bench",consequence:"Move a token to a choice"};
    const target=document.querySelector(".gesture-target,.world-tile,.scene-hotspot,.evidence-piece,.part-choice,.decision-token");
    target?.classList.add("gesture-demo");Core.announce(messages[app]);setTimeout(()=>target?.classList.remove("gesture-demo"),2600);
  }

  function renderWorld(){
    const item=Core.current;if(!item)return renderHome();const d=item.data;
    if(route.mode==="present")return renderWorldTour();
    const reactions=worldReactions(d), selected=[...d.objects,...d.people].find(o=>o.id===d.selected);
    const cells=d.tiles.map((tile,i)=>`<button class="world-tile tile-${tile} level-${d.elevation?.[i]||1}" data-action="world-paint" data-index="${i}" aria-label="${tile} land, level ${d.elevation?.[i]||1}"><span>${terrainGlyph(tile)}</span></button>`).join("");
    const objects=d.objects.map(o=>`<button class="world-place ${o.id===d.selected?"selected":""} reaction-${reactions[o.id]?.state||"calm"}" style="left:${o.x}%;top:${o.y}%" data-move="${o.id}" data-move-kind="world-object" data-action="world-select" data-id="${o.id}" aria-label="${E(o.name||worldObject(o.type).name)}. Drag to move.">${V.miniWorld(o.type,reactions[o.id]?.state)}<span>${E(o.name||worldObject(o.type).name)}</span>${reactions[o.id]?.need?`<i class="need-bubble">${reactions[o.id].need}</i>`:""}</button>`).join("");
    const people=d.people.map(p=>`<button class="world-person ${p.id===d.selected?"selected":""}" style="left:${p.x}%;top:${p.y}%" data-move="${p.id}" data-move-kind="world-person" data-action="world-select" data-id="${p.id}" aria-label="${E(p.name)}. Drag to move.">${V.person(p.type,p.need)}<span>${E(p.name)}</span></button>`).join("");
    const event=d.events.at(-1);
    const scene=`<div class="world-stage weather-${d.weather} time-${d.time} season-${d.season}" data-camera-board data-move-board>
      <div class="world-sky"><span class="sun-moon"></span><i class="cloud cloud-a"></i><i class="cloud cloud-b"></i><div class="weather-layer"></div></div>
      <div class="world-grid" style="--world-zoom:${d.camera?.zoom||1}">${cells}</div>${objects}${people}
      ${event&&!event.resolved?worldEventCard(event):""}
      ${d.discoveries.length?`<div class="discovery-ribbon">✦ ${E(d.discoveries.at(-1))}</div>`:""}
      <div class="scene-invitation"><strong>Shape your world</strong><span>${worldSummary(d)}</span></div>
      <div class="camera-tools">${button("zoom-out","Zoom out","zoomOut")}${button("zoom-in","Zoom in","zoomIn")}${button("fit-view","Fit world","fit")}</div>
    </div>`;
    const tray=`<div class="tray-tabs">${trayTab("terrain","Land",d.palette)}${trayTab("places","Places",d.palette)}${trayTab("people","People",d.palette)}${trayTab("weather","Weather",d.palette)}</div>${worldTray(d)}`;
    const context=selected?worldContext(selected,d,reactions):`<button class="round-action" data-action="world-event">${V.icon("play")}<span>New event</span></button><button class="round-action" data-action="present">${V.icon("map")}<span>World tour</span></button><button class="round-action" data-action="switch-content">${V.icon("folder")}<span>World seeds</span></button>`;
    main.innerHTML=workspace("world",scene,tray,context);
  }

  function terrainGlyph(tile){return B.terrains.find(t=>t.id===tile)?.glyph||"·";}
  function worldObject(type){return B.worldObjects.find(x=>x.id===type)||B.worldObjects[0];}
  function trayTab(id,label,active){return `<button class="tray-tab ${id===active?"active":""}" data-action="world-palette" data-id="${id}">${label}</button>`;}

  function worldTray(d){
    if(d.palette==="terrain")return `<div class="tool-row">${["raise","lower"].map(t=>`<button class="object-tool ${d.tool===t?"active":""}" data-action="world-tool" data-id="${t}">${V.icon(t==="raise"?"zoomIn":"zoomOut")}<span>${t}</span></button>`).join("")}${B.terrains.map(t=>`<button class="swatch-tool ${d.tool===t.id?"active":""}" style="--swatch:${t.colour}" data-action="world-tool" data-id="${t.id}"><i>${t.glyph}</i><span>${t.name}</span></button>`).join("")}</div>`;
    if(d.palette==="places")return `<div class="tool-row">${B.worldObjects.map(o=>`<button class="object-tool" data-action="world-add-object" data-id="${o.id}">${V.miniWorld(o.id)}<span>${o.name}</span></button>`).join("")}</div>`;
    if(d.palette==="people")return `<div class="tool-row">${B.inhabitants.map(p=>`<button class="object-tool" data-action="world-add-person" data-id="${p.id}">${V.person(p.id,p.need)}<span>${p.name}</span></button>`).join("")}</div>`;
    return `<div class="tool-row">${B.weather.map(w=>`<button class="weather-tool ${d.weather===w||d.time===w?"active":""}" data-action="world-weather" data-id="${w}"><i class="weather-icon wi-${w}"></i><span>${w}</span></button>`).join("")}<label class="water-slider"><span>Water</span><input type="range" min="0" max="4" value="${d.waterLevel}" data-action="world-water"></label></div>`;
  }

  function worldContext(selected,d,reactions){
    const isPerson=d.people.some(p=>p.id===selected.id);const reaction=reactions[selected.id];
    return `<div class="context-card"><button class="context-close" data-action="world-deselect">${V.icon("close")}</button>${isPerson?V.person(selected.type,selected.need):V.miniWorld(selected.type)}<strong>${E(selected.name)}</strong><span>${E(reaction?.message || (selected.need?`Needs ${selected.need}`:"Ready to explore"))}</span><div class="context-actions">${button("world-name","Name","question",`data-id="${selected.id}"`)}${button("world-duplicate","Copy","duplicate",`data-id="${selected.id}"`)}${button("world-delete","Remove","delete",`data-id="${selected.id}"`)}</div></div>`;
  }

  function worldReactions(d){
    const result={};
    d.objects.forEach(o=>{
      const tile=tileAt(d,o.x,o.y),near=d.objects.filter(x=>x.id!==o.id&&distance(x,o)<24);
      let state="calm",need="",message=worldObject(o.type).reaction;
      if(o.type==="village"&&tile!=="water"&&!near.some(n=>tileAt(d,n.x,n.y)==="water")){state="need";need="≈";message="Needs nearby water";}
      if(o.type==="farm"&&!['meadow','path'].includes(tile)){state="need";need="✦";message="Needs open land";}
      if(o.type==="bridge"&&tile!=="water"){state="need";need="≈";message="Place across water";}
      if(o.type==="windmill"&&d.weather==="wind")state="active";
      if(o.type==="lighthouse"&&d.time==="night")state="active";
      if(o.type==="market"&&near.some(n=>n.type==="village"))state="active";
      result[o.id]={state,need,message};
    });
    d.people.forEach(p=>{const near=d.objects.find(o=>distance(o,p)<22);result[p.id]={state:near?"active":"need",need:near?"":"→",message:near?`Visiting ${near.name||worldObject(near.type).name}`:"Needs a place to visit"};});
    return result;
  }

  function distance(a,b){return Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0));}
  function tileAt(d,x,y){const col=Core.clamp(Math.floor(x/100*12),0,11),row=Core.clamp(Math.floor(y/100*8),0,7);return d.tiles[row*12+col];}
  function worldSummary(d){const active=Object.values(worldReactions(d)).filter(r=>r.state==="active").length;return `${d.objects.length} places · ${d.people.length} inhabitants · ${active} active`;
  }

  function worldEventCard(event){
    return `<div class="world-event"><i>${V.icon(event.icon||"question")}</i><strong>${E(event.text)}</strong><div>${(event.choices||["Help now","Watch first"]).map((c,i)=>`<button data-action="world-event-choice" data-index="${i}">${E(c)}</button>`).join("")}</div></div>`;
  }

  function renderWorldTour(){
    const d=Core.current.data,stops=[...d.objects,...d.people];const stop=stops[d.tour%Math.max(1,stops.length)];
    main.innerHTML=`<section class="presentation-scene world-presentation weather-${d.weather} time-${d.time}"><div class="world-grid poster-grid">${d.tiles.map(t=>`<i class="world-tile tile-${t}"></i>`).join("")}</div>${d.objects.map(o=>`<div class="world-place ${o.id===stop?.id?"tour-active":""}" style="left:${o.x}%;top:${o.y}%">${V.miniWorld(o.type)}<span>${E(o.name)}</span></div>`).join("")}<div class="present-caption"><small>World tour</small><h1>${E(Core.current.title)}</h1><p>${E(stop?.name||"A living world")}</p></div><div class="present-controls">${button("tour-prev","Previous","undo")}${button("tour-next","Next","redo")}${button("exit-present","Exit","close")}</div></section>`;
  }

  function mysteryData(){return C.mysteries.find(m=>m.id===Core.current.data.mysteryId);}
  function allMysteryClues(m){return m.locations.flatMap((l,li)=>l.clues.map((c,ci)=>({...c,locationId:l.id,location:l.name,hotX:[25,70,43,82][(ci+li)%4],hotY:[68,47,28,70][(ci*2+li)%4]})));}

  function renderMystery(){
    const d=Core.current.data,m=mysteryData();if(!m)return switchContent("mystery");
    if(route.mode==="present")return renderMysteryReplay();
    if(d.mode==="notebook")return renderMysteryNotebook();
    const li=m.locations.findIndex(l=>l.id===d.locationId),loc=m.locations[li]||m.locations[0],clues=allMysteryClues(m).filter(c=>c.locationId===loc.id);
    const scene=`<div class="mystery-stage tool-${d.tool}" data-camera-board><div class="mystery-scene-art">${V.mysteryScene(loc,li)}</div>
      <div class="mystery-message"><span>${E((m.message||m.intro).split(/[.!?]/)[0])}</span><strong>${E(loc.name)}</strong></div>
      ${clues.map((c,i)=>`<button class="scene-hotspot ${d.clues.some(x=>x.id===c.id)?"found":""} action-${c.action||["magnify","flip","light","listen"][i%4]}" style="left:${c.hotX}%;top:${c.hotY}%" data-action="mystery-inspect" data-id="${c.id}" aria-label="Inspect ${E(c.title)}"><i></i><span>${V.icon(c.action||"magnify")}</span></button>`).join("")}
      <div class="scene-character"><span class="character-face"></span><button data-action="speak" data-text="${E(loc.character)}">${V.icon("speak")}<b>${E(shortSpeech(loc.character))}</b></button></div>
      <nav class="location-ribbon" aria-label="Mystery locations">${m.locations.map((l,i)=>`<button class="${l.id===loc.id?"active":""} ${d.visited.includes(l.id)?"visited":""}" data-action="mystery-location" data-id="${l.id}"><i>${i+1}</i><span>${E(l.name)}</span></button>`).join("")}</nav>
    </div>`;
    const tray=`<div class="tool-row">${B.tools.mystery.map(t=>`<button class="object-tool ${d.tool===t?"active":""}" data-action="mystery-tool" data-id="${t}">${V.icon(t)}<span>${t}</span></button>`).join("")}<button class="object-tool pouch-button" data-action="mystery-notebook">${V.icon("folder")}<span>Pouch</span><b>${d.clues.length}</b></button></div>`;
    const context=`<button class="round-action" data-action="mystery-hint">${V.icon("show")}<span>Hint ${Math.min(3,d.hints+1)}</span></button><button class="round-action" data-action="switch-content">${V.icon("map")}<span>Cases</span></button>`;
    main.innerHTML=workspace("mystery",scene,tray,context);
  }

  function shortSpeech(text){const clean=text.includes(":")?text.split(":").slice(1).join(":"):text;return clean.replace(/[‘’]/g,"").split(/(?<=[.!?])\s/)[0].slice(0,95);}

  function renderMysteryNotebook(){
    const d=Core.current.data,m=mysteryData(),all=allMysteryClues(m),found=d.clues.map(x=>all.find(c=>c.id===x.id)).filter(Boolean);
    const connectionLines=d.clueLinks.map(([a,b])=>{const ai=found.findIndex(c=>c.id===a),bi=found.findIndex(c=>c.id===b);if(ai<0||bi<0)return"";return`<path d="M${85+ai%4*190} ${120+Math.floor(ai/4)*150} Q380 210 ${85+bi%4*190} ${120+Math.floor(bi/4)*150}"/>`;}).join("");
    main.innerHTML=`<section class="notebook-page"><header><button class="tool-button" data-action="mystery-scene">${V.icon("close")}<span>Close pouch</span></button><div><small>Case notebook</small><h1>${E(m.question)}</h1></div><button class="tool-button" data-action="mystery-theory">${V.icon("connect")}<span>Build theory</span></button></header>
      <div class="case-board"><svg class="case-strings" viewBox="0 0 800 620">${connectionLines}</svg>${found.map((c,i)=>`<button class="physical-clue ${d.selectedClues.includes(c.id)?"selected":""} clue-${c.kind||"object"}" style="left:${4+(i%4)*24}%;top:${7+Math.floor(i/4)*25}%" data-action="mystery-clue-select" data-id="${c.id}"><span class="clue-visual">${clueMiniArt(c)}</span><strong>${E(c.title)}</strong><small>${E(c.location)}</small></button>`).join("")}${!found.length?`<div class="empty-visual">${V.icon("magnify")}<strong>Find your first clue</strong></div>`:""}</div>
      <div class="timeline-dock"><span>Earlier</span>${d.timeline.map(id=>{const c=all.find(x=>x.id===id);return`<button>${E(c?.title||"Clue")}</button>`}).join("")}<span>Later</span></div>
      <div class="notebook-actions"><button data-action="mystery-connect" ${d.selectedClues.length!==2?"disabled":""}>${V.icon("string")} Connect</button><button data-action="mystery-timeline" ${d.selectedClues.length!==1?"disabled":""}>${V.icon("map")} Timeline</button></div>
    </section>`;
  }

  function clueMiniArt(c){
    if(c.kind==="timeline")return`<i class="clue-clock"></i>`;
    if(c.kind==="environment")return`<i class="clue-leaf"></i>`;
    if(c.kind==="measurement")return`<i class="clue-ruler"></i>`;
    return`<i class="clue-object"></i>`;
  }

  function showTheoryBuilder(){
    const d=Core.current.data,m=mysteryData(),all=allMysteryClues(m),found=d.clues.map(x=>all.find(c=>c.id===x.id)).filter(Boolean);
    const theory=currentTheory(),saved=d.theories.filter(t=>t.saved).length;
    const people=m.locations.map(l=>l.character.split(":")[0].replace(/^No character here.*/,"Weather"));
    Core.modal(`<div class="modal-head"><div><small>Visual theory</small><h2 id="modal-title">Fit the pieces</h2></div><button data-action="close-modal">${V.icon("close")}</button></div><div class="theory-builder">
      ${theoryPiece("cause","Who or what?",[...new Set(people)],theory.pieces.cause)}${theoryPiece("object","Key object",found.map(c=>c.title),theory.pieces.object)}${theoryPiece("place","Where?",m.locations.map(l=>l.name),theory.pieces.place)}${theoryPiece("time","When?",["before dawn","during rain","at low tide","after dark","overnight"],theory.pieces.time)}${theoryPiece("action","What happened?",["moved","fell","flowed","dragged","turned","opened"],theory.pieces.action)}
    </div><div class="theory-evidence"><strong>Clues that fit</strong>${found.map(c=>`<label><input type="checkbox" data-theory-clue="${c.id}" ${theory.clueIds.includes(c.id)?"checked":""}><span>${E(c.title)}</span></label>`).join("")}</div><div class="theory-count"><span>${saved} saved ${saved===1?"theory":"theories"}</span>${saved?`<button class="soft-button" data-action="mystery-new-theory">New theory</button>`:""}</div><div class="modal-actions"><button class="primary-button" data-action="mystery-save-theory">${theory.saved?"Update theory":"Save theory"}</button><button class="soft-button" data-action="mystery-resolve" ${found.length<4?"disabled":""}>Replay answer</button></div>`,{wide:true});
  }

  function theoryPiece(key,label,options,value){return`<div class="theory-slot"><span>${label}</span><div>${options.slice(0,8).map(o=>`<button class="${value===o?"active":""}" data-action="theory-piece" data-key="${key}" data-value="${E(o)}">${E(o)}</button>`).join("")}</div></div>`;}

  function renderMysteryReplay(){
    const m=mysteryData(),d=Core.current.data,steps=[...m.resolutionClues.map(id=>allMysteryClues(m).find(c=>c.id===id)).filter(Boolean),{title:"Resolution",text:m.solution,location:"What happened"}],step=steps[d.replayStep%steps.length];
    const loc=m.locations.find(l=>l.id===step.locationId)||m.locations[0];
    main.innerHTML=`<section class="presentation-scene mystery-replay">${V.mysteryScene(loc,d.replayStep)}<div class="replay-card"><small>${E(step.location||"Key clue")}</small><h1>${E(step.title)}</h1><p>${E(step.text)}</p></div><div class="present-controls">${button("replay-prev","Previous","undo")}${button("replay-next","Next","redo")}${button("exit-present","Exit","close")}</div></section>`;
  }

  function evidenceData(){return C.evidenceSets.find(s=>s.id===Core.current.data.setId);}
  function evidenceItem(id){const d=Core.current.data,set=evidenceData();return set.evidence.find(e=>e.id===id)||d.notes?.find(n=>n.id===id);}

  function renderEvidence(){
    const d=Core.current.data,set=evidenceData();if(!set)return switchContent("evidence");
    if(route.mode==="present")return renderEvidencePresentation();
    if(d.creator)return renderEvidenceCreator();
    const available=set.evidence.filter(e=>!d.placed.some(p=>p.id===e.id)&&!d.hidden.includes(e.id));
    const links=evidenceLinkSvg(d);
    const pieces=d.placed.map(p=>{const e=evidenceItem(p.id);if(!e)return"";return`<button class="evidence-piece ${d.selected.includes(p.id)?"selected":""} ${d.flipped.includes(p.id)?"flipped":""} ${d.revealed.includes(p.id)?"revealed":""}" style="left:${p.x}%;top:${p.y}%;--rotation:${p.rotation||0}deg;--scale:${p.scale||1}" data-move="${p.id}" data-move-kind="evidence" data-action="evidence-select" data-id="${p.id}" aria-label="${E(e.title)}. Drag to move."><span class="evidence-front">${V.evidenceArt(e)}<small>${E(e.type)}</small><strong>${E(e.title)}</strong></span><span class="evidence-back"><strong>${E(e.title)}</strong><p>${E(e.text)}</p></span></button>`}).join("");
    const scene=`<div class="evidence-stage tool-${d.tool}" data-move-board data-camera-board><div class="desk-question"><small>Investigation</small><strong>${E(set.question)}</strong></div><svg class="evidence-links" viewBox="0 0 100 100" preserveAspectRatio="none">${links}</svg>${pieces}
      <button class="claim-token ${d.claim?"has-claim":""}" style="left:${d.claimToken.x}%;top:${d.claimToken.y}%" data-move="claim" data-move-kind="claim" data-action="evidence-claim"><i>?</i><span>${E(d.claim||"Claim")}</span></button>
      ${available.length?`<button class="evidence-envelope" data-action="evidence-open-envelope"><span>${available.length}</span>${V.icon("folder")}<b>More evidence</b></button>`:""}
      ${d.connections.length>=2&&d.revealed.length<1?`<button class="developing-photo" data-action="evidence-reveal"><i></i><span>Develop photo</span></button>`:""}
    </div>`;
    const tray=`<div class="tool-row evidence-tools">${B.tools.evidence.map(t=>`<button class="object-tool ${d.tool===t?"active":""}" data-action="evidence-tool" data-id="${t}">${V.icon(t)}<span>${t}</span></button>`).join("")}</div>`;
    const selected=d.selected.length===1?evidenceItem(d.selected[0]):null;
    const context=selected?`<div class="context-card"><strong>${E(selected.title)}</strong><span>${E(selected.text)}</span><div class="context-actions">${button("evidence-flip","Flip","flip")}${button("evidence-hide","Hide","close")}</div></div>`:`<button class="round-action" data-action="evidence-creator">${V.icon("duplicate")}<span>Make a case</span></button><button class="round-action" data-action="present">${V.icon("play")}<span>Present</span></button><button class="round-action" data-action="switch-content">${V.icon("folder")}<span>Cases</span></button>`;
    main.innerHTML=workspace("evidence",scene,tray,context);
  }

  function evidenceLinkSvg(d){return d.connections.map(c=>{const a=c.a==="claim"?d.claimToken:d.placed.find(p=>p.id===c.a),b=c.b==="claim"?d.claimToken:d.placed.find(p=>p.id===c.b);if(!a||!b)return"";return`<path class="relation-${c.label.replace(/\s/g,"-")}" d="M${a.x+7} ${a.y+6} Q${(a.x+b.x)/2} ${(a.y+b.y)/2-9} ${b.x+7} ${b.y+6}"/><text x="${(a.x+b.x)/2}" y="${(a.y+b.y)/2-4}">${E(c.label)}</text>`;}).join("");}

  function renderEvidenceCreator(){
    const d=Core.current.data,c=d.creator;
    main.innerHTML=`<section class="creator-space"><header><button class="tool-button" data-action="evidence-cancel-creator">${V.icon("close")}<span>Exit</span></button><div><small>Create an investigation</small><h1>${["Ask one question","Add evidence","Arrange the start","Ready to play"][c.step]}</h1></div></header>
      <div class="creator-stage">${c.step===0?`<div class="single-prompt">${V.icon("question")}<input aria-label="Central question" data-creator-field="question" value="${E(c.question)}" placeholder="Why did the place change?"><button data-action="evidence-creator-next">Next</button></div>`:""}
      ${c.step===1?`<div class="evidence-maker"><div class="type-wheel">${["photo","map","object","measurement","timeline","sound"].map(t=>`<button class="${c.type===t?"active":""}" data-action="creator-evidence-type" data-id="${t}">${V.icon(t==="photo"?"evidence":t==="timeline"?"map":t==="sound"?"listen":"question")}<span>${t}</span></button>`).join("")}</div><input aria-label="Evidence title" data-creator-field="title" value="${E(c.title)}" placeholder="Evidence title"><textarea aria-label="Evidence detail" data-creator-field="text" placeholder="What does it show?">${E(c.text)}</textarea><button data-action="creator-add-evidence">Place evidence</button><div class="created-strip">${c.evidence.map(e=>`<span>${E(e.title)}</span>`).join("")}</div><button class="next-arrow" data-action="evidence-creator-next" ${c.evidence.length<3?"disabled":""}>Arrange →</button></div>`:""}
      ${c.step===2?`<div class="creator-arrange"><p>Choose what appears first.</p>${c.evidence.map((e,i)=>`<label><input type="checkbox" data-creator-start="${i}" ${c.start.includes(i)?"checked":""}><span>${V.evidenceArt(e)}<b>${E(e.title)}</b></span></label>`).join("")}<button data-action="evidence-creator-next">Finish</button></div>`:""}
      ${c.step===3?`<div class="creator-finish">${V.icon("check")}<h2>${E(c.question)}</h2><p>${c.evidence.length} evidence objects are ready.</p><button data-action="evidence-play-created">Play investigation</button></div>`:""}</div></section>`;
  }

  function renderEvidencePresentation(){
    const d=Core.current.data,set=evidenceData();
    main.innerHTML=`<section class="presentation-scene evidence-presentation"><div class="present-question"><small>Our claim</small><h1>${E(d.claim||set.question)}</h1></div><div class="present-evidence-map"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${evidenceLinkSvg(d)}</svg>${d.placed.map(p=>{const e=evidenceItem(p.id);return`<div class="evidence-piece" style="left:${p.x}%;top:${p.y}%"><span class="evidence-front">${V.evidenceArt(e)}<strong>${E(e.title)}</strong></span></div>`}).join("")}</div><div class="present-controls">${button("exit-present","Exit","close")}</div></section>`;
  }

  function renderInventor(){
    const d=Core.current.data;if(route.mode==="present")return renderInventorReplay();
    const weak=d.testHistory.at(-1)?.weakId;
    const scene=`<div class="inventor-stage env-wind-${d.environment.wind} ${d.testMotion?"testing":""}" data-move-board data-camera-board><div class="bench-brief"><small>Build something that helps</small><strong>${E(d.brief.problem)}</strong><span>${E(d.brief.limits||"")}</span></div><svg class="invention-links" viewBox="0 0 100 100" preserveAspectRatio="none">${designLinks(d)}</svg>${d.parts.map(p=>`<button class="machine-part ${d.selected.includes(p.id)?"selected":""} ${p.id===weak?"weak-part":""} ${p.locked?"locked":""} shape-${p.type}" style="left:${p.x}%;top:${p.y}%;--turn:${p.rotation||0}deg;--size:${p.size||1}" data-move="${p.id}" data-move-kind="part" data-action="inventor-select" data-id="${p.id}" aria-label="${partData(p.type).name}. Drag to move.">${V.partArt(p.type)}<span>${E(p.label||partData(p.type).name)}</span></button>`).join("")}
      <div class="test-zone" data-drop="target"><i></i><span>Target</span></div><div class="environment-controls"><label>Wind <input type="range" min="0" max="4" value="${d.environment.wind}" data-env="wind"></label><label>Water <input type="range" min="0" max="4" value="${d.environment.water}" data-env="water"></label><label>Slope <input type="range" min="0" max="4" value="${d.environment.slope}" data-env="slope"></label></div>
      ${d.testHistory.length?testBubble(d.testHistory.at(-1)):""}
      ${!d.parts.length?`<div class="bench-invitation">Drag a part onto the bench</div>`:""}</div>`;
    const tray=`<div class="tool-row part-tray">${B.parts.map(p=>`<button class="part-choice" data-action="inventor-add" data-id="${p.id}">${V.partArt(p.id)}<span>${p.name}</span></button>`).join("")}</div><div class="tray-mini-tools">${B.tools.inventor.map(t=>`<button class="${d.tool===t?"active":""}" data-action="inventor-tool" data-id="${t}">${V.icon(t)}<span>${t}</span></button>`).join("")}</div>`;
    const context=`<button class="test-lever" data-action="inventor-test" ${d.parts.length<2?"disabled":""}><i></i><span>TEST</span></button><button class="round-action" data-action="inventor-save-version">${V.icon("save")}<span>Save version</span></button>${d.versions.length?`<button class="round-action" data-action="inventor-compare">${V.icon("compare")}<span>Compare ${d.versions.length}</span></button>`:""}<button class="round-action" data-action="switch-content">${V.icon("folder")}<span>Challenges</span></button>`;
    main.innerHTML=workspace("inventor",scene,tray,context);
  }

  function partData(id){return B.parts.find(p=>p.id===id)||B.parts[0];}
  function designLinks(d){return d.connections.map(c=>{const a=d.parts.find(p=>p.id===c.a),b=d.parts.find(p=>p.id===c.b);return a&&b?`<line x1="${a.x+5}" y1="${a.y+5}" x2="${b.x+5}" y2="${b.y+5}"/>`:""}).join("");}

  function runTest(d){
    const types=d.parts.map(p=>p.type),unmet=[];
    d.parts.forEach(p=>partData(p.type).needs.forEach(n=>{if(n==="support"){const support=d.parts.some(x=>x.id!==p.id&&distance(x,p)<24);if(!support)unmet.push({id:p.id,msg:"needs support"});}else if(!types.includes(n))unmet.push({id:p.id,msg:`needs ${n}`});}));
    const disconnected=d.parts.find(p=>d.parts.length>1&&!d.connections.some(c=>c.a===p.id||c.b===p.id));
    if(disconnected)unmet.push({id:disconnected.id,msg:"not connected"});
    const mass=d.parts.reduce((n,p)=>n+partData(p.type).mass,0),motion=d.parts.reduce((n,p)=>n+partData(p.type).moves,0),water=d.parts.reduce((n,p)=>n+partData(p.type).water,0)/Math.max(1,d.parts.length);
    let message="The idea moves towards the target",outcome="partial";
    if(unmet.length){message=unmet[0].msg;outcome="fail";}
    else if(d.brief.priorities.includes("waterproof")&&water<3){message="leaks here";outcome="fail";}
    else if(d.brief.priorities.includes("light")&&mass>16){message="too heavy";outcome="partial";}
    else if(d.brief.priorities.includes("movement")&&motion<8){message="almost reaches";outcome="partial";}
    else{message="works as a system";outcome="success";}
    return {id:Core.uid("test"),time:Date.now(),message,outcome,weakId:unmet[0]?.id||d.parts.at(-1)?.id,path:motion>10?"long":"short",partCount:d.parts.length};
  }

  function testBubble(test){return`<div class="test-bubble outcome-${test.outcome}"><span>${test.outcome==="success"?"✓":"→"}</span><strong>${E(test.message)}</strong><i>Test ${test.partCount} parts</i></div>`;}

  function renderInventorReplay(){
    const d=Core.current.data,test=d.testHistory.at(-1);
    main.innerHTML=`<section class="presentation-scene inventor-replay ${test?`outcome-${test.outcome}`:""}"><div class="blueprint-grid"></div><h1>${E(d.brief.title)}</h1><svg class="invention-links" viewBox="0 0 100 100">${designLinks(d)}</svg>${d.parts.map(p=>`<div class="machine-part shape-${p.type}" style="left:${p.x}%;top:${p.y}%;--turn:${p.rotation||0}deg">${V.partArt(p.type)}<span>${E(p.label||partData(p.type).name)}</span></div>`).join("")}<div class="replay-result">${testBubble(test||{outcome:"partial",message:"Not tested",partCount:d.parts.length})}</div><div class="present-controls">${button("exit-present","Exit","close")}</div></section>`;
  }

  function consequenceData(){return C.consequences.find(s=>s.id===Core.current.data.scenarioId)||Core.current.data.customScenario;}

  function renderConsequence(){
    const d=Core.current.data,s=consequenceData();if(!s)return switchContent("consequence");
    if(route.mode==="present")return renderConsequenceReplay();
    if(d.creator)return renderScenarioCreator();
    if(d.comparePath)return renderPathComparison();
    const node=d.currentNode==="opening"?s.opening:s.nodes[d.currentNode];
    if(!node&&d.complete)return renderConsequenceReplay();
    const choices=node?.choices||[];
    const scene=`<div class="consequence-stage" data-move-board>${V.consequenceScene(s.id,d.sceneState)}<div class="situation-strip"><small>${d.history.length?"The world changed":"What should happen next?"}</small><strong>${E(d.history.length?(node.info||node.prompt):s.setting)}</strong></div>
      <div class="decision-zones">${choices.map((c,i)=>`<button class="decision-zone zone-${i}" data-drop="${c.id}" data-action="consequence-choice" data-id="${c.id}"><i>${i===0?"↙":"↘"}</i><strong>${E(shortChoice(c.label))}</strong><span>${E(c.label)}</span></button>`).join("")}</div>
      ${d.resources.map(r=>`<button class="decision-token token-${r.type}" style="left:${r.x}%;top:${r.y}%" data-move="${r.id}" data-move-kind="decision-token" aria-label="Decision token. Drag to a choice.">${r.type==="people"?V.icon("home"):V.icon("consequence")}<span>${r.type}</span></button>`).join("")}
      <div class="consequence-vitals">${vital("Nature",d.sceneState.nature)}${vital("People",d.sceneState.people)}${vital("Access",d.sceneState.access)}${vital("Supply",d.sceneState.resources)}</div>
      ${d.history.length?`<button class="perspective-orb" data-action="consequence-perspectives"><i>${d.history.at(-1).perspectives?.length||0}</i><span>View people</span></button>`:""}</div>`;
    const tray=`<div class="branch-trail"><button data-action="consequence-rewind" ${!d.history.length?"disabled":""}>${V.icon("rewind")}<span>Rewind</span></button>${d.history.map((h,i)=>`<button data-action="consequence-rewind-to" data-index="${i}"><i>${i+1}</i><span>${E(shortChoice(h.label))}</span></button>`).join("")}${d.complete?`<button data-action="present">${V.icon("play")}<span>Replay</span></button>`:""}</div>`;
    const context=`<button class="round-action" data-action="consequence-save-path">${V.icon("save")}<span>Save path</span></button>${d.savedPaths.length?`<button class="round-action" data-action="consequence-compare">${V.icon("compare")}<span>Compare</span></button>`:""}<button class="round-action" data-action="scenario-create">${V.icon("duplicate")}<span>Make scenario</span></button><button class="round-action" data-action="switch-content">${V.icon("folder")}<span>Scenarios</span></button>`;
    main.innerHTML=workspace("consequence",scene,tray,context);
  }

  function shortChoice(label){const words=label.split(/\s+/);return words.slice(0,4).join(" ")+(words.length>4?"…":"");}
  function vital(label,value){return`<div><span>${label}</span><i>${Array.from({length:5},(_,i)=>`<b class="${i<value?"on":""}"></b>`).join("")}</i></div>`;}

  function chooseConsequence(id){
    const d=Core.current.data,s=consequenceData(),node=d.currentNode==="opening"?s.opening:s.nodes[d.currentNode],choice=node?.choices.find(c=>c.id===id);if(!choice)return;
    Core.mutate("make decision",()=>{
      const perspectives=Object.entries(choice.perspectives||{}).map(([person,text])=>({person,text}));
      d.history.push({node:d.currentNode,choiceId:id,label:choice.label,immediate:choice.immediate,unintended:choice.unintended,perspectives,state:Core.copy(d.sceneState)});
      adjustScene(d.sceneState,choice);
      d.sceneState.time++;
      if(choice.ending){d.ending=choice.ending;d.complete=true;d.currentNode="ending";}else d.currentNode=choice.next;
    });
    Core.sound("discover");
    if(Core.current.data.complete){setTimeout(()=>{route.mode="present";render();},650);}
  }

  function adjustScene(state,choice){
    const text=`${choice.immediate} ${choice.unintended}`.toLowerCase();
    if(/wild|habitat|plant|river|water/.test(text))state.nature=Core.clamp(state.nature+(text.includes("damage")||text.includes("disturb")?-1:1),0,5);
    if(/access|route|path|cross|movement/.test(text))state.access=Core.clamp(state.access+1,0,5);
    if(/cost|use|limited|less/.test(text))state.resources=Core.clamp(state.resources-1,0,5);
    if(/fair|help|together|safer/.test(text))state.people=Core.clamp(state.people+1,0,5);
    else if(/difficult|lose|frustrat|conflict/.test(text))state.people=Core.clamp(state.people-1,0,5);
  }

  function renderScenarioCreator(){
    const d=Core.current.data,c=d.creator;
    const titles=["Choose a setting","Place the problem","Add two actions","Link the results","Play it"];
    main.innerHTML=`<section class="creator-space consequence-creator"><header><button class="tool-button" data-action="scenario-cancel">${V.icon("close")}<span>Exit</span></button><div><small>Scenario creator · ${c.step+1}/5</small><h1>${titles[c.step]}</h1></div></header><div class="creator-stage">
      ${c.step===0?`<div class="setting-picker">${["river","woodland","square","island","market"].map(s=>`<button class="${c.setting===s?"active":""}" data-action="creator-setting" data-id="${s}">${V.consequenceScene(s,{nature:3,people:3,access:3,resources:3})}<span>${s}</span></button>`).join("")}</div>`:""}
      ${c.step===1?`<div class="problem-picker">${["Not enough water","A route is blocked","Two groups need space","A storm is coming","Supplies are limited"].map(p=>`<button class="${c.problem===p?"active":""}" data-action="creator-problem" data-value="${p}">${V.icon("question")}<span>${p}</span></button>`).join("")}</div>`:""}
      ${c.step===2?`<div class="action-builder"><label>Action A<input data-scenario-field="a" value="${E(c.a)}" placeholder="Move water"></label><label>Action B<input data-scenario-field="b" value="${E(c.b)}" placeholder="Protect the path"></label><div class="placed-characters">${["Child","Keeper","Maker"].map(p=>`<span>${V.icon("home")}${p}</span>`).join("")}</div></div>`:""}
      ${c.step===3?`<div class="node-builder"><div><b>${E(c.a||"Action A")}</b><select aria-label="Effect of action A" data-scenario-field="aEffect"><option>helps people</option><option>protects nature</option><option>uses supplies</option><option>opens access</option></select></div><i></i><div><b>${E(c.b||"Action B")}</b><select aria-label="Effect of action B" data-scenario-field="bEffect"><option>protects nature</option><option>helps people</option><option>uses supplies</option><option>opens access</option></select></div></div>`:""}
      ${c.step===4?`<div class="creator-finish">${V.icon("play")}<h2>${E(c.problem)}</h2><p>Two choices lead to different visible effects.</p><button data-action="scenario-play-created">Play scenario</button></div>`:""}
      ${c.step<4?`<button class="creator-next" data-action="scenario-next">Next →</button>`:""}</div></section>`;
  }

  function renderPathComparison(){
    const d=Core.current.data,currentPath={history:d.history,state:d.sceneState,ending:d.ending},saved=d.savedPaths[d.comparePath-1]||d.savedPaths[0];
    main.innerHTML=`<section class="comparison-space"><header><button class="tool-button" data-action="consequence-close-compare">${V.icon("close")}<span>Close</span></button><h1>Two possible paths</h1></header><div class="split-world"><div>${V.consequenceScene("saved",saved.state)}<h2>Saved path</h2>${compareVitals(saved.state)}</div><div>${V.consequenceScene("current",currentPath.state)}<h2>Current path</h2>${compareVitals(currentPath.state)}</div></div><div class="comparison-branches">${[saved,currentPath].map(path=>`<ol>${path.history.map(h=>`<li>${E(shortChoice(h.label))}</li>`).join("")}</ol>`).join("")}</div></section>`;
  }
  function compareVitals(s){return`<div class="compare-vitals">${vital("Nature",s.nature)}${vital("People",s.people)}${vital("Access",s.access)}${vital("Supply",s.resources)}</div>`;}

  function renderConsequenceReplay(){
    const d=Core.current.data,s=consequenceData(),step=d.replayStep||0,h=d.history[step];
    main.innerHTML=`<section class="presentation-scene consequence-replay">${V.consequenceScene(s.id,h?.state||d.sceneState)}<div class="replay-card"><small>${h?`Decision ${step+1}`:"Outcome"}</small><h1>${E(h?.label||s.title)}</h1><p>${E(h?.immediate||d.ending||s.setting)}</p>${h?.unintended?`<strong>Later: ${E(h.unintended)}</strong>`:""}</div><div class="present-controls">${button("consequence-replay-prev","Previous","undo")}${button("consequence-replay-next","Next","redo")}${button("exit-present","Exit","close")}</div></section>`;
  }

  function renderLibrary(){
    route.mode="edit";const items=[...Core.library.items].sort((a,b)=>b.updatedAt-a.updatedAt);
    main.innerHTML=`<section class="creation-room"><header><div><small>The creation drawer</small><h1>Things worth returning to</h1></div><div>${button("home","Workshop","home")}${button("import-json","Import","export")}</div></header><div class="creation-shelves">${items.map(item=>`<article class="creation-folder folder-${item.app}"><button class="folder-cover" data-action="continue" data-id="${item.id}">${V.icon(item.app)}<span><small>${appNames[item.app]}</small><strong>${E(item.title)}</strong><i>${new Date(item.updatedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</i></span></button><div class="folder-tools">${button("library-present","Present","play",`data-id="${item.id}"`)}${button("duplicate","Copy","duplicate",`data-id="${item.id}"`)}${button("rename","Rename","question",`data-id="${item.id}"`)}${button("export-item","Export","export",`data-id="${item.id}"`)}${button("delete-item","Delete","delete",`data-id="${item.id}"`)}</div></article>`).join("")}${!items.length?`<div class="empty-shelf">${V.icon("folder")}<h2>Your first creation will rest here.</h2><button data-action="home">Enter the Workshop</button></div>`:""}</div>${items.length?`<button class="clear-library" data-action="clear-library">Clear all data</button>`:""}</section>`;
  }

  function switchContent(app=route.page){
    const entries=app==="world"?B.worldSeeds.map(id=>({id,title:id==="blank"?"Blank world":`${id[0].toUpperCase()+id.slice(1)} seed`,copy:"Touch to shape"})):
      app==="mystery"?C.mysteries.map(x=>({id:x.id,title:x.title,copy:(x.message||x.intro).split(/[.!?]/)[0]})):
      app==="evidence"?C.evidenceSets.map(x=>({id:x.id,title:x.title,copy:x.subject})):
      app==="inventor"?C.inventor.briefs.map(x=>({id:x.id,title:x.title,copy:x.problem})):
      C.consequences.map(x=>({id:x.id,title:x.title,copy:x.setting}));
    Core.modal(`<div class="modal-head"><div><small>${appNames[app]}</small><h2 id="modal-title">Choose a new start</h2></div><button data-action="close-modal">${V.icon("close")}</button></div><div class="visual-chooser">${entries.map((x,i)=>`<button data-action="choose-content" data-app="${app}" data-id="${x.id}"><span class="chooser-art">${app==="world"?seedArt(x.id):app==="inventor"?V.partArt(B.parts[i%B.parts.length].id):V.icon(app)}</span><strong>${E(x.title)}</strong><small>${E(x.copy)}</small></button>`).join("")}</div>`,{wide:true});
  }

  function seedArt(seed){return`<span class="seed-orb seed-${seed}"><i></i><b></b></span>`;}

  function chooseContent(app,id){
    Core.closeModal();
    if(app==="world"){Core.create("world",`${id[0].toUpperCase()+id.slice(1)} world`,newWorld(id));}
    if(app==="mystery"){const m=C.mysteries.find(x=>x.id===id);Core.create(app,m.title,newMystery(id));}
    if(app==="evidence"){const s=C.evidenceSets.find(x=>x.id===id);Core.create(app,s.title,newEvidence(id));}
    if(app==="inventor"){const b=C.inventor.briefs.find(x=>x.id===id);Core.create(app,b.title,newInventor(b));}
    if(app==="consequence"){const s=C.consequences.find(x=>x.id===id);Core.create(app,s.title,newConsequence(id));}
    route.page=app;render();
  }

  function settingsModal(){
    const s=Core.settings;
    Core.modal(`<div class="modal-head"><div><small>Comfort</small><h2 id="modal-title">Workshop settings</h2></div><button data-action="close-modal">${V.icon("close")}</button></div><div class="settings-list">${settingToggle("sound","Sound effects",s.sound)}${settingToggle("ambience","Ambient sound",s.ambience)}${settingToggle("reducedSound","Quieter sound",s.reducedSound)}${settingToggle("reducedMotion","Reduced motion",s.reducedMotion)}${settingToggle("highClarity","High clarity",s.highClarity)}${settingToggle("largeText","Larger text",s.largeText)}${settingToggle("lockedCamera","Lock camera",s.lockedCamera)}</div>`);
  }
  function settingToggle(id,label,on){return`<label><span>${label}</span><input type="checkbox" data-setting="${id}" ${on?"checked":""}><i></i></label>`;}

  function helpModal(){
    const app=route.page;
    const tips={home:["Touch a place","Your work saves here"],world:["Paint the land","Place things","Change the weather"],mystery:["Try a tool","Open clues","Connect two"],evidence:["Move evidence","Use the tools","Build a claim"],inventor:["Place parts","Connect them","Pull TEST"],consequence:["Move a token","Watch the world","Rewind and branch"]}[app]||["Touch to begin"];
    Core.modal(`<div class="modal-head"><div><small>Show me</small><h2 id="modal-title">What can I try?</h2></div><button data-action="close-modal">${V.icon("close")}</button></div><div class="visual-help">${tips.map((tip,i)=>`<div><i>${i+1}</i><span>${tip}</span></div>`).join("")}</div><button class="primary-button" data-action="show-gesture">Show one action</button>`);
  }

  function outputHTML(){
    const item=Core.current;if(!item)return"";
    if(item.app==="world"){const d=item.data;return`<h1>${E(item.title)}</h1><p>${worldSummary(d)}</p><div class="print-world">${d.objects.map(o=>`${V.miniWorld(o.type)}<b>${E(o.name)}</b>`).join("")}</div>`;}
    if(item.app==="mystery"){const m=mysteryData(),d=item.data;return`<h1>${E(m.title)}</h1><p>${E(m.question)}</p><div class="print-clues">${d.clues.map(c=>{const clue=allMysteryClues(m).find(x=>x.id===c.id);return`<span>${E(clue?.title)}</span>`}).join("")}</div><p>${E(m.solution)}</p>`;}
    if(item.app==="evidence"){const d=item.data,set=evidenceData();return`<h1>${E(set.title)}</h1><h2>${E(d.claim||set.question)}</h2><div class="print-links">${d.connections.map(c=>`<span>${E(evidenceItem(c.a)?.title||"Claim")} — ${E(c.label)} — ${E(evidenceItem(c.b)?.title||"Claim")}</span>`).join("")}</div>`;}
    if(item.app==="inventor"){const d=item.data;return`<h1>${E(d.brief.title)}</h1><p>${E(d.brief.problem)}</p><div class="print-blueprint">${d.parts.map(p=>`<span>${V.partArt(p.type)}<b>${E(p.label||partData(p.type).name)}</b></span>`).join("")}</div><p>${E(d.testHistory.at(-1)?.message||"Ready for a physical test")}</p>`;}
    const d=item.data,s=consequenceData();return`<h1>${E(s.title)}</h1><div>${d.history.map((h,i)=>`<p><b>${i+1}. ${E(h.label)}</b><br>${E(h.immediate)}<br>Later: ${E(h.unintended)}</p>`).join("")}</div><p>${E(d.ending||"")}</p>`;
  }

  function printOutput(){
    const holder=document.querySelector("#print-root");holder.innerHTML=`<article class="print-sheet"><small>The Workshop · ${appNames[Core.current.app]}</small>${outputHTML()}<footer>${new Date().toLocaleDateString("en-GB")}</footer></article>`;window.print();
  }

  function showOutput(){Core.modal(`<div class="modal-head"><div><small>Visual output</small><h2 id="modal-title">Ready to share</h2></div><button data-action="close-modal">${V.icon("close")}</button></div><div class="output-preview">${outputHTML()}</div><div class="modal-actions"><button class="primary-button" data-action="present">${V.icon("play")} Present</button><button class="soft-button" data-action="print">${V.icon("print")} Print</button><button class="soft-button" data-action="export-summary">${V.icon("export")} Text</button><button class="soft-button" data-action="export-current">${V.icon("save")} JSON</button></div>`,{wide:true});}

  function showNameModal(id){const object=findMovable("world-object",id)||findMovable("world-person",id);if(!object)return;Core.modal(`<div class="modal-head"><h2 id="modal-title">Name this</h2><button data-action="close-modal">${V.icon("close")}</button></div><label class="single-field"><span>Short name</span><input id="object-name" maxlength="28" value="${E(object.name)}"></label><button class="primary-button" data-action="save-object-name" data-id="${id}">Save name</button>`);}

  function findMovable(kind,id){
    const d=Core.current?.data;if(!d)return null;
    if(kind==="world-object")return d.objects.find(x=>x.id===id);
    if(kind==="world-person")return d.people.find(x=>x.id===id);
    if(kind==="evidence")return d.placed.find(x=>x.id===id);
    if(kind==="claim")return d.claimToken;
    if(kind==="part")return d.parts.find(x=>x.id===id);
    if(kind==="decision-token")return d.resources.find(x=>x.id===id);
    return null;
  }

  function move(kind,id,x,y){const object=findMovable(kind,id);if(object){object.x=Number(x.toFixed(2));object.y=Number(y.toFixed(2));}}
  function drop(kind,id,target){if(kind==="decision-token"&&target)chooseConsequence(target);}
  function zoom(delta,rerender=true){const d=Core.current?.data;if(!d?.camera||Core.settings.lockedCamera)return;d.camera.zoom=Core.clamp((d.camera.zoom||1)+delta,.72,1.65);Core.queueSave();if(rerender)render();}

  document.addEventListener("click",event=>{
    const el=event.target.closest("[data-action]");if(!el)return;const action=el.dataset.action;
    if(action==="enter-app")return startDefault(el.dataset.app);
    if(action==="continue")return startDefault(null,el.dataset.id);
    if(action==="home"){Core.closeModal();route={page:"home",mode:"edit",drawer:null};return render();}
    if(action==="library"){Core.closeModal();route={page:"library",mode:"edit",drawer:null};return render();}
    if(action==="settings")return settingsModal();
    if(action==="toggle-sound"){Core.setSetting("sound",!Core.settings.sound);Core.announce(Core.settings.sound?"Sound on":"Sound muted");return;}
    if(action==="help")return helpModal();
    if(action==="close-modal"){if(el===event.target&&el.classList.contains("modal-shade")||!el.classList.contains("modal-shade"))Core.closeModal();return;}
    if(action==="undo")return Core.undo();if(action==="redo")return Core.redo();
    if(action==="manual-save")return Core.saveCurrent(false);
    if(action==="show-gesture"){Core.closeModal();return showGesture(route.page);}
    if(action==="show-output")return showOutput();
    if(action==="print")return printOutput();
    if(action==="export-current")return Core.exportJSON();
    if(action==="export-summary")return Core.exportSummary(outputHTML(),Core.current?.title);
    if(action==="present"){Core.closeModal();route.mode="present";document.documentElement.requestFullscreen?.().catch(()=>{});return render();}
    if(action==="exit-present"){route.mode="edit";if(document.fullscreenElement)document.exitFullscreen?.();return render();}
    if(action==="switch-content")return switchContent(route.page);
    if(action==="choose-content")return chooseContent(el.dataset.app,el.dataset.id);
    if(action==="zoom-in")return zoom(.12);if(action==="zoom-out")return zoom(-.12);if(action==="fit-view"){const d=Core.current.data;if(d.camera)d.camera={x:0,y:0,zoom:1};return render();}

    if(action==="world-palette"){Core.current.data.palette=el.dataset.id;return render();}
    if(action==="world-tool"){Core.current.data.tool=el.dataset.id;return render();}
    if(action==="world-paint")return paintWorldTile(Number(el.dataset.index));
    if(action==="world-add-object")return addWorldObject(el.dataset.id);
    if(action==="world-add-person")return addWorldPerson(el.dataset.id);
    if(action==="world-select"){Core.current.data.selected=el.dataset.id;return render();}
    if(action==="world-deselect"){Core.current.data.selected=null;return render();}
    if(action==="world-weather")return setWorldWeather(el.dataset.id);
    if(action==="world-event")return addWorldEvent();
    if(action==="world-event-choice")return resolveWorldEvent(Number(el.dataset.index));
    if(action==="world-name")return showNameModal(Core.current.data.selected);
    if(action==="save-object-name")return saveObjectName(el.dataset.id);
    if(action==="world-duplicate")return duplicateWorldObject(Core.current.data.selected);
    if(action==="world-delete")return deleteWorldObject(Core.current.data.selected);
    if(action==="tour-next"||action==="tour-prev"){const d=Core.current.data,n=d.objects.length+d.people.length;d.tour=(d.tour+(action==="tour-next"?1:-1)+Math.max(1,n))%Math.max(1,n);return render();}

    if(action==="mystery-tool"){Core.current.data.tool=el.dataset.id;return render();}
    if(action==="mystery-location")return changeMysteryLocation(el.dataset.id);
    if(action==="mystery-inspect")return inspectMysteryClue(el.dataset.id,el);
    if(action==="mystery-notebook"){Core.current.data.mode="notebook";return render();}
    if(action==="mystery-scene"){Core.current.data.mode="scene";return render();}
    if(action==="mystery-clue-select")return selectMysteryClue(el.dataset.id);
    if(action==="mystery-connect")return connectMysteryClues();
    if(action==="mystery-timeline")return addMysteryTimeline();
    if(action==="mystery-hint")return mysteryHint();
    if(action==="mystery-theory")return showTheoryBuilder();
    if(action==="theory-piece"){setTheoryPiece(el.dataset.key,el.dataset.value);return showTheoryBuilder();}
    if(action==="mystery-save-theory")return saveTheory();
    if(action==="mystery-new-theory")return newTheory();
    if(action==="mystery-resolve"){Core.closeModal();Core.current.data.replayStep=0;route.mode="present";return render();}
    if(action==="replay-next"||action==="replay-prev"){const d=Core.current.data,m=mysteryData(),n=m.resolutionClues.length+1;d.replayStep=(d.replayStep+(action==="replay-next"?1:-1)+n)%n;return render();}
    if(action==="speak")return Core.speak(el.dataset.text,el);

    if(action==="evidence-tool"){Core.current.data.tool=el.dataset.id;pendingConnection=[];return render();}
    if(action==="evidence-select")return selectEvidence(el.dataset.id);
    if(action==="evidence-open-envelope")return openEvidence();
    if(action==="evidence-flip")return flipEvidence();
    if(action==="evidence-hide")return hideEvidence();
    if(action==="evidence-reveal")return revealEvidence();
    if(action==="evidence-claim")return claimModal();
    if(action==="save-claim")return saveClaim();
    if(action==="evidence-creator")return startEvidenceCreator();
    if(action==="evidence-cancel-creator"){Core.current.data.creator=null;return render();}
    if(action==="evidence-creator-next")return evidenceCreatorNext();
    if(action==="creator-evidence-type"){Core.current.data.creator.type=el.dataset.id;return render();}
    if(action==="creator-add-evidence")return creatorAddEvidence();
    if(action==="evidence-play-created")return playCreatedEvidence();

    if(action==="inventor-add")return addPart(el.dataset.id);
    if(action==="inventor-tool"){Core.current.data.tool=el.dataset.id;Core.current.data.selected=[];return render();}
    if(action==="inventor-select")return selectPart(el.dataset.id);
    if(action==="inventor-test")return testInvention();
    if(action==="inventor-save-version")return saveVersion();
    if(action==="inventor-compare")return showInventorVersions();

    if(action==="consequence-choice")return chooseConsequence(el.dataset.id);
    if(action==="consequence-perspectives")return perspectiveModal();
    if(action==="consequence-save-path")return savePath();
    if(action==="consequence-rewind")return rewindConsequence(-1);
    if(action==="consequence-rewind-to")return rewindConsequence(Number(el.dataset.index));
    if(action==="consequence-compare"){Core.current.data.comparePath=1;return render();}
    if(action==="consequence-close-compare"){Core.current.data.comparePath=null;return render();}
    if(action==="scenario-create")return startScenarioCreator();
    if(action==="scenario-cancel"){Core.current.data.creator=null;return render();}
    if(action==="creator-setting"){Core.current.data.creator.setting=el.dataset.id;return render();}
    if(action==="creator-problem"){Core.current.data.creator.problem=el.dataset.value;return render();}
    if(action==="scenario-next")return scenarioNext();
    if(action==="scenario-play-created")return playCreatedScenario();
    if(action==="consequence-replay-next"||action==="consequence-replay-prev"){const d=Core.current.data,n=d.history.length;d.replayStep=Core.clamp((d.replayStep||0)+(action.endsWith("next")?1:-1),0,n);return render();}

    if(action==="duplicate"){Core.duplicate(el.dataset.id);Core.announce("Creation copied");return render();}
    if(action==="rename")return renameModal(el.dataset.id);
    if(action==="confirm-rename"){Core.rename(el.dataset.id,document.querySelector("#rename-value")?.value||"");Core.closeModal();return render();}
    if(action==="export-item")return Core.exportJSON(Core.library.items.find(i=>i.id===el.dataset.id));
    if(action==="delete-item")return confirmDelete(el.dataset.id);
    if(action==="confirm-delete"){Core.remove(el.dataset.id);Core.closeModal();return render();}
    if(action==="library-present"){startDefault(null,el.dataset.id);route.mode="present";return render();}
    if(action==="clear-library")return clearLibraryModal();
    if(action==="confirm-clear"){Core.resetLibrary();Core.closeModal();return render();}
    if(action==="import-json")return document.querySelector("#json-import")?.click();
  });

  function paintWorldTile(index){
    const d=Core.current.data,tool=d.tool;
    Core.mutate("shape land",()=>{if(tool==="raise")d.elevation[index]=Core.clamp((d.elevation[index]||1)+1,0,4);else if(tool==="lower")d.elevation[index]=Core.clamp((d.elevation[index]||1)-1,0,4);else if(B.terrains.some(t=>t.id===tool))d.tiles[index]=tool;},false);
    const cell=document.querySelector(`[data-index="${index}"]`);if(cell){cell.className=`world-tile tile-${d.tiles[index]} level-${d.elevation[index]}`;cell.innerHTML=`<span>${terrainGlyph(d.tiles[index])}</span>`;}Core.sound("place");
  }

  function addWorldObject(type){Core.mutate("place object",d=>{const o=worldObject(type);d.objects.push({id:Core.uid("place"),type,name:o.name,x:38+(d.objects.length%4)*9,y:38+(d.objects.length%3)*10,note:"",state:"calm"});d.selected=d.objects.at(-1).id;checkWorldDiscoveries(d);});Core.sound("place");}
  function addWorldPerson(type){Core.mutate("place inhabitant",d=>{const p=B.inhabitants.find(x=>x.id===type);d.people.push({id:Core.uid("person"),type,name:p.name,need:p.need,x:48+(d.people.length%4)*7,y:59+(d.people.length%2)*9});d.selected=d.people.at(-1).id;});Core.sound("place");}
  function setWorldWeather(value){Core.mutate("change weather",d=>{if(value==="night")d.time=d.time==="night"?"day":"night";else d.weather=value;checkWorldDiscoveries(d);});Core.sound("open");}
  function checkWorldDiscoveries(d){if(d.time==="night"&&d.objects.some(o=>o.type==="cave")&&!d.discoveries.includes("A hidden door opens beneath the cave"))d.discoveries.push("A hidden door opens beneath the cave");if(d.weather==="rain"&&d.objects.some(o=>o.type==="ruins")&&!d.discoveries.includes("Rain reveals old markings in the ruins"))d.discoveries.push("Rain reveals old markings in the ruins");}
  function addWorldEvent(){const template=Core.copy(B.eventDeck[(Core.current.data.events.length+Core.current.data.objects.length)%B.eventDeck.length]);template.id=Core.uid("event");template.choices=["Help now","Watch first","Change world"];Core.mutate("begin event",d=>d.events.push(template));}
  function resolveWorldEvent(index){Core.mutate("respond to event",d=>{const e=d.events.at(-1);e.resolved=true;e.choice=index;if(index===2&&e.effect==="rain")d.weather="rain";if(index===0)d.people.forEach(p=>p.need="celebration");});Core.sound("discover");}
  function saveObjectName(id){const value=document.querySelector("#object-name")?.value.trim();if(!value)return;Core.closeModal();Core.mutate("name object",()=>{const o=findMovable("world-object",id)||findMovable("world-person",id);o.name=value;});}
  function duplicateWorldObject(id){Core.mutate("duplicate object",d=>{const src=[...d.objects,...d.people].find(o=>o.id===id);if(!src)return;const dest=d.objects.includes(src)?d.objects:d.people;dest.push({...Core.copy(src),id:Core.uid("copy"),x:Core.clamp(src.x+7,2,86),y:Core.clamp(src.y+7,2,84)});d.selected=dest.at(-1).id;});}
  function deleteWorldObject(id){Core.mutate("remove object",d=>{d.objects=d.objects.filter(o=>o.id!==id);d.people=d.people.filter(o=>o.id!==id);d.selected=null;});}

  function changeMysteryLocation(id){Core.mutate("visit place",d=>{d.locationId=id;if(!d.visited.includes(id))d.visited.push(id);});Core.sound("open");}
  function inspectMysteryClue(id,el){const d=Core.current.data,m=mysteryData(),clue=allMysteryClues(m).find(c=>c.id===id);if(d.clues.some(c=>c.id===id)){Core.announce("Already in your pouch");return;}const raw=clue.action||"magnify",expected=B.tools.mystery.includes(raw)?raw:["compare","trace","align","measure"].includes(raw)?"magnify":"hand";if(d.tool!=="hand"&&d.tool!==expected){Core.announce(`Try ${expected}`);el.classList.add("wrong-tool");setTimeout(()=>el.classList.remove("wrong-tool"),700);return;}el.classList.add("revealing");setTimeout(()=>{Core.mutate("discover clue",d=>d.clues.push({id,status:"found"}));Core.sound("discover");Core.announce(clue.title);},420);}
  function selectMysteryClue(id){const d=Core.current.data;const next=d.selectedClues.includes(id)?d.selectedClues.filter(x=>x!==id):[...d.selectedClues.slice(-1),id];d.selectedClues=next;render();}
  function connectMysteryClues(){const d=Core.current.data;if(d.selectedClues.length!==2)return;Core.mutate("connect clues",d=>{if(!d.clueLinks.some(p=>p.includes(d.selectedClues[0])&&p.includes(d.selectedClues[1])))d.clueLinks.push([...d.selectedClues]);d.selectedClues=[];});Core.sound("discover");}
  function addMysteryTimeline(){const d=Core.current.data,id=d.selectedClues[0];if(!id)return;Core.mutate("place on timeline",d=>{if(!d.timeline.includes(id))d.timeline.push(id);d.selectedClues=[];});}
  function mysteryHint(){const d=Core.current.data;d.hints=Core.clamp(d.hints+1,0,3);const loc=mysteryData().locations.find(l=>l.id===d.locationId),unfound=loc.clues.find(c=>!d.clues.some(x=>x.id===c.id));if(d.hints===1)document.querySelector(".location-ribbon button:not(.visited)")?.classList.add("hint-glow");else if(d.hints===2)document.querySelector(`[data-id="${unfound?.id}"]`)?.classList.add("hint-glow");else{Core.current.data.tool=unfound?.action||"magnify";render();document.querySelector(`[data-id="${unfound?.id}"]`)?.classList.add("gesture-demo");}Core.announce(["A useful place is glowing","One object matters here","Try this action"][d.hints-1]);Core.queueSave();}
  function blankTheory(){return{id:Core.uid("theory"),pieces:{cause:"",object:"",place:"",time:"",action:""},clueIds:[],note:"",saved:false};}
  function currentTheory(){const d=Core.current.data;if(!d.theories.length)d.theories.push(blankTheory());return d.theories.at(-1);}
  function setTheoryPiece(key,value){currentTheory().pieces[key]=value;Core.queueSave();}
  function saveTheory(){const root=document.querySelector("[data-modal]"),ids=[...root.querySelectorAll("[data-theory-clue]:checked")].map(x=>x.dataset.theoryClue),t=currentTheory();t.clueIds=ids;t.saved=true;Core.saveCurrent(true);Core.closeModal();Core.announce("Theory saved");render();}
  function newTheory(){Core.current.data.theories.push(blankTheory());Core.queueSave();Core.closeModal();showTheoryBuilder();}

  function selectEvidence(id){const d=Core.current.data;if(d.tool==="flip"){d.selected=[id];return flipEvidence();}if(d.tool==="rotate"){const p=d.placed.find(x=>x.id===id);Core.mutate("rotate evidence",()=>p.rotation=(p.rotation+18)%360);return;}if(d.tool==="magnify"){const p=d.placed.find(x=>x.id===id);Core.mutate("magnify evidence",()=>p.scale=p.scale>=1.35?1:1.35);return;}if(d.tool==="measure"){d.selected=[id];Core.announce(`${evidenceItem(id).title}: compare its scale and source`);return render();}if(["string","compare"].includes(d.tool)){d.selected=d.selected.includes(id)?d.selected.filter(x=>x!==id):[...d.selected.slice(-1),id];if(d.selected.length===2){const label=d.tool==="compare"?"fits":"supports";Core.mutate("connect evidence",d=>{d.connections.push({a:d.selected[0],b:d.selected[1],label});d.selected=[];});Core.sound("discover");}else render();return;}d.selected=d.selected.includes(id)?[]:[id];render();}
  function openEvidence(){const d=Core.current.data,set=evidenceData(),next=set.evidence.find(e=>!d.placed.some(p=>p.id===e.id)&&!d.hidden.includes(e.id));if(!next)return;Core.mutate("open evidence",d=>d.placed.push({id:next.id,x:60+(d.placed.length%2)*15,y:20+(d.placed.length%3)*18,rotation:(d.placed.length%3-1)*4,scale:1,group:""}));Core.sound("open");}
  function flipEvidence(){const d=Core.current.data,id=d.selected[0];if(!id)return;Core.mutate("flip evidence",d=>{d.flipped=d.flipped.includes(id)?d.flipped.filter(x=>x!==id):[...d.flipped,id];},false);render();}
  function hideEvidence(){const d=Core.current.data,id=d.selected[0];if(!id)return;Core.mutate("hide evidence",d=>{d.placed=d.placed.filter(p=>p.id!==id);d.hidden.push(id);d.connections=d.connections.filter(c=>c.a!==id&&c.b!==id);d.selected=[];});}
  function revealEvidence(){const d=Core.current.data,set=evidenceData(),id=set.evidence.find(e=>!d.placed.some(p=>p.id===e.id)&&!d.hidden.includes(e.id))?.id;if(!id)return;Core.mutate("reveal evidence",d=>{d.placed.push({id,x:66,y:48,rotation:2,scale:1,group:""});d.revealed.push(id);});Core.sound("discover");}
  function claimModal(){const d=Core.current.data;Core.modal(`<div class="modal-head"><h2 id="modal-title">Place your claim</h2><button data-action="close-modal">${V.icon("close")}</button></div><label class="single-field"><span>One clear sentence</span><textarea id="claim-value" maxlength="180">${E(d.claim)}</textarea></label><div class="relation-picker">${B.relationLabels.slice(4).map(r=>`<span>${r}</span>`).join("")}</div><button class="primary-button" data-action="save-claim">Place claim</button>`);}
  function saveClaim(){const value=document.querySelector("#claim-value")?.value.trim();if(!value)return;Core.closeModal();Core.mutate("place claim",d=>{d.claim=value;if(d.selected.length===1)d.connections.push({a:"claim",b:d.selected[0],label:"supports"});d.selected=[];});}
  function startEvidenceCreator(){Core.mutate("start creator",d=>d.creator={step:0,question:"",type:"photo",title:"",text:"",evidence:[],start:[]});}
  function evidenceCreatorNext(){const c=Core.current.data.creator;if(c.step===0&&!c.question.trim())return Core.announce("Add one clear question");if(c.step===1&&c.evidence.length<3)return Core.announce("Add at least three pieces");c.step=Core.clamp(c.step+1,0,3);Core.queueSave();render();}
  function creatorAddEvidence(){const c=Core.current.data.creator;if(!c.title.trim()||!c.text.trim())return Core.announce("Add a title and detail");c.evidence.push({id:Core.uid("custom-evidence"),type:c.type,title:c.title,text:c.text});c.title="";c.text="";Core.queueSave();render();}
  function playCreatedEvidence(){const d=Core.current.data,c=d.creator,id=Core.uid("custom-set");C.evidenceSets.push({id,title:"My investigation",subject:"Created case",question:c.question,context:"A locally created investigation.",evidence:Core.copy(c.evidence)});Core.current.title="My investigation";Core.current.data=newEvidence(id);Core.saveCurrent(true);render();}

  function addPart(type){Core.mutate("place part",d=>{d.parts.push({id:Core.uid("part"),type,x:38+(d.parts.length%4)*10,y:34+(d.parts.length%3)*13,rotation:0,size:1,label:""});d.selected=[d.parts.at(-1).id];});Core.sound("place");}
  function selectPart(id){const d=Core.current.data;if(d.tool==="delete"){Core.mutate("remove part",d=>{d.parts=d.parts.filter(p=>p.id!==id);d.connections=d.connections.filter(c=>c.a!==id&&c.b!==id);});return;}if(d.tool==="rotate"){Core.mutate("rotate part",()=>{const p=d.parts.find(x=>x.id===id);p.rotation=(p.rotation+30)%360;});return;}if(d.tool==="resize"){Core.mutate("resize part",()=>{const p=d.parts.find(x=>x.id===id);p.size=p.size>=1.2?.8:Number((p.size+.2).toFixed(1));});return;}if(d.tool==="lock"){Core.mutate("lock part",()=>{const p=d.parts.find(x=>x.id===id);p.locked=!p.locked;});Core.announce(d.parts.find(x=>x.id===id).locked?"Part locked":"Part unlocked");return;}if(d.tool==="duplicate"){Core.mutate("duplicate part",d=>{const p=d.parts.find(x=>x.id===id);d.parts.push({...Core.copy(p),id:Core.uid("part"),x:p.x+6,y:p.y+7,locked:false});});return;}if(d.tool==="connect"){d.selected=d.selected.includes(id)?d.selected.filter(x=>x!==id):[...d.selected.slice(-1),id];if(d.selected.length===2){Core.mutate("connect parts",d=>{d.connections.push({a:d.selected[0],b:d.selected[1]});d.selected=[];});Core.sound("discover");}else render();return;}d.selected=d.selected.includes(id)?[]:[id];render();}
  function testInvention(){const d=Core.current.data,test=runTest(d);Core.mutate("test invention",d=>{d.testHistory.push(test);d.testMotion=test.outcome;},false);Core.sound("test");render();setTimeout(()=>{if(Core.current){Core.current.data.testMotion=null;render();}},1400);}
  function saveVersion(){const d=Core.current.data;if(!d.parts.length)return;Core.mutate("save version",d=>d.versions.push({id:Core.uid("version"),parts:Core.copy(d.parts),connections:Core.copy(d.connections),test:Core.copy(d.testHistory.at(-1)||null)}));Core.announce(`Version ${d.versions.length} saved`);}
  function showInventorVersions(){
    const d=Core.current.data,versions=[...d.versions,{id:"current",parts:d.parts,connections:d.connections,test:d.testHistory.at(-1)||null,current:true}];
    const cards=versions.map((v,i)=>{const before=versions[i-1]?.parts||[],changed=i?Math.max(0,v.parts.length-before.length)+v.parts.filter(p=>!before.some(b=>b.type===p.type)).length:v.parts.length;return`<article class="version-card ${v.current?"current":""}"><header><small>${v.current?"Current design":`Version ${i+1}`}</small><strong>${v.test?.message||"Not tested"}</strong></header><div class="version-parts">${v.parts.slice(0,8).map(p=>V.partArt(p.type)).join("")}</div><footer><span>${v.parts.length} parts</span><span>${v.connections.length} joins</span><span>${i?`${changed} changes`:"First idea"}</span></footer></article>`;}).join("");
    Core.modal(`<div class="modal-head"><div><small>Blueprint shelf</small><h2 id="modal-title">See what changed</h2></div><button data-action="close-modal">${V.icon("close")}</button></div><div class="version-comparison">${cards}</div><p class="modal-note">Each saved blueprint keeps its parts, joins and latest test.</p>`,{wide:true});
  }

  function perspectiveModal(){const h=Core.current.data.history.at(-1);Core.modal(`<div class="modal-head"><div><small>People affected</small><h2 id="modal-title">Different views</h2></div><button data-action="close-modal">${V.icon("close")}</button></div><div class="perspective-portraits">${(h?.perspectives||[]).map((p,i)=>`<button data-action="speak" data-text="${E(p.text)}"><i class="portrait p-${i}"></i><strong>${E(p.person)}</strong><span>${E(p.text)}</span>${V.icon("speak")}</button>`).join("")}</div>`);}
  function savePath(){const d=Core.current.data;if(!d.history.length)return Core.announce("Make one decision first");d.savedPaths.push({history:Core.copy(d.history),state:Core.copy(d.sceneState),ending:d.ending,currentNode:d.currentNode});Core.queueSave();Core.announce("Path saved for comparison");render();}
  function rewindConsequence(index){const d=Core.current.data,s=consequenceData();if(index<0){d.history=[];d.currentNode="opening";d.sceneState={nature:3,people:3,access:3,resources:3,time:0};d.complete=false;d.ending="";}else{const entry=d.history[index];d.history=d.history.slice(0,index);d.currentNode=entry.node;d.sceneState=Core.copy(entry.state);d.complete=false;d.ending="";}Core.queueSave();render();}
  function startScenarioCreator(){Core.mutate("start scenario creator",d=>d.creator={step:0,setting:"river",problem:"",a:"",b:"",aEffect:"helps people",bEffect:"protects nature"});}
  function scenarioNext(){const c=Core.current.data.creator;if(c.step===1&&!c.problem)return Core.announce("Choose a problem");if(c.step===2&&(!c.a.trim()||!c.b.trim()))return Core.announce("Add two actions");c.step=Core.clamp(c.step+1,0,4);Core.queueSave();render();}
  function playCreatedScenario(){
    const d=Core.current.data,c=d.creator,id=Core.uid("scenario");
    const effect=(label,text)=>({id:Core.uid("choice"),label,immediate:text==="helps people"?"People gain support.":text==="protects nature"?"The environment begins to recover.":text==="opens access"?"A route opens.":"Supplies are used.",unintended:text==="helps people"?"Another group waits longer.":"The change creates a new pressure."});
    const a=effect(c.a,c.aEffect),b=effect(c.b,c.bEffect),a1=effect("Adjust it","helps people"),a2=effect("Continue","uses supplies"),b1=effect("Adjust it","protects nature"),b2=effect("Continue","opens access");
    const finalNode=(source,key)=>({info:source.unintended,prompt:"What matters later?",choices:[{...effect("Review the plan","helps people"),id:`${key}-review`,ending:"The plan changes with new evidence, while one question remains."},{...effect("Keep the plan","uses supplies"),id:`${key}-keep`,ending:"The plan continues and its unresolved pressure stays visible."}]});
    C.consequences.push({id,title:"My scenario",setting:`${c.problem} in the ${c.setting}.`,opening:{prompt:"What should happen next?",choices:[{...a,next:"a-later"},{...b,next:"b-later"}]},nodes:{
      "a-later":{info:a.unintended,prompt:"Adjust or continue?",choices:[{...a1,next:"a1-final"},{...a2,next:"a2-final"}]},
      "b-later":{info:b.unintended,prompt:"Adjust or continue?",choices:[{...b1,next:"b1-final"},{...b2,next:"b2-final"}]},
      "a1-final":finalNode(a1,"a1"),"a2-final":finalNode(a2,"a2"),"b1-final":finalNode(b1,"b1"),"b2-final":finalNode(b2,"b2")
    }});
    Core.current.title="My scenario";Core.current.data=newConsequence(id);Core.saveCurrent(true);render();
  }

  function renameModal(id){const item=Core.library.items.find(i=>i.id===id);Core.modal(`<div class="modal-head"><h2 id="modal-title">Rename creation</h2><button data-action="close-modal">${V.icon("close")}</button></div><label class="single-field"><span>Title</span><input id="rename-value" value="${E(item?.title||"")}"></label><button class="primary-button" data-action="confirm-rename" data-id="${id}">Save title</button>`);}
  function confirmDelete(id){const item=Core.library.items.find(i=>i.id===id);Core.modal(`<div class="modal-head"><h2 id="modal-title">Remove this creation?</h2><button data-action="close-modal">${V.icon("close")}</button></div><p>${E(item?.title||"")}</p><div class="modal-actions"><button class="danger-button" data-action="confirm-delete" data-id="${id}">Delete</button><button class="soft-button" data-action="close-modal">Keep it</button></div>`);}
  function clearLibraryModal(){Core.modal(`<div class="modal-head"><h2 id="modal-title">Clear every creation?</h2><button data-action="close-modal">${V.icon("close")}</button></div><p>Export anything important first. This cannot be undone.</p><div class="modal-actions"><button class="danger-button" data-action="confirm-clear">Clear all data</button><button class="soft-button" data-action="close-modal">Cancel</button></div>`);}

  document.addEventListener("input",event=>{
    const el=event.target;
    if(el.dataset.action==="world-water"){Core.current.data.waterLevel=Number(el.value);Core.queueSave();}
    if(el.dataset.env){Core.current.data.environment[el.dataset.env]=Number(el.value);Core.queueSave();}
    if(el.dataset.creatorField)Core.current.data.creator[el.dataset.creatorField]=el.value;
    if(el.dataset.scenarioField)Core.current.data.creator[el.dataset.scenarioField]=el.value;
  });
  document.addEventListener("change",event=>{
    const el=event.target;if(el.dataset.setting)Core.setSetting(el.dataset.setting,el.checked);
    if(el.dataset.creatorStart){const c=Core.current.data.creator,i=Number(el.dataset.creatorStart);if(el.checked&&!c.start.includes(i))c.start.push(i);if(!el.checked)c.start=c.start.filter(x=>x!==i);Core.queueSave();}
  });

  document.addEventListener("pointerdown",event=>{if(event.target.closest("[data-action='world-paint']"))worldPainting=true;});
  document.addEventListener("pointerover",event=>{if(worldPainting){const tile=event.target.closest("[data-action='world-paint']");if(tile)paintWorldTile(Number(tile.dataset.index));}});
  document.addEventListener("pointerup",()=>worldPainting=false);
  document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement&&route.mode==="present"){route.mode="edit";render();}});
  document.querySelector("#json-import")?.addEventListener("change",async event=>{const file=event.target.files?.[0];if(file){await Core.importJSON(file);render();}event.target.value="";});

  window.WorkshopApp={findMovable,move,drop,zoom};
  renderHome();
})();
