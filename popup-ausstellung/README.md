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

Die Lage der Theke ist nach einem Foto aus dem Exposé geschätzt.

## Was die Seite kann

- Ansichten: 3D, Grundriss, Blick vom Eingang, Blick durchs Schaufenster
- **Rundgang** durch alle acht Inseln, **Begehen** in Augenhöhe (ziehen, Klick auf den Boden, WASD)
- **Inseln verschieben** und drehen im Grundriss; Insel 6 hängt an der Brandmauer und bleibt fest
- Mero-System als Raumfachwerk im 75-cm-Raster: Kugelknoten mit 18 Anschlussflächen, Stäbe mit konischen Enden, Farbtafeln, Texte, Fotos, Vitrinen mit Exponaten
- Wohnzimmer um 1977 in der Ecke an der Natursteinwand: tapezierte Rückwand, Cordsofa, Sessel, Fernseher mit laufender Simulation (Nachrichten, Kinderstunde, Testbild)
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
build.mjs                baut dist/index.html (eine Datei) + dist/preview.html
```

`node build.mjs`, dann `dist/preview.html` im Browser öffnen. Three.js 0.160 kommt per Import-Map von jsDelivr.
