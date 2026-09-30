/* Lesvos Pass — partners, categories and areas.
   This is the ONLY file you need to edit to add, change or remove a partner.

   To add a partner, copy one block inside PARTNERS and change:
     id       unique short name, no spaces (e.g. "cafe-sappho")
     name     business name (same in all languages), or { en, tr, el } if it needs translation
     cat      one of the ids in CATEGORIES (food, cafe, beach, shop, experience)
     place    one of the ids in PLACES (mytilene, molyvos, ...)
     offer    the offer in all three languages
     maps     what to search on Google Maps for directions
     address  short address shown on the card (works offline). Text, or { en, tr, el } if it differs by language
     phone    phone number, e.g. "+30 22510 12345" (tap to call, works without internet)
     example  true = shows the "Example offer" tag. Set to false for real partners.
     featured true = shown first in the list
*/

window.CATEGORIES = [
  { id: "food",       icon: "plate",    en: "Food",           tr: "Yeme-içme",        el: "Φαγητό" },
  { id: "cafe",       icon: "cup",      en: "Cafés & drinks", tr: "Kafe ve içecek",   el: "Καφέ & ποτό" },
  { id: "beach",      icon: "umbrella", en: "Beaches",        tr: "Plajlar",          el: "Παραλίες" },
  { id: "shop",       icon: "bag",      en: "Shopping",       tr: "Alışveriş",        el: "Ψώνια" },
  { id: "experience", icon: "glass",    en: "Experiences",    tr: "Deneyimler",       el: "Εμπειρίες" }
];

/* Areas: the map shows one pin per area. lat/lon = where the pin sits. */
window.PLACES = [
  { id: "mytilene", lat: 39.105, lon: 26.555, en: "Mytilene",     tr: "Midilli",      el: "Μυτιλήνη" },
  { id: "thermi",   lat: 39.183, lon: 26.490, en: "Thermi",       tr: "Thermi",       el: "Θερμή" },
  { id: "molyvos",  lat: 39.368, lon: 26.175, en: "Molyvos",      tr: "Molyvos",      el: "Μόλυβος" },
  { id: "petra",    lat: 39.323, lon: 26.180, en: "Petra",        tr: "Petra",        el: "Πέτρα" },
  { id: "kalloni",  lat: 39.235, lon: 26.205, en: "Kalloni",      tr: "Kalloni",      el: "Καλλονή" },
  { id: "agra",     lat: 39.158, lon: 26.060, en: "Agra",         tr: "Agra",         el: "Άγρα" },
  { id: "eresos",   lat: 39.132, lon: 25.935, en: "Skala Eresou", tr: "Skala Eresou", el: "Σκάλα Ερεσού" },
  { id: "agiasos",  lat: 39.085, lon: 26.375, en: "Agiasos",      tr: "Agiasos",      el: "Αγιάσος" },
  { id: "plomari",  lat: 38.975, lon: 26.370, en: "Plomari",      tr: "Plomari",      el: "Πλωμάρι" }
];

