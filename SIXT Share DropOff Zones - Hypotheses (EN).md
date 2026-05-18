# SIXT Share — DropOff Zones
## Hypotheses for the Qualitative User Test

Structured along the touchpoints the prototype **adds** compared to the Figma original. For each hypothesis: what's missing in the original, what the prototype claims, what to observe / ask.

---

## A — Zone Perception & Comprehension

### A1 · Visibility on the Map
- **Original:** Map without a zone layer.
- **Prototype:** Toggleable layer, off by default, with pulse animation on zone change.
- **Hypothesis:** Users who don't activate the layer miss the zones entirely — they only realise zones exist at the end-trip sheet.
- **Test:** Sections 02/04 — show both map states (layer on/off), ask: "Where can you park around here?" → Did the participant notice the concept at all without the layer?

### A2 · Meaning of Colors
- **Original:** None.
- **Prototype:** Green = Reward, Blue = Charge, Hatched = No-Park, Grey = Outside.
- **Hypothesis:** Without seeing the "Know your zones" screen first, users default to **Green ≠ Reward** (Green = OK/allowed, not = Bonus). Blue is often read as "Info" rather than "Surcharge".
- **Test:** Show the map with all zone types before the info screen, let participants assign meanings freely.

### A3 · Reward vs. Charge — Perceived Symmetrically?
- **Original:** —
- **Prototype:** Both worth ±1 €.
- **Hypothesis:** Loss aversion → users react more strongly to charge zones (avoid) than to reward zones (actively seek).
- **Test:** Show end-trip sheets in both states, compare intent-to-act.

---

## B — In-Drive Communication (Driving Screen)

### B1 · Subtle vs. Strong Warning
- **Prototype tweak:** Pulse-banner intensity.
- **Hypothesis:** The "strong" banner is actually noticed while driving, the "subtle" one gets missed — but "strong" quickly feels *annoying* across multiple zone changes.
- **Test:** Have participants "drive" through 3 zone changes, compare tweaks.

### B2 · Alternative-Finder Banner ("nearest reward zone 320 m away")
- **Original:** —
- **Prototype:** A banner with an alternative appears in charge zones.
- **Hypothesis:** Users accept the detour **only when the distance feels under 5 minutes on foot** — beyond that it's ignored, even if the savings would be larger.
- **Test:** Vary the distance in the banner via tweak, find the threshold at which users decide.

---

## C — End-Trip Flow (Park Attempt)

### C1 · Understanding the Consequence Before Confirming
- **Original:** —
- **Prototype:** Sheet shows zone + price delta.
- **Hypothesis:** Users grasp the price delta correctly but **underestimate that reward/charge applies to the end point**, not the start point.
- **Test:** After the sheet, ask: "If you park 100 m further, what happens?"

### C2 · Friction in No-Park
- **Prototype:** Confirm button is fully blocked in no-park zones.
- **Hypothesis:** The block is interpreted as an "app bug" rather than a rule — users look for "park anyway".
- **Test:** Show the no-park sheet, observe reaction to the disabled button.

---

## D — Post-Trip Summary (Section 05, Figma-aligned)

### D1 · Zone Line in Session Details — Noticeable Enough?
- **Figma original:** Session details only contained Duration & Price.
- **Prototype:** Adds a **"Drop-off zone — Standard / Reward / Charge"** line + a receipt line item at ±1 €.
- **Hypothesis:** On the standard receipt (= 0 €) the zone line **goes unnoticed** — users only discover the concept if they happen to land in a reward/charge zone.
- **Test:** Show the standard summary, ask for free comment — is the zone line mentioned?

### D2 · Reward Banner ("Thanks for parking smart")
- **Figma original:** —
- **Prototype:** Green banner between Session details and Help.
- **Hypothesis:** The banner reinforces repeat behaviour **only when** framed as "you did something" — not as "you saved 1 €". Identity-based reward > monetary.
- **Test:** A/B the banner copy: "You saved 1 €" vs. "You helped the next driver".

### D3 · Loyalty Stamps as an Emotional Anchor
- **Figma original:** Present, no zone connection.
- **Prototype:** Stamps as in Figma — no link to zone behaviour.
- **Hypothesis:** Users **intuitively expect a connection** ("if I use reward zones, I get extra stamps") — and feel let down when there isn't one.
- **Test:** Show the reward summary, ask: "Does this mean anything for your loyalty?"

---

## E — Mental Model & Learning

### E1 · "Know your zones" Info Screen
- **Original:** —
- **Prototype:** Full-screen explanation of all 5 zone types, manually accessible.
- **Hypothesis:** The info screen is **only opened after the first charge experience** — ignored before. Meaning: the first lesson costs users 1 €.
- **Test:** After an end-trip in a charge zone, ask: "What would you do now?"

### E2 · Where Does the Mental Model "Endpoint Counts, Not Start Point" Form?
- **Original:** —
- **Prototype:** Mentioned explicitly in the driving screen + info screen.
- **Hypothesis:** This mechanic is the biggest comprehension hurdle — users think of zone-based pricing like parking zones (per minute, from entry), not like drop-off pricing.
- **Test:** Before the info screen, ask: "When does the zone count for your price?"

---

## F — Acceptance & Fairness

### F1 · Perceived Fairness of the Charge Zone
- **Hypothesis:** Charge zones are accepted as fair **when the reason ("cars left here cost us to relocate") is visible** — without the reason they're rejected as an arbitrary surcharge.
- **Test:** Show the charge end-trip sheet **with** and **without** the explanatory subtitle.

### F2 · Trust Effect Through Transparency
- **Hypothesis:** The extra receipt line (zone line item) increases trust in the *overall* invoice — beyond the zone mechanic itself.
- **Test:** Open-ended question after the summary: "How does the invoice feel to you?"

---

## Recommended Test Order

1. **Cold start**  without explanation → show driving screen → check A1, A2
2. "Drive" through multiple zone transitions with different banner intensities → B1
3. Driving screen in charge zone with alternative banner, vary distance → B2
4. End-trip in standard zone → C1 baseline
5. End-trip in charge zone → C1, F1, E2
6. Summary after charge → D1, D3
7. End-trip in reward zone → A3, D2
8. "Know your zones" screen at the end → E1, E2 retrospectively

This way you test what the prototype communicates **without help** before the explanation screen takes over.
