# Drop-Off Zones — Unmoderated Think-Aloud Test

**SIXT Share · Research Plan**

A self-guided remote study to validate whether SIXT Share customers understand the new Drop-Off Zone concept, feel confident about end-of-rental pricing, and which of three visualisation concepts (Subtle, Adaptive, Prominent) they prefer. Every screen, instruction, and question shown to the participant is specified verbatim so the script can be imported directly into our unmoderated testing tool.

| | |
|---|---|
| **Method** | Unmoderated, think-aloud (audio + screen recording) |
| **Tool** | Online platform with stepwise screens, voice capture & auto-transcript |
| **Duration** | ~25 min |
| **Participants** | 10–15 |
| **Stimulus** | Interactive HTML prototype linked from inside the tool |

---

## 1 · Background

SIXT Share customers regularly end rentals in low-demand areas. Employees then reposition vehicles to profitable locations, which is a logistical and financial burden. To nudge users toward better drop-off behaviour we are introducing **Drop-Off Zones**:

- 🟢 **Reward zone** · −€1
- ⚪ **Standard zone** · no change
- 🔵 **Paid zone** · +€1
- ⚫ **No-parking zone** · cannot end
- ▤ **Outside service area** · cannot end

> **Internal hypothesis.** Only the *end-of-rental* zone affects the price. The starting zone is irrelevant. We therefore suspect that surfacing zones during the entire drive could confuse rather than help users. This script must *not* reveal that hypothesis to participants — it is here for the team only.

## 2 · Research goals & questions

1. **RQ1 · Comprehension** — Can users correctly describe what each zone means?
2. **RQ2 · Cost confidence** — Do users feel certain how the final price was calculated?
3. **RQ3 · Concept preference** — Subtle vs. Adaptive vs. Prominent?
4. **RQ4 · Colour mapping** — Are the zone colours intuitive?
5. **RQ5 · Default visibility** — Should zones be visible on the map by default?
6. **RQ6 · Toggle** — Do users want a switch to hide / show zones?
7. **RQ7 · In-trip relevance** — Is the zone info useful while driving, or only at end of rental?

## 3 · Setup & recruitment

- **Sample.** 10–15 testers who have used SIXT Share, Miles, ShareNow/WeShare or another car-sharing service at least once in the last 12 months. Where possible, a mix of frequent and occasional renters from various densely populated cities.
- **Device.** Participant's own computer (desktop or laptop). The prototype displays a phone frame on screen to simulate the mobile environment.
- **Capture.** The tool records the participant's screen and microphone for the entire session and generates a written transcript for analysis.
- **Counterbalancing.** The three concept screens (Subtle / Adaptive / Prominent) are presented in a randomised order per participant.

## 4 · Response types used in the script

`Voice answer` · `Scale 1–5` · `Single / multi choice` · `Drag to rank` · `Colour picker`

Every "Voice answer" prompt automatically reminds the participant to speak their thoughts out loud. The tool records both audio and screen.

---

## 5 · Step-by-step script

Each block below is one screen in the unmoderated tool. The text inside the quote is shown verbatim to the participant. Internal notes for the research team are kept outside the quote.

### Block A — Welcome & warm-up

#### S1 · Welcome
> Welcome, and thank you for helping us improve SIXT Share. This test takes about 25 minutes. We'll show you a few screens from a new feature we're working on and ask you to **think out loud** the whole time — just say whatever comes to mind, even small reactions. There are no right or wrong answers; we're testing the design, not you.
>
> You'll need: a computer, headphones (optional), and a quiet place. Please allow microphone and screen access when prompted.

**Action:** Button: *"I'm ready, let's start"*

*Instruction* → *Next screen.*

#### S2 · Consent
> We will record your voice and screen during this session and create a written transcript so our researchers can analyse the results. Recordings are stored securely and used only for product research. You can stop at any time.

**Action — `Choice`:** Checkbox: *"I agree to be recorded and continue."* · Button: **Continue**

*Instruction* → *Next screen after the checkbox is ticked and `Continue` is tapped.*

#### S3 · Warm-up
> First, tell us a little about how you use SIXT Share.

- **Q1 `Voice`** — Think back to your last SIXT Share trip. Where did you go, and how did you decide where to park at the end? Please describe it out loud.
- **Q2 `Single choice`** — How often do you use SIXT Share?
  - Several times a week
  - A few times a month
  - Once a month or less
  - This was my first or second time

*Instruction* → *Next screen after both Q1 and Q2 are answered.*

### Block B — Cold first impression (RQ1, RQ7)

#### S4 · Open prototype
> Imagine you have just unlocked a SIXT Share car and started driving. Tap the link below to open the screen you would see in the app. Look at it for about 30 seconds and **say out loud everything you notice** — without scrolling or tapping anything yet.

**Action:** Link → prototype, default state: **Adaptive concept, vehicle in a Paid zone, bottom sheet open**.

