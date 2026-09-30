/* Lesvos Pass — page for businesses (businesses.html): benefits, steps, FAQ and partner sign-up form. */
(function () {
  "use strict";
  var P = window.LPPage;
  function $(id) { return document.getElementById(id); }
  var ICONS = [
    "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0z M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6",
    "M3 5h18v14H3z M3 9h18 M8 14h3",
    "M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z",
    "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M11 18h2"
  ];

  function render() {
    var L = I18N[P.lang] || I18N.en;
    document.title = P.t("bz.metaTitle");
    $("bz-benefits").innerHTML = L["bz.benefits"].map(function (b, i) {
      return '<li><span class="bz-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[i] + '"/></svg></span>' +
        '<h3>' + P.esc(b[0]) + '</h3><p>' + P.esc(b[1]) + '</p></li>';
    }).join("");
    $("bz-steps").innerHTML = L["bz.steps"].map(function (s) { return '<li><h3>' + P.esc(s[0]) + '</h3><p>' + P.esc(s[1]) + '</p></li>'; }).join("");
    $("bz-faq-list").innerHTML = L["bz.faqs"].map(function (f, i) {
      return '<details' + (i === 0 ? " open" : "") + '><summary>' + P.esc(f[0]) + '</summary><p>' + P.esc(f[1]) + '</p></details>';
    }).join("");
    var g = P.partner("genesis");
    $("bz-mock-offer").innerHTML = '<span>' + P.esc(P.t("partner.yourOffer")) + ':</span> ' + P.esc(g ? P.tr(g.offer) : "");

    var area = $("f-area").value, cat = $("f-cat").value;
    $("f-area").innerHTML = (window.PLACES || []).map(function (pl) { return '<option value="' + pl.id + '">' + P.esc(P.tr(pl)) + '</option>'; }).join("") +
      '<option value="other">' + P.esc(P.t("bz.fOther")) + '</option>';
    $("f-cat").innerHTML = (window.CATEGORIES || []).map(function (c) { return '<option value="' + c.id + '">' + P.esc(P.tr(c)) + '</option>'; }).join("") +
      '<option value="other">' + P.esc(P.t("bz.fOther")) + '</option>';
    if (area) $("f-area").value = area;
    if (cat) $("f-cat").value = cat;
  }

  $("lead-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("lead-error"), btn = $("lead-btn");
    var d = {
      p_business: $("f-business").value.trim(), p_name: $("f-name").value.trim(),
      p_phone: $("f-phone").value.trim(), p_email: $("f-email").value.trim(),
      p_area: $("f-area").value, p_category: $("f-cat").value, p_message: $("f-msg").value.trim(), p_lang: P.lang
    };
    err.hidden = true;
    if ($("f-website").value) return;   // a bot filled the hidden field
    if (!d.p_business || !d.p_name || (!d.p_phone && !d.p_email) || !$("f-consent").checked) {
      err.textContent = P.t("bz.fError"); err.hidden = false; return;
    }
    btn.disabled = true; btn.textContent = P.t("bz.fSending");
    LP.submitLead(d).then(function (res) {
      if (!res || !res.ok) throw new Error("rejected");
      Array.prototype.forEach.call($("lead-form").querySelectorAll("label, #lead-btn"), function (el) { el.hidden = true; });
      $("lead-thanks").hidden = false;
    }).catch(function () {
      err.textContent = P.t("partner.netError"); err.hidden = false;
      btn.disabled = false; btn.textContent = P.t("bz.fSend");
    });
  });

  // Gentle reveal, as on the home page
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
  }

  P.onLang(render);
  P.setLang(P.lang);
})();
