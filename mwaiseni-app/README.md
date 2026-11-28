# Mwaiseni 🏡

*"Mwaiseni" is Bemba for "welcome".*

An Android app for a Zambian woman who has just moved to Dreieich (Hessen) and speaks beginner German (A1). The interface is English; everything German can be heard, shown in huge letters, or practised. No account, no adverts, no tracking: all personal data stays on the phone.

## What it does

| Area | What she can do |
| --- | --- |
| **Today** | Greeting in her home language and in German, streak and daily goal, next lesson, word of the day, clocks and weather for Dreieich and her home town, "first steps" checklist |
| **Learn** | 24 units from A1 towards A2 (288 words, 192 sentences, 24 dialogues). Each unit has three lessons built from seven exercise types: new word, choose the meaning, listen, type, match pairs, build the sentence, say it aloud. Spaced repetition brings words back for review |
| **Speak → Translate** | Two big microphones: she speaks English, the phone speaks German; the other person answers in German, she reads English. Runs on the phone and works offline after one download |
| **Speak → Phrases** | 17 real-life situations (doctor, office, bus, in-laws, hair salon …) with "I say" and "I hear" lists, search, favourites and pronunciation check |
| **Speak → Cards** | Twelve ready cards plus her own: German text in huge letters to show to someone |
| **Letter helper** | Photograph a German letter: the app reads it, translates it, names the sender, finds deadlines, appointments, amounts and IBANs, explains 139 bureaucratic words and can put a date into the calendar |
| **Dreieich** | Verified local places (offices, courses, health, transport, African shops, churches, help) with route, call and website buttons, and 30 "How Germany works" cards |
| **Zambia** | Time and weather at home, Euro ↔ Kwacha, Zambian and Hessian holidays, greetings in Bemba / Nyanja / Tonga / Lozi with their German match, where to find nshima ingredients, news, radio, embassy, money transfer |
| **Food finder** | 89 Zambian ingredients with what they are called in German supermarkets and in Turkish, Asian, Indian and Afro shops ("spinach" → Mangold, rape → Yu Choy 油菜, kapenta → dried anchovies). Searchable in English, Nyanja, German or the shop's own script; a card shows the label to the shop staff; German shopping list |
| **SOS** | One-tap 112, 110, 116 117, the women's help line 116 016 and her husband, plus her address and emergency sentences in German |

Sharing also works from outside: mark German text in WhatsApp or any app and choose *Mwaiseni: translate*, or share a photo of a letter to Mwaiseni.

## Install

Download `dist/Mwaiseni.apk` on the phone, open it and allow "install unknown apps" for the browser when Android asks. Requires Android 8.0 or newer.

First start: the short welcome asks for her name, home language and home town. The husband's phone number, the home address and a personal note for the home screen can be added there or later under Settings (gear icon on the Today screen).

Worth doing once while on Wi-Fi: Settings → *Offline translator* → Download (about 30 MB).

### Voice

The app speaks through the phone's text-to-speech engine, so quality depends on what is installed. It uses Google's engine ("Speech Services by Google") whenever it is on the phone, even if the phone's default is another engine, and picks the best installed voice per language. Settings → *Voice & how names sound* lets you switch engine, hear and pick each German and English voice, and set how her names are spoken.

A German voice reads names by German rules ("Chilufya" becomes "Kilufya"). The app respells her names for the German voice only (Chilufya → Tschilufja, Natasha → Natascha, Mwila → Muila, Joyce → Dscheuss); the spelling can be corrected by ear on the same screen.

## How it is built

- `app/src/main/java/app/mwaiseni/` – a thin Kotlin shell: `MainActivity` hosts a WebView served from bundled assets; `Bridge` exposes the phone to the page (text-to-speech, speech recognition, ML Kit on-device translation and text recognition, camera, calendar, dialler, notifications); `Reminders` posts the daily word.
- `app/src/main/assets/www/` – the whole interface in plain HTML, CSS and JavaScript, no build step. `js/core.js` holds storage, router and the bridge wrapper; one file per area.
- `app/src/main/assets/www/data/` – all content as data files: course units, phrasebook, guide, letter glossary, places, Zambia corner.
- `research/` – the research memos the content is based on.
- `tests/smoke.js` – drives the interface in headless Chromium at phone size and takes screenshots of every screen.

```bash
# build (needs the Android SDK; set sdk.dir in local.properties)
./gradlew assembleRelease            # → app/build/outputs/apk/release/app-release.apk
./gradlew assembleDebug -PwithX86    # also runs on the x86_64 emulator

# interface test
cd tests && node smoke.js && node sheet.js
```

The signing key in `keystore/` is committed on purpose: every build is signed with the same key, so a new version installs over the old one and her progress is kept. It is a private sideloaded app, not a store release.

## Limits to know

- The letter helper and the translator use machine translation. They help her understand, but they are not legal advice; the app says so on every result.
- Opening hours, prices and legal rules change. Place cards link to the official website; guide cards name the office to ask.
- Voice input uses the phone's own speech service (normally the Google app). Without it the app falls back to typing.
