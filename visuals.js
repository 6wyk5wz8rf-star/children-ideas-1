(function () {
  "use strict";

  const paths = {
    home:'<path d="M4 11 12 4l8 7v9H4z"/><path d="M9 20v-6h6v6"/>',
    world:'<path d="M3 17 7 7l5 5 3-8 6 13Z"/><path d="M2 20h20M6 15c4-2 8-2 12 0"/>',
    mystery:'<path d="M4 19V7l5-3 6 3 5-2v12l-5 3-6-3-5 2Z"/><path d="M9 4v13M15 7v13"/><circle cx="12" cy="11" r="2"/>',
    evidence:'<rect x="3" y="5" width="8" height="6" rx="1"/><rect x="13" y="14" width="8" height="6" rx="1"/><path d="m11 8 5 6M7 11v5h6"/>',
    inventor:'<path d="M4 16h16l-2 4H6z"/><path d="m7 16 2-8h6l2 8M11 8V4l2-2 2 2-2 2M3 11h4M17 11h4"/>',
    consequence:'<path d="M12 3v18M12 8 6 5M12 13l6-4M6 5v5M18 9v5"/><circle cx="12" cy="3" r="2"/><circle cx="6" cy="11" r="2"/><circle cx="18" cy="15" r="2"/><circle cx="12" cy="21" r="2"/>',
    save:'<path d="M5 4h12l2 2v14H5z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/>',
    undo:'<path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/>',
    redo:'<path d="m15 7 5 5-5 5M19 12h-8a6 6 0 0 0-6 6"/>',
    fit:'<path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4"/>',
    zoomIn:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M10 7v6M7 10h6"/>',
    zoomOut:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M7 10h6"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 0 1 5 1c0 2-2.5 2.3-2.5 4M12 17h.01"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    folder:'<path d="M3 6h7l2 2h9v11H3z"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    play:'<path d="m8 5 11 7-11 7z"/>',
    print:'<path d="M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z"/>',
    export:'<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
    speak:'<path d="M5 10v4h4l4 4V6L9 10zM16 9c1 1 1 5 0 6M19 7c3 3 3 7 0 10"/>',
    hand:'<path d="M8 12V6a2 2 0 0 1 4 0v4-6a2 2 0 0 1 4 0v7-4a2 2 0 0 1 4 0v7c0 5-3 8-8 8H9c-3 0-5-2-6-5l-1-3a2 2 0 0 1 4-1l2 3"/>',
    magnify:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
    light:'<path d="M8 15h8M9 18h6M10 21h4"/><path d="M7 11a5 5 0 1 1 10 0c0 2-2 3-2 4H9c0-1-2-2-2-4Z"/>',
    listen:'<path d="M4 14c0-6 3-10 8-10s8 4 8 10v5h-4v-5M4 14v5h4v-5"/>',
    flip:'<path d="M4 12a8 8 0 0 1 14-5l2 2M20 4v5h-5M20 12a8 8 0 0 1-14 5l-2-2M4 20v-5h5"/>',
    measure:'<path d="m4 17 13-13 3 3L7 20z"/><path d="m9 15-2-2M12 12l-2-2M15 9l-2-2"/>',
    compare:'<path d="M4 5h6v14H4zM14 5h6v14h-6z"/>',
    string:'<path d="M4 17c3-8 6-8 8 0s5 8 8 0"/><circle cx="4" cy="17" r="2"/><circle cx="20" cy="17" r="2"/>',
    question:'<path d="M4 5h16v14H8l-4 3z"/><path d="M9.5 10a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/>',
    connect:'<path d="M10 13a4 4 0 0 0 6 0l2-2a4 4 0 0 0-6-6l-1 1M14 11a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 6 6l1-1"/>',
    rotate:'<path d="M5 7v5h5M6 17a8 8 0 1 0-1-8"/>',
    resize:'<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/><path d="m8 8-5-5M16 8l5-5M8 16l-5 5M16 16l5 5"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    duplicate:'<rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/>',
    delete:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',
    test:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8"/>',
    rewind:'<path d="m11 6-6 6 6 6M6 12h8a6 6 0 0 1 6 6"/>',
    map:'<path d="M4 5v14l5-2 6 2 5-2V3l-5 2-6-2zM9 3v14M15 5v14"/>',
    show:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
  };

  function icon(name, label = "") {
    return `<svg class="icon" viewBox="0 0 24 24" ${label?`role="img" aria-label="${label}"`:'aria-hidden="true"'}>${paths[name] || paths.question}</svg>`;
  }

  function workshopRoom() {
    return `<svg viewBox="0 0 1200 720" role="img" aria-label="An illustrated workshop with five active areas" class="room-art">
      <defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#eee8dc"/><stop offset="1" stop-color="#ddd2c0"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="8"/></filter></defs>
      <path fill="url(#wall)" d="M0 0h1200v720H0z"/><path fill="#cbbb9f" d="M0 560h1200v160H0z"/><path stroke="#aa9677" opacity=".3" d="M0 610h1200M0 665h1200M90 560l-20 160M260 560l-8 160M450 560l5 160M650 560l13 160M850 560l22 160M1050 560l28 160"/>
      <rect x="70" y="80" width="310" height="220" rx="8" fill="#d1c7b4" stroke="#5c6272"/><path d="M85 264c70-80 121-33 163-104 30 46 57 55 117 95" fill="#89a685"/><path d="M85 264c88-20 165 25 280-11" fill="none" stroke="#729aac" stroke-width="12"/><circle cx="160" cy="140" r="24" fill="#e7d493"/>
      <rect x="450" y="95" width="270" height="190" rx="10" fill="#c5baa6" stroke="#5c6272"/><path d="M475 245 525 130l60 62 52-79 58 132z" fill="#9bad91"/><path d="M480 140c55 15 90 5 145-22" fill="none" stroke="#f5ead2" stroke-width="5" stroke-dasharray="8 8"/><circle cx="637" cy="118" r="18" fill="#e9c375"/>
      <rect x="790" y="70" width="330" height="240" rx="8" fill="#313847"/><g fill="#efe5d2" opacity=".95"><rect x="820" y="110" width="80" height="56" transform="rotate(-4 820 110)"/><rect x="940" y="95" width="95" height="68" transform="rotate(5 940 95)"/><rect x="860" y="205" width="88" height="62" transform="rotate(3 860 205)"/></g><g stroke="#d39772" stroke-width="3"><path d="m875 135 95 93M990 130l-72 105"/></g>
      <rect x="100" y="390" width="450" height="38" rx="8" fill="#8a674a"/><path fill="#705139" d="M130 428h26v165h-26zM492 428h26v165h-26z"/><g fill="#a98a5e" stroke="#39414d"><circle cx="185" cy="365" r="37"/><circle cx="260" cy="371" r="29"/><path d="M330 387v-65h65v65z"/><path d="m424 385 34-74 31 74z"/></g>
      <path d="M650 595c30-145 145-205 244-115 80 72 170 35 248-60" fill="none" stroke="#8d9279" stroke-width="54"/><path d="M650 595c30-145 145-205 244-115 80 72 170 35 248-60" fill="none" stroke="#e4d2aa" stroke-width="30" stroke-dasharray="12 13"/>
      <g class="room-ambient"><circle cx="265" cy="115" r="7" fill="#fff" opacity=".7"/><path d="M275 115h42" stroke="#fff" opacity=".5"/><circle cx="1065" cy="199" r="8" fill="#f5d97e" filter="url(#soft)"/></g>
    </svg>`;
  }

  function miniWorld(type = "village", state = "calm") {
    const art = {
      village:'<path d="m5 16 7-6 7 6v6H5z"/><path d="M9 22v-5h6v5M7 12V7h3v3"/>',
      farm:'<path d="M4 21V11l8-6 8 6v10M8 21v-7h8v7"/><path d="M2 23h20M3 18h3M18 18h3"/>',
      windmill:'<path d="m8 22 2-12h4l2 12z"/><circle cx="12" cy="9" r="2"/><path class="spin" d="M12 7V1M14 9h6M12 11v6M10 9H4"/>',
      bridge:'<path d="M2 19h20M5 19V9M19 19V9M5 11c4 5 10 5 14 0"/>',
      harbour:'<path d="M3 19h18M6 19l2-5h8l2 5M9 14V8h6v6M12 8V3"/>',
      lighthouse:'<path d="m8 22 2-13h4l2 13zM9 9h6M10 5h4v4"/><path class="beam" d="M14 6 23 2M10 6 1 2"/>',
      cave:'<path d="M3 21c1-10 5-16 9-16s8 6 9 16z"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/>',
      ruins:'<path d="M4 22V8h5v5h5V6h6v16M2 22h20"/>',
      market:'<path d="M3 10h18l-2-5H5zM5 10v12M19 10v12M3 22h18"/><path d="M8 10v3M12 10v3M16 10v3"/>',
      observatory:'<path d="M5 22h14M7 22v-8a5 5 0 0 1 10 0v8M7 14h10"/><path d="m14 9 4-6 3 2-5 5"/>',
      treehouse:'<path d="M12 22v-9M5 13h14l-3-4h2l-6-7-6 7h2z"/><path d="M9 16h6v5H9z"/>',
      gate:'<path d="M4 22V9a8 8 0 0 1 16 0v13M8 22V10a4 4 0 0 1 8 0v12"/>'
    };
    return `<svg class="world-object-art state-${state}" viewBox="0 0 24 24" aria-hidden="true">${art[type] || art.village}</svg>`;
  }

  function person(type="traveller",need="route") {
    const hats={traveller:"M7 6h10",builder:"M7 6h10l-2 2h14l-2-2",farmer:"M6 7h12M9 4h6l2 3H7z",explorer:"M8 6h8l2 2H6z",keeper:"M8 4h8v4H8z",creature:"M6 7 4 3M18 7l2-4"};
    return `<svg class="person-art" viewBox="0 0 24 30" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M6 28c0-9 2-14 6-14s6 5 6 14M8 19l-5 5M16 19l5 5"/>${hats[type]||hats.traveller}<g class="need-symbol"><circle cx="20" cy="6" r="5"/><text x="20" y="8">${{route:"→",help:"+",water:"≈",discovery:"?",safety:"◇",shelter:"⌂"}[need]||"·"}</text></g></svg>`;
  }

  function mysteryScene(location,index=0) {
    const palettes=[['#a7b69b','#d6c79e'],['#8ba8b0','#d7c39f'],['#a397b2','#d0c0a6'],['#a8a077','#d4b98c'],['#8195a7','#d9d0bc']];
    const p=palettes[index%palettes.length];
    return `<svg viewBox="0 0 800 430" role="img" aria-label="Illustrated scene at ${location.name}">
      <defs><linearGradient id="sky-${index}" x2="0" y2="1"><stop stop-color="${p[0]}"/><stop offset="1" stop-color="#e9e1d2"/></linearGradient></defs>
      <path fill="url(#sky-${index})" d="M0 0h800v430H0z"/><circle cx="650" cy="78" r="43" fill="#f1d79b" opacity=".75"/><path fill="${p[1]}" d="M0 305c110-62 190-25 285-73 90-45 201 73 285 15 84-58 157-24 230 14v169H0z"/>
      <path d="M40 365h720M78 365V186l122-72 126 72v179M475 365V226l96-55 103 55v139" fill="none" stroke="#404b54" stroke-width="8" stroke-linejoin="round"/>
      <path d="M125 365V245h71v120M236 208h50v69h-50M518 365v-78h76v78M620 248h29v58h-29" fill="none" stroke="#404b54" stroke-width="7"/>
      <path d="M43 395c180-42 310 28 470-10 100-24 168-9 250 8" fill="none" stroke="#718f85" stroke-width="13" stroke-linecap="round"/>
    </svg>`;
  }

  function evidenceArt(e) {
    const t=e.type;
    if(["map","aerial"].includes(t)) return `<svg viewBox="0 0 140 80"><path d="M6 68 33 13l30 36 22-34 48 51M14 58c28-17 47 14 83-17"/><circle cx="86" cy="15" r="5"/></svg>`;
    if(["measurement","graph","comparison","chart"].includes(t)) return `<svg viewBox="0 0 140 80"><path d="M12 8v61h119M20 61l28-20 22 8 27-35 25 13"/><g><circle cx="20" cy="61" r="3"/><circle cx="48" cy="41" r="3"/><circle cx="70" cy="49" r="3"/><circle cx="97" cy="14" r="3"/></g></svg>`;
    if(t==="timeline") return `<svg viewBox="0 0 140 80"><path d="M8 41h124M28 27v28M69 27v28M111 27v28"/><circle cx="28" cy="41" r="6"/><circle cx="69" cy="41" r="6"/><circle cx="111" cy="41" r="6"/></svg>`;
    if(["weather","water","environment","light","temperature"].includes(t)) return `<svg viewBox="0 0 140 80"><circle cx="38" cy="28" r="15"/><path d="M38 5v9M15 28h9M52 28h9M79 64c7-31 35-33 50 0M69 66h65"/></svg>`;
    if(["object","sample"].includes(t)) return `<svg viewBox="0 0 140 80"><path d="m42 68-11-43 34-12 39 30-17 29zM40 34l49 29M57 17l22 52"/></svg>`;
    if(t==="sound") return `<svg viewBox="0 0 140 80"><path d="M12 41h16l12-14v28L28 41M56 31c7 6 7 14 0 20M71 23c13 11 13 25 0 36"/><path d="M96 17v46M108 28v24M120 10v60"/></svg>`;
    return `<svg viewBox="0 0 140 80"><path d="M34 6h72v68H34zM47 22h45M47 34h38M47 46h44M47 58h29"/></svg>`;
  }

  function partArt(type) {
    const art={beam:'<rect x="2" y="9" width="28" height="8" rx="2"/>',board:'<rect x="3" y="5" width="26" height="17" rx="2"/>',wheel:'<circle cx="16" cy="13" r="10"/><circle cx="16" cy="13" r="3"/><path d="M16 3v20M6 13h20"/>',axle:'<path d="M3 13h26M7 9v8M25 9v8"/>',gear:'<circle cx="16" cy="13" r="8"/><circle cx="16" cy="13" r="3"/><path d="M16 1v4M16 21v4M4 13h4M24 13h4M7 4l3 3M22 19l3 3M25 4l-3 3M10 19l-3 3"/>',rope:'<path d="M2 19C8 2 13 25 20 7c3-7 6 2 10-2"/>',pulley:'<circle cx="16" cy="11" r="8"/><path d="M16 3v-2M8 24V11M24 11v13"/>',fabric:'<path d="M3 4h26v18H3zM3 8c7 4 18-4 26 0M3 16c7 4 18-4 26 0"/>',elastic:'<path d="M3 13c5-12 9 12 14 0s9 12 13 0"/>',spring:'<path d="M4 13h4l3-8 5 16 5-16 4 8h4"/>',container:'<path d="M4 6h24l-2 17H6zM3 6h26"/>',ramp:'<path d="M3 23h27L30 6z"/>',hinge:'<path d="M3 5h11v16H3zM18 5h11v16H18zM14 8h4M14 13h4M14 18h4"/>',propeller:'<circle cx="16" cy="13" r="3"/><path d="M16 10c-7-8-12-4-6 3M19 13c8-7 4-12-3-6M16 16c7 8 12 4 6-3M13 13c-8 7-4 12 3 6"/>',weight:'<path d="m6 23 3-14h14l3 14zM12 9V5h8v4"/>',hook:'<path d="M15 2v12a7 7 0 1 1-7-7"/>'};
    return `<svg viewBox="0 0 32 27" aria-hidden="true">${art[type]||art.beam}</svg>`;
  }

  function consequenceScene(id,state={}) {
    const water=80-(state.resources||3)*7,nature=state.nature||3,people=state.people||3;
    return `<svg viewBox="0 0 900 470" role="img" aria-label="Interactive community scene">
      <defs><linearGradient id="csky" x2="0" y2="1"><stop stop-color="#aebfc6"/><stop offset="1" stop-color="#eee3d0"/></linearGradient></defs><path fill="url(#csky)" d="M0 0h900v470H0z"/>
      <path fill="#9fb18b" d="M0 265c120-49 238-13 337-61 105-51 199 42 303 12 97-29 176-5 260 36v218H0z"/>
      <path fill="#83aebe" d="M0 ${water+260}c167-46 262 45 419 1 153-43 292 35 481-8v110H0z"/>
      <g fill="#e7dbc4" stroke="#46515a" stroke-width="5"><path d="M90 308V190l92-55 92 55v118z"/><path d="M640 306V206l70-42 77 42v100z"/></g>
      <path d="M180 390c130-170 348 50 527-112" fill="none" stroke="#d8c399" stroke-width="42"/><path d="M180 390c130-170 348 50 527-112" fill="none" stroke="#f0e5ce" stroke-width="25" stroke-dasharray="8 10"/>
      ${Array.from({length:nature+2},(_,i)=>`<g transform="translate(${330+i*48} ${250-(i%2)*25})"><path d="M0 68V25" stroke="#4f6f56" stroke-width="7"/><circle cy="18" r="24" fill="#6f8b68"/></g>`).join("")}
      ${Array.from({length:people+1},(_,i)=>`<g class="scene-person" transform="translate(${135+i*118} ${345-(i%2)*18})"><circle cy="-18" r="10" fill="#d7a982"/><path d="M0-8v35M0 6l-15 15M0 6l15 15M0 27l-12 23M0 27l12 23" stroke="#38444e" stroke-width="6" stroke-linecap="round"/></g>`).join("")}
    </svg>`;
  }

  window.WorkshopVisuals={icon,workshopRoom,miniWorld,person,mysteryScene,evidenceArt,partArt,consequenceScene};
})();
