/* Lesvos Pass — legal pages (terms.html, sale.html, privacy.html) */
(function () {
  "use strict";

  var SUPPORTED = ["en", "tr", "el"];
  var doc = document.body.getAttribute("data-doc");
  var lang = "en";

  function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function pickInitialLang() {
    try {
      var saved = localStorage.getItem("lp-lang");
      if (saved && SUPPORTED.indexOf(saved) > -1) return saved;
    } catch (e) { /* storage unavailable */ }
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) > -1 ? nav : "en";
  }

  // Replace {company}, {email}... with the values in COMPANY; empty values are highlighted.
  function fill(text) {
    return esc(text).replace(/\{(\w+)\}/g, function (m, key) {
      var v = COMPANY[key];
      if (v && typeof v === "object") v = v[lang] || v.en;
      return v ? esc(v) : '<mark class="todo">[' + esc(t("legal.missing")) + ']</mark>';
    });
  }

  function render() {
    var d = LEGAL[doc][lang] || LEGAL[doc].en;
    document.title = d.title + " | Lesvos Pass";
    document.getElementById("legal-title").textContent = d.title;
    document.getElementById("legal-updated").innerHTML = COMPANY.updated ? esc(COMPANY.updated) : '<mark class="todo">[' + esc(t("legal.missing")) + ']</mark>';

    var missing = ["company", "address", "vat", "gemi", "email"].some(function (k) { return !COMPANY[k]; });

    document.getElementById("legal-toc").innerHTML = d.sections.map(function (s, i) {
      return '<li><a href="#s' + (i + 1) + '">' + esc(s[0]) + '</a></li>';
    }).join("");

    document.getElementById("legal-content").innerHTML =
      (missing ? '<p class="legal-draft">' + esc(t("legal.draft")) + '</p>' : '') +
      '<p class="legal-intro">' + fill(d.intro) + '</p>' +
      d.sections.map(function (s, i) {
        return '<section id="s' + (i + 1) + '"><h2><span class="legal-num">' + (i + 1) + '.</span> ' + esc(s[0]) + '</h2>' +
          s[1].map(function (p) { return '<p>' + fill(p) + '</p>'; }).join("") + '</section>';
      }).join("");
  }

  function setLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    try { localStorage.setItem("lp-lang", lang); } catch (e) { /* ignore */ }
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    render();
  }

  document.addEventListener("click", function (e) {
    var langBtn = e.target.closest(".lang-switch button");
    if (langBtn) { setLang(langBtn.getAttribute("data-lang")); return; }
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

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* not critical */ });
  }

  setLang(pickInitialLang());
})();
