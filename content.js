(function () {
  "use strict";

  window.WORKSHOP_CONTENT = {
    apps: {
      world: {
        name: "Tiny World Builder",
        short: "World Builder",
        accent: "#71856f",
        description: "Create a place with its own rules, people and problems.",
        preview: "Map · rules · secrets · story sparks"
      },
      mystery: {
        name: "Mystery Map",
        short: "Mystery Map",
        accent: "#657d99",
        description: "Explore locations, collect clues and solve a mystery.",
        preview: "3 mysteries · open investigation order"
      },
      evidence: {
        name: "The Evidence Room",
        short: "Evidence Room",
        accent: "#8a7191",
        description: "Connect evidence and build a convincing explanation.",
        preview: "Sort · connect · claim · question"
      },
      inventor: {
        name: "Inventor’s Bench",
        short: "Inventor’s Bench",
        accent: "#b8755e",
        description: "Design something that solves a real problem.",
        preview: "8 briefs · materials · test · improve"
      },
      consequence: {
        name: "Choose the Consequence",
        short: "Consequences",
        accent: "#b58b42",
        description: "Make difficult decisions and trace what happens next.",
        preview: "5 scenarios · perspectives · trade-offs"
      }
    },

    world: {
      prompts: [
        "What changes after dark?", "What does everyone here believe?", "What is becoming scarce?",
        "Where is nobody allowed to go?", "Who disagrees with the rules?", "What has recently been discovered?",
        "What would surprise a visitor?", "What problem cannot be ignored?", "What is celebrated each year?",
        "Which place has two different names?", "What sound can be heard but never found?", "What would make someone leave?"
      ],
      examples: [
        {
          title: "The Wandering Isles",
          terrain: "islands",
          climate: "Warm days, sudden silver rain",
          scale: "A chain of seven small islands",
          inhabitants: "Sail-menders, tide readers and families who grow roof gardens",
          creatures: "Compass moths that gather on the northern side of trees",
          resources: "Rain glass, sea herbs and light timber",
          dangers: "Channels move while people sleep",
          rules: "Every home must keep a lantern lit when the islands drift",
          customs: "At sunrise, neighbours compare maps and redraw the harbour signs",
          secret: "The islands are slowly arranging themselves into a message",
          problem: "The school island has drifted beyond the safe crossing route",
          promptNotes: ["Nobody agrees whether to anchor the islands or learn to travel differently."],
          locations: [
            { id: "w1", name: "Lantern Harbour", symbol: "harbour", x: 16, y: 24, notes: "Boats wait here until the dawn map is finished." },
            { id: "w2", name: "Drift School", symbol: "tower", x: 63, y: 20, notes: "Its bell can be heard from every island." },
            { id: "w3", name: "Moth Orchard", symbol: "tree", x: 37, y: 63, notes: "Compass moths settle here before a change in direction." },
            { id: "w4", name: "Glass Reef", symbol: "star", x: 71, y: 70, notes: "Rain glass is collected carefully at low tide." }
          ],
          links: [["w1", "w3"], ["w3", "w2"], ["w3", "w4"]]
        },
        {
          title: "Rootdeep Village",
          terrain: "forest",
          climate: "Cool, green and misty",
          scale: "One village beneath an ancient tree",
          inhabitants: "Root-carvers, mushroom gardeners and echo messengers",
          creatures: "Slow shell-backed beetles used to carry bundles",
          resources: "Spring water, clay, moss fibre and fallen bark",
          dangers: "The great roots shift after heavy rain",
          rules: "No living root may be cut",
          customs: "Families add one carved mark to the meeting root each winter",
          secret: "A sealed tunnel leads beyond the oldest root",
          problem: "The lower spring has begun to taste of metal",
          promptNotes: ["Some villagers want to open the sealed tunnel to search for the cause."],
          locations: [
            { id: "r1", name: "Meeting Root", symbol: "tree", x: 43, y: 18, notes: "The oldest laws are carved here." },
            { id: "r2", name: "Lower Spring", symbol: "water", x: 19, y: 62, notes: "Usually clear; now it leaves orange marks." },
            { id: "r3", name: "Beetle Yard", symbol: "home", x: 69, y: 58, notes: "Bundle beetles rest under damp leaves." },
            { id: "r4", name: "Sealed Way", symbol: "gate", x: 48, y: 78, notes: "A stone door without a handle." }
          ],
          links: [["r1", "r2"], ["r1", "r3"], ["r2", "r4"]]
        },
        {
          title: "The City of the Sleeping Engine",
          terrain: "desert",
          climate: "Bright, dry days and freezing nights",
          scale: "A circular city surrounding one enormous machine",
          inhabitants: "Shade builders, water counters, engineers and travelling traders",
          creatures: "Dust swifts that nest inside unused pipes",
          resources: "Copper, wind power and a deep underground reservoir",
          dangers: "Old machine parts sometimes begin moving without warning",
          rules: "No one may enter the engine’s central chamber alone",
          customs: "At noon, the city keeps one minute of silence to listen for the engine",
          secret: "The engine is not asleep; it is waiting for a missing piece",
          problem: "A low vibration has begun beneath the eastern homes",
          promptNotes: ["The oldest map shows a district that nobody remembers."],
          locations: [
            { id: "c1", name: "Engine Court", symbol: "gear", x: 43, y: 39, notes: "Warm metal plates surround the sealed chamber." },
            { id: "c2", name: "Wind Market", symbol: "flag", x: 14, y: 23, notes: "Canvas roofs collect power while traders meet." },
            { id: "c3", name: "Eastern Ring", symbol: "home", x: 73, y: 29, notes: "The vibration is strongest beneath three empty houses." },
            { id: "c4", name: "Deep Well", symbol: "water", x: 28, y: 74, notes: "Water counters guard the city’s supply." }
          ],
          links: [["c1", "c2"], ["c1", "c3"], ["c1", "c4"]]
        }
      ],
      generator: {
        openings: ["A small island chain", "A hidden valley", "A city on enormous bridges", "A settlement inside a hollow hill", "A village beside a changing lake", "A travelling town"],
        terrains: ["islands", "forest", "desert", "night"],
        climates: ["Warm, windy days with sudden rain", "Cool mornings and long golden evenings", "Dry days with mist rising at night", "Four seasons that change within a week"],
        scales: ["A place that can be crossed in one afternoon", "A scattered region joined by narrow paths", "One dense settlement and its wild border", "Three neighbourhoods separated by water"],
        inhabitants: ["Builders, growers and travelling repairers", "Families of map-makers and careful observers", "Boat keepers, cooks and message carriers", "Gardeners, makers and people who study the weather"],
        creatures: ["Small gliding creatures that follow music", "Long-legged pond walkers", "Burrowing animals that uncover lost objects", "Bright insects that appear before rain"],
        resources: ["Fresh water, flexible wood and coloured stone", "Wind, clay and tough river grass", "Warm springs, fruit and light metal", "Salt, sailcloth and medicinal leaves"],
        dangers: ["Paths vanish during storms", "The ground shifts in one district", "A useful creature is becoming rare", "Old structures are beginning to fail"],
        rules: ["Every decision affecting water must be made in public", "Nothing may be built higher than the oldest tree", "Visitors must be offered a map and a meal", "No light may be used during the first hour of night"],
        customs: ["People exchange handmade signs at the start of each season", "Every household cares for one shared place", "Stories are told while repairing objects", "A silent market is held once a month"],
        secrets: ["A familiar landmark is actually a machine", "The oldest map has a hidden layer", "Someone has been receiving messages from beyond the border", "A banned place is quietly being used"],
        problems: ["The main water source is shrinking", "Two groups need the same space", "A safe route has become unreliable", "A new discovery challenges an old rule"],
        locationNames: ["Quiet Bridge", "North Garden", "Old Signal", "Round Market", "Rain House", "Hidden Steps", "Moss Gate", "Wind Yard", "Low Harbour", "Copper Tower"]
      }
    },

    mysteries: [
      {
        id: "lantern",
        title: "The Missing Festival Lantern",
        question: "Who moved the great lantern, and why?",
        intro: "On festival morning, the hand-painted lantern has vanished from the square. It is too large to carry unnoticed, yet no one saw it leave.",
        solution: "Mara and the stage crew moved the lantern to the boathouse before dawn. A split bamboo support made it unsafe in the rising wind. She left a chalk arrow for the organiser, but overnight rain blurred it. The cart’s blue paint and narrow wheel marks connect the square to the boathouse.",
        resolutionClues: ["l-cart", "l-bamboo", "l-rope", "l-chalk"],
        locations: [
          { id: "square", name: "Festival Square", x: 42, y: 38, scene: "Only a pale circle remains where the lantern stood. Two narrow tracks cross the damp ground.", character: "Mr Vale, organiser: ‘It was here at sunset. I covered it when the wind grew stronger.’", clues: [
            { id: "l-tracks", title: "Narrow wheel tracks", text: "Two thin parallel tracks leave the square towards the east lane.", role: "useful" },
            { id: "l-chalk", title: "Blurred chalk mark", text: "A pale blue arrow points east. Most of its message has washed away.", role: "useful" }
          ]},
          { id: "workshop", name: "Lantern Workshop", x: 16, y: 18, scene: "Paint pots are closed. Spare paper panels are stacked neatly. A length of new bamboo is missing.", character: "Niko, painter: ‘The lantern was finished. Mara asked where we kept replacement supports.’", clues: [
            { id: "l-bamboo", title: "Replacement bamboo", text: "The space for one long bamboo support is empty; fresh shavings lie below it.", role: "useful" },
            { id: "l-paint", title: "Red paint spot", text: "A small red paint spot is on the step, but the lantern’s lowest panels are also red.", role: "uncertain" }
          ]},
          { id: "bakery", name: "Morning Bakery", x: 72, y: 15, scene: "The bakery opened before sunrise. Flour dust covers the back step and alley.", character: "Lea, baker: ‘I heard cart wheels before five. I thought it was the milk delivery.’", clues: [
            { id: "l-flour", title: "Flour prints", text: "Large boot prints lead to the bins, not towards the square.", role: "distraction" },
            { id: "l-heard", title: "Early cart sound", text: "A cart travelled along the east lane before five o’clock.", role: "useful" }
          ]},
          { id: "boathouse", name: "Boathouse", x: 77, y: 63, scene: "The doors are shut but not locked. A wide shape can be seen beneath canvas through the side window.", character: "Tavi, rower: ‘Mara borrowed our blue handcart. She said the stage crew had a safety problem.’", clues: [
            { id: "l-cart", title: "Blue handcart", text: "The cart has narrow wheels. One side is scratched and the blue paint is fresh.", role: "useful" },
            { id: "l-rope", title: "Festival rope", text: "Gold rope used around the lantern is tied around the canvas-covered shape.", role: "useful" }
          ]},
          { id: "stage", name: "River Stage", x: 26, y: 74, scene: "Musicians are rehearsing. Sandbags hold every banner after last night’s wind warning.", character: "Mara, stage lead: ‘I was checking anything tall or loose. I meant to find Mr Vale after sunrise.’", clues: [
            { id: "l-warning", title: "Wind warning", text: "A notice predicts strong gusts during the morning.", role: "useful" },
            { id: "l-list", title: "Safety checklist", text: "‘Tall lantern — split support?’ is circled on Mara’s list.", role: "useful" }
          ]}
        ]
      },
      {
        id: "glasshouse",
        title: "The Locked Glasshouse",
        question: "How did the rare seedlings get watered in a locked glasshouse?",
        intro: "The school glasshouse was locked for the long weekend. On Monday the dry seed trays are damp and one window is fogged, but the only key never left its hook.",
        solution: "Nobody entered. During heavy rain, water travelled from a blocked gutter through a loose roof vent and dripped into the seed trays. A tilted shelf channelled the water across more trays. The hose and muddy trainer print are distractions from Friday gardening club.",
        resolutionClues: ["g-gutter", "g-vent", "g-shelf", "g-rain"],
        locations: [
          { id: "door", name: "Glasshouse Door", x: 45, y: 67, scene: "The door is locked. Dust on the threshold is unbroken.", character: "Caretaker: ‘I checked the key log. Nobody signed it out.’", clues: [
            { id: "g-dust", title: "Unbroken dust", text: "A fine line of dust crosses the inside threshold without footprints.", role: "useful" },
            { id: "g-key", title: "Key record", text: "The glasshouse key remained signed in all weekend.", role: "useful" }
          ]},
          { id: "roof", name: "Roof Walk", x: 72, y: 20, scene: "Leaves fill one section of gutter. The roof vent below it does not sit flat.", character: "No character here; the roof can be inspected safely from the marked walkway.", clues: [
            { id: "g-gutter", title: "Blocked gutter", text: "A tide line shows rainwater overflowed beside the loose vent.", role: "useful" },
            { id: "g-vent", title: "Loose vent", text: "The rubber seal has lifted enough for water to pass beneath it.", role: "useful" }
          ]},
          { id: "beds", name: "Seedling Beds", x: 48, y: 35, scene: "Three trays are dampest on the right. A shelf above them slopes slightly.", character: "Asha, science monitor: ‘Those were dry on Friday. I checked before locking up.’", clues: [
            { id: "g-shelf", title: "Sloping shelf", text: "Mineral streaks run from the shelf’s right edge towards all three trays.", role: "useful" },
            { id: "g-hose", title: "Damp hose", text: "The coiled hose feels wet inside, but it was used on Friday afternoon.", role: "distraction" }
          ]},
          { id: "weather", name: "Weather Station", x: 15, y: 17, scene: "The school rain gauge contains 34 mm and the wind chart points north-east.", character: "Ms Chen: ‘Saturday’s rain was the heaviest this term.’", clues: [
            { id: "g-rain", title: "Heavy rain record", text: "Most rain fell while wind blew towards the loose roof vent.", role: "useful" },
            { id: "g-sun", title: "Sunday sunshine", text: "Sunday was sunny for six hours.", role: "uncertain" }
          ]},
          { id: "shed", name: "Garden Shed", x: 17, y: 70, scene: "Tools are stored in order. A muddy trainer mark is beside the watering cans.", character: "Ben, club member: ‘That is probably mine from Friday. I forgot to sweep.’", clues: [
            { id: "g-print", title: "Muddy trainer mark", text: "The dry print is the same size as Ben’s shoe but does not continue outside.", role: "distraction" },
            { id: "g-list", title: "Friday job list", text: "Ben’s name is beside ‘water beds and coil hose’.", role: "useful" }
          ]}
        ]
      },
      {
        id: "tide",
        title: "The Footprints at Low Tide",
        question: "What made the strange trail across the mudflat?",
        intro: "At low tide, a trail of paired marks curves from the harbour wall to a sandbank. Some people say a large animal crossed overnight, but parts of the trail look oddly regular.",
        solution: "A loose twin-float marker dragged across the mud as the tide fell. Its chain made the central groove, its two floats made the paired hollows, and seaweed caught on its cracked orange casing. The dog prints crossed the trail later.",
        resolutionClues: ["t-chain", "t-floats", "t-tide", "t-orange"],
        locations: [
          { id: "mudflat", name: "Mudflat Trail", x: 48, y: 46, scene: "Pairs of oval hollows repeat beside a thin central groove. The distance between pairs varies slightly.", character: "Rin, bird watcher: ‘The marks appeared as the tide went out, not all at once.’", clues: [
            { id: "t-pattern", title: "Paired pattern", text: "Two rounded objects touched the mud on either side of one dragging line.", role: "useful" },
            { id: "t-dog", title: "Dog prints", text: "Small paw prints cross on top of the trail near the wall.", role: "distraction" }
          ]},
          { id: "wall", name: "Harbour Wall", x: 20, y: 63, scene: "An empty metal bracket hangs from the wall. A length of wet chain remains attached.", character: "Harbour keeper: ‘A floating channel marker was fixed here yesterday.’", clues: [
            { id: "t-chain", title: "Wet chain", text: "Mud packed in the links matches the central groove’s width.", role: "useful" },
            { id: "t-bracket", title: "Bent bracket", text: "Fresh scratches show the fixing pulled free towards the sandbank.", role: "useful" }
          ]},
          { id: "store", name: "Marker Store", x: 16, y: 18, scene: "Spare channel markers have two orange floats joined by a bar and chain.", character: "Jo, volunteer: ‘One older marker had a crack. We planned to replace it.’", clues: [
            { id: "t-floats", title: "Twin floats", text: "Each float is the same length and curve as one oval hollow.", role: "useful" },
            { id: "t-rope", title: "Coiled rope", text: "A clean rope is missing from the shelf, borrowed for sailing practice.", role: "uncertain" }
          ]},
          { id: "sandbank", name: "Sandbank", x: 78, y: 67, scene: "The trail ends beside a half-buried orange object tangled with seaweed.", character: "No person is here. Gulls stand near the waterline.", clues: [
            { id: "t-orange", title: "Cracked orange casing", text: "The object is one float from the missing marker; mud fills the crack.", role: "useful" },
            { id: "t-seaweed", title: "Fresh seaweed", text: "Seaweed is wound around a short joining bar.", role: "useful" }
          ]},
          { id: "tideboard", name: "Tide Board", x: 78, y: 20, scene: "A curve shows the tide falling steadily between midnight and dawn. Wind blew towards the sandbank.", character: "Eli, sailor: ‘Floating objects would have moved east as the water became shallow.’", clues: [
            { id: "t-tide", title: "Tide and wind", text: "The direction and timing match the trail from wall to sandbank.", role: "useful" },
            { id: "t-bird", title: "Bird count", text: "More gulls than usual were recorded at sunrise.", role: "uncertain" }
          ]}
        ]
      }
    ],

    evidenceSets: [
      {
        id: "settlement",
        title: "The Empty Hill Settlement",
        subject: "History investigation",
        question: "Why was this settlement gradually abandoned?",
        context: "Archaeologists are studying a hill settlement used for nearly 300 years. Evidence suggests families left over several decades, not in one sudden event.",
        evidence: [
          { id: "s1", type: "map", title: "Water map", text: "The nearest year-round spring is 1.8 km downhill. Two smaller springs near the homes dried seasonally." },
          { id: "s2", type: "measurement", title: "Pollen sample", text: "Tree pollen falls sharply in later soil layers while grass pollen increases." },
          { id: "s3", type: "object", title: "Broken quern stone", text: "A heavy grain-grinding stone was left inside the largest house." },
          { id: "s4", type: "source", title: "Valley market record", text: "Trade marks increase at a new riverside market during the settlement’s final 40 years." },
          { id: "s5", type: "timeline", title: "Repair pattern", text: "Roof repairs become less frequent. The eastern houses were abandoned first." },
          { id: "s6", type: "environment", title: "Eroded hillside", text: "Later layers contain more washed soil and fewer signs of deep plant roots." },
          { id: "s7", type: "claim", title: "Old excavation note", text: "A 1911 report claimed invaders destroyed the settlement, but recorded no weapons or burnt buildings." },
          { id: "s8", type: "object", title: "Portable belongings", text: "Small tools and decorated objects are rare in final layers; heavy damaged items remain." },
          { id: "s9", type: "missing", title: "Missing evidence", text: "No human remains from the final period have been found." }
        ]
      },
      {
        id: "plants",
        title: "The Uneven Garden",
        subject: "Science investigation",
        question: "Why are plants beside the east wall growing differently?",
        context: "The same bean seeds were planted across a school garden. After four weeks, plants beside the east wall are taller but paler than the rest.",
        evidence: [
          { id: "p1", type: "measurement", title: "Plant height", text: "East wall mean: 31 cm. Open bed mean: 21 cm. Both groups began at similar height." },
          { id: "p2", type: "measurement", title: "Leaf colour chart", text: "East wall leaves score 3/8 for green colour; open bed leaves score 7/8." },
          { id: "p3", type: "light", title: "Light readings", text: "East wall: 3 hours direct light. Open bed: 7 hours direct light." },
          { id: "p4", type: "water", title: "Soil moisture", text: "Moisture is similar after watering but remains higher by the wall the next morning." },
          { id: "p5", type: "source", title: "Gardener’s note", text: "The wall bed received compost two weeks before planting; the open bed received it last year." },
          { id: "p6", type: "observation", title: "Direction of growth", text: "Most east-wall stems lean away from the wall towards the midday light." },
          { id: "p7", type: "temperature", title: "Temperature log", text: "The brick wall keeps the nearby air about 1.5°C warmer overnight." },
          { id: "p8", type: "claim", title: "Pupil claim", text: "‘The tall plants must be healthier because they are bigger.’" },
          { id: "p9", type: "missing", title: "Missing test", text: "Soil nutrient levels have not been measured." }
        ]
      },
      {
        id: "water",
        title: "The Sudden Water Rise",
        subject: "Community investigation",
        question: "Why did the town’s water use increase last month?",
        context: "Meter readings show the town used 18% more treated water than usual. The council needs an explanation before deciding what to do.",
        evidence: [
          { id: "w1", type: "graph", title: "Daily water graph", text: "The rise is largest between 5 pm and 8 pm. Overnight use changed very little." },
          { id: "w2", type: "weather", title: "Weather record", text: "The month was unusually warm and had 60% less rain than average." },
          { id: "w3", type: "statement", title: "Sports centre", text: "Outdoor evening sessions doubled during the school holiday." },
          { id: "w4", type: "measurement", title: "Park meter", text: "Park irrigation used 4.2 million extra litres, mostly after 7 pm." },
          { id: "w5", type: "statement", title: "Pipe team", text: "Two small leaks were repaired. Together they account for under 2% of the increase." },
          { id: "w6", type: "map", title: "Neighbourhood map", text: "The largest household increases cluster near streets with large gardens." },
          { id: "w7", type: "claim", title: "News headline", text: "‘Festival visitors cause water surge!’ The festival lasted two days." },
          { id: "w8", type: "comparison", title: "Similar warm month", text: "A warm month three years ago caused a 12% rise, without extra park irrigation." },
          { id: "w9", type: "missing", title: "Missing detail", text: "No separate meter exists for private garden watering." }
        ]
      }
    ],

    inventor: {
      briefs: [
        { id: "water", title: "Move water", problem: "Move water two metres without carrying the container.", priorities: ["movement", "waterproof", "control"], limits: "Use no more than six parts." },
        { id: "fall", title: "Protect a fall", problem: "Protect a fragile object when it falls from table height.", priorities: ["strength", "light", "stability"], limits: "The object must still be easy to remove." },
        { id: "gap", title: "Cross a gap", problem: "Make a model bridge across a 40 cm gap using limited materials.", priorities: ["strength", "stability", "parts"], limits: "Use no more than eight parts." },
        { id: "shade", title: "Packable shade", problem: "Create shade for two people that can be packed away.", priorities: ["light", "stability", "ease"], limits: "It must fold or come apart." },
        { id: "heavy", title: "Move a heavy object", problem: "Move a heavy box with less effort and without lifting it directly.", priorities: ["movement", "strength", "control"], limits: "One person should operate it." },
        { id: "signal", title: "Long-distance signal", problem: "Send a visible signal across a large field.", priorities: ["visibility", "control", "light"], limits: "It cannot use electricity." },
        { id: "dry", title: "Keep it dry", problem: "Design a container that keeps its contents dry in rain.", priorities: ["waterproof", "strength", "ease"], limits: "It must open and close." },
        { id: "wind", title: "Move with wind", problem: "Build a device that moves when wind blows across it.", priorities: ["movement", "light", "stability"], limits: "It should move without being pushed." }
      ],
      materials: [
        { id: "wood", name: "Wood strip", properties: ["strong", "rigid", "medium weight", "easy to join"], scores: { strength: 4, light: 2, waterproof: 3, movement: 1, stability: 4, ease: 3, visibility: 2, control: 3 } },
        { id: "card", name: "Card", properties: ["light", "easy to reshape", "absorbent", "moderately rigid"], scores: { strength: 2, light: 5, waterproof: 0, movement: 3, stability: 2, ease: 5, visibility: 3, control: 2 } },
        { id: "fabric", name: "Fabric", properties: ["flexible", "light", "absorbent", "easy to fold"], scores: { strength: 2, light: 5, waterproof: 1, movement: 4, stability: 1, ease: 4, visibility: 4, control: 2 } },
        { id: "string", name: "String", properties: ["flexible", "light", "strong when pulled", "easy to tie"], scores: { strength: 3, light: 5, waterproof: 3, movement: 4, stability: 2, ease: 4, visibility: 1, control: 4 } },
        { id: "elastic", name: "Elastic", properties: ["stretchy", "light", "stores movement", "can snap back"], scores: { strength: 2, light: 5, waterproof: 4, movement: 5, stability: 1, ease: 3, visibility: 1, control: 2 } },
        { id: "plastic", name: "Plastic sheet", properties: ["waterproof", "flexible", "light", "difficult to join"], scores: { strength: 2, light: 5, waterproof: 5, movement: 3, stability: 1, ease: 2, visibility: 3, control: 2 } },
        { id: "tube", name: "Tube", properties: ["rigid", "channels water or air", "medium weight", "rolls"], scores: { strength: 3, light: 3, waterproof: 5, movement: 4, stability: 2, ease: 3, visibility: 2, control: 4 } },
        { id: "wheel", name: "Wheel", properties: ["reduces sliding friction", "moves", "needs an axle", "medium weight"], scores: { strength: 3, light: 3, waterproof: 4, movement: 5, stability: 3, ease: 2, visibility: 2, control: 3 } },
        { id: "axle", name: "Axle", properties: ["rigid", "supports wheels", "must be aligned", "strong"], scores: { strength: 4, light: 3, waterproof: 4, movement: 5, stability: 3, ease: 2, visibility: 1, control: 4 } },
        { id: "hinge", name: "Hinge", properties: ["allows turning", "small", "needs firm joins", "controlled movement"], scores: { strength: 3, light: 4, waterproof: 3, movement: 5, stability: 2, ease: 2, visibility: 1, control: 5 } },
        { id: "lever", name: "Lever", properties: ["reduces effort", "rigid", "needs a pivot", "changes movement"], scores: { strength: 4, light: 2, waterproof: 3, movement: 5, stability: 3, ease: 3, visibility: 2, control: 4 } },
        { id: "pulley", name: "Pulley", properties: ["changes pull direction", "needs string", "moving part", "reduces effort in a system"], scores: { strength: 3, light: 3, waterproof: 3, movement: 5, stability: 2, ease: 2, visibility: 2, control: 4 } },
        { id: "ramp", name: "Ramp", properties: ["reduces lifting", "rigid", "needs support", "uses distance"], scores: { strength: 4, light: 1, waterproof: 3, movement: 4, stability: 4, ease: 4, visibility: 2, control: 4 } },
        { id: "container", name: "Container", properties: ["holds materials", "rigid", "water-resistant", "takes space"], scores: { strength: 3, light: 2, waterproof: 4, movement: 1, stability: 4, ease: 4, visibility: 2, control: 3 } },
        { id: "fastener", name: "Fastener", properties: ["joins parts", "small", "strong", "hard to reshape"], scores: { strength: 5, light: 5, waterproof: 4, movement: 1, stability: 5, ease: 3, visibility: 1, control: 4 } },
        { id: "weight", name: "Weight", properties: ["heavy", "adds stability", "hard to move", "compact"], scores: { strength: 5, light: 0, waterproof: 5, movement: 0, stability: 5, ease: 2, visibility: 1, control: 2 } }
      ]
    },

    consequences: [
      {
        id: "dry-summer", title: "The Dry Summer", setting: "A community has much less water than usual. The reservoir may reach its lowest safe level in six weeks.",
        opening: { prompt: "The council can act now, but every option affects people differently.", choices: [
          { id: "limits", label: "Set the same daily water limit for every household", immediate: "Water use falls quickly and the rule is easy to explain.", unintended: "Large households find the same limit much harder than people living alone.", perspectives: { "Family": "Careful washing and cooking still use most of the allowance.", "Reservoir scientist": "The quick reduction gives useful breathing room.", "Garden shop": "Demand drops sharply and plants are left unsold." }, next: "limits-next" },
          { id: "targets", label: "Restrict garden watering and car washing first", immediate: "Essential household use continues while outdoor use falls.", unintended: "Community gardens producing food lose crops alongside decorative lawns.", perspectives: { "Community gardener": "The rule treats food-growing and lawn-watering as identical.", "Resident": "Daily routines barely change at first.", "Wildlife carer": "Some garden ponds begin drying." }, next: "targets-next" }
        ]},
        nodes: {
          "limits-next": { info: "New figures show flats use less water than homes with gardens, but household size varies widely.", prompt: "How should the limit change?", choices: [
            { id: "per-person", label: "Give a basic amount per person, plus a small household allowance", immediate: "The rule becomes fairer for large households.", unintended: "The system is slower to organise and some residents dislike sharing household details.", ending: "The reservoir stabilises. The town begins a long-term project to fix leaks and reuse water in public buildings." },
            { id: "same-limit", label: "Keep one clear limit but create an appeal process", immediate: "Most people understand the rule and households with special needs can ask for help.", unintended: "The appeal team becomes overwhelmed and help arrives unevenly.", ending: "Water use falls enough, but the town agrees future emergency plans need fairer rules prepared in advance." }
          ]},
          "targets-next": { info: "The community garden supplies a food bank, while sports fields use more water than all community gardens combined.", prompt: "Where should limited outdoor water go?", choices: [
            { id: "purpose", label: "Allow water according to purpose and need", immediate: "Food gardens and young trees receive water; lawns receive very little.", unintended: "Deciding which purposes matter creates disagreements.", ending: "The reservoir remains just above the safe level and the town adopts clearer drought priorities." },
            { id: "reuse", label: "Fund simple rain and grey-water systems", immediate: "Some outdoor spaces switch away from treated water.", unintended: "The systems cost money and arrive too late for several small gardens.", ending: "The first summer is difficult, but the town uses much less treated water the following year." }
          ]}
        }
      },
      {
        id: "new-path", title: "The New Path", setting: "A woodland path would shorten the walk to school, but it crosses a quiet habitat used by nesting birds.",
        opening: { prompt: "Residents want safer travel without damaging the woodland.", choices: [
          { id: "direct", label: "Build the shortest, well-lit path", immediate: "The school journey becomes quicker and avoids a dangerous road crossing.", unintended: "Evening light and foot traffic disturb the quiet centre of the woodland.", perspectives: { "Child": "The walk feels much safer.", "Ecologist": "Nesting activity falls near the new lights.", "Resident": "Fewer cars stop outside the school gate." }, next: "direct-next" },
          { id: "edge", label: "Build a longer path around the woodland edge", immediate: "The path avoids the main nesting area.", unintended: "The route is longer and joins a muddy section near the stream.", perspectives: { "Child": "Some families keep using the faster road route.", "Ecologist": "The habitat remains mostly undisturbed.", "Access group": "The muddy slope is difficult for wheels." }, next: "edge-next" }
        ]},
        nodes: {
          "direct-next": { info: "A seasonal survey shows birds nest here from September to January, while most path use happens before 5 pm.", prompt: "How will you reduce disturbance?", choices: [
            { id: "timed", label: "Use low lights that switch off after early evening", immediate: "The path remains useful for school journeys with less night light.", unintended: "Late workers find the path less useful in winter.", ending: "People use the path mainly at school times. Monitoring shows some birds return, though the route still changes the habitat." },
            { id: "season", label: "Close the central section during nesting season", immediate: "The most sensitive area is protected for four months.", unintended: "Changing routes confuse some users and reduce trust in the path.", ending: "The seasonal system works after clearer signs and a community map are created." }
          ]},
          "edge-next": { info: "Engineers can make the muddy slope accessible, but this would require a raised boardwalk and more materials.", prompt: "What should happen?", choices: [
            { id: "boardwalk", label: "Build a narrow raised boardwalk", immediate: "The route becomes usable in wet weather and by more people.", unintended: "Construction briefly disturbs the stream edge and costs more.", ending: "The longer route becomes popular once it is reliable. Habitat checks continue each season." },
            { id: "improve-road", label: "Keep a simple edge path and improve the road crossing too", immediate: "Families have two safer route choices.", unintended: "The budget is split, so neither improvement is as extensive.", ending: "More children walk, but the muddy path still needs temporary closures after heavy rain." }
          ]}
        }
      },
      {
        id: "shared-space", title: "The Shared Space", setting: "A community building is used by a youth art group, a lunch club, language classes and weekend sports. Everyone wants more time.",
        opening: { prompt: "Only one large room is available. How will you organise it?", choices: [
          { id: "equal", label: "Divide the weekly hours equally", immediate: "Every group receives the same number of hours.", unintended: "Some groups need short frequent sessions while others need one long block.", perspectives: { "Art group": "Packing wet work halfway through a session is difficult.", "Lunch club": "It only needs midday hours, not evenings.", "Language tutor": "Short regular sessions work best." }, next: "equal-next" },
          { id: "attendance", label: "Give more hours to groups with more attendees", immediate: "The most-used activities serve many people.", unintended: "New and specialist groups cannot grow because they start small.", perspectives: { "Sports organiser": "Large sessions gain reliable time.", "New group": "It cannot prove demand without a room.", "Caretaker": "A clear rule reduces arguments." }, next: "attendance-next" }
        ]},
        nodes: {
          "equal-next": { info: "The groups agree that their needs are different, but disagree about what counts as fair.", prompt: "What system will you try?", choices: [
            { id: "needs", label: "Build a timetable around the type of session", immediate: "Groups receive time in shapes that suit their activities.", unintended: "The timetable becomes complex and has fewer spare slots.", ending: "A trial month reveals two useful room swaps. The groups create a shared review meeting each term." },
            { id: "zones", label: "Divide the room so compatible groups can overlap", immediate: "More activity fits into the week.", unintended: "Noise and storage conflicts appear between some groups.", ending: "Curtains and storage rules help, but quiet classes still need protected times." }
          ]},
          "attendance-next": { info: "A new repair club has only eight members but could reduce waste across the neighbourhood.", prompt: "Should smaller groups receive protected opportunities?", choices: [
            { id: "starter", label: "Reserve two trial slots for new groups", immediate: "New ideas can demonstrate whether people want them.", unintended: "Established groups lose a small amount of popular time.", ending: "One trial group grows and one ends. The open slots are offered again each season." },
            { id: "shared-event", label: "Ask small groups to begin with shared community events", immediate: "They reach more people without a weekly room booking.", unintended: "Some activities do not work well as large public events.", ending: "The repair club succeeds at a monthly event, while a quiet support group needs a different solution." }
          ]}
        }
      },
      {
        id: "expedition", title: "The Expedition", setting: "A team will spend three days surveying a remote coastal island. Every item has weight and space costs.",
        opening: { prompt: "One equipment crate must be removed before departure.", choices: [
          { id: "comfort", label: "Remove the comfort and spare-clothing crate", immediate: "All science and safety equipment fits.", unintended: "Cold, wet team members work less carefully and rest poorly.", perspectives: { "Scientist": "The survey tools remain complete.", "Medic": "Tired people make more mistakes.", "Boat crew": "The load is safely within limits." }, next: "comfort-next" },
          { id: "samples", label: "Take fewer sample containers and keep warm gear", immediate: "The team can work comfortably in changing weather.", unintended: "Some findings may be recorded but not brought back for testing.", perspectives: { "Scientist": "Important comparisons may be missed.", "Team member": "Warm clothing keeps the work steady.", "Island ranger": "Taking fewer samples disturbs less habitat." }, next: "samples-next" }
        ]},
        nodes: {
          "comfort-next": { info: "The forecast changes: strong rain is likely on day two.", prompt: "How will the plan change?", choices: [
            { id: "shorten", label: "Shorten the trip to two days", immediate: "The team avoids the worst weather.", unintended: "One survey zone is not reached.", ending: "The data is safe and useful but incomplete. A smaller return visit is planned." },
            { id: "swap", label: "Replace one survey device with shelter and dry clothing", immediate: "The team can remain for three days.", unintended: "One type of measurement cannot be collected.", ending: "The survey answers most questions and records exactly what evidence is missing." }
          ]},
          "samples-next": { info: "The first day reveals an unexpected shell bed that could answer the main research question.", prompt: "How should the limited containers be used?", choices: [
            { id: "focus", label: "Use most containers for the unexpected site", immediate: "The new discovery is sampled carefully.", unintended: "The original comparison sites receive fewer samples.", ending: "The discovery changes the next expedition’s plan, but the first survey’s comparison is weaker." },
            { id: "balance", label: "Keep the original sampling plan", immediate: "The planned comparison remains reliable.", unintended: "Only a small sample of the new site can be studied.", ending: "The team answers its original question and records the new site as the priority for later work." }
          ]}
        }
      },
      {
        id: "festival", title: "The Festival Decision", setting: "A popular riverside festival brings people together but creates waste, noise and expense.",
        opening: { prompt: "The organisers must change the festival this year.", choices: [
          { id: "smaller", label: "Make the festival smaller and finish earlier", immediate: "Noise, waste and costs fall.", unintended: "Fewer stalls are available and small traders lose a valuable day.", perspectives: { "Resident": "The evening is much quieter.", "Trader": "A place at the festival becomes harder to obtain.", "Organiser": "Safety and cleanup are easier." }, next: "smaller-next" },
          { id: "green", label: "Keep its size but require reusable systems", immediate: "The festival remains open to the same crowd with less single-use waste.", unintended: "Deposits and washing stations increase costs and queues.", perspectives: { "Visitor": "Returning cups takes extra time.", "River group": "Far less litter reaches the bank.", "Food stall": "New containers cost money at the start." }, next: "green-next" }
        ]},
        nodes: {
          "smaller-next": { info: "Local traders suggest two smaller festival days instead of one large day.", prompt: "Would you change the plan?", choices: [
            { id: "two-days", label: "Hold two neighbourhood-sized days", immediate: "More traders take part and crowds are spread out.", unintended: "Residents experience disruption on two days and setup costs repeat.", ending: "The events feel calmer and more local, but transport planning needs improvement." },
            { id: "one-day", label: "Keep one smaller day and rotate traders each year", immediate: "Costs and disturbance stay low.", unintended: "Some traders wait a year for a place.", ending: "The day runs smoothly. A separate monthly market is explored for traders who missed out." }
          ]},
          "green-next": { info: "The washing station can cope with the crowd only if visitors return items to four collection points.", prompt: "How will you make the system work?", choices: [
            { id: "deposit", label: "Use a small refundable deposit", immediate: "Most cups and plates are returned.", unintended: "People without spare money find the deposit frustrating.", ending: "A token option improves access. Waste falls sharply, though queues need redesign next year." },
            { id: "volunteers", label: "Use volunteer collection teams", immediate: "Visitors do not need to manage deposits.", unintended: "Volunteers spend much of the festival collecting items and some are missed.", ending: "The system reduces waste but depends heavily on volunteer time." }
          ]}
        }
      }
    ]
  };
})();
