"""Builds the download package dist/Dreieich_x_Leonida_Paket.zip (deliverables only, social-media ready).

Layout inside the ZIP:
  Dreieich_x_Leonida/
    00_LIESMICH.txt, Captions_und_Hashtags.txt
    01_Praesentation/      Praesentation.html (+ overview images); videos are linked from 04_Reels_9x16
    02_Feed_4x5/           1080x1350 JPG
    03_Story_9x16/         1080x1920 JPG
    04_Reels_9x16/         MP4 (1080x1920, 30 fps, 8 s, silent) + sizzle reel
    05_Reel-Cover/         poster frames (JPG)
    06_Logos_freigestellt/ PNG with alpha
"""
import glob
import os
import shutil
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import board  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = lambda *p: os.path.join(ROOT, *p)
NAME = 'Dreieich_x_Leonida'
DIST = L('dist')
STAGE = os.path.join(DIST, NAME)
ZIP = os.path.join(DIST, f'{NAME}_Paket.zip')

D = dict(pres='01_Praesentation', feed='02_Feed_4x5', story='03_Story_9x16', reels='04_Reels_9x16',
         cover='05_Reel-Cover', logos='06_Logos_freigestellt')
G = '07_Dreieich_III'                                  # the cover-style parody set (own folder)
GD = dict(cover=f'{G}/Cover', posters=f'{G}/Ortskarten_9x16', song=f'{G}/Reels_mit_Song', mute=f'{G}/Reels_stumm')
SONG_DIR = os.environ.get('GTA_SONG_DIR', '')          # folder with the *_mit_song.mp4 (not in the repo)

shutil.rmtree(STAGE, ignore_errors=True)
for d in list(D.values()) + list(GD.values()):
    os.makedirs(os.path.join(STAGE, d))


def cp(pattern, dst, skip='gta_'):
    files = sorted(glob.glob(pattern if os.path.isabs(pattern) else L(*pattern.split('/'))))
    files = [f for f in files if skip is None or not os.path.basename(f).startswith(skip)]
    for f in files:
        shutil.copy2(f, os.path.join(STAGE, dst, os.path.basename(f)))
    return len(files)


n = dict(feed=cp('final/*_4x5.jpg', D['feed']), story=cp('final/*_9x16.jpg', D['story']),
         reels=cp('anim/*.mp4', D['reels']), cover=cp('anim/*_poster.jpg', D['cover']),
         logos=cp('logos/*.png', D['logos']), pres=cp('board/overview_*.jpg', D['pres']))

ng = dict(cover=cp('final/gta_cover_*.jpg', GD['cover'], None), posters=cp('final/gta_poster_*.jpg', GD['posters'], None),
          mute=cp('anim/gta_*.mp4', GD['mute'], None), emblem=cp('logos/gta_*.png', GD['cover'], None),
          song=cp(os.path.join(SONG_DIR, 'gta_*_mit_song.mp4'), GD['song'], None) if SONG_DIR else 0)
has_song = ng['song'] > 0
if not has_song:
    os.rmdir(os.path.join(STAGE, GD['song']))
layout = dict(feed=D['feed'], story=D['story'], reels=D['reels'], logos=D['logos'], video_prefix=f"../{D['reels']}",
              gta_prefix=f"../{GD['song'] if has_song else GD['mute']}", gta_suffix='_mit_song' if has_song else '',
              gta_dir=G, gta_sound=has_song)
board.build(layout, os.path.join(STAGE, D['pres'], 'Praesentation.html'))

