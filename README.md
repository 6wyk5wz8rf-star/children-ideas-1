# The Workshop · Build 2

**Five living places to imagine, investigate and build.**

The Workshop is a static, touch-first collection of five visual learning experiences for children aged 7–11. Build 2 replaces the Foundation build’s welcome screens, long forms and written card flows with direct manipulation, animated cause and effect, visual tools and playable scenes.

## The five places

- **Tiny World Builder** — paint terrain, raise land, place animated structures and inhabitants, change weather, trigger world events and present a guided world tour.
- **Mystery Map** — enter an illustrated location immediately, reveal physical clues with investigation tools, connect evidence, build multiple visual theories and replay the resolution.
- **The Evidence Room** — move, flip, rotate, magnify, compare and connect evidence on a tactile desk; reveal later evidence and place a central claim token.
- **Inventor’s Bench** — place and connect sixteen behaving part types, rotate, resize, lock and duplicate them, change test conditions, pull the test lever and preserve versions.
- **Choose the Consequence** — move resources into visual decision zones, watch the community scene respond, experience delayed effects, rewind, branch and compare two paths.

## Built-in content

- 8 editable world seeds and 5 polished example worlds
- 5 complete mysteries with 5 locations and at least 8 clues each
- 6 evidence investigations across history, science, geography, archaeology, nature and community change
- 12 invention challenges and 16 rule-based part types
- 8 consequence scenarios with at least 3 decision moments on every path

All content is curated and stored locally. No external AI, accounts, analytics, fonts, frameworks or network calls are used.

## Architecture

- `index.html` — semantic application shell, global controls, live region and print root
- `styles.css` — tactile scene system, responsive layouts, reduced-motion/high-clarity modes, presentation and A4 print rules
- `content.js` — preserved Foundation content
- `build2-content.js` — Build 2 assets, rules and expanded playable content
- `visuals.js` — reusable original SVG scene, object, evidence and part renderers
- `core.js` — storage, migration, autosave, history, pointer/keyboard movement, pinch zoom, sound, speech, modals and import/export
- `app.js` — the five app state machines, renderers, interaction rules, creators and presentation modes
- `tests/content-audit.js` — dependency-free content and branch integrity checks

## Saving and migration

Work is saved only in the current browser under `the-workshop-library`.

Build 2 uses save schema version `2`. On first load it converts known Build 1 worlds, cases, boards, inventions and scenarios into the new structures. The original Build 1 data is retained in each migrated item’s `legacySnapshot` so it is not silently destroyed. Creations can be renamed, duplicated, deleted, exported as versioned JSON and imported again.

Clearing browser data can remove saved work. Export important creations before clearing device storage.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

Run the dependency-free content audit with:

```bash
node tests/content-audit.js
```

## Accessibility and devices

The interface includes semantic controls, large touch targets, visible keyboard focus, arrow-key object movement, undo/redo shortcuts, labelled icon controls, speech playback, focus-trapped dialogs, reduced motion, sound controls, larger text, high-clarity mode and colour-independent selected states.

Layouts are designed around iPad portrait and landscape and adapt down to 390 px phones and up to classroom boards. Essential gestures have button and keyboard alternatives.

## Honest technical limits

- The world and invention behaviour models are coherent rule systems, not scientific or rigid-body physics simulations.
- Sound uses lightweight generated effects rather than recorded audio files; no sound begins before a user action.
- Screenshot export relies on the device’s normal screenshot controls; the application provides dedicated visual presentation and print outputs.
- Locally created Evidence Room cases currently use illustrated evidence types rather than imported photographs.
- Browser speech, vibration and full-screen availability depend on the device and browser.

## Deployment

The site is compatible with GitHub Pages from the root of `main`.
