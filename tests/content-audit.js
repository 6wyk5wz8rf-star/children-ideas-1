"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of ["content.js", "build2-content.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox, { filename: file });
}

const C = sandbox.window.WORKSHOP_CONTENT;
const fail = message => { throw new Error(message); };
const check = (condition, message) => condition || fail(message);

check(C.world.examples.length >= 5, "Tiny World Builder needs five example worlds");
check(C.build2.worldSeeds.length === 8, "Tiny World Builder needs eight seeds");
check(C.build2.worldObjects.length >= 12, "World object family is incomplete");

check(C.mysteries.length >= 5, "Mystery Map needs five mysteries");
C.mysteries.forEach(mystery => {
  const clues = mystery.locations.flatMap(location => location.clues);
  const ids = new Set(clues.map(clue => clue.id));
  check(mystery.locations.length >= 5, `${mystery.title}: fewer than five locations`);
  check(clues.length >= 8, `${mystery.title}: fewer than eight clues`);
  check(new Set(clues.map(clue => clue.id)).size === clues.length, `${mystery.title}: duplicate clue IDs`);
  mystery.resolutionClues.forEach(id => check(ids.has(id), `${mystery.title}: missing resolution clue ${id}`));
  check(mystery.solution.length > 80, `${mystery.title}: resolution is too shallow`);
});

check(C.evidenceSets.length >= 6, "Evidence Room needs six investigations");
C.evidenceSets.forEach(set => {
  check(set.evidence.length >= 8, `${set.title}: fewer than eight evidence objects`);
  check(new Set(set.evidence.map(item => item.id)).size === set.evidence.length, `${set.title}: duplicate evidence IDs`);
});

check(C.inventor.briefs.length >= 12, "Inventor's Bench needs twelve challenges");
check(C.build2.parts.length >= 16, "Inventor's Bench part family is incomplete");
C.inventor.briefs.forEach(brief => {
  check(brief.priorities.length >= 3, `${brief.title}: missing test priorities`);
  check(Boolean(brief.limits), `${brief.title}: missing visual constraint`);
});

check(C.consequences.length >= 8, "Choose the Consequence needs eight scenarios");
C.consequences.forEach(scenario => {
  check(scenario.opening.choices.length >= 2, `${scenario.title}: opening has too few choices`);
  const walk = (nodeId, depth, seen = new Set()) => {
    check(depth <= 8, `${scenario.title}: possible endless loop`);
    const key = `${nodeId}:${depth}`;
    if (seen.has(key)) return;
    seen.add(key);
    const node = nodeId === "opening" ? scenario.opening : scenario.nodes[nodeId];
    check(Boolean(node), `${scenario.title}: unreachable destination ${nodeId}`);
    node.choices.forEach(choice => {
      check(Boolean(choice.immediate), `${scenario.title}: choice missing immediate effect`);
      check(Boolean(choice.unintended), `${scenario.title}: choice missing delayed effect`);
      if (choice.ending) check(depth >= 3, `${scenario.title}: path ends before three decisions`);
      else { check(Boolean(choice.next), `${scenario.title}: branch has no destination`); walk(choice.next, depth + 1, new Set(seen)); }
    });
  };
  walk("opening", 1);
});

console.log("Content audit passed: 5 worlds, 5 mysteries, 6 investigations, 12 challenges and 8 three-stage scenarios.");
