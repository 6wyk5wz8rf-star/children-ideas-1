# The Workshop

**Five places to imagine, investigate and build.**

The Workshop is a static, touch-first collection of five creative learning tools for children aged 7–11:

- **Tiny World Builder** — construct a fictional world, arrange a visual map and create a world profile.
- **Mystery Map** — explore three complete location-based mysteries, collect clues and test a theory.
- **The Evidence Room** — arrange, group and connect evidence across history, science and community cases.
- **Inventor’s Bench** — solve one of eight design briefs with material properties, testing and iterations.
- **Choose the Consequence** — explore five branching dilemmas or build and play a custom scenario.

## Product structure

- `index.html` — semantic application shell and global navigation.
- `styles.css` — responsive visual system, accessibility modes, boards, presentation and A4 print layouts.
- `content.js` — curated offline mysteries, investigations, design briefs, material properties and scenarios.
- `app.js` — navigation, creation tools, local library, autosave, interactions and output views.

There are no external frameworks, fonts, APIs, accounts, analytics or network data calls. Work is saved only in the current browser using a versioned `localStorage` record. Clearing browser data can remove saved work.

## Run locally

Serve the repository with any small static server. For example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Accessibility and devices

The interface includes semantic controls, visible keyboard focus, keyboard-adjustable board items, large touch targets, reduced motion, larger text, simplified screens and screen-reader status updates. Layouts are designed for iPad portrait and landscape, laptops, desktops and classroom boards.

## Deployment

The site is designed for GitHub Pages from the root of the `main` branch.
