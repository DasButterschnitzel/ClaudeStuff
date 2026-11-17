# Bad 2.0 – interaktiver 3D-Badplaner

Ein kleines Bad, aus 13 Handyfotos und einem 100-Sekunden-Rundgang-Video rekonstruiert, plus 16 Umbau-Varianten.

## Vermessung aus dem Video

Das Video (4K HDR) wurde mit 3 Bildern pro Sekunde zerlegt (281 Frames, tonemapped) und mit COLMAP/pycolmap per Structure-from-Motion rekonstruiert:
SIFT-Features, exhaustives Matching, inkrementelles Mapping → **194 registrierte Kamerapositionen, 15.558 3D-Punkte**.

Aus der Punktwolke: Bodenebene per RANSAC, Wände über Histogramme im Band knapp unter der Decke, Verhältnis Breite : Länge : Höhe ≈ 6,7 : 11,4 : 11,2.
Metrischer Maßstab über die Raumhöhe (2,40 m angenommen) → **ca. 1,45 × 2,45 m**, Duschtasse ≈ 78 × 78 cm.
Gegenprobe: Fliesenraster (Verhältnis 0,80 → 20 × 25 cm), WC-Abstand zur Heizkörperwand, Mülleimer zwischen Türzarge und Duschwand.
Die Punktwolke ist als „Video-Scan“-Ansicht eingebettet (`src/scan.json`, 13.518 Punkte in Raumkoordinaten).

## Varianten

| Bad | Idee | Richtwert |
|---|---|---|
| Bestand | So ist es jetzt, 9 Problemstellen + 1 Pluspunkt | – |
| Mini-Makeover | Nur die Nervfaktoren raus, 1 Nachmittag | ≈ 0,3 T€ |
| Skandi Sage | Refresh ohne Stemmen, mietwohnungstauglich | ≈ 1,7 T€ |
| Pastell Pop | Rosa, Mint, Wellenspiegel, Neonschrift | ≈ 5,8 T€ |
| Urban Jungle | Botanik-Tapete, Pflanzenstange, Monstera | ≈ 4 T€ |
| Terrakotta | Mediterran: Hex-Terrakotta, Majolika, Teak | ≈ 7 T€ |
| Maritim | Nut-und-Feder, Marineblau, Bullaugen-Spiegel | ≈ 4,7 T€ |
| Almhütte | Fichtenholz, Schiefer, Schaffell, Laternen | ≈ 7 T€ |
| Bart-Lounge | Barbershop: Schachbrett, Glühbirnen-Spiegel, Bart-Bar | ≈ 5,7 T€ |
| Retro 70s | Penny-Mosaik, Senfgelb, Avocado-Becken | ≈ 5,1 T€ |
| Grand Hotel | Zellige grün, Terrazzo, Messing, Vormauerung | ≈ 11 T€ |
| Onsen | Hinoki-Ofuro statt Duschtasse, Waschplatz | ≈ 12 T€ |
| Neon Nights | Schwarz glänzend, Pink/Cyan-Licht, Neon | ≈ 7,9 T€ |
| Art Deco Noir | Fächerfliesen schwarz-gold, Marmor-Schachbrett | ≈ 9 T€ |
| Japandi Spa | Walk-in, Mikrozement, Eiche | ≈ 15 T€ |
| Loft | Walk-in, Betonoptik, Stahlsprossen, Rohrdusche | ≈ 14 T€ |
| Smart Spa | Walk-in, Dusch-WC, Display-Spiegel, Lichtszenen | ≈ 20 T€ |

## Bedienung

- Oben: Pfeile ← → blättern durch die Bäder, „Alle Ideen“ öffnet die Galerie mit Vorschaubildern und Filtern
- Rechts: Datenblatt mit Reitern *Ideen* (eine Idee nach der anderen, „Im Raum zeigen“), *Überblick*, *Kosten*
- **Roomtour**: Autoplay durch alle Ideen mit Kamerafahrt (Pause, vor, zurück)
- **Begehen**: First-Person mit WASD/Pfeiltasten bzw. Joystick auf dem Handy
- Ansichten: Übersicht, Grundriss, Tür, WC-Blick, Spiegel · Werkzeuge: Abendlicht, Vorher/Nachher-Split, Video-Scan, Maße, DIN-Flächen, Raummaße
- Klickbar: Tür, Fenster, WC-Deckel, Vorhang, Schränke und Spiegelschränke
- Tasten: ← → Bad, ↑ ↓ Idee, T Tour, B Begehen, G Galerie, L Licht, V Vergleich

## Aufbau

```
src/page.html            Markup + CSS
src/scan.json            Punktwolke aus dem Video (eingebettet)
src/thumbs.json          Galerie-Vorschaubilder (vorgerendert)
src/js/01-core.js        Renderer, prozedurale Texturen, Materialien, Geometrie
src/js/02-objects.js     Objekt-Bibliothek I (Sanitär, Möbel, Pflanzen …)
src/js/02b-objects2.js   Bestandsdetails aus dem Video, Texturen/Objekte II
src/js/02c-objects3.js   Duschtasse, Eckvorhang, Eckglas, Ofuro, Spiegel, Oberflächen
src/js/03-shell.js       Raum-Generator, vermessenes Raster, Licht, Tweens
src/js/04a-kit.js        Baukasten für Varianten
src/js/04b-variants1.js  Bestand, Skandi, Japandi, Grand Hotel, Terrakotta, Loft, Smart
src/js/04c-variants2.js  Onsen, Bart-Lounge, Jungle, Art Deco, Pastell, Hütte, Maritim, Neon, Retro, Mini + Register
src/js/05-app.js         Kamera, Tour, Begehen, Scan, Galerie, Datenblatt
build.mjs                baut dist/index.html (eine Datei) + dist/preview.html
```

`node build.mjs`, dann `dist/preview.html` im Browser öffnen. Three.js 0.160 kommt per Import-Map von jsDelivr.
Maße: aus Video-Scan mit angenommener Raumhöhe; Preise: Richtwerte Stand 2026.
