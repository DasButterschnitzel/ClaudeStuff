"""Builds board/index.html — the concept presentation (images embedded, videos linked relatively)."""
import base64
import html
import os

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = lambda *p: os.path.join(ROOT, *p)


def b64img(path, max_w, q=80, alpha=False):
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    h, w = im.shape[:2]
    if w > max_w:
        im = cv2.resize(im, (max_w, int(h * max_w / w)), interpolation=cv2.INTER_AREA)
    ok, buf = cv2.imencode('.webp', im, [cv2.IMWRITE_WEBP_QUALITY, q])
    return 'data:image/webp;base64,' + base64.b64encode(buf.tobytes()).decode()


CONCEPTS = [
    dict(
        id='v1', slug='sunset_triangle', no='01', name='Sunset Triangle', tag='Das Flaggschiff',
        idea='Das Dreieck aus dem Stadtlogo wird zum Fenster nach Leonida: Sonnenuntergang über dem See, Palmen '
             'neben Eichen, Burg Hayn auf dem Hügel, ein Jet im Anflug. Der Stadt-Swoosh umkreist alles in Chrom, '
             'darüber der fette Stack-Schriftzug „drei / eich“.',
        eggs=['Burg Hayn als Silhouette', 'Palmen + Eichen = „Drei Eichen“ trifft Leonida',
              'Jet im Landeanflug – die Einflugschneise kennt hier jede:r', 'Grün-Limette-Verlauf und Swoosh aus dem Stadtlogo'],
        beats=[('0,0 s', 'Anamorph-Lichtstreifen zündet'), ('0,3 s', 'Dreieck öffnet sich, Sonnenuntergang zoomt rein'),
               ('0,7 s', 'Chrom-Swoosh fliegt als Komet einmal ums Dreieck'),
               ('1,8 s', '„drei/eich“ knallt rein: Flash, Schockwelle, Shake, RGB-Split'),
               ('2,1 s', 'Tagline wischt von der Mitte auf'),
               ('2,6 s +', 'Sonne pulsiert, Licht-Sweeps über die Lettern, Glints, Bokeh, Push-in')],
        caption='Willkommen in Leonida? Fast. Willkommen in Dreieich. 🌴🌳',
        logo='v1_sunset_triangle_logo.png'),
    dict(
        id='v2', slug='neon_nights', no='02', name='Neon Nights', tag='Fachwerk trifft Vice',
        idea='Handgebogenes Neon-Script „Dreieich“ an einem Fachwerkhaus in einer Altstadtgasse: Nieselregen, Palmen in '
             'Terrakotta-Kübeln, Pfützen, in denen sich das Pink spiegelt. Der Vice-City-Vibe – aber mit Kopfsteinpflaster.',
        eggs=['Fachwerk & Kopfsteinpflaster – Altstadt-Dreieichenhain-Vibes', 'Torturm im Hintergrund',
              '„EST. 1977“ – Gründungsjahr der Stadt Dreieich', 'Dreieck + Sichel als Neon-Elemente aus dem Stadtlogo'],
        beats=[('0,0 s', 'Schild aus, nur Fensterlicht und Regen'), ('0,4 s', 'das „D“ stottert kurz'),
               ('1,0 s', 'Buchstaben zünden nacheinander – Wandlicht und Pfützen-Reflexe folgen live'),
               ('2,0 s', 'Unterstreichung zieht durch'), ('2,4 s', 'Dreieck ploppt an, Sichel läuft ein'),
               ('3,0 s +', '„EST. 1977“, Regen, Ripples – und ein müdes „c“ flackert')],
        caption='Unser Neon brennt seit 1977. Nachtleben-Level: Altstadt. 💗',
        logo='v2_neon_nights_logo.png'),
    dict(
        id='v3', slug='welcome_sign', no='03', name='Welcome to Dreieich', tag='Highway-Americana',
        idea='Ein gigantisches Googie-Willkommensschild, wie es an Leonidas Highways stehen würde: Golden Hour, '
             'Marquee-Glühbirnen, das Stadt-Dreieck als Neon-Krone, Burgruine am Horizont, Jet mit ausgefahrenem Fahrwerk.',
        eggs=['Burg Hayn auf dem Hügel', 'Flieger im Anflug', 'Eichen mit Spanish Moss neben Palmen',
              'Dreieck + Swoosh als Schild-Krone'],
        beats=[('0,0 s', 'Fade-up, 2.5D-Parallaxe: Schild wächst schneller als der Hintergrund'),
               ('0,55 s', 'Neon-Dreieck stottert an'),
               ('1,0 s', 'Glühbirnen schalten sich von links nach rechts durch, dann Lauflicht'),
               ('3,4 s', 'Jet taucht hinter dem Schild auf: geradliniger Anflug, Nase voraus, 3°-Gleitpfad'),
               ('5,4 s', 'wird perspektivisch korrekt größer und schneller (Projektion über den Fluchtpunkt), mit Landescheinwerfern, Positionslichtern rot/grün, Strobes und Beacon'),
               ('7,2 s', 'donnert mit Bewegungsunschärfe oben rechts aus dem Bild, Doppel-Blitz der Birnen davor')],
        caption='Ab sofort offiziell: Dreieich, Leonida. Bitte langsam fahren – hier wird gechillt.',
        logo='v3_welcome_sign_logo.png'),
    dict(
        id='v4', slug='chrome_nights', no='04', name='Dreieich Nights', tag='80s Chrome',
        idea='Vorspann-Ästhetik eines 80er-Actionfilms: verchromte Kursiv-Lettern, Smaragd-Glasdreieck mit Chrom-Swoosh, '
             'Neon-Script „Nights“, Synthwave-Grid – und in der gestreiften Sonne steht Burg Hayn.',
        eggs=['Burg-Hayn-Turm in der Synthwave-Sonne', 'Dreieck im Stadt-Verlauf Smaragd → Limette',
              'Palmen + Eichen als Silhouetten'],
        beats=[('0,0 s', 'Grid rast auf die Kamera zu – endlos loopbar, perspektivisch korrekt neu gezeichnet'),
               ('0,55 s', 'Licht-Sweep enthüllt die Chrom-Lettern'), ('1,25 s', 'Glasdreieck lädt auf'),
               ('1,6 s', '„Nights“ schreibt sich in Neon'),
               ('2,5 s +', 'Sterne funkeln, Glints, wiederkehrende Chrom-Sweeps, Push-in')],
        caption='Dreieich Nights. Ab 22 Uhr gilt Synthwave-Pflicht. 🌆',
        logo='v4_chrome_nights_logo.png'),
    dict(
        id='v5', slug='greetings_postcard', no='05', name='Greetings from Dreieich', tag='Large-Letter-Postkarte',
        idea='Die klassische Großbuchstaben-Postkarte: Jeder Buchstabe zeigt ein Motiv aus „Dreieich, Leonida“ – '
             'Burgruine, Fachwerk mit Neon, Flamingos am Weiher, Jet über dem Weizenfeld, Villa mit Pool, Eichenwald, '
             'Bembel mit Gerippten, S-Bahn auf dem Viadukt. Im Reel liegt sie auf dem Strandtuch – neben einem Ebbelwoi.',
        eggs=['Bembel + Geripptes (Ebbelwoi statt Cocktail)', 'Flamingos am Weiher', 'Villen-Vibes', 'S-Bahn',
              'Burgruine als „D“'],
        beats=[('0,15 s', 'Karte segelt mit Drall aufs Strandtuch'), ('1,15 s', 'Landung mit Bounce und Kontaktschatten'),
               ('1,3 s', 'Glitzer läuft über „Greetings from“'), ('2,2 s', 'jeder der 8 Buchstaben glänzt nacheinander auf'),
               ('durchgehend', 'Lichtflecken der Palmen wandern, Kamera fährt auf die Lettern')],
        caption='Grüße aus Dreieich! Bembel statt Cocktail, Weiher statt Ozean – Vibe identisch. 🦩',
        logo='v5_greetings_postcard_card.png'),
    dict(
        id='v5b', slug='greetings_dreieich', no='05b', name='Greetings from Dreieich', tag='Dreieich-Edition · eure echten Fotos',
        idea='Die Postkarte als Dreieich-Edition: In den acht Buchstaben stecken eure echten Fotos, so wie bei klassischen '
             'Großbuchstaben-Postkarten: die Fahrgasse in Dreieichenhain mit dem Gasthaus „Alte Burg“, die Dreieichbahn im Wald, '
             'die Villenkolonie Buchschlag, das Fachwerk, dazu der Sonnenuntergang über den Feldern und das Felder-Patchwork aus '
             'der 360°-Drohnenaufnahme (perspektivisch entzerrt). Dahinter die Frankfurter Skyline über dem Wald, Stadtmauer mit '
             'Turm und Fachwerkhäuser. Im Reel landet die Karte auf einem Ebbelwoi-Tisch.',
        eggs=['echte Fotos: Fahrgasse mit „Alte Burg“, Dreieichbahn, Buchschlag, Fachwerk, Drohnen-Panorama',
              'Frankfurter Skyline über dem Wald – der Blick aus Dreieich', 'Stadtmauer mit Turm und Fachwerk',
              'Eichenlaub mit Eicheln: die „Eich“ in Dreieich', 'Bembel, Geripptes und Brezel statt Strand'],
        beats=[('0,15 s', 'Karte segelt mit Drall auf den Ebbelwoi-Tisch'),
               ('1,15 s', 'landet mit Bounce und Kontaktschatten – kollisionsfrei neben Bembel, Glas und Brezel'),
               ('1,3 s', 'Glitzer läuft über „Greetings from“'),
               ('2,2 s', 'jeder Foto-Buchstabe glänzt nacheinander auf, exakt in Buchstabenform'),
               ('durchgehend', 'Lichtflecken der Kastanie wandern über den Tisch, Kamera fährt auf die Lettern')],
        caption='Echte Grüße aus Dreieich: Fahrgasse, Dreieichbahn, Buchschlag – und ein Geripptes dazu. Leonida kann einpacken. 🍏',
        logo='v5b_greetings_dreieich_card.png'),
    dict(
        id='v6', slug='leonida_plate', no='06', name='Leonida Plate', tag='In-World-Objekt',
        idea='Ein Vanity-Kennzeichen aus Leonida: „DREIEICH“ geprägt, „SUNSHINE CITY“, Sonnenuntergangsmotiv mit Palme '
             'und Eiche, Dreieck-Plakette – montiert an einem pinken 80er-Sportwagen im Palmenschatten.',
        eggs=['Eiche neben Palme im Kennzeichen-Motiv', 'Dreieck als Zulassungsplakette', 'Pink-Lack + Palmenschatten'],
        beats=[('0,0 s', 'Rack-Focus von unscharf zu scharf'), ('1,7 s', 'Glanzlicht läuft über die geprägten Lettern'),
               ('2,5 s', 'Blitzer auf den Schrauben'), ('3,0 s', 'Shine über „LEONIDA“'),
               ('durchgehend', 'Holo-Schimmer auf der Plakette, Hitzeflimmern über den Auspuffrohren, Push-in')],
        caption='Kennzeichen ist beantragt. Zulassungsstelle Leonida, wir kommen. 🚗💨',
        logo='v6_leonida_plate_front.png'),
]

