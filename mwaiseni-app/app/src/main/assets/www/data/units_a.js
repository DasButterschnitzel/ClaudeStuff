window.DATA = window.DATA || {};
window.DATA.unitsA = [
  {
    id: "u01",
    title: "Hello!",
    titleDe: "Hallo!",
    emoji: "👋",
    goal: "Greet people, say goodbye and be polite.",
    tip: {
      title: "du or Sie?",
      text: "Say \"Sie\" to adults you do not know: neighbours, shop staff, doctors and people in offices. Say \"du\" to family, friends and children. If you are not sure, use \"Sie\". It is always polite, and people will tell you when \"du\" is fine."
    },
    words: [
      { de: "Hallo", en: "Hello", emoji: "👋" },
      { de: "Guten Morgen", en: "Good morning", emoji: "🌅" },
      { de: "Guten Tag", en: "Good day", emoji: "☀️" },
      { de: "Guten Abend", en: "Good evening", emoji: "🌆" },
      { de: "Gute Nacht", en: "Good night", emoji: "🌙" },
      { de: "Tschüss", en: "Bye", emoji: "🙋" },
      { de: "Auf Wiedersehen", en: "Goodbye", emoji: "🚪" },
      { de: "Bitte", en: "Please", emoji: "🙏" },
      { de: "Danke", en: "Thank you", emoji: "😊" },
      { de: "Entschuldigung", en: "Sorry, excuse me", emoji: "🙇" },
      { de: "Ja", en: "Yes", emoji: "✅" },
      { de: "Nein", en: "No", emoji: "❌" }
    ],
    sentences: [
      { de: "Wie geht es Ihnen?", en: "How are you?" },
      { de: "Danke, mir geht es gut.", en: "Thanks, I am fine." },
      { de: "Guten Morgen, Frau Schmidt!", en: "Good morning, Mrs Schmidt!" },
      { de: "Entschuldigung, ich verstehe nicht.", en: "Sorry, I don't understand." },
      { de: "Tschüss, bis morgen!", en: "Bye, see you tomorrow!" },
      { de: "Nein, vielen Dank.", en: "No, thank you very much." },
      { de: "Das tut mir leid.", en: "I am sorry." },
      { de: "Einen schönen Tag noch!", en: "Have a nice day!" }
    ],
    dialogue: {
      title: "Meeting the neighbour",
      place: "In the stairwell",
      lines: [
        { who: "Frau Schmidt", me: false, de: "Guten Tag! Sind Sie neu hier?", en: "Hello! Are you new here?" },
        { who: "You", me: true, de: "Guten Tag! Ja, ich bin neu hier.", en: "Hello! Yes, I am new here." },
        { who: "Frau Schmidt", me: false, de: "Herzlich willkommen! Ich bin Frau Schmidt.", en: "Welcome! I am Mrs Schmidt." },
        { who: "You", me: true, de: "Danke schön! Ich heiße {name}.", en: "Thank you! My name is {name}." },
        { who: "Frau Schmidt", me: false, de: "Freut mich. Wie geht es Ihnen?", en: "Nice to meet you. How are you?" },
        { who: "You", me: true, de: "Danke, gut. Und Ihnen?", en: "Fine, thanks. And you?" },
        { who: "Frau Schmidt", me: false, de: "Auch gut, danke. Einen schönen Tag noch!", en: "Fine too, thanks. Have a nice day!" },
        { who: "You", me: true, de: "Danke, gleichfalls. Auf Wiedersehen!", en: "Thanks, you too. Goodbye!" }
      ]
    }
  },
  {
    id: "u02",
    title: "I am …",
    titleDe: "Ich bin …",
    emoji: "🙋",
    goal: "Say your name, where you come from, where you live and which languages you speak.",
    tip: {
      title: "ich wohne, Sie wohnen",
      text: "With \"ich\" the verb ends in -e: ich wohne, ich komme, ich heiße. With \"Sie\" it ends in -en: Sie wohnen, Sie kommen, Sie heißen. Germans write Sambia with an S, but it sounds just like Zambia."
    },
    words: [
      { de: "der Vorname", en: "first name", emoji: "🔤" },
      { de: "der Nachname", en: "surname", emoji: "🪪" },
      { de: "das Land", en: "country", emoji: "🌍" },
      { de: "die Stadt", en: "town", emoji: "🏙️" },
      { de: "Sambia", en: "Zambia", emoji: "🇿🇲" },
      { de: "Deutschland", en: "Germany", emoji: "🇩🇪" },
      { de: "die Sprache", en: "language", emoji: "🗣️" },
      { de: "Englisch", en: "English", emoji: "🇬🇧" },
      { de: "Deutsch", en: "German", emoji: "📘" },
      { de: "wohnen", en: "to live", emoji: "🏠" },
      { de: "sprechen", en: "to speak", emoji: "💬" },
      { de: "heißen", en: "to be called", emoji: "🏷️" }
    ],
    sentences: [
      { de: "Ich heiße {name}.", en: "My name is {name}." },
      { de: "Wie heißen Sie?", en: "What is your name?" },
      { de: "Woher kommen Sie?", en: "Where do you come from?" },
      { de: "Ich komme aus Sambia.", en: "I come from Zambia." },
      { de: "Wo wohnen Sie?", en: "Where do you live?" },
      { de: "Ich wohne in Dreieich.", en: "I live in Dreieich." },
      { de: "Ich spreche Englisch und ein bisschen Deutsch.", en: "I speak English and a little German." },
      { de: "Mein Nachname ist Banda.", en: "My surname is Banda." }
    ],
    dialogue: {
      title: "First day at the German course",
      place: "At the adult education centre in Dreieich",
      lines: [
        { who: "Frau Weber", me: false, de: "Guten Morgen! Wie heißen Sie?", en: "Good morning! What is your name?" },
        { who: "You", me: true, de: "Guten Morgen! Ich heiße {name} Banda.", en: "Good morning! My name is {name} Banda." },
        { who: "Frau Weber", me: false, de: "Woher kommen Sie, Frau Banda?", en: "Where do you come from, Mrs Banda?" },
        { who: "You", me: true, de: "Ich komme aus Sambia, aus Lusaka.", en: "I come from Zambia, from Lusaka." },
        { who: "Frau Weber", me: false, de: "Und wo wohnen Sie jetzt?", en: "And where do you live now?" },
        { who: "You", me: true, de: "Ich wohne jetzt in Dreieich.", en: "I live in Dreieich now." },
        { who: "Frau Weber", me: false, de: "Welche Sprachen sprechen Sie?", en: "Which languages do you speak?" },
        { who: "You", me: true, de: "Ich spreche Englisch und ein bisschen Deutsch.", en: "I speak English and a little German." }
      ]
    }
  },
  {
    id: "u03",
    title: "Numbers 0–20",
    titleDe: "Zahlen 0–20",
    emoji: "🔢",
    goal: "Count to twenty, give your phone number and talk about age.",
    tip: {
      title: "13 to 19 are easy",
      text: "From 13 to 19 you say the small number plus \"zehn\": dreizehn, vierzehn, fünfzehn. Watch out for sechzehn and siebzehn, they are a little shorter. Elf (11) and zwölf (12) are special words. Germans say phone numbers digit by digit, and on the phone you may hear \"zwo\" for zwei."
    },
    words: [
      { de: "null", en: "zero", emoji: "0️⃣" },
      { de: "eins", en: "one", emoji: "1️⃣" },
      { de: "zwei", en: "two", emoji: "2️⃣" },
      { de: "drei", en: "three", emoji: "3️⃣" },
      { de: "vier", en: "four", emoji: "4️⃣" },
      { de: "fünf", en: "five", emoji: "5️⃣" },
      { de: "sechs", en: "six", emoji: "6️⃣" },
      { de: "sieben", en: "seven", emoji: "7️⃣" },
      { de: "acht", en: "eight", emoji: "8️⃣" },
      { de: "neun", en: "nine", emoji: "9️⃣" },
      { de: "zehn", en: "ten", emoji: "🔟" },
      { de: "zwanzig", en: "twenty", emoji: "🔢" }
    ],
    sentences: [
      { de: "Wie ist Ihre Telefonnummer?", en: "What is your phone number?" },
      { de: "Wie alt sind Sie?", en: "How old are you?" },
      { de: "Das Kind ist elf Jahre alt.", en: "The child is eleven years old." },
      { de: "Meine Schwester ist neunzehn Jahre alt.", en: "My sister is nineteen years old." },
      { de: "Sechs und sechs ist zwölf.", en: "Six and six is twelve." },
      { de: "Der Bus kommt in fünfzehn Minuten.", en: "The bus comes in fifteen minutes." },
      { de: "Ich habe Nummer siebzehn.", en: "I have number seventeen." },
      { de: "Noch einmal langsam, bitte.", en: "Once more slowly, please." }
    ],
    dialogue: {
      title: "Numbers at the office",
      place: "At the town hall",
      lines: [
        { who: "Herr Klein", me: false, de: "Guten Tag. Ihre Wartenummer, bitte?", en: "Hello. Your queue number, please?" },
        { who: "You", me: true, de: "Guten Tag. Ich habe Nummer siebzehn.", en: "Hello. I have number seventeen." },
        { who: "Herr Klein", me: false, de: "Gut. Wie ist Ihre Telefonnummer?", en: "Good. What is your phone number?" },
        { who: "You", me: true, de: "Null eins fünf zwei, drei vier fünf, sechs sieben acht.", en: "Zero one five two, three four five, six seven eight." },
        { who: "Herr Klein", me: false, de: "Danke. Wie viele Personen wohnen in der Wohnung?", en: "Thank you. How many people live in the flat?" },
        { who: "You", me: true, de: "Zwei Personen: mein Mann und ich.", en: "Two people: my husband and I." },
        { who: "Herr Klein", me: false, de: "In Ordnung. Bitte gehen Sie in Zimmer vierzehn.", en: "All right. Please go to room fourteen." },
        { who: "You", me: true, de: "Zimmer vierzehn. Vielen Dank!", en: "Room fourteen. Thank you very much!" }
      ]
    }
  },
  {
    id: "u04",
    title: "Numbers & Money",
    titleDe: "Zahlen & Geld",
    emoji: "💶",
    goal: "Understand prices, ask what something costs and pay in cash or by card.",
    tip: {
      title: "One and twenty",
      text: "From 21 on, Germans say the small number first: einundzwanzig is \"one and twenty\", neunundvierzig is \"nine and forty\". The tens are zwanzig, dreißig, vierzig, fünfzig, sechzig, siebzig, achtzig, neunzig. A price like 2,50 € is said \"zwei Euro fünfzig\", and it is written with a comma. Many small shops and bakeries prefer cash, so always carry a few coins."
    },
    words: [
      { de: "hundert", en: "one hundred", emoji: "💯" },
      { de: "tausend", en: "one thousand", emoji: "🔢" },
      { de: "das Geld", en: "money", emoji: "💰" },
      { de: "der Euro", en: "euro", emoji: "💶" },
      { de: "der Cent", en: "cent", emoji: "🪙" },
      { de: "der Preis", en: "price", emoji: "🏷️" },
      { de: "die Karte", en: "card", emoji: "💳" },
      { de: "bar", en: "in cash", emoji: "💵" },
      { de: "bezahlen", en: "to pay", emoji: "👛" },
      { de: "teuer", en: "expensive", emoji: "💎" },
      { de: "günstig", en: "cheap", emoji: "👍" },
      { de: "die Quittung", en: "receipt", emoji: "🧾" }
    ],
    sentences: [
      { de: "Was kostet das?", en: "How much is that?" },
      { de: "Das kostet zwei Euro fünfzig.", en: "That costs two euros fifty." },
      { de: "Das macht zusammen dreißig Euro.", en: "That is thirty euros altogether." },
      { de: "Kann ich mit Karte bezahlen?", en: "Can I pay by card?" },
      { de: "Ich möchte bar bezahlen.", en: "I would like to pay cash." },
      { de: "Das ist zu teuer.", en: "That is too expensive." },
      { de: "Brauchen Sie eine Quittung?", en: "Do you need a receipt?" },
      { de: "Die Jacke kostet neunundvierzig Euro.", en: "The jacket costs forty-nine euros." }
    ],
    dialogue: {
      title: "Buying a bag",
      place: "At the weekly market",
      lines: [
        { who: "You", me: true, de: "Entschuldigung, was kostet die Tasche?", en: "Excuse me, how much is the bag?" },
        { who: "Seller", me: false, de: "Die Tasche kostet fünfunddreißig Euro.", en: "The bag costs thirty-five euros." },
        { who: "You", me: true, de: "Oh, das ist zu teuer.", en: "Oh, that is too expensive." },
        { who: "Seller", me: false, de: "Diese hier ist günstig: nur zwanzig Euro.", en: "This one here is cheap: only twenty euros." },
        { who: "You", me: true, de: "Gut, die nehme ich. Kann ich mit Karte bezahlen?", en: "Good, I will take that one. Can I pay by card?" },
        { who: "Seller", me: false, de: "Leider nein, nur bar.", en: "Sorry, no. Cash only." },
        { who: "You", me: true, de: "Kein Problem. Hier sind zwanzig Euro.", en: "No problem. Here are twenty euros." },
        { who: "Seller", me: false, de: "Danke schön! Einen schönen Tag noch!", en: "Thank you! Have a nice day!" }
      ]
    }
  },
  {
    id: "u05",
    title: "The Family",
    titleDe: "Die Familie",
    emoji: "👪",
    goal: "Talk about your husband, your family in Zambia and your new family in Germany.",
    tip: {
      title: "mein or meine?",
      text: "Use \"mein\" for der and das words: mein Mann, mein Kind. Use \"meine\" for die words and when there is more than one: meine Mutter, meine Eltern. In-laws are easy: just put \"Schwieger-\" in front, as in Schwiegermutter. \"Mein Mann\" means my husband and \"meine Frau\" means my wife."
    },
    words: [
      { de: "die Familie", en: "family", emoji: "👪" },
      { de: "der Mann", en: "husband, man", emoji: "🤵" },
      { de: "das Kind", en: "child", emoji: "🧒" },
      { de: "der Sohn", en: "son", emoji: "👦" },
      { de: "die Tochter", en: "daughter", emoji: "👧" },
      { de: "die Mutter", en: "mother", emoji: "👩" },
      { de: "der Vater", en: "father", emoji: "👨" },
      { de: "die Eltern", en: "parents", emoji: "👫" },
      { de: "der Bruder", en: "brother", emoji: "🙋‍♂️" },
      { de: "die Schwester", en: "sister", emoji: "🙋‍♀️" },
      { de: "die Schwiegermutter", en: "mother-in-law", emoji: "👵" },
      { de: "der Schwiegervater", en: "father-in-law", emoji: "👴" }
    ],
    sentences: [
      { de: "Das ist mein Mann.", en: "This is my husband." },
      { de: "Meine Eltern wohnen in Lusaka.", en: "My parents live in Lusaka." },
      { de: "Ich habe einen Bruder und zwei Schwestern.", en: "I have one brother and two sisters." },
      { de: "Haben Sie Kinder?", en: "Do you have children?" },
      { de: "Meine Schwiegermutter ist sehr nett.", en: "My mother-in-law is very nice." },
      { de: "Wie heißt Ihre Tochter?", en: "What is your daughter's name?" },
      { de: "Ich vermisse meine Familie.", en: "I miss my family." },
      { de: "Mein Schwiegervater wohnt in Langen.", en: "My father-in-law lives in Langen." }
    ],
    dialogue: {
      title: "Looking at family photos",
      place: "At your mother-in-law's home",
      lines: [
        { who: "Mother-in-law", me: false, de: "Ist das deine Familie?", en: "Is that your family?" },
        { who: "You", me: true, de: "Ja. Das sind meine Eltern in Lusaka.", en: "Yes. These are my parents in Lusaka." },
        { who: "Mother-in-law", me: false, de: "Wie schön! Hast du Geschwister?", en: "How lovely! Do you have brothers and sisters?" },
        { who: "You", me: true, de: "Ja, ich habe einen Bruder und zwei Schwestern.", en: "Yes, I have one brother and two sisters." },
        { who: "Mother-in-law", me: false, de: "Wie heißt dein Bruder?", en: "What is your brother's name?" },
        { who: "You", me: true, de: "Er heißt Mulenga. Er ist zwanzig Jahre alt.", en: "His name is Mulenga. He is twenty years old." },
        { who: "Mother-in-law", me: false, de: "Du vermisst deine Familie, oder?", en: "You miss your family, don't you?" },
        { who: "You", me: true, de: "Ja, sehr. Aber jetzt bist du auch meine Familie.", en: "Yes, very much. But now you are my family too." }
      ]
    }
  },
  {
    id: "u06",
    title: "Food & Drink",
    titleDe: "Essen & Trinken",
    emoji: "🍽️",
    goal: "Name common foods and drinks and say what you like to eat and drink.",
    tip: {
      title: "gern = I like it",
      text: "Put \"gern\" after the verb to say you like something: Ich esse gern Reis. Ich trinke gern Tee. If you do not like it, say \"nicht gern\". Before a meal Germans say \"Guten Appetit!\", and many families eat a warm lunch and just bread in the evening."
    },
    words: [
      { de: "das Brot", en: "bread", emoji: "🍞" },
      { de: "der Reis", en: "rice", emoji: "🍚" },
      { de: "das Fleisch", en: "meat", emoji: "🥩" },
      { de: "das Hähnchen", en: "chicken", emoji: "🍗" },
      { de: "der Fisch", en: "fish", emoji: "🐟" },
      { de: "das Gemüse", en: "vegetables", emoji: "🥦" },
      { de: "das Obst", en: "fruit", emoji: "🍎" },
      { de: "das Ei", en: "egg", emoji: "🥚" },
      { de: "das Wasser", en: "water", emoji: "💧" },
      { de: "der Tee", en: "tea", emoji: "🍵" },
      { de: "der Saft", en: "juice", emoji: "🧃" },
      { de: "die Milch", en: "milk", emoji: "🥛" }
    ],
    sentences: [
      { de: "Ich habe Hunger.", en: "I am hungry." },
      { de: "Ich habe großen Durst.", en: "I am very thirsty." },
      { de: "Ich esse gern Reis mit Hähnchen.", en: "I like eating rice with chicken." },
      { de: "Ich trinke gern Tee mit Milch.", en: "I like drinking tea with milk." },
      { de: "Was möchtest du essen?", en: "What would you like to eat?" },
      { de: "Das schmeckt sehr gut.", en: "That tastes very good." },
      { de: "Ich esse nicht gern Fisch.", en: "I don't like eating fish." },
      { de: "Heute koche ich Nshima.", en: "Today I am cooking nshima." }
    ],
    dialogue: {
      title: "What shall we eat?",
      place: "At home in the evening",
      lines: [
        { who: "Your husband", me: false, de: "Hast du Hunger?", en: "Are you hungry?" },
        { who: "You", me: true, de: "Ja, ich habe großen Hunger.", en: "Yes, I am very hungry." },
        { who: "Your husband", me: false, de: "Was möchtest du essen?", en: "What would you like to eat?" },
        { who: "You", me: true, de: "Ich koche heute Nshima mit Hähnchen und Gemüse.", en: "Today I am cooking nshima with chicken and vegetables." },
        { who: "Your husband", me: false, de: "Lecker! Und was trinken wir?", en: "Yummy! And what shall we drink?" },
        { who: "You", me: true, de: "Ich trinke Wasser. Möchtest du Saft?", en: "I am having water. Would you like juice?" },
        { who: "Your husband", me: false, de: "Ja, gern. Ich esse so gern Nshima!", en: "Yes, please. I love eating nshima!" },
        { who: "You", me: true, de: "Schön! In zwanzig Minuten essen wir.", en: "Lovely! We eat in twenty minutes." }
      ]
    }
  },
  {
    id: "u07",
    title: "At the Supermarket",
    titleDe: "Im Supermarkt",
    emoji: "🛒",
    goal: "Do your shopping, ask where things are and get through the checkout.",
    tip: {
      title: "Pfand: money back for bottles",
      text: "Most drink bottles and cans have a deposit called Pfand, between 8 and 25 cents. Bring the empty ones back to the machine in the supermarket and you get a slip to hand in at the checkout. Bags cost money, so bring your own. You pack your shopping yourself, and it goes fast!"
    },
    words: [
      { de: "der Apfel", en: "apple", emoji: "🍎" },
      { de: "die Banane", en: "banana", emoji: "🍌" },
      { de: "die Tomate", en: "tomato", emoji: "🍅" },
      { de: "die Zwiebel", en: "onion", emoji: "🧅" },
      { de: "die Kartoffel", en: "potato", emoji: "🥔" },
      { de: "das Kilo", en: "kilo", emoji: "⚖️" },
      { de: "die Packung", en: "packet", emoji: "📦" },
      { de: "die Flasche", en: "bottle", emoji: "🍾" },
      { de: "das Pfand", en: "bottle deposit", emoji: "♻️" },
      { de: "die Tüte", en: "bag", emoji: "🛍️" },
      { de: "die Kasse", en: "checkout", emoji: "🧾" },
      { de: "der Einkaufswagen", en: "trolley", emoji: "🛒" }
    ],
    sentences: [
      { de: "Wo finde ich den Reis?", en: "Where do I find the rice?" },
      { de: "Ich brauche ein Kilo Tomaten.", en: "I need a kilo of tomatoes." },
      { de: "Eine Packung Eier, bitte.", en: "A packet of eggs, please." },
      { de: "Haben Sie Maismehl?", en: "Do you have mealie meal?" },
      { de: "Brauchen Sie eine Tüte?", en: "Do you need a bag?" },
      { de: "Auf der Flasche ist Pfand.", en: "There is a deposit on the bottle." },
      { de: "Die Bananen sind heute im Angebot.", en: "The bananas are on offer today." },
      { de: "Wo kann ich die Flaschen zurückgeben?", en: "Where can I return the bottles?" }
    ],
    dialogue: {
      title: "At the checkout",
      place: "In a supermarket in Sprendlingen",
      lines: [
        { who: "Cashier", me: false, de: "Hallo! Haben Sie eine Kundenkarte?", en: "Hello! Do you have a loyalty card?" },
        { who: "You", me: true, de: "Nein, leider nicht.", en: "No, sorry." },
        { who: "Cashier", me: false, de: "Brauchen Sie eine Tüte?", en: "Do you need a bag?" },
        { who: "You", me: true, de: "Ja, bitte. Und hier ist mein Pfandbon.", en: "Yes, please. And here is my deposit slip." },
        { who: "Cashier", me: false, de: "Danke. Das macht zwölf Euro vierzig.", en: "Thank you. That is twelve euros forty." },
        { who: "You", me: true, de: "Kann ich mit Karte bezahlen?", en: "Can I pay by card?" },
        { who: "Cashier", me: false, de: "Ja, natürlich. Möchten Sie den Kassenbon?", en: "Yes, of course. Would you like the receipt?" },
        { who: "You", me: true, de: "Nein, danke. Tschüss!", en: "No, thank you. Bye!" }
      ]
    }
  },
  {
    id: "u08",
    title: "At the Bakery & Café",
    titleDe: "Beim Bäcker & im Café",
    emoji: "🥐",
    goal: "Order bread, coffee and cake politely and ask for the bill.",
    tip: {
      title: "Ich hätte gern …",
      text: "\"Ich hätte gern …\" is the polite way to order. \"Ich möchte …\" and \"Ich nehme …\" are fine too. In a café you ask for the bill and pay at your table. A tip of 5 to 10 percent is normal: round up and say \"Stimmt so\", which means keep the change. At the bakery counter you do not need to tip."
    },
    words: [
      { de: "das Brötchen", en: "bread roll", emoji: "🥖" },
      { de: "die Brezel", en: "pretzel", emoji: "🥨" },
      { de: "das Croissant", en: "croissant", emoji: "🥐" },
      { de: "der Kuchen", en: "cake", emoji: "🍰" },
      { de: "der Kaffee", en: "coffee", emoji: "☕" },
      { de: "die Tasse", en: "cup", emoji: "🍵" },
      { de: "das Frühstück", en: "breakfast", emoji: "🍳" },
      { de: "die Speisekarte", en: "menu", emoji: "📋" },
      { de: "die Rechnung", en: "bill", emoji: "🧾" },
      { de: "das Trinkgeld", en: "tip", emoji: "👛" },
      { de: "bestellen", en: "to order", emoji: "📝" },
      { de: "zum Mitnehmen", en: "to take away", emoji: "🥡" }
    ],
    sentences: [
      { de: "Ich hätte gern vier Brötchen.", en: "I would like four bread rolls." },
      { de: "Ich nehme einen Kaffee mit Milch.", en: "I will have a coffee with milk." },
      { de: "Für hier oder zum Mitnehmen?", en: "For here or to take away?" },
      { de: "Sonst noch etwas?", en: "Anything else?" },
      { de: "Nein danke, das war's.", en: "No thanks, that is all." },
      { de: "Ein Stück Kuchen, bitte.", en: "A piece of cake, please." },
      { de: "Die Rechnung, bitte.", en: "The bill, please." },
      { de: "Zahlen Sie zusammen oder getrennt?", en: "Are you paying together or separately?" }
    ],
    dialogue: {
      title: "Fresh rolls in the morning",
      place: "At the bakery in Dreieich",
      lines: [
        { who: "Baker", me: false, de: "Guten Morgen! Was darf es sein?", en: "Good morning! What would you like?" },
        { who: "You", me: true, de: "Guten Morgen! Ich hätte gern vier Brötchen und eine Brezel.", en: "Good morning! I would like four bread rolls and a pretzel." },
        { who: "Baker", me: false, de: "Gern. Sonst noch etwas?", en: "Certainly. Anything else?" },
        { who: "You", me: true, de: "Ja, einen Kaffee zum Mitnehmen, bitte.", en: "Yes, a coffee to take away, please." },
        { who: "Baker", me: false, de: "Mit Milch und Zucker?", en: "With milk and sugar?" },
        { who: "You", me: true, de: "Nur mit Milch, bitte. Das war's.", en: "Just milk, please. That is all." },
        { who: "Baker", me: false, de: "Das macht fünf Euro achtzig.", en: "That is five euros eighty." },
        { who: "You", me: true, de: "Bitte schön. Einen schönen Tag noch!", en: "Here you are. Have a nice day!" }
      ]
    }
  },
  {
    id: "u09",
    title: "Time & Days",
    titleDe: "Uhrzeit & Tage",
    emoji: "🕘",
    goal: "Tell the time, name the days and make an appointment.",
    tip: {
      title: "halb acht is 7:30!",
      text: "Careful with \"halb\": halb acht means half past seven, because it is half way to eight. Use \"um\" for clock times and \"am\" for days: um neun Uhr, am Montag. The months sound almost like English: Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember. In Germany it is polite to be on time, and five minutes early is perfect."
    },
    words: [
      { de: "der Montag", en: "Monday", emoji: "🌙" },
      { de: "der Dienstag", en: "Tuesday", emoji: "💼" },
      { de: "der Mittwoch", en: "Wednesday", emoji: "⚖️" },
      { de: "der Donnerstag", en: "Thursday", emoji: "⚡" },
      { de: "der Freitag", en: "Friday", emoji: "🎉" },
      { de: "der Samstag", en: "Saturday", emoji: "🛍️" },
      { de: "der Sonntag", en: "Sunday", emoji: "☀️" },
      { de: "heute", en: "today", emoji: "📍" },
      { de: "morgen", en: "tomorrow", emoji: "⏭️" },
      { de: "gestern", en: "yesterday", emoji: "⏮️" },
      { de: "die Uhr", en: "clock", emoji: "⏰" },
      { de: "der Monat", en: "month", emoji: "🗓️" }
    ],
    sentences: [
      { de: "Wie spät ist es?", en: "What time is it?" },
      { de: "Es ist halb acht.", en: "It is half past seven." },
      { de: "Es ist Viertel nach drei.", en: "It is quarter past three." },
      { de: "Um wie viel Uhr kommt der Bus?", en: "What time does the bus come?" },
      { de: "Der Kurs beginnt um neun Uhr.", en: "The course starts at nine o'clock." },
      { de: "Morgen habe ich einen Termin.", en: "Tomorrow I have an appointment." },
      { de: "Am Sonntag sind die Geschäfte geschlossen.", en: "On Sunday the shops are closed." },
      { de: "Gestern war ich in Frankfurt.", en: "Yesterday I was in Frankfurt." }
    ],
    dialogue: {
      title: "Making an appointment",
      place: "On the phone with the doctor's surgery",
      lines: [
        { who: "Receptionist", me: false, de: "Praxis Doktor Wagner, guten Tag!", en: "Dr Wagner's surgery, hello!" },
        { who: "You", me: true, de: "Guten Tag, hier ist {name} Banda. Ich brauche einen Termin.", en: "Hello, this is {name} Banda. I need an appointment." },
        { who: "Receptionist", me: false, de: "Geht es am Donnerstag um zehn Uhr?", en: "Is Thursday at ten o'clock all right?" },
        { who: "You", me: true, de: "Am Donnerstag habe ich Deutschkurs. Geht es am Freitag?", en: "On Thursday I have my German class. Is Friday possible?" },
        { who: "Receptionist", me: false, de: "Ja, am Freitag um halb neun.", en: "Yes, on Friday at half past eight." },
        { who: "You", me: true, de: "Um halb neun, sehr gut.", en: "At half past eight, very good." },
        { who: "Receptionist", me: false, de: "Bitte bringen Sie Ihre Versichertenkarte mit.", en: "Please bring your health insurance card." },
        { who: "You", me: true, de: "Ja, das mache ich. Vielen Dank, auf Wiederhören!", en: "Yes, I will. Thank you very much, goodbye!" }
      ]
    }
  },
  {
    id: "u10",
    title: "At Home",
    titleDe: "Zu Hause",
    emoji: "🏠",
    goal: "Name the rooms and things in your home and say where something is.",
    tip: {
      title: "im Bad, in der Küche",
      text: "To say where something is, use \"im\" for der and das words and \"in der\" for die words: im Bad, im Wohnzimmer, in der Küche. Germans sort their rubbish carefully: paper, packaging, food waste and the rest go in different bins. Sundays and nights after 10 pm are quiet times, so no loud music or drilling then."
    },
    words: [
      { de: "die Wohnung", en: "flat", emoji: "🏢" },
      { de: "die Küche", en: "kitchen", emoji: "🍳" },
      { de: "das Wohnzimmer", en: "living room", emoji: "🛋️" },
      { de: "das Schlafzimmer", en: "bedroom", emoji: "😴" },
      { de: "das Bad", en: "bathroom", emoji: "🛁" },
      { de: "der Stuhl", en: "chair", emoji: "🪑" },
      { de: "das Bett", en: "bed", emoji: "🛏️" },
      { de: "der Kühlschrank", en: "fridge", emoji: "🧊" },
      { de: "die Waschmaschine", en: "washing machine", emoji: "🧺" },
      { de: "die Tür", en: "door", emoji: "🚪" },
      { de: "der Schlüssel", en: "key", emoji: "🔑" },
      { de: "der Müll", en: "rubbish", emoji: "🗑️" }
    ],
    sentences: [
      { de: "Wo ist mein Schlüssel?", en: "Where is my key?" },
      { de: "Dein Schlüssel liegt auf dem Tisch.", en: "Your key is on the table." },
      { de: "Die Milch ist im Kühlschrank.", en: "The milk is in the fridge." },
      { de: "Die Waschmaschine steht im Keller.", en: "The washing machine is in the cellar." },
      { de: "Ich koche in der Küche.", en: "I cook in the kitchen." },
      { de: "Das Bad ist neben dem Schlafzimmer.", en: "The bathroom is next to the bedroom." },
      { de: "Kannst du bitte den Müll rausbringen?", en: "Can you take the rubbish out, please?" },
      { de: "Bitte mach die Tür zu.", en: "Please close the door." }
    ],
    dialogue: {
      title: "Where is my key?",
      place: "At home, before going out",
      lines: [
        { who: "You", me: true, de: "Schatz, wo ist mein Schlüssel?", en: "Darling, where is my key?" },
        { who: "Your husband", me: false, de: "Ist er nicht in der Küche?", en: "Isn't it in the kitchen?" },
        { who: "You", me: true, de: "Nein, in der Küche ist er nicht.", en: "No, it is not in the kitchen." },
        { who: "Your husband", me: false, de: "Vielleicht im Wohnzimmer, auf dem Sofa?", en: "Maybe in the living room, on the sofa?" },
        { who: "You", me: true, de: "Nein, da ist er auch nicht.", en: "No, it is not there either." },
        { who: "Your husband", me: false, de: "Moment … Er steckt in der Tür!", en: "Wait … It is in the door!" },
        { who: "You", me: true, de: "Oh nein! Danke, Schatz.", en: "Oh no! Thank you, darling." },
        { who: "Your husband", me: false, de: "Gern. Und nimm bitte den Müll mit!", en: "You're welcome. And please take the rubbish with you!" }
      ]
    }
  },
  {
    id: "u11",
    title: "Finding the Way",
    titleDe: "Der Weg",
    emoji: "🧭",
    goal: "Ask for directions and understand the way to places in town.",
    tip: {
      title: "zum or zur?",
      text: "After \"Wie komme ich\" use \"zum\" for der and das words and \"zur\" for die words: zum Bahnhof, zum Rathaus, zur Post, zur Apotheke. Always start with \"Entschuldigung\" when you stop someone in the street. If the answer is too fast, say \"Bitte langsam\". Most people are happy to help."
    },
    words: [
      { de: "links", en: "left", emoji: "⬅️" },
      { de: "rechts", en: "right", emoji: "➡️" },
      { de: "geradeaus", en: "straight ahead", emoji: "⬆️" },
      { de: "die Straße", en: "street", emoji: "🛣️" },
      { de: "die Ampel", en: "traffic lights", emoji: "🚦" },
      { de: "die Ecke", en: "corner", emoji: "↪️" },
      { de: "das Rathaus", en: "town hall", emoji: "🏛️" },
      { de: "der Bahnhof", en: "railway station", emoji: "🚉" },
      { de: "die Apotheke", en: "pharmacy", emoji: "💊" },
      { de: "die Post", en: "post office", emoji: "📮" },
      { de: "die Bank", en: "bank", emoji: "🏦" },
      { de: "das Krankenhaus", en: "hospital", emoji: "🏥" }
    ],
    sentences: [
      { de: "Wie komme ich zum Bahnhof?", en: "How do I get to the station?" },
      { de: "Wie komme ich zur Apotheke?", en: "How do I get to the pharmacy?" },
      { de: "Gehen Sie hier geradeaus.", en: "Go straight ahead here." },
      { de: "An der Ampel gehen Sie links.", en: "At the traffic lights, go left." },
      { de: "Dann die zweite Straße rechts.", en: "Then the second street on the right." },
      { de: "Die Post ist gleich um die Ecke.", en: "The post office is just round the corner." },
      { de: "Ist das weit von hier?", en: "Is that far from here?" },
      { de: "Das Rathaus ist neben der Bank.", en: "The town hall is next to the bank." }
    ],
    dialogue: {
      title: "Asking the way",
      place: "In the centre of Sprendlingen",
      lines: [
        { who: "You", me: true, de: "Entschuldigung, wie komme ich zum Rathaus?", en: "Excuse me, how do I get to the town hall?" },
        { who: "Passer-by", me: false, de: "Gehen Sie hier geradeaus bis zur Ampel.", en: "Go straight ahead here as far as the traffic lights." },
        { who: "You", me: true, de: "Geradeaus bis zur Ampel. Und dann?", en: "Straight ahead to the traffic lights. And then?" },
        { who: "Passer-by", me: false, de: "Dann gehen Sie rechts. Das Rathaus ist neben der Bank.", en: "Then go right. The town hall is next to the bank." },
        { who: "You", me: true, de: "Ist das weit?", en: "Is it far?" },
        { who: "Passer-by", me: false, de: "Nein, nur fünf Minuten zu Fuß.", en: "No, only five minutes on foot." },
        { who: "You", me: true, de: "Vielen Dank für Ihre Hilfe!", en: "Thank you very much for your help!" },
        { who: "Passer-by", me: false, de: "Gern geschehen. Schönen Tag noch!", en: "You're welcome. Have a nice day!" }
      ]
    }
  },
  {
    id: "u12",
    title: "Bus & Train",
    titleDe: "Bus & Bahn",
    emoji: "🚌",
    goal: "Take the bus and the S-Bahn, ask about tickets and understand delays.",
    tip: {
      title: "The Deutschlandticket",
      text: "With the Deutschlandticket you can use all buses, trams, S-Bahn and regional trains in Germany for one monthly price. It is not valid on the fast ICE and IC trains. Without it, buy your ticket before you get on the S-Bahn, because inspectors check and the fine is high. From Buchschlag the S3 and S4 take you to the centre of Frankfurt in about 20 minutes."
    },
    words: [
      { de: "der Bus", en: "bus", emoji: "🚌" },
      { de: "die S-Bahn", en: "suburban train", emoji: "🚈" },
      { de: "der Zug", en: "train", emoji: "🚆" },
      { de: "die Haltestelle", en: "stop", emoji: "🚏" },
      { de: "die Fahrkarte", en: "ticket", emoji: "🎫" },
      { de: "das Gleis", en: "platform", emoji: "🛤️" },
      { de: "die Abfahrt", en: "departure", emoji: "⏱️" },
      { de: "die Verspätung", en: "delay", emoji: "⏳" },
      { de: "der Fahrplan", en: "timetable", emoji: "📋" },
      { de: "einsteigen", en: "to get on", emoji: "⤴️" },
      { de: "aussteigen", en: "to get off", emoji: "⤵️" },
      { de: "umsteigen", en: "to change", emoji: "🔄" }
    ],
    sentences: [
      { de: "Fährt dieser Bus nach Sprendlingen?", en: "Does this bus go to Sprendlingen?" },
      { de: "Wann fährt der nächste Bus?", en: "When does the next bus leave?" },
      { de: "Eine Fahrkarte nach Frankfurt, bitte.", en: "A ticket to Frankfurt, please." },
      { de: "Ich habe ein Deutschlandticket.", en: "I have a Deutschlandticket." },
      { de: "Von welchem Gleis fährt die S3?", en: "Which platform does the S3 leave from?" },
      { de: "Die S-Bahn hat zehn Minuten Verspätung.", en: "The S-Bahn is ten minutes late." },
      { de: "Wo muss ich umsteigen?", en: "Where do I have to change?" },
      { de: "Ich steige in Buchschlag aus.", en: "I get off at Buchschlag." }
    ],
    dialogue: {
      title: "The right bus?",
      place: "At a bus stop in Dreieich",
      lines: [
        { who: "You", me: true, de: "Guten Tag! Fährt dieser Bus nach Sprendlingen?", en: "Hello! Does this bus go to Sprendlingen?" },
        { who: "Bus driver", me: false, de: "Nein, dieser Bus fährt nach Dreieichenhain.", en: "No, this bus goes to Dreieichenhain." },
        { who: "You", me: true, de: "Oh. Welcher Bus fährt nach Sprendlingen?", en: "Oh. Which bus goes to Sprendlingen?" },
        { who: "Bus driver", me: false, de: "Der nächste Bus hier. Er kommt in fünf Minuten.", en: "The next bus here. It comes in five minutes." },
        { who: "You", me: true, de: "Danke. Ist mein Deutschlandticket hier gültig?", en: "Thank you. Is my Deutschlandticket valid here?" },
        { who: "Bus driver", me: false, de: "Ja, natürlich. Das gilt in allen Bussen.", en: "Yes, of course. It is valid on all buses." },
        { who: "You", me: true, de: "Super, vielen Dank!", en: "Great, thank you very much!" },
        { who: "Bus driver", me: false, de: "Gern. Gute Fahrt!", en: "You're welcome. Have a good trip!" }
      ]
    }
  }
];
