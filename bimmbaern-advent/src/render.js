// Rendert alle Advents-Posts (1.–4. Advent, 4:5 = 1080x1350 und 9:16 = 1080x1920) als PNG nach ../out
// Aufruf: node src/render.js [sonntag] [format] [--preview]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const preview = process.argv.includes('--preview');
const sundays = args[0] ? [+args[0]] : [1, 2, 3, 4];
const formats = args[1] ? [args[1]] : ['4x5', '9x16'];
const SIZE = { '4x5': [1080, 1350], '9x16': [1080, 1920] };
const outDir = path.join(__dirname, '..', preview ? 'out/preview' : 'out');

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  for (const f of formats) {
    const [w, h] = SIZE[f];
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: preview ? 0.5 : 1 });
    for (const n of sundays) {
      await page.goto('file://' + path.join(__dirname, 'advent.html') + `?n=${n}&f=${f}`);
      await page.waitForFunction(() => document.body.dataset.ready === '1');
      await page.waitForTimeout(150);
      const file = path.join(outDir, `bimmbaern_${n}-advent_${f}${preview ? '.jpg' : '.png'}`);
      await page.locator('#stage').screenshot(preview ? { path: file, type: 'jpeg', quality: 86 } : { path: file });
      console.log('ok', file);
    }
    await page.close();
  }
  await browser.close();
})();
