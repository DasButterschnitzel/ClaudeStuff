// Renders a German sample letter to a JPEG for the on-device text recognition test.
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1300 } });
  await p.setContent(`<body style="font:22px/1.5 Arial;padding:70px;background:#fff;color:#111">
  <p>Kreis Offenbach · Ausländerbehörde<br>Werner-Hilpert-Straße 1, 63128 Dietzenbach</p><p style="text-align:right">Datum: 20.11.2026</p>
  <p><b>Betreff: Verlängerung Ihrer Aufenthaltserlaubnis – Termin zur Vorsprache</b></p><p>Sehr geehrte Frau Banda,</p>
  <p>Ihre Aufenthaltserlaubnis läuft am 15.01.2027 ab. Für die Verlängerung haben wir folgenden Termin für Sie reserviert: Dienstag, 15.12.2026 um 10:30 Uhr, Zimmer 2.14.</p>
  <p>Bitte bringen Sie folgende Unterlagen mit: gültiger Reisepass, biometrisches Passfoto, Meldebescheinigung.</p>
  <p>Die Gebühr beträgt 93,00 € und ist beim Termin zu zahlen. Bitte sagen Sie den Termin spätestens bis zum 08.12.2026 ab, wenn Sie nicht kommen können.</p>
  <p>Mit freundlichen Grüßen<br>Im Auftrag<br>Müller</p></body>`);
  await p.screenshot({ path: path.join(__dirname, 'shots', 'letter.jpg'), type: 'jpeg', quality: 85 }); await b.close();
})();
