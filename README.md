# SIXT Share — Drop-Off Zones

Concept prototype and user-test materials for the SIXT Share drop-off-zones
feature (reward / paid / no-park / outside-business zones with adaptive
warnings during driving and at end-of-rental).

## Entry points

- `SIXT Share DropOff Zones.html` — design canvas with all prototype variants side by side.
- `SIXT Share DropOff Zones - Prototype only.html` — single phone prototype (driving + end-trip flow). Accepts URL params for deep-linking states:
  - `?intensity=subtle|adaptive|prominent`
  - `?scenario=normal|reward|charge|noPark|outside`
  - `?step=driving|endtrip|summary|info`
  - `?zonesVisible=1|0`, `?alt=1|0`, `?sim=0`
- `SIXT Share - Animation crossing zone borders.html` — motion study for zone transitions.
- `Drop-Off Zones - Tester Prototype.html` — moderated 12-step walkthrough used during user tests.
- `Drop-Off Zones - Test Walkthrough.html` — alternative test walkthrough.
- `Drop-Off Zones - User Test Plan.html` / `.md` — test plan (unmoderated and v1 moderated).
- `SIXT Share DropOff Zones - Hypotheses.md` / `(EN).md` — design hypotheses.

## Build

Static HTML + React via in-browser Babel — no build step. Just open any HTML
file in a browser or serve the folder.

## Source

- `app.jsx`, `app-chrome.jsx`, `prototype-only-app.jsx` — app shells.
- `driving-screen.jsx`, `end-trip-flow.jsx` — main screens.
- `zone-system.jsx`, `zone-transition-animation.jsx`, `map-background.js` — map + zone overlays.
- `ios-frame.jsx`, `design-canvas.jsx`, `tweaks-panel.jsx` — framing & tweak controls.
- `colors_and_type.css` — SIXT P100 design tokens.
- `assets/` — logos, icons, payment marks.
- `fonts/` — Helvetica Now (Display Black, Text Regular/Bold).
