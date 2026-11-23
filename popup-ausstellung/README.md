# Pop-up³ Ausstellungsplaner – „50 Jahre Dreieich“

Interaktives 3D-Modell des Pop-up-Stores (Offenbacher Straße 1, Dreieich-Sprendlingen) mit den acht Themeninseln der Ausstellung, dazu die Planungsakte aus den Besprechungen vom 10.11. und 17.11.2026.

## Raum

Quelle ist das Exposé der Stadt Dreieich (dreieich.de → Citymanagement → Pop-Up Dreieich) mit dem Bestandsplan M 1:100, Planstand 15.04.2025.
Der Plan liegt nur als Scan vor. Die Umrisse wurden aus dem Bild abgegriffen und an den beiden lesbaren Planmaßen geeicht (rechter Raumteil 8,05⁵ m, Tiefe 9,83⁵ m).
Genauigkeit etwa ±15 cm. Vor Bestellungen vor Ort nachmessen.

| | |
|---|---|
| Ladenfläche | 173,3 m² |
| Lager · Nebenräume · WC | 6,3 · 42,5 · 6,5 m² |
| Raumhöhe | ca. 2,50 m |
| Fensterfront | 24,65 lfd. m, rund 2,08 m hoch |
| Fensterbreiten | 3,25 · 3,61 · 4,33 · 3,91 · 3,57 · 3,63 · 2,35 m |

Die Theke ist fest eingebaut. Sie steht in der rechten Halle beim Eingang als L um die dritte Stütze (langer Schenkel x 13,15–13,80 / z 2,70–5,40, kurzer Schenkel x 13,80–15,70 / z 4,75–5,40). Lage und Schenkellängen sind aus einem Foto im Exposé abgeleitet, nicht eingemessen (±30 cm). Alle Layouts sind darauf ausgelegt; die Theke lässt sich im Modell nicht verschieben.

## Was die Seite kann

