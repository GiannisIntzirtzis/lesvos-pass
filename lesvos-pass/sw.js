/* Lesvos Pass — offline support (service worker).
   After the first visit with internet, the whole site (offers, map, legal pages)
   is saved on the phone and opens even without internet.
   IMPORTANT: every time you change files, increase the version below (v1 -> v2 ...)
   so visitors receive the new version. */
var CACHE = "lesvos-pass-v2";
var FILES = [
  "./",
  "index.html",
  "terms.html",
  "sale.html",
  "privacy.html",
  "css/styles.css",
  "js/i18n.js",
  "js/partners.js",
  "js/main.js",
  "js/legal-content.js",
  "js/legal-page.js",
  "card.html",
  "partner.html",
  "businesses.html",
  "js/business.js",
  "js/config.js",
  "js/api.js",
  "js/common.js",
  "js/card.js",
  "js/partner.js",
  "js/vendor/qrcode.js",
  "manifest.webmanifest",
  "icons/icon.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Show the saved copy instantly, and quietly refresh it in the background when online.
self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== location.origin && !isFont) return;

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req, { ignoreSearch: true }).then(function (cached) {
        var network = fetch(req).then(function (res) {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        }).catch(function () {
          if (req.mode === "navigate") return cache.match("index.html");
          return cached;
        });
        return cached || network;
      });
    })
  );
});
