// Mwaiseni – "letter decoder" glossary for the letter scanner.
// `match` entries are lower-case substrings that are searched in the lower-cased OCR text.
// Some entries start with a space or a line break on purpose (for example " fällig", "\nrechnung")
// so that they do not hit inside other words (for example "zufällig", "Berechnung", "Ankündigung").
// So: lower-case the OCR text, but do not strip spaces or line breaks before searching.
// `senders` is ordered from specific to general: use the FIRST sender that matches.
// (Banks and the post are last, because their names also appear in the footers of other letters.)
// Facts checked in November 2026.
window.DATA = window.DATA || {};
window.DATA.glossary = [

  // ───────── Authorities and residence ─────────
  {
    de: "der Aufenthaltstitel",
    match: ["aufenthaltstitel"],
    en: "residence title",
    explain: "The general word for your permission to live in Germany (visa, Aufenthaltserlaubnis or Niederlassungserlaubnis). Check which date it is valid until and write that date in your calendar.",
    level: "important"
  },
  {
    de: "die Aufenthaltserlaubnis",
    match: ["aufenthaltserlaubnis"],
    en: "residence permit (for a limited time)",
    explain: "Your residence permit card. It has an end date. Ask the Ausländerbehörde for a renewal appointment about three months before it ends.",
    level: "important"
  },
  {
    de: "die Niederlassungserlaubnis",
    match: ["niederlassungserlaubnis"],
    en: "permanent residence permit",
    explain: "A residence permit without an end date. If the letter is about applying for it, check which papers the Ausländerbehörde asks for.",
    level: "info"
  },
  {
    de: "die Fiktionsbescheinigung",
    match: ["fiktionsbescheinigung"],
    en: "temporary paper while your permit is being processed",
    explain: "This paper shows that your stay is still legal while the office works on your new card. Keep it with your passport and look at its end date.",
    level: "important"
  },
  {
    de: "die Verpflichtungserklärung",
    match: ["verpflichtungserklärung"],
    en: "formal promise to pay for a visitor",
    explain: "With this paper a person promises to pay all living costs for a visitor from abroad. It can become expensive. Read it with your husband before anyone signs, and ask the Ausländerbehörde if something is unclear.",
    level: "important"
  },
  {
    de: "die Anhörung",
    match: ["anhörung", "gelegenheit zur stellungnahme", "gelegenheit zur äußerung", "stellungnahme"],
    en: "chance to explain your side",
    explain: "The office is planning a decision and asks for your side of the story first. There is a deadline in the letter. Answer in writing before that date. The free Migrationsberatung or the office that sent the letter can help you.",
    level: "urgent"
  },
  {
    de: "die Vorsprache",
    match: ["vorsprache", "vorzusprechen", "vorsprechen", "persönlich erscheinen", "persönliches erscheinen"],
    en: "visit in person at the office",
    explain: "You must come to the office yourself. Check the date, time and room, and the list of things to bring. If you cannot come, call or write before the date and ask for a new one.",
    level: "important"
  },
  {
    de: "die Mitwirkungspflicht",
    match: ["mitwirkungspflicht", "mitwirkung"],
    en: "duty to cooperate",
    explain: "You must help the office with your case, for example by sending papers or coming to appointments. Do what the letter asks before the date. If you need more time, ask the office in writing.",
    level: "important"
  },
  {
    de: "der Integrationskurs",
    match: ["integrationskurs"],
    en: "integration course",
    explain: "The German course with an extra part about life in Germany. Read whether you may join or must join, and by which date you should register with a course school.",
    level: "important"
  },
  {
    de: "der Berechtigungsschein",
    match: ["berechtigungsschein", "berechtigung zur teilnahme", "teilnahmeberechtigung"],
    en: "paper that lets you join the integration course",
    explain: "This paper gives you the right to a place in the integration course. It has an end date. Take it to a course school (for example a Volkshochschule) soon and register.",
    level: "important"
  },
  {
    de: "die Verpflichtung zur Teilnahme",
    match: ["verpflichtung zur teilnahme", "teilnahmeverpflichtung", "zur teilnahme verpflichtet", "teilnahme verpflichtet"],
    en: "duty to join the course",
    explain: "You must take part in the integration course. This also means a place is kept for you. Register with a course school by the date in the letter and go regularly.",
    level: "important"
  },
  {
    de: "der Deutsch-Test für Zuwanderer / der Test „Leben in Deutschland“",
    match: ["deutsch-test für zuwanderer", "leben in deutschland", "orientierungskurs", "abschlusstest"],
    en: "final tests of the integration course",
    explain: "These are the two tests at the end of the integration course: one for your German level and one about life in Germany. Check the date and place of the test and bring your passport or residence card.",
    level: "info"
  },
  {
    de: "die Erwerbstätigkeit",
    match: ["erwerbstätigkeit", "beschäftigung erlaubt", "beschäftigung gestattet"],
    en: "work (employed or self-employed)",
    explain: "This word says whether you are allowed to work. 'Erwerbstätigkeit erlaubt' means you may work. If the letter says something else, ask the Ausländerbehörde.",
    level: "info"
  },
  {
    de: "die eheliche Lebensgemeinschaft",
    match: ["eheliche lebensgemeinschaft", "ehelichen lebensgemeinschaft"],
    en: "living together as a married couple",
    explain: "Your residence permit is based on your life together with your husband. The office may ask questions about this. If something changes in your marriage, get private advice from the free Migrationsberatung.",
    level: "important"
  },
  {
    de: "der Reisepass",
    match: ["reisepass", "nationalpass"],
    en: "passport",
    explain: "The letter is about your passport. It must be valid for your residence permit. If it ends soon, renew it at the Zambian embassy in good time and tell the Ausländerbehörde.",
    level: "important"
  },
  {
    de: "die Ausreisepflicht",
    match: ["ausreisepflicht", "ausreiseaufforderung", "zur ausreise", "abschiebung"],
    en: "duty to leave Germany",
    explain: "This is a serious letter about leaving Germany, but there are usually ways to answer it. Do not ignore it and do not wait. Take the letter to the free Migrationsberatung or to a lawyer for migration law today or tomorrow.",
    level: "urgent"
  },
  {
    de: "gültig bis / die Gültigkeit",
    match: ["gültig bis", "gültigkeit", "läuft ab", "ablaufdatum", "abgelaufen"],
    en: "valid until / validity",
    explain: "A document or card has an end date. Write the date in your calendar and ask for a new one in good time before it ends.",
    level: "important"
  },
  {
    de: "die Verlängerung",
    match: ["verlängerung", "verlängert sich", "verlängern"],
    en: "renewal, extension",
    explain: "Something continues for a longer time. For a residence permit: you must ask for it before the end date. For a contract: it may go on automatically if you do not cancel in time, so check the date.",
    level: "important"
  },
  {
    de: "die Abholung",
    match: ["abholung", "abholen", "abholbereit", "abzuholen"],
    en: "collection, pick-up",
    explain: "Something is ready for you to collect, for example your new card, a document or a parcel. Check where, by when and what you must bring (usually your passport and this letter).",
    level: "important"
  },

  // ───────── Deadlines and legal words ─────────
  {
    de: "die Frist",
    match: ["frist bis", "frist von", "frist zur", "frist für", "frist:", "frist endet", "frist läuft", "frist beträgt", "frist ist", "die frist", "der frist", "eine frist", "einer frist", "diese frist", "dieser frist", " fristen", "fristgerecht", "fristablauf", "fristsetzung", "fristverlängerung", "zahlungsfrist", "widerspruchsfrist"],
    en: "deadline",
    explain: "There is a deadline. Find the date and do what the letter asks before that day. If you need more time, ask the sender in writing before the deadline ends.",
    level: "urgent"
  },
  {
    de: "innerhalb von",
    match: ["innerhalb von", "innerhalb einer", "innerhalb eines", "innerhalb der nächsten", "binnen"],
    en: "within (a period of time)",
    explain: "You have a limited time, for example 'innerhalb von 14 Tagen' means within 14 days. Count from the date of the letter and mark the last day in your calendar.",
    level: "urgent"
  },
  {
    de: "spätestens bis",
    match: ["spätestens", "bis zum", "bis spätestens"],
    en: "at the latest by",
    explain: "This is the last possible day. Your answer, payment or papers must arrive by this date, so send them a few days earlier.",
    level: "urgent"
  },
  {
    de: "unverzüglich",
    match: ["unverzüglich", "umgehend"],
    en: "without delay, right away",
    explain: "The sender wants you to act very soon, within the next few days. Do it this week, or call and say when you can do it.",
    level: "important"
  },
  {
    de: "der Bescheid",
    match: ["bescheid"],
    en: "official decision",
    explain: "An official decision from an office. Read what was decided and from which date. If you think it is wrong, you can usually object in writing (Widerspruch) within one month. Keep this letter in your folder.",
    level: "important"
  },
  {
    de: "der Widerspruch",
    match: ["widerspruch"],
    en: "written objection",
    explain: "Your right to say in writing that you do not agree with a decision, usually within one month. If you want to do this, ask the free Migrationsberatung or the office that sent the letter how to do it.",
    level: "important"
  },
  {
    de: "die Rechtsbehelfsbelehrung",
    match: ["rechtsbehelfsbelehrung", "rechtsmittelbelehrung", "rechtsbehelf"],
    en: "information about your right to object",
    explain: "This part at the end of a decision tells you how, where and by when you can object. You only need it if you do not agree with the decision. Note the time limit.",
    level: "important"
  },
  {
    de: "der Einspruch",
    match: ["einspruch"],
    en: "objection (tax, fines, court orders)",
    explain: "A written objection, for example against a tax decision or a fine. The time is short, sometimes only two weeks. If you do not agree, get advice quickly.",
    level: "important"
  },
  {
    de: "die Mahnung",
    match: [" mahnung", "\nmahnung", "mahngebühr", "mahnkosten", "mahnstufe"],
    en: "reminder to pay",
    explain: "The sender says a bill was not paid in time. Check if you already paid. If not, pay the amount by the date in the letter. If the bill is wrong, write to the sender at once.",
    level: "urgent"
  },
  {
    de: "die Zahlungserinnerung",
    match: ["zahlungserinnerung", "erinnerung an die zahlung", "erinnern wir sie"],
    en: "friendly payment reminder",
    explain: "A first, polite reminder that a bill is still open. There is usually no extra cost yet. Pay now or tell the sender if you have already paid.",
    level: "urgent"
  },
  {
    de: "die Zahlungsaufforderung",
    match: ["zahlungsaufforderung", "fordern wir sie auf", "fordere ich sie auf", "letzte aufforderung", "letztmalig"],
    en: "demand for payment",
    explain: "You are asked to pay a certain amount by a certain date. Check that the claim is correct. If yes, pay in time. If you cannot pay everything, ask the sender for payment in parts (Ratenzahlung).",
    level: "urgent"
  },
  {
    de: "das Inkasso",
    match: ["inkasso"],
    en: "debt collection",
    explain: "A debt collection company asks for money for another company. Do not ignore it, but check first if the bill is real and still unpaid. If you do not know the bill, write that you do not accept it and ask the Verbraucherzentrale for help.",
    level: "urgent"
  },
  {
    de: "der Mahnbescheid / der Vollstreckungsbescheid",
    match: ["mahnbescheid", "vollstreckungsbescheid", "gerichtliches mahnverfahren", "gerichtlichen mahnverfahren"],
    en: "court order to pay",
    explain: "A court letter about money that someone says you owe. You have only two weeks to object with the form inside. Get advice at once from the Verbraucherzentrale, the Migrationsberatung or a lawyer.",
    level: "urgent"
  },
  {
    de: "die Vollstreckung",
    match: ["vollstreckung", "gerichtsvollzieher"],
    en: "forced collection of a debt",
    explain: "An office or court officer wants to collect an unpaid debt by force. Contact the sender right away and ask about paying in parts. A free debt advice centre (Schuldnerberatung) can help you.",
    level: "urgent"
  },
  {
    de: "die Pfändung",
    match: ["pfändung", "gepfändet"],
    en: "seizure of money or wages",
    explain: "Money can be taken from your bank account or salary to pay a debt. Speak to your bank and to a free debt advice centre (Schuldnerberatung) quickly. A part of your money is always protected.",
    level: "urgent"
  },
  {
    de: "der Säumniszuschlag",
    match: ["säumniszuschlag", "säumniszuschläge", "verspätungszuschlag"],
    en: "extra charge for late payment",
    explain: "An extra cost because a payment or a form was late. Pay the open amount soon so that it does not grow. If you think you were on time, write to the office.",
    level: "urgent"
  },
  {
    de: "das Bußgeld",
    match: ["bußgeld", "bussgeld"],
    en: "fine",
    explain: "A fine for breaking a rule, for example driving too fast. Pay by the date in the letter. If you think it is wrong, you can object (Einspruch) within two weeks.",
    level: "urgent"
  },
  {
    de: "die Verwarnung",
    match: ["verwarnung", "verwarnungsgeld", "verwarngeld"],
    en: "warning with a small fine",
    explain: "A small fine for a small mistake, for example wrong parking. If you pay within the time in the letter (usually one week), the matter is finished.",
    level: "important"
  },
  {
    de: "die Abmahnung",
    match: ["abmahnung"],
    en: "formal warning",
    explain: "A formal warning, for example from an employer, a landlord or a law firm. Do not sign or pay anything quickly. Get advice first, from the Verbraucherzentrale, the Migrationsberatung or a lawyer.",
    level: "urgent"
  },
  {
    de: "die förmliche Zustellung",
    match: ["förmliche zustellung", "postzustellungsurkunde", "zustellungsurkunde", "zugestellt am"],
    en: "formal delivery (yellow envelope)",
    explain: "This letter was delivered in an official way. The date written on the yellow envelope starts the deadline. Keep the envelope and act quickly.",
    level: "urgent"
  },
  {
    de: "die Ratenzahlung",
    match: ["ratenzahlung", "in raten", "stundung"],
    en: "payment in parts",
    explain: "You can pay a large amount in smaller monthly parts. If this is an offer, answer by the date. If you need it, ask the sender in writing.",
    level: "info"
  },
  {
    de: "die Ablehnung",
    match: ["ablehnung", "abgelehnt", "ablehnungsbescheid", "nicht entsprochen"],
    en: "refusal",
    explain: "Your request was refused. Read the reason. You can usually object within one month. Ask the free Migrationsberatung or the office that sent the letter what you can do.",
    level: "important"
  },
  {
    de: "die Bewilligung",
    match: ["bewilligung", "bewilligt", "bewilligungsbescheid", "genehmigt", "genehmigung"],
    en: "approval",
    explain: "Good news: your request was approved. Check from when, until when and how much. Keep the letter in your folder.",
    level: "info"
  },

  // ───────── Money ─────────
  {
    de: "die Rechnung",
    match: [" rechnung", "\nrechnung", "rechnungsnummer", "rechnungsbetrag", "rechnungsdatum"],
    en: "invoice, bill",
    explain: "A bill. Check if it is correct and if you really ordered this. Then pay the amount by the date given, and write the invoice number in the transfer.",
    level: "important"
  },
  {
    de: "der Betrag",
    match: ["betrag"],
    en: "amount of money",
    explain: "The amount of money the letter is about. Look for the number with the € sign and check whether you must pay it or will receive it.",
    level: "info"
  },
  {
    de: "fällig",
    match: [" fällig", "\nfällig", "fälligkeit", "überfällig"],
    en: "due",
    explain: "The date when a payment must be made. Pay by that day. 'Überfällig' means the date has already passed, so pay now.",
    level: "important"
  },
  {
    de: "die Überweisung",
    match: ["überweisung", "überweisen", "überweisungsschein"],
    en: "bank transfer / referral from a doctor",
    explain: "Two meanings. Money: you send the amount from your bank account to the IBAN in the letter. Health: a paper from your doctor that sends you to a specialist. Take it to that appointment.",
    level: "important"
  },
  {
    de: "die Lastschrift",
    match: ["lastschrift", "abgebucht", "abbuchung", "abbuchen"],
    en: "direct debit",
    explain: "The company takes the money from your bank account itself. You do not need to send it. Just make sure there is enough money in the account on that day.",
    level: "info"
  },
  {
    de: "das SEPA-Lastschriftmandat",
    match: ["sepa-mandat", "sepa-lastschriftmandat", "lastschriftmandat", "sepa mandat", "mandatsreferenz"],
    en: "permission for direct debit",
    explain: "A form that allows a company to take money from your account regularly. Sign it only if you know the company and want this. You can take the permission back in writing at any time.",
    level: "important"
  },
  {
    de: "die Einzugsermächtigung",
    match: ["einzugsermächtigung", "einzugsverfahren"],
    en: "permission to collect money from your account",
    explain: "An older word for the direct debit permission. Sign it only if you trust the sender. Check your bank statement to see what is taken.",
    level: "important"
  },
  {
    de: "der Verwendungszweck",
    match: ["verwendungszweck"],
    en: "payment reference",
    explain: "The text you must write in your bank transfer so that the payment is found, for example the invoice number. Copy it exactly from the letter.",
    level: "info"
  },
  {
    de: "die Kundennummer",
    match: ["kundennummer", "kunden-nr", "kundennr", "vertragsnummer", "vertragskonto"],
    en: "customer number",
    explain: "Your number at this company. Have it ready when you call or write to them.",
    level: "info"
  },
  {
    de: "das Aktenzeichen",
    match: ["aktenzeichen", "geschäftszeichen", "kassenzeichen", "unser zeichen", "mein zeichen"],
    en: "reference number of your case",
    explain: "The number of your case at this office. Always write it on your answer and say it when you call.",
    level: "info"
  },
  {
    de: "die IBAN",
    match: ["iban", "bankverbindung", "kontoverbindung"],
    en: "bank account number",
    explain: "The bank account number. If you must pay, send the money to this IBAN. If the letter asks for your IBAN, give it only to senders you know and trust.",
    level: "info"
  },
  {
    de: "das Guthaben",
    match: ["guthaben"],
    en: "credit, money in your favour",
    explain: "Good news: you paid more than needed and get money back, or it is counted for the next bill. Check that the sender has your correct bank account.",
    level: "info"
  },
  {
    de: "die Nachzahlung",
    match: ["nachzahlung", "nachforderung", "nachzuzahlen"],
    en: "extra payment",
    explain: "You paid too little during the year and must pay the rest. Check the bill and pay by the date. If it is too much at once, ask for payment in parts (Ratenzahlung).",
    level: "important"
  },
  {
    de: "die Erstattung",
    match: ["erstattung", "erstatten wir", "zu erstatten"],
    en: "refund, paying back",
    explain: "Money is paid back. Read carefully who pays whom. Usually you get money back. In letters from the Jobcenter or Familienkasse it can also mean that you must pay money back.",
    level: "important"
  },
  {
    de: "der Abschlag",
    match: ["abschlag", "abschläge", "abschlagszahlung", "vorauszahlung"],
    en: "monthly advance payment",
    explain: "The fixed amount you pay every month for electricity, gas, water or extra housing costs. If the letter gives a new amount, change your standing order.",
    level: "info"
  },
  {
    de: "der Beitrag",
    match: ["beitrag"],
    en: "contribution, regular fee",
    explain: "A regular payment, for example for insurance, a club or the Rundfunkbeitrag. Check the amount and the date when it is due.",
    level: "info"
  },
  {
    de: "die Gebühr",
    match: ["gebühr"],
    en: "fee",
    explain: "A fee for a service, for example at an office. Check the amount and how you should pay it.",
    level: "info"
  },
  {
    de: "der Zahlungsverzug",
    match: ["zahlungsverzug", "in verzug", "verzugszinsen", "zahlungsrückstand", "rückstand"],
    en: "late with a payment",
    explain: "The sender says you are late with a payment. Check your bank statement. Pay the open amount soon or call the sender to agree on a plan. Extra costs can come if you wait.",
    level: "urgent"
  },
  {
    de: "die Sperrung",
    match: ["sperrandrohung", "versorgungsunterbrechung", "sperrung ihres", "sperrung ihrer", "stromsperre", "gassperre", "liefersperre", "anschlusssperre", "kontosperrung"],
    en: "cut-off, blocking",
    explain: "The sender warns that electricity, gas, phone or an account may be blocked, usually because of unpaid bills. Call them today, pay or ask for payment in parts. Most companies help if you call early.",
    level: "urgent"
  },

  // ───────── Contracts ─────────
  {
    de: "der Vertrag",
    match: ["vertrag"],
    en: "contract",
    explain: "A contract with rights and duties for both sides. Read the price, the length and how to cancel. Do not sign before you understand it. Keep your copy in your folder.",
    level: "important"
  },
  {
    de: "die Kündigung",
    match: [" kündigung", "\nkündigung", " kündigen", " gekündigt", "kündigungsschreiben", "kündigungsbestätigung", "kündige ich", "kündigen wir"],
    en: "cancellation, notice",
    explain: "A contract is being ended, by you or by the other side. Check who cancels what and from which date. If your flat or your job is cancelled, get advice at once.",
    level: "urgent"
  },
  {
    de: "die Kündigungsfrist",
    match: ["kündigungsfrist"],
    en: "notice period",
    explain: "How long before the end you must cancel a contract, for example one month or three months. Write the last possible day in your calendar.",
    level: "important"
  },
  {
    de: "die Laufzeit",
    match: ["laufzeit"],
    en: "length of the contract",
    explain: "How long the contract runs at least, for example 24 months. During this time you usually cannot leave the contract.",
    level: "info"
  },
  {
    de: "der Widerruf",
    match: ["widerruf"],
    en: "right to cancel a new contract",
    explain: "For contracts made online, by phone or at your door, you can usually cancel within 14 days without a reason. If you want this, write to the company in time and keep a copy.",
    level: "important"
  },
  {
    de: "die Auftragsbestätigung",
    match: ["auftragsbestätigung", "vertragsbestätigung", "bestellbestätigung"],
    en: "confirmation of an order or contract",
    explain: "A company confirms that you ordered something or made a contract. If you did not want this, write to the company at once that you cancel (Widerruf).",
    level: "important"
  },
  {
    de: "die Preiserhöhung",
    match: ["preiserhöhung", "preisanpassung", "preisänderung", "beitragsanpassung"],
    en: "price increase",
    explain: "The company changes its price. You often have a special right to cancel the contract when a price goes up. Read from when the new price counts and compare with other offers.",
    level: "important"
  },
  {
    de: "das Angebot",
    match: ["angebot"],
    en: "offer",
    explain: "An offer, not a bill. You do not have to pay or sign anything. Some advertising letters look like bills, so read carefully.",
    level: "info"
  },

  // ───────── Health ─────────
  {
    de: "die Krankenkasse",
    match: ["krankenkasse", "krankenversicherung"],
    en: "health insurance fund",
    explain: "Your health insurance. If they ask for information, a form or a photo, answer by the date so that your insurance stays in order.",
    level: "info"
  },
  {
    de: "die Versichertenkarte",
    match: ["versichertenkarte", "gesundheitskarte"],
    en: "health insurance card",
    explain: "The card you show at the doctor. If the letter brings a new card, use it from now on. If the Krankenkasse asks for a photo, send one soon.",
    level: "important"
  },
  {
    de: "die Familienversicherung",
    match: ["familienversicherung", "familienversichert"],
    en: "free insurance with your husband",
    explain: "You are insured for free together with your husband. The Krankenkasse checks this with a form from time to time. Fill it in and send it back by the date. Tell them when you start a job.",
    level: "important"
  },
  {
    de: "der Befund",
    match: ["befund", "laborwerte", "arztbrief"],
    en: "medical result",
    explain: "The result of a medical test or examination. Take the letter to your next doctor's visit and ask the doctor to explain it in simple words.",
    level: "info"
  },
  {
    de: "das Rezept",
    match: ["rezept ", "rezept\n", "rezepte", "e-rezept", "rezeptpflichtig", "kassenrezept", "privatrezept"],
    en: "prescription",
    explain: "A prescription for medicine from your doctor. Go to a pharmacy with your insurance card and collect the medicine.",
    level: "info"
  },
  {
    de: "die Zuzahlung",
    match: ["zuzahlung", "eigenanteil"],
    en: "the part you pay yourself",
    explain: "The small part of a medicine or treatment that you pay yourself. Keep the receipts. If you pay a lot in one year, the Krankenkasse can free you from further payments.",
    level: "info"
  },
  {
    de: "die Arbeitsunfähigkeitsbescheinigung",
    match: ["arbeitsunfähigkeit", "krankschreibung", "krankmeldung"],
    en: "sick note",
    explain: "The paper from the doctor that says you are too ill to work, and until which day. Tell your employer on the first day that you are ill.",
    level: "important"
  },
  {
    de: "die Vorsorgeuntersuchung",
    match: ["vorsorgeuntersuchung", "vorsorgetermin", "krebsvorsorge", "früherkennung", "mammographie", "mammografie"],
    en: "preventive check-up",
    explain: "An invitation to a free health check, for example an early cancer check. It is voluntary and paid by your Krankenkasse. Call to confirm or change the appointment.",
    level: "info"
  },
  {
    de: "die Impfung",
    match: ["impfung", "impfpass", "impfschutz", "impftermin"],
    en: "vaccination",
    explain: "The letter is about a vaccination. Take your vaccination booklet (Impfpass) to the doctor. If you do not have one, the doctor gives you a new one.",
    level: "info"
  },
  {
    de: "die Kindervorsorgeuntersuchung (U-Untersuchung)",
    match: ["u-untersuchung", "kindervorsorge", "früherkennungsuntersuchung"],
    en: "child health check-up",
    explain: "A reminder that your child should go to the next free check-up (U1 to U9). Make an appointment with the children's doctor soon and bring the yellow booklet.",
    level: "important"
  },

  // ───────── Work and social benefits ─────────
  {
    de: "der Arbeitsvertrag",
    match: ["arbeitsvertrag"],
    en: "work contract",
    explain: "The contract for your job. Check the pay, the hours, the holidays and the trial period before you sign. Ask someone you trust to read it with you, and keep your copy.",
    level: "important"
  },
  {
    de: "die Lohnabrechnung",
    match: ["lohnabrechnung", "gehaltsabrechnung", "entgeltabrechnung", "verdienstabrechnung"],
    en: "payslip",
    explain: "The monthly paper that shows your pay and what was taken off for tax and insurance. You do not need to do anything. Keep all payslips in your folder.",
    level: "info"
  },
  {
    de: "die Steuer-ID (steuerliche Identifikationsnummer)",
    match: ["steuerliche identifikationsnummer", "steuerlichen identifikationsnummer", "persönliche identifikationsnummer", " steuer-id", "\nsteuer-id", " steueridentifikationsnummer", "\nsteueridentifikationsnummer"],
    en: "tax identification number",
    explain: "Your personal tax number with 11 digits. It stays the same for your whole life. Keep this letter safe. Your employer and your bank will ask for the number.",
    level: "important"
  },
  {
    de: "die Steuerklasse",
    match: ["steuerklasse"],
    en: "tax class",
    explain: "The group that decides how much tax is taken from your pay each month. Married couples can choose. Ask your husband or the Finanzamt if you are not sure which one you have.",
    level: "info"
  },
  {
    de: "die Steuererklärung",
    match: ["steuererklärung"],
    en: "tax return",
    explain: "The yearly report to the tax office about your income. If the Finanzamt asks you to send it, there is a deadline. Your husband, a tax adviser or a Lohnsteuerhilfeverein can help.",
    level: "important"
  },
  {
    de: "der Steuerbescheid",
    match: ["steuerbescheid"],
    en: "tax decision",
    explain: "The decision of the tax office: you either get money back or must pay more. Check the amount and the date. If something is wrong, you can object (Einspruch) within one month.",
    level: "important"
  },
  {
    de: "die Sozialversicherungsnummer",
    match: ["sozialversicherungsnummer", "rentenversicherungsnummer", "sozialversicherungsausweis"],
    en: "social insurance number",
    explain: "Your personal number for pension and social insurance. Keep this letter safe. Every employer will ask for the number.",
    level: "important"
  },
  {
    de: "das Grundsicherungsgeld (früher: Bürgergeld)",
    match: ["grundsicherungsgeld", "bürgergeld", "grundsicherung für arbeitsuchende", "grundsicherung für arbeitssuchende"],
    en: "basic income support from the Jobcenter",
    explain: "Money from the Jobcenter for people with little or no income. Since July 2026 it is called Grundsicherungsgeld. Before that it was Bürgergeld. Read what the Jobcenter decided or asks for, and answer by the date.",
    level: "important"
  },
  {
    de: "der Kooperationsplan",
    match: ["kooperationsplan", "eingliederungsvereinbarung"],
    en: "plan with the Jobcenter",
    explain: "A plan between you and the Jobcenter with the next steps towards work, for example a course or job applications. Do the steps and keep the appointments. Tell the Jobcenter early if something does not work.",
    level: "important"
  },
  {
    de: "das Kindergeld",
    match: ["kindergeld"],
    en: "monthly money for children",
    explain: "Monthly money from the Familienkasse for every child. If they ask for papers, send them by the date so that the payments continue.",
    level: "info"
  },
  {
    de: "das Elterngeld",
    match: ["elterngeld"],
    en: "money for parents after a birth",
    explain: "Money for a parent who stays at home with a baby. Check the amount and the months, and send any papers they ask for.",
    level: "info"
  },
  {
    de: "das Wohngeld",
    match: ["wohngeld"],
    en: "help with housing costs",
    explain: "Money from the state for households with a low income, to help with the rent. If you get it, check until when and apply again in good time.",
    level: "info"
  },
  {
    de: "die Anerkennung",
    match: ["anerkennung ausländischer", "anerkennung ihres", "anerkennung ihrer", "anerkennung von", "anerkennungsverfahren", "anerkennungsbescheid", "berufsanerkennung", "gleichwertigkeit", "zeugnisbewertung"],
    en: "recognition of foreign qualifications",
    explain: "The check whether your school or job certificates from Zambia count in Germany. Send the papers they ask for, often with certified translations.",
    level: "info"
  },
  {
    de: "die Einladung",
    match: ["einladung", "laden wir sie", "lade ich sie", "meldetermin"],
    en: "invitation, call to an appointment",
    explain: "You are invited to an appointment. From an office or the Jobcenter this means you should really come. Check date, time and place. If you cannot come, cancel before and ask for a new date.",
    level: "important"
  },

  // ───────── Housing ─────────
  {
    de: "der Mietvertrag",
    match: ["mietvertrag"],
    en: "rental contract",
    explain: "The contract for your flat. It shows the rent, the extra costs, the deposit and the rules. Keep it safe as long as you live there.",
    level: "important"
  },
  {
    de: "die Miete",
    match: ["miete ", "kaltmiete", "warmmiete", "monatsmiete", "mietzahlung"],
    en: "rent",
    explain: "The monthly payment for your flat. It must be in the landlord's account at the start of each month. A standing order (Dauerauftrag) makes this easy.",
    level: "info"
  },
  {
    de: "die Kaution",
    match: ["kaution"],
    en: "deposit",
    explain: "Money the landlord keeps as security, usually up to three months of rent. You get it back after you move out if the flat is in good order.",
    level: "info"
  },
  {
    de: "die Nebenkosten",
    match: ["nebenkosten", "betriebskosten"],
    en: "extra housing costs",
    explain: "Extra costs of the home, such as water, heating, rubbish and cleaning. You pay a fixed amount each month and get a final bill once a year.",
    level: "info"
  },
  {
    de: "die Nebenkostenabrechnung",
    match: ["nebenkostenabrechnung", "betriebskostenabrechnung", "heizkostenabrechnung", "jahresabrechnung", "jahresverbrauchsabrechnung"],
    en: "yearly bill for extra costs",
    explain: "The yearly bill for heating, water, electricity or other extra costs. Look at the end: 'Guthaben' means you get money back, 'Nachzahlung' means you pay more. Check the date for payment.",
    level: "important"
  },
  {
    de: "die Hausordnung",
    match: ["hausordnung"],
    en: "house rules",
    explain: "The rules for living together in the building, such as quiet times, cleaning and rubbish. If the letter reminds you of a rule, follow it from now on.",
    level: "info"
  },
  {
    de: "der Vermieter / die Vermieterin",
    match: ["vermieter"],
    en: "landlord",
    explain: "The owner who rents the flat to you. Answer their letters in writing and keep copies.",
    level: "info"
  },
  {
    de: "die Mieterhöhung",
    match: ["mieterhöhung", "mietanpassung"],
    en: "rent increase",
    explain: "The landlord wants a higher rent. Do not sign right away. There are rules and time limits for this. Ask a tenants' association (Mieterverein) or the Migrationsberatung to check the letter.",
    level: "important"
  },
  {
    de: "der Zählerstand",
    match: ["zählerstand", "zählerablesung", "ablesung", "ablesetermin", "zählernummer"],
    en: "meter reading",
    explain: "The number on your electricity, gas or water meter. Read the number, write it on the card or enter it online by the date. If someone comes to read it, be at home at that time.",
    level: "important"
  },
  {
    de: "die Wohnungsgeberbestätigung",
    match: ["wohnungsgeberbestätigung", "wohnungsgeber"],
    en: "confirmation from the landlord or home owner",
    explain: "A form signed by the landlord or home owner that says you live at this address. You need it to register at the Bürgerbüro.",
    level: "important"
  },
  {
    de: "die Meldebescheinigung",
    match: ["meldebescheinigung", "meldebestätigung", "anmeldebestätigung"],
    en: "registration certificate",
    explain: "The paper that proves your registered address. Many offices and banks ask for it. Keep it safe and make copies.",
    level: "info"
  },
  {
    de: "der Rundfunkbeitrag",
    match: ["rundfunkbeitrag", "beitragsnummer"],
    en: "fee for public TV and radio",
    explain: "The fee for public TV and radio, paid once per home. If your husband already pays for your home, answer the letter and give his Beitragsnummer. Do not ignore it.",
    level: "important"
  },
  {
    de: "der Eigenbedarf",
    match: ["eigenbedarf"],
    en: "landlord needs the flat for himself",
    explain: "The landlord says he needs the flat for himself or his family and wants to end the contract. There are strict rules for this. Get advice from a tenants' association (Mieterverein) quickly.",
    level: "urgent"
  },
  {
    de: "der Zutritt zur Wohnung",
    match: ["schornsteinfeger", "rauchwarnmelder", "wartungstermin", "zutritt zur wohnung", "zugang zur wohnung", "zugang zu ihrer wohnung"],
    en: "someone needs to come into your home",
    explain: "A worker needs to enter your home on a certain day, for example to check the heating, the chimney or the smoke alarms. Be at home at that time, or call to change the date.",
    level: "important"
  },
  {
    de: "die Anmeldung",
    match: ["anmeldung", "anmelden", "anmeldeformular"],
    en: "registration",
    explain: "A registration, for example of your address at the Bürgerbüro, for a course, or for school or Kita. Check by which date and with which papers you must register.",
    level: "important"
  },

  // ───────── General letter words ─────────
  {
    de: "Sehr geehrte Frau … / Sehr geehrter Herr …",
    match: ["sehr geehrte"],
    en: "Dear Ms … / Dear Mr …",
    explain: "The polite start of a formal letter. You can use the same words when you write back.",
    level: "info"
  },
  {
    de: "der Betreff",
    match: ["betreff:", "betreff ", "betrifft:"],
    en: "subject of the letter",
    explain: "The line that says what the letter is about. Read it first. It often tells you the topic in a few words.",
    level: "info"
  },
  {
    de: "die Anlage",
    match: ["anlage:", "anlagen:", "\nanlage", "als anlage", "in der anlage", "anlage 1"],
    en: "enclosure, attached paper",
    explain: "Extra papers that come with the letter. Check that they are all in the envelope and read them too. Sometimes a form to fill in is among them.",
    level: "info"
  },
  {
    de: "die Unterschrift",
    match: ["unterschrift", "unterschreiben", "unterschrieben", "unterzeichnen", "unterzeichnet"],
    en: "signature",
    explain: "You are asked to sign something. Sign only when you understand what you agree to. Ask for help first if you are not sure.",
    level: "important"
  },
  {
    de: "der Antrag",
    match: ["antrag"],
    en: "application, request",
    explain: "A formal request to an office. If you must make one, fill in the form, add the papers they ask for and send it by the date. Keep a copy.",
    level: "important"
  },
  {
    de: "das Formular",
    match: ["formular", "vordruck", "fragebogen"],
    en: "form",
    explain: "A form to fill in. Write clearly, sign it and send it back by the date. You can ask the sender or the Migrationsberatung for help with it.",
    level: "important"
  },
  {
    de: "der Nachweis",
    match: ["nachweis"],
    en: "proof",
    explain: "The sender needs proof of something, for example your income, address or language level. Send a copy of the right paper by the date.",
    level: "important"
  },
  {
    de: "die Unterlagen",
    match: ["unterlagen", "dokumente"],
    en: "documents, papers",
    explain: "The sender needs papers from you. Make a list of what they ask for. Send copies, not the originals, unless the letter clearly asks for originals.",
    level: "important"
  },
  {
    de: "einreichen",
    match: ["einreichen", "einzureichen", "eingereicht", "nachreichen", "nachzureichen"],
    en: "to hand in, to send in",
    explain: "You must send or bring something to the sender. Check what, where and by which date.",
    level: "important"
  },
  {
    de: "vorlegen",
    match: ["vorlegen", "vorzulegen", "zur vorlage", "vorlage von"],
    en: "to show, to present",
    explain: "You must show a paper, usually the original, at the office or appointment. Put it ready with the letter.",
    level: "important"
  },
  {
    de: "ausfüllen",
    match: ["ausfüllen", "auszufüllen", "ausgefüllt"],
    en: "to fill in",
    explain: "You must fill in a form. Answer every question, sign at the end and send it back by the date.",
    level: "important"
  },
  {
    de: "der Termin",
    match: ["termin"],
    en: "appointment, fixed date",
    explain: "There is a date and time for you. Write it in your calendar and be on time. If you cannot come, cancel early and ask for a new date.",
    level: "important"
  },
  {
    de: "absagen / die Absage",
    match: ["absagen", "abzusagen", "absage"],
    en: "to cancel / a refusal",
    explain: "To cancel an appointment: tell them as early as you can if you cannot come. 'Absage' can also mean a 'no', for example to a job application. That happens to everyone, so keep trying.",
    level: "important"
  },
  {
    de: "verschieben",
    match: ["verschieben", "verschoben", "terminverschiebung", "neuen termin", "ersatztermin"],
    en: "to move to another date",
    explain: "An appointment is moved to another day. Check the new date and time and change it in your calendar.",
    level: "info"
  },
  {
    de: "die Rückmeldung",
    match: ["rückmeldung", "rückantwort", "um antwort", "antworten sie", "melden sie sich", "setzen sie sich"],
    en: "reply, answer",
    explain: "The sender is waiting for an answer from you. Reply by the date, by letter, e-mail or phone, as the letter says.",
    level: "important"
  },
  {
    de: "Bitte beachten Sie",
    match: ["bitte beachten sie", "beachten sie", "wichtiger hinweis", "wichtige information"],
    en: "Please note",
    explain: "The sender points to something important. Read this part of the letter slowly, twice.",
    level: "info"
  },
  {
    de: "Mit freundlichen Grüßen",
    match: ["mit freundlichen grüßen", "mit freundlichen grüssen", "mit freundlichem gruß", "freundliche grüße"],
    en: "Kind regards",
    explain: "The polite end of a letter. Under it you usually find the name of the person who wrote to you.",
    level: "info"
  },
  {
    de: "die Bescheinigung",
    match: ["bescheinigung"],
    en: "certificate, written confirmation",
    explain: "An official paper that confirms something, for example your address, your insurance or your course. Keep it. You may need it at another office.",
    level: "info"
  },
  {
    de: "die beglaubigte Kopie",
    match: ["beglaubigt", "beglaubigung", "kopie", "im original"],
    en: "(certified) copy",
    explain: "The sender wants a copy of a document. 'Beglaubigt' means the copy must have an official stamp. You can get this stamp at the Bürgerbüro for a small fee.",
    level: "important"
  },
  {
    de: "die Übersetzung",
    match: ["übersetzung", "übersetzer", "vereidigt", "beeidigt"],
    en: "translation",
    explain: "The sender needs a German translation of a document. For official papers it must be made by a sworn translator. Ask the sender which papers need it before you pay for a translation.",
    level: "important"
  },
  {
    de: "die Einverständniserklärung",
    match: ["einverständniserklärung", "einwilligung", "einverstanden"],
    en: "consent form",
    explain: "You are asked to agree to something with your signature, for example a school trip or the use of your data. Read what you agree to. You may say no.",
    level: "important"
  },
  {
    de: "zur Kenntnisnahme",
    match: ["zur kenntnisnahme", "zu ihrer information", "zur information", "kein handlungsbedarf", "nichts weiter zu veranlassen", "nichts zu veranlassen"],
    en: "for your information only",
    explain: "This letter only informs you. You do not need to do anything. Keep it in your folder.",
    level: "info"
  },
  {
    de: "die Eingangsbestätigung",
    match: ["eingangsbestätigung", "ist bei uns eingegangen", "haben wir erhalten", "in bearbeitung", "bearbeitungszeit", "bearbeitungsdauer"],
    en: "confirmation that your papers arrived",
    explain: "The office confirms that it received your application or letter and is working on it. You do not need to do anything now. Keep the letter and wait for the answer.",
    level: "info"
  },
  {
    de: "die Gewinnbenachrichtigung",
    match: ["sie haben gewonnen", "haben sie gewonnen", "gewinnbenachrichtigung", "gewinnmitteilung", "gewinnspiel", "hauptgewinn"],
    en: "letter saying you have won something",
    explain: "Letters that say you won money or a prize are almost always tricks or advertising. Do not call the number, do not pay anything and do not give your bank details.",
    level: "important"
  },

  // ───────── School and Kita ─────────
  {
    de: "der Elternabend",
    match: ["elternabend", "elternversammlung"],
    en: "parents' evening",
    explain: "A meeting for parents at the school or Kita in the evening. It is good to go, also with little German. Check the date and tell them if you cannot come.",
    level: "important"
  },
  {
    de: "die Entschuldigung",
    match: ["entschuldigung", "entschuldigt", "entschuldigen"],
    en: "absence note / apology",
    explain: "Two meanings. At school: a short written note from you when your child was ill or absent. In other letters: the sender says sorry for something.",
    level: "info"
  },
  {
    de: "die Einschulung",
    match: ["einschulung", "schulanmeldung", "schulanfänger"],
    en: "starting school",
    explain: "Your child is going to start school. Check the date for the registration and what to bring, usually the birth certificate and the vaccination booklet.",
    level: "important"
  },
  {
    de: "die Schulpflicht",
    match: ["schulpflicht", "schulversäumnis", "unentschuldigt"],
    en: "duty to go to school",
    explain: "Children must go to school every school day. If the letter is about missed days, contact the school quickly and explain. Always send a note when your child is ill.",
    level: "important"
  },
  {
    de: "das Elterngespräch",
    match: ["elterngespräch", "elternsprechtag", "entwicklungsgespräch"],
    en: "talk between parents and teacher",
    explain: "The teacher or Kita worker wants to talk with you about your child. This is normal and usually friendly. Confirm the appointment. You can bring someone to translate.",
    level: "important"
  },
  {
    de: "der Betreuungsplatz",
    match: ["betreuungsplatz", "kita-platz", "kitaplatz", "kindergartenplatz", "platzzusage", "betreuungsvertrag"],
    en: "place in day care",
    explain: "The letter is about a place for your child in a Kita or Kindergarten. If a place is offered, say yes by the date or the place goes to another child.",
    level: "important"
  },
  {
    de: "der Masernschutz",
    match: ["masernschutz", "masernimpfung", "masern"],
    en: "measles protection",
    explain: "Children in Kita and school must be vaccinated against measles. Show the vaccination booklet or a paper from the doctor by the date in the letter.",
    level: "important"
  }
];

