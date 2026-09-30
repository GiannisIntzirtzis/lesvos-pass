/* Lesvos Pass — page logic */
(function () {
  "use strict";

  /* ---- Settings: fill these in when you have them ---- */
  var CONFIG = {
    whatsapp: "",   // e.g. "306900000000" (country code + number, no + or spaces)
    email: ""       // e.g. "hello@lesvospass.com"
  };

  /* Partners, categories and areas live in js/partners.js */
  var ICONS = {
    cup: "M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z M17 11h2a2 2 0 0 1 0 4h-2 M8 3v3 M12 3v3",
    plate: "M5 3v8a2 2 0 0 0 4 0V3 M7 11v10 M17 3c-2.5 2-2.5 7 0 9v9",
    umbrella: "M3 12a9 9 0 0 1 18 0H3z M12 12v7a2 2 0 0 0 4 0",
    glass: "M7 3h10l-1 8a4 4 0 0 1-8 0L7 3z M12 15v5 M8 21h8",
    bag: "M5 8h14l-1 12H6L5 8z M9 8V6a3 3 0 0 1 6 0v2"
  };
  var PAGE_SIZE = 9;
  var filters = { cat: "all", place: "all", q: "" };
  var expanded = false;

  var BENEFIT_ICONS = [
    "M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
    "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h2 M18 14h2v2 M14 18h2v2 M18 18v2h2",
    "M3 6h18v12H3z M3 7l9 6 9-6",
    "M5 19l1.5-4A8 8 0 1 1 9 18.5L5 19z"
  ];

  var SUPPORTED = ["en", "tr", "el"];
  var lang = "en";
  var selected = "agra";

  function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function tr(obj) { return obj == null ? "" : (typeof obj === "string" ? obj : (obj[lang] || obj.en)); }
  function fmt(s, vars) { return s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function catOf(id) { return CATEGORIES.filter(function (c) { return c.id === id; })[0]; }
  function placeOf(id) { return PLACES.filter(function (p) { return p.id === id; })[0]; }
  function mapsUrl(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
  function norm(s) { return String(s).toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

  function icon(d, cls) { return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>'; }

  /* ---- Language ---- */
  function pickInitialLang() {
    try {
      var saved = localStorage.getItem("lp-lang");
      if (saved && SUPPORTED.indexOf(saved) > -1) return saved;
    } catch (e) { /* storage unavailable */ }
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) > -1 ? nav : "en";
  }

  function setLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    try { localStorage.setItem("lp-lang", lang); } catch (e) { /* ignore */ }

    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.desc"));

    renderLists();
    renderFilters();
    renderOffers();
    drawLabels();
    renderPins(false);
  }

  /* ---- Lists ---- */
  function renderLists() {
    var L = I18N[lang];

    document.getElementById("benefits").innerHTML = L.benefits.map(function (b, i) {
      return '<li><span class="benefit-icon">' + icon(BENEFIT_ICONS[i]) + '</span><div><strong>' + esc(b[0]) + '</strong><span>' + esc(b[1]) + '</span></div></li>';
    }).join("");

    document.getElementById("steps").innerHTML = L.steps.map(function (s) {
      return '<li><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></li>';
    }).join("");

    document.getElementById("faq-list").innerHTML = L.faqs.map(function (f, i) {
      return '<details' + (i === 0 ? " open" : "") + '><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>';
    }).join("");

  }

  /* ---- Offers: filters, search, list ---- */
  function matches(p, ignorePlace) {
    if (filters.cat !== "all" && p.cat !== filters.cat) return false;
    if (!ignorePlace && filters.place !== "all" && p.place !== filters.place) return false;
    if (filters.q) {
      var hay = norm([tr(p.name), tr(p.offer), tr(placeOf(p.place)), tr(catOf(p.cat))].join(" "));
      if (hay.indexOf(norm(filters.q)) === -1) return false;
    }
    return true;
  }

  function sortedPartners() {
    return PARTNERS.slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
  }

  function renderFilters() {
    var chips = [{ id: "all", label: t("offers.allCats"), n: PARTNERS.length }].concat(CATEGORIES.map(function (c) {
      return { id: c.id, label: tr(c), n: PARTNERS.filter(function (p) { return p.cat === c.id; }).length, icon: c.icon };
    })).filter(function (c) { return c.n > 0; });
    document.getElementById("cat-chips").innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (filters.cat === c.id) + '">' +
        (c.icon ? icon(ICONS[c.icon]) : '') + '<span>' + esc(c.label) + '</span><span class="chip-n">' + c.n + '</span></button>';
    }).join("");

    var sel = document.getElementById("area-select");
    sel.innerHTML = '<option value="all">' + esc(t("offers.allAreas")) + '</option>' + PLACES.filter(function (pl) {
      return PARTNERS.some(function (p) { return p.place === pl.id; });
    }).map(function (pl) {
      return '<option value="' + pl.id + '"' + (filters.place === pl.id ? " selected" : "") + '>' + esc(tr(pl)) + '</option>';
    }).join("");
    document.getElementById("offer-search").setAttribute("placeholder", t("offers.searchPh"));
  }

  var PIN_ICON = "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z";
  var PHONE_ICON = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2";

  // Address and phone: shown only if filled in partners.js. Both work without internet.
  function contactHtml(p) {
    if (!p.address && !p.phone) return "";
    return '<div class="offer-contact">' +
      (p.address ? '<span class="oc-item">' + icon(PIN_ICON) + '<span>' + esc(tr(p.address)) + '</span></span>' : '') +
      (p.phone ? '<a class="oc-item oc-phone" href="tel:' + p.phone.replace(/[^+\d]/g, "") + '" aria-label="' + esc(t("offers.call") + " " + tr(p.name)) + '">' + icon(PHONE_ICON) + '<span>' + esc(p.phone) + '</span></a>' : '') +
      '</div>';
  }

  function renderOffers() {
    var list = sortedPartners().filter(function (p) { return matches(p, false); });
    var filtering = filters.cat !== "all" || filters.place !== "all" || filters.q;
    var shown = (expanded || filtering) ? list : list.slice(0, PAGE_SIZE);

    document.getElementById("offer-count").textContent = list.length === 1 ? t("offers.one") : fmt(t("offers.count"), { n: list.length });
    document.getElementById("offer-reset").hidden = !filtering;

    document.getElementById("offer-list").innerHTML = shown.length ? shown.map(function (p) {
      var c = catOf(p.cat), pl = placeOf(p.place);
      return '<li class="offer">' +
        '<div class="offer-band cat-' + p.cat + '">' + icon(ICONS[c.icon]) + '</div>' +
        '<div class="offer-body">' +
          '<span class="offer-meta">' + esc(tr(c)) + ' · ' + esc(tr(pl)) + (p.example ? ' <span class="offer-tag">' + esc(t("offers.example")) + '</span>' : '') + '</span>' +
          '<span class="offer-name">' + esc(tr(p.name)) + '</span>' +
          '<span class="offer-deal">' + esc(tr(p.offer)) + '</span>' +
          contactHtml(p) +
        '</div>' +
        '<a class="offer-map" href="' + mapsUrl(p.maps) + '" target="_blank" rel="noopener" aria-label="' + esc(t("offers.directions") + ": " + tr(p.name)) + '">' +
          icon(PIN_ICON) + '</a>' +
        '</li>';
    }).join("") : '<li class="offer-empty">' + esc(t("offers.empty")) + '</li>';

    var more = document.getElementById("offers-more");
    more.hidden = filtering || list.length <= PAGE_SIZE;
    more.textContent = expanded ? t("offers.less") : fmt(t("offers.more"), { n: list.length });
    more.setAttribute("aria-expanded", String(expanded));
  }

  /* ---- Map ---- */
  var W = 560, H = 390, LON0 = 25.78, LON1 = 26.80, LAT0 = 39.415;
  var K = W / (LON1 - LON0), KY = K * 1.287, OY = 28;
  function X(lon) { return (lon - LON0) * K; }
  function Y(lat) { return OY + (LAT0 - lat) * KY; }

  // Real Lesvos coastline (lat, lon). Source: OpenStreetMap contributors (ODbL), simplified.
  var COAST = [
    [39.1888,25.8316],[39.1821,25.8354],[39.1822,25.8413],[39.1776,25.8399],[39.1746,25.8438],[39.1751,25.8501],[39.1696,25.8555],[39.1717,25.8587],
    [39.1672,25.8673],[39.1584,25.8684],[39.1500,25.8752],[39.1509,25.8857],[39.1478,25.8917],[39.1413,25.8931],[39.1373,25.9227],[39.1263,25.9445],
    [39.1202,25.9430],[39.1044,25.9562],[39.1078,25.9830],[39.1056,25.9873],[39.1087,25.9933],[39.0862,26.0761],[39.0903,26.0853],[39.0967,26.0858],
    [39.0996,26.0907],[39.1040,26.0872],[39.1086,26.0972],[39.1118,26.0963],[39.1125,26.1030],[39.1162,26.1054],[39.1100,26.1050],[39.1049,26.1124],
    [39.1201,26.1145],[39.1271,26.1200],[39.1383,26.1229],[39.1386,26.1339],[39.1542,26.1422],[39.1578,26.1544],[39.1630,26.1571],[39.1827,26.1554],
    [39.1851,26.1611],[39.1970,26.1678],[39.1970,26.1840],[39.2066,26.2009],[39.2014,26.2214],[39.2069,26.2445],[39.1954,26.2828],[39.1820,26.2958],
    [39.1782,26.2955],[39.1760,26.2912],[39.1686,26.2909],[39.1684,26.2834],[39.1611,26.2863],[39.1548,26.2814],[39.1500,26.2502],[39.1422,26.2483],
    [39.1387,26.2318],[39.1306,26.2219],[39.1331,26.2077],[39.1284,26.2039],[39.1261,26.1884],[39.1091,26.1705],[39.1007,26.1690],[39.0943,26.1552],
    [39.0953,26.1461],[39.0865,26.1323],[39.0975,26.1158],[39.0928,26.1135],[39.0945,26.1052],[39.0815,26.0967],[39.0795,26.0846],[39.0725,26.0850],
    [39.0716,26.1057],[39.0616,26.1201],[39.0421,26.1334],[39.0377,26.1406],[39.0258,26.1457],[39.0132,26.1673],[39.0048,26.1686],[39.0118,26.1734],
    [39.0180,26.1871],[39.0190,26.2099],[39.0152,26.2375],[39.0011,26.2870],[38.9947,26.2933],[38.9930,26.3020],[38.9766,26.3280],[38.9768,26.3623],
    [38.9718,26.3706],[38.9746,26.3681],[38.9677,26.3920],[38.9623,26.3984],[38.9647,26.4104],[38.9616,26.4183],[38.9722,26.4698],[38.9702,26.4773],
    [38.9749,26.4813],[38.9727,26.4886],[38.9771,26.4910],[38.9771,26.4960],[38.9738,26.4970],[38.9745,26.5003],[38.9703,26.4993],[38.9699,26.5040],
    [38.9776,26.5053],[38.9758,26.5082],[38.9807,26.5137],[38.9774,26.5160],[38.9745,26.5130],[38.9708,26.5179],[38.9904,26.5452],[38.9907,26.5375],
    [38.9934,26.5369],[38.9985,26.5400],[38.9980,26.5442],[39.0040,26.5457],[39.0000,26.5367],[39.0043,26.5391],[39.0077,26.5377],[39.0090,26.5312],
    [39.0119,26.5346],[39.0214,26.5314],[39.0289,26.5176],[39.0402,26.5075],[39.0428,26.5085],[39.0531,26.4935],[39.0607,26.4908],[39.0684,26.4655],
    [39.0788,26.4588],[39.0832,26.4496],[39.1021,26.4414],[39.1127,26.4528],[39.1195,26.4830],[39.1187,26.4894],[39.1109,26.5013],[39.0917,26.5152],
    [39.0823,26.5286],[39.0621,26.5334],[39.0617,26.5183],[39.0570,26.5128],[39.0493,26.5117],[39.0455,26.5177],[39.0453,26.5315],[39.0388,26.5275],
    [39.0380,26.5210],[39.0294,26.5263],[39.0285,26.5345],[39.0125,26.5384],[39.0112,26.5415],[39.0177,26.5454],[39.0128,26.5553],[39.0174,26.5568],
    [39.0188,26.5642],[39.0143,26.5815],[39.0092,26.5892],[39.0092,26.6071],[39.0163,26.6135],[39.0245,26.6157],[39.0445,26.6129],[39.0660,26.5975],
    [39.0961,26.5573],[39.1031,26.5592],[39.1053,26.5557],[39.1044,26.5632],[39.0992,26.5633],[39.1062,26.5632],[39.1117,26.5674],[39.1129,26.5543],
    [39.1250,26.5471],[39.1381,26.5482],[39.1360,26.5384],[39.1409,26.5300],[39.1530,26.5326],[39.1606,26.5309],[39.1633,26.5403],[39.1675,26.5403],
    [39.1730,26.5205],[39.1720,26.5139],[39.1801,26.4999],[39.1942,26.4903],[39.2012,26.4911],[39.2045,26.4855],[39.2081,26.4877],[39.2128,26.4850],
    [39.2103,26.4799],[39.2140,26.4747],[39.2197,26.4796],[39.2244,26.4753],[39.2275,26.4613],[39.2344,26.4551],[39.2343,26.4516],[39.2388,26.4501],
    [39.2422,26.4310],[39.2447,26.4292],[39.2485,26.4319],[39.2513,26.4282],[39.2518,26.4210],[39.2621,26.4054],[39.2697,26.3809],[39.2784,26.3771],
    [39.2829,26.3795],[39.2866,26.3873],[39.2926,26.3880],[39.2976,26.3928],[39.2982,26.3975],[39.3050,26.3967],[39.3126,26.4058],[39.3157,26.4175],
    [39.3175,26.4100],[39.3203,26.4094],[39.3244,26.4177],[39.3293,26.4201],[39.3287,26.4251],[39.3316,26.4221],[39.3336,26.4246],[39.3437,26.4010],
    [39.3436,26.3843],[39.3396,26.3707],[39.3477,26.3651],[39.3470,26.3563],[39.3556,26.3500],[39.3579,26.3543],[39.3696,26.3574],[39.3725,26.3660],
    [39.3777,26.3669],[39.3772,26.3555],[39.3823,26.3517],[39.3823,26.3442],[39.3902,26.3415],[39.3866,26.3350],[39.3797,26.3323],[39.3732,26.3168],
    [39.3759,26.3080],[39.3735,26.3044],[39.3779,26.2525],[39.3833,26.2353],[39.3835,26.2247],[39.3750,26.2055],[39.3741,26.1956],[39.3791,26.1839],
    [39.3748,26.1811],[39.3735,26.1677],[39.3706,26.1658],[39.3660,26.1745],[39.3565,26.1744],[39.3514,26.1687],[39.3498,26.1715],[39.3460,26.1693],
    [39.3363,26.1814],[39.3253,26.1712],[39.3224,26.1504],[39.3176,26.1452],[39.3149,26.1320],[39.3080,26.1278],[39.3087,26.1206],[39.3056,26.1173],
    [39.3054,26.1124],[39.3155,26.1014],[39.3143,26.0982],[39.3106,26.0998],[39.3042,26.0948],[39.3026,26.0785],[39.2958,26.0735],[39.2915,26.0454],
    [39.2936,26.0440],[39.2957,26.0481],[39.2979,26.0381],[39.2928,26.0417],[39.2918,26.0355],[39.2883,26.0377],[39.2862,26.0241],[39.2925,26.0189],
    [39.2889,26.0055],[39.2808,26.0032],[39.2782,25.9960],[39.2780,25.9772],[39.2820,25.9732],[39.2849,25.9761],[39.2854,25.9699],[39.2741,25.9517],
    [39.2831,25.9373],[39.2797,25.9376],[39.2786,25.9282],[39.2816,25.9200],[39.2951,25.9218],[39.2911,25.9149],[39.2926,25.9112],[39.2885,25.9083],
    [39.2946,25.9043],[39.2887,25.9050],[39.2862,25.9019],[39.2832,25.9051],[39.2758,25.8887],[39.2787,25.8869],[39.2785,25.8819],[39.2750,25.8829],
    [39.2746,25.8786],[39.2691,25.8787],[39.2704,25.8738],[39.2574,25.8660],[39.2552,25.8560],[39.2534,25.8590],[39.2413,25.8622],[39.2329,25.8560],
    [39.2350,25.8475],[39.2284,25.8456],[39.2232,25.8509],[39.2270,25.8512],[39.2253,25.8576],[39.2231,25.8537],[39.2204,25.8570],[39.2154,25.8561],
    [39.2119,25.8488],[39.2085,25.8547],[39.2040,25.8496],[39.1995,25.8554],[39.1969,25.8492],[39.1919,25.8556],[39.1879,25.8489],[39.1820,25.8529],
    [39.1840,25.8427],[39.1885,25.8422]
  ];
  // A sliver of the Turkish coast (Ayvalık) on the east edge, for orientation.
  var TURKEY = [
    [39.450,26.700],[39.380,26.670],[39.330,26.655],[39.300,26.680],[39.250,26.715],[39.180,26.745],
    [39.100,26.780],[38.990,26.800],[38.900,26.820]
  ];
  /* Village and town names on the map.
     major: true = bigger, bolder label. anchor/dx/dy = where the name sits relative to the dot. */
  var TOWNS = [
    { en: "Mytilene", tr: "Midilli", el: "Μυτιλήνη", lat: 39.105, lon: 26.555, major: true, anchor: "end", dx: -9, dy: 4 },
    { en: "Molyvos", tr: "Molyvos", el: "Μόλυβος", lat: 39.368, lon: 26.175, major: true, anchor: "end", dx: -24, dy: 2 },
    { en: "Plomari", tr: "Plomari", el: "Πλωμάρι", lat: 38.972, lon: 26.368, major: true, anchor: "middle", dx: 0, dy: 18 },
    { en: "Kalloni", tr: "Kalloni", el: "Καλλονή", lat: 39.235, lon: 26.205, major: true, anchor: "start", dx: 8, dy: 4 },
    { en: "Eresos", tr: "Eresos", el: "Ερεσός", lat: 39.169, lon: 25.933, anchor: "end", dx: -6, dy: -8 },
    { en: "Sigri", tr: "Sigri", el: "Σίγρι", lat: 39.212, lon: 25.855, anchor: "start", dx: 7, dy: 4 },
    { en: "Antissa", tr: "Antissa", el: "Άντισσα", lat: 39.263, lon: 26.013, anchor: "start", dx: 7, dy: 4 },
    { en: "Agra", tr: "Agra", el: "Άγρα", lat: 39.158, lon: 26.060, anchor: "middle", dx: 0, dy: 16 },
    { en: "Petra", tr: "Petra", el: "Πέτρα", lat: 39.323, lon: 26.180, anchor: "start", dx: 7, dy: 4 },
    { en: "Skala Sykamias", tr: "Skala Sykamias", el: "Σκάλα Συκαμιάς", lat: 39.375, lon: 26.305, anchor: "start", dx: 6, dy: -6 },
    { en: "Mantamados", tr: "Mantamados", el: "Μανταμάδος", lat: 39.311, lon: 26.341, anchor: "middle", dx: 0, dy: 16 },
    { en: "Thermi", tr: "Thermi", el: "Θερμή", lat: 39.183, lon: 26.490, anchor: "end", dx: -7, dy: 4 },
    { en: "Agiasos", tr: "Agiasos", el: "Αγιάσος", lat: 39.085, lon: 26.378, anchor: "middle", dx: 0, dy: 16 },
    { en: "Polichnitos", tr: "Polichnitos", el: "Πολιχνίτος", lat: 39.079, lon: 26.173, anchor: "middle", dx: 0, dy: 16 },
    { en: "Vatera", tr: "Vatera", el: "Βατερά", lat: 38.990, lon: 26.200, anchor: "middle", dx: 0, dy: 16 }
  ];
  var TURKEY_NAMES = {
    en: { ayvalik: "Ayvalık", turkey: "Turkey" },
    tr: { ayvalik: "Ayvalık", turkey: "Türkiye" },
    el: { ayvalik: "Αϊβαλί", turkey: "Τουρκία" }
  };

  // Straight path through the real coastline points.
  function line(pts, closed) {
    return pts.map(function (p, i) { return (i ? "L" : "M") + X(p[1]).toFixed(1) + " " + Y(p[0]).toFixed(1); }).join(" ") + (closed ? " Z" : "");
  }

  // Smooth open path (used for the Turkish coast only).
  function smooth(pts) {
    var P = pts.map(function (p) { return [X(p[1]), Y(p[0])]; });
    var n = P.length, d = "M" + P[0][0].toFixed(1) + " " + P[0][1].toFixed(1);
    for (var i = 0; i < n - 1; i++) {
      var p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, n - 1)];
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += " C" + c1[0].toFixed(1) + " " + c1[1].toFixed(1) + " " + c2[0].toFixed(1) + " " + c2[1].toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }

  function drawCoast() {
    document.getElementById("coast").setAttribute("d", line(COAST, true));
    var tk = smooth(TURKEY) + " L" + W + " " + H + " L" + W + " 0 Z";
    document.getElementById("turkey").setAttribute("d", tk);
    // Latitude / longitude grid for a cartographic look
    var svg = document.querySelector(".island-svg");
    if (!document.getElementById("graticule")) {
      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.id = "graticule";
      var d = "", labels = "";
      for (var la = 39.0; la <= 39.41; la += 0.1) {
        var y = Y(la).toFixed(1);
        d += "M0 " + y + " H" + W + " ";
        labels += '<text class="grid-label" x="8" y="' + (Y(la) - 4).toFixed(1) + '">' + la.toFixed(1) + '\u00b0N</text>';
      }
      for (var lo = 26.0; lo <= 26.61; lo += 0.2) {
        var x = X(lo).toFixed(1);
        d += "M" + x + " 0 V" + H + " ";
        labels += '<text class="grid-label" x="' + (X(lo) + 4).toFixed(1) + '" y="' + (H - 26) + '">' + lo.toFixed(1) + '\u00b0E</text>';
      }
      g.innerHTML = '<path class="grid-line" d="' + d + '"/>' + labels;
      svg.insertBefore(g, svg.firstChild.nextSibling);
    }
    // Map data credit (required by the OpenStreetMap licence)
    if (!document.getElementById("osm-credit")) {
      var credit = document.createElementNS("http://www.w3.org/2000/svg", "text");
      credit.id = "osm-credit"; credit.setAttribute("class", "map-credit");
      credit.setAttribute("x", 12); credit.setAttribute("y", H - 10);
      credit.textContent = "\u00a9 OpenStreetMap";
      document.querySelector(".island-svg").appendChild(credit);
    }
  }

  function drawLabels() {
    var html = TOWNS.map(function (t) {
      var x = X(t.lon), y = Y(t.lat);
      return '<circle class="town-dot' + (t.major ? ' major' : '') + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (t.major ? 3 : 2.2) + '"/>' +
        '<text class="town-label' + (t.major ? ' major' : '') + '" x="' + (x + t.dx).toFixed(1) + '" y="' + (y + t.dy).toFixed(1) + '" text-anchor="' + t.anchor + '">' + esc(t[lang] || t.en) + '</text>';
    }).join("");
    var T = TURKEY_NAMES[lang] || TURKEY_NAMES.en;
    html += '<text class="turkey-label" x="' + (W - 10) + '" y="' + Y(39.315).toFixed(1) + '" text-anchor="end">' + esc(T.ayvalik) + '</text>';
    html += '<text class="turkey-label turkey-country" x="' + (W - 10) + '" y="' + Y(39.23).toFixed(1) + '" text-anchor="end">' + esc(T.turkey) + '</text>';
    document.getElementById("map-labels").innerHTML = html;
  }

  function placesWithOffers() {
    return PLACES.map(function (pl) {
      return { place: pl, items: sortedPartners().filter(function (p) { return p.place === pl.id && matches(p, true); }) };
    }).filter(function (g) { return g.items.length > 0; });
  }

  function renderPins(animate) {
    var groups = placesWithOffers();
    if (!groups.some(function (g) { return g.place.id === selected; }) && groups.length) selected = groups[0].place.id;
    document.getElementById("pins").innerHTML = groups.map(function (g, i) {
      var pl = g.place, n = g.items.length;
      var left = (X(pl.lon) / W * 100).toFixed(2), top = (Y(pl.lat) / H * 100).toFixed(2);
      var label = tr(pl) + ", " + (n === 1 ? t("offers.one") : fmt(t("offers.count"), { n: n }));
      return '<button type="button" class="pin" data-place="' + pl.id + '" aria-pressed="' + (pl.id === selected) + '" aria-label="' + esc(label) + '"' +
        ' style="left:' + left + '%;top:' + top + '%;' + (animate ? 'animation-delay:' + (150 + i * 90) + 'ms' : 'animation:none') + '">' +
        '<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 43c-1-5-13-15-13-25a13 13 0 0 1 26 0c0 10-12 20-13 25z"/><circle cx="20" cy="18" r="5.5"/></svg>' +
        (n > 1 ? '<span class="pin-count" aria-hidden="true">' + n + '</span>' : '') +
        '</button>';
    }).join("");
    renderPinCard();
  }

  function renderPinCard() {
    var card = document.getElementById("pin-card");
    var g = placesWithOffers().filter(function (x) { return x.place.id === selected; })[0];
    if (!g) { card.innerHTML = '<span class="pc-name">' + esc(t("offers.empty")) + '</span>'; return; }
    var pl = g.place, n = g.items.length, name = tr(pl);
    if (n === 1) {
      var p = g.items[0];
      card.innerHTML = '<div class="pc-main"><span class="pc-meta">' + esc(name) + ' · ' + esc(tr(catOf(p.cat))) + '</span>' +
        '<span class="pc-name">' + esc(tr(p.name)) + '</span>' +
        '<span class="pc-offer">' + esc(tr(p.offer)) + (p.example ? ' (' + esc(t("offers.example").toLowerCase()) + ')' : '') + '</span>' +
        contactHtml(p) + '</div>' +
        '<a class="btn btn-line btn-small pc-action" href="' + mapsUrl(p.maps) + '" target="_blank" rel="noopener">' + esc(t("map.directions")) + '</a>';
      return;
    }
    var top3 = g.items.slice(0, 3).map(function (p) {
      return '<li><span>' + esc(tr(p.name)) + '</span><span class="pc-li-offer">' + esc(tr(p.offer)) + '</span></li>';
    }).join("");
    card.innerHTML = '<div class="pc-main"><span class="pc-name">' + esc(fmt(t("map.count"), { n: n, place: name })) + '</span>' +
      '<ul class="pc-list">' + top3 + '</ul>' +
      (n > 3 ? '<span class="pc-meta">' + esc(fmt(t("map.more"), { n: n - 3 })) + '</span>' : '') + '</div>' +
      '<button type="button" class="btn btn-sun btn-small pc-action" data-see-place="' + pl.id + '">' + esc(fmt(t("map.seeArea"), { place: name })) + '</button>';
  }

  /* ---- Decorative QR on the ticket ---- */
  function drawQR() {
    var n = 25, s = 11, html = "";
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    function finder(r, c, r0, c0) {
      var y = r - r0, x = c - c0;
      if (y < 0 || x < 0 || y > 6 || x > 6) return null;
      if (y === 0 || y === 6 || x === 0 || x === 6) return true;
      return y >= 2 && y <= 4 && x >= 2 && x <= 4;
    }
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      var v = finder(r, c, 0, 0);
      if (v === null) v = finder(r, c, 0, n - 7);
      if (v === null) v = finder(r, c, n - 7, 0);
      if (v === null) v = ((r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8)) ? false : rnd() > 0.52;
      html += '<span class="' + (v ? "on" : "") + '"></span>';
    }
    document.getElementById("qr").innerHTML = html;
  }

  /* ---- Contact links ---- */
  function setupContact() {
    if (CONFIG.whatsapp) {
      ["whatsapp-link", "bar-whatsapp"].forEach(function (id) {
        var wa = document.getElementById(id);
        wa.href = "https://wa.me/" + CONFIG.whatsapp;
        wa.target = "_blank"; wa.rel = "noopener";
      });
    }
    if (CONFIG.email) {
      document.getElementById("email-link").href = "mailto:" + CONFIG.email;
    }
  }

  /* ---- Events ---- */
  document.addEventListener("click", function (e) {
    var langBtn = e.target.closest(".lang-switch button");
    if (langBtn) { setLang(langBtn.getAttribute("data-lang")); return; }

    var pin = e.target.closest(".pin");
    if (pin) {
      selected = pin.getAttribute("data-place");
      document.querySelectorAll(".pin").forEach(function (b) { b.setAttribute("aria-pressed", String(b === pin)); });
      renderPinCard();
      return;
    }

    var see = e.target.closest("[data-see-place]");
    if (see) {
      filters.place = see.getAttribute("data-see-place");
      document.getElementById("area-select").value = filters.place;
      renderOffers();
      document.getElementById("offers").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      return;
    }

    var chip = e.target.closest(".chip");
    if (chip) {
      filters.cat = chip.getAttribute("data-cat");
      document.querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b === chip)); });
      renderOffers(); renderPins(false);
      return;
    }

    if (e.target.closest("#offers-more")) { expanded = !expanded; renderOffers(); return; }

    if (e.target.closest("#offer-reset")) {
      filters = { cat: "all", place: "all", q: "" };
      document.getElementById("offer-search").value = "";
      renderFilters(); renderOffers(); renderPins(false);
      return;
    }

    var toggle = e.target.closest(".menu-toggle");
    var nav = document.getElementById("main-nav");
    if (toggle) {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      return;
    }
    if (e.target.closest(".main-nav a")) {
      nav.classList.remove("is-open");
      document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
    }
  });

  document.getElementById("offer-search").addEventListener("input", function (e) {
    filters.q = e.target.value.trim();
    renderOffers(); renderPins(false);
  });
  document.getElementById("area-select").addEventListener("change", function (e) {
    filters.place = e.target.value;
    renderOffers();
    if (filters.place !== "all") { selected = filters.place; renderPins(false); }
  });

  /* ---- Mobile bottom bar: shows once the hero buttons scroll out of view ---- */
  function setupMobileBar() {
    var bar = document.getElementById("mobile-bar");
    var heroActions = document.querySelector(".hero-actions");
    if (!bar || !heroActions || !("IntersectionObserver" in window)) { if (bar) bar.classList.add("is-visible"); return; }
    new IntersectionObserver(function (entries) {
      bar.classList.toggle("is-visible", !entries[0].isIntersecting);
    }).observe(heroActions);
  }

  /* ---- Gentle reveal of sections as they scroll into view ---- */
  function setupReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Offline: save the site on the phone, show a note when there is no internet ---- */
  function setupOffline() {
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(function () { /* not critical */ });
    }
    var note = document.getElementById("offline-note");
    function update() { if (note) note.hidden = navigator.onLine; }
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
  }

  /* ---- Start ---- */
  drawCoast();
  drawQR();
  setupContact();
  setupMobileBar();
  setupReveal();
  setupOffline();
  lang = pickInitialLang();
  setLang(lang);
  renderPins(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
})();
