# Dreieich × Leonida – Logo-Konzepte für Social Media

Sechs Logo-Varianten plus eine Dreieich-Edition mit echten Fotos, als wäre Dreieich eine
Stadt im Bundesstaat Leonida (GTA VI). Jede Variante gibt es als Hochglanz-Key-Visual
(Feed 4:5 und Story 9:16), als freigestelltes Logo und als animierten 8-Sekunden-Reel.

**Präsentation:** `board/index.html` im Browser öffnen. Bilder sind eingebettet,
Videos werden aus `anim/` geladen.

| # | Konzept | Idee | Animation |
|---|---------|------|-----------|
| 01 | **Sunset Triangle** | Das Stadt-Dreieck als Fenster in einen Leonida-Sonnenuntergang: Palmen und Eichen, Burg Hayn, ein Jet im Anflug, Chrom-Swoosh, fetter Stack „drei / eich“ | Lichtstreifen, das Dreieck öffnet sich, der Swoosh kreist einmal herum, der Schriftzug knallt mit Schockwelle rein, Licht-Sweeps |
| 02 | **Neon Nights** | Neon-Script „Dreieich“ an einem Fachwerkhaus, Regen, Pfützen-Reflexe, „EST. 1977“ | Die Röhren zünden Buchstabe für Buchstabe. Wand und Pfützen werden live mit angeleuchtet, dazu Regen |
| 03 | **Welcome to Dreieich** | Googie-Willkommensschild zur Golden Hour, Marquee-Birnen, Burgruine, Jet | 2.5D-Parallaxe, das Neon-Dreieck stottert an, Birnen-Lauflicht mit Doppel-Blitz. Der Jet fliegt physikalisch korrekt an (siehe unten), Lens Flare |
| 04 | **Dreieich Nights** | Chrom-Lettern im 80er-Stil, Glasdreieck, Neon „Nights“, Synthwave-Grid, Burg in der Sonne | Das Grid rast endlos auf die Kamera zu, ein Chrom-Sweep enthüllt die Lettern, „Nights“ schreibt sich in Neon |
| 05 | **Greetings from Dreieich** | Großbuchstaben-Postkarte: Burg, Fachwerk, Flamingos, Jet, Villa, Eichenwald, Bembel, S-Bahn | Die Karte landet auf dem Strandtuch, Glitzer, alle 8 Buchstaben glänzen nacheinander, wandernde Lichtflecken |
| 05b | **Greetings from Dreieich – Dreieich-Edition** | Dieselbe Postkartenidee, aber mit euren echten Fotos in den Buchstaben (Fahrgasse/„Alte Burg“, Dreieichbahn, Buchschlag, Fachwerk, 360°-Drohnenpanorama), dahinter Frankfurter Skyline, Stadtmauer und Fachwerk | Die Karte landet auf einem Ebbelwoi-Tisch (Bembel, Geripptes, Brezel, Eichenlaub), kollisionsfrei neben den Requisiten, jeder Foto-Buchstabe glänzt auf |
| 06 | **Leonida Plate** | Vanity-Kennzeichen „DREIEICH · SUNSHINE CITY“ an einem pinken 80er-Sportwagen | Rack-Focus, Glanzlicht über die geprägten Lettern, Holo-Plakette, Hitzeflimmern, Palmenschatten |

## Neu: „Dreieich III“ – Parodie im Cover-Stil

Aus der VI wird die III (Drei-Eich), mit Eichen statt Palmen im Verlauf. Dazu ein schräges Panel-Raster wie
bei einem Spielcover, zehn Ortskarten und drei Reels, die auf den Takt eines Songs geschnitten sind.

- **Cover:** `final/gta_cover_4x5.jpg`, `final/gta_cover_9x16.jpg`, Emblem `logos/gta_dreieich_III_emblem.png`
- **Ortskarten:** `final/gta_poster_*_9x16.jpg`. Vier stammen von euch (Offenthal, Burgfestspiele, Villenkolonie,
  Bahnhof Buchschlag), sechs sind neu im selben Stil und parodieren typische Cover-Motive: Laubbläser statt Waffe
  (Sprendlingen), Schwan statt Alligator (Burg Hayn), Traktor statt Supersportwagen (Götzenhain), Ebbelwoi statt
  Kingpin-Pose, Bonanzarad statt Motorrad-Stunt (Fahrgasse), Einflugschneise.
- **Reels** (`anim/gta_*.mp4`, hier stumm):
  - `gta_trailer.mp4` (42 s): Intro-Karte, zwei ruhige Karten im Aufbau, auf den Drop acht Karten im Takt, dann
    baut sich das Cover Panel für Panel auf den Beats auf, Emblem, Banderole „Verfügbar seit 1977“
  - `gta_cover_reveal.mp4` (13 s): Einzählen I, II, III, dann der Cover-Aufbau.
  - `gta_loading.mp4` (15 s): Ladebildschirm-Parodie mit „Gemütlichkeitslevel“ und Tipps.
- **Song:** Die Reels folgen dem Taktraster von „Flower In A Hurricane“ (126,05 BPM, Drop bei 47,775 s). Die
  Song-Datei und die Fassungen mit Ton liegen bewusst nicht im Repo (urheberrechtlich geschützt). Zum Posten die
  stumme Fassung hochladen und den Song in der App anlegen: Trailer ab 0:36,4, Cover-Reveal ab 0:45,9,
  Ladebildschirm ab 0:00.
- Es wird kein Rockstar-Logo und kein Originalmotiv verwendet. Die Plakette unten rechts zeigt die offizielle Bildmarke der Stadt (`raw/brand/`), unverändert auf weißem Grund.

