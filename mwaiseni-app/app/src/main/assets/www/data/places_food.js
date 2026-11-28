// Mwaiseni – food shops near Dreieich (Asian, Turkish, South Asian, Eastern European).
// Researched 28 Nov 2026. Only shops confirmed by at least two independent sources (official site, city directory,
// Gelbe Seiten, OpenStreetMap). Coordinates: OpenStreetMap / Nominatim. Fields that could not be verified are left out.
window.DATA = window.DATA || {};
window.DATA.placesFood = [
  {
    id: "asia-mekong-offenbach",
    cat: "shop",
    name: "Asia Mekong Tran Thanh",
    what: "Big Asian supermarket on two floors: Chinese, Thai, Vietnamese and Japanese food, frozen meat and fish. A good place to ask for yu choy (油菜), Thai eggplant, dried anchovies (ikan bilis), frozen tilapia and chicken feet.",
    address: "Luisenstraße 71–73, 63067 Offenbach am Main",
    lat: 50.10476, lon: 8.75631,
    phone: "+49 69 824459",
    tip: "Open the Food finder in the app and show the staff the Chinese characters – that is the quickest way to find a vegetable.",
    source: "https://www.offenbach.de/verzeichnisse/forumEinzelhandel/asiatischer-supermarkt-mekong-tran-thanh.php?loc=en"
  },
  {
    id: "hayatmarkt-offenbach",
    cat: "shop",
    name: "Hayatmarkt",
    what: "Turkish and Mediterranean supermarket with fresh fruit and vegetables every day and its own bakery. Ask for barbunya (sugar-bean type), bamya (okra), pazı (chard), raw peanuts (çiğ fıstık) and big tins of domates salçası.",
    address: "Starkenburgring 71, 63069 Offenbach am Main",
    lat: 50.09637, lon: 8.75630,
    phone: "+49 69 83009451",
    web: "https://hayatmarkt.de/",
    hours: "Mon–Sat 8:00–20:00",
    tip: "Their delivery listing mentions halal meat – ask at the counter for işkembe (tripe) or keçi eti (goat).",
    source: "https://hayatmarkt.de/"
  },
  {
    id: "internationale-lebensmittel-sprendlingen",
    cat: "shop",
    name: "Internationale Lebensmittel (Turkish grocery)",
    what: "Small Turkish / international grocery in Sprendlingen – the closest one for Dreieich. Ask for bamya (okra), barbunya beans, börülce (black-eyed beans) and domates salçası.",
    address: "Frankfurter Straße 106, 63303 Dreieich",
    lat: 50.02600, lon: 8.69523,
    phone: "+49 6103 66092",
    tip: "Listed as ‘Internationale Lebensmittel’ in Gelbe Seiten and as ‘Türkische Lebensmittel’ on OpenStreetMap. Opening hours not confirmed – call before a special trip.",
    source: "https://www.gelbeseiten.de/suche/lebensmittel/dreieich"
  },
  {
    id: "na-desi-shop-neu-isenburg",
    cat: "shop",
    name: "NA Desi Shop",
    what: "South Asian (Indian / Pakistani) grocery. Ask for bhindi (okra), lobiya (black-eyed beans), soya chunks, raw red peanuts, Madras curry powder and big bags of basmati.",
    address: "Wilhelm-Leuschner-Straße 71, 63263 Neu-Isenburg",
    lat: 50.05322, lon: 8.68305,
    phone: "+49 176 62792597",
    tip: "Opening hours not confirmed – call first. Show the Hindi word from the Food finder (e.g. भिंडी for okra).",
    source: "https://www.gelbeseiten.de/suche/lebensmittel/neu-isenburg"
  },
  {
    id: "mix-markt-offenbach",
    cat: "shop",
    name: "Mix Markt Offenbach",
    what: "Eastern European supermarket chain. Shops like this usually have kefir and other soured-milk products (close to mabisi), big bottles of sunflower oil and smoked sausages – check in store.",
    address: "Richard-Wagner-Straße 32, 63069 Offenbach am Main",
    lat: 50.08903, lon: 8.75565,
    phone: "+49 69 83005988",
    web: "https://www.mixmarkt.eu/de/germany/maerkte/36/",
    hours: "Mon–Sat 9:00–20:00",
    tip: "Look in the dairy fridge for ‘Kefir’ and other soured-milk drinks.",
    source: "https://www.mixmarkt.eu/de/germany/maerkte/36/"
  }
];