HASHTAGS = '#Dreieich #DreieichLeonida #Leonida #GTA6 #GTAVI #ViceVibes #Hessen #Synthwave'


def concept_html(c):
    still = b64img(L('final', f"{c['id']}_{c['slug']}_4x5.jpg"), 720, 82)
    poster = b64img(L('final', f"{c['id']}_{c['slug']}_9x16.jpg"), 405, 76)
    logo = b64img(L('logos', c['logo']), 560, 86)
    video = f"../anim/{c['id']}_{c['slug']}.mp4"
    eggs = ''.join(f'<li>{html.escape(e)}</li>' for e in c['eggs'])
    beats = ''.join(f'<li><span class="t">{html.escape(t)}</span><span>{html.escape(d)}</span></li>' for t, d in c['beats'])
    files = [f"final/{c['id']}_{c['slug']}_4x5.jpg", f"final/{c['id']}_{c['slug']}_9x16.jpg",
             f"anim/{c['id']}_{c['slug']}.mp4", f"logos/{c['logo']}"]
    flist = ''.join(f'<code>{f}</code>' for f in files)
    return f'''
<section class="concept" id="{c['id']}">
  <header class="c-head">
    <span class="no">{c['no']}</span>
    <div><h2>{html.escape(c['name'])}</h2><p class="tag">{html.escape(c['tag'])}</p></div>
  </header>
  <div class="c-grid">
    <figure class="still"><img src="{still}" alt="{html.escape(c['name'])} – Key Visual 4:5" loading="lazy"><figcaption>Key Visual · Feed 4:5</figcaption></figure>
    <figure class="reel"><video src="{video}" poster="{poster}" muted loop playsinline autoplay preload="metadata"></video><figcaption>Logo-Animation · Reel 9:16 · 8 s</figcaption></figure>
    <div class="info">
      <p class="idea">{html.escape(c['idea'])}</p>
      <h3>Dreieich-Easter-Eggs</h3><ul class="eggs">{eggs}</ul>
      <h3>Animation</h3><ol class="beats">{beats}</ol>
      <h3>Caption-Idee</h3><p class="caption">„{html.escape(c['caption'])}“</p>
      <div class="logo-chip"><img src="{logo}" alt="Logo freigestellt" loading="lazy"><span>Freisteller (PNG)</span></div>
      <div class="files">{flist}</div>
    </div>
  </div>
</section>'''


