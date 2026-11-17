// Baut aus src/ die eine veröffentlichte Datei dist/index.html (+ preview.html zum lokalen Testen)
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
const js = readdirSync('src/js').filter(f => f.endsWith('.js')).sort().map(f => `// ---- ${f} ----\n` + readFileSync('src/js/' + f, 'utf8')).join('\n');
const page = readFileSync('src/page.html', 'utf8').replace('<!--APP-->', () => `<script type="module">\n${js}\n</script>`);
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', page.replace('window.__bad = { builds,', '({ builds,').replace('camera, controls };\nstart();', 'camera, controls });\nstart();'));
writeFileSync('dist/preview.html', `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>\n${page}\n</body></html>`);
writeFileSync('dist/app-check.mjs', js);
console.log('built', (page.length / 1024).toFixed(1) + ' KB');
