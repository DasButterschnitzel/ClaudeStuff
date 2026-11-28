// Builds contact sheets from tests/shots for quick visual review.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.join(__dirname, 'shots'); const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') && !f.startsWith('sheet')).sort();
  const per = +(process.argv[2] || 5); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: per * 300 + 20, height: 700 } });
  for (let i = 0, k = 1; i < files.length; i += per, k++) {
    const html = '<body style="margin:10px;background:#888;display:flex;gap:8px;font:12px sans-serif">' + files.slice(i, i + per).map(f => '<div><div style="color:#fff">' + f + '</div><img style="width:292px;display:block" src="data:image/png;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64') + '"></div>').join('') + '</body>';
    await p.setContent(html); await p.waitForTimeout(200); await p.screenshot({ path: path.join(dir, 'sheet' + k + '.png'), fullPage: true });
  }
  await b.close();
})();
