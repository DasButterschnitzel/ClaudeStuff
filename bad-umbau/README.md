# Bad 2.0 – interaktiver 3D-Badplaner

Ein kleines Bad (ca. 1,70 × 2,55 m), aus 13 Handyfotos und einem 100-Sekunden-Rundgang-Video als 3D-Modell rekonstruiert, plus sechs Umbau-Varianten:

| Variante | Idee | Richtwert |
|---|---|---|
| **Bestand** | So sieht's heute aus, mit 9 markierten Schwachstellen | – |
| **A · Skandi Sage** | Refresh ohne Stemmen, mietwohnungstauglich | ≈ 1.610 € |
| **B · Japandi Spa** | Wanne raus, bodengleiche Walk-in-Dusche, Mikrozement, Einbauschrank | ≈ 16.930 € |
| **C · Grand Hotel** | Fliese auf Fliese: Zellige grün, Terrazzo, Messing; Wanne bleibt, Spülkasten hinter Vormauerung | ≈ 11.220 € |
| **D · Terrakotta** | Mediterran: Terrakotta-Sechsecke, Majolika, Kalkputz, Teak; Wanne bleibt | ≈ 7.710 € |
| **E · Loft** | Industrial: Betonoptik 60×120, Metro-Fliesen, Stahlrahmen-Glas, Rohrdusche | ≈ 15.890 € |
| **F · Smart Spa** | Dusch-WC, LED-Deckenbrause mit Thermostat, Spiegel mit Display, Fußbodenheizung | ≈ 21.560 € |

## Funktionen

- Orbit-Ansicht mit automatischem Wandschnitt (Puppenhaus), Grundriss, WC-Blick, Tür-Blick, Spiegel-Blick
- Vorher/Nachher-Splitscreen mit verschiebbarer Linie
- Tag/Abend-Licht (LED-Nachtlichter, Nischenbeleuchtung, Spiegel-Halo)
- Echte Spiegelungen, Schatten, prozedurale Materialien (Fliesen, Fischgrät, Mikrozement, Terrazzo, Zellige, Marmor)
- Klickbare Objekte: Tür, Fenster (kippen), WC-Deckel, Duschvorhang, Spiegelschrank & Schränke öffnen
- Maßketten, Bewegungsflächen nach DIN 18022, berechnete freie Lauffläche
- Raummaße per Schieberegler anpassbar – alle Varianten bauen sich neu auf

## Aufbau

```
src/page.html      Markup + CSS (Platzhalter <!--APP--> für das Skript)
src/js/01-core.js  Renderer, prozedurale Texturen, Materialien, Geometrie-Helfer
src/js/02-objects.js  Objekt-Bibliothek (WC, Wanne, Becken, Heizkörper, Schränke, Pflanzen …)
src/js/02b-objects2.js  Bestandsdetails aus dem Video + Objekte/Texturen für D–F
src/js/03-shell.js Raum-Generator (Wände mit Öffnungen/Nischen), Licht, Tweens
src/js/04-variants.js  Bestand + Varianten A/B/C inkl. Texte, Kosten, Hotspots
src/js/04b-variants2.js  Varianten D/E/F
src/js/05-app.js   Kamera, Overlays, UI, Interaktion
build.mjs          baut dist/index.html (eine Datei) und dist/preview.html
```

```
node build.mjs
# dist/preview.html im Browser öffnen
```

Three.js 0.160 wird per Import-Map von jsDelivr geladen; sonst gibt es keine Abhängigkeiten.
Maße sind aus Fotos geschätzt, Preise sind Richtwerte (Stand 2026).
