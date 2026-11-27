/*
 * Mwaiseni – "Zed corner" data (connection to home).
 * Researched 2026-11-27. Sources and confidence notes: /research/user-research.md
 *
 * Holiday rule grammar used below (movable dates):
 *   {m, d}                      fixed month/day
 *   {rule:"easter+N"|"easter-N"} N days after/before Easter Sunday (Western/Gregorian Easter)
 *   {rule:"first-mon", m}        first Monday of month m
 *   {rule:"first-mon+1", m}      the day after the first Monday of month m
 * Zambia only: if a public holiday falls on a Sunday, the following Monday is observed.
 */
window.DATA = window.DATA || {};
window.DATA.home = {

  // Greetings in the four biggest Zambian languages. Every phrase below was found in at least one
  // published source (see "src"). Fields that could not be verified are deliberately left out,
  // so the UI must tolerate missing keys. Kaonde, Lunda and Luvale are omitted (no reliable source found).
  greetings: [
    { lang:"Bemba", id:"bem", selfName:"Icibemba",
      welcome:"Mwaiseni", hello:"Muli shani?", howAreYou:"Muli shani?", fine:"Ndi fye bwino",
      morning:"Mwashibukeni", afternoon:"Mwabombeni", evening:"Chungulopo mukwai",
      goodNight:"Sendamenipo", thanks:"Natotela", wellDone:"Mwabombeni", goodbye:"Shalenipo",
      note:"'Mwabombeni' literally means 'you have worked' – it is both the daytime greeting to someone who is busy and a way of saying well done. Add 'mukwai' to be respectful.",
      src:["https://en.wikivoyage.org/wiki/Chibemba_phrasebook","https://kitweonline.com/?p=12336"] },

    { lang:"Nyanja", id:"nya", selfName:"Chinyanja",
      welcome:"Takulandirani", hello:"Moni", howAreYou:"Muli bwanji?", fine:"Ndili bwino",
      morning:"Mwauka bwanji?", afternoon:"Mwachoma bwanji?", evening:"Mwachoma bwanji?",
      goodNight:"Gonani bwino", thanks:"Zikomo", goodbye:"Tsalani bwino",
      note:"Town Nyanja in Lusaka differs a little from the Chichewa of the phrasebooks. 'Gonani bwino' means 'sleep well'.",
      src:["https://en.wikivoyage.org/wiki/Nyanja_phrasebook","https://kitweonline.com/?p=12336","https://web.sas.upenn.edu/chichewa"] },

    { lang:"Tonga", id:"toi", selfName:"Chitonga",
      welcome:"Mwabonwa", hello:"Mulibuti", howAreYou:"Mwapona?", fine:"Kabotu",
      morning:"Mwabuka buti?", afternoon:"Mwayusa", evening:"Kwasiya",
      thanks:"Twalumba", goodbye:"Mucaale kabotu",
      note:"Lowest-confidence set: taken from two short word lists from Southern Province. 'Kwasiya' is glossed there as 'good night'; it is the greeting used once it is dark. Please have a Tonga speaker check before release.",
      src:["http://storage.cloversites.com/globalsamaritans/documents/Tonga%20Words%20and%20Phrases.pdf","https://chrismschroeder.wordpress.com/2010/05/19/chitonga-%E2%80%93-the-language-of-zambia/"] },

    { lang:"Lozi", id:"loz", selfName:"Silozi",
      welcome:"Mu amuhezwi", hello:"Lumela", howAreYou:"Mu iketile hande?", fine:"Ni iketile hande",
      morning:"Mu zuhile", afternoon:"Mu tozi", evening:"Ki manzibuana",
      goodNight:"Ki busihu", thanks:"Ni itumezi", goodbye:"Mu siale hande",
      note:"Spelling varies between sources (Muzuhile / Mu zuhile, Mutozi / Mu tozi).",
      src:["http://www.namtranslations.iway.na/page%20nine%20common%20expressions/silozi_page9.pdf","https://www.omniglot.com/language/phrases/lozi.htm"] }
  ],

  // Zambia is on Central Africa Time (CAT, UTC+2) all year, with no daylight saving.
  // German winter (CET): Zambia is 1 hour ahead. German summer (CEST): same time.
  time: { tz:"Africa/Lusaka", utcOffsetHours:2, germanTz:"Europe/Berlin",
          note:"In the German winter Zambia is one hour ahead; in the German summer the time is the same." },

  // Zambian cities for clock/weather (all share the time zone Africa/Lusaka).
  cities: [
    { name:"Lusaka",        province:"Lusaka",        lat:-15.4167, lon:28.2833 },
    { name:"Kitwe",         province:"Copperbelt",    lat:-12.8024, lon:28.2132 },
    { name:"Ndola",         province:"Copperbelt",    lat:-12.9587, lon:28.6366 },
    { name:"Chingola",      province:"Copperbelt",    lat:-12.5290, lon:27.8838 },
    { name:"Mufulira",      province:"Copperbelt",    lat:-12.5498, lon:28.2407 },
    { name:"Luanshya",      province:"Copperbelt",    lat:-13.1367, lon:28.4166 },
    { name:"Kabwe",         province:"Central",       lat:-14.4469, lon:28.4464 },
    { name:"Kapiri Mposhi", province:"Central",       lat:-13.9715, lon:28.6699 },
    { name:"Livingstone",   province:"Southern",      lat:-17.8419, lon:25.8544 },
    { name:"Choma",         province:"Southern",      lat:-16.8065, lon:26.9531 },
    { name:"Mazabuka",      province:"Southern",      lat:-15.8560, lon:27.7480 },
    { name:"Chipata",       province:"Eastern",       lat:-13.6333, lon:32.6500 },
    { name:"Kasama",        province:"Northern",      lat:-10.2129, lon:31.1808 },
    { name:"Mbala",         province:"Northern",      lat:-8.8402,  lon:31.3659 },
    { name:"Mpika",         province:"Muchinga",      lat:-11.8343, lon:31.4529 },
    { name:"Chinsali",      province:"Muchinga",      lat:-10.5414, lon:32.0816 },
    { name:"Mansa",         province:"Luapula",       lat:-11.1996, lon:28.8943 },
    { name:"Solwezi",       province:"North-Western", lat:-12.1688, lon:26.3894 },
    { name:"Mongu",         province:"Western",       lat:-15.2484, lon:23.1274 }
  ],

  // Zambian foods and how to get the ingredients in Germany.
  // german = what to ask for / what is printed on the pack. ask/askEn = a sentence for the shop.
  foods: [
    { name:"Nshima (mealie meal)", emoji:"🍚", what:"Stiff maize porridge, the heart of every meal.",
      german:"weißes Maismehl",
      ask:"Haben Sie weißes Maismehl?", askEn:"Do you have white maize meal?",
      where:"Afro shops (many are around Frankfurt Hauptbahnhof) and African online shops. Packs seen in German shops: A.F.P. Fioretto 'White Maize Flour', Bigi Mama 'Plata White Maize', 'Posho N°1'. South African brands (Iwisa, White Star) turn up only occasionally.",
      tip:"The yellow 'Maisgrieß' or 'Polenta' in German supermarkets gives a different, grainy result. 'Harina P.A.N.' is pre-cooked maize flour for arepas – it works in an emergency but does not taste like breakfast meal. Buy the 5 kg bag; it is much cheaper per kilo." },

    { name:"Kapenta", emoji:"🐟", what:"Tiny dried fish, fried with tomato and onion.",
      german:"getrocknete kleine Fische (Dagaa / Omena / Sardellen)",
      ask:"Haben Sie getrocknete kleine Fische, zum Beispiel Dagaa oder Sardellen?", askEn:"Do you have small dried fish, for example dagaa or anchovies?",
      where:"East African and Afro shops sell the Lake Victoria cousin of kapenta as 'Dagaa', 'Omena' or 'Mukene'. Asian supermarkets sell dried anchovies ('getrocknete Sardellen', ikan bilis).",
      tip:"Real Zambian kapenta is rare in Germany. Dagaa is the closest in taste; Asian dried anchovies are saltier, so rinse them and use less salt." },

    { name:"Katapa (cassava leaves)", emoji:"🌿", what:"Pounded cassava leaves, often cooked with groundnuts.",
      german:"Maniokblätter (tiefgekühlt)",
      ask:"Haben Sie tiefgekühlte Maniokblätter?", askEn:"Do you have frozen cassava leaves?",
      where:"Freezer of Afro shops and some Asian supermarkets. The pack may say 'Feuilles de manioc', 'Saka-Saka', 'Pondu' or 'Cassava leaves'.",
      tip:"They are sold already pounded. Boil them for a long time, exactly as at home – cassava leaves must never be eaten undercooked." },

    { name:"Chibwabwa (pumpkin leaves)", emoji:"🎃", what:"Pumpkin leaves cooked with tomato, onion or groundnuts.",
      german:"Kürbisblätter",
      ask:"Haben Sie Kürbisblätter, frisch oder getrocknet?", askEn:"Do you have pumpkin leaves, fresh or dried?",
      where:"Hardly ever sold fresh. Afro shops have dried West African pumpkin leaves ('Ugu'). In summer, ask a pumpkin grower at the weekly market (Wochenmarkt) or grow pumpkins on a balcony.",
      tip:"Best everyday substitute: fresh spinach ('Blattspinat') or Swiss chard ('Mangold') from any supermarket." },

    { name:"Delele (okra)", emoji:"🥒", what:"Slippery okra relish.",
      german:"Okra / Okraschoten",
      ask:"Haben Sie frische Okraschoten?", askEn:"Do you have fresh okra?",
      where:"Turkish supermarkets (label: 'Bamya'), Asian and Afro shops; frozen okra ('TK-Okra') is also common.",
      tip:"For the soda in delele, buy 'Natron' (bicarbonate of soda) – every supermarket and the drugstore dm sells it, e.g. 'Kaiser Natron'." },

    { name:"Groundnuts (for ifisashi)", emoji:"🥜", what:"Pounded groundnuts cooked into greens.",
      german:"rohe Erdnüsse / gemahlene Erdnüsse / Erdnussmus",
      ask:"Haben Sie rohe, ungesalzene Erdnüsse?", askEn:"Do you have raw, unsalted peanuts?",
      where:"Raw peanuts: Asian, Turkish and Afro shops. Ready-ground peanut powder: Afro shops. Shortcut: 'Erdnussmus' (100 % peanuts, no sugar) from dm, Rossmann or the organic shelf.",
      tip:"Normal German peanut butter ('Erdnussbutter') often has sugar and salt added – read the label and take the one that is 100 % Erdnüsse." },

    { name:"Kalembula (sweet potato leaves)", emoji:"🍃", what:"Sweet potato leaves as a relish.",
      german:"Süßkartoffelblätter",
      ask:"Haben Sie Süßkartoffelblätter?", askEn:"Do you have sweet potato leaves?",
      where:"Sometimes fresh in bigger Asian supermarkets (Vietnamese name 'rau lang', Filipino 'camote tops').",
      tip:"If you cannot find them, water spinach ('Wasserspinat') from the Asian shop or ordinary spinach comes closest." },

    { name:"Rape / kale", emoji:"🥬", what:"Everyday green relish with nshima.",
      german:"Grünkohl / Schwarzkohl (substitute)",
      ask:"Haben Sie Grünkohl oder Schwarzkohl?", askEn:"Do you have kale or black cabbage?",
      where:"'Grünkohl' is fresh in every supermarket in winter (about November to February) and frozen all year. Turkish supermarkets sell 'Kara lahana' (black cabbage), which is very close to rape. East African shops may call it 'Sukuma wiki'.",
      tip:"Do not ask for 'Raps' – in German that is the oil plant in the fields, not a vegetable. Cut the leaves fine and fry with tomato and onion as usual." },

    { name:"Bondwe (amaranth leaves)", emoji:"🌱", what:"Soft green leaves, boiled or cooked with groundnuts.",
      german:"Amaranthblätter",
      ask:"Haben Sie Amaranthblätter?", askEn:"Do you have amaranth leaves?",
      where:"Asian supermarkets (often labelled 'Amaranth', 'Yin Choy' or 'Chinesischer Spinat'), sometimes Afro shops.",
      tip:"Spinach works as a substitute when the Asian shop has none." },

    { name:"Impwa (garden eggs)", emoji:"🍆", what:"Small, slightly bitter African eggplants.",
      german:"afrikanische Auberginen (Garden Eggs)",
      ask:"Haben Sie afrikanische Auberginen?", askEn:"Do you have African eggplants?",
      where:"Afro shops, usually next to the plantains; not every week.",
      tip:"The small round Thai eggplants in Asian supermarkets are a good stand-in." },

    { name:"Beans", emoji:"🫘", what:"Stewed beans with tomato and onion.",
      german:"getrocknete Bohnen (Wachtelbohnen / Borlotti)",
      ask:"Haben Sie getrocknete Wachtelbohnen?", askEn:"Do you have dried borlotti beans?",
      where:"Turkish supermarkets (label: 'Barbunya'), Afro shops ('Rosecoco'), and the dried-goods shelf of big supermarkets.",
      tip:"'Wachtelbohnen' / 'Borlotti' are the closest to sugar beans. 'Kidneybohnen' in tins are everywhere for a quick meal." },

    { name:"Bream (fresh fish)", emoji:"🐠", what:"Fried or stewed whole fish.",
      german:"Tilapia (ganz)",
      ask:"Haben Sie ganzen Tilapia, frisch oder tiefgekühlt?", askEn:"Do you have whole tilapia, fresh or frozen?",
      where:"Freezer of Asian and Afro shops; fish counters of large supermarkets sometimes.",
      tip:"Zambian bream belongs to the tilapia family, so ask for 'Tilapia'. The German fish called 'Brasse' is a different, very bony fish." },

    { name:"Dried and smoked fish", emoji:"🎣", what:"Dried fish cooked into a relish.",
      german:"Trockenfisch / Räucherfisch",
      ask:"Haben Sie Trockenfisch oder Räucherfisch?", askEn:"Do you have dried or smoked fish?",
      where:"Afro shops (dried tilapia, smoked catfish, stockfish) and African online shops.",
      tip:"Keep it in a sealed box or in the freezer – German flats are small and the smell travels." },

    { name:"Cassava", emoji:"🥔", what:"Boiled or roasted cassava; cassava flour for nshima.",
      german:"Maniok (also: Cassava, Yuca)",
      ask:"Haben Sie frischen Maniok?", askEn:"Do you have fresh cassava?",
      where:"Asian and Afro shops, sometimes Rewe or Edeka. Frozen peeled cassava is easier. Cassava flour is 'Maniokmehl' in Afro shops.",
      tip:"Fresh roots are waxed for transport – peel thickly and always cook through." },

    { name:"Sweet potatoes", emoji:"🍠", what:"Boiled for breakfast with tea, or roasted.",
      german:"Süßkartoffeln",
      ask:"Wo finde ich die Süßkartoffeln?", askEn:"Where do I find the sweet potatoes?",
      where:"Every supermarket (Aldi, Lidl, Rewe, Edeka) – the orange kind.",
      tip:"The white-fleshed kind you know from home is sold in Asian and Afro shops as 'weiße Süßkartoffel'." },

    { name:"Plantain", emoji:"🍌", what:"Fried or boiled cooking bananas.",
      german:"Kochbananen",
      ask:"Haben Sie Kochbananen?", askEn:"Do you have plantains?",
      where:"Afro and Asian shops, increasingly also large Rewe and Edeka stores.",
      tip:"Green ones are for boiling, yellow-black ones for sweet frying." },

    { name:"Village chicken", emoji:"🐔", what:"Firm, tasty free-range chicken, stewed slowly.",
      german:"Suppenhuhn",
      ask:"Haben Sie ein Suppenhuhn?", askEn:"Do you have a boiling hen?",
      where:"Freezer or meat counter of most supermarkets, Turkish butchers, weekly markets.",
      tip:"A 'Suppenhuhn' is an older hen with firm meat, the nearest thing to village chicken. Normal German 'Hähnchen' is very soft. Simmer it for at least 90 minutes." },

    { name:"Goat meat", emoji:"🐐", what:"Goat stew, or grilled goat.",
      german:"Ziegenfleisch",
      ask:"Haben Sie Ziegenfleisch mit Knochen?", askEn:"Do you have goat meat on the bone?",
      where:"Turkish, Arabic or halal butchers ('Metzgerei' / 'Helal Kasap') and Afro shops with a freezer. German supermarkets do not sell it.",
      tip:"If there is no goat, lamb ('Lammfleisch') is the usual substitute. It is fine to ask the butcher to cut it small: 'Bitte klein schneiden.'" },

    { name:"Boerewors and T-bone (braai)", emoji:"🥩", what:"Meat for the grill.",
      german:"grobe Bratwurst / T-Bone-Steak",
      ask:"Haben Sie T-Bone-Steaks?", askEn:"Do you have T-bone steaks?",
      where:"Butcher's counter in Rewe or Edeka, or any 'Metzgerei'. Real boerewors only comes from South African specialist shops online.",
      tip:"For a boerewors feeling, ask for 'grobe Bratwurst' (coarse sausage). A braai is called 'Grillen' here; many parks have marked barbecue areas ('Grillplatz')." },

    { name:"Vitumbuwa (fritters)", emoji:"🍩", what:"Fried dough balls for tea time.",
      german:"Weizenmehl (Type 405), Zucker, Trockenhefe oder Backpulver, Sonnenblumenöl",
      ask:"Wo finde ich Mehl und Trockenhefe?", askEn:"Where do I find flour and dried yeast?",
      where:"Every supermarket. Flour for baking is 'Weizenmehl Type 405'.",
      tip:"The German cousins are 'Quarkbällchen' and 'Krapfen' – try them at any bakery when you miss vitumbuwa." },

    { name:"Maheu / Munkoyo", emoji:"🥤", what:"Sweet-sour maize drink.",
      german:"Maisgetränk (Mageu / Mahewu); as a substitute: Malzbier",
      ask:"Haben Sie Mageu oder Mahewu?", askEn:"Do you have mageu or mahewu?",
      where:"Bottled mageu is rare – only occasionally in South African specialist shops. Munkoyo roots are not sold in Germany.",
      tip:"Maheu is easy to make from thin mealie-meal porridge, sugar and a spoon of flour, left warm overnight. For a quick malty taste, try alcohol-free 'Malzbier' (for example Vitamalz) from any supermarket." },

    { name:"Rooibos tea", emoji:"🍵", what:"Red bush tea.",
      german:"Rooibostee / Rotbuschtee",
      ask:"Wo finde ich Rooibostee?", askEn:"Where do I find rooibos tea?",
      where:"Every supermarket and drugstore (dm, Rossmann).",
      tip:"Germans drink it without milk, often flavoured with vanilla – check that the pack says 'pur' or 'natur' if you want it plain." },

    { name:"Lager like Mosi", emoji:"🍺", what:"A light, mild lager.",
      german:"Helles",
      ask:"Ein Helles, bitte.", askEn:"A light lager, please.",
      where:"Every supermarket, kiosk and restaurant.",
      tip:"'Helles' is mild like Mosi. 'Pils' is noticeably more bitter. 'Alkoholfrei' means alcohol-free; bottles carry a deposit ('Pfand') that you get back at the supermarket machine." }
  ],

  // Where to shop. "listed" = found in business directories in 2026, stock NOT checked – phone before a long trip.
  // "verified" = product pages checked online on 2026-11-27.
  shops: [
    { name:"Afro shops around Frankfurt Hauptbahnhof", area:"Frankfurt Bahnhofsviertel", status:"listed",
      note:"From Dreieich-Buchschlag the S3/S4 goes straight to Frankfurt Hbf. Shops listed in directories include African Basar (Düsseldorfer Str. 22), African Bazaar (Mainzer Landstr. 107) and Kaneshie African Shop (Moselstr. 51). Hair products and braiding salons are in the same streets." },
    { name:"Zuri Foods (online, East African)", url:"https://zurifoods.de/en", status:"verified",
      note:"Delivers within Germany. Seen in the shop: white maize flour, dagaa and omena (kapenta substitutes), peanut powder, dried pumpkin leaves, rosecoco beans, dried tilapia." },
    { name:"AfricShopping (online)", url:"https://www.africshopping.com/en/", status:"verified",
      note:"German online Afro shop; sells 5 kg white maize flour." },
    { name:"Turkish supermarkets", area:"Dreieich, Langen, Neu-Isenburg, Offenbach", status:"general",
      note:"Good for okra, black cabbage, borlotti beans, goat and lamb, and cheap fresh vegetables." },
    { name:"Asian supermarkets", area:"Frankfurt, Offenbach", status:"general",
      note:"Good for cassava, plantain, amaranth and sweet potato leaves, tilapia, dried anchovies, raw peanuts." }
  ],

  // Useful links. Checked 2026-11-27. "ok:true" = answered our automated check;
  // "ok:false" = the site blocks automated checks or could not be reached from our build network – open once by hand before release.
  links: [
    // --- Embassy and consular help
    { title:"Embassy of Zambia in Berlin", url:"https://www.zambiaembassy.de/", kind:"embassy", ok:true,
      note:"Axel-Springer-Str. 54A, 10117 Berlin. Tel +49 30 2062940. Mon–Fri 9:00–17:00. Also covers Austria, Czechia, Hungary, Poland, Slovakia and Slovenia." },
    { title:"Zambian passport: new, renewal, lost", url:"https://www.zambiaembassy.de/passport-and-travel/", kind:"embassy", ok:true,
      note:"Forms A and N, two biometric photos, copies of NRC, birth certificate and marriage certificate. Ask the embassy for the bar-code form." },
    { title:"Register with the embassy as a Zambian in Germany", url:"https://www.zambiaembassy.de/registration-of-zambians/", kind:"embassy", ok:true,
      note:"So the embassy can reach you and invite you to community events such as Independence Day." },
    { title:"Honorary consuls of Zambia (one is in Hessen, Bad Camberg)", url:"https://www.zambiaembassy.de/honorary-consuls/", kind:"embassy", ok:true,
      note:"The honorary consul for Hessen is about an hour from Dreieich. Call first – honorary consuls cannot issue passports." },
    { title:"German Embassy Lusaka", url:"https://lusaka.diplo.de/zm-en", kind:"embassy", ok:true,
      note:"Visa information for family who want to visit you in Germany." },

    // --- News from home
    { title:"Lusaka Times", url:"https://www.lusakatimes.com/", kind:"news", ok:false, note:"Daily Zambian news." },
    { title:"Zambia Daily Mail", url:"https://www.daily-mail.co.zm/", kind:"news", ok:true, note:"State-owned daily newspaper." },
    { title:"Times of Zambia", url:"https://www.times.co.zm/", kind:"news", ok:true, note:"National daily newspaper." },
    { title:"Mwebantu", url:"https://www.mwebantu.com/", kind:"news", ok:true, note:"Breaking news and entertainment." },
    { title:"News Diggers", url:"https://diggers.news/", kind:"news", ok:true, note:"Independent investigative newspaper." },
    { title:"ZNBC (national broadcaster)", url:"https://znbc.co.zm/", kind:"news", ok:false, note:"News and programme information from ZNBC TV and radio." },

    // --- Radio from home (station pages, not raw streams)
    { title:"All Zambian radio stations (Streema)", url:"https://streema.com/radios/country/Zambia", kind:"radio", ok:true, note:"Pick a station by town – Lusaka, Kitwe, Ndola, Chipata, Mongu and more." },
    { title:"ZNBC Radio 2", url:"https://streema.com/radios/Radio_2_ZNBC", kind:"radio", ok:true, note:"National English-language station." },
    { title:"Hot FM 87.7 Lusaka", url:"https://onlineradiobox.com/zm/hot/", kind:"radio", ok:true, note:"Music, talk and the breakfast show." },
    { title:"Radio Phoenix 89.5 Lusaka", url:"https://onlineradiobox.com/zm/phoenix/", kind:"radio", ok:true, note:"Zambia's first independent commercial station." },
    { title:"Q FM Zambia", url:"https://onlineradiobox.com/zm/qzambia/", kind:"radio", ok:true, note:"News and music from Lusaka." },
    { title:"Breeze FM Chipata", url:"https://onlineradiobox.com/zm/breeze/", kind:"radio", ok:true, note:"Eastern Province, much of it in Nyanja." },

    // --- Community and support
    { title:"Verband binationaler Familien und Partnerschaften", url:"https://www.verband-binationaler.de/", kind:"community", ok:true,
      note:"Association for couples and families from two countries; head office in Frankfurt. Advice on residence, marriage and family life." },
    { title:"Maisha e.V. – African women in Germany", url:"https://www.maisha.org/", kind:"community", ok:false,
      note:"Self-help organisation of African women in Frankfurt: health, counselling, meeting other women." },
    { title:"beramí – work and training for migrant women", url:"https://www.berami.de/", kind:"community", ok:true,
      note:"Frankfurt. Career advice, mentoring and help with getting foreign qualifications recognised." },
    { title:"infrau e.V. – intercultural women's centre", url:"https://www.infrau.de/", kind:"community", ok:true,
      note:"Frankfurt. Counselling and courses for migrant women." },
    { title:"FIM – Frauenrecht ist Menschenrecht", url:"https://fim-frauenrecht.de/", kind:"community", ok:true,
      note:"Frankfurt. Confidential counselling for migrant women in many languages." },
    { title:"ADiBe – anti-discrimination counselling Hessen", url:"https://adibe-hessen.de/", kind:"community", ok:true,
      note:"Free, confidential advice if you are treated unfairly because of skin colour or origin." },
    { title:"mbeon – chat with a migration adviser", url:"https://www.mbeon.de/en/", kind:"community", ok:true,
      note:"Free app: write to a professional migration adviser in English and get an answer by chat." },

    // --- Sending money home (all checked for Germany → Zambia)
    { title:"Remitly", url:"https://www.remitly.com/de/en/money-transfer/send-money-to-zambia", kind:"money", ok:true,
      note:"EUR to ZMW. Pays out to MTN Mobile Money, Airtel Money, Zamtel and bank accounts." },
    { title:"WorldRemit", url:"https://www.worldremit.com/en/zambia/mobile-money", kind:"money", ok:true,
      note:"To MTN and Airtel wallets in kwacha. Limits per transfer apply (about ZMW 12,000 MTN, ZMW 10,000 Airtel)." },
    { title:"Sendwave", url:"https://www.sendwave.com/en/countries", kind:"money", ok:true,
      note:"App-only. Lists Zambia as a destination from Germany." },
    { title:"Taptap Send", url:"https://www.taptapsend.com/en", kind:"money", ok:true,
      note:"App-only. Germany and Zambia are both on its country list – check the app for the current payout options." },
    { title:"Western Union", url:"https://www.westernunion.com/de/en/send-money-to-zambia.html", kind:"money", ok:true,
      note:"Cash pick-up in Zambia; you can also pay in cash at agents in Germany." },
    { title:"Wise", url:"https://wise.com/de/send-money/send-money-to-zambia", kind:"money", ok:true,
      note:"Shows the real exchange rate and the fee before you send." },
    { title:"Compare fees and rates (Monito)", url:"https://www.monito.com/send-money/germany/zambia/eur/zmw", kind:"money", ok:true,
      note:"Independent comparison for Germany → Zambia. Fees and rates change daily." },

    // --- Official information in English
    { title:"Make it in Germany: joining your German spouse", url:"https://www.make-it-in-germany.com/en/visa-residence/family-reunification/spouses-joining-german-citizens", kind:"gov", ok:true,
      note:"Official federal portal. Use this page if your husband is a German citizen." },
    { title:"Make it in Germany: joining a non-EU spouse", url:"https://www.make-it-in-germany.com/en/visa-residence/family-reunification/spouses-joining-non-eu-citizens", kind:"gov", ok:true,
      note:"Use this page if your husband is not a German or EU citizen." },
    { title:"BAMF: integration courses", url:"https://www.bamf.de/EN/Themen/Integration/ZugewanderteTeilnehmende/Integrationskurse/integrationskurse-node.html", kind:"gov", ok:true,
      note:"Who may and who must attend, what it costs, the final tests." },
    { title:"BAMF-NAvI: find a course or adviser near you", url:"https://bamf-navi.bamf.de/en/", kind:"gov", ok:true,
      note:"Map search for integration courses and migration advice centres. Enter 63303 Dreieich." },
    { title:"Handbook Germany", url:"https://handbookgermany.de/en", kind:"gov", ok:true,
      note:"Everyday life explained in plain English: health insurance, housing, work, rights." },
    { title:"Handbook Germany: driving licence", url:"https://handbookgermany.de/en/driving-licence", kind:"gov", ok:true,
      note:"A Zambian licence is valid for only 6 months after you move here." },
    { title:"Recognition in Germany", url:"https://www.anerkennung-in-deutschland.de/html/en/index.php", kind:"gov", ok:true,
      note:"Find out how to get your Zambian school, college or professional qualification recognised." },
    { title:"Kreis Offenbach: Ausländerbehörde (immigration office)", url:"https://www.kreis-offenbach.de/Service/%C3%84mter/Ausl%C3%A4nderbeh%C3%B6rde/", kind:"gov", ok:true,
      note:"Your immigration office is in Dietzenbach (Werner-Hilpert-Str. 1), not in Dreieich. German-language page." },
    { title:"Kreis Offenbach: migration advice", url:"https://www.kreis-offenbach.de/Themen/Migration-Integration-International/Migration/Migrationsberatung/", kind:"gov", ok:true,
      note:"Free, confidential advice for adult newcomers (MBE). German-language page." },
    { title:"Stadt Dreieich", url:"https://www.dreieich.de/", kind:"gov", ok:true,
      note:"Town hall services. The town's integration office: integration@dreieich.de." },
    { title:"Women's helpline 116 016", url:"https://www.hilfetelefon.de/en/", kind:"gov", ok:true,
      note:"Free, anonymous, day and night, also in English. For any woman who feels unsafe or controlled." },
    { title:"116 117 – doctor on call", url:"https://www.116117.de/en/index.php", kind:"gov", ok:true,
      note:"Medical help at night and weekends when it is not an emergency. Emergencies: call 112." },

    // --- Learn German for free
    { title:"DW Nicos Weg (A1 to B1)", url:"https://learngerman.dw.com/en/nicos-weg/c-36519789", kind:"learn", ok:true,
      note:"Free video course with English explanations. Start with A1." },
    { title:"VHS-Lernportal", url:"https://www.vhs-lernportal.de/", kind:"learn", ok:true,
      note:"Free online courses A1–B2 that follow the integration course, with a real tutor." },
    { title:"Goethe-Institut: Mein Weg nach Deutschland", url:"https://www.goethe.de/prj/mwd/en/index.html", kind:"learn", ok:false,
      note:"Practice German for everyday situations, with videos and exercises." },
    { title:"DW: Langsam gesprochene Nachrichten", url:"https://learngerman.dw.com/en/langsam-gesprochene-nachrichten/s-60040332", kind:"learn", ok:true,
      note:"The news read slowly, with text. Better from A2 onwards." },
    { title:"vhs Dreieich / vhs Kreis Offenbach", url:"https://www.vhs-kreis-offenbach.de/vhs-dreieich/startseite-vhs-dreieich", kind:"learn", ok:true,
      note:"Your local adult education centre: German and integration courses in Dreieich." },
    { title:"'Leben in Deutschland' practice test (BAMF)", url:"https://oet.bamf.de/", kind:"learn", ok:true,
      note:"Official online question catalogue for the orientation course and naturalisation test." }
  ],

  // Public holidays in Zambia.
  holidaysZM: [
    { m:1,  d:1,  name:"New Year's Day" },
    { m:3,  d:8,  name:"International Women's Day" },
    { m:3,  d:12, name:"Youth Day" },
    { rule:"easter-2", name:"Good Friday" },
    { rule:"easter-1", name:"Holy Saturday" },
    { rule:"easter+0", name:"Easter Sunday" },
    { rule:"easter+1", name:"Easter Monday" },
    { m:4,  d:28, name:"Kenneth Kaunda Day" },
    { m:5,  d:1,  name:"Labour Day" },
    { m:5,  d:25, name:"Africa Freedom Day" },
    { rule:"first-mon",   m:7, name:"Heroes' Day" },
    { rule:"first-mon+1", m:7, name:"Unity Day" },
    { rule:"first-mon",   m:8, name:"Farmers' Day" },
    { m:10, d:24, name:"Independence Day" },
    { m:12, d:25, name:"Christmas Day" },
    { m:12, d:29, name:"National Day of Prayer and Christian Heritage", since:2026,
      note:"New in 2026. It replaces the National Day of Prayer on 18 October, which is no longer a public holiday." }
  ],

  // Traditional ceremonies (not public holidays; exact dates are announced each year, so only the month is given).
  ceremoniesZM: [
    { name:"N'cwala",             people:"Ngoni",  where:"Mutenguleni, near Chipata",    month:2 },
    { name:"Kuomboka",            people:"Lozi",   where:"Lealui to Limulunga, Mongu",   month:4 },
    { name:"Lwiindi Gonde",       people:"Tonga",  where:"Monze",                         month:7 },
    { name:"Umutomboko",          people:"Lunda",  where:"Mwansabombwe, Luapula",        month:7 },
    { name:"Ukusefya pa Ng'wena", people:"Bemba",  where:"Mungwi, near Kasama",          month:8 },
    { name:"Kulamba",             people:"Chewa",  where:"Katete",                        month:8 },
    { name:"Likumbi Lya Mize",    people:"Luvale", where:"Zambezi",                       month:8 }
  ],

  // Statutory public holidays in Hessen, Germany. Shops, offices and most doctors are closed.
  holidaysDE: [
    { m:1,  d:1,  name:"Neujahr", en:"New Year's Day" },
    { rule:"easter-2",  name:"Karfreitag", en:"Good Friday" },
    { rule:"easter+1",  name:"Ostermontag", en:"Easter Monday" },
    { m:5,  d:1,  name:"Tag der Arbeit", en:"Labour Day" },
    { rule:"easter+39", name:"Christi Himmelfahrt", en:"Ascension Day" },
    { rule:"easter+50", name:"Pfingstmontag", en:"Whit Monday" },
    { rule:"easter+60", name:"Fronleichnam", en:"Corpus Christi" },
    { m:10, d:3,  name:"Tag der Deutschen Einheit", en:"German Unity Day" },
    { m:12, d:25, name:"1. Weihnachtstag", en:"Christmas Day" },
    { m:12, d:26, name:"2. Weihnachtstag", en:"Second Day of Christmas" }
  ],

  // Not public holidays, but days when shops close early (around 14:00) – worth a reminder to shop the day before.
  shopClosingDE: [
    { m:12, d:24, name:"Heiligabend", en:"Christmas Eve" },
    { m:12, d:31, name:"Silvester", en:"New Year's Eve" }
  ]
};