concepts = '\n'.join(f"{c['no']:>3}  {c['name']}  –  {c['tag']}" for c in board.CONCEPTS)
readme = f"""DREIEICH × LEONIDA – Download-Paket
===================================

Sechs Logo-Konzepte plus die Dreieich-Edition (05b) mit echten Fotos der Stadt.
Jedes Konzept gibt es als Feed-Bild, Story-Bild, animiertes Reel und Freisteller.

ORDNER
  01_Praesentation/        Praesentation.html im Browser öffnen (die Videos laufen direkt mit),
                           dazu Übersichtsbilder aller Konzepte
  02_Feed_4x5/             Feed-Posts, 1080 × 1350 px, JPG
  03_Story_9x16/           Stories, 1080 × 1920 px, JPG
  04_Reels_9x16/           Animationen, 1080 × 1920 px, 30 fps, 8 s, H.264, ohne Ton
                           + dreieich_leonida_reel.mp4 (alle sieben Animationen, 53 s)
  05_Reel-Cover/           Standbilder aus den Animationen als Titelbild fürs Reel
  06_Logos_freigestellt/   PNG mit transparentem Hintergrund
                           (v2 zusätzlich „on_black“ für den Mischmodus „Negativ multiplizieren“)
  07_Dreieich_III/         NEU: die Parodie im Cover-Stil
     Cover/                  Cover als Feed (4:5) und Story (9:16) + Emblem „III / drei eich“ als PNG
     Ortskarten_9x16/        zehn Ortskarten als Story-Bilder
     Reels_mit_Song/         Trailer (42 s), Cover-Reveal (13 s), Ladebildschirm (15 s) mit dem Song
     Reels_stumm/            dieselben drei Reels ohne Ton
  Captions_und_Hashtags.txt  Caption-Ideen zum Kopieren

DIE KONZEPTE
{concepts}

Dateinamen: v1 … v6 = Konzept 01 … 06, v5b = Dreieich-Edition.

POSTING-TIPPS
  - Die Reels sind stumm: in der App einen Trend-Sound drunterlegen.
  - Carousel-Idee: 01 → 06 als Swipe-Strecke „Welche Dreieich-Version bist du?“,
    05b mit den echten Orten als Abschluss.
  - Als Reel-Cover ein Bild aus 05_Reel-Cover oder 03_Story_9x16 nehmen.

DREIEICH III UND DER SONG
  Die drei Reels sind auf den Takt von „Flower In A Hurricane“ geschnitten (126 BPM).
  Der Song ist urheberrechtlich geschützt. Sicherer Weg: die stumme Fassung hochladen und den
  Song in der App aus der Musikbibliothek anlegen, mit diesen Startzeiten im Song:
     Trailer        ab 0:36,4   (der Drop liegt im Video bei 0:11,4)
     Cover-Reveal   ab 0:45,9   (der Drop liegt im Video bei 0:01,9)
     Ladebildschirm ab 0:00,0
  Die Fassungen mit Song sind zum Zeigen und Abstimmen gedacht. Wer sie direkt postet,
  braucht die Rechte am Song (Geschäftskonten haben oft nur eine eingeschränkte Bibliothek).

HINWEISE
  - Es werden keine Logos, Schriften, Figuren oder Screenshots von Rockstar Games / Take-Two
    verwendet, alles ist eine reine Stil-Hommage. Empfohlener Zusatz im Post:
    „Fan-Hommage – keine Kooperation mit Rockstar Games.“
  - „Leonida“ ist ein Ortsname aus GTA VI. Für normale Posts als Anspielung üblich;
    vor Werbeanzeigen, Print oder Merch rechtlich prüfen lassen.
  - Alle Motive sind KI-generiert (05b: KI-Lettering mit echten Fotos der Stadt).
    Bitte das Plattform-Label „Mit KI erstellt“ setzen.
"""
open(os.path.join(STAGE, '00_LIESMICH.txt'), 'w', encoding='utf-8').write(readme)

caps = ['CAPTION-IDEEN – Dreieich × Leonida', '=' * 34, '']
for c in board.CONCEPTS:
    caps += [f"{c['no']} {c['name']}", c['caption'], '']
caps += ['III Dreieich III – Trailer', 'Der Trailer, auf den niemand gewartet hat: Dreieich III. Jetzt verfügbar. Seit 1977.', '',
         'III Dreieich III – Cover', 'Keine Vorbestellung nötig. Fünf Stadtteile, null Fahndungssterne. 🌳🌳🌳', '',
         'III Dreieich III – Ladebildschirm', 'Lade Dreieich … Tipp: Ein Gerippter füllt die Lebensenergie auf.', '']
caps += ['Hashtags:', board.HASHTAGS, '', 'Zusatz:', 'Fan-Hommage – keine Kooperation mit Rockstar Games. Mit KI erstellt.', '']
open(os.path.join(STAGE, 'Captions_und_Hashtags.txt'), 'w', encoding='utf-8').write('\n'.join(caps))

if os.path.exists(ZIP):
    os.remove(ZIP)
STORE = ('.mp4', '.jpg', '.png')
with zipfile.ZipFile(ZIP, 'w') as z:
    for dirpath, _, files in sorted(os.walk(STAGE)):
        for f in sorted(files):
            full = os.path.join(dirpath, f)
            arc = os.path.relpath(full, DIST)
            z.write(full, arc, compress_type=zipfile.ZIP_STORED if f.lower().endswith(STORE) else zipfile.ZIP_DEFLATED)
print('files per folder:', n, ng)
print('zip ->', ZIP, round(os.path.getsize(ZIP) / 1e6, 1), 'MB')