- **Q3 `Voice`** — What do you see on this screen? What do you think is happening?
- **Q4 `Voice`** — If you ended your rental *right now*, what do you think would happen? Would it cost extra, less, the same — or is something not allowed?
- **Q5 `Scale 1–5`** — How clear is this screen to you? (1 = very confusing, 5 = very clear)

*Instruction* → *Next screen after Q3–Q5 are answered.*

### Block C — Concept walkthroughs (RQ3, RQ7)

The three concept blocks below are presented in **randomised order** for each participant. The same task is performed in each.

#### S5 / S6 / S7 · Concept block (repeats per concept)
> You're about to see another version of the same screen. You're driving the SIXT Share car and your vehicle is currently in a **paid drop-off zone** — parking here would add a small fee to your rental. Spend a minute exploring the screen and **keep talking** while you do. Then we'll ask a few questions.

**Action:** Link → prototype, locked to the concept variant for this block (Subtle / Adaptive / Prominent). Same Paid-zone scenario for all three.

- **Q6 `Voice`** — What does this screen tell you about where you are parked?
- **Q7 `Voice`** — If you wanted to avoid the extra fee, what would you do next?
- **Q8 `Scale 1–5`** — How **clear** is this version? (1 = very confusing, 5 = very clear)
- **Q9 `Scale 1–5`** — How **distracting** would this feel while you were driving? (1 = not at all, 5 = very)
- **Q10 `Scale 1–5`** — How likely would you be to **change where you park** because of this screen? (1 = not at all, 5 = very likely)

*Instruction* → *Next screen after Q6–Q10 are answered. The block repeats for each of the three concept variants before moving on to S8.*

#### S8 · Concept comparison
> You've now seen three different versions of the driving screen. Below are screenshots of each. Drag them into the order you'd prefer the app to behave, from most preferred at the top to least preferred at the bottom.

- **Q11 `Rank`** — Three thumbnails labelled **Version A**, **Version B**, **Version C** (mapping recorded in the tool). Drag to reorder.
- **Q12 `Voice`** — Why did you put your top choice first? What made it better than the others?
- **Q13 `Voice`** — Was there anything in the version you ranked *last* that you actually did like? Anything missing from your favourite?

*Instruction* → *Next screen after Q11–Q13 are answered.*

### Block D — End-of-rental cost confidence (RQ2)

#### S9 · End-of-rental, Reward zone
> You've finished your trip and parked the car. Tap the link below to see the summary the app shows you when the rental ends. Take your time and **talk us through what you see**.

**Action:** Link → prototype end-of-rental screen, scenario: **Reward zone, final price includes −€1 discount**.

- **Q14 `Voice`** — How did the final price come together? Explain it in your own words.
- **Q15 `Scale 1–5`** — How **confident** are you that the final price is correct? (1 = not at all, 5 = very confident)
- **Q16 `Voice`** — What, if anything, makes you uncertain? What would you want to see to feel more sure?

*Instruction* → *Next screen after Q14–Q16 are answered.*

#### S10 · End-of-rental, Paid zone
> Now imagine the same trip, but this time you parked somewhere else. Tap the link to see the new summary.

**Action:** Link → end-of-rental screen, scenario: **Paid zone, final price includes +€1 fee**.

- **Q17 `Voice`** — What's different on this screen? How would you feel if this were your actual rental?
- **Q18 `Scale 1–5`** — How **fair** does the extra fee feel? (1 = very unfair, 5 = very fair)
- **Q19 `Voice`** — When during the trip would you have wanted to know about this fee? Before booking, during the drive, just before parking, or only at the end?

*Instruction* → *Next screen after Q17–Q19 are answered.*

### Block E — Zone comprehension (RQ1)

#### S11 · Concept legend
> Below is a legend that explains the five different zones SIXT may show on the map. Read it carefully — we'll then ask a few quick questions.

**Shown legend:**
- 🟢 **Reward zone** — green overlay. Park here and get €1 off the rental.
- ⚪ **Standard zone** — no overlay. No change to the price.
- 🔵 **Paid zone** — blue overlay. Park here and €1 is added to the rental.
- ⚫ **No-parking zone** — grey overlay. You cannot end the rental here.
- ▤ **Outside service area** — hatched overlay. You cannot end the rental here.

- **Q20 `Single choice × 5`** — For each of the five zones, choose which sentence best matches it:
  - I will pay €1 less than usual.
  - I will pay €1 more than usual.
  - The price doesn't change.
  - I cannot end my rental here.
- **Q21 `Voice`** — If you started your rental in a paid zone and ended it in a standard zone, would you have to pay extra? Why or why not?
- **Q22 `Voice`** — What's the difference between a "No-parking zone" and "Outside service area" in your own words?

*Instruction* → *Next screen after Q20–Q22 are answered.*

### Block F — Colours (RQ4)

#### S12 · Blind colour mapping
> Forget for a moment what you've seen so far. If *you* could pick a colour for each kind of zone, which would feel most natural? Pick one colour per zone — you can reuse a colour if you want.

- **Q23 `Colour × 5`** — For each zone (Reward · Standard · Paid · No-parking · Outside service area), pick one of: **Green · Yellow · Orange · Red · Blue · Purple · Grey · White**.
- **Q24 `Voice`** — Why those colours? Walk us through your thinking.

