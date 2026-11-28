// Mwaiseni – "Food finder": Zambian ingredients and what they are called in shops around Frankfurt / Dreieich.
// Researched 28 Nov 2026. Each entry lists its sources. Shop stock changes: "often" / "sometimes" / "ask" are deliberate.
// Local-language names (field `local`) are only given where an academic source names the language.
window.DATA = window.DATA || {};
window.DATA.foodCats = [
  { id: "greens", title: "Greens & relish", emoji: "🥬" },
  { id: "staples", title: "Nshima & staples", emoji: "🌽" },
  { id: "beans", title: "Beans & nuts", emoji: "🥜" },
  { id: "fish", title: "Fish & meat", emoji: "🐟" },
  { id: "fruit", title: "Fruit", emoji: "🥭" },
  { id: "baking", title: "Baking & cooking", emoji: "🧂" },
  { id: "drinks", title: "Drinks & snacks", emoji: "🥤" }
];
window.DATA.foodFinder = [

  // ───────────────────────── GREENS & RELISH ─────────────────────────
  {
    id: "spinach",
    cat: "greens",
    emoji: "🥬",
    zm: "Spinach",
    what: "What Zambians call ‘spinach’ is Swiss chard: big shiny leaves with thick white, red or yellow stalks. It is a different plant from German Spinat.",
    de: "Mangold",
    deAlt: ["Blattmangold", "Stielmangold", "Bunter Mangold"],
    shops: [
      { shop: "market", label: "Mangold", note: "Weekly markets, late spring to autumn – loose or in bunches." },
      { shop: "supermarket", label: "Mangold", note: "REWE, Edeka and Kaufland sometimes, mostly in summer and autumn. Not always in stock." },
      { shop: "turkish", label: "Pazı", note: "Turkish name. Turkish greengrocers sometimes have it." },
      { shop: "bio", label: "Mangold", note: "Organic shops (e.g. denn's) often carry it in season." }
    ],
    tip: "Real spinach (Spinat) has small soft leaves and shrinks to almost nothing. For your Zambian ‘spinach’ relish buy Mangold. Cut the thick stalks small and cook them a few minutes longer than the leaves. If there is no Mangold, frozen Blattspinat is the easy backup.",
    ask: "Haben Sie Mangold?",
    askEn: "Do you have Swiss chard?",
    sources: ["https://www.farmersweekly.co.za/crops/vegetables/what-is-spinach/", "https://en.wikipedia.org/wiki/Chard", "https://de.wikipedia.org/wiki/Mangold", "https://tr.wikipedia.org/wiki/Pazı"]
  },
  {
    id: "rape",
    cat: "greens",
    emoji: "🥬",
    zm: "Rape",
    what: "Rape is a leafy green of the cabbage family (Brassica napus) with long dark leaves and a slightly bitter taste. It is the most eaten vegetable in Lusaka. The leaves are not sold in Germany, but Asian ‘yu choy’ is a very close relative.",
    de: "Choy Sum",
    deAlt: ["Yu Choy", "Pak Choi", "Grünkohl"],
    shops: [
      { shop: "asian", label: "Yu Choy / Choy Sum", script: "油菜 / 菜心", roman: "yóucài / Cantonese: choy sum", note: "Fresh bunches in the vegetable fridge of bigger Asia shops. Same plant family, tender leaves – the closest to rape." },
      { shop: "asian", label: "Phak kwangtung", note: "Name on Thai packs for the same vegetable." },
      { shop: "supermarket", label: "Pak Choi", note: "Often at REWE, Edeka, Kaufland. Softer and juicier, but works well in a relish." },
      { shop: "supermarket", label: "Grünkohl", note: "Winter only (about November–February). Tougher, cook longer – the taste is close to rape." }
    ],
    tip: "Cook yu choy like rape: wash, cut thin, fry onion and tomato, add the greens for a few minutes. Avoid Chinakohl for this – it is too watery. If you show the characters 油菜 in the Asia shop, staff will understand.",
    ask: "Haben Sie Choy Sum oder Yu Choy?",
    askEn: "Do you have choy sum or yu choy?",
    sources: ["https://link.springer.com/article/10.1007/s12571-025-01567-z", "https://en.wikipedia.org/wiki/Choy_sum", "https://www.rewe.de/lexikon/pak-choi/"]
  },
  {
    id: "chinese-cabbage",
    cat: "greens",
    emoji: "🥬",
    zm: "Chinese cabbage",
    what: "Germany has two kinds: Chinakohl (napa cabbage, a long pale head) and Pak Choi (loose dark leaves with white stalks). If your Chinese cabbage at home was sold in bunches like rape, buy Pak Choi. If it was a head, buy Chinakohl.",
    de: "Chinakohl",
    deAlt: ["Pak Choi"],
    shops: [
      { shop: "supermarket", label: "Chinakohl", note: "All year in almost every supermarket, also Aldi and Lidl." },
      { shop: "supermarket", label: "Pak Choi", note: "Often at REWE, Edeka, Kaufland; sometimes Aldi and Lidl." },
      { shop: "asian", label: "Napa cabbage", script: "大白菜", roman: "dà báicài", note: "Big heads, often cheaper than in the supermarket." },
      { shop: "asian", label: "Cải thảo", note: "Vietnamese name for napa cabbage." },
      { shop: "asian", label: "Bok choy / Pak choi", script: "小白菜 / 白菜", roman: "xiǎo báicài / Cantonese: bok choy", note: "Small and baby pak choi in bags." }
    ],
    tip: "Chinakohl cooks very fast and gives a lot of water: fry it with onion and tomato on high heat and do not add water.",
    ask: "Haben Sie Chinakohl oder Pak Choi?",
    askEn: "Do you have napa cabbage or pak choi?",
    sources: ["https://en.wikipedia.org/wiki/Napa_cabbage", "https://en.wikipedia.org/wiki/Bok_choy", "https://de.wikipedia.org/wiki/Chinakohl", "https://www.rewe.de/lexikon/pak-choi/"]
  },
  {
    id: "cabbage",
    cat: "greens",
    emoji: "🥬",
    zm: "Cabbage",
    what: "Round white-green head cabbage – the same as at home.",
    de: "Weißkohl",
    deAlt: ["Weißkraut", "Spitzkohl", "Kohl"],
    shops: [
      { shop: "supermarket", label: "Weißkohl", note: "All year everywhere, whole heads or halves." },
      { shop: "market", label: "Weißkohl / Spitzkohl", note: "Local cabbage from autumn to spring." },
      { shop: "turkish", label: "Lahana", note: "Turkish name; big heads, often cheap." }
    ],
    tip: "In Hessen people say Weißkohl or Weißkraut. Spitzkohl (pointed cabbage) is softer and cooks faster – great for a quick cabbage relish. Rotkohl is red cabbage.",
    ask: "Wo finde ich Weißkohl?",
    askEn: "Where can I find white cabbage?",
    sources: ["https://de.wikipedia.org/wiki/Weißkohl"]
  },
  {
    id: "pumpkin-leaves",
    cat: "greens",
    emoji: "🍃",
    zm: "Pumpkin leaves (chibwabwa)",
    local: [{ lang: "Nyanja", w: "Chiwawa" }],
    what: "Young leaves and tender stems of the pumpkin plant, peeled and cooked as relish, often with groundnut powder.",
    de: "Kürbisblätter",
    shops: [
      { shop: "african", label: "Ugu leaves", note: "Leaves of the West African fluted pumpkin – a different plant but cooked in a very similar way. Fresh or frozen in Nigerian-run Afro shops." },
      { shop: "online", label: "Frische Ugu Leaves", note: "Mama T (Hamburg online Afro shop) lists fresh ugu leaves and delivers in Germany." }
    ],
    tip: "Fresh pumpkin leaves are almost never sold in German shops. Best options: ugu from an Afro shop, frozen sweet potato leaves, or spinach. If you have a garden or balcony, plant a pumpkin (seedlings in garden centres in May) and pick the young leaves.",
    ask: "Haben Sie Ugu-Blätter oder Kürbisblätter?",
    askEn: "Do you have ugu leaves or pumpkin leaves?",
    sources: ["https://en.wikipedia.org/wiki/Zambian_cuisine", "https://ajfand.net/Volume7/No4/Ng'uni-IPGRI2-2.pdf", "https://en.wikipedia.org/wiki/Telfairia_occidentalis", "https://mama-t.de/en/products/frische-ugu-leaves"]
  },
  {
    id: "sweet-potato-leaves",
    cat: "greens",
    emoji: "🍃",
    zm: "Sweet potato leaves (kalembula)",
    what: "Tender leaves and tips of the sweet potato plant – softer and sweeter than pumpkin or cassava leaves.",
    de: "Süßkartoffelblätter",
    shops: [
      { shop: "african", label: "Sweet Potato Leaves (frozen)", note: "Frozen 500 g packs (e.g. Kakande Fresh). West African ‘potato leaves’ are sweet potato leaves too, also sold dried." },
      { shop: "online", label: "Kakande Fresh – Sweet Potato Leaves (frozen)", note: "Mama T online; frozen delivery needs a minimum order and a cooling fee." },
      { shop: "asian", label: "Sweet potato leaves", script: "番薯叶 / 地瓜叶", roman: "fānshǔ yè / dìguā yè", note: "Not a regular item – ask. If they have it, the label looks like this." },
      { shop: "asian", label: "Rau lang", note: "Vietnamese name – ask in Vietnamese-run shops." }
    ],
    tip: "Thaw frozen leaves in a sieve, squeeze out the water, then cook like kalembula with tomato, onion and groundnut powder.",
    ask: "Haben Sie Süßkartoffelblätter, auch tiefgekühlt?",
    askEn: "Do you have sweet potato leaves, also frozen?",
    sources: ["https://kitweonline.com/kitweonline/sweet-potato-leaves-zambian-recipes.html", "https://en.wikipedia.org/wiki/Sweet_potato", "https://mama-t.de/en/products/guinea-kakande-fresh-sweet-potato-leaves-frozen"]
  },
  {
    id: "cassava-leaves",
    cat: "greens",
    emoji: "🍃",
    zm: "Cassava leaves (katapa)",
    what: "Pounded leaves of the cassava plant, cooked a long time. Raw leaves contain cyanide compounds – they must always be cooked well.",
    de: "Maniokblätter",
    deAlt: ["Pondu", "Saka-Saka"],
    shops: [
      { shop: "african", label: "Pondu / Saka-saka / Cassava leaves", note: "Frozen, already pounded. Congolese and Cameroonian customers buy it, so Central African shops are your best bet." },
      { shop: "online", label: "Pondu (frozen)", note: "Search ‘Pondu’ in German Afro online shops. Frozen delivery costs extra." }
    ],
    tip: "Pondu packs are ready-pounded katapa: cook at least one hour with onion, tomato and groundnut powder or fish. Never eat cassava leaves undercooked.",
    ask: "Haben Sie Pondu oder Maniokblätter (tiefgekühlt)?",
    askEn: "Do you have pondu or cassava leaves (frozen)?",
    sources: ["https://en.wikipedia.org/wiki/Zambian_cuisine", "https://www.osina.ch/Afroase-Pondu-Cassava-Leaves-500-g_1", "https://learn.tearfund.org/en/resources/footsteps/footsteps-41-50/footsteps-47/cooking-with-cassava-leaves"]
  },
  {
    id: "amaranth",
    cat: "greens",
    emoji: "🌿",
    zm: "Bondwe (amaranth)",
    local: [{ lang: "Nyanja", w: "Bondwe" }],
    what: "Amaranth leaves – soft green (sometimes red-centred) leaves, also called wild spinach.",
    de: "Gemüse-Amarant",
    deAlt: ["Amarant-Blätter", "Chinesischer Spinat"],
    shops: [
      { shop: "asian", label: "Chinese spinach / Yin choy", script: "莧菜", roman: "xiàncài (Cantonese: yin choy)", note: "Some Chinese shops have fresh bunches in summer – ask." },
      { shop: "asian", label: "Rau dền", note: "Vietnamese name." },
      { shop: "indian", label: "Chaulai", script: "चौलाई", roman: "chaulai", note: "Hindi name – ask." }
    ],
    tip: "In German supermarkets ‘Amarant’ means only the tiny seeds (a grain) – not the leaves. If you cannot find the leaves, use young spinach (Babyspinat) or Mangold.",
    ask: "Haben Sie frische Amarant-Blätter? Auf Chinesisch: Yin Choy.",
    askEn: "Do you have fresh amaranth leaves? In Chinese: yin choy.",
    sources: ["https://ajfand.net/Volume7/No4/Ng'uni-IPGRI2-2.pdf", "https://en.wikipedia.org/wiki/Amaranthus_dubius"]
  },
  {
    id: "cowpea-leaves",
    cat: "greens",
    emoji: "🌱",
    zm: "Cowpea leaves",
    what: "Leaves of the cowpea plant (the black-eyed bean), cooked fresh or dried as relish.",
    de: "Kuhbohnenblätter",
    shops: [
      { shop: "african", label: "Dried cowpea leaves", note: "Not a regular product in Germany – you can ask, but expect a no." }
    ],
    tip: "We found no shop selling cowpea leaves in Germany. Best substitutes: amaranth (yin choy), spinach or Mangold, cooked with groundnut powder.",
    ask: "Haben Sie getrocknete Bohnenblätter?",
    askEn: "Do you have dried bean leaves?",
    sources: ["https://en.wikipedia.org/wiki/Cowpea"]
  },
  {
    id: "okra",
    cat: "greens",
    emoji: "🫛",
    zm: "Okra (delele)",
    local: [{ lang: "Nyanja", w: "Delele" }],
    what: "Green okra pods that make the relish slippery. Also sold dried and as okra powder.",
    de: "Okra",
    deAlt: ["Okraschoten", "Gombo"],
    shops: [
      { shop: "turkish", label: "Bamya", note: "Fresh in summer and autumn. Small ‘çiçek bamya’ in jars, and dried strings (‘kuru çiçek bamya’)." },
      { shop: "indian", label: "Bhindi", script: "भिंडी", roman: "bhindi", note: "Fresh and frozen (e.g. ‘whole baby okra’ packs)." },
      { shop: "asian", label: "Okra", script: "秋葵", roman: "qiūkuí", note: "Vietnamese packs: ‘Đậu bắp’." },
      { shop: "african", label: "Okra / Gombo", note: "Fresh, frozen, whole dried okra and okra powder." },
      { shop: "supermarket", label: "Okra", note: "REWE and Edeka sometimes, small trays in the exotic section." },
      { shop: "online", label: "Fresh Bhindi (Okra)", note: "Jamoona (Indian online shop with a warehouse in Hessen) sells fresh bhindi." }
    ],
    tip: "Pick small bright-green pods that snap. Okra powder (Okrapulver / gombo) from the Afro shop thickens in 2–3 minutes – stir it in at the end. Soak dried okra 10 minutes in warm water first.",
    ask: "Haben Sie Okra? Auf Türkisch: Bamya.",
    askEn: "Do you have okra? In Turkish: bamya.",
    sources: ["https://ajfand.net/Volume7/No4/Ng'uni-IPGRI2-2.pdf", "https://www.rewe.de/lexikon/okra/", "https://www.jamoona.com/products/500g-fresh-bhindi-okra", "https://www.kaufda.de/insights/wo-kann-man-okra-kaufen-mit-tipps-zu-einkauf-lagerung-zubereitung/", "https://mama-t.de/en/products/getrocknete-okra"]
  },
  {
    id: "lumanda",
    cat: "greens",
    emoji: "🌺",
    zm: "Lumanda (sour hibiscus leaves)",
    what: "Sour leaves of a hibiscus plant, usually named as roselle (Hibiscus sabdariffa), cooked with pounded groundnuts. India eats the same leaves as ‘gongura’, and northern Uganda cooks them with groundnut paste (‘malakwang’).",
    de: "Roselle-Blätter",
    deAlt: ["Hibiskusblätter", "Gongura"],
    shops: [
      { shop: "indian", label: "Gongura", note: "Telugu name used on Indian labels. Fresh leaves are rare here; gongura pickle in jars is common but too spicy and oily for lumanda. Ask for fresh or frozen gongura." },
      { shop: "african", label: "Malakwang", note: "Ugandan name for the same sour leaves – an East African shop may know them. Ask." }
    ],
    tip: "We found no reliable fresh source near Frankfurt. For the sour taste use sorrel (Sauerampfer, sometimes at weekly markets in spring) or spinach with lemon juice. Dried hibiscus flowers (Hibiskusblüten, bissap) are for the red drink – not for relish.",
    ask: "Haben Sie frische Gongura-Blätter?",
    askEn: "Do you have fresh gongura leaves?",
    sources: ["https://en.wikipedia.org/wiki/Gongura", "https://en.wikipedia.org/wiki/Roselle_(plant)", "https://cookappetite.blogspot.com/2022/02/lumanda-in-pounded-groundnuts.html", "https://www.jamoona.com/products/telugu-300g-gongura-pickle-red-chilli-with-garlic"]
  },
  {
    id: "blackjack",
    cat: "greens",
    emoji: "🌼",
    zm: "Blackjack",
    what: "Leaves of the blackjack weed (Bidens pilosa), picked wild and cooked or dried as relish.",
    de: "Behaarter Zweizahn",
    shops: [
      { shop: "african", label: "Blackjack (not stocked)", note: "We found no shop or online seller in Germany." }
    ],
    tip: "Use amaranth (yin choy) or spinach instead. Please do not pick wild plants in Germany for food unless you are completely sure what they are – many look alike.",
    ask: "Kennen Sie Bidens pilosa (Blackjack) als Gemüse?",
    askEn: "Do you know Bidens pilosa (blackjack) as a vegetable?",
    sources: ["https://en.wikipedia.org/wiki/Bidens_pilosa"]
  },
  {
    id: "impwa",
    cat: "greens",
    emoji: "🍆",
    zm: "Impwa (garden eggs)",
    what: "Small African eggplants (garden eggs), green-white to yellow, slightly bitter.",
    de: "Afrikanische Aubergine",
    deAlt: ["Thai-Aubergine", "Garden Eggs"],
    shops: [
      { shop: "asian", label: "Thai eggplant", script: "มะเขือเปราะ", roman: "makhuea pro", note: "Golf-ball size, green and white, a bit bitter – the easiest look-alike." },
      { shop: "african", label: "Garden eggs / Jakato", note: "Fresh when available; also pickled garden eggs from Ghana in jars." },
      { shop: "online", label: "afrikanische Eggplant (Jakato)", note: "Mama T online (fresh, freshness not guaranteed)." }
    ],
    tip: "Normal big Auberginen are too soft and watery for impwa. Thai eggplants keep their bite – cut in quarters and cook with tomato and onion.",
    ask: "Haben Sie Thai-Auberginen oder Garden Eggs?",
    askEn: "Do you have Thai eggplants or garden eggs?",
    sources: ["https://www.lusakatimes.com/?p=220879", "https://www.fao.org/traditional-crops/africangardenegg/en/", "https://en.wikipedia.org/wiki/Solanum_aethiopicum", "https://en.wikipedia.org/wiki/Thai_eggplant", "https://mama-t.de/en/products/afrikanische-aubergine"]
  },
  {
    id: "pumpkin",
    cat: "greens",
    emoji: "🎃",
    zm: "Pumpkin",
    what: "Orange-fleshed pumpkin for boiling, porridge or cooking with groundnuts.",
    de: "Kürbis",
    deAlt: ["Hokkaido", "Butternut", "Speisekürbis"],
    shops: [
      { shop: "market", label: "Kürbis", note: "Huge choice September–November." },
      { shop: "supermarket", label: "Hokkaido / Butternut", note: "Autumn and winter; Butternut often all year." },
      { shop: "turkish", label: "Bal kabağı", note: "Turkish ‘honey pumpkin’, often sold in big pieces." },
      { shop: "asian", label: "Kabocha", script: "南瓜", roman: "nánguā", note: "Dark-green Japanese pumpkin, dry and sweet." }
    ],
    tip: "Hokkaido can be cooked with the skin. Butternut is sweet and firm. Decorative pumpkins (Zierkürbis) are NOT food – they can be bitter and poisonous.",
    ask: "Ist das ein Speisekürbis?",
    askEn: "Is this an eating pumpkin?",
    sources: ["https://de.wikipedia.org/wiki/Hokkaidokürbis", "https://de.wikipedia.org/wiki/Zierkürbis"]
  },
  {
    id: "kale",
    cat: "greens",
    emoji: "🥬",
    zm: "Kale / black cabbage",
    what: "Dark, tougher leaves of the leaf-cabbage family; they need longer cooking than rape.",
    de: "Grünkohl",
    deAlt: ["Schwarzkohl", "Palmkohl"],
    shops: [
      { shop: "supermarket", label: "Grünkohl", note: "Fresh in winter (about November–February), often chopped in bags; frozen all year." },
      { shop: "market", label: "Grünkohl", note: "Winter." },
      { shop: "turkish", label: "Karalahana", note: "Turkish Black Sea collard greens – big flat dark leaves. Sometimes in winter; ask." },
      { shop: "supermarket", label: "Schwarzkohl / Cavolo nero", note: "Sometimes at REWE or Edeka." }
    ],
    tip: "Grünkohl is a German winter favourite and cheap in December. Remove the hard middle rib. Frozen Grünkohl is fine for relish.",
    ask: "Haben Sie Grünkohl oder Karalahana?",
    askEn: "Do you have kale or karalahana?",
    sources: ["https://de.wikipedia.org/wiki/Grünkohl", "https://tr.wikipedia.org/wiki/Karalahana"]
  },
  {
    id: "mushrooms",
    cat: "greens",
    emoji: "🍄",
    zm: "Mushrooms",
    what: "Zambian wild rainy-season mushrooms are not sold here. In Germany you get cultivated mushrooms all year.",
    de: "Champignons",
    deAlt: ["Pilze", "Austernpilze", "Kräuterseitlinge", "Pfifferlinge"],
    shops: [
      { shop: "supermarket", label: "Champignons (weiß / braun)", note: "All year." },
      { shop: "market", label: "Pilze", note: "In autumn also Pfifferlinge and other mushrooms from licensed sellers." },
      { shop: "asian", label: "Oyster / king oyster / shiitake mushrooms", note: "Bigger packs, often cheaper." }
    ],
    tip: "Austernpilze (oyster mushrooms) and Kräuterseitlinge have a meaty bite, closer to wild Zambian mushrooms. Never pick wild mushrooms in German forests without an expert – some deadly ones look harmless.",
    ask: "Haben Sie Austernpilze?",
    askEn: "Do you have oyster mushrooms?",
    sources: ["https://de.wikipedia.org/wiki/Austernseitling"]
  },

  // ───────────────────────── NSHIMA & STAPLES ─────────────────────────
  {
    id: "breakfast-meal",
    cat: "staples",
    emoji: "🌽",
    zm: "Mealie meal – breakfast meal",
    what: "Fine, white maize meal for nshima and porridge.",
    de: "Weißes Maismehl",
    deAlt: ["Maismehl weiß", "White Maize Meal", "White Maize Flour"],
    shops: [
      { shop: "african", label: "White maize meal / White maize flour", note: "The surest place. Brands change; South African Iwisa is sold in some European Afro shops; West African shops have white maize flour too." },
      { shop: "supermarket", label: "Weißes Maismehl", note: "REWE lists ‘Natura Weißes Maismehl’ online – not in every store; ask your store." },
      { shop: "online", label: "Maismehl, weiß", note: "Birlin-Mühle (sold for Ethiopian injera), 1 kg packs online." },
      { shop: "online", label: "White Maiz Powder", note: "Mama T online lists white maize flour (500 g)." }
    ],
    tip: "Do NOT use yellow ‘Maismehl’, ‘Polenta’ or ‘Maisgrieß’ for nshima – they taste of corn and stay grainy. ‘Maisstärke’ (Mondamin) is cornflour/starch: it makes glue, not nshima. Masa harina (Mexican) is treated with lime and tastes different.",
    ask: "Haben Sie weißes Maismehl – nicht gelb, keine Maisstärke?",
    askEn: "Do you have white maize meal – not yellow, not cornstarch?",
    sources: ["https://www.rewe.de/produkte/2685085/", "https://shop.birlin-muehle.de/en/Flours/Cornmeal-oxid.html", "https://mama-t.de/en/products/grace-co-foods-white-maiz-powder-ogi", "https://www.osina.ch/Maize-Flour-White-Iwisa-2-kg_2", "https://www.knuspr.de/3943-mondamin-fine-starch"]
  },
  {
    id: "roller-meal",
    cat: "staples",
    emoji: "🌽",
    zm: "Mealie meal – roller meal",
    what: "Coarser white maize meal with more of the whole grain – the nshima is greyer and tastier.",
    de: "Weiße Polenta",
    deAlt: ["Polenta bianca", "Farina di mais bianca"],
    shops: [
      { shop: "online", label: "Polenta bianca / Farina di mais bramata bianca", note: "Italian white polenta from gourmet online shops – coarse like roller meal." },
      { shop: "african", label: "White maize meal (coarse)", note: "Ask for a coarse white maize meal." }
    ],
    tip: "Try mixing 2 parts fine white maize meal with 1 part white polenta – it comes close to roller meal. Most German ‘Polenta’ is yellow and tastes different.",
    ask: "Haben Sie weiße Polenta (Polenta bianca)?",
    askEn: "Do you have white polenta?",
    sources: ["https://www.gourmet-versand.com/en/article11280/polenta-bianca-white-polenta-casale-paradiso-300-g.html", "https://www.rewe.de/lexikon/polenta/"]
  },
  {
    id: "samp",
    cat: "staples",
    emoji: "🌽",
    zm: "Samp",
    what: "Dried white maize kernels, crushed or whole, cooked for hours – often with beans.",
    de: "Pozole-Mais",
    deAlt: ["Hominy", "Maíz pozolero"],
    shops: [
      { shop: "online", label: "Maíz pozolero / White hominy", note: "Mexican food shops online (cans or bags). Treated with lime, so the taste is a bit different, but whole and chewy like samp." },
      { shop: "african", label: "Samp", note: "Rare – ask." }
    ],
    tip: "Quick samp and beans: drained canned hominy plus cooked sugar beans (barbunya), simmered 30 minutes with onion and oil.",
    ask: "Haben Sie Samp oder Hominy?",
    askEn: "Do you have samp or hominy?",
    sources: ["https://www.mexicomiamor.de/en/products/mais-fur-pozole-von-carey-860-g", "https://gourmet-versand.com/en/article34243/pozole-corn-white-corn-kernels-pre-cooked-cacahuazintle-860-g.html", "https://en.wikipedia.org/wiki/Zambian_cuisine"]
  },
  {
    id: "green-mealies",
    cat: "staples",
    emoji: "🌽",
    zm: "Green mealies (fresh maize)",
    what: "Fresh cobs of white field maize: starchy and chewy, roasted or boiled. German sweet corn is much sweeter and softer.",
    de: "Maiskolben",
    deAlt: ["Wachsmais", "Klebmais", "Zuckermais"],
    shops: [
      { shop: "asian", label: "Waxy corn / sticky corn", script: "糯玉米", roman: "nuò yùmǐ", note: "Vacuum-packed cobs, often white or purple. Chewy and less sweet – the closest to mealies." },
      { shop: "asian", label: "Ngô nếp", note: "Vietnamese name for sticky corn." },
      { shop: "supermarket", label: "Maiskolben", note: "Sweet corn: fresh in late summer, vacuum-packed cooked cobs all year." },
      { shop: "market", label: "Zuckermais", note: "About August–October." }
    ],
    tip: "The maize in German fields is animal feed – do not pick it. For roasting, waxy corn from the Asia shop is best.",
    ask: "Haben Sie Wachsmais oder Klebmais?",
    askEn: "Do you have waxy (sticky) corn?",
    sources: ["https://en.wikipedia.org/wiki/Waxy_corn", "https://ebay.de/itm/256299236625"]
  },
  {
    id: "cassava",
    cat: "staples",
    emoji: "🍠",
    zm: "Cassava (tute)",
    what: "Starchy cassava root – boiled, fried or roasted (also with groundnuts).",
    de: "Maniok",
    deAlt: ["Kassava", "Yuca"],
    shops: [
      { shop: "asian", label: "Cassava", script: "木薯", roman: "mùshǔ", note: "Fresh roots; frozen peeled pieces or grated cassava." },
      { shop: "asian", label: "Khoai mì", note: "Vietnamese name." },
      { shop: "african", label: "Cassava / Manioc", note: "Fresh roots and frozen chunks (e.g. ‘Cassava Chunks’)." },
      { shop: "supermarket", label: "Maniok", note: "Sometimes in the exotic section of REWE, Edeka or Kaufland." },
      { shop: "online", label: "Cassava (Maniok)", note: "Obstwelt (online fruit shop) sells fresh roots." }
    ],
    tip: "Pick firm roots without dark lines inside. Frozen peeled chunks save a lot of work. Always cook cassava fully – never eat it raw.",
    ask: "Haben Sie Maniok, frisch oder tiefgekühlt?",
    askEn: "Do you have cassava, fresh or frozen?",
    sources: ["https://en.wikipedia.org/wiki/Cassava", "https://www.obstwelt.com/en/products/cassava-maniok-kaufen", "https://mama-t.de/en/products/asian-choice-chunks-cassava", "https://en.wikipedia.org/wiki/Zambian_cuisine"]
  },
  {
    id: "cassava-flour",
    cat: "staples",
    emoji: "🍠",
    zm: "Cassava meal / cassava flour",
    what: "Dried cassava ground to flour, for cassava nshima.",
    de: "Maniokmehl",
    deAlt: ["Cassava Flour", "Lafun"],
    shops: [
      { shop: "african", label: "Cassava flour / Lafun", note: "Many brands; ‘white cassava flour’ is the closest. ‘Gari’ is roasted granules – different." },
      { shop: "online", label: "Elsies Cassava Flour / African Beauty White Cassava Flour", note: "Both listed at Mama T online." }
    ],
    tip: "Do not confuse with ‘Tapiokastärke’ (pure starch) or ‘Gari’. Plantain fufu flour and pounded yam flour are different products too.",
    ask: "Haben Sie weißes Maniokmehl (Cassava Flour)?",
    askEn: "Do you have white cassava flour?",
    sources: ["https://mama-t.de/en/products/elsies-cassava-flour", "https://mama-t.de/en/products/african-beauty-white-cassava-flour", "https://en.wikipedia.org/wiki/Cassava"]
  },
  {
    id: "sweet-potato",
    cat: "staples",
    emoji: "🍠",
    zm: "Sweet potatoes",
    what: "Many Zambian sweet potatoes are white or cream inside and floury. Most German supermarket sweet potatoes are orange inside, sweeter and softer.",
    de: "Süßkartoffel",
    deAlt: ["Batate"],
    shops: [
      { shop: "supermarket", label: "Süßkartoffeln", note: "All year, almost always the orange type." },
      { shop: "asian", label: "Korean / Japanese sweet potato", script: "고구마", roman: "goguma (Korean) / satsumaimo (Japanese)", note: "If you see them: purple-red skin, pale yellow-white flesh, floury – much closer to Zambian ones." },
      { shop: "indian", label: "Shakarkandi", script: "शकरकंद", roman: "shakarkand", note: "Indian sweet potato; Jamoona (online) sells it fresh." },
      { shop: "turkish", label: "Tatlı patates", note: "Turkish name." }
    ],
    tip: "Scratch the skin with a fingernail: white or cream = Zambian style; bright orange = the usual German type.",
    ask: "Haben Sie Süßkartoffeln, die innen weiß sind?",
    askEn: "Do you have sweet potatoes that are white inside?",
    sources: ["https://en.wikipedia.org/wiki/Sweet_potato", "https://www.jamoona.com/products/1kg-fresh-shakarkandi-sweet-potato", "https://cipotato.org/blog/breeding-nutritious-sweetpotatoes-zambia/"]
  },
  {
    id: "irish-potatoes",
    cat: "staples",
    emoji: "🥔",
    zm: "Irish potatoes",
    what: "Ordinary potatoes. Zambians say ‘Irish potatoes’ to tell them apart from sweet potatoes.",
    de: "Kartoffeln",
    deAlt: ["festkochend", "vorwiegend festkochend", "mehligkochend"],
    shops: [
      { shop: "supermarket", label: "Kartoffeln", note: "Bags of 1–5 kg; the bag says how they cook." },
      { shop: "market", label: "Kartoffeln", note: "From local farmers – ask for the type." }
    ],
    tip: "The bag tells you: festkochend (waxy) for boiling and salads; vorwiegend festkochend (all-round) for stews and chips; mehligkochend (floury) for mash. ‘Frühkartoffeln’ are new potatoes.",
    ask: "Welche Kartoffeln sind gut für Pommes?",
    askEn: "Which potatoes are good for chips?",
    sources: ["https://de.wikipedia.org/wiki/Speisekartoffel"]
  },
  {
    id: "rice",
    cat: "staples",
    emoji: "🍚",
    zm: "Rice",
    what: "Long-grain rice like at home.",
    de: "Reis",
    deAlt: ["Langkornreis", "Basmati", "Jasminreis", "Parboiled Reis"],
    shops: [
      { shop: "supermarket", label: "Langkornreis / Basmati", note: "Everywhere; ‘Kochbeutel’ = boil-in-bag." },
      { shop: "asian", label: "Jasmine rice", script: "香米", roman: "xiāngmǐ", note: "Big 5–20 kg bags, cheaper per kilo." },
      { shop: "indian", label: "Basmati", note: "Big sacks." },
      { shop: "turkish", label: "Pirinç", note: "Turkish rice (baldo, osmancık) is medium-grain, for pilav." }
    ],
    tip: "Parboiled rice stays loose and is hard to overcook. ‘Milchreis’ is pudding rice and ‘Risotto’ rice is sticky – not for everyday rice.",
    ask: "Wo ist der Langkornreis?",
    askEn: "Where is the long-grain rice?",
    sources: ["https://de.wikipedia.org/wiki/Reis"]
  },
  {
    id: "plantain",
    cat: "staples",
    emoji: "🍌",
    zm: "Plantain",
    what: "Big cooking bananas, starchy when green and sweet when ripe.",
    de: "Kochbanane",
    deAlt: ["Plantain"],
    shops: [
      { shop: "african", label: "Plantain", note: "Green and ripe, by the piece or kilo." },
      { shop: "asian", label: "Plantain / cooking banana", note: "Often next to normal bananas." },
      { shop: "supermarket", label: "Kochbananen", note: "Sometimes in the exotic section of REWE, Edeka or Kaufland." }
    ],
    tip: "Green = starchy, for boiling or chips. Yellow with black spots = sweet, for frying. Normal bananas do not work the same.",
    ask: "Haben Sie Kochbananen?",
    askEn: "Do you have plantains?",
    sources: ["https://de.wikipedia.org/wiki/Kochbanane"]
  },
  {
    id: "yam",
    cat: "staples",
    emoji: "🍠",
    zm: "Yam",
    what: "Big starchy African yam tubers.",
    de: "Yamswurzel",
    deAlt: ["Yams", "Water Yam", "Puna Yam"],
    shops: [
      { shop: "african", label: "Yam (water yam / puna yam)", note: "Big fresh tubers by weight; also yam flour." },
      { shop: "online", label: "Water Yam", note: "Mama T online (about 1.5 kg pieces)." }
    ],
    tip: "In American recipes ‘yam’ often means orange sweet potato. In German Afro shops ‘yam’ is the real big African yam.",
    ask: "Haben Sie Yams?",
    askEn: "Do you have yam?",
    sources: ["https://mama-t.de/en/products/ganze-yam", "https://de.wikipedia.org/wiki/Yamswurzeln"]
  },

  // ───────────────────────── BEANS & NUTS ─────────────────────────
  {
    id: "sugar-beans",
    cat: "beans",
    emoji: "🫘",
    zm: "Sugar beans",
    what: "Red-speckled beans on a cream background – a cranberry/borlotti-type bean (Phaseolus vulgaris).",
    de: "Borlotti-Bohnen",
    deAlt: ["Wachtelbohnen"],
    shops: [
      { shop: "turkish", label: "Barbunya", note: "Dried in bags, also canned; fresh pods in summer." },
      { shop: "supermarket", label: "Borlotti-Bohnen", note: "Mostly canned (Dose); dried sometimes." },
      { shop: "indian", label: "Chitra rajma", roman: "chitra rajma", note: "Speckled kidney beans – similar. Ask." }
    ],
    tip: "Turkish barbunya is the closest to sugar beans. Soak overnight, then boil about 1 hour until soft.",
    ask: "Haben Sie Barbunya-Bohnen?",
    askEn: "Do you have barbunya (borlotti) beans?",
    sources: ["https://www.farmersweekly.co.za/crops/vegetables/tasty-nutritious-beans-come-in-many-forms/", "https://tr.wikipedia.org/wiki/Barbunya_(bitki)"]
  },
  {
    id: "kidney-beans",
    cat: "beans",
    emoji: "🫘",
    zm: "Other beans (red kidney, white beans)",
    what: "Red kidney beans and small white beans.",
    de: "Kidneybohnen",
    deAlt: ["Rote Bohnen", "Weiße Bohnen"],
    shops: [
      { shop: "supermarket", label: "Kidneybohnen / Weiße Bohnen", note: "Canned everywhere; dried in bags." },
      { shop: "turkish", label: "Kırmızı fasulye / Kuru fasulye", note: "Red beans / dried white beans in big bags." },
      { shop: "indian", label: "Rajma", script: "राजमा", roman: "rajma", note: "Red kidney beans, 1–2 kg packs." }
    ],
    tip: "Dried red kidney beans must boil hard for at least 10 minutes – never slow-cook them raw. Canned beans are already cooked.",
    ask: "Haben Sie getrocknete Kidneybohnen?",
    askEn: "Do you have dried kidney beans?",
    sources: ["https://www.jamoona.com/products/trs-1kg-red-kidney-beans-rajma", "https://en.wikipedia.org/wiki/Kidney_bean"]
  },
  {
    id: "cowpeas",
    cat: "beans",
    emoji: "🫘",
    zm: "Cowpeas",
    what: "Small cream beans with a black eye (black-eyed beans).",
    de: "Augenbohnen",
    deAlt: ["Schwarzaugenbohnen", "Black Eyed Beans"],
    shops: [
      { shop: "turkish", label: "Börülce", note: "Dried in bags." },
      { shop: "indian", label: "Lobiya", script: "लोबिया", roman: "lobiya", note: "Packs say ‘Black Eye Beans (Lobiya)’." },
      { shop: "african", label: "Black eyed beans", note: "Big bags." },
      { shop: "supermarket", label: "Augenbohnen", note: "Sometimes dried or canned." }
    ],
    tip: "Cowpeas cook faster than other beans (about 30–45 minutes) and do not need long soaking.",
    ask: "Haben Sie Augenbohnen? Auf Türkisch: Börülce.",
    askEn: "Do you have black-eyed beans? In Turkish: börülce.",
    sources: ["https://tr.wikipedia.org/wiki/Börülce", "https://www.jamoona.com/products/trs-1kg-black-eye-beans", "https://mama-t.de/en/products/black-eyed-peas"]
  },
  {
    id: "groundnuts-raw",
    cat: "beans",
    emoji: "🥜",
    zm: "Groundnuts (raw)",
    what: "Raw, unsalted peanuts with red skin – for roasting and pounding.",
    de: "Erdnüsse, roh",
    deAlt: ["Erdnusskerne ungeröstet", "ungesalzen"],
    shops: [
      { shop: "indian", label: "Red peanuts / Pink peanuts", script: "मूंगफली", roman: "moongphali", note: "TRS packs say ‘not roasted and unsalted, with skin’ – exactly right." },
      { shop: "asian", label: "Raw peanuts", script: "生花生", roman: "shēng huāshēng", note: "Raw peanuts in bags." },
      { shop: "turkish", label: "Çiğ yer fıstığı", note: "Turkish: raw peanuts. Many are roasted (kavrulmuş) – check." },
      { shop: "supermarket", label: "Erdnusskerne", note: "Careful: most are roasted and salted (geröstet, gesalzen)." }
    ],
    tip: "Look for ‘roh’, ‘ungeröstet’, ‘ungesalzen’ on the pack. Roast in a dry pan yourself, cool, then grind.",
    ask: "Haben Sie rohe, ungesalzene Erdnüsse?",
    askEn: "Do you have raw, unsalted peanuts?",
    sources: ["https://www.jamoona.com/products/trs-375g-red-peanuts", "https://www.jamoona.com/products/trs-375g-pink-peanuts"]
  },
  {
    id: "groundnut-powder",
    cat: "beans",
    emoji: "🥜",
    zm: "Groundnut powder (for ifisashi)",
    what: "Pounded peanuts used to cook greens (ifisashi) and other relishes.",
    de: "Erdnussmus",
    deAlt: ["Erdnusspulver", "Erdnussmus 100 %"],
    shops: [
      { shop: "supermarket", label: "Erdnussmus 100 %", note: "Spread or organic shelf. Choose ‘100 % Erdnüsse’ – no salt, no sugar." },
      { shop: "drugstore", label: "Erdnussmus", note: "dm and Rossmann usually have organic Erdnussmus." },
      { shop: "african", label: "Ground peanut powder", note: "Ready-ground (roasted) peanut powder for sauces." },
      { shop: "online", label: "Guinea Fresh – Ground Peanut Powder", note: "Mama T online, 400 g." }
    ],
    tip: "Best taste: roast raw peanuts, cool, grind in short bursts in a blender. Erdnussmus is a fast shortcut. ‘Erdnussbutter’ with sugar and salt tastes wrong in ifisashi.",
    ask: "Haben Sie Erdnussmus ohne Zucker und Salz?",
    askEn: "Do you have peanut paste without sugar and salt?",
    sources: ["https://en.wikipedia.org/wiki/Zambian_cuisine", "https://mama-t.de/en/products/guinea-fresh-groun-peanut-powder"]
  },
  {
    id: "bambara",
    cat: "beans",
    emoji: "🫘",
    zm: "Bambara nuts (ntoyo)",
    what: "Round, hard ‘groundnuts’ (Vigna subterranea), usually boiled with salt.",
    de: "Bambara-Erdnuss",
    deAlt: ["Erderbse"],
    shops: [
      { shop: "african", label: "Bambara beans / Okpa", note: "Rare. Nigerian shops sometimes have bambara flour (‘okpa’); whole nuts are hard to find – ask." }
    ],
    tip: "We did not find whole bambara nuts in German shops. Boiled black-eyed beans with salt are a different but filling snack.",
    ask: "Haben Sie Bambara-Bohnen (Okpa)?",
    askEn: "Do you have bambara beans (okpa)?",
    sources: ["https://www.theafricangourmet.com/2016/09/bambara-groundnuts-and-peanuts-are-not.html", "https://www.feedipedia.org/node/754"]
  },
  {
    id: "soya-pieces",
    cat: "beans",
    emoji: "🫘",
    zm: "Soya pieces",
    what: "Dried soy chunks that swell in water and taste meaty in a stew.",
    de: "Sojaschnetzel",
    deAlt: ["Soja-Brocken", "Sojawürfel"],
    shops: [
      { shop: "indian", label: "Soya chunks", note: "Brands like TRS; Indian ‘Nutrela’ is the classic. Most similar to Zambian soya pieces." },
      { shop: "supermarket", label: "Sojaschnetzel", note: "Vegetarian or organic shelf: ‘grob’ (chunky) or ‘fein’ (mince)." },
      { shop: "drugstore", label: "Sojaschnetzel", note: "dm and Rossmann often have them." }
    ],
    tip: "Soak 10 minutes in hot stock, squeeze out, then fry with onion and tomato like at home.",
    ask: "Haben Sie Soja Chunks?",
    askEn: "Do you have soya chunks?",
    sources: ["https://www.jamoona.com/products/trs-250g-soya-chunks"]
  },

  // ───────────────────────── FISH & MEAT ─────────────────────────
  {
    id: "kapenta",
    cat: "fish",
    emoji: "🐟",
    zm: "Kapenta",
    what: "Tiny dried freshwater sardines (Lake Tanganyika sardine and sprat), fried crisp or cooked in tomato.",
    de: "Getrocknete Sardellen",
    deAlt: ["Anchovis getrocknet", "Kleine getrocknete Fische"],
    shops: [
      { shop: "asian", label: "Ikan bilis (dried anchovies)", script: "江鱼仔", roman: "jiāng yú zǎi", note: "Malaysian and Singapore packs. ‘With head’, medium size is most like kapenta." },
      { shop: "asian", label: "Cá cơm khô", note: "Vietnamese: dried anchovies." },
      { shop: "asian", label: "Myeolchi", script: "멸치", roman: "myeolchi", note: "Korean dried anchovies (freezer or dry shelf)." },
      { shop: "african", label: "Dagaa / Omena", note: "Small dried fish from Lake Victoria – a close cousin, a bit more bitter." },
      { shop: "online", label: "Bigi Mama – getrocknete Sardellen", note: "Mama T online, 80 g." }
    ],
    tip: "Rinse dried anchovies quickly (they can be salty), dry them, then fry with onion, tomato and chilli like kapenta. Real Zambian kapenta is rarely sold in Germany.",
    ask: "Haben Sie kleine getrocknete Fische, wie Sardellen?",
    askEn: "Do you have small dried fish, like anchovies?",
    sources: ["https://en.wikipedia.org/wiki/Kapenta", "https://en.wikipedia.org/wiki/Silver_cyprinid", "https://en.wikipedia.org/wiki/Anchovies_as_food", "https://www.thestar.com.my/news/community/2012/03/23/dried-anchovies-setipinna-taty", "https://mama-t.de/en/products/bigi-mama-getrocknete-sardellen-anchovis"]
  },
  {
    id: "dried-fish",
    cat: "fish",
    emoji: "🐟",
    zm: "Dried fish (dried bream, buka buka)",
    what: "Sun-dried or smoked whole fish, soaked and cooked in a tomato relish.",
    de: "Getrockneter Fisch",
    deAlt: ["Räucherfisch", "Trockenfisch"],
    shops: [
      { shop: "african", label: "Smoked tilapia / Koobi / Bitoyo", note: "Smoked or salted-dried tilapia (the bream family), smoked catfish, stockfish." },
      { shop: "online", label: "Koobi (Salted Tilapia) / Bitoyo / Smoked Tilapia", note: "All listed at Mama T online." }
    ],
    tip: "Smoked tilapia is the closest to dried bream. Koobi and bitoyo are salted – soak 1–2 hours and change the water. Stockfisch (dried cod) is very different.",
    ask: "Haben Sie getrockneten Tilapia oder Räucherfisch?",
    askEn: "Do you have dried tilapia or smoked fish?",
    sources: ["https://mama-t.de/en/products/kobi-ghana-salted-fish", "https://mama-t.de/en/products/bitoyo-salted-dried-tilapia", "https://kuli-kuli.com/zambia/dry-fish-stew/by/jessie-chipindo", "https://theculturetrip.com/africa/zambia/articles/9-traditional-foods-you-must-eat-while-youre-in-zambia"]
  },
  {
    id: "bream",
    cat: "fish",
    emoji: "🐠",
    zm: "Bream (fresh)",
    what: "Zambian bream is tilapia, cooked whole – fried or boiled.",
    de: "Tilapia",
    deAlt: ["Buntbarsch", "Tilapiafilet"],
    shops: [
      { shop: "asian", label: "Tilapia", script: "罗非鱼", roman: "luófēiyú", note: "Frozen whole fish, gutted; sometimes red tilapia." },
      { shop: "asian", label: "Cá rô phi", note: "Vietnamese name." },
      { shop: "asian", label: "Pla nin", script: "ปลานิล", roman: "pla nin", note: "Thai name." },
      { shop: "african", label: "Tilapia (red / black), frozen", note: "Whole fish or steaks." },
      { shop: "supermarket", label: "Tilapiafilet", note: "Frozen fillets – no bones, less taste." }
    ],
    tip: "Thaw whole tilapia in the fridge, scale it, cut slashes in the sides, salt and fry – just like at home.",
    ask: "Haben Sie ganzen Tilapia?",
    askEn: "Do you have whole tilapia?",
    sources: ["https://kuli-kuli.com/zambia/dry-fish-stew/by/jessie-chipindo", "https://en.wikipedia.org/wiki/Tilapia", "https://mama-t.de/en/products/red-tilapia-steak"]
  },
  {
    id: "tinned-fish",
    cat: "fish",
    emoji: "🥫",
    zm: "Tinned fish (pilchards)",
    what: "Pilchards or mackerel in tomato sauce.",
    de: "Sardinen in Tomatensoße",
    deAlt: ["Makrelenfilets in Tomatensoße", "Heringsfilets in Tomatencreme"],
    shops: [
      { shop: "supermarket", label: "Sardinen in Tomatensoße / Makrelenfilets", note: "Every supermarket, tinned-fish shelf." },
      { shop: "african", label: "Jack mackerel in tomato sauce (Geisha, Titus)", note: "West African favourite brands – same style as Zambian tins." }
    ],
    tip: "German ‘Heringsfilets in Tomatencreme’ are sweeter and creamier. Jack mackerel in tomato sauce from the Afro shop is closest to Zambian pilchards.",
    ask: "Wo finde ich Fischkonserven?",
    askEn: "Where are the tinned fish?",
    sources: ["https://mama-t.de/en/products/geisha-jack-mackerel-in-tomato-sauce", "https://mama-t.de/en/products/titus-sardinen-in-tomatensosse"]
  },
  {
    id: "goat",
    cat: "fish",
    emoji: "🐐",
    zm: "Goat meat",
    what: "Goat meat on the bone for stew.",
    de: "Ziegenfleisch",
    deAlt: ["Zicklein", "Ziege"],
    shops: [
      { shop: "butcher", label: "Keçi eti / Oğlak eti", note: "Turkish: goat / kid meat. Halal butchers usually have lamb; goat is less common – ask, some can order it." },
      { shop: "african", label: "Goat meat (frozen)", note: "Frozen pieces with bone; also smoked goat meat." },
      { shop: "online", label: "Smoked Goat Meat", note: "Mama T online (dried, 250 g – for soups)." }
    ],
    tip: "Lammfleisch (lamb) or Hammel (mutton) is the easiest substitute. ‘Zicklein’ is young goat – very tender, cook it shorter.",
    ask: "Haben Sie Ziegenfleisch? Auf Türkisch: keçi eti.",
    askEn: "Do you have goat meat? In Turkish: keçi eti.",
    sources: ["https://mama-t.de/en/products/dry-goat-meat", "https://de.wikipedia.org/wiki/Ziegenfleisch"]
  },
  {
    id: "village-chicken",
    cat: "fish",
    emoji: "🐓",
    zm: "Village chicken",
    what: "Free-range chicken: firm, tasty, needs long cooking.",
    de: "Suppenhuhn",
    deAlt: ["Bio-Suppenhuhn", "Legehenne"],
    shops: [
      { shop: "supermarket", label: "Suppenhuhn", note: "Freezer, sometimes the meat counter. An old laying hen – firmer meat, more taste." },
      { shop: "market", label: "Suppenhuhn", note: "Poultry and farm stalls – ask, best order ahead." },
      { shop: "african", label: "Hard chicken / Strong chicken", note: "West African name for old hens; sometimes smoked." }
    ],
    tip: "A Suppenhuhn needs 2–3 hours of slow cooking – just like village chicken. Normal ‘Hähnchen’ is a broiler: soft and quick. We did not find ‘köy tavuğu’ (Turkish village chicken) sold in German Turkish shops.",
    ask: "Haben Sie ein Suppenhuhn?",
    askEn: "Do you have a boiling hen?",
    sources: ["https://www.rewe.de/lexikon/huehnersuppe/", "https://www.thepoultrysite.com/articles/why-zimbabwes-consumers-favour-tough-end-of-lay-hens-to-tender-broilers", "https://mama-t.de/en/products/ganzes-hahnchen"]
  },
  {
    id: "chicken-feet",
    cat: "fish",
    emoji: "🐔",
    zm: "Chicken feet",
    what: "Chicken feet for stew or frying.",
    de: "Hähnchenfüße",
    deAlt: ["Hühnerfüße", "Hühnerkrallen"],
    shops: [
      { shop: "asian", label: "Chicken feet / phoenix claws", script: "鸡爪 / 凤爪", roman: "jīzhuǎ / fèngzhuǎ", note: "Frozen bags in the freezer." },
      { shop: "asian", label: "Chân gà", note: "Vietnamese name." },
      { shop: "african", label: "Chicken feet", note: "Frozen – ask." }
    ],
    tip: "Dried ‘Hühnerfüße’ in pet shops are dog chews – not food for people. Buy frozen ones in the Asia shop.",
    ask: "Haben Sie Hähnchenfüße, tiefgekühlt?",
    askEn: "Do you have frozen chicken feet?",
    sources: ["https://en.wikipedia.org/wiki/Chicken_feet", "https://www.zooplus.de/shop/hunde/hundesnacks/natursnacks_alle/9980180727"]
  },
  {
    id: "gizzards",
    cat: "fish",
    emoji: "🐔",
    zm: "Gizzards",
    what: "Chicken gizzards, cooked soft and fried with onion and tomato.",
    de: "Hähnchenmägen",
    deAlt: ["Hühnermägen", "Geflügelmägen"],
    shops: [
      { shop: "butcher", label: "Tavuk taşlığı", note: "Turkish: chicken gizzards. Many Turkish and halal butchers have them, fresh or frozen." },
      { shop: "asian", label: "Chicken gizzard", script: "鸡胗", roman: "jīzhēn", note: "Frozen." },
      { shop: "supermarket", label: "Hähnchenmägen", note: "Sometimes frozen; meat counters can order." }
    ],
    tip: "Peel off any yellow inner skin, boil 45–60 minutes until soft, then fry with onion and tomato.",
    ask: "Haben Sie Hähnchenmägen? Auf Türkisch: taşlık.",
    askEn: "Do you have chicken gizzards? In Turkish: taşlık.",
    sources: ["https://de.wikipedia.org/wiki/Muskelmagen"]
  },
  {
    id: "tripe",
    cat: "fish",
    emoji: "🥩",
    zm: "Tripe",
    what: "Cleaned cow stomach, cooked for a long time.",
    de: "Kutteln",
    deAlt: ["Kaldaunen", "Flecke"],
    shops: [
      { shop: "butcher", label: "İşkembe", note: "Turkish: tripe (as in işkembe çorbası). Cleaned white tripe, fresh or frozen." },
      { shop: "african", label: "Cow stomach (Abodi) / Shaki", note: "Frozen pieces, 1 kg." },
      { shop: "market", label: "Kutteln", note: "Some butcher stalls; usually cleaned and pre-cooked." }
    ],
    tip: "Buy ‘Kutteln’ or ‘İşkembe’ – cleaned and often pre-cooked for people. ‘Pansen’ or ‘grüner Pansen’ is usually sold as DOG FOOD (pet shops).",
    ask: "Haben Sie Kutteln? Auf Türkisch: İşkembe.",
    askEn: "Do you have tripe? In Turkish: işkembe.",
    sources: ["https://www.yumda.com/de/lexikon/Kutteln.html", "https://mama-t.de/en/products/beefstomach-in-pieces-abodi", "https://www.zooplus.de/shop/hunde/hundesnacks/natursnacks_alle/9980180481"]
  },
  {
    id: "cow-trotters",
    cat: "fish",
    emoji: "🦶",
    zm: "Cow trotters (cow heel)",
    what: "Cow feet, cooked for hours into a rich, sticky stew.",
    de: "Rinderfüße",
    deAlt: ["Kuhfüße"],
    shops: [
      { shop: "butcher", label: "Paça", note: "Turkish: trotters (for paça çorbası). Ask at Turkish or halal butchers – order a day ahead." },
      { shop: "african", label: "Cow foot", note: "Frozen pieces – ask." }
    ],
    tip: "Ask the butcher to cut them into pieces – they are very hard. A pressure cooker (Schnellkochtopf) saves hours.",
    ask: "Haben Sie Paça (Rinderfüße)? Können Sie sie klein schneiden?",
    askEn: "Do you have cow trotters? Can you cut them small?",
    sources: ["https://tr.wikipedia.org/wiki/Kelle_paça"]
  },
  {
    id: "offal",
    cat: "fish",
    emoji: "🥩",
    zm: "Offal (liver, kidney, heart)",
    what: "Liver, kidney and heart from beef, lamb or chicken.",
    de: "Innereien",
    deAlt: ["Rinderleber", "Hähnchenleber", "Nieren", "Rinderherz"],
    shops: [
      { shop: "butcher", label: "Sakatat / Ciğer", note: "Turkish: offal / liver. Turkish butchers often have lamb and beef liver, kidneys, hearts." },
      { shop: "supermarket", label: "Hähnchenleber / Rinderleber", note: "Chicken livers fresh or frozen; beef liver at meat counters." },
      { shop: "african", label: "Cow skin, tripe and other offal", note: "Frozen." }
    ],
    tip: "Chicken livers are cheap in most supermarkets. ‘Leberkäse’ is a meat loaf – it has no liver in it.",
    ask: "Haben Sie frische Leber?",
    askEn: "Do you have fresh liver?",
    sources: ["https://de.wikipedia.org/wiki/Innereien"]
  },
  {
    id: "beef-stew",
    cat: "fish",
    emoji: "🥩",
    zm: "Beef – mixed cut / stewing beef",
    what: "Beef pieces with bone and fat for a slow stew.",
    de: "Rindergulasch",
    deAlt: ["Beinscheibe", "Suppenfleisch mit Knochen", "Rinderbrust"],
    shops: [
      { shop: "supermarket", label: "Rindergulasch / Suppenfleisch", note: "Ready-cut stew cubes; ‘Suppenfleisch mit Knochen’ = beef on the bone." },
      { shop: "butcher", label: "Kuşbaşı / Kemikli dana eti", note: "Turkish: small beef cubes / beef on the bone (halal)." },
      { shop: "market", label: "Beinscheibe", note: "Butcher stalls – beef shin slices with marrow bone." }
    ],
    tip: "Beinscheibe (beef shin with marrow bone) is the closest to Zambian mixed cut – lots of taste, cook about 2 hours. Gulasch has no bones and needs about 1½ hours.",
    ask: "Ich möchte Rindfleisch mit Knochen zum Schmoren.",
    askEn: "I would like beef with bone for stewing.",
    sources: ["https://de.wikipedia.org/wiki/Beinscheibe", "https://de.wikipedia.org/wiki/Gulasch"]
  },
  {
    id: "t-bone",
    cat: "fish",
    emoji: "🥩",
    zm: "T-bone steak",
    what: "Steak with a T-shaped bone, for braai or frying.",
    de: "T-Bone-Steak",
    deAlt: ["Porterhouse-Steak"],
    shops: [
      { shop: "supermarket", label: "T-Bone-Steak", note: "Meat counters (Kaufland, REWE, Edeka) or frozen – expensive in Germany." },
      { shop: "butcher", label: "T-Bone", note: "German and halal butchers – order ahead." }
    ],
    tip: "Cheaper braai options: Nackensteak (pork neck) or halal Lammkoteletts (lamb chops).",
    ask: "Haben Sie T-Bone-Steaks?",
    askEn: "Do you have T-bone steaks?",
    sources: ["https://de.wikipedia.org/wiki/T-Bone-Steak"]
  },
  {
    id: "mince",
    cat: "fish",
    emoji: "🥩",
    zm: "Mince",
    what: "Minced beef.",
    de: "Rinderhackfleisch",
    deAlt: ["Rinderhack", "Hackfleisch gemischt"],
    shops: [
      { shop: "supermarket", label: "Rinderhackfleisch", note: "‘Hackfleisch gemischt’ is half pork! For beef only the label must say ‘Rind’." },
      { shop: "butcher", label: "Dana kıyma", note: "Turkish: beef mince (halal)." }
    ],
    tip: "‘Gemischtes Hack’ = beef + pork. ‘Rinderhack’ = beef only.",
    ask: "Ist das nur Rind?",
    askEn: "Is this beef only?",
    sources: ["https://de.wikipedia.org/wiki/Hackfleisch"]
  },
  {
    id: "polony",
    cat: "fish",
    emoji: "🌭",
    zm: "Polony",
    what: "Smooth pink cooked sausage, sliced on bread.",
    de: "Fleischwurst",
    deAlt: ["Lyoner", "Mortadella"],
    shops: [
      { shop: "supermarket", label: "Fleischwurst / Lyoner", note: "Sliced or as a ring in the sausage section." },
      { shop: "turkish", label: "Dana salam / Piliç salam", note: "Halal beef or chicken cold cut, mild and pink like polony." }
    ],
    tip: "Fleischwurst usually contains pork. For no-pork polony buy halal ‘Geflügel-Fleischwurst’ or Turkish ‘dana salam’.",
    ask: "Haben Sie Fleischwurst ohne Schwein?",
    askEn: "Do you have Fleischwurst without pork?",
    sources: ["https://de.wikipedia.org/wiki/Fleischwurst", "https://earthwormexpress.com/meat-emulsions-a-roadmap-to-investigations/ode-to-the-russian-a-technical-evaluation/"]
  },
  {
    id: "russians",
    cat: "fish",
    emoji: "🌭",
    zm: "Russians / Hungarians",
    what: "Thick, smoked, fully cooked sausages – coarser than polony. In Zambia often called Hungarians.",
    de: "Krakauer",
    deAlt: ["Bockwurst", "Knacker", "Rindswurst"],
    shops: [
      { shop: "supermarket", label: "Krakauer / Bockwurst", note: "In jars, vacuum packs or at the deli counter." },
      { shop: "turkish", label: "Rindswurst / Dana sosis", note: "Halal beef sausages." }
    ],
    tip: "Krakauer is coarse and smoky – closest to a Russian. Bockwurst is finer, like a big Vienna. Heat in hot water, do not boil (they burst).",
    ask: "Haben Sie Krakauer?",
    askEn: "Do you have Krakauer sausages?",
    sources: ["https://earthwormexpress.com/meat-emulsions-a-roadmap-to-investigations/ode-to-the-russian-a-technical-evaluation/", "https://de.wikipedia.org/wiki/Krakauer_(Wurst)"]
  },
  {
    id: "boerewors",
    cat: "fish",
    emoji: "🌭",
    zm: "Boerewors",
    what: "Coarse South African coiled sausage with coriander, for the braai.",
    de: "Boerewors",
    deAlt: ["Südafrikanische Bratwurst"],
    shops: [
      { shop: "online", label: "Boerewors – African bratwurst", note: "Der Holzapfel (German online shop) – pork and beef." },
      { shop: "online", label: "Bernds Biltongbude (eBay shop)", note: "Namibian / South African specialities: boerewors, droëwors, biltong." }
    ],
    tip: "Austrian ‘Burenwurst’ is a different Viennese sausage, not boerewors. A coarse German Bratwurst with a little ground coriander is a quick substitute.",
    ask: "Haben Sie südafrikanische Boerewors?",
    askEn: "Do you have South African boerewors?",
    sources: ["https://www.derholzapfel.com/products/boerewors-afrikanische-bratwurst", "https://www.ebay.de/str/berndsbiltongbude", "https://en.wikipedia.org/wiki/Boerewors"]
  },
  {
    id: "caterpillars",
    cat: "fish",
    emoji: "🐛",
    zm: "Caterpillars (ifinkubala)",
    what: "Dried mopane caterpillars, fried or cooked in tomato.",
    de: "Mopane-Raupen",
    shops: [
      { shop: "african", label: "Not sold legally", note: "Insects need EU ‘novel food’ approval; mopane caterpillars are not on the list." }
    ],
    tip: "Honest answer: you will not find them legally in German shops. Only a few insects are approved in the EU (mealworm, lesser mealworm, house cricket, migratory locust). For a crunchy, smoky relish try fried dried anchovies or smoked fish.",
    ask: "Haben Sie Mopane-Raupen?",
    askEn: "Do you have mopane caterpillars?",
    sources: ["https://food.ec.europa.eu/safety/novel-food/authorisations/approval-insect-novel-food_en"]
  },

  // ───────────────────────── FRUIT ─────────────────────────
  {
    id: "pawpaw",
    cat: "fruit",
    emoji: "🍈",
    zm: "Pawpaw",
    what: "Papaya – the same fruit as at home.",
    de: "Papaya",
    shops: [
      { shop: "supermarket", label: "Papaya", note: "All year in the exotic fruit section." },
      { shop: "asian", label: "Papaya", note: "Big ones, and green papaya for salad." },
      { shop: "indian", label: "Papita", script: "पपीता", roman: "papita", note: "Fresh, also green (kacha papita)." }
    ],
    tip: "Ripe papaya gives a little when pressed and is yellow-orange. Green papaya is for cooking or salad.",
    ask: "Ist die Papaya reif?",
    askEn: "Is the papaya ripe?",
    sources: ["https://de.wikipedia.org/wiki/Papaya", "https://www.jamoona.com/products/900g-fresh-kacha-papita-green-papaya"]
  },
  {
    id: "granadilla",
    cat: "fruit",
    emoji: "🟣",
    zm: "Granadilla",
    what: "Zambian granadilla is the purple passion fruit.",
    de: "Passionsfrucht",
    deAlt: ["Maracuja"],
    shops: [
      { shop: "supermarket", label: "Passionsfrucht", note: "Purple, wrinkled, sold singly or in nets, all year." },
      { shop: "supermarket", label: "Maracuja", note: "Often the yellow, more sour type – and the word used on juice (Maracujasaft)." }
    ],
    tip: "Wrinkled skin = ripe and sweet. The orange smooth fruit sold as ‘Grenadille’ is the sweet granadilla – a different, milder fruit.",
    ask: "Haben Sie Passionsfrüchte?",
    askEn: "Do you have passion fruit?",
    sources: ["https://de.wikipedia.org/wiki/Passionsfrucht", "https://en.wikipedia.org/wiki/Passion_fruit"]
  },
  {
    id: "guava",
    cat: "fruit",
    emoji: "🍐",
    zm: "Guava",
    what: "Guava – the same fruit as at home.",
    de: "Guave",
    shops: [
      { shop: "indian", label: "Amrood", script: "अमरूद", roman: "amrood", note: "Jamoona (online) sells fresh guava, also red guava." },
      { shop: "supermarket", label: "Guave", note: "Sometimes, in the exotic section." },
      { shop: "african", label: "Guava juice", note: "Guava drinks (e.g. Rubicon) in Afro and Indian shops." }
    ],
    tip: "Ripe guavas smell strong and sweet and give a little when pressed.",
    ask: "Haben Sie Guaven?",
    askEn: "Do you have guavas?",
    sources: ["https://www.jamoona.com/products/jamoona-fresh-550gfresh-red-guava-brazil", "https://mama-t.de/en/products/rubicon-guava"]
  },
  {
    id: "mango",
    cat: "fruit",
    emoji: "🥭",
    zm: "Mango",
    what: "Mango – the same fruit as at home.",
    de: "Mango",
    deAlt: ["Flugmango", "essreife Mango"],
    shops: [
      { shop: "supermarket", label: "Mango", note: "All year. ‘Essreif’ / ‘ready to eat’ = ripe now." },
      { shop: "indian", label: "Alphonso / Kesar / Chaunsa mango", note: "Indian and Pakistani mangoes in boxes, in season only (spring–summer)." },
      { shop: "turkish", label: "Mango", note: "Often cheaper by the box." }
    ],
    tip: "‘Flugmango’ (flown in ripe) tastes best. Hard mangoes ripen in a few days in a paper bag.",
    ask: "Ist die Mango reif?",
    askEn: "Is the mango ripe?",
    sources: ["https://de.wikipedia.org/wiki/Mango", "https://www.jamoona.com/products/12-pieces-fresh-alphonso-mango-2-7-3-2kg"]
  },
  {
    id: "sugar-cane",
    cat: "fruit",
    emoji: "🎋",
    zm: "Sugar cane",
    what: "Sugar cane stalks for chewing.",
    de: "Zuckerrohr",
    shops: [
      { shop: "indian", label: "Ganna", script: "गन्ना", roman: "ganna", note: "Jamoona (online) sells fresh sugarcane, 1 kg." },
      { shop: "asian", label: "Sugarcane", script: "甘蔗", roman: "gānzhè", note: "Vietnamese: ‘Mía’." }
    ],
    tip: "Peel with a strong knife and chew, like at home. Also the best substitute for sweet reed.",
    ask: "Haben Sie Zuckerrohr?",
    askEn: "Do you have sugar cane?",
    sources: ["https://www.jamoona.com/products/jamoona-fresh-1kg-ganna-sugarcane"]
  },
  {
    id: "masuku",
    cat: "fruit",
    emoji: "🟤",
    zm: "Masuku",
    what: "Wild loquat (Uapaca kirkiana), the sweet brown wild fruit of the Zambian bush.",
    de: "Masuku (Uapaca kirkiana)",
    shops: [
      { shop: "african", label: "Not available", note: "We found no seller in Germany or the EU." }
    ],
    tip: "There is no real substitute in Germany. Enjoy them on your next visit home.",
    ask: "Haben Sie Masuku (Uapaca)?",
    askEn: "Do you have masuku?",
    sources: ["https://en.wikipedia.org/wiki/Uapaca_kirkiana"]
  },
  {
    id: "lemons",
    cat: "fruit",
    emoji: "🍋",
    zm: "Lemons",
    what: "Lemons – the same as at home.",
    de: "Zitronen",
    deAlt: ["Limetten"],
    shops: [
      { shop: "supermarket", label: "Zitronen", note: "Nets of 500 g–1 kg." },
      { shop: "turkish", label: "Limon", note: "Big nets, often cheap." },
      { shop: "market", label: "Zitronen", note: "" }
    ],
    tip: "‘Unbehandelt’ or ‘Bio’ lemons have no wax – use these if you need the peel. Limes are ‘Limetten’.",
    ask: "Sind die Zitronen unbehandelt?",
    askEn: "Are the lemons unwaxed?",
    sources: ["https://de.wikipedia.org/wiki/Zitrone"]
  },
  {
    id: "avocado",
    cat: "fruit",
    emoji: "🥑",
    zm: "Avocado",
    what: "Avocado – the same fruit as at home.",
    de: "Avocado",
    shops: [
      { shop: "supermarket", label: "Avocado", note: "‘Hass’ (dark, bumpy) or smooth green types; ‘essreif’ packs are ready to eat." },
      { shop: "turkish", label: "Avokado", note: "" }
    ],
    tip: "Hard avocados ripen in 2–4 days in a paper bag next to apples or bananas.",
    ask: "Ist die Avocado reif?",
    askEn: "Is the avocado ripe?",
    sources: ["https://de.wikipedia.org/wiki/Avocado"]
  },
  {
    id: "baobab",
    cat: "fruit",
    emoji: "🌳",
    zm: "Baobab fruit",
    what: "The dry, sour pulp of the baobab fruit, sold as powder.",
    de: "Baobab-Pulver",
    deAlt: ["Baobab Fruchtpulver", "Affenbrotbaum"],
    shops: [
      { shop: "african", label: "Baobab powder / Pain de singe", note: "West African brands, much cheaper than ‘superfood’ packs." },
      { shop: "bio", label: "Baobab-Pulver", note: "Reformhaus and organic shops – often 30–40 € per kg." },
      { shop: "online", label: "Guinea Fresh – Baobab Powder", note: "Mama T online." }
    ],
    tip: "Mix with water and sugar for a sour drink, or stir into porridge.",
    ask: "Haben Sie Baobab-Pulver?",
    askEn: "Do you have baobab powder?",
    sources: ["https://www.rewe.de/lexikon/baobab/", "https://mama-t.de/en/products/guinea-fresh-baobab-powder"]
  },

  // ───────────────────────── BAKING & COOKING ─────────────────────────
  {
    id: "cake-flour",
    cat: "baking",
    emoji: "🌾",
    zm: "Cake flour",
    what: "Fine white wheat flour for cakes, scones and fritters.",
    de: "Weizenmehl Type 405",
    deAlt: ["Mehl", "Type 405"],
    shops: [
      { shop: "supermarket", label: "Weizenmehl Type 405", note: "Every supermarket, 1 kg paper bags. The cheapest flour." }
    ],
    tip: "Type 405 is the finest German white flour. Most German recipes that just say ‘Mehl’ mean Type 405.",
    ask: "Wo ist das Mehl Type 405?",
    askEn: "Where is the Type 405 flour?",
    sources: ["https://www.oekotest.de/essen-trinken/mehl-typen-was-bedeuten-die-zahlen-auf-dem-mehl_11593_1.html", "https://www.cooksinfo.com/german-flours"]
  },
  {
    id: "bread-flour",
    cat: "baking",
    emoji: "🌾",
    zm: "Bread flour",
    what: "Wheat flour for bread and rolls.",
    de: "Weizenmehl Type 550",
    deAlt: ["Type 812"],
    shops: [
      { shop: "supermarket", label: "Weizenmehl Type 550", note: "Most supermarkets; Type 812 less often." }
    ],
    tip: "Type 550 is the everyday flour for white bread and rolls. Type 812 is darker and stronger.",
    ask: "Haben Sie Mehl Type 550?",
    askEn: "Do you have Type 550 flour?",
    sources: ["https://www.cooksinfo.com/german-flours", "https://www.oekotest.de/essen-trinken/mehl-typen-was-bedeuten-die-zahlen-auf-dem-mehl_11593_1.html"]
  },
  {
    id: "self-raising",
    cat: "baking",
    emoji: "🌾",
    zm: "Self-raising flour",
    what: "Self-raising flour is not sold in normal German shops – you mix it yourself.",
    de: "Mehl + Backpulver",
    shops: [
      { shop: "supermarket", label: "Weizenmehl Type 405 + Backpulver", note: "Mix it yourself (see tip)." }
    ],
    tip: "Mix 500 g Type 405 with 1 Päckchen Backpulver (about 15 g) – the standard German amount. For 1 cup of flour (about 130 g): 1 level teaspoon baking powder and a pinch of salt.",
    ask: "Haben Sie Backpulver?",
    askEn: "Do you have baking powder?",
    sources: ["https://utopia.de/ratgeber/fehlende-backzutaten-so-ersetzt-du-sie", "https://www.oekotest.de/essen-trinken/mehl-typen-was-bedeuten-die-zahlen-auf-dem-mehl_11593_1.html"]
  },
  {
    id: "bicarb",
    cat: "baking",
    emoji: "🧂",
    zm: "Bicarbonate of soda (soda)",
    what: "Baking soda / sodium bicarbonate.",
    de: "Natron",
    deAlt: ["Kaiser Natron", "Speisenatron"],
    shops: [
      { shop: "supermarket", label: "Natron", note: "Baking shelf, small sachets or a box." },
      { shop: "drugstore", label: "Natron", note: "dm and Rossmann too." }
    ],
    tip: "Ask for ‘Natron’, not ‘Soda’: in German drugstores ‘Soda’ often means washing soda (sodium carbonate) for cleaning – not food. Hirschhornsalz is a different raising agent.",
    ask: "Wo finde ich Natron zum Backen?",
    askEn: "Where can I find baking soda?",
    sources: ["https://de.wikipedia.org/wiki/Natriumhydrogencarbonat", "https://de.wikipedia.org/wiki/Natriumcarbonat"]
  },
  {
    id: "baking-powder",
    cat: "baking",
    emoji: "🧁",
    zm: "Baking powder",
    what: "Baking powder for cakes and scones.",
    de: "Backpulver",
    deAlt: ["Weinstein-Backpulver"],
    shops: [
      { shop: "supermarket", label: "Backpulver", note: "Small sachets (Päckchen, about 15 g), often in packs of 3–5." }
    ],
    tip: "1 Päckchen is for 500 g flour. ‘Weinstein-Backpulver’ works the same.",
    ask: "Wo ist das Backpulver?",
    askEn: "Where is the baking powder?",
    sources: ["https://utopia.de/ratgeber/fehlende-backzutaten-so-ersetzt-du-sie", "https://www.rossmann.de/de/lebensmittel-alnatura-bio-reinweinstein-backpulver/p/0000040045399"]
  },
  {
    id: "yeast",
    cat: "baking",
    emoji: "🍞",
    zm: "Yeast",
    what: "Instant dry yeast or fresh yeast.",
    de: "Hefe",
    deAlt: ["Trockenhefe", "Frische Hefe"],
    shops: [
      { shop: "supermarket", label: "Trockenhefe", note: "Baking shelf, 7 g sachets." },
      { shop: "supermarket", label: "Frische Hefe", note: "In the fridge near the butter: 42 g cubes (Würfel), very cheap." }
    ],
    tip: "1 sachet Trockenhefe (7 g) is about half a cube of fresh yeast (21 g) – enough for 500 g flour.",
    ask: "Wo finde ich Trockenhefe?",
    askEn: "Where can I find dry yeast?",
    sources: ["https://de.wikipedia.org/wiki/Backhefe"]
  },
  {
    id: "icing-sugar",
    cat: "baking",
    emoji: "🍬",
    zm: "Icing sugar",
    what: "Powdered sugar for icing.",
    de: "Puderzucker",
    shops: [
      { shop: "supermarket", label: "Puderzucker", note: "Baking shelf, 250–500 g packs." }
    ],
    tip: "Puderzucker = icing sugar. ‘Zuckerguss’ is the icing you make with it.",
    ask: "Wo ist der Puderzucker?",
    askEn: "Where is the icing sugar?",
    sources: ["https://de.wikipedia.org/wiki/Puderzucker"]
  },
  {
    id: "castor-sugar",
    cat: "baking",
    emoji: "🍬",
    zm: "Castor sugar",
    what: "Very fine white sugar.",
    de: "Feinster Zucker",
    deAlt: ["Backzucker", "Feinzucker"],
    shops: [
      { shop: "supermarket", label: "Feinster Zucker / Backzucker", note: "Baking shelf." }
    ],
    tip: "Normal German ‘Zucker’ is already quite fine; for meringues buy ‘Feinster Backzucker’.",
    ask: "Haben Sie feinen Backzucker?",
    askEn: "Do you have fine baking sugar?",
    sources: ["https://de.wikipedia.org/wiki/Zucker"]
  },
  {
    id: "brown-sugar",
    cat: "baking",
    emoji: "🍬",
    zm: "Brown sugar",
    what: "Light-brown cane sugar.",
    de: "Brauner Zucker",
    deAlt: ["Rohrzucker", "Brauner Rohrzucker"],
    shops: [
      { shop: "supermarket", label: "Brauner Zucker / Rohrzucker", note: "Sugar shelf." }
    ],
    tip: "‘Brauner Rohrzucker’ is closest to Zambian brown sugar. ‘Kandis’ is rock sugar for tea.",
    ask: "Wo finde ich braunen Zucker?",
    askEn: "Where can I find brown sugar?",
    sources: ["https://de.wikipedia.org/wiki/Brauner_Zucker"]
  },
  {
    id: "cooking-oil",
    cat: "baking",
    emoji: "🫗",
    zm: "Cooking oil",
    what: "Neutral vegetable oil for frying.",
    de: "Sonnenblumenöl",
    deAlt: ["Rapsöl", "Pflanzenöl"],
    shops: [
      { shop: "supermarket", label: "Sonnenblumenöl / Rapsöl", note: "Everywhere, 1 L bottles." },
      { shop: "turkish", label: "Ayçiçek yağı", note: "Turkish: sunflower oil. Big 5 L bottles, often cheaper." }
    ],
    tip: "Rapsöl is the cheapest German oil and fine for frying. Choose ‘raffiniert’ for deep-frying; ‘kaltgepresst’ (cold-pressed) is not for high heat.",
    ask: "Wo ist das Sonnenblumenöl?",
    askEn: "Where is the sunflower oil?",
    sources: ["https://de.wikipedia.org/wiki/Sonnenblumenöl"]
  },
  {
    id: "margarine",
    cat: "baking",
    emoji: "🧈",
    zm: "Margarine",
    what: "Margarine for bread and baking.",
    de: "Margarine",
    deAlt: ["Backmargarine", "Pflanzenmargarine"],
    shops: [
      { shop: "supermarket", label: "Margarine", note: "Fridge next to the butter: Rama, Sanella (for baking) or store brands." }
    ],
    tip: "For baking, a block margarine like Sanella works like Zambian baking margarine. Tubs are softer, for bread.",
    ask: "Wo ist die Margarine?",
    askEn: "Where is the margarine?",
    sources: ["https://de.wikipedia.org/wiki/Margarine"]
  },
  {
    id: "tomato-paste",
    cat: "baking",
    emoji: "🍅",
    zm: "Tomato paste",
    what: "Concentrated tomato paste.",
    de: "Tomatenmark",
    deAlt: ["2-fach konzentriert", "Passierte Tomaten"],
    shops: [
      { shop: "supermarket", label: "Tomatenmark", note: "Tubes and small tins." },
      { shop: "turkish", label: "Domates salçası", note: "Turkish: tomato paste. Big jars and tins, cheap. ‘Biber salçası’ is red pepper paste – not the same." }
    ],
    tip: "German Tomatenmark is strong – use a little less. ‘Passierte Tomaten’ = sieved tomatoes; ‘gehackte Tomaten’ = chopped tins.",
    ask: "Wo ist das Tomatenmark?",
    askEn: "Where is the tomato paste?",
    sources: ["https://de.wikipedia.org/wiki/Tomatenmark"]
  },
  {
    id: "stock-cubes",
    cat: "baking",
    emoji: "🧊",
    zm: "Stock cubes / soup powder (e.g. Royco)",
    what: "Flavour cubes and soup or stew powders added to relish.",
    de: "Brühwürfel",
    deAlt: ["Gemüsebrühe", "Rinderbrühe", "Hühnerbrühe"],
    shops: [
      { shop: "supermarket", label: "Brühwürfel / Gemüsebrühe", note: "Knorr and Maggi cubes; powder in jars." },
      { shop: "african", label: "Maggi / Jumbo cubes", note: "West African seasoning cubes (beef, chicken, crayfish) – strong and salty." }
    ],
    tip: "‘Maggi Würze’ is a brown liquid seasoning, not a stock cube. Start with half a cube – German cubes can be salty.",
    ask: "Wo finde ich Brühwürfel?",
    askEn: "Where can I find stock cubes?",
    sources: ["https://de.wikipedia.org/wiki/Brühwürfel", "https://mama-t.de/en/products/jumbo-beef-flavour"]
  },
  {
    id: "curry-powder",
    cat: "baking",
    emoji: "🍛",
    zm: "Curry powder",
    what: "Curry powder for stews and relish.",
    de: "Currypulver",
    deAlt: ["Madras Curry"],
    shops: [
      { shop: "supermarket", label: "Currypulver", note: "Spice shelf – mild and yellow." },
      { shop: "indian", label: "Madras curry powder", note: "Mild or hot, big packs – stronger, closer to Southern African curry." }
    ],
    tip: "German supermarket curry is mild and a bit sweet. Indian ‘Madras curry powder’ tastes closer to Zambian curry.",
    ask: "Haben Sie scharfes Currypulver?",
    askEn: "Do you have hot curry powder?",
    sources: ["https://www.jamoona.com/products/schani-400g-madras-curry-powder-mild"]
  },
  {
    id: "chillies",
    cat: "baking",
    emoji: "🌶️",
    zm: "Chillies (piri-piri / bird's eye)",
    what: "Small, very hot chillies.",
    de: "Chilischoten",
    deAlt: ["Bird's Eye Chili", "Thai-Chili"],
    shops: [
      { shop: "asian", label: "Bird's eye chilli", script: "พริกขี้หนู", roman: "phrik khi nu", note: "Small and very hot – fresh and frozen. Vietnamese: ‘Ớt hiểm’." },
      { shop: "indian", label: "Haree mirch", script: "हरी मिर्च", roman: "haree mirch", note: "Fresh green chillies." },
      { shop: "turkish", label: "Acı biber / Pul biber", note: "Hot green peppers / chilli flakes (medium hot)." },
      { shop: "supermarket", label: "Chilischoten", note: "Small packs. ‘Peperoni’ in Germany are long, mild-hot peppers." }
    ],
    tip: "Freeze fresh chillies – they keep for months and are easy to chop frozen.",
    ask: "Haben Sie kleine, sehr scharfe Chilis?",
    askEn: "Do you have small, very hot chillies?",
    sources: ["https://en.wikipedia.org/wiki/Bird%27s_eye_chili", "https://www.jamoona.com/products/100g-fresh-mirch-red-hot-chillies"]
  },
  {
    id: "salt",
    cat: "baking",
    emoji: "🧂",
    zm: "Salt",
    what: "Table salt.",
    de: "Salz",
    deAlt: ["Jodsalz", "Speisesalz", "Meersalz"],
    shops: [
      { shop: "supermarket", label: "Jodsalz", note: "Spice or baking shelf, 500 g packs." }
    ],
    tip: "‘Jodsalz’ is normal table salt with iodine; ‘mit Fluorid’ also has fluoride. Coarse salt is ‘grobes Salz’.",
    ask: "Wo ist das Salz?",
    askEn: "Where is the salt?",
    sources: ["https://de.wikipedia.org/wiki/Speisesalz"]
  },
  {
    id: "vinegar",
    cat: "baking",
    emoji: "🫙",
    zm: "Vinegar (white)",
    what: "White vinegar with about 5 % acid.",
    de: "Tafelessig",
    deAlt: ["Branntweinessig", "Essig"],
    shops: [
      { shop: "supermarket", label: "Tafelessig / Branntweinessig", note: "Oil and vinegar shelf." }
    ],
    tip: "Careful: ‘Essigessenz’ has 25 % acid – five times stronger than normal vinegar and it can burn your mouth. For cooking buy ‘Tafelessig’ or ‘Branntweinessig’.",
    ask: "Ist das normaler Essig, keine Essigessenz?",
    askEn: "Is this normal vinegar, not vinegar essence?",
    sources: ["https://www.oekotest.de/bauen-wohnen/tafelessig-weisser-essig-essigessenz-co-was-ist-der-unterschied_14113_1.html"]
  },
  {
    id: "lemon-juice",
    cat: "baking",
    emoji: "🍋",
    zm: "Lemon juice",
    what: "Bottled lemon juice.",
    de: "Zitronensaft",
    deAlt: ["Zitronensaft aus Konzentrat"],
    shops: [
      { shop: "supermarket", label: "Zitronensaft", note: "Small bottles near the oil and vinegar or baking shelf." }
    ],
    tip: "Fresh lemons are cheap by the net in Turkish shops – one lemon gives about 2–3 tablespoons of juice.",
    ask: "Wo finde ich Zitronensaft?",
    askEn: "Where can I find lemon juice?",
    sources: ["https://de.wikipedia.org/wiki/Zitronensaft"]
  },

  // ───────────────────────── DRINKS & SNACKS ─────────────────────────
  {
    id: "cordial",
    cat: "drinks",
    emoji: "🧃",
    zm: "Cordial / squash (e.g. Mazoe)",
    what: "Sweet fruit concentrate you mix with water.",
    de: "Sirup",
    deAlt: ["Fruchtsirup", "Orangensirup"],
    shops: [
      { shop: "supermarket", label: "Sirup", note: "Juice aisle or near the soda machines: orange, raspberry, elderflower (Holunderblüte)." },
      { shop: "african", label: "Hibiscus / tamarind / ginger syrup", note: "African syrups (e.g. Zena), also mixed with water." }
    ],
    tip: "We did not find Mazoe in German shops. ‘Orangensirup’ plus water is the closest. ‘Saft’ = juice, ‘Nektar’ = juice with water and sugar, ‘Sirup’ = concentrate.",
    ask: "Haben Sie Orangensirup zum Verdünnen?",
    askEn: "Do you have orange cordial to dilute?",
    sources: ["https://de.wikipedia.org/wiki/Sirup", "https://mama-t.de/en/products/zena-hibiscus-syrup"]
  },
  {
    id: "maheu",
    cat: "drinks",
    emoji: "🥛",
    zm: "Maheu",
    what: "Thin, slightly sour fermented maize-porridge drink.",
    de: "Maheu (selbst machen)",
    deAlt: ["Mageu", "Mahewu"],
    shops: [
      { shop: "african", label: "Maheu / Mageu", note: "Not found in German shops – make it at home (see tip)." }
    ],
    tip: "Traditional method: cook a thin porridge of white maize meal (about 1 cup meal to 7 cups water), let it cool, stir in 1–2 spoons of wheat flour (Type 405) as the starter, cover with a cloth and leave 1–2 days at room temperature until pleasantly sour. Add sugar and chill.",
    ask: "Haben Sie weißes Maismehl?",
    askEn: "Do you have white maize meal?",
    sources: ["https://en.wikipedia.org/wiki/Mageu", "https://open.uct.ac.za/items/98610ba4-34a8-4eb6-af4a-e24056154fd7"]
  },
  {
    id: "munkoyo",
    cat: "drinks",
    emoji: "🥛",
    zm: "Munkoyo",
    what: "Sweet-sour drink made with munkoyo roots and maize meal, fermented overnight.",
    de: "Munkoyo (nicht erhältlich)",
    shops: [
      { shop: "african", label: "Not available", note: "Munkoyo roots are not sold in Germany as far as we found." }
    ],
    tip: "Real munkoyo needs the munkoyo root. Without it, homemade maheu is the closest drink.",
    ask: "Haben Sie Munkoyo-Wurzeln?",
    askEn: "Do you have munkoyo roots?",
    sources: ["https://en.wikipedia.org/wiki/Zambian_cuisine"]
  },
  {
    id: "mabisi",
    cat: "drinks",
    emoji: "🥛",
    zm: "Sour milk (mabisi)",
    what: "Thick, naturally soured milk.",
    de: "Dickmilch",
    deAlt: ["Buttermilch", "Kefir"],
    shops: [
      { shop: "supermarket", label: "Dickmilch", note: "Dairy fridge – thick soured milk, the closest to mabisi. Also Buttermilch and Kefir." },
      { shop: "turkish", label: "Ayran / Kefir", note: "Ayran is a salted yogurt drink – different from mabisi." }
    ],
    tip: "Dickmilch is thick and sour like mabisi – eat it plain, with sugar or with nshima.",
    ask: "Wo finde ich Dickmilch?",
    askEn: "Where can I find soured milk?",
    sources: ["https://de.wikipedia.org/wiki/Dickmilch"]
  },
  {
    id: "rooibos",
    cat: "drinks",
    emoji: "🍵",
    zm: "Rooibos tea",
    what: "Red bush tea from South Africa.",
    de: "Rooibostee",
    deAlt: ["Rotbuschtee"],
    shops: [
      { shop: "supermarket", label: "Rooibostee", note: "Tea shelf everywhere – choose ‘pur’ or ‘natur’ for the plain taste." },
      { shop: "drugstore", label: "Rooibostee", note: "dm and Rossmann own brands." }
    ],
    tip: "Many German rooibos teas are flavoured (vanilla, caramel). For the plain taste look for ‘Rooibos pur’.",
    ask: "Haben Sie Rooibostee ohne Aroma?",
    askEn: "Do you have plain rooibos tea?",
    sources: ["https://de.wikipedia.org/wiki/Rooibos"]
  },
  {
    id: "tea",
    cat: "drinks",
    emoji: "☕",
    zm: "Tea (e.g. Five Roses)",
    what: "Strong black tea, drunk with milk and sugar.",
    de: "Schwarzer Tee",
    deAlt: ["Schwarztee", "Ostfriesische Mischung", "English Breakfast"],
    shops: [
      { shop: "supermarket", label: "Schwarztee", note: "‘Ostfriesische Mischung’ or ‘English Breakfast’ are strong." },
      { shop: "indian", label: "PG Tips / Tetley / Tata Tea / Tapal", note: "British and South Asian strong teas in big packs." },
      { shop: "african", label: "Lipton Yellow Label", note: "Common in Afro shops." },
      { shop: "turkish", label: "Çay", note: "Turkish black tea (e.g. Çaykur) – strong, loose leaf." }
    ],
    tip: "In Germany ‘Tee’ often means herbal or fruit tea – look for ‘Schwarztee’. We did not find Five Roses in German shops.",
    ask: "Wo ist der Schwarztee?",
    askEn: "Where is the black tea?",
    sources: ["https://www.jamoona.com/products/pg-tips-80-teabags-black-tea", "https://mama-t.de/en/products/lipton-yellow-label-black-tea"]
  },
  {
    id: "sweet-reed",
    cat: "drinks",
    emoji: "🎋",
    zm: "Sweet reed",
    what: "Juicy stalks of sweet sorghum, chewed like sugar cane.",
    de: "Zuckerhirse",
    shops: [
      { shop: "indian", label: "Ganna (sugarcane)", script: "गन्ना", roman: "ganna", note: "Best substitute: fresh sugarcane." },
      { shop: "asian", label: "Sugarcane", script: "甘蔗", roman: "gānzhè", note: "Ask." }
    ],
    tip: "Sweet reed is not sold here. Sugarcane is the closest – harder, so cut it in thin sticks.",
    ask: "Haben Sie Zuckerrohr?",
    askEn: "Do you have sugar cane?",
    sources: ["https://www.jamoona.com/products/jamoona-fresh-1kg-ganna-sugarcane", "https://de.wikipedia.org/wiki/Zuckerhirse"]
  },
  {
    id: "popcorn",
    cat: "drinks",
    emoji: "🍿",
    zm: "Popcorn",
    what: "Popping maize kernels.",
    de: "Popcorn-Mais",
    deAlt: ["Puffmais"],
    shops: [
      { shop: "supermarket", label: "Popcorn Mais", note: "Snack or baking shelf; also microwave popcorn." },
      { shop: "indian", label: "Popping corn", note: "500 g packs (e.g. TRS)." }
    ],
    tip: "Normal maize meal or sweet corn will not pop – buy ‘Popcorn-Mais’.",
    ask: "Haben Sie Popcorn-Mais?",
    askEn: "Do you have popcorn kernels?",
    sources: ["https://www.jamoona.com/products/trs-500g-popping-corn-popcorn"]
  },
  {
    id: "vitumbuwa",
    cat: "drinks",
    emoji: "🍩",
    zm: "Vitumbuwa (fritters)",
    what: "Sweet fried balls of wheat dough.",
    de: "Mehl, Hefe, Zucker, Öl",
    shops: [
      { shop: "supermarket", label: "Weizenmehl 405 + Trockenhefe + Zucker + Sonnenblumenöl", note: "Everything is in any supermarket." }
    ],
    tip: "For 500 g Type 405 flour: 1 sachet Trockenhefe (7 g), 3–4 spoons sugar, a pinch of salt and about 350 ml warm water or milk. Let rise 1 hour, then fry spoonfuls in hot oil.",
    ask: "Wo ist die Trockenhefe?",
    askEn: "Where is the dry yeast?",
    sources: ["https://en.wikipedia.org/wiki/Zambian_cuisine"]
  },
  {
    id: "chikanda",
    cat: "drinks",
    emoji: "🟫",
    zm: "Chikanda (African polony)",
    what: "Firm ‘polony’ made from dried wild orchid tubers, groundnuts and chilli.",
    de: "Chikanda (nicht erhältlich)",
    shops: [
      { shop: "african", label: "Not available", note: "Not sold in Germany as far as we found." }
    ],
    tip: "Chikanda is made from wild orchid tubers and we found no seller in Germany. There is no real substitute here – a treat for your visits home.",
    ask: "Haben Sie Chikanda?",
    askEn: "Do you have chikanda?",
    sources: ["https://en.wikipedia.org/wiki/Zambian_cuisine", "https://en.wiktionary.org/wiki/chikanda"]
  }
];
