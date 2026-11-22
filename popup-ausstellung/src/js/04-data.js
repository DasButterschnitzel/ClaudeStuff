/* =====================================================================
   DATEN aus Protokoll 1 (10.11.2026) und Protokoll 2 (17.11.2026)
   ===================================================================== */
const WHO = { CM: 'Corinna Molitor', KL: 'Kim Lehnert', CS: 'Claudia Scheibel', SB: 'Sascha Becker', AP: 'Ana Perkovic', ALLE: 'Alle' };

/* pos = [x, z] Mittelpunkt, rot in Grad, size = [Breite, Tiefe, Höhe], eye/look = Blickpunkt der Führung (lokal) */
const ST = [
  { id: 's1', n: 1, name: 'Wohnzimmer', color: '#d9540a', make: buildWohnzimmer, pos: [9.78, 6.75], rot: 0, size: [3.2, 3.0, 2.4], eye: [-2.9, 1.6, 2.9], look: [0.2, 0.8, -0.4],
    kurz: 'Ein 70er-Wohnzimmer zum Reinsetzen: Sofa, Teppich und ein Fernseher, auf dem Tagesschau oder eine Kindersendung in Dauerschleife läuft.',
    ort: 'Vor der Stirnwand des Treppenhauses. Das Sofa steht mit dem Rücken zur Fensterfront, der Fernseher an der Wand: Das Bild wird weniger überstrahlt, und von der Straße schaut man ins Wohnzimmer.',
    punkte: ['Fernseher: ein Monitor, eingehaust mit bedruckten Forexplatten, damit er wie ein Gerät aus den 1970ern aussieht (Protokoll 2).', 'Sofa und Teppich als Neukauf über XXL Lutz, Sponsoring wird angefragt.', 'Die übrige Einrichtung kommt über Anjali Göbel. Wo sie bis März steht, ist offen.'] },
  { id: 's2', n: 2, name: 'Mero-System', color: '#74399a', make: buildMero, pos: [3.4, 7.5], rot: 0, size: [3.1, 2.35, 2.4], eye: [2.5, 1.62, 2.75], look: [0.1, 1.05, -0.2],
    kurz: 'Das Ausstellungssystem aus Knoten und Stäben trägt Texte und Exponate. Seine Farbwelt gibt die Linie für alle Grafiken vor.',
    ort: 'Frei im linken Raumteil, von beiden Fensterfronten aus zu sehen. Die Rückseite ist geschlossen, vorn öffnet sich ein Feld zum Hineingehen.',
    punkte: ['Im Modell ein Raumfachwerk im 75-cm-Raster: Kugelknoten, Stäbe, Farbtafeln, Texte, Fotos und Vitrinen. Grundfläche 3,0 × 2,25 m, bis 2,3 m hoch – eine Annahme, bis Maße und Bestand des echten Systems vorliegen.', 'Farben und Schriftart schickt Corinna Molitor ans Team. Bis dahin steht im Modell Orange und Lila aus dem Protokoll.'] },
  { id: 's3', n: 3, name: 'Selfie-Station', color: '#c2255c', make: buildSelfie, pos: [6.85, 4.15], rot: 0, size: [2.5, 2.1, 2.4], eye: [-1.5, 1.6, 3.5], look: [0.2, 1.1, -0.4],
    kurz: 'Eine Koje mit typischer 70er-Jahre-Tapete, Perücken, Kleidern und Accessoires für das Foto im Look von 1977.',
    ort: 'In der Nische zwischen Lager und Treppenhaus. Dort stehen schon zwei Wände, die gestrichen oder tapeziert werden können. Eine Stellwand trennt die Koje vom Wohnzimmer.',
    punkte: ['Idee aus Protokoll 2: Eine Dreieicher Firma streicht oder tapeziert die Koje als Sponsoring. Wer anfragt, ist offen.', 'Perücken, Kleider, Accessoires über Faschingsbedarf.', 'Tapezierte Fläche im Modell: rund 11 m².'] },
  { id: 's4', n: 4, name: 'Statistik', color: '#1c6fc4', make: buildStatistik, pos: [4.13, 4.93], rot: 0, size: [2.3, 0.5, 1.95], eye: [2.4, 1.65, 3.2], look: [0, 1.1, 0],
    kurz: 'Mitmachstation „Wie gut kennen wir Dreieich?“ mit Zahlen von 1970 und heute zum Raten und Umdrehen.',
    ort: 'Als Reihe zwischen den beiden Vierkantstützen. Die Stützenlinie trennt so den Thekenbereich vom vorderen Raum.',
    punkte: ['Im Modell als Drehwürfel auf Stelen gedacht (Frage, 1970, heute) – ein Gestaltungsvorschlag, nicht beschlossen.', 'Erst klären, ob und wie man an die Statistiken kommt.'] },
  { id: 's5', n: 5, name: 'Litfaß-Säule', color: '#2b8a3e', make: () => buildLitfass(litfassParams()), pos: [13.5, 7.7], rot: 0, size: [1.2, 1.2, 2.4], eye: [2.7, 1.6, 1.7], look: [0, 1.2, 0],
    kurz: 'Eine Litfaß-Säule mit Plakaten aus den 1970ern und Texten des Frauen- und Gleichstellungsreferats.',
    ort: 'Frei im rechten Raumteil, vom Eingang und von der Straße aus sofort zu sehen.',
    punkte: ['Wie viele DIN-A2-Plakate hochkant passen, hängt von Umfang und Höhe ab – dafür gibt es den Rechner.', 'Texte gehen bis Ende 2026 an Sascha Becker zur Gestaltung.'] },
  { id: 's6', n: 6, name: 'Gebietsreform', color: '#e67700', make: () => buildGebietsreform(state.calc.kreise), pos: [R.W, 4.5], rot: 0, size: [0.4, 9.2, 2.5], fixed: true, eye: [16.3, 1.6, 8.7], look: [19.45, 1.3, 3.4], anchor: [R.W - 0.25, 2.25, 4.5],
    kurz: 'Die lange Wand am Eingang wird orange. Darauf sitzen runde Forexplatten (Ø 50 und 60 cm) mit kurzen Texten, die jede für sich funktionieren.',
    ort: 'An der Brandmauer rechts vom Eingang, gut 9 m lang. Das ist die „lange Wand am Eingang“ aus Protokoll 2 und der erste Blickfang beim Hereinkommen.',
    punkte: ['Die Lesereihenfolge ist nicht vorgegeben, die Platten werden lebendig verteilt. So wirkt das trockene Thema lockerer.', 'Texte: Corinna Molitor. Grafik: Sascha Becker. Produktion: Vorschlag MSK. Die Wand streicht eine Dreieicher Malerfirma.', 'Die Titel auf den Platten im Modell sind Platzhalter.'] },
  { id: 's7', n: 7, name: 'Slide-Show', color: '#0b7285', make: buildStelen, pos: [11.85, 2.6], rot: 90, size: [2.8, 0.7, 1.9], eye: [0.9, 1.6, 4.4], look: [0, 1.15, 0],
    kurz: 'Bilder von 1970 bis heute von Stephan Heinsius. Ein Beamer scheidet aus, der Raum ist zu hell – deshalb Medienstelen.',
    ort: 'An der Seitenwand des Treppenhauses, quer zur Fensterfront und damit so weit wie möglich aus dem Gegenlicht. Nah an Insel 6.',
    punkte: ['Offen: ob und wann die Stadt Medienstelen bestellt.', 'Fällt die Slide-Show aus, kann hier das Thema Hessentag stehen (Protokoll 2).'] },
  { id: 's8', n: 8, name: 'Zukunft & Lieblingsplatz', color: '#9c36b5', make: buildZukunft, pos: [15.0, 0.78], rot: 0, size: [2.6, 1.5, 2.1], eye: [-1.6, 1.6, 4.4], look: [0, 1.2, -0.3],
    kurz: 'Mitmachstation: Wo ist dein Lieblingsplatz in Dreieich, und was wünschst du der Stadt für die Zukunft?',
    ort: 'An der Rückwand im rechten Raumteil, neben der Gebietsreform. Fenster und Tür zu den Nebenräumen bleiben frei.',
    punkte: ['Möglich, dass die Stadtbibliothek diese Idee schon selbst zeigt. Claudia Scheibel hakt nach.', 'Im Modell: Pinnwand mit Stadtteilen und Kartentisch – ein Vorschlag.', 'Ausweichthema für diesen Platz: Hessentag.'] },
];
const EXTRA = [
  { id: 'theke', name: 'Theke (Lage geschätzt)', color: '#5a5266', make: () => buildTheke(state.expo), pos: [2.9, 3.2], rot: 0, size: [3.3, 2.6, 0.9], off: [0, -0.95], bestand: true },
  { id: 'wand', name: 'Stellwand', color: '#5a5266', make: buildStellwand, pos: [8.12, 6.3], rot: 90, size: [2.2, 0.5, 2.05] },
  { id: 'fahne', name: 'Willkommens-Fahne', color: '#5a5266', make: buildFahne, pos: [15.3, 5.9], rot: 35, size: [1.3, 0.4, 2.4] },
];
const FIGUREN = [[18.55, 2.3, 0.9, '#8f879c'], [13.0, 3.9, -1.2, '#a59bb3'], [6.9, 4.6, 0.3, '#8f879c'], [2.3, 9.2, 2.2, '#a59bb3']];

