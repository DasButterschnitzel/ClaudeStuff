# Mwaiseni – local research memo (Dreieich / Kreis Offenbach)

Researched 27 Nov 2026. Output: `app/src/main/assets/www/data/places.js` – 62 places (office 9, learn 7,
health 6, transport 9, shop 4, community 5, faith 4, fun 8, embassy 2, help 8), each with a `source` URL.
Coordinates: OpenStreetMap/Nominatim (house or POI level unless noted).

## Key findings the product team should know
- **Everything "immigration" is in Dietzenbach, not Dreieich.** Ausländerbehörde, Führerscheinstelle and the
  Clearingstelle are all at the Kreishaus, Werner-Hilpert-Straße 1. The Ausländerbehörde works **only by
  appointment** ("Ohne Termin ist eine Vorsprache nicht möglich"): online booking via kreis-offenbach.de →
  Terminbuchung, or e-mail `terminabh@kreis-offenbach.de`. Phone 06074 8180-1347. An onboarding step
  "book your Ausländerbehörde appointment" would be valuable.
- **Clearingstelle** (same building) offers an independent second look at residence cases. **Bürgerbüro
  Dreieich** (Rathaus, Hauptstraße 45) needs an online appointment; open 1st/3rd Saturday too.
- **Free German from day one, in Dreieich itself** (city Integrationsbüro, programme Deutsch4U, AMIF-funded):
  *Mama lernt Deutsch* (women only, free childcare, no registration, Tue–Fri mornings, Hegelstr. 101) and
  *Kurs für alle* (Mon/Tue 18–20, Liebknechtstr. 171; mornings at JUZ). No certificate, not an Integrationskurs.
- **Official Integrationskurs**: vhs Kreis Offenbach at the HLL, Frankfurter Str. 160–166, Dreieich.
  Registration is in person with a level test, by phone appointment (06103 3131-1313); monthly entry possible;
  morning / afternoon / evening classes. Same building: library "Selbstlernzentrum" with free learning software.
- **RaBe Mehrgenerationenhaus** (Hegelstr. 101) is the best single "go there" place: Deutsch-Sprachcafé (Tue),
  Sprachtreff (Thu evening), open sewing meet-up, Meet & Eat, international running group. Times come from the
  Nov/Dec 2026 weekly plan (PDF changes every two months → consider linking the page, not the times).
- **Migration advice (MBE)** for Dreieich/Langen/Neu-Isenburg is run by Diakonie from the Winkelsmühle in
  Dreieichenhain – by appointment, free, aimed at adults 28+ in their first 3–5 years.
- The city's **"Wegweiser für Frauen in Dreieich"** (PDF, 2025) is an excellent official source – link it.
- **TelefonSeelsorge is German-only** (stated on its own site) – do not present it as an English line.
- **Health**: nearest ER = Asklepios Langen; the on-call doctor service (ÄBD) is in the same building, evenings
  and weekends only; 116117 first. Hilfetelefon 116 016 confirms English among its 18 languages.
- **Zambia**: Embassy Berlin (Axel-Springer-Str. 54A, Mon–Fri 9–17) has an online "Registration of Zambians"
  form and passport forms/fees; it lists an honorary consul for Hessen in Bad Camberg.
- **Maisha e.V.** (African women's self-help organisation, Frankfurt, since 1996) is the closest
  African women's community hub found; open consultation Mon–Wed and Fri.

## Could NOT verify (left out or flagged)
- **No Zambian diaspora association** in Rhein-Main or Germany could be confirmed (only German NGOs working
  *in* Zambia). Suggest asking the embassy; Facebook/WhatsApp groups could not be checked from here.
- **Afro shops / hair are the weakest category.** Nothing found in Dreieich, Langen or Neu-Isenburg. Included
  only places confirmed by two independent directory/map sources (African Bazaar, African Shop Big Mama) or a
  current review listing (Salem's Afro Hair Salon, data updated 16 Nov 2026). None has an official website;
  phone numbers are directory data. **Someone should phone or visit these three before release.**
  Leads not included: "T.K Asia Afro Super Market", Großer Biergrund 3, Offenbach (another directory shows
  "M und S Supermarkt" at that address); "Kaneshie African Shop", Moselstr. 51, Frankfurt (one source);
  "Rigbeauty", Kaiserstr. 44 (OSM shows a restaurant there now); "Afro Shop Adom" / "Afro World" (blog only).
- Honorary consul: embassy prints postcode "66520", Bad Camberg is 65520 (used); own website did not load.
- Agentur für Arbeit: Offenbach address verified; the Langen branch ("in the Rathaus building, Südliche
  Ringstraße") exists but its house number and whether it serves Dreieich were not confirmed → only in the tip.
- Train lines (S3/S4, RB61, S8/S9) are from the brief/general knowledge, not from the DB station pages.
- Churches: English at "Internationale Jesus Gemeinde Langen" is not stated on its site. No verified
  African-led, SDA, New Apostolic or UCZ congregation found (an English-speaking "International Adventist
  Community Langen" is mentioned by Friedensau University, no address). St. Leonhard Saturday Mass time unclear.
- InterNations Frankfurt (site blocked for our crawler), Hessen-Center, MyZeil: not included.
- Sprendlingen market: city bylaw (2024) says Sat 9–13; city press release (2024) says Thu 7–12:30 at Festplatz
  Breslauer Straße plus Sat 9–14 next door (used). Street-level coordinates only: market, Zimmerstr. 3 Langen.
- Isenburg-Zentrum, Hallenbad, Parkschwimmbad: opening hours deliberately omitted (seasonal / not captured).

## Maintenance notes
- Most likely to go stale: all `hours`, RaBe programme, Palmengarten price, Winkelsmühle closure dates.
- 0800 numbers and short codes (112, 116 016, 116117) are in national format – they only work in Germany.
- Count is 62 (target 35–55); easiest cuts: Clearingstelle, small library branch, minor RB61 halts.