def build():
    reel_poster = b64img(L('final', 'v1_sunset_triangle_9x16.jpg'), 405, 76)
    overview = b64img(L('board', 'overview_4x5.jpg'), 1200, 80)
    concepts = ''.join(concept_html(c) for c in CONCEPTS)
    nav = ''.join(f'<a href="#{c["id"]}">{c["no"]} {html.escape(c["name"])}</a>' for c in CONCEPTS)
    page = f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dreieich × Leonida</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
<style>
:root {{
  --bg: #0c0716; --bg2: #150c24; --card: #1b1030; --line: #2e1d4a;
  --text: #f4ecff; --muted: #b9a8d6; --pink: #ff3ea5; --orange: #ff8a3d; --gold: #ffc94a;
  --lime: #c8e02a; --emerald: #1b7252; --navy: #0a1b39;
  --sunset: linear-gradient(100deg, #5b2bd6 0%, #d6249f 45%, #ff7a3d 80%, #ffc94a 100%);
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg: #0c0716; }} }}
:root[data-theme="dark"] {{ --bg: #0c0716; }}
* {{ box-sizing: border-box; }}
html {{ scroll-behavior: smooth; }}
body {{ margin: 0; background: var(--bg); color: var(--text); font: 16px/1.55 Inter, system-ui, sans-serif; overflow-x: hidden; }}
a {{ color: inherit; }}
.wrap {{ max-width: 1240px; margin: 0 auto; padding: 0 16px; }}
.hero {{ position: relative; padding: 64px 0 40px; background:
  radial-gradient(1200px 500px at 70% -10%, rgba(214,36,159,.35), transparent 60%),
  radial-gradient(900px 400px at 10% 0%, rgba(91,43,214,.35), transparent 60%); }}
.kicker {{ letter-spacing: .28em; text-transform: uppercase; font-size: 12px; color: var(--muted); font-weight: 600; }}
h1 {{ font-family: Anton, Impact, sans-serif; font-weight: 400; font-size: clamp(48px, 9vw, 128px); line-height: .9; margin: 10px 0 18px;
  background: var(--sunset); -webkit-background-clip: text; background-clip: text; color: transparent; }}
h1 .x {{ color: var(--lime); -webkit-text-fill-color: var(--lime); }}
.lead {{ max-width: 760px; font-size: clamp(16px, 2.1vw, 20px); color: #e6dafb; }}
.hero-grid {{ display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 24px; margin-top: 36px; align-items: start; }}
.hero-grid img, .hero-grid video {{ width: 100%; border-radius: 14px; display: block; border: 1px solid var(--line); }}
.reel-box video {{ aspect-ratio: 9/16; object-fit: cover; background: #000; }}
.pill-row {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }}
.pill {{ border: 1px solid var(--line); background: var(--bg2); padding: 6px 12px; border-radius: 999px; font-size: 13px; color: var(--muted); }}
nav.toc {{ position: sticky; top: 0; z-index: 5; background: rgba(12,7,22,.86); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }}
nav.toc .wrap {{ display: flex; gap: 18px; overflow-x: auto; padding-top: 12px; padding-bottom: 12px; scrollbar-width: none; }}
nav.toc a {{ white-space: nowrap; text-decoration: none; font-size: 13px; color: var(--muted); font-weight: 600; }}
nav.toc a:hover {{ color: var(--text); }}
.concept {{ padding: 64px 0 24px; border-bottom: 1px solid var(--line); }}
.c-head {{ display: flex; align-items: baseline; gap: 18px; margin-bottom: 22px; }}
.c-head .no {{ font-family: Anton, Impact, sans-serif; font-size: clamp(44px, 7vw, 84px); line-height: 1; background: var(--sunset);
  -webkit-background-clip: text; background-clip: text; color: transparent; }}
.c-head h2 {{ font-family: Anton, Impact, sans-serif; font-weight: 400; font-size: clamp(30px, 4.4vw, 52px); margin: 0; line-height: 1; letter-spacing: .01em; }}
.c-head .tag {{ margin: 6px 0 0; color: var(--lime); font-weight: 800; letter-spacing: .14em; text-transform: uppercase; font-size: 12px; }}
.c-grid {{ display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, .62fr) minmax(0, 1fr); gap: 22px; align-items: start; }}
figure {{ margin: 0; }}
figure img, figure video {{ width: 100%; display: block; border-radius: 12px; border: 1px solid var(--line); background: #000; }}
figure.reel video {{ aspect-ratio: 9/16; object-fit: cover; }}
figcaption {{ font-size: 12px; color: var(--muted); margin-top: 8px; letter-spacing: .04em; }}
.info h3 {{ font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--orange); margin: 22px 0 8px; }}
.idea {{ margin: 0; font-size: 17px; color: #efe6ff; }}
ul.eggs {{ margin: 0; padding-left: 18px; color: #ddd0f5; }}
ol.beats {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }}
ol.beats li {{ display: grid; grid-template-columns: 92px 1fr; gap: 10px; font-size: 14px; color: #ddd0f5; }}
ol.beats .t {{ color: var(--gold); font-variant-numeric: tabular-nums; font-weight: 600; }}
.caption {{ margin: 0; font-size: 15px; background: var(--card); border: 1px solid var(--line); border-left: 3px solid var(--pink); padding: 10px 14px; border-radius: 8px; }}
.logo-chip {{ margin-top: 18px; display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: 12px; border: 1px solid var(--line);
  background-color: #241640; background-image: linear-gradient(45deg,#2c1b4c 25%,transparent 25%),linear-gradient(-45deg,#2c1b4c 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2c1b4c 75%),linear-gradient(-45deg,transparent 75%,#2c1b4c 75%);
  background-size: 18px 18px; background-position: 0 0,0 9px,9px -9px,-9px 0; }}
.logo-chip img {{ width: 160px; max-width: 45%; height: auto; }}
.logo-chip span {{ font-size: 12px; color: var(--muted); }}
.files {{ display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }}
.files code {{ font-size: 11px; background: var(--bg2); border: 1px solid var(--line); padding: 3px 7px; border-radius: 6px; color: #cbb9ee; overflow-wrap: anywhere; }}
.notes {{ padding: 64px 0 80px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }}
.note {{ background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 22px; }}
.note h3 {{ margin: 0 0 10px; font-family: Anton, Impact, sans-serif; font-weight: 400; font-size: 26px; letter-spacing: .01em; }}
.note ul {{ margin: 0; padding-left: 18px; color: #ddd0f5; font-size: 14px; }}
.note p {{ color: #ddd0f5; font-size: 14px; }}
.hash {{ margin-top: 10px; font-size: 13px; color: var(--lime); overflow-wrap: anywhere; }}
footer {{ padding: 24px 0 60px; color: var(--muted); font-size: 12px; }}
@media (max-width: 980px) {{
  .hero-grid {{ grid-template-columns: minmax(0, 1fr); }}
  .reel-box {{ max-width: 380px; }}
  .c-grid {{ grid-template-columns: minmax(0, 1fr) minmax(0, .7fr); }}
  .info {{ grid-column: 1 / -1; }}
  .notes {{ grid-template-columns: minmax(0, 1fr); }}
}}
@media (max-width: 560px) {{
  .c-grid {{ grid-template-columns: minmax(0, 1fr); }}
  figure.reel {{ max-width: 320px; }}
  ol.beats li {{ grid-template-columns: 74px 1fr; }}
}}
</style>
</head>
<body>
<div class="hero"><div class="wrap">
  <div class="kicker">Stadt Dreieich · Social-Media-Konzept · GTA-VI-Hype</div>
  <h1>Dreieich <span class="x">×</span> Leonida</h1>
  <p class="lead">Sechs Logo-Varianten plus eine Dreieich-Edition mit euren echten Fotos, als wäre Dreieich eine Stadt im
  Bundesstaat Leonida – jede als Hochglanz-Key-Visual (Feed 4:5, Story 9:16), als freigestelltes Logo und als fertig
  animierter 8-Sekunden-Reel. Stil-Hommage an die
  Sunset-Neon-Americana des Hypes, gebaut aus Dreieichs eigener DNA: dem Dreieck, dem Swoosh, den drei Eichen, Burg Hayn,
  Fachwerk, Ebbelwoi – und den Fliegern über der Stadt.</p>
  <div class="pill-row"><span class="pill">6 Logo-Konzepte + Dreieich-Edition</span><span class="pill">14 Key Visuals (4:5 + 9:16)</span>
  <span class="pill">7 animierte Reels + Sizzle-Reel</span><span class="pill">9 Freisteller (PNG)</span><span class="pill">keine Rockstar-Marken verwendet</span></div>
  <div class="hero-grid">
    <figure><img src="{overview}" alt="Alle sechs Key Visuals im Überblick"><figcaption>Alle Konzepte · Feed-Format 4:5</figcaption></figure>
    <figure class="reel-box"><video src="../anim/dreieich_leonida_reel.mp4" poster="{reel_poster}" muted loop playsinline autoplay preload="metadata"></video><figcaption>Sizzle-Reel · alle sieben Animationen · 53 s</figcaption></figure>
  </div>
</div></div>
<nav class="toc"><div class="wrap">{nav}<a href="#notes">Hinweise</a></div></nav>
<main class="wrap">
{concepts}
<section class="notes" id="notes">
  <div class="note"><h3>Posting-Kit</h3>
    <ul><li>Feed: <code>final/*_4x5.jpg</code> (1080×1350)</li><li>Story/Reel-Cover: <code>final/*_9x16.jpg</code> (1080×1920)</li>
    <li>Reels/TikTok: <code>anim/*.mp4</code> – stumm, damit ihr in-App Trend-Audio drunterlegen könnt</li>
    <li>Carousel-Idee: 01 → 06 als Swipe-Strecke „Welche Dreieich-Version bist du?“, 05b als Abschluss mit echten Orten</li></ul>
    <p class="hash">{HASHTAGS}</p></div>
  <div class="note"><h3>Rechtliches & Fair Play</h3>
    <ul><li>Keine Logos, Schriften, Figuren oder Screenshots von Rockstar Games / Take-Two verwendet – reine Stil-Hommage.</li>
    <li>„Leonida“ ist ein Ortsname aus GTA VI. Für organische Posts als ironische Anspielung üblich; für Anzeigen, Print oder Merch vorher die Rechtsabteilung fragen. Varianten ohne „Leonida“ (z. B. „HESSEN · EST. 1977“) sind schnell gemacht.</li>
    <li>Empfehlung im Post: „Fan-Hommage – keine Kooperation mit Rockstar Games.“</li>
    <li>Alle Motive sind KI-generiert: Plattform-Label „Mit KI erstellt“ setzen.</li></ul></div>
  <div class="note"><h3>Wie es gebaut ist</h3>
    <p>Motive: GPT-Image 2.5 (über Figma) mit detaillierter Art Direction und Dreieich-Easter-Eggs. 05b: KI-Lettering mit
    Chroma-Key-Flächen, in die eure Fotos eingesetzt sind (das 360°-Panorama perspektivisch entzerrt). 9:16-Erweiterung: Adobe
    Firefly Generative Expand. Masken: Adobe Photoshop API + ISNet. Animationen: eigene Compositing-Engine (Python/OpenCV) mit
    Clean Plates, Neon-Lichtsimulation, perspektivisch korrektem Grid, Parallaxe und einer physikalisch korrekten Flugbahn für den
    Jet in 03 – Ausgabe H.264, 1080×1920, 30 fps.
    Alles liegt in Ebenen vor und lässt sich in After Effects / CapCut weiterbauen.</p></div>
</section>
</main>
<footer><div class="wrap">Konzept-Entwurf · Dreieich × Leonida · Fan-Hommage, keine Kooperation mit Rockstar Games / Take-Two Interactive.</div></footer>
</body>
</html>'''
    out = L('board', 'index.html')
    open(out, 'w', encoding='utf-8').write(page)
    print('board ->', out, round(len(page) / 1e6, 2), 'MB')


if __name__ == '__main__':
    build()
