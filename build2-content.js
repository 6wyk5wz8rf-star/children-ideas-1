(function () {
  "use strict";

  const C = window.WORKSHOP_CONTENT;

  C.build2 = {
    terrains: [
      { id: "meadow", name: "Meadow", glyph: "✦", colour: "#b8c99a" },
      { id: "forest", name: "Forest", glyph: "♠", colour: "#789478" },
      { id: "water", name: "Water", glyph: "≈", colour: "#83b5c2" },
      { id: "sand", name: "Sand", glyph: "·", colour: "#d8bd84" },
      { id: "rock", name: "Rock", glyph: "◆", colour: "#8f8b82" },
      { id: "snow", name: "Snow", glyph: "❄", colour: "#e9efed" },
      { id: "path", name: "Path", glyph: "—", colour: "#ae906d" }
    ],
    worldObjects: [
      { id: "village", name: "Village", icon: "home", need: "water", reaction: "Lights gather near water." },
      { id: "farm", name: "Farm", icon: "farm", need: "meadow", reaction: "Crops grow on open land." },
      { id: "windmill", name: "Windmill", icon: "windmill", need: "wind", reaction: "The sails turn in wind." },
      { id: "bridge", name: "Bridge", icon: "bridge", need: "water", reaction: "Travellers can cross." },
      { id: "harbour", name: "Harbour", icon: "boat", need: "water", reaction: "Small boats arrive." },
      { id: "lighthouse", name: "Lighthouse", icon: "light", need: "water", reaction: "Its beam appears at night." },
      { id: "cave", name: "Cave", icon: "cave", need: "rock", reaction: "A hidden chamber may open." },
      { id: "ruins", name: "Ruins", icon: "ruins", need: "rock", reaction: "Old markings can be found." },
      { id: "market", name: "Market", icon: "market", need: "village", reaction: "People meet when routes join." },
      { id: "observatory", name: "Observatory", icon: "observatory", need: "high", reaction: "Stars appear after dark." },
      { id: "treehouse", name: "Tree house", icon: "treehouse", need: "forest", reaction: "Forest keepers visit." },
      { id: "gate", name: "Giant gate", icon: "gate", need: "path", reaction: "A route becomes a border." }
    ],
    inhabitants: [
      { id: "traveller", name: "Traveller", icon: "traveller", need: "route" },
      { id: "builder", name: "Builder", icon: "builder", need: "help" },
      { id: "farmer", name: "Farmer", icon: "farmer", need: "water" },
      { id: "explorer", name: "Explorer", icon: "explorer", need: "discovery" },
      { id: "keeper", name: "Keeper", icon: "keeper", need: "safety" },
      { id: "creature", name: "Creature", icon: "creature", need: "shelter" }
    ],
    weather: ["sun", "rain", "snow", "fog", "wind", "night"],
    worldSeeds: ["blank", "island", "valley", "archipelago", "mountain", "forest", "desert", "strange"],
    tools: {
      evidence: ["hand", "magnify", "flip", "rotate", "light", "measure", "compare", "string", "question"],
      mystery: ["hand", "magnify", "light", "listen"],
      inventor: ["hand", "connect", "rotate", "resize", "lock", "duplicate", "delete"]
    },
    relationLabels: ["fits", "conflicts", "before", "after", "same place", "may cause", "supports", "question"],
    eventDeck: [
      { id: "storm", icon: "storm", text: "A storm approaches", effect: "rain" },
      { id: "lost", icon: "traveller", text: "A traveller is lost", effect: "route" },
      { id: "low-water", icon: "water", text: "The water is falling", effect: "water" },
      { id: "blocked", icon: "path", text: "A route is blocked", effect: "route" },
      { id: "signal", icon: "light", text: "A strange light appears", effect: "night" },
      { id: "celebration", icon: "market", text: "A celebration begins", effect: "people" }
    ]
  };

  C.world.examples.push(
    {
      title: "Cloudstep Valley", terrain: "forest", climate: "Mist at dawn, bright afternoons", scale: "A steep valley crossed by rope bridges",
      inhabitants: "Bridge keepers, cloud gardeners and travelling musicians", creatures: "Pale goats that find safe paths through fog", resources: "Spring water, strong vine and slate",
      dangers: "Fog hides the lower crossings", rules: "Every bridge must show a light at dusk", customs: "New paths are opened with music", secret: "One waterfall flows upwards at night",
      problem: "The safest bridge has begun to sag", promptNotes: ["Who should cross first when the bridge reopens?"],
      locations: [{id:"cv1",name:"High Bridge",symbol:"gate",x:48,y:19,notes:"The main valley crossing."},{id:"cv2",name:"Mist Farm",symbol:"home",x:18,y:56,notes:"Food grows on stepped fields."},{id:"cv3",name:"Upfall",symbol:"water",x:72,y:58,notes:"Water reverses after moonrise."}], links:[["cv1","cv2"],["cv1","cv3"]]
    },
    {
      title: "The Buried Coast", terrain: "desert", climate: "Dry wind above cool underground water", scale: "A coast hidden beneath golden dunes",
      inhabitants: "Well finders, sail makers and fossil readers", creatures: "Sand skates that swim beneath dunes", resources: "Salt, shell stone and hidden springs",
      dangers: "Old roofs collapse when dunes move", rules: "A newly found spring belongs to everyone", customs: "Doors uncovered from the old town are painted blue", secret: "A buried boat still carries a living garden",
      problem: "The dunes have covered the only marked well", promptNotes: ["The new route may uncover homes people chose to leave buried."],
      locations: [{id:"bc1",name:"Blue Doors",symbol:"gate",x:22,y:30,notes:"Entrances to the old town."},{id:"bc2",name:"Hidden Well",symbol:"water",x:64,y:25,notes:"Its marker vanished."},{id:"bc3",name:"Garden Boat",symbol:"harbour",x:48,y:70,notes:"Leaves grow beneath its deck."}], links:[["bc1","bc3"],["bc2","bc3"]]
    }
  );

  function mystery(id, title, message, question, solution, clues, locations) {
    return { id, title, message, question, intro: message, solution, resolutionClues: clues, locations };
  }

  C.mysteries.push(
    mystery("bell", "The Bell at Midnight", "The harbour bell rang with nobody there.", "What rang the bell at midnight?",
      "A loose signal rope caught around the weather vane. As the wind turned, the vane pulled the rope and rang the bell. Salt on the knot, matching scrape marks and the wind record connect the events.",
      ["b-rope","b-vane","b-wind","b-scrape"], [
        {id:"bell-tower",name:"Bell Tower",x:48,y:42,scene:"The bell is still. A rope runs towards the roof hatch.",character:"Keeper Ana: ‘The door seal was unbroken.’",clues:[{id:"b-rope",title:"Twisted rope",text:"The signal rope is wound tightly to the right.",role:"useful",kind:"object",action:"rotate"},{id:"b-seal",title:"Door seal",text:"The paper seal across the door has not torn.",role:"useful",kind:"environment",action:"light"}]},
        {id:"roof",name:"Tower Roof",x:46,y:16,scene:"A metal vane turns above the roof hatch.",character:"Roofer Meena: ‘It was repaired last week.’",clues:[{id:"b-vane",title:"Loose vane",text:"A new bolt is loose and a rope fibre is trapped beneath it.",role:"useful",kind:"object",action:"magnify"},{id:"b-scrape",title:"Curved scrape",text:"Fresh marks follow the vane’s turning path.",role:"useful",kind:"measurement",action:"trace"}]},
        {id:"weather",name:"Weather Hut",x:17,y:18,scene:"Paper drums recorded a sharp wind change at midnight.",character:"Noor: ‘The gust arrived just before the bell.’",clues:[{id:"b-wind",title:"Wind trace",text:"Wind turned east at 00:03, when the bell rang.",role:"useful",kind:"timeline",action:"align"},{id:"b-rain",title:"Rain cup",text:"Only 1 mm of rain fell.",role:"uncertain",kind:"environment",action:"measure"}]},
        {id:"jetty",name:"Old Jetty",x:78,y:67,scene:"A small boat rocks beneath the tower.",character:"Fisher Dev: ‘I heard one bell, not the usual three.’",clues:[{id:"b-knot",title:"Salted knot",text:"The loose rope end has fresh sea salt and vane grease.",role:"useful",kind:"comparison",action:"compare"},{id:"b-boat",title:"Boat line",text:"The boat line is a different green rope.",role:"distraction",kind:"object",action:"flip"}]},
        {id:"square",name:"Night Square",x:18,y:70,scene:"A delivery trolley stands near the locked stores.",character:"Ivo: ‘I left before eleven.’",clues:[{id:"b-wheel",title:"Wheel marks",text:"The tracks end at the stores, far from the tower.",role:"distraction",kind:"environment",action:"follow"},{id:"b-clock",title:"Shop clock",text:"Its camera clock is nine minutes slow.",role:"uncertain",kind:"timeline",action:"align"}]}
      ]),
    mystery("signs", "The Vanishing Garden Signs", "Five plant signs disappeared overnight.", "Where did the garden signs go?",
      "The signs were not taken. Dry soil loosened them, wind pushed them into the channel, and overnight watering carried them beneath the leaf screen. Their order was preserved by the narrow flow.",
      ["s-dry","s-wind","s-channel","s-screen"], [
        {id:"beds",name:"Plant Beds",x:35,y:35,scene:"Five empty holes form a neat row.",character:"Mila: ‘They were firm on Friday.’",clues:[{id:"s-dry",title:"Crumbly soil",text:"The top soil is unusually dry and loose around each hole.",role:"useful",kind:"environment",action:"touch"},{id:"s-shoe",title:"Small shoe mark",text:"One old print is partly covered by Friday’s compost.",role:"distraction",kind:"environment",action:"magnify"}]},
        {id:"weather",name:"Wind Flag",x:17,y:16,scene:"The cloth flag points towards the watering channel.",character:"Caretaker Jo: ‘A strong gust came before dusk.’",clues:[{id:"s-wind",title:"Wind record",text:"Gusts blew from the beds towards the channel.",role:"useful",kind:"timeline",action:"align"},{id:"s-rain",title:"No rain",text:"The gauge stayed empty until watering began.",role:"useful",kind:"environment",action:"measure"}]},
        {id:"channel",name:"Water Channel",x:59,y:57,scene:"A narrow channel contains scratches and blue paint.",character:"Eli: ‘The watering timer started at 2 am.’",clues:[{id:"s-channel",title:"Blue scratches",text:"Marks match the painted edges of the missing signs.",role:"useful",kind:"comparison",action:"compare"},{id:"s-timer",title:"Timer",text:"Water flowed for twelve minutes overnight.",role:"useful",kind:"timeline",action:"rotate"}]},
        {id:"screen",name:"Leaf Screen",x:80,y:76,scene:"Leaves block the channel’s final grate.",character:"No character here. Something pale shows beneath the leaves.",clues:[{id:"s-screen",title:"Stacked signs",text:"Five signs lie beneath the leaves in their original order.",role:"useful",kind:"object",action:"lift"},{id:"s-string",title:"Red string",text:"A scrap from a nearby bird scarer is caught here too.",role:"uncertain",kind:"object",action:"flip"}]},
        {id:"shed",name:"Tool Shed",x:78,y:18,scene:"Spare labels and tools are neatly counted.",character:"Tari: ‘Nobody borrowed a trowel.’",clues:[{id:"s-list",title:"Tool list",text:"All digging tools were returned before the weekend.",role:"useful",kind:"source",action:"flip"},{id:"s-spares",title:"Spare signs",text:"Unused signs have the same blue paint.",role:"useful",kind:"comparison",action:"compare"}]}
      ])
  );

  const evidenceExtras = [
    {id:"bridge",title:"The Repaired Bridge",subject:"Geography investigation",question:"Why was the old bridge repaired here?",context:"A riverside bridge was rebuilt after decades of little use.",evidence:[
      {id:"br1",type:"map",title:"Route overlay",text:"The repaired bridge links the new homes to the station."},{id:"br2",type:"timeline",title:"Building dates",text:"Most nearby homes were built two years before repairs began."},{id:"br3",type:"measurement",title:"Footfall",text:"Daily crossings rose from 80 to 640."},{id:"br4",type:"object",title:"Old stone",text:"The foundations remained strong enough to reuse."},{id:"br5",type:"source",title:"Access plan",text:"The earlier route had steps and a steep slope."},{id:"br6",type:"weather",title:"Flood record",text:"The new deck sits above the recent flood line."},{id:"br7",type:"claim",title:"Local rumour",text:"The bridge was rebuilt only for tourists."},{id:"br8",type:"missing",title:"Missing survey",text:"No winter cycle count is available."}]},
    {id:"building",title:"Rooms Beneath the Hall",subject:"Archaeology investigation",question:"Who used this building long ago?",context:"A community hall renovation revealed two older rooms beneath the floor.",evidence:[
      {id:"ha1",type:"object",title:"Slate boards",text:"Small reusable writing slates were found together."},{id:"ha2",type:"map",title:"Room plan",text:"Benches faced one raised wall platform."},{id:"ha3",type:"source",title:"Rate book",text:"The site was listed as a school from 1872."},{id:"ha4",type:"timeline",title:"Paint layers",text:"The darkest paint predates the current hall."},{id:"ha5",type:"object",title:"Cooking pot",text:"A later pot was found above the sealed floor."},{id:"ha6",type:"measurement",title:"Peg heights",text:"Coat pegs were placed at child height."},{id:"ha7",type:"claim",title:"Old caption",text:"A 1950 caption calls the building a meeting room."},{id:"ha8",type:"missing",title:"Missing names",text:"No pupil register survives."}]},
    {id:"animals",title:"The Quiet Wetland",subject:"Nature investigation",question:"Why did frog numbers fall?",context:"Fewer frogs were counted in a small wetland over three spring surveys.",evidence:[
      {id:"fr1",type:"graph",title:"Frog counts",text:"Counts fell most beside the southern pond."},{id:"fr2",type:"water",title:"Water test",text:"Southern water contains more nitrate after rain."},{id:"fr3",type:"map",title:"Drain map",text:"A field drain enters near the southern pond."},{id:"fr4",type:"weather",title:"Rainfall",text:"Two surveys followed unusually dry winters."},{id:"fr5",type:"sound",title:"Night recording",text:"Traffic noise increased beside the northern path."},{id:"fr6",type:"object",title:"Egg clusters",text:"Eggs were present but fewer tadpoles survived."},{id:"fr7",type:"claim",title:"Visitor note",text:"A visitor blamed herons without recording any."},{id:"fr8",type:"missing",title:"Missing test",text:"No pesticide test has been completed."}]}
  ];
  C.evidenceSets.push(...evidenceExtras);

  C.inventor.briefs.push(
    {id:"lift",title:"Lift the crate",problem:"Lift a supply crate onto a low platform.",priorities:["strength","movement","control"],limits:"Use one pulling action."},
    {id:"accessible",title:"Reach the garden",problem:"Help a wheeled cart cross a rough garden edge.",priorities:["stability","ease","strength"],limits:"Keep the slope gentle."},
    {id:"store",title:"Store the tools",problem:"Hold six tools where they stay dry and easy to reach.",priorities:["waterproof","stability","ease"],limits:"The holder must move."},
    {id:"balance",title:"Balance the load",problem:"Carry two unequal loads without either touching the ground.",priorities:["stability","strength","control"],limits:"Use no more than seven parts."}
  );

  C.build2.parts = [
    {id:"beam",name:"Beam",shape:"beam",mass:3,rigid:5,water:3,moves:0,needs:[]},
    {id:"board",name:"Board",shape:"board",mass:2,rigid:4,water:2,moves:0,needs:[]},
    {id:"wheel",name:"Wheel",shape:"wheel",mass:1,rigid:4,water:4,moves:5,needs:["axle"]},
    {id:"axle",name:"Axle",shape:"axle",mass:1,rigid:5,water:4,moves:4,needs:[]},
    {id:"gear",name:"Gear",shape:"gear",mass:1,rigid:5,water:3,moves:5,needs:["axle"]},
    {id:"rope",name:"Rope",shape:"rope",mass:0,rigid:0,water:2,moves:4,needs:[]},
    {id:"pulley",name:"Pulley",shape:"pulley",mass:1,rigid:4,water:3,moves:5,needs:["rope"]},
    {id:"fabric",name:"Fabric",shape:"fabric",mass:0,rigid:0,water:1,moves:3,needs:[]},
    {id:"elastic",name:"Elastic",shape:"elastic",mass:0,rigid:0,water:4,moves:5,needs:[]},
    {id:"spring",name:"Spring",shape:"spring",mass:1,rigid:2,water:3,moves:5,needs:[]},
    {id:"container",name:"Container",shape:"container",mass:2,rigid:4,water:5,moves:0,needs:[]},
    {id:"ramp",name:"Ramp",shape:"ramp",mass:3,rigid:5,water:3,moves:2,needs:["support"]},
    {id:"hinge",name:"Hinge",shape:"hinge",mass:0,rigid:4,water:3,moves:4,needs:[]},
    {id:"propeller",name:"Propeller",shape:"propeller",mass:1,rigid:3,water:4,moves:5,needs:["axle"]},
    {id:"weight",name:"Weight",shape:"weight",mass:5,rigid:5,water:5,moves:0,needs:[]},
    {id:"hook",name:"Hook",shape:"hook",mass:1,rigid:5,water:4,moves:1,needs:["rope"]}
  ];

  const newScenarios = [
    {id:"flooded-field",title:"The Flooded Playing Field",setting:"Heavy rain flooded the only large playing field. Water must go somewhere.",opening:{prompt:"Move the first protection.",choices:[
      {id:"drain",label:"Open the old drain",immediate:"The field begins to clear.",unintended:"Fast water reaches the stream.",perspectives:{Player:"The field may reopen.","River keeper":"Mud enters the habitat."},next:"drain-next"},
      {id:"wetland",label:"Make a wet corner",immediate:"Water stays on part of the field.",unintended:"One pitch remains unusable.",perspectives:{"Wildlife group":"A new habitat begins.",Team:"Practice space shrinks."},next:"wetland-next"}]},nodes:{
        "drain-next":{info:"The stream turns cloudy.",prompt:"What will slow the flow?",choices:[{id:"filter",label:"Add a planted filter",immediate:"Plants trap some mud.",unintended:"The filter needs space.",ending:"The field drains more slowly and the stream clears."},{id:"close",label:"Close the drain early",immediate:"Less mud reaches the stream.",unintended:"Water returns to the field.",ending:"The field reopens later, with less stream damage."}]},
        "wetland-next":{info:"Frogs arrive, but teams need a route.",prompt:"Where should the path go?",choices:[{id:"edge",label:"Use the dry edge",immediate:"People avoid the wet area.",unintended:"The route is longer.",ending:"The field and wet corner share the space."},{id:"board",label:"Build a boardwalk",immediate:"Access improves.",unintended:"Materials and repairs are needed.",ending:"The new route becomes part of the park."}]}}
    },
    {id:"old-tree",title:"The Old Tree",setting:"An old tree shades the square, but roots are lifting the busiest path.",opening:{prompt:"Change the square.",choices:[
      {id:"move-path",label:"Move the path",immediate:"The roots can remain undisturbed.",unintended:"Two stalls lose their usual place.",perspectives:{"Tree keeper":"The roots stay safer.",Trader:"Customers pass farther away."},next:"move-next"},
      {id:"root-bridge",label:"Bridge the roots",immediate:"People can cross above them.",unintended:"The raised path is harder to build.",perspectives:{"Wheelchair user":"The slope must stay gentle.","Tree keeper":"Air still reaches the soil."},next:"bridge-next"}]},nodes:{
        "move-next":{info:"The new route crosses a quiet seating area.",prompt:"How will you share it?",choices:[{id:"curve",label:"Curve around seats",immediate:"The seats remain calm.",unintended:"The path becomes longer.",ending:"The square keeps shade, seats and a winding route."},{id:"relocate",label:"Move the seats",immediate:"The route stays direct.",unintended:"The sunny new spot is hotter.",ending:"New shade sails make the moved seats usable."}]},
        "bridge-next":{info:"The bridge needs a wide ramp.",prompt:"What should move?",choices:[{id:"stall",label:"Rotate one stall",immediate:"The ramp fits.",unintended:"The stall frontage narrows.",ending:"A shared display helps the stall stay visible."},{id:"bench",label:"Move one bench",immediate:"The ramp stays clear.",unintended:"Less seating faces the tree.",ending:"A curved bench replaces the old one later."}]}}
    },
    {id:"market",title:"The Community Market",setting:"A new market can support local makers, but the square has limited space and shelter.",opening:{prompt:"Place the first stalls.",choices:[
      {id:"many",label:"More small stalls",immediate:"More makers can join.",unintended:"Aisles become narrow.",perspectives:{"New maker":"A small place is affordable.",Parent:"The buggy route feels crowded."},next:"many-next"},
      {id:"few",label:"Fewer wide stalls",immediate:"Movement is easier.",unintended:"Some makers cannot attend.",perspectives:{"Access group":"Routes are clear.","New maker":"Places are harder to win."},next:"few-next"}]},nodes:{
        "many-next":{info:"Rain sends people under one shelter.",prompt:"Where should cover go?",choices:[{id:"aisle",label:"Cover the main aisle",immediate:"People keep moving.",unintended:"Edge stalls remain exposed.",ending:"Shared umbrellas help the outside stalls."},{id:"zones",label:"Cover two stall zones",immediate:"More goods stay dry.",unintended:"The route between zones is wet.",ending:"Matting makes the crossing safer."}]},
        "few-next":{info:"A waiting list grows.",prompt:"How can others join?",choices:[{id:"rotate",label:"Rotate each week",immediate:"More makers get a turn.",unintended:"Regular customers cannot find the same stalls.",ending:"A clear calendar helps visitors plan."},{id:"share",label:"Share wide stalls",immediate:"Twice as many makers fit.",unintended:"Displays have less room.",ending:"Pairs create joint displays and share costs."}]}}
    }
  ];
  C.consequences.push(...newScenarios);

  // Build 2 adds a third, delayed decision to every built-in route. The
  // original ending is preserved as one possible long-term response.
  C.consequences.forEach(scenario => {
    Object.entries({...scenario.nodes}).forEach(([nodeId, node]) => {
      node.choices.forEach((choice, index) => {
        if (!choice.ending || choice.next) return;
        const delayedId = `${nodeId}-${choice.id}-later`;
        const original = choice.ending;
        choice.next = delayedId;
        choice.delayed = "A season passes and the first plan needs attention.";
        delete choice.ending;
        scenario.nodes[delayedId] = {
          info: choice.delayed,
          prompt: "What matters now?",
          choices: [
            {id:`${choice.id}-adapt`,label:"Adjust the plan",immediate:"The response changes with new evidence.",unintended:"Changing course uses time and trust.",ending:original},
            {id:`${choice.id}-continue`,label:"Keep the plan",immediate:"People know what to expect.",unintended:"The unresolved pressure remains visible.",ending:`${original} The community also records what still needs attention.`}
          ]
        };
      });
    });
  });

  C.apps.world.preview = "8 seeds · living terrain · weather";
  C.apps.mystery.preview = "5 playable mysteries · physical clues";
  C.apps.evidence.preview = "6 investigations · tactile tools";
  C.apps.inventor.preview = "12 challenges · build · test";
  C.apps.consequence.preview = "8 simulations · branch · compare";
})();
