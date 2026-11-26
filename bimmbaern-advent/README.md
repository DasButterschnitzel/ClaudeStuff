# Bimmbärn – Adventsposts

Social-Media-Motive „Die Bimmbärn wünschen einen … Advent“ für alle vier Adventssonntage,
jeweils in 4:5 (1080 × 1350, Feed) und 9:16 (1080 × 1920, Story/Reel).

Fertige Bilder: `out/bimmbaern_<n>-advent_<format>.png`

| Sonntag | Text | Bären |
|---|---|---|
| 1. Advent | einen schönen | Sitzungspräsident |
| 2. Advent | einen besinnlichen | Garde + Tracht |
| 3. Advent | einen gemütlichen | Männerballett + Bembel |
| 4. Advent | einen frohen | alle fünf |

Pro Sonntag brennt eine Kerze mehr, die schon länger brennenden Kerzen sind kürzer.

## Neu rendern

```
node src/render.js              # alle 8 Motive
node src/render.js 2 9x16       # nur 2. Advent im Hochformat
node src/render.js --preview    # schnelle Vorschau nach out/preview
```

Braucht Node mit Playwright/Chromium. Texte, Bären-Positionen und Kerzen stehen oben in
`src/advent.html` (`WISH`, `LAYOUT`).

## Material

- `assets/baer_*.png` – freigestellte Bärchen aus dem Drive-Ordner „Maskottchen“
- `assets/wappen_comic.*` – Vereinswappen, aus `wappen_plain.svg` ohne Bevel-Effekte, mit Tuschekontur
- `fonts/` – Berkshire Swash, Yeseva One, Cinzel, Playfair Display (alle SIL Open Font License)
