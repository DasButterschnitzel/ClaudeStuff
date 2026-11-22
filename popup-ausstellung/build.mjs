// Baut aus src/ die eine veröffentlichte Datei dist/index.html (+ preview.html zum lokalen Testen)
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
const foil = `// ---- Schaufensterfolierung als Textur ----\nconst FOIL_SRC = 'data:image/webp;base64,${readFileSync('src/foil.webp').toString('base64')}';\n`;
const layouts = `// ---- Layouts aus dem Gestalter-Workflow ----\nconst LAYOUT_DATA = ${readFileSync('src/layouts.json', 'utf8').trim()};\n`;
const radikal = `const RADIKAL_DATA = ${readFileSync('src/radikal.json', 'utf8').trim()};\n`;
const ideen = `const IDEEN_DATA = ${readFileSync('src/ideen.json', 'utf8').trim()};\n`;
const js = foil + layouts + radikal + ideen + readdirSync('src/js').filter(f => f.endsWith('.js')).sort().map(f => `// ---- ${f} ----\n` + readFileSync('src/js/' + f, 'utf8')).join('\n');
const page = readFileSync('src/page.html', 'utf8').replace('<!--APP-->', () => `<script type="module">\n${js}\n</script>`);
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', page.replace('window.__popup = {', 'void {'));
writeFileSync('dist/preview.html', `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}img{max-width:100%}</style></head><body>\n${page}\n</body></html>`);
writeFileSync('dist/app-check.mjs', js);
console.log('built', (page.length / 1024).toFixed(1) + ' KB');