const GRUPPEN = [...ST.map(s => ({ id: s.id, name: `${s.n} · ${s.name}`, color: s.color })), { id: 'raum', name: 'Raum & Ausstattung', color: '#5a5266' }, { id: 'prog', name: 'Programm & Titel', color: '#5a5266' }];

/* kind: todo | check (erst klären) · who leer = Zuständigkeit offen · src = Protokoll */
const TODOS = [
  { id: 't01', st: 's1', who: ['CM'], src: 'P1', text: 'Einrichtung über Anjali Göbel beziehen' },
  { id: 't02', st: 's1', who: ['CM'], src: 'P1', kind: 'check', text: 'Unterstellen der Einrichtung bis März klären: Nachfrage im Bürgerhaus, Kontakt Benjamin Halberstadt' },
  { id: 't03', st: 's1', who: ['CS', 'KL'], src: 'P1', text: 'Sofa und Teppich: Neukauf über XXL Lutz, Sponsoring anfragen' },
  { id: 't04', st: 's1', who: ['KL'], src: 'P1', kind: 'check', text: 'Rechte für Tagesschau und Kindersendung in Dauerschleife prüfen, Anfrage bei ZDF/ARD' },
  { id: 't05', st: 's1', who: ['SB'], src: 'P2', text: 'Monitor mit bedruckten Forexplatten einhausen, damit er wie ein Fernseher der 1970er aussieht' },
  { id: 't06', st: 's2', who: ['CM'], src: 'P1', text: 'Texte, Exponate und Ausstellungssystem zusammenstellen' },
  { id: 't07', st: 's2', who: ['CM'], src: 'P1', text: 'Farbwelt und Schriftart des Mero-Systems ans Team senden – alle Grafiken richten sich danach' },
  { id: 't08', st: 's3', who: ['CM'], src: 'P1', text: 'Stellwand zur Abtrennung von Insel 1 und 3 über die Bürgerhäuser organisieren' },
  { id: 't09', st: 's3', who: ['CM', 'CS'], src: 'P1 · P2', kind: 'check', text: 'Perücken, Kleider, Accessoires über Faschingsbedarf: Empfehlung von Corinna Molitor, Bestellung über Claudia Scheibel noch mit Fragezeichen' },
  { id: 't10', st: 's3', who: [], src: 'P2', text: 'Malergeschäft aus Dreieich anfragen: Koje streichen oder mit 70er-Tapete tapezieren, als Sponsoring. Wer fragt an?' },
  { id: 't11', st: 's4', who: ['KL'], src: 'P1', kind: 'check', text: 'Recherchieren, wie und ob man an die Statistiken 1970/heute kommt' },
  { id: 't12', st: 's4', who: ['CM'], src: 'P1', text: 'Themeninsel ausgestalten' },
  { id: 't13', st: 's5', who: ['CM'], src: 'P1', text: 'Litfaß-Säule stellen' },
  { id: 't14', st: 's5', who: ['CM'], src: 'P1', text: 'Größe und Umfang der Säule an die Gruppe und das Gleichstellungsreferat melden: Wie viele DIN-A2-Plakate hochkant passen?' },
  { id: 't15', st: 's5', who: ['CM'], src: 'P1', text: 'Plakate aus den 1970ern im Bürgerhaus sichten' },
  { id: 't16', st: 's5', who: ['AP'], src: 'P1', due: 'bis Ende 2026', text: 'Texte vom Frauen- und Gleichstellungsreferat an Sascha Becker zur Gestaltung geben' },
  { id: 't17', st: 's6', who: ['CM'], src: 'P1 · P2', text: 'Kurze, in sich abgeschlossene Texte zur Gebietsreform schreiben und an Claudia Scheibel schicken' },
  { id: 't18', st: 's6', who: ['CM'], src: 'P1', text: 'Ideenvorschlag zur Ausgestaltung (Stand Protokoll 2: orange Wand mit runden Forexplatten)' },
  { id: 't19', st: 's6', who: ['SB'], src: 'P1 · P2', text: 'Grafik für die runden Forexplatten, Ø 50 und 60 cm' },
  { id: 't20', st: 's6', who: ['SB'], src: 'P1 · P2', kind: 'check', text: 'Produktion klären – Vorschlag: MSK Offenthal' },
  { id: 't21', st: 's6', who: [], src: 'P2', text: 'Dreieicher Malerfirma für die orange Wand anfragen (Sponsoring)' },
  { id: 't22', st: 's7', who: ['CM'], src: 'P1', text: 'Anfrage bei Stephan Heinsius wegen der Bilder 1970 bis heute' },
  { id: 't23', st: 's7', who: ['KL'], src: 'P1', kind: 'check', text: 'Prüfen, ob und wann die Stadt Medienstelen bestellt' },
  { id: 't24', st: 's8', who: ['CS'], src: 'P1', kind: 'check', text: 'Bei der Stadtbibliothek nachhaken, ob sie die Idee Zukunft/Lieblingsplatz schon selbst übernimmt und ausstellt' },
  { id: 't25', st: 's8', who: [], src: 'P2', kind: 'check', text: 'Entscheiden: Wenn Insel 7 oder 8 nicht klappt, kommt dort das Thema Hessentag hin (nahe Insel 6)' },
  { id: 't26', st: 'raum', who: ['CS', 'KL'], src: 'P1', kind: 'check', text: 'Dürfen an den Decken Haken für Fahnen befestigt werden?', wirkt: 'Willkommens-Fahne' },
  { id: 't27', st: 'raum', who: ['CS', 'KL'], src: 'P1', kind: 'check', text: 'Dürfen die Wände gestrichen oder mit Tapete beklebt werden?', wirkt: 'orange Wand (6), Tapete in der Koje (3)' },
  { id: 't28', st: 'raum', who: ['KL'], src: 'P1', kind: 'check', text: 'Darf das Motiv Prilblume verwendet werden? Bei Henkel nachhaken' },
  { id: 't29', st: 'raum', who: [], src: 'P2', kind: 'check', text: 'Theke: Lässt sie sich mit orangener Folie bekleben? Kann die Rückseite geschlossen werden?' },
  { id: 't30', st: 'raum', who: [], src: 'P2', text: 'Orangene und lila Sitzkissen für die Fensterfront anschaffen' },
  { id: 't31', st: 'raum', who: [], src: 'P2', text: 'Willkommens-Fahne im Eingangsbereich aufhängen, damit der Raum gegliedert wird' },
  { id: 't32', st: 'prog', who: ['KL', 'CM'], src: 'P1', text: 'Begleitprogramm ausarbeiten' },
  { id: 't33', st: 'prog', who: ['KL', 'CM'], src: 'P1', text: 'Pubquiz erstellen, erste Veranstaltung beim GHV' },
  { id: 't34', st: 'prog', who: ['ALLE'], src: 'P1', kind: 'check', text: 'Titel der Ausstellung festlegen' },
];
