# Mwaiseni – food research memo (28 Nov 2026)
Output: `data/foods.js` – 89 entries (greens 16, staples 11, beans 7, fish & meat 18, fruit 9, baking 18, drinks 10), each with sources.
`data/places_food.js` – 5 food shops, each confirmed by at least two independent sources.

## 10 most useful / surprising mappings
1. **Rape → Yu Choy / Choy Sum (油菜 / 菜心)** in Asia shops. Backups: Pak Choi, or Grünkohl in winter. Avoid Chinakohl, which is too watery.
2. **Zambian "spinach" = Mangold** (Swiss chard), Turkish *pazı*. German *Spinat* is a different plant.
3. **Breakfast meal = "Weißes Maismehl"**: REWE lists *Natura Weißes Maismehl* online; Birlin-Mühle sells white cornmeal for injera; also Afro shops. Traps: yellow Maismehl/Polenta/Maisgrieß, and *Maisstärke* (Mondamin), which is cornstarch.
4. **Raw groundnuts → Indian shops' "Red/Pink peanuts"** (TRS pack: "not roasted and unsalted, with skin"). *Erdnussmus 100 %* is the quick way to make ifisashi.
5. **Kapenta → ikan bilis 江鱼仔 / cá cơm khô / myeolchi 멸치.** Afro shops' *dagaa/omena* is a different Lake Victoria fish (more bitter).
6. **Sugar beans → Turkish *barbunya*** (borlotti type). Cowpeas → *börülce* (Turkish) / *lobiya* (Hindi).
7. **Impwa → Thai eggplant มะเขือเปราะ (makhuea pro)**, or "garden eggs" in Afro shops.
8. **Kalembula → frozen "Sweet Potato Leaves"** (Kakande Fresh, Afro shops / Mama T). Fresh pumpkin leaves are not sold; West African *ugu* is the closest.
9. **Tripe → *Kutteln* / *işkembe*.** *Pansen* is mostly sold as dog food. Dried chicken feet in pet shops are dog chews.
10. **German label traps:** *Essigessenz* is 25 % acid, so buy *Tafelessig* (5 %). *Soda* in drugstores is washing soda, so ask for *Natron*. There is no self-raising flour: mix 500 g Type 405 with 1 Päckchen Backpulver.
Also: green mealies → waxy corn 糯玉米. Village chicken → *Suppenhuhn* (old laying hen) or "hard/strong chicken" in Afro shops. Russians → *Krakauer* (one source says Zambians call them "Hungarians"). Jamoona (Indian online shop, warehouse in Biebesheim, Hessen) sells fresh sugarcane, guava, shakarkandi, bhindi, lobiya and soya chunks.

## Could not verify / honest gaps
- **Bemba/Nyanja names:** we could not access a Bemba or Nyanja dictionary online (the archive.org copies are lending-only). The `local` field is filled only from Ng'uni & Mwila 2007 (AJFAND, Nyanja): *bondwe* (amaranth), *delele* (okra), *chiwawa* (pumpkin; the paper spells the language "Njanja"). Other words (chibwabwa, kalembula, katapa, impwa, lumanda, ntoyo, ifinkubala, tute) appear only in `zm`, as Zambian usage, with no language label. **No Bemba name is verified** – a native speaker should review.
- **Lumanda:** sources disagree on the plant (*H. sabdariffa* or *H. acetosella*). For gongura we found only the pickle (Jamoona), no fresh or frozen leaves in Germany.
- **Buka buka:** sources disagree (Nile perch or dried bream), so the entry is written as "dried fish".
- **Not available in Germany:** masuku, chikanda, munkoyo roots, blackjack, cowpea leaves, fresh pumpkin leaves, sweet reed, whole bambara nuts. Mopane worms are not on the EU novel-food list. We found no Mazoe, Five Roses or *köy tavuğu* in German shops.
- Stock in Asia, Turkish and Indian shops (yu choy, sweet potato leaves, waxy corn, goguma, gizzards, goat) is what these shops typically carry. We did **not** confirm it for any one local store, so the app says "ask".
- REWE, knuspr and eBay block our crawler. Their pages (REWE white maize meal, lexikon pages) were confirmed through search results, not by loading the page.

## Verified food shops (in places_food.js)
| Shop | Address | Sources |
|---|---|---|
| Asia Mekong Tran Thanh (Asian, 2 floors) | Luisenstr. 71–73, 63067 Offenbach | https://www.offenbach.de/verzeichnisse/forumEinzelhandel/asiatischer-supermarkt-mekong-tran-thanh.php?loc=en + Gelbe Seiten + OSM |
| Hayatmarkt (Turkish/Mediterranean) | Starkenburgring 71, 63069 Offenbach | https://hayatmarkt.de/ + OSM + Wolt |
| Internationale Lebensmittel (Turkish grocery) | Frankfurter Str. 106, 63303 Dreieich | https://www.gelbeseiten.de/suche/lebensmittel/dreieich + OSM ("Türkische Lebensmittel") |
| NA Desi Shop (South Asian) | Wilhelm-Leuschner-Str. 71, 63263 Neu-Isenburg | https://www.gelbeseiten.de/suche/lebensmittel/neu-isenburg + OSM |
| Mix Markt (Eastern European) | Richard-Wagner-Str. 32, 63069 Offenbach | https://www.mixmarkt.eu/de/germany/maerkte/36/ + OSM + Gelbe Seiten |

**Leads with one source only (NOT in the app; please visit or phone):** *Yang Asia Markt*, Frankfurter Str. 37, Dreieich-Sprendlingen (only on OSM, +49 6103 9954088) – the only Asia shop in Dreieich itself. *Asiamarkt*, Werner-Hilpert-Str. 20, Dietzenbach (Gelbe Seiten) – on the same street as the Kreishaus/Ausländerbehörde. *Asiasupermarkt Kim* and *Pak Asia Food*, Odenwaldring 86, Offenbach (Gelbe Seiten). Langen: *Yayla-Markt*, Bahnstr. 120 (Gelbe Seiten); "Asia Food Market", Bahnstraße (OSM, but its website domain is for sale – it may have closed). *Ayada*, Taunusstr. 30, Offenbach, is in the city directory, but OSM now shows "Herat Basar" at that address. *T.K Asia Afro Super Market*, Großer Biergrund 3 – sources conflict.
**Bigger options in Frankfurt (Gelbe Seiten):** go asia (Zeil 90; Kaiserstraße 6), Yuan Fa Asia Markt (Fahrgasse 90).
**Online:** Mama T (Hamburg Afro marketplace, delivers in Germany; frozen goods need a minimum order), Jamoona (Indian; frozen goods ship only within Germany), Birlin-Mühle (white cornmeal), Der Holzapfel and Bernds Biltongbude on eBay (boerewors), mexicomiamor.de (hominy as a samp substitute).
