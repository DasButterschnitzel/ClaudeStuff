#!/usr/bin/env node
// Bewertet ein Layout: erst die harte Prüfung (layout-check), dann Besucherfluss und Sicht.
// Aufruf: node layout-score.mjs layout.json     (oder JSON direkt als Argument)
// Eingabe: { "rundgang": ["s6", …alle acht…], "pos": { "s2": {"x":…,"z":…,"r":…}, "s3": …, "s4": …, "s5": …, "s7": …, "s8": …, "fahne": … } }
// Ausgabe: Fehler und Warnungen der Prüfung, dazu Kennzahlen:
//   gesamtwert        0–100, grobe Sammelzahl (Sicht 32 %, wenig Doppelwege 20 %, Straße 15 %, wenig tote Fläche 13 %, Engstellen 10 %, Eingang 10 %)
//   rundgang_m        Länge des Rundgangs ab Tür und zurück
//   doppelwegAnteil   Anteil des Wegs, der zweimal gelaufen wird (Gegenverkehr, Sackgassen)
//   abseitsAnteil     Anteil der freien Fläche, die mehr als 3 m vom Rundgang entfernt liegt
//   mittlereSicht     wie oft man eine Insel im Mittel unterwegs sieht (0–1)
//   engstellen        Stellen auf dem Rundgang mit weniger als 1,20 m Breite
//   je Insel          sichtAnteil, erstkontakt_m (ab wann man sie sieht), vomEingang, ovale (durch wie viele Schaufenster-Ovale sichtbar),
//                     blick (0–1: wie stark die Besucherseite im Blick liegt, gewichtet nach Aufenthalt, Winkel und Entfernung)
//   waende            jede Wand mit mittlerem Blick (0–1); insel = null heißt: gehört zu keiner Insel, also freie Fläche für Leitsystem oder Vorboten
import { readFileSync, existsSync } from 'node:fs';
import { check } from './layout-check.mjs';
import { analyse } from '../src/js/00-analyse.js';

const a = process.argv[2];
if (!a) { console.error('Aufruf: node layout-score.mjs layout.json'); process.exit(2); }
const layout = JSON.parse(existsSync(a) ? readFileSync(a, 'utf8') : a);
const pruefung = check(layout), an = analyse(layout, { ohneSichtkarte: true, blick: true });
if (!pruefung.ok) an.kennzahlen.gesamtwert = 0;
console.log(JSON.stringify({ pruefung, kennzahlen: an.kennzahlen, inseln: an.inseln, waende: an.waende, halte: an.halte }, null, 1));
process.exit(pruefung.ok ? 0 : 1);
