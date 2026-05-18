# SIXT Share — DropOff Zones
## Hypothesen für den qualitativen User-Test

Strukturiert entlang der Touchpoints, die der Prototyp im Vergleich zum Figma-Original **neu hinzufügt**. Pro Hypothese: was im Original fehlt, was der Prototyp behauptet, was du beobachten/fragen solltest.

---

## A — Wahrnehmung & Verständnis der Zonen

### A1 · Sichtbarkeit on Map
- **Original:** Map ohne Zonenebene.
- **Prototyp:** Toggleable Layer, standardmäßig **aus**, mit Pulsanimation beim Zonenwechsel.
- **Hypothese:** Nutzer ohne aktivierten Layer übersehen Zonen vollständig — sie verstehen erst beim End-Trip-Sheet, dass es Zonen gibt.
- **Test:** Sektion 02/04 — beide Map-Varianten (Layer on/off) zeigen, fragen: „Wo darf man hier abstellen?" → Hat der/die Proband:in das Konzept ohne Layer überhaupt gesehen?

### A2 · Bedeutung der Farben
- **Original:** Keine.
- **Prototyp:** Grün = Reward, Blau = Charge, Schraffur = No-Park, Grau = Outside.
- **Hypothese:** Ohne den „Know your zones"-Screen vorher gesehen zu haben, ordnen Nutzer **Grün ≠ Reward** automatisch zu (Grün = OK/erlaubt, statt = Bonus). Blau wird oft als „Info" statt „Aufpreis" gelesen.
- **Test:** Map mit allen Zonen zeigen, vor dem Info-Screen, Bedeutungen frei zuordnen lassen.

### A3 · Reward vs. Charge — symmetrisch wahrgenommen?
- **Original:** —
- **Prototyp:** Beide kosten ±1 €.
- **Hypothese:** Loss aversion → Nutzer reagieren stärker auf Charge-Zonen (vermeiden) als auf Reward-Zonen (suchen aktiv).
- **Test:** End-Trip-Sheets in beiden Zuständen zeigen, intent-to-act vergleichen.

---

## B — In-Drive Kommunikation (Driving Screen)

### B1 · Subtle vs. Strong Warning
- **Prototyp-Tweak:** Pulsbanner-Intensität.
- **Hypothese:** Das „strong"-Banner wird beim Fahren tatsächlich gesehen, das „subtle" geht unter — aber strong wirkt schnell *nervig* bei mehrfachem Zonenwechsel.
- **Test:** Probanden „fahren" durch 3 Zonenwechsel, Tweak vergleichen.

### B2 · Alternative-Finder Banner („nearest reward zone 320 m away")
- **Original:** —
- **Prototyp:** In Charge-Zone erscheint Banner mit Alternative.
- **Hypothese:** Nutzer akzeptieren den Umweg, **wenn die Distanz gefühlt unter 5 Gehminuten liegt** — darüber wird er ignoriert, selbst wenn die Ersparnis größer wäre.
- **Test:** Distanz im Banner per Tweak variieren, ab welcher Schwelle entschieden wird.

---

## C — End-Trip Flow (Park-Versuch)

### C1 · Verständnis der Konsequenz vor dem Bestätigen
- **Original:** —
- **Prototyp:** Sheet zeigt Zone + Preis-Delta.
- **Hypothese:** Nutzer verstehen den Preis-Delta korrekt, aber **unterschätzen, dass Reward/Charge auf den Endpunkt** und nicht auf den Startpunkt zählt.
- **Test:** Nach dem Sheet fragen: „Wenn du 100 m weiter parkst, was passiert?"

### C2 · Reibungspunkt bei No-Park
- **Prototyp:** Komplette Blockade des Confirm-Buttons in No-Park-Zonen.
- **Hypothese:** Die Blockade wird als „App-Bug" interpretiert, nicht als Regel — Nutzer suchen nach „Trotzdem parken".
- **Test:** No-Park-Sheet zeigen, Reaktion auf disabled Button beobachten.

---

## D — Post-Trip Summary (Sektion 05, Figma-orientiert)