```bash
cd tools
python3 gta_build.py                    # Ebenen pro Karte (Figur, Hintergrund, Titel) + Emblem -> tools/cache/
python3 gta_cover.py                    # Cover + Ortskarten nach final/
SP=/tmp python3 gta_reel.py trailer preview          # Kontaktbogen
SP=/tmp python3 gta_reel.py trailer render 0 4       # Teil 0 von 4 (parallel renderbar), danach mit ffmpeg verbinden
```

## Ordner

```
board/    index.html (Präsentation), overview_4x5.jpg, overview_9x16.jpg
final/    Key Visuals: *_4x5.jpg (1080×1350, Feed) und *_9x16.jpg (1080×1920, Story/Reel-Cover)
anim/     *.mp4 (1080×1920, 30 fps, 8 s, stumm) + dreieich_leonida_reel.mp4 (alle sieben, 53 s) + Poster-JPGs
logos/    Freisteller als PNG mit Alpha (V2 zusätzlich „on black“ für Screen-Blending, V6 entzerrte Frontansicht)
raw/gta/  Ortskarten (u_* = eure Poster, n_* = neu generiert) und das Emblem auf Chroma-Key-Grün
raw/      KI-Master: 4:5-Originale und per Adobe Firefly auf 9:16 erweiterte Fassungen, explorations/ = verworfene Varianten,
          photos/ = eure Dreieich-Fotos für 05b, v5b_card_key.png = KI-Lettering mit Chroma-Key-Flächen
tools/    Pipeline (Python/OpenCV): Clean Plates, Masken, Animationen, Stills, Board
```

## Pipeline

1. **Motive:** GPT-Image 2.5 („sunburst“) über Figma, mit ausführlicher Art Direction. Die generierten Bilder
   liegen auch in der Figma-Datei „Dreieich × Leonida – Logo Concepts“.
2. **9:16-Fassungen:** Adobe Firefly Generative Expand (oben und unten je +270 px). Der Originalbereich bleibt
   pixelgenau erhalten.
3. **Masken:** Adobe Photoshop API (Select by Prompt) und ISNet (rembg). Wo nötig zusätzlich geometrische Masken
   und Farbmasken.
4. **Animationen:** eigene Compositing-Engine (`tools/fx.py`). Sie bildet jedes Frame als Funktion der Zeit:
   - V1: Clean Plate ohne Schriftzug. Der Dreiecksrahmen hinter der Schrift wird aus dem gemessenen Profil
     rekonstruiert, der See als gespiegelte Reflexion fortgesetzt.
   - V2: „Aus“-Zustand des Neons aus dem Bild abgeleitet. Das Neonlicht wird pro Buchstabe mit räumlichen
     Gewichten wieder addiert (Wand und Pfützen inklusive).
   - V4: Die Grid-Linien werden entfernt und mit gefitteter Perspektive (Horizont y = 1044) prozedural neu
     gezeichnet. Dadurch loopt das Grid nahtlos.
   - V3: Der Jet fliegt eine 3D-Gerade mit konstanter Geschwindigkeit, Nase voraus, auf einem ~3°-Gleitpfad.
     Für so eine Bewegung skalieren Bildposition und Größe gemeinsam um den Fluchtpunkt der Flugbahn:
     `p(t) = VP + s(t)·(p_ref − VP)` mit `s(t) = 1 / (1 − (t − t_ref) / T_c)`. VP liegt dort, wo die
     Rumpfachse hinter dem Heck die Höhe des Gleitpfads knapp über dem Horizont erreicht. Dazu kommen
     Landescheinwerfer, Positionslichter (rot links, grün rechts aus Sicht des Piloten), Doppelblitz-Strobes,
     Beacon, Dunst in der Ferne, Verdeckung durch Schild und Bäume und Bewegungsunschärfe (180°-Shutter).
     Der Himmel hinter dem Jet ist per Poisson-Cloning mit echter Wolkentextur gefüllt.
   - V5b: Die grünen Chroma-Key-Flächen des KI-Letterings werden exakt entmischt und mit euren Fotos
     gefüllt (handkolorierter Postkarten-Look, Leinenstruktur, Innenschatten). Das 360°-Panorama wird dafür
     equirektangulär → perspektivisch entzerrt. Die Ruheposition der Karte auf dem Tisch ist per Suche so
     gewählt, dass sie keine Requisite überlappt.

```bash
pip install opencv-contrib-python-headless numpy scipy rembg[cpu]
cd tools
python3 v1_build.py                 # Clean Plate + Ebenen für V1
python3 v5b_build.py                # Foto-Postkarte (Dreieich-Edition) + Buchstaben-Labels
SP=/tmp python3 anim_v1.py preview  # Kontaktbogen nach $SP
python3 anim_v1.py video            # Master-MP4 nach ../anim/ (CRF 17)
python3 stills.py                   # final/, logos/, board/overview_*
python3 board.py                    # board/index.html
python3 package.py                  # Download-Paket dist/Dreieich_x_Leonida_Paket.zip (nicht im Repo)
```

Die MP4s in `anim/` sind für Social Media neu encodiert (H.264 High, CRF 22, max. 8 Mbit/s,
Reel max. 5 Mbit/s).

## Hinweise

- Es werden keine Logos, Schriften, Figuren oder Screenshots von Rockstar Games / Take-Two verwendet. Alles ist
  eine reine Stil-Hommage, die Schriften sind KI-generiert.
- „Leonida“ ist ein Ortsname aus GTA VI. Für organische Posts als Anspielung üblich. Vor Paid Ads, Print oder Merch
  rechtlich prüfen lassen.
- Alle Motive sind KI-generiert. Bitte das Plattform-Label „Mit KI erstellt“ setzen. Empfohlener Zusatz im Post:
  „Fan-Hommage – keine Kooperation mit Rockstar Games.“