window.PARTNERS = [
  { id: "genesis", name: "Genesis Cafe Snack All Day Bar", cat: "cafe", place: "agra", featured: true, example: true,
    offer: { en: "A free dessert with your coffee", tr: "Kahveye ikram tatlı", el: "Κέρασμα γλυκό με τον καφέ" },
    address: { en: "Agra, 811 05 Lesvos", tr: "Agra, 811 05 Midilli", el: "Άγρα, 811 05 Λέσβος" },
    phone: "+30 2253 095531",
    maps: "Genesis Cafe Snack All Day Bar, Agra, Lesvos" },

  /* ---- Example partners below: replace them with real ones as you sign them ---- */
  { id: "ex-taverna-port", name: { en: "Harbour taverna", tr: "Liman tavernası", el: "Ταβέρνα του λιμανιού" }, cat: "food", place: "mytilene", featured: true, example: true,
    offer: { en: "Free meze with dinner", tr: "Akşam yemeğinde ikram meze", el: "Κέρασμα μεζές με το δείπνο" }, maps: "Mytilene harbour, Lesvos" },
  { id: "ex-pastry", name: { en: "Pastry shop", tr: "Pastane", el: "Ζαχαροπλαστείο" }, cat: "cafe", place: "mytilene", example: true,
    offer: { en: "15% off traditional sweets", tr: "Geleneksel tatlılarda %15 indirim", el: "15% έκπτωση στα παραδοσιακά γλυκά" }, maps: "Ermou street, Mytilene" },
  { id: "ex-boutique", name: { en: "Fashion boutique", tr: "Moda butiği", el: "Μπουτίκ ρούχων" }, cat: "shop", place: "mytilene", example: true,
    offer: { en: "10% off all items", tr: "Tüm ürünlerde %10 indirim", el: "10% έκπτωση σε όλα τα είδη" }, maps: "Ermou street, Mytilene" },
  { id: "ex-jewellery", name: { en: "Jewellery shop", tr: "Kuyumcu", el: "Κοσμηματοπωλείο" }, cat: "shop", place: "mytilene", example: true,
    offer: { en: "10% off handmade jewellery", tr: "El yapımı takılarda %10 indirim", el: "10% έκπτωση στα χειροποίητα κοσμήματα" }, maps: "Mytilene centre, Lesvos" },
  { id: "ex-olive", name: { en: "Olive oil & local products", tr: "Zeytinyağı ve yerel ürünler", el: "Ελαιόλαδο & τοπικά προϊόντα" }, cat: "shop", place: "mytilene", example: true,
    offer: { en: "Free gift wrapping and 10% off", tr: "Ücretsiz hediye paketi ve %10 indirim", el: "Δωρεάν συσκευασία δώρου και 10% έκπτωση" }, maps: "Mytilene centre, Lesvos" },
  { id: "ex-baths", name: { en: "Thermal baths", tr: "Kaplıca", el: "Ιαματικά λουτρά" }, cat: "experience", place: "thermi", featured: true, example: true,
    offer: { en: "20% off entry", tr: "Girişte %20 indirim", el: "20% έκπτωση στην είσοδο" }, maps: "Thermi, Lesvos" },
  { id: "ex-taverna-molyvos", name: { en: "Castle view taverna", tr: "Kale manzaralı taverna", el: "Ταβέρνα με θέα στο κάστρο" }, cat: "food", place: "molyvos", example: true,
    offer: { en: "Free dessert for the table", tr: "Masaya ikram tatlı", el: "Κέρασμα γλυκό για το τραπέζι" }, maps: "Molyvos, Lesvos" },
  { id: "ex-boat", name: { en: "Boat trips", tr: "Tekne turları", el: "Εκδρομές με σκάφος" }, cat: "experience", place: "molyvos", example: true,
    offer: { en: "10% off day trips", tr: "Günlük turlarda %10 indirim", el: "10% έκπτωση στις ημερήσιες εκδρομές" }, maps: "Molyvos port, Lesvos" },
  { id: "ex-petra-cafe", name: { en: "Seafront café", tr: "Sahil kafesi", el: "Καφέ στην παραλία" }, cat: "cafe", place: "petra", example: true,
    offer: { en: "Second coffee free", tr: "İkinci kahve ücretsiz", el: "Δεύτερος καφές δωρεάν" }, maps: "Petra, Lesvos" },
  { id: "ex-kalloni", name: { en: "Sardine & ouzo restaurant", tr: "Sardalya ve uzo restoranı", el: "Εστιατόριο σαρδέλας & ούζου" }, cat: "food", place: "kalloni", example: true,
    offer: { en: "Free ouzo with grilled sardines", tr: "Izgara sardalyaya ikram uzo", el: "Κέρασμα ούζο με ψητή σαρδέλα" }, maps: "Skala Kallonis, Lesvos" },
  { id: "ex-beachbar", name: { en: "Beach bar", tr: "Plaj barı", el: "Beach bar" }, cat: "beach", place: "eresos", featured: true, example: true,
    offer: { en: "Free sunbed", tr: "Şezlong ücretsiz", el: "Δωρεάν ξαπλώστρα" }, maps: "Skala Eresou beach, Lesvos" },
  { id: "ex-pottery", name: { en: "Pottery workshop", tr: "Seramik atölyesi", el: "Εργαστήριο κεραμικής" }, cat: "shop", place: "agiasos", example: true,
    offer: { en: "15% off handmade ceramics", tr: "El yapımı seramiklerde %15 indirim", el: "15% έκπτωση στα χειροποίητα κεραμικά" }, maps: "Agiasos, Lesvos" },
  { id: "ex-ouzo", name: { en: "Ouzo distillery", tr: "Uzo imalathanesi", el: "Αποστακτήριο ούζου" }, cat: "experience", place: "plomari", featured: true, example: true,
    offer: { en: "Free guided tasting", tr: "Ücretsiz rehberli tadım", el: "Δωρεάν ξενάγηση με γευσιγνωσία" }, maps: "Plomari, Lesvos" },
  { id: "ex-plomari-beach", name: { en: "Seaside sunbeds", tr: "Sahil şezlongları", el: "Ξαπλώστρες στη θάλασσα" }, cat: "beach", place: "plomari", example: true,
    offer: { en: "Two sunbeds for the price of one", tr: "İki şezlong bir fiyatına", el: "Δύο ξαπλώστρες στην τιμή της μίας" }, maps: "Agios Isidoros beach, Lesvos" }
];