### D1 · Zone-Line in Session details — auffällig genug?
- **Figma-Original:** Session details enthielten nur Duration & Price.
- **Prototyp:** Zusätzliche Zeile **„Drop-off zone — Standard / Reward / Charge"** + Receipt-Line-Item bei ±1 €.
- **Hypothese:** Beim Standard-Receipt (= 0 €) fällt der Zone-Hinweis **gar nicht auf** — Nutzer entdecken das Konzept nur, wenn sie zufällig in einer Reward/Charge-Zone landen.
- **Test:** Standard-Summary zeigen, frei kommentieren lassen — wird die Zone-Zeile erwähnt?

### D2 · Reward-Banner („Thanks for parking smart")
- **Figma-Original:** —
- **Prototyp:** Grünes Banner zwischen Session details und Help.
- **Hypothese:** Das Banner verstärkt Wiederholungsverhalten **nur dann**, wenn es als „du hast etwas getan" framed wird — nicht als „1 € gespart". Identitätsbasierte Belohnung > monetäre.
- **Test:** Banner-Copy A/B: „You saved 1 €" vs. „You helped the next driver".

### D3 · Loyalty-Stamps als emotionaler Anker
- **Figma-Original:** Vorhanden, ohne Zonenbezug.
- **Prototyp:** Stamps wie im Figma — keine Verknüpfung mit Zonenverhalten.
- **Hypothese:** Nutzer erwarten **intuitiv eine Verknüpfung** („wenn ich Reward-Zonen nutze, bekomme ich extra Stamps") — und sind enttäuscht, wenn das nicht so ist.
- **Test:** Reward-Summary zeigen, fragen: „Bringt dir das in Bezug auf Loyalty etwas?"

---

## E — Mental Model & Lerneffekt

### E1 · „Know your zones"-Info-Screen
- **Original:** —
- **Prototyp:** Vollbild-Erklärung mit allen 5 Zonentypen, manuell aufrufbar.
- **Hypothese:** Der Info-Screen wird **erst nach dem ersten Charge-Erlebnis** aktiv aufgerufen — vorher ignoriert. Das heißt: erstes Lernen kostet die Nutzer 1 €.
- **Test:** Nach End-Trip in Charge-Zone fragen: „Was würdest du jetzt tun?"

### E2 · Wo startet das mentale Modell „Endpunkt zählt, nicht Startpunkt"?
- **Original:** —
- **Prototyp:** In Driving Screen + Info-Screen explizit erwähnt.
- **Hypothese:** Diese Mechanik ist die größte Verständnishürde — Nutzer denken zonen-basierte Preise wie Parkzonen (per Minute, ab Einfahrt), nicht wie Drop-off-Pricing.
- **Test:** Vor dem Info-Screen erklären lassen: „Wann zählt die Zone für deinen Preis?"

---

## F — Akzeptanz & Fairness

### F1 · Wahrgenommene Fairness der Charge-Zone
- **Hypothese:** Charge-Zonen werden als fair akzeptiert, **wenn der Grund („cars left here cost us to relocate") sichtbar ist** — ohne Grund werden sie als willkürlicher Aufpreis abgelehnt.
- **Test:** Charge-End-Trip-Sheet **mit** und **ohne** Erklärungs-Subtitle zeigen.

### F2 · Trust-Effekt durch Transparenz
- **Hypothese:** Die zusätzliche Receipt-Zeile (zone line item) erhöht das Vertrauen in die Abrechnung *insgesamt* — auch außerhalb der Zonen-Mechanik.
- **Test:** Open-ended Frage nach der Summary: „Wie wirkt die Abrechnung auf dich?"

---

## Empfehlung zur Test-Reihenfolge

1. **Cold start** ohne Erklärung → Driving Screen zeigen → A1, A2 prüfen
2. „Fahrt" durch mehrere Zonenwechsel mit unterschiedlicher Banner-Intensität → B1
3. Driving Screen in Charge-Zone mit Alternative-Banner, Distanz variieren → B2
4. End-Trip in Standard-Zone → C1 baseline
5. End-Trip in Charge-Zone → C1, F1, E2
6. Summary nach Charge → D1, D3
7. End-Trip in Reward-Zone → A3, D2
8. „Know your zones"-Screen am Ende → E1, E2 retrospektiv

So testest du, was der Prototyp **ohne Hilfe** vermittelt, bevor du den Erklär-Screen einblendest.