*Instruction* → *Next screen after Q23 and Q24 are answered.*

#### S13 · Compare with SIXT mapping
> Here is the colour scheme we are currently considering: **Reward = green**, **Standard = grey**, **Paid = yellow**, **No-parking = red**, **Outside service area = dark grey**.

- **Q25 `Scale 1–5`** — How well does this match what you'd expect? (1 = doesn't match at all, 5 = matches perfectly)
- **Q26 `Voice`** — If you would change any colour, which one and why?

*Instruction* → *Next screen after Q25 and Q26 are answered.*

### Block G — Default visibility & toggle (RQ5, RQ6)

#### S14 · Map default
> Now imagine you've just opened the SIXT Share app and you're looking at the map to find a car. Below are two versions of the same map.

**Action:** Side-by-side images: **(A)** Map with all zones coloured in, **(B)** Plain map with no zones.

- **Q27 `Single choice`** — Which version would you prefer to see when you open the app?
  - A — Always show zones
  - B — Plain map, only show zones when I ask
  - Only show zones when one is nearby and matters to me
  - I don't have a preference
- **Q28 `Voice`** — Why did you pick that option?

*Instruction* → *Next screen after Q27 and Q28 are answered.*

#### S15 · Toggle
> Imagine there's a small switch on the map labelled "Show drop-off zones".

- **Q29 `Scale 1–5`** — Do you think this would be useful to you to show/hide drop-off zones? (1 = not useful at all, 5 = very useful)
- **Q30 `Voice`** — If you could only have *one* — zones visible by default, or a switch to turn them on — which would you keep, and why?

*Instruction* → *Next screen after Q29 and Q30 are answered.*

### Block H — Wrap-up

#### S16 · Reflection
- **Q31 `Voice`** — Looking back at everything you saw, when during a SIXT Share trip is this zone information most useful to you — before booking, while driving, just before parking, or only when ending the rental?
- **Q32 `Scale 0–10`** — If this feature shipped exactly as you've seen it, how much more (or less) likely would you be to recommend SIXT Share to a friend? (0 = much less likely, 10 = much more likely)
- **Q33 `Voice`** — What is the **one** thing you would change about what you've seen today?
- **Q34 `Single choice`** — If you could turn this feature off entirely, would you?
  - Yes
  - No
  - Only sometimes

*Instruction* → *Next screen after Q31–Q34 are answered.*

#### S17 · Thank-you
> That's everything — thank you for your time and your honest thoughts. Your incentive will arrive within 5 working days. If you have any final comments you didn't get to say, please record them now.

- **Q35 `Voice · optional`** — Any last thoughts?

*Instruction* → *Tester taps `Finish` to end the session.*

---

## 6 · Analysis plan

| Goal | Source | How we analyse |
|---|---|---|
| Comprehension (RQ1) | Q20 multi-choice, Q21–Q22 transcripts | % correct per zone type; tag misconceptions. |
| Cost confidence (RQ2) | Q15, Q18 scales; Q14, Q16 transcripts | Mean confidence + qualitative reasons; flag low-confidence quotes. |
| Concept preference (RQ3) | Q11 ranking; Q8/Q9/Q10 per concept | Aggregate rank; per-concept clarity / distraction / behaviour-change scores. |
| Colour mapping (RQ4) | Q23 blind picks; Q25/Q26 | Heat table of natural mappings vs. SIXT proposal. |
| Default visibility (RQ5) | Q27, Q28 | Frequency table; quote bank for "contextual" option. |
| Toggle (RQ6) | Q29, Q30 | Frequency table; forced trade-off result. |
| In-trip relevance (RQ7) | Q19, Q31, spontaneous mentions in Q3–Q7 | Tag "when does it matter" responses; test the team hypothesis. |

## 7 · Success criteria

- **Comprehension** ≥ 80 % correct on Q20 across all five zones.
- **Cost confidence** mean ≥ 4.0 on Q15 and Q18.
- **Concept preference** — one concept ranked #1 by ≥ 50 % of participants.
- **Colour mapping** — Reward = green and No-parking = red confirmed by ≥ 70 % blind agreement.
- **Default visibility** — a single option preferred by a clear majority on Q27.
- **In-trip relevance** — hypothesis confirmed if < 30 % of participants name "while driving" in Q31.

## 8 · What this test will *not* answer

- Exact pricing amounts (€1 is a placeholder).
- Behaviour over time — repeated exposure, habit formation.
- Map-overlay fidelity at extreme zoom levels.
- Notification behaviour outside the app.

## 9 · Deliverables

- Auto-generated transcripts per participant, tagged in the tool.
- Quant summary: ranking, scales, multi-choice, colour heat-table.
- Affinity map of qualitative quotes per research question.
- One-page recommendation: chosen concept, colour palette, default visibility & toggle decision.

---

*Owner · UX Research · SIXT Share · Draft v2 (unmoderated) · Linked prototype: `SIXT Share DropOff Zones - Prototype only.html`*