window.DATA.senders = [
  {
    match: ["inkasso"],
    name: "Inkassounternehmen",
    en: "Debt collection company",
    explain: "A company that collects unpaid bills for other companies. Do not ignore the letter, but check first if the bill is real. The Verbraucherzentrale can help you."
  },
  {
    match: ["ausländerbehörde", "auslaenderbehoerde", "auslanderbehorde", "ausländerangelegenheiten", "ausländeramt"],
    name: "Ausländerbehörde Kreis Offenbach",
    en: "Immigration office",
    explain: "Responsible for your residence permit. Always answer, keep every appointment and bring the papers they ask for."
  },
  {
    match: ["bundesamt für migration", "bamf"],
    name: "BAMF – Bundesamt für Migration und Flüchtlinge",
    en: "Federal Office for Migration and Refugees",
    explain: "The federal office for integration courses. Letters are usually about your right to join a course, the cost or your certificate."
  },
  {
    match: ["pro arbeit - kreis", "pro arbeit – kreis", "pro arbeit kreis", "proarbeit", "jobcenter"],
    name: "Pro Arbeit – Jobcenter Kreis Offenbach",
    en: "Jobcenter",
    explain: "The Jobcenter of Kreis Offenbach. It pays basic income support and helps people find work. Keep appointments and answer letters by the date."
  },
  {
    match: ["familienkasse"],
    name: "Familienkasse",
    en: "Family benefits office",
    explain: "Pays Kindergeld. If they ask for papers, send them by the date so that the payments continue."
  },
  {
    match: ["agentur für arbeit", "arbeitsagentur", "bundesagentur für arbeit"],
    name: "Agentur für Arbeit",
    en: "Employment agency",
    explain: "Helps with finding work, job advice and training, and pays unemployment money. Keep appointments or cancel them before the date."
  },
  {
    match: ["finanzamt"],
    name: "Finanzamt",
    en: "Tax office",
    explain: "Responsible for taxes. For Dreieich this is usually the Finanzamt Langen. Their letters often have deadlines, so read them soon."
  },
  {
    match: ["deutsche rentenversicherung"],
    name: "Deutsche Rentenversicherung",
    en: "German pension insurance",
    explain: "The state pension insurance. It sends your social insurance number and information about your pension. Keep these letters safe."
  },
  {
    match: ["beitragsservice", "ard zdf deutschlandradio"],
    name: "ARD ZDF Deutschlandradio Beitragsservice",
    en: "TV and radio fee office",
    explain: "Collects the Rundfunkbeitrag, one fee per home. If your husband already pays, answer and give his Beitragsnummer."
  },
  {
    match: ["aok"],
    name: "AOK",
    en: "Health insurance (AOK)",
    explain: "A public health insurance. Letters are about your insurance card, your membership or forms to fill in. Answer by the date."
  },
  {
    match: ["techniker krankenkasse", "die techniker", "tk.de"],
    name: "Techniker Krankenkasse (TK)",
    en: "Health insurance (TK)",
    explain: "A public health insurance. Letters are about your insurance card, your membership or forms to fill in. Answer by the date."
  },
  {
    match: ["barmer"],
    name: "BARMER",
    en: "Health insurance (Barmer)",
    explain: "A public health insurance. Letters are about your insurance card, your membership or forms to fill in. Answer by the date."
  },
  {
    match: ["dak-gesundheit", "dak gesundheit", "dak.de"],
    name: "DAK-Gesundheit",
    en: "Health insurance (DAK)",
    explain: "A public health insurance. Letters are about your insurance card, your membership or forms to fill in. Answer by the date."
  },
  {
    match: ["ikk classic", "ikk südwest", "ikk gesund", "ikk-"],
    name: "IKK",
    en: "Health insurance (IKK)",
    explain: "A public health insurance. Letters are about your insurance card, your membership or forms to fill in. Answer by the date."
  },
  {
    match: ["stadtwerke dreieich"],
    name: "Stadtwerke Dreieich",
    en: "Local energy and water company",
    explain: "The local company for electricity, gas, water and heat. It sends monthly amounts, the yearly bill and requests for your meter reading."
  },
  {
    match: ["dienstleistungsbetrieb dreieich", "dlb aör", "dlb-aoer"],
    name: "DLB – Dienstleistungsbetrieb Dreieich und Neu-Isenburg",
    en: "Waste and city services",
    explain: "Collects the rubbish in Dreieich and runs the recycling centre. Letters are about collection days, bins or waste fees."
  },
  {
    match: ["stadt dreieich", "magistrat der stadt dreieich", "bürgerbüro", "buergerbuero"],
    name: "Stadt Dreieich / Bürgerbüro",
    en: "City of Dreieich / citizens' office",
    explain: "Your town hall. Responsible for registering your address, certificates, Kita places and local fees."
  },
  {
    match: ["kreis offenbach", "kreisausschuss"],
    name: "Kreis Offenbach",
    en: "District administration",
    explain: "The district office in Dietzenbach. It is responsible for the driving licence office, the health office and other services. Look at the top of the letter to see which department wrote to you."
  },
  {
    match: ["polizeipräsidium", "polizeistation", "polizeidirektion", "ordnungsamt", "ordnungsbehörde", "bußgeldstelle", "regierungspräsidium kassel"],
    name: "Polizei / Ordnungsamt / Bußgeldstelle",
    en: "Police / public order office / fines office",
    explain: "Letters about a fine, a traffic matter or a question to you as a witness. Read the deadline. If you do not understand it, ask for help the same day."
  },
  {
    match: ["mahngericht", "amtsgericht hünfeld", "amtsgericht langen", "in dem rechtsstreit", "in der familiensache", "gerichtskasse"],
    name: "Amtsgericht / Mahngericht",
    en: "Local court",
    explain: "A court. Letters from a court often have short deadlines, sometimes only two weeks. Read it today and get advice quickly."
  },
  {
    match: ["grundschule", "gesamtschule", "gymnasium", "schulleitung", "klassenlehrer", "kindertagesstätte", "kindergarten", "kita "],
    name: "Schule / Kita",
    en: "School / day care",
    explain: "A letter from your child's school or day care. Often it is about dates, parents' evenings, trips or forms to sign and give back."
  },
  {
    match: ["hausverwaltung", "immobilienverwaltung", "wohnungsgesellschaft", "wohnungsbaugesellschaft", "vermieter"],
    name: "Vermieter / Hausverwaltung",
    en: "Landlord / property management",
    explain: "The owner or manager of your home. Letters are about rent, yearly bills, repairs or house rules. Answer in writing and keep a copy."
  },
  {
    match: ["telekom"],
    name: "Deutsche Telekom",
    en: "Phone and internet company",
    explain: "Phone and internet provider. Letters are usually bills, contract changes or advertising. Check if it is about a contract you really have."
  },
  {
    match: ["vodafone"],
    name: "Vodafone",
    en: "Phone and internet company",
    explain: "Phone, internet and cable TV provider. Letters are usually bills, contract changes or advertising. Check if it is about a contract you really have."
  },
  {
    match: ["telefónica", "telefonica", "o2 "],
    name: "O2 (Telefónica)",
    en: "Phone and internet company",
    explain: "Phone and internet provider. Letters are usually bills, contract changes or advertising. Check if it is about a contract you really have."
  },
  {
    match: ["dhl", "deutsche post ag", "postfiliale"],
    name: "Deutsche Post / DHL",
    en: "Post and parcel service",
    explain: "The post office. A card in your letterbox usually means a parcel or a letter is waiting for you. Collect it with your ID within the time on the card."
  },
  {
    match: ["sparkasse"],
    name: "Sparkasse",
    en: "Savings bank",
    explain: "Your bank. Real bank letters never ask for your PIN or password. If a letter looks strange, call the bank at the number on your card."
  },
  {
    match: ["volksbank", "vr bank", "vr-bank", "raiffeisenbank"],
    name: "Volksbank / VR Bank",
    en: "Cooperative bank",
    explain: "Your bank. Real bank letters never ask for your PIN or password. If a letter looks strange, call the bank at the number on your card."
  }
];