- Ansichten: 3D, Grundriss, Blick vom Eingang, Blick durchs Schaufenster
- **Rundgang** durch alle acht Inseln, **Begehen** in Augenhöhe (ziehen, Klick auf den Boden, WASD)
- **Inseln verschieben** und drehen im Grundriss; Insel 6 hängt an der Brandmauer und bleibt fest
- Mero-System als Raumfachwerk im 75-cm-Raster: Kugelknoten mit 18 Anschlussflächen, Stäbe mit konischen Enden, Farbtafeln, Texte, Fotos, Vitrinen mit Exponaten
- Wohnzimmer um 1977 in der Ecke an der Natursteinwand: tapezierte Rückwand, Cordsofa, Sessel, Fernseher mit laufender Simulation (Nachrichten, Kinderstunde, Testbild)
- Dauerhafte Schaufensterfolierung (Skyline-Band, POP-UP, klares Oval) als Textur aus der Vorlage, `src/foil.webp`; von oben blendet sie aus, damit man in den Raum sieht
- **14 Layouts** zum Umschalten und Vergleichen: ★ Empfehlung, A Ausgangslage, B–E aus dem Gestalter-Workflow, F–I radikale Konzepte mit eigenem Stil (Begehbarer Stadtplan, Tag und Nacht, Alles Orange, Baustelle Dreieich), J–M neue Ideen zum Jubiläum (Drei Eichen, Endstation 1977, Geburtstagstafel, Fünf Häuser). F–M bauen Boden, Wände, Licht, Farbwelt und Bühnenelemente um
- **★ Empfehlung der Museumsleitung**: das Konzept des Teams, nach vier neuen Fachgutachten (Besucherforschung, Barrierefreiheit und Sicherheit, Betrieb und Technik, Recht und Geld) und dem weiter gültigen Vermittlungs-Gutachten überarbeitet und nachgemessen. Zukunftsinsel als Schlusspunkt neben der Tür, Statistik an die Rückwand hinter der Theke, Medienstelen an die Stirnwand des Treppenhauses, Mero-System quer, Wohnzimmer 37 cm schmaler für einen 1,30 m breiten Gang zur Hoftür, Gasse zwischen Treppenhaus und Theke bleibt frei
- **Analyse**: simulierte Besucher laufen den Rundgang ab. Heatmap der Laufwege am Boden, Heatmap der Sicht am Boden **und auf Wänden, Theke und allen Seiten der Exponate** (wie oft und wie gut eine Fläche im Blick liegt), Engstellen, Sichtbarkeit je Insel von der Tür und durch die Schaufenster-Ovale, freie Wände im Blick, Vergleich aller Layouts. Rechnet neu, sobald eine Insel verschoben wird. Gesamtwert: Sicht unterwegs 22 %, Blick auf die Schauseiten 15 %, wenig Doppelwege 18 %, Sicht von der Straße 13 %, keine Engstellen 12 %, Sicht von der Tür 12 %, wenig abseits 8 %
- **Radar**: 54 Punkte, die in den Protokollen nicht vorkommen (Rettungsweg, Personenzahl, Brandlast, Personalplan, Leihverträge, Nutzungsvereinbarung, Datenschutz, Rückbau, Zeitplan …), mit Zeitpunkt, Aufwand und Herkunft, zum Abhaken
- Vergleich im Reiter „Layouts“ (Reiter „Layouts“ mit Mini-Grundriss, Rundgang, Stärken und Schwächen); verschobene Inseln werden je Layout gespeichert
- Außenwände sind massiv und von außen sichtbar; in den Raum sieht man von oben und durch die Schaufenster
- Weiche Kontaktschatten (Umgebungsverdeckung) auf Geräten mit Maus; Schatten werden nur neu gerechnet, wenn sich etwas bewegt
- Akte mit Zusammenfassung, Themeninseln, 34 To-dos mit Filter nach Person, Rechner für die Litfaß-Säule (DIN A2 hochkant) und die runden Forexplatten, Materialliste
- Haken, Stellungen und Rechnerwerte werden als Artifact über die `db`-Capability für alle gespeichert (`state/todos`, `state/plan`), sonst im Browser

## Aufbau

```
src/page.html            Markup + CSS
src/js/01-core.js        Renderer, Texturen, Geometrie-Bausteine
src/js/02-room.js        Raum aus dem Bestandsplan, Maße
src/js/03-exhibits.js    Themeninseln, Theke, Fahne, Sitzkissen
src/js/04-data.js        Inseln, To-dos, Zuständigkeiten aus den Protokollen
src/js/05-app.js         Kamera, Verschieben, Begehen, Rundgang, Akte, Speicher
src/js/04b-layouts.js    Layout A und Einbindung der Entwürfe B–E
src/js/03b-styles.js     Stile und Bühnenelemente der radikalen Konzepte
src/radikal.json         Konzepte F–I mit Stellungen, Stil und festen Einbauten
src/ideen.json           Ideen J–M mit Stellungen, Stil und festen Einbauten
src/layouts.json         Entwürfe B–E aus dem Gestalter-Workflow (Entwurf + unabhängige Prüfung)
src/js/00-analyse.js     Besuchersimulation: Laufwege, Sicht, Kennzahlen (läuft im Browser und in Node)
src/empfehlung.json      Empfehlung: Stellung, Begründungen, Entscheidungen, Teamfragen, Radar-Liste
src/foil.webp            Schaufensterfolierung als Textur
tools/layout-check.mjs   Prüfwerkzeug: Überschneidungen, freie Türen, Erreichbarkeit mit 90 cm und 1,20 m
tools/layout-score.mjs   Prüfung plus Kennzahlen aus der Besuchersimulation für ein Layout
build.mjs                baut dist/index.html (eine Datei) + dist/preview.html
```

`node build.mjs`, dann `dist/preview.html` im Browser öffnen. Three.js 0.160 kommt per Import-Map von jsDelivr.
