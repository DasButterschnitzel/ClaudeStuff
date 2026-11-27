/* Boot. */
(function () {
  'use strict';
  const { N } = MW; const S = MW.state;

  function handleShare(p) {
    if (!p || !S.onboarded) return;
    if (p.type === 'image' && p.file) return Scan.scanShared(p.file);
    if (p.type === 'go' && p.route) return MW.go(p.route);
    if (p.type === 'text' && p.text) {
      const t = String(p.text).trim();
      if (t.length > 320 && Speak.looksGerman(t)) { MW.go('today'); return Scan.analyseText(t); }
      return Speak.translateShared(t.slice(0, 1500));
    }
  }

  MW.applyTheme();
  let pending = null;
  try { if (window.NativeBridge) { const r = window.NativeBridge.ready(); if (r) pending = JSON.parse(r); } } catch (e) { }
  N.on('share', handleShare);

  if (!S.onboarded) {
    MW.render();
    Today.onboarding(() => { MW.render(); if (pending) handleShare(pending); });
  } else {
    MW.render();
    if (pending) handleShare(pending);
    if (S.settings.remind) Today.syncReminder(); // refresh the word list for the daily notification
  }

  // refresh the home screen when she comes back to the app on a new day
  let lastDay = MW.dayKey();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && MW.dayKey() !== lastDay) { lastDay = MW.dayKey(); MW.render(); }
  });
})();
