window.DATA = window.DATA || {};
window.DATA.unitsB = [
  {
    id: "u13",
    title: "At the doctor",
    titleDe: "Beim Arzt",
    emoji: "🩺",
    goal: "Say what hurts and make a doctor's appointment.",
    tip: {
      title: "Your health card",
      text: "Always take your health insurance card (Versichertenkarte) with you to the doctor. Call first and ask for a Termin. At night or at the weekend, if it is not an emergency, call 116 117 for the on-call doctor. A woman doctor is called die Ärztin."
    },
    words: [
      { de: "der Arzt", en: "doctor", emoji: "👨‍⚕️" },
      { de: "die Praxis", en: "doctor's practice", emoji: "🏥" },
      { de: "der Termin", en: "appointment", emoji: "📅" },
      { de: "die Versichertenkarte", en: "health insurance card", emoji: "💳" },
      { de: "der Kopf", en: "head", emoji: "🧠" },
      { de: "der Zahn", en: "tooth", emoji: "🦷" },
      { de: "das Ohr", en: "ear", emoji: "👂" },
      { de: "der Arm", en: "arm", emoji: "💪" },
      { de: "das Bein", en: "leg", emoji: "🦵" },
      { de: "der Fuß", en: "foot", emoji: "🦶" },
      { de: "das Fieber", en: "fever", emoji: "🌡️" },
      { de: "die Schmerzen", en: "pain", emoji: "🤕" }
    ],
    sentences: [
      { de: "Ich habe Kopfschmerzen.", en: "I have a headache." },
      { de: "Wo tut es weh?", en: "Where does it hurt?" },
      { de: "Mein Rücken tut weh.", en: "My back hurts." },
      { de: "Ich habe Fieber und Halsschmerzen.", en: "I have a fever and a sore throat." },
      { de: "Ich brauche einen Termin.", en: "I need an appointment." },
      { de: "Hier ist meine Versichertenkarte.", en: "Here is my health insurance card." },
      { de: "Ich habe seit gestern Bauchschmerzen.", en: "I have had a stomach ache since yesterday." },
      { de: "Bitte nehmen Sie im Wartezimmer Platz.", en: "Please take a seat in the waiting room." }
    ],
    dialogue: {
      title: "Calling the doctor's office",
      place: "On the phone",
      lines: [
        { who: "Praxis", me: false, de: "Praxis Dr. Weber, guten Morgen.", en: "Dr Weber's practice, good morning." },
        { who: "You", me: true, de: "Guten Morgen, hier ist {name} Banda. Ich brauche einen Termin.", en: "Good morning, this is {name} Banda. I need an appointment." },
        { who: "Praxis", me: false, de: "Was fehlt Ihnen denn?", en: "What is the matter?" },
        { who: "You", me: true, de: "Ich habe Fieber und Kopfschmerzen.", en: "I have a fever and a headache." },
        { who: "Praxis", me: false, de: "Können Sie heute um elf Uhr kommen?", en: "Can you come today at eleven o'clock?" },
        { who: "You", me: true, de: "Ja, das geht. Vielen Dank!", en: "Yes, that works. Thank you very much!" },
        { who: "Praxis", me: false, de: "Bitte bringen Sie Ihre Versichertenkarte mit. Gute Besserung!", en: "Please bring your health insurance card. Get well soon!" },
        { who: "You", me: true, de: "Danke, bis später.", en: "Thank you, see you later." }
      ]
    }
  },
  {
    id: "u14",
    title: "At the pharmacy",
    titleDe: "In der Apotheke",
    emoji: "💊",
    goal: "Buy medicine and understand how to take it.",
    tip: {
      title: "Look for the red A",
      text: "A big red A on the wall means Apotheke. For some medicine you need a Rezept from your doctor. Today it is usually saved on your health card, so just give the card to the pharmacist. At night and on Sundays one pharmacy nearby is always open: search for 'Apotheken-Notdienst'."
    },
    words: [
      { de: "die Apotheke", en: "pharmacy", emoji: "⚕️" },
      { de: "das Medikament", en: "medicine", emoji: "💊" },
      { de: "das Rezept", en: "prescription", emoji: "📝" },
      { de: "der Husten", en: "cough", emoji: "😷" },
      { de: "die Erkältung", en: "cold (illness)", emoji: "🤧" },
      { de: "der Schnupfen", en: "runny nose", emoji: "👃" },
      { de: "die Allergie", en: "allergy", emoji: "🌼" },
      { de: "der Hustensaft", en: "cough syrup", emoji: "🥄" },
      { de: "die Salbe", en: "ointment", emoji: "🧴" },
      { de: "das Pflaster", en: "plaster", emoji: "🩹" },
      { de: "die Tropfen", en: "drops", emoji: "💧" },
      { de: "täglich", en: "daily", emoji: "📆" }
    ],
    sentences: [
      { de: "Ich habe Husten und Schnupfen.", en: "I have a cough and a runny nose." },
      { de: "Haben Sie etwas gegen Erkältung?", en: "Do you have something for a cold?" },
      { de: "Nehmen Sie die Tabletten dreimal täglich.", en: "Take the tablets three times a day." },
      { de: "Brauche ich dafür ein Rezept?", en: "Do I need a prescription for this?" },
      { de: "Ich habe eine Allergie.", en: "I have an allergy." },
      { de: "Hier ist mein Rezept.", en: "Here is my prescription." },
      { de: "Nehmen Sie die Tropfen nach dem Essen.", en: "Take the drops after eating." },
      { de: "Wie oft muss ich das nehmen?", en: "How often do I have to take this?" }
    ],
    dialogue: {
      title: "Something for a cough",
      place: "At the pharmacy in Sprendlingen",
      lines: [
        { who: "Apothekerin", me: false, de: "Guten Tag. Was kann ich für Sie tun?", en: "Good afternoon. What can I do for you?" },
        { who: "You", me: true, de: "Guten Tag. Ich bin erkältet und habe Husten.", en: "Good afternoon. I have a cold and a cough." },
        { who: "Apothekerin", me: false, de: "Haben Sie auch Fieber?", en: "Do you have a fever too?" },
        { who: "You", me: true, de: "Nein, aber ich habe Halsschmerzen.", en: "No, but I have a sore throat." },
        { who: "Apothekerin", me: false, de: "Dann empfehle ich Ihnen diesen Hustensaft. Nehmen Sie dreimal täglich einen Löffel.", en: "Then I recommend this cough syrup. Take one spoonful three times a day." },
        { who: "You", me: true, de: "Brauche ich dafür ein Rezept?", en: "Do I need a prescription for it?" },
        { who: "Apothekerin", me: false, de: "Nein, den bekommen Sie ohne Rezept. Das macht neun Euro.", en: "No, you can get it without a prescription. That is nine euros." },
        { who: "You", me: true, de: "Hier, bitte. Vielen Dank!", en: "Here you are. Thank you very much!" }
      ]
    }
  },
  {
    id: "u15",
    title: "Clothes & colours",
    titleDe: "Kleidung & Farben",
    emoji: "👗",
    goal: "Shop for clothes and ask for your size and colour.",
    tip: {
      title: "Sizes and trying on",
      text: "Women's sizes in Germany are numbers like 38, 40 and 42, or letters like S, M and L. You can always try clothes on in the Umkleidekabine. Keep your receipt (Kassenbon): many shops let you bring clothes back if they do not fit."
    },
    words: [
      { de: "die Hose", en: "trousers", emoji: "👖" },
      { de: "das Kleid", en: "dress", emoji: "👗" },
      { de: "die Bluse", en: "blouse", emoji: "👚" },
      { de: "die Schuhe", en: "shoes", emoji: "👟" },
      { de: "die Größe", en: "size", emoji: "📏" },
      { de: "die Farbe", en: "colour", emoji: "🎨" },
      { de: "rot", en: "red", emoji: "🔴" },
      { de: "blau", en: "blue", emoji: "🔵" },
      { de: "grün", en: "green", emoji: "🟢" },
      { de: "schwarz", en: "black", emoji: "⚫" },
      { de: "weiß", en: "white", emoji: "⚪" },
      { de: "anprobieren", en: "to try on", emoji: "🪞" }
    ],
    sentences: [
      { de: "Haben Sie das in Größe M?", en: "Do you have this in size M?" },
      { de: "Kann ich das anprobieren?", en: "Can I try this on?" },
      { de: "Die Hose ist zu groß.", en: "The trousers are too big." },
      { de: "Das Kleid ist zu klein.", en: "The dress is too small." },
      { de: "Wo ist die Umkleidekabine?", en: "Where is the fitting room?" },
      { de: "Das gelbe Kleid gefällt mir.", en: "I like the yellow dress." },
      { de: "Ich suche eine schwarze Hose.", en: "I am looking for black trousers." },
      { de: "Was kostet die blaue Bluse?", en: "How much is the blue blouse?" }
    ],
    dialogue: {
      title: "Trying on a dress",
      place: "In a clothes shop in Frankfurt",
      lines: [
        { who: "You", me: true, de: "Entschuldigung, haben Sie dieses Kleid in Größe M?", en: "Excuse me, do you have this dress in size M?" },
        { who: "Verkäuferin", me: false, de: "Ja, in Rot und in Blau. Welche Farbe möchten Sie?", en: "Yes, in red and in blue. Which colour would you like?" },
        { who: "You", me: true, de: "Blau, bitte. Kann ich es anprobieren?", en: "Blue, please. Can I try it on?" },
        { who: "Verkäuferin", me: false, de: "Natürlich. Die Umkleidekabine ist dort hinten.", en: "Of course. The fitting room is at the back over there." },
        { who: "You", me: true, de: "Es ist leider zu klein. Haben Sie es auch in L?", en: "Unfortunately it is too small. Do you have it in L as well?" },
        { who: "Verkäuferin", me: false, de: "Einen Moment, ich schaue nach. Hier, bitte.", en: "One moment, I will have a look. Here you are." },
        { who: "You", me: true, de: "Das passt gut. Ich nehme es.", en: "That fits well. I will take it." },
        { who: "Verkäuferin", me: false, de: "Sehr schön! Die Kasse ist vorne links.", en: "Lovely! The till is at the front on the left." }
      ]
    }
  },
  {
    id: "u16",
    title: "Weather & seasons",
    titleDe: "Wetter & Jahreszeiten",
    emoji: "🌦️",
    goal: "Talk about the weather and dress for the German seasons.",
    tip: {
      title: "Dress like an onion",
      text: "German winters are much colder and darker than in Lusaka. People wear many thin layers, like an onion, and take one off when it gets warm inside. Germans like to say: there is no bad weather, only the wrong clothes. The weather is also the easiest small talk with neighbours."
    },
    words: [
      { de: "das Wetter", en: "weather", emoji: "🌤️" },
      { de: "die Sonne", en: "sun", emoji: "☀️" },
      { de: "der Regen", en: "rain", emoji: "🌧️" },
      { de: "der Schnee", en: "snow", emoji: "❄️" },
      { de: "kalt", en: "cold", emoji: "🥶" },
      { de: "warm", en: "warm", emoji: "🌡️" },
      { de: "der Winter", en: "winter", emoji: "⛄" },
      { de: "der Sommer", en: "summer", emoji: "🏖️" },
      { de: "die Jacke", en: "jacket", emoji: "🧥" },
      { de: "die Mütze", en: "woolly hat", emoji: "🧢" },
      { de: "die Handschuhe", en: "gloves", emoji: "🧤" },
      { de: "der Schal", en: "scarf", emoji: "🧣" }
    ],
    sentences: [
      { de: "Wie ist das Wetter heute?", en: "What is the weather like today?" },
      { de: "Heute regnet es.", en: "It is raining today." },
      { de: "Es ist sehr kalt.", en: "It is very cold." },
      { de: "Im Winter schneit es manchmal.", en: "In winter it sometimes snows." },
      { de: "Im Frühling scheint die Sonne.", en: "In spring the sun shines." },
      { de: "Im Herbst ist es oft windig.", en: "In autumn it is often windy." },
      { de: "Zieh eine warme Jacke an!", en: "Put on a warm jacket!" },
      { de: "Ich brauche Handschuhe und einen Schal.", en: "I need gloves and a scarf." }
    ],
    dialogue: {
      title: "The first snow",
      place: "At home in Dreieich, in the morning",
      lines: [
        { who: "Dein Mann", me: false, de: "Schau mal, es schneit!", en: "Look, it is snowing!" },
        { who: "You", me: true, de: "Oh, wie schön! Ist es sehr kalt?", en: "Oh, how lovely! Is it very cold?" },
        { who: "Dein Mann", me: false, de: "Ja, minus zwei Grad. Zieh dich warm an!", en: "Yes, minus two degrees. Dress warmly!" },
        { who: "You", me: true, de: "Wo sind meine Handschuhe?", en: "Where are my gloves?" },
        { who: "Dein Mann", me: false, de: "Im Flur, bei deiner Mütze und deinem Schal.", en: "In the hall, with your hat and your scarf." },
        { who: "You", me: true, de: "Danke. In Lusaka scheint jetzt die Sonne.", en: "Thank you. In Lusaka the sun is shining now." },
        { who: "Dein Mann", me: false, de: "Keine Sorge, im Sommer ist es hier auch warm.", en: "Don't worry, in summer it is warm here too." },
        { who: "You", me: true, de: "Dann freue ich mich auf den Sommer!", en: "Then I am looking forward to summer!" }
      ]
    }
  },
  {
    id: "u17",
    title: "At the public office",
    titleDe: "Auf dem Amt",
    emoji: "🏛️",
    goal: "Go to an appointment at an office and fill in a form.",
    tip: {
      title: "Bring your papers",
      text: "At a German office (Amt) you nearly always need an appointment, so book it online or by phone. Come five minutes early and bring your passport, your residence permit and every letter you got. If you do not understand something, just ask. That is normal and nobody will be angry."
    },
    words: [
      { de: "das Amt", en: "public office", emoji: "🏛️" },
      { de: "das Formular", en: "form", emoji: "📄" },
      { de: "die Unterschrift", en: "signature", emoji: "✍️" },
      { de: "der Ausweis", en: "ID card", emoji: "🆔" },
      { de: "der Pass", en: "passport", emoji: "🛂" },
      { de: "der Aufenthaltstitel", en: "residence permit", emoji: "💳" },
      { de: "die Anmeldung", en: "address registration", emoji: "📋" },
      { de: "das Geburtsdatum", en: "date of birth", emoji: "🎂" },
      { de: "die Adresse", en: "address", emoji: "🏠" },
      { de: "die Staatsangehörigkeit", en: "nationality", emoji: "🌍" },
      { de: "der Familienstand", en: "marital status", emoji: "💍" },
      { de: "ausfüllen", en: "to fill in", emoji: "✏️" }
    ],
    sentences: [
      { de: "Ich habe einen Termin um zehn Uhr.", en: "I have an appointment at ten o'clock." },
      { de: "Können Sie mir helfen?", en: "Can you help me?" },
      { de: "Bitte füllen Sie das Formular aus.", en: "Please fill in the form." },
      { de: "Wo muss ich unterschreiben?", en: "Where do I have to sign?" },
      { de: "Hier ist mein Pass.", en: "Here is my passport." },
      { de: "Ich möchte mich anmelden.", en: "I would like to register." },
      { de: "Wie ist Ihr Geburtsdatum?", en: "What is your date of birth?" },
      { de: "Ich möchte meinen Aufenthaltstitel verlängern.", en: "I would like to renew my residence permit." }
    ],
    dialogue: {
      title: "Registering your address",
      place: "At the Bürgerbüro in Dreieich",
      lines: [
        { who: "Mitarbeiterin", me: false, de: "Guten Morgen. Was kann ich für Sie tun?", en: "Good morning. What can I do for you?" },
        { who: "You", me: true, de: "Guten Morgen. Ich habe einen Termin um zehn Uhr. Ich möchte mich anmelden.", en: "Good morning. I have an appointment at ten o'clock. I would like to register." },
        { who: "Mitarbeiterin", me: false, de: "Haben Sie Ihren Pass und das Formular dabei?", en: "Do you have your passport and the form with you?" },
        { who: "You", me: true, de: "Ja, hier, bitte. Aber ich verstehe ein Wort nicht: Geburtsdatum.", en: "Yes, here you are. But I do not understand one word: Geburtsdatum." },
        { who: "Mitarbeiterin", me: false, de: "Das bedeutet: Wann sind Sie geboren?", en: "That means: when were you born?" },
        { who: "You", me: true, de: "Ach so, jetzt verstehe ich. Danke!", en: "Oh I see, now I understand. Thank you!" },
        { who: "Mitarbeiterin", me: false, de: "Gern. Bitte unterschreiben Sie hier unten.", en: "You are welcome. Please sign down here." },
        { who: "You", me: true, de: "Fertig. Vielen Dank für Ihre Hilfe!", en: "Done. Thank you very much for your help!" }
      ]
    }
  },
  {
    id: "u18",
    title: "On the phone",
    titleDe: "Am Telefon",
    emoji: "📞",
    goal: "Make a simple phone call and ask people to speak slowly.",
    tip: {
      title: "Say your name first",
      text: "Germans answer the phone with their surname, not with 'Hello'. Start with your name too: 'Guten Tag, mein Name ist Banda.' Use the formal Sie with people you do not know. It is perfectly fine to say 'Bitte langsamer' – everybody understands that."
    },
    words: [
      { de: "das Telefon", en: "telephone", emoji: "☎️" },
      { de: "das Handy", en: "mobile phone", emoji: "📱" },
      { de: "die Telefonnummer", en: "phone number", emoji: "🔢" },
      { de: "anrufen", en: "to call", emoji: "📞" },
      { de: "zurückrufen", en: "to call back", emoji: "↩️" },
      { de: "sprechen", en: "to speak", emoji: "🗣️" },
      { de: "wiederholen", en: "to repeat", emoji: "🔁" },
      { de: "buchstabieren", en: "to spell", emoji: "🔤" },
      { de: "langsam", en: "slowly", emoji: "🐢" },
      { de: "laut", en: "loud", emoji: "🔊" },
      { de: "die E-Mail", en: "email", emoji: "📧" },
      { de: "die Nachricht", en: "message", emoji: "💬" }
    ],
    sentences: [
      { de: "Hier ist {name} Banda.", en: "This is {name} Banda." },
      { de: "Kann ich bitte mit Frau Schmidt sprechen?", en: "Can I speak to Mrs Schmidt, please?" },
      { de: "Können Sie das bitte wiederholen?", en: "Can you repeat that, please?" },
      { de: "Können Sie bitte langsamer sprechen?", en: "Can you speak more slowly, please?" },
      { de: "Können Sie das bitte buchstabieren?", en: "Can you spell that, please?" },
      { de: "Ich rufe später zurück.", en: "I will call back later." },
      { de: "Wie ist Ihre Telefonnummer?", en: "What is your phone number?" },
      { de: "Ich schicke Ihnen eine E-Mail.", en: "I will send you an email." }
    ],
    dialogue: {
      title: "Calling the language school",
      place: "On the phone",
      lines: [
        { who: "Sekretärin", me: false, de: "Volkshochschule Dreieich, Schmidt, guten Tag.", en: "Dreieich adult education centre, Schmidt speaking, good afternoon." },
        { who: "You", me: true, de: "Guten Tag, hier ist {name} Banda. Kann ich bitte mit Herrn Keller sprechen?", en: "Good afternoon, this is {name} Banda. Can I speak to Mr Keller, please?" },
        { who: "Sekretärin", me: false, de: "Herr Keller ist gerade nicht da. Kann er Sie zurückrufen?", en: "Mr Keller is not here at the moment. Can he call you back?" },
        { who: "You", me: true, de: "Entschuldigung, können Sie bitte langsamer sprechen?", en: "Sorry, can you speak more slowly, please?" },
        { who: "Sekretärin", me: false, de: "Natürlich. Herr Keller ist nicht da. Er ruft Sie später zurück.", en: "Of course. Mr Keller is not here. He will call you back later." },
        { who: "You", me: true, de: "Ach so, danke. Ja, er kann mich gern zurückrufen.", en: "Oh I see, thank you. Yes, he is welcome to call me back." },
        { who: "Sekretärin", me: false, de: "Gut. Können Sie bitte Ihren Nachnamen buchstabieren?", en: "Good. Can you spell your surname, please?" },
        { who: "You", me: true, de: "Ja, gern: B, A, N, D, A.", en: "Yes, of course: B, A, N, D, A." }
      ]
    }
  },
  {
    id: "u19",
    title: "Work & jobs",
    titleDe: "Arbeit & Beruf",
    emoji: "💼",
    goal: "Talk about your job and say that you are looking for work.",
    tip: {
      title: "No 'a' before your job",
      text: "In German you name your job without 'a': 'Ich bin Verkäuferin.' Job words for women usually end in -in: Lehrer becomes Lehrerin. For a job you normally send a Bewerbung with your Lebenslauf (CV). The Agentur für Arbeit helps you with this for free."
    },
    words: [
      { de: "die Arbeit", en: "work", emoji: "💼" },
      { de: "der Beruf", en: "profession", emoji: "🛠️" },
      { de: "die Bewerbung", en: "job application", emoji: "📨" },
      { de: "der Lebenslauf", en: "CV", emoji: "📄" },
      { de: "die Kollegin", en: "colleague (woman)", emoji: "🤝" },
      { de: "die Teilzeit", en: "part-time", emoji: "🌗" },
      { de: "die Vollzeit", en: "full-time", emoji: "🌕" },
      { de: "das Gehalt", en: "salary", emoji: "💶" },
      { de: "die Verkäuferin", en: "shop assistant", emoji: "🛍️" },
      { de: "die Krankenschwester", en: "nurse", emoji: "👩‍⚕️" },
      { de: "die Lehrerin", en: "teacher", emoji: "👩‍🏫" },
      { de: "die Friseurin", en: "hairdresser", emoji: "✂️" }
    ],
    sentences: [
      { de: "Was sind Sie von Beruf?", en: "What is your job?" },
      { de: "Ich bin Verkäuferin von Beruf.", en: "I am a shop assistant by profession." },
      { de: "Ich suche Arbeit.", en: "I am looking for work." },
      { de: "Ich möchte in Teilzeit arbeiten.", en: "I would like to work part-time." },
      { de: "Hier ist mein Lebenslauf.", en: "Here is my CV." },
      { de: "Ich schreibe eine Bewerbung.", en: "I am writing a job application." },
      { de: "Meine Kollegin ist sehr nett.", en: "My colleague is very nice." },
      { de: "In Sambia habe ich auch gearbeitet.", en: "I also worked in Zambia." }
    ],
    dialogue: {
      title: "Asking about a job",
      place: "In a bakery in Sprendlingen",
      lines: [
        { who: "You", me: true, de: "Guten Tag. Suchen Sie noch eine Verkäuferin?", en: "Good afternoon. Are you still looking for a shop assistant?" },
        { who: "Chefin", me: false, de: "Ja, das stimmt. Haben Sie Erfahrung im Verkauf?", en: "Yes, that is right. Do you have experience in sales?" },
        { who: "You", me: true, de: "Ja, in Sambia war ich Verkäuferin in einem Supermarkt.", en: "Yes, in Zambia I was a shop assistant in a supermarket." },
        { who: "Chefin", me: false, de: "Sehr gut. Möchten Sie Vollzeit oder Teilzeit arbeiten?", en: "Very good. Would you like to work full-time or part-time?" },
        { who: "You", me: true, de: "Lieber Teilzeit. Am Vormittag habe ich Deutschkurs.", en: "Part-time, preferably. In the morning I have my German course." },
        { who: "Chefin", me: false, de: "Kein Problem. Bitte schicken Sie mir Ihren Lebenslauf.", en: "No problem. Please send me your CV." },
        { who: "You", me: true, de: "Gern. Ich schicke ihn heute per E-Mail.", en: "Gladly. I will send it by email today." },
        { who: "Chefin", me: false, de: "Prima. Dann bis bald, Frau Banda!", en: "Great. See you soon then, Mrs Banda!" }
      ]
    }
  },
  {
    id: "u20",
    title: "Free time & hobbies",
    titleDe: "Freizeit & Hobbys",
    emoji: "🎶",
    goal: "Say what you like doing in your free time.",
    tip: {
      title: "The little word gern",
      text: "Put 'gern' after the verb to say you like doing something: 'Ich koche gern' means 'I like cooking'. For things you do not like, say 'nicht gern'. A good way to meet people is a Verein (club): Dreieich has sports clubs, choirs and church groups. On Sundays the shops are closed, so many people go for a walk."
    },
    words: [
      { de: "die Freizeit", en: "free time", emoji: "🎈" },
      { de: "das Hobby", en: "hobby", emoji: "🎨" },
      { de: "das Wochenende", en: "weekend", emoji: "🗓️" },
      { de: "die Musik", en: "music", emoji: "🎵" },
      { de: "die Kirche", en: "church", emoji: "⛪" },
      { de: "kochen", en: "to cook", emoji: "🍳" },
      { de: "tanzen", en: "to dance", emoji: "💃" },
      { de: "singen", en: "to sing", emoji: "🎤" },
      { de: "lesen", en: "to read", emoji: "📖" },
      { de: "schwimmen", en: "to swim", emoji: "🏊" },
      { de: "spazieren gehen", en: "to take a walk", emoji: "🚶" },
      { de: "Freunde treffen", en: "to meet friends", emoji: "👭" }
    ],
    sentences: [
      { de: "Ich koche gern.", en: "I like cooking." },
      { de: "Ich tanze und singe gern.", en: "I like dancing and singing." },
      { de: "Was machst du am Wochenende?", en: "What are you doing at the weekend?" },
      { de: "Was ist dein Hobby?", en: "What is your hobby?" },
      { de: "Wir gehen im Wald spazieren.", en: "We go for a walk in the forest." },
      { de: "Am Sonntag gehe ich in die Kirche.", en: "On Sunday I go to church." },
      { de: "Ich treffe heute meine Freunde.", en: "I am meeting my friends today." },
      { de: "Ich höre gern Musik aus Sambia.", en: "I like listening to music from Zambia." }
    ],
    dialogue: {
      title: "Plans for the weekend",
      place: "After the German course, with your friend Maria",
      lines: [
        { who: "Maria", me: false, de: "Was machst du am Wochenende?", en: "What are you doing at the weekend?" },
        { who: "You", me: true, de: "Am Samstag koche ich Nshima für meine Freunde.", en: "On Saturday I am cooking nshima for my friends." },
        { who: "Maria", me: false, de: "Oh, lecker! Kochst du gern?", en: "Oh, yummy! Do you like cooking?" },
        { who: "You", me: true, de: "Ja, sehr gern. Und am Sonntag singe ich in der Kirche.", en: "Yes, very much. And on Sunday I sing in church." },
        { who: "Maria", me: false, de: "Schön! Am Nachmittag gehe ich spazieren. Kommst du mit?", en: "Nice! In the afternoon I am going for a walk. Will you come along?" },
        { who: "You", me: true, de: "Ja, gern! Wann und wo?", en: "Yes, gladly! When and where?" },
        { who: "Maria", me: false, de: "Um drei Uhr am Langener Waldsee.", en: "At three o'clock at the Langener Waldsee lake." },
        { who: "You", me: true, de: "Super, bis Sonntag!", en: "Great, see you on Sunday!" }
      ]
    }
  },
  {
    id: "u21",
    title: "Neighbours & invitations",
    titleDe: "Nachbarn & Einladungen",
    emoji: "🏡",
    goal: "Chat with your neighbours and accept or make an invitation.",
    tip: {
      title: "Being a good guest",
      text: "If Germans invite you for three o'clock, come at three o'clock: being on time is polite. Bring a small present, for example flowers or chocolate. With neighbours, start with Sie and the surname; they will tell you when you can say du. In Hessen you will often hear 'Gude!' as a friendly hello."
    },
    words: [
      { de: "der Nachbar", en: "neighbour", emoji: "🏘️" },
      { de: "die Einladung", en: "invitation", emoji: "💌" },
      { de: "der Geburtstag", en: "birthday", emoji: "🎂" },
      { de: "das Geschenk", en: "present", emoji: "🎁" },
      { de: "die Blumen", en: "flowers", emoji: "💐" },
      { de: "der Gast", en: "guest", emoji: "🙋" },
      { de: "der Besuch", en: "visit", emoji: "👋" },
      { de: "die Feier", en: "celebration", emoji: "🎉" },
      { de: "die Tür", en: "door", emoji: "🚪" },
      { de: "klingeln", en: "to ring the bell", emoji: "🔔" },
      { de: "willkommen", en: "welcome", emoji: "🤗" },
      { de: "pünktlich", en: "on time", emoji: "⏰" }
    ],
    sentences: [
      { de: "Kommen Sie doch herein!", en: "Do come in!" },
      { de: "Möchten Sie einen Kaffee?", en: "Would you like a coffee?" },
      { de: "Herzlichen Glückwunsch zum Geburtstag!", en: "Happy birthday!" },
      { de: "Schönes Wochenende, Frau Müller!", en: "Have a nice weekend, Mrs Müller!" },
      { de: "Ich möchte Sie zum Essen einladen.", en: "I would like to invite you for a meal." },
      { de: "Vielen Dank für die Einladung!", en: "Thank you very much for the invitation!" },
      { de: "Wir sind die neuen Nachbarn.", en: "We are the new neighbours." },
      { de: "Die Blumen sind für Sie.", en: "The flowers are for you." }
    ],
    dialogue: {
      title: "A birthday visit next door",
      place: "At Frau Müller's front door",
      lines: [
        { who: "You", me: true, de: "Guten Tag, Frau Müller. Herzlichen Glückwunsch zum Geburtstag!", en: "Good afternoon, Mrs Müller. Happy birthday!" },
        { who: "Frau Müller", me: false, de: "Oh, vielen Dank! Kommen Sie doch herein!", en: "Oh, thank you very much! Do come in!" },
        { who: "You", me: true, de: "Die Blumen sind für Sie.", en: "The flowers are for you." },
        { who: "Frau Müller", me: false, de: "Wie schön! Möchten Sie einen Kaffee und ein Stück Kuchen?", en: "How lovely! Would you like a coffee and a piece of cake?" },
        { who: "You", me: true, de: "Ja, sehr gern. Der Kuchen sieht lecker aus.", en: "Yes, I would love to. The cake looks delicious." },
        { who: "Frau Müller", me: false, de: "Bitte, setzen Sie sich. Wie gefällt es Ihnen in Dreieich?", en: "Please sit down. How do you like it in Dreieich?" },
        { who: "You", me: true, de: "Sehr gut, danke. Die Nachbarn sind sehr nett.", en: "Very much, thank you. The neighbours are very nice." },
        { who: "Frau Müller", me: false, de: "Das freut mich. Sagen wir doch du – ich bin Helga.", en: "I am glad. Let us say du – I am Helga." }
      ]
    }
  },
  {
    id: "u22",
    title: "Feelings",
    titleDe: "Gefühle",
    emoji: "💛",
    goal: "Say how you feel and talk about missing home.",
    tip: {
      title: "Homesickness is normal",
      text: "Almost everyone who moves to a new country feels Heimweh sometimes. It only shows how much you love your family. Germans often answer 'Wie geht es dir?' honestly, so you can do that too. Talk about it, call home, cook something from Zambia – and be proud of every German word you learn."
    },
    words: [
      { de: "glücklich", en: "happy", emoji: "😊" },
      { de: "traurig", en: "sad", emoji: "😢" },
      { de: "müde", en: "tired", emoji: "😴" },
      { de: "stolz", en: "proud", emoji: "🏅" },
      { de: "nervös", en: "nervous", emoji: "😬" },
      { de: "wütend", en: "angry", emoji: "😠" },
      { de: "allein", en: "alone", emoji: "🧍" },
      { de: "das Heimweh", en: "homesickness", emoji: "🥺" },
      { de: "die Angst", en: "fear", emoji: "😨" },
      { de: "vermissen", en: "to miss", emoji: "💭" },
      { de: "lachen", en: "to laugh", emoji: "😂" },
      { de: "weinen", en: "to cry", emoji: "😭" }
    ],
    sentences: [
      { de: "Wie geht es dir?", en: "How are you?" },
      { de: "Ich bin heute sehr müde.", en: "I am very tired today." },
      { de: "Ich habe Heimweh.", en: "I am homesick." },
      { de: "Ich vermisse meine Familie.", en: "I miss my family." },
      { de: "Ich freue mich auf deinen Besuch.", en: "I am looking forward to your visit." },
      { de: "Ich bin stolz auf dich.", en: "I am proud of you." },
      { de: "Warum bist du traurig?", en: "Why are you sad?" },
      { de: "Du bist nicht allein.", en: "You are not alone." }
    ],
    dialogue: {
      title: "A hard day",
      place: "At home in the evening",
      lines: [
        { who: "Dein Mann", me: false, de: "Hallo, mein Schatz. Wie geht es dir?", en: "Hello, my darling. How are you?" },
        { who: "You", me: true, de: "Nicht so gut. Ich bin traurig.", en: "Not so good. I am sad." },
        { who: "Dein Mann", me: false, de: "Was ist los? Hast du Heimweh?", en: "What is wrong? Are you homesick?" },
        { who: "You", me: true, de: "Ja. Ich vermisse meine Mutter und meine Schwestern.", en: "Yes. I miss my mother and my sisters." },
        { who: "Dein Mann", me: false, de: "Das verstehe ich. Wollen wir sie heute Abend anrufen?", en: "I understand that. Shall we call them this evening?" },
        { who: "You", me: true, de: "Ja, das ist eine gute Idee. Danke.", en: "Yes, that is a good idea. Thank you." },
        { who: "Dein Mann", me: false, de: "Du lernst so schnell Deutsch. Ich bin stolz auf dich!", en: "You are learning German so quickly. I am proud of you!" },
        { who: "You", me: true, de: "Danke. Jetzt geht es mir schon besser.", en: "Thank you. I feel better already." }
      ]
    }
  },
  {
    id: "u23",
    title: "In the German class",
    titleDe: "Im Deutschkurs",
    emoji: "📚",
    goal: "Ask questions in class and say when you do not understand.",
    tip: {
      title: "Ask, ask, ask",
      text: "Good learners ask many questions, and teachers in Germany like that. Two magic questions are 'Was bedeutet das?' and 'Wie sagt man das auf Deutsch?' Always learn a noun together with its article: der, die or das. Ten minutes of practice every day is better than two hours once a week."
    },
    words: [
      { de: "der Deutschkurs", en: "German course", emoji: "🏫" },
      { de: "die Hausaufgabe", en: "homework", emoji: "📝" },
      { de: "die Prüfung", en: "exam", emoji: "💯" },
      { de: "das Buch", en: "book", emoji: "📕" },
      { de: "der Stift", en: "pen", emoji: "🖊️" },
      { de: "das Wort", en: "word", emoji: "🔤" },
      { de: "die Frage", en: "question", emoji: "❓" },
      { de: "die Antwort", en: "answer", emoji: "💬" },
      { de: "der Fehler", en: "mistake", emoji: "❌" },
      { de: "lernen", en: "to learn", emoji: "🧠" },
      { de: "üben", en: "to practise", emoji: "🔁" },
      { de: "verstehen", en: "to understand", emoji: "💡" }
    ],
    sentences: [
      { de: "Was bedeutet dieses Wort?", en: "What does this word mean?" },
      { de: "Wie sagt man das auf Deutsch?", en: "How do you say that in German?" },
      { de: "Ich verstehe das nicht.", en: "I do not understand that." },
      { de: "Ich habe eine Frage.", en: "I have a question." },
      { de: "Bitte öffnen Sie das Buch.", en: "Please open the book." },
      { de: "Ich übe jeden Tag Deutsch.", en: "I practise German every day." },
      { de: "Die Hausaufgabe ist auf Seite zwanzig.", en: "The homework is on page twenty." },
      { de: "Die Prüfung ist im Juni.", en: "The exam is in June." }
    ],
    dialogue: {
      title: "A question in class",
      place: "In the German course at the Volkshochschule",
      lines: [
        { who: "Lehrerin", me: false, de: "Guten Morgen! Haben Sie die Hausaufgabe gemacht?", en: "Good morning! Have you done the homework?" },
        { who: "You", me: true, de: "Ja, aber ich habe eine Frage. Was bedeutet „Feierabend“?", en: "Yes, but I have a question. What does \"Feierabend\" mean?" },
        { who: "Lehrerin", me: false, de: "Feierabend ist die Zeit nach der Arbeit.", en: "Feierabend is the time after work." },
        { who: "You", me: true, de: "Ach so, danke! Können Sie das Wort bitte an die Tafel schreiben?", en: "Oh I see, thank you! Can you write the word on the board, please?" },
        { who: "Lehrerin", me: false, de: "Gern. Sie lernen wirklich schnell, {name}!", en: "Gladly. You really learn quickly, {name}!" },
        { who: "You", me: true, de: "Danke! Ich übe jeden Tag mit meinem Mann.", en: "Thank you! I practise every day with my husband." },
        { who: "Lehrerin", me: false, de: "Sehr gut. Dann schaffen Sie die Prüfung im Juni bestimmt.", en: "Very good. Then you will surely pass the exam in June." },
        { who: "You", me: true, de: "Das hoffe ich!", en: "I hope so!" }
      ]
    }
  },
  {
    id: "u24",
    title: "Emergency & help",
    titleDe: "Notfall & Hilfe",
    emoji: "🚨",
    goal: "Call for help and explain an emergency.",
    tip: {
      title: "112 and 110",
      text: "In an emergency call 112 for an ambulance or the fire brigade, and 110 for the police. Both numbers are free, also from a mobile phone. Say where you are and what happened, then wait for questions and do not hang up. If you cannot find the German words, say it in English."
    },
    words: [
      { de: "der Notfall", en: "emergency", emoji: "🚨" },
      { de: "die Hilfe", en: "help", emoji: "🆘" },
      { de: "der Krankenwagen", en: "ambulance", emoji: "🚑" },
      { de: "die Polizei", en: "police", emoji: "🚓" },
      { de: "die Feuerwehr", en: "fire brigade", emoji: "🚒" },
      { de: "das Feuer", en: "fire", emoji: "🔥" },
      { de: "der Unfall", en: "accident", emoji: "💥" },
      { de: "das Krankenhaus", en: "hospital", emoji: "🏥" },
      { de: "die Gefahr", en: "danger", emoji: "⚠️" },
      { de: "der Schlüssel", en: "key", emoji: "🔑" },
      { de: "verletzt", en: "injured", emoji: "🤕" },
      { de: "verlieren", en: "to lose", emoji: "🔍" }
    ],
    sentences: [
      { de: "Hilfe, ich brauche einen Arzt!", en: "Help, I need a doctor!" },
      { de: "Ich brauche Hilfe.", en: "I need help." },
      { de: "Rufen Sie einen Krankenwagen!", en: "Call an ambulance!" },
      { de: "Bitte rufen Sie die Polizei!", en: "Please call the police!" },
      { de: "Hier ist ein Unfall passiert.", en: "There has been an accident here." },
      { de: "Mein Mann ist verletzt.", en: "My husband is injured." },
      { de: "Ich habe meinen Schlüssel verloren.", en: "I have lost my key." },
      { de: "Wo ist das nächste Krankenhaus?", en: "Where is the nearest hospital?" }
    ],
    dialogue: {
      title: "Calling 112",
      place: "On the phone, at the station in Sprendlingen",
      lines: [
        { who: "Notruf", me: false, de: "Notruf Feuerwehr und Rettungsdienst. Wo ist der Notfall?", en: "Emergency line, fire brigade and ambulance. Where is the emergency?" },
        { who: "You", me: true, de: "In Dreieich, am Bahnhof Sprendlingen.", en: "In Dreieich, at Sprendlingen station." },
        { who: "Notruf", me: false, de: "Was ist passiert?", en: "What has happened?" },
        { who: "You", me: true, de: "Ein Unfall. Ein Mann ist am Kopf verletzt.", en: "An accident. A man has a head injury." },
        { who: "Notruf", me: false, de: "Ist der Mann wach? Kann er sprechen?", en: "Is the man awake? Can he speak?" },
        { who: "You", me: true, de: "Ja, aber er hat starke Schmerzen.", en: "Yes, but he is in a lot of pain." },
        { who: "Notruf", me: false, de: "Der Krankenwagen kommt sofort. Bleiben Sie bitte bei ihm.", en: "The ambulance is coming right away. Please stay with him." },
        { who: "You", me: true, de: "Ja, ich bleibe hier. Mein Name ist {name} Banda.", en: "Yes, I will stay here. My name is {name} Banda." }
      ]
    }
  }
];
