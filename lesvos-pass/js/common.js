/* Lesvos Pass — shared helpers for the card and partner pages (language, menu, offline, scan results). */
(function () {
  "use strict";
  var SUPPORTED = ["en", "tr", "el"];
  var LOCALES = { en: "en-GB", tr: "tr-TR", el: "el-GR" };
  var listeners = [];
  var P = { lang: "en" };

  P.t = function (key) { return (I18N[P.lang] && I18N[P.lang][key]) || I18N.en[key] || key; };
  P.fmt = function (s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); };
  P.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  P.tr = function (o) { return o == null ? "" : (typeof o === "string" ? o : (o[P.lang] || o.en)); };
  P.date = function (iso) { return iso ? new Date(iso).toLocaleDateString(LOCALES[P.lang], { day: "numeric", month: "long", year: "numeric" }) : ""; };
  P.dateTime = function (iso) { return iso ? new Date(iso).toLocaleString(LOCALES[P.lang], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""; };
  P.partner = function (id) { return (window.PARTNERS || []).filter(function (p) { return p.id === id; })[0]; };
  P.onLang = function (fn) { listeners.push(fn); };

  function pickInitialLang() {
    try { var s = localStorage.getItem("lp-lang"); if (s && SUPPORTED.indexOf(s) > -1) return s; } catch (e) { /* ignore */ }
    var n = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(n) > -1 ? n : "en";
  }

  P.setLang = function (l) {
    P.lang = l;
    document.documentElement.lang = l;
    try { localStorage.setItem("lp-lang", l); } catch (e) { /* ignore */ }
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = P.t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", P.t(el.getAttribute("data-i18n-ph"))); });
    document.querySelectorAll(".lang-switch button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l)); });
    listeners.forEach(function (fn) { fn(l); });
  };

  // Renders the result of a partner scan (used on the partner page and on the card page in partner mode).
  var TONE = { valid: "ok", redeemed: "ok", used_here: "bad", expired: "bad", void: "bad", inactive: "warn", not_found: "bad", not_partner: "warn" };
  P.renderScan = function (el, res, onConfirm) {
    var st = res.state, tone = TONE[st] || "warn";
    var title = P.t("scan." + st), hint = "";
    if (st === "valid") hint = P.t("scan.validHint");
    if (st === "redeemed") hint = P.fmt(P.t("scan.redeemedHint"), { time: P.dateTime(res.used_at) });
    if (st === "used_here") hint = P.fmt(P.t("scan.usedHint"), { time: P.dateTime(res.used_at) });
    if (st === "expired") hint = P.fmt(P.t("card.until"), { date: P.date(res.expires_at) });
    var icon = tone === "ok" ? "M5 12.5l4.5 4.5L19 7" : (tone === "bad" ? "M7 7l10 10 M17 7L7 17" : "M12 7v6 M12 16.5v.5");
    var p = res.partner && P.partner(res.partner);
    el.innerHTML = '<div class="scan-result tone-' + tone + '" role="status">' +
      '<div class="sr-head"><span class="sr-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + icon + '"/></svg></span>' +
      '<div><p class="sr-title">' + P.esc(title) + '</p>' + (res.number ? '<p class="sr-number">' + P.esc(res.number) + '</p>' : '') + '</div></div>' +
      (hint ? '<p class="sr-hint">' + P.esc(hint) + '</p>' : '') +
      (st === "valid" && p ? '<p class="sr-offer"><span>' + P.esc(P.t("partner.yourOffer")) + ':</span> ' + P.esc(P.tr(p.offer)) + '</p>' : '') +
      (st === "valid" ? '<button type="button" class="btn btn-ok sr-confirm">' + P.esc(P.t("scan.confirm")) + '</button>' : '') +
      '</div>';
    var b = el.querySelector(".sr-confirm");
    if (b && onConfirm) b.addEventListener("click", function () { b.disabled = true; b.textContent = P.t("scan.checking"); onConfirm(); });
  };

  document.addEventListener("click", function (e) {
    var lb = e.target.closest(".lang-switch button");
    if (lb) { P.setLang(lb.getAttribute("data-lang")); return; }
    var toggle = e.target.closest(".menu-toggle"), nav = document.getElementById("main-nav");
    if (toggle && nav) { var open = nav.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(open)); }
  });

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* not critical */ });
  }

  P.lang = pickInitialLang();
  window.LPPage = P;
})();
