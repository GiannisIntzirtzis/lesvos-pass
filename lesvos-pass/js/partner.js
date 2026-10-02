/* Lesvos Pass — partner area (partner.html): scan, results, my business, help. */
(function () {
  "use strict";
  var P = window.LPPage, C = window.LP_CONFIG;
  var stream = null, scanning = false, lastCode = "";
  var lastRes = null, lastScanCode = "", shopId = null, stats = null, tab = "scan";

  function $(id) { return document.getElementById(id); }

  /* ---------- Views ---------- */
  function showView() {
    var signed = LP.hasSession();
    $("login-view").hidden = signed;
    $("app-view").hidden = !signed;
    document.body.classList.toggle("pt-signed", signed);
    if (!signed) return;
    $("partner-email").textContent = LP.email() || "";
    LP.me().then(function (me) {
      if (me && me.partner) { shopId = me.partner; showShop(); }
      else { $("shop-name").textContent = P.t("scan.not_partner"); }
    }).catch(handleAuthError);
    setTab(tab);
  }

  function handleAuthError(e) {
    if (e && e.status === 401) { LP.logout(); showView(); }
  }

  function setTab(name) {
    tab = name;
    ["scan", "stats", "shop", "help"].forEach(function (t) {
      $("tab-" + t).hidden = t !== name;
      $("t-" + t).setAttribute("aria-selected", String(t === name));
    });
    if (name !== "scan") stopCamera();
    if (name === "stats") loadStats();
    window.scrollTo({ top: 0 });
  }

  /* ---------- My business header ---------- */
  function showShop() {
    var p = P.partner(shopId);
    $("shop-name").textContent = p ? P.tr(p.name) : shopId;
    $("shop-offer").textContent = p ? P.tr(p.offer) : "";
    $("shop-offer-line").hidden = !p;
    renderListing();
  }

  /* ---------- 1. Scan ---------- */
  function showResult() {
    var out = $("scan-output");
    if (!lastRes) { out.innerHTML = ""; return; }
    P.renderScan(out, lastRes, confirmUse);
    if (lastRes.state !== "valid") addNewScan(out);
  }

  function check(code) {
    code = LP.extractCode(code);
    if (!code) return;
    var out = $("scan-output");
    out.innerHTML = '<p class="muted">' + P.esc(P.t("scan.checking")) + '</p>';
    LP.scan(code, false).then(function (res) {
      lastRes = res; lastScanCode = code;
      if (res.partner && !shopId) { shopId = res.partner; showShop(); }
      showResult();
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    }).catch(function (e) {
      if (e.status === 401) return handleAuthError(e);
      out.innerHTML = '<p class="form-error">' + P.esc(P.t("partner.netError")) + '</p>';
    });
  }

  function confirmUse() {
    LP.scan(lastScanCode, true).then(function (r2) { lastRes = r2; stats = null; showResult(); })
      .catch(function () { $("scan-output").innerHTML = '<p class="form-error">' + P.esc(P.t("partner.netError")) + '</p>'; });
  }

  function addNewScan(out) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn btn-line"; b.textContent = P.t("scan.new");
    b.addEventListener("click", function () { lastRes = null; out.innerHTML = ""; $("card-number").value = ""; lastCode = ""; window.scrollTo({ top: 0, behavior: "smooth" }); });
    out.appendChild(b);
  }

  /* In-page scanner: works on iPhone and Android.
     Uses the phone's built-in QR reader when available, otherwise the jsQR library. */
  var JSQR_URL = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
  var canvas = null, ctx2d = null;

  function loadJsQR() {
    if (window.jsQR) return Promise.resolve();
    return new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = JSQR_URL; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  function makeDetector() {
    if ("BarcodeDetector" in window) {
      try {
        var bd = new window.BarcodeDetector({ formats: ["qr_code"] });
        return Promise.resolve(function (video) {
          return bd.detect(video).then(function (codes) { return codes.length ? codes[0].rawValue : null; });
        });
      } catch (e) { /* fall back to jsQR */ }
    }
    return loadJsQR().then(function () {
      canvas = canvas || document.createElement("canvas");
      ctx2d = ctx2d || canvas.getContext("2d", { willReadFrequently: true });
      return function (video) {
        var w = video.videoWidth, h = video.videoHeight;
        if (!w || !h) return Promise.resolve(null);
        var scale = Math.min(1, 640 / Math.max(w, h));
        canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
        ctx2d.drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
        var code = window.jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        return Promise.resolve(code ? code.data : null);
      };
    });
  }

  function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return cameraError();
    var video = $("scan-video");
    lastRes = null; $("scan-output").innerHTML = "";
    // Ask for the camera first (must happen right after the tap on iPhone)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }).then(function (s) {
      stream = s; video.srcObject = s;
      $("scan-box").hidden = false; $("scan-stop").hidden = false; $("scan-here").hidden = true; $("scan-how").hidden = true;
      return video.play().then(makeDetector);
    }).then(function (detect) {
      scanning = true; lastCode = "";
      (function loop() {
        if (!scanning) return;
        detect(video).then(function (value) {
          if (value && scanning) {
            if (navigator.vibrate) navigator.vibrate(60);
            stopCamera(); check(value);
          } else setTimeout(loop, 150);
        }).catch(function () { setTimeout(loop, 250); });
      })();
    }).catch(function () { stopCamera(); cameraError(); });
  }

  function stopCamera() {
    scanning = false;
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    stream = null;
    var v = $("scan-video"); if (v) v.srcObject = null;
    $("scan-box").hidden = true; $("scan-stop").hidden = true; $("scan-here").hidden = false; $("scan-how").hidden = false;
  }
  function cameraError() { $("scan-output").innerHTML = '<p class="form-error">' + P.esc(P.t("partner.cameraError")) + '</p>'; }

  /* ---------- 2. Results ---------- */
  function loadStats() {
    if (stats) return renderStats();
    $("stats-tiles").innerHTML = '<p class="muted">' + P.esc(P.t("scan.checking")) + '</p>';
    LP.stats().then(function (s) { stats = s; renderStats(); }).catch(function (e) {
      if (e.status === 401) return handleAuthError(e);
      $("stats-tiles").innerHTML = '<p class="form-error">' + P.esc(P.t("partner.netError")) + '</p>';
    });
  }

  function renderStats() {
    if (!stats || stats.state !== "ok") return;
    var tiles = [["pt.today", stats.today], ["pt.week", stats.week], ["pt.month", stats.month], ["pt.total", stats.total]];
    $("stats-tiles").innerHTML = tiles.map(function (x) {
      return '<div class="pt-tile"><span class="pt-tile-n">' + x[1] + '</span><span class="pt-tile-l">' + P.esc(P.t(x[0])) + '</span></div>';
    }).join("");

    var days = stats.daily || [], max = Math.max(1, Math.max.apply(null, days.map(function (d) { return d.n; })));
    var W = 320, H = 120, gap = 4, bw = (W - gap * (days.length - 1)) / Math.max(days.length, 1);
    var bars = days.map(function (d, i) {
      var h = Math.max(d.n ? 6 : 2, (d.n / max) * (H - 24));
      var x = i * (bw + gap), y = H - 18 - h;
      var label = new Date(d.day + "T12:00:00").toLocaleDateString(P.lang === "el" ? "el-GR" : P.lang === "tr" ? "tr-TR" : "en-GB", { day: "numeric" });
      return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3" class="' + (d.n ? "bar" : "bar-empty") + '"><title>' + P.esc(P.date(d.day + "T12:00:00")) + ": " + d.n + '</title></rect>' +
        (d.n ? '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" class="bar-n">' + d.n + '</text>' : '') +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 4) + '" class="bar-d">' + label + '</text>';
    }).join("");
    $("stats-chart").innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + P.esc(P.t("pt.last14")) + '">' + bars + '</svg>';

    var rec = stats.recent || [];
    $("stats-recent").innerHTML = rec.length ? rec.map(function (r) {
      return '<li><span class="pt-r-card">' + P.esc(r.card) + '</span><span class="pt-r-at">' + P.esc(P.dateTime(r.at)) + '</span></li>';
    }).join("") : '<li class="muted">' + P.esc(P.t("pt.noUses")) + '</li>';
  }

  /* ---------- 3. My business ---------- */
  var ICON = { cup: "M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z M17 11h2a2 2 0 0 1 0 4h-2 M8 3v3 M12 3v3", plate: "M5 3v8a2 2 0 0 0 4 0V3 M7 11v10 M17 3c-2.5 2-2.5 7 0 9v9", umbrella: "M3 12a9 9 0 0 1 18 0H3z M12 12v7a2 2 0 0 0 4 0", glass: "M7 3h10l-1 8a4 4 0 0 1-8 0L7 3z M12 15v5 M8 21h8", bag: "M5 8h14l-1 12H6L5 8z M9 8V6a3 3 0 0 1 6 0v2" };
  function renderListing() {
    var p = P.partner(shopId);
    if (!p) { $("shop-listing").innerHTML = ""; return; }
    var c = (window.CATEGORIES || []).filter(function (x) { return x.id === p.cat; })[0] || {};
    var pl = (window.PLACES || []).filter(function (x) { return x.id === p.place; })[0] || {};
    $("shop-listing").innerHTML = '<li class="offer"><div class="offer-band cat-' + p.cat + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ICON[c.icon] || ICON.cup) + '"/></svg></div>' +
      '<div class="offer-body"><span class="offer-meta">' + P.esc(P.tr(c)) + ' · ' + P.esc(P.tr(pl)) + '</span>' +
      '<span class="offer-name">' + P.esc(P.tr(p.name)) + '</span><span class="offer-deal">' + P.esc(P.tr(p.offer)) + '</span>' +
      (p.address || p.phone ? '<div class="offer-contact">' + (p.address ? '<span class="oc-item">' + P.esc(P.tr(p.address)) + '</span>' : '') +
        (p.phone ? '<span class="oc-item oc-phone">' + P.esc(p.phone) + '</span>' : '') + '</div>' : '') +
      '</div></li>';
  }

  function fillKinds() {
    var v = $("req-kind").value;
    $("req-kind").innerHTML = ["offer", "hours", "contact", "other"].map(function (k) {
      return '<option value="' + k + '">' + P.esc(P.t("pt.kind." + k)) + '</option>';
    }).join("");
    if (v) $("req-kind").value = v;
  }

  $("req-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("req-msg").value.trim(), err = $("req-error"), btn = $("req-btn");
    err.hidden = true;
    if (!msg) { err.textContent = P.t("pt.changeEmpty"); err.hidden = false; return; }
    btn.disabled = true;
    LP.request($("req-kind").value, msg).then(function (r) {
      if (!r || !r.ok) throw new Error("rejected");
      $("req-form").hidden = true; $("req-ok").hidden = false;
    }).catch(function (x) {
      if (x.status === 401) return handleAuthError(x);
      err.textContent = P.t("partner.netError"); err.hidden = false;
    }).then(function () { btn.disabled = false; });
  });

  /* Printable materials (drawn on the phone, A5 PDF) */
  function makePdf(jpegBytes, imgW, imgH, title) {
    var enc = new TextEncoder(), parts = [], offsets = [], size = 0;
    function add(x) { var b = typeof x === "string" ? enc.encode(x) : x; parts.push(b); size += b.length; }
    function obj(i, body) { offsets[i] = size; add(i + " 0 obj\n"); body(); add("\nendobj\n"); }
    var pw = 420, ph = 595, dw = pw, dh = ph;
    var content = "q " + dw + " 0 0 " + dh + " 0 0 cm /Im1 Do Q";
    add("%PDF-1.4\n");
    obj(1, function () { add("<< /Type /Catalog /Pages 2 0 R >>"); });
    obj(2, function () { add("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"); });
    obj(3, function () { add("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pw + " " + ph + "] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>"); });
    obj(4, function () {
      add("<< /Type /XObject /Subtype /Image /Width " + imgW + " /Height " + imgH + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpegBytes.length + " >>\nstream\n");
      add(jpegBytes); add("\nendstream");
    });
    obj(5, function () { add("<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream"); });
    obj(6, function () { add("<< /Title (" + title + ") /Producer (Lesvos Pass) >>"); });
    var xref = size;
    add("xref\n0 7\n0000000000 65535 f \n");
    for (var i = 1; i <= 6; i++) add(String(offsets[i]).padStart(10, "0") + " 00000 n \n");
    add("trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n" + xref + "\n%%EOF");
    return new Blob(parts, { type: "application/pdf" });
  }
  function saveCanvasPdf(cv, name, title) {
    cv.toBlob(function (b) {
      b.arrayBuffer().then(function (buf) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(makePdf(new Uint8Array(buf), cv.width, cv.height, title)); a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      });
    }, "image/jpeg", 0.93);
  }
  var SERIF = '"Literata", Georgia, serif', SANS = '"Commissioner", "Segoe UI", Arial, sans-serif';
  function logo(ctx, x, y, s, wave) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "#e2702a"; ctx.beginPath(); ctx.arc(60, 46, 22, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = wave; ctx.lineWidth = 10; ctx.lineCap = "round";
    ctx.stroke(new Path2D("M12 84q12-10 24 0t24 0t24 0t24 0"));
    ctx.globalAlpha = 0.45; ctx.stroke(new Path2D("M12 104q12-10 24 0t24 0t24 0t24 0")); ctx.restore();
  }
  function centerText(ctx, text, x, y) { ctx.textAlign = "center"; ctx.fillText(text, x, y); }

  function sticker() {
    var W = 1240, H = 1754, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
    var cx = W / 2, cy = 760, r = 470;
    ctx.fillStyle = "#0e2238"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#e2702a"; ctx.lineWidth = 6; ctx.setLineDash([4, 18]); ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(cx, cy, r - 34, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    logo(ctx, cx - 120, cy - 330, 2, "#ffffff");
    ctx.fillStyle = "#ffffff"; ctx.font = "600 112px " + SERIF; centerText(ctx, "Lesvos Pass", cx, cy + 40);
    ctx.fillStyle = "#f6c7a3"; ctx.font = "700 46px " + SANS;
    centerText(ctx, "ΣΥΝΕΡΓΑΖΟΜΕΝΟ ΚΑΤΑΣΤΗΜΑ", cx, cy + 150);
    centerText(ctx, "ANLAŞMALI MAĞAZA", cx, cy + 220);
    centerText(ctx, "PARTNER", cx, cy + 290);
    ctx.fillStyle = "#0e2238"; ctx.font = "600 54px " + SANS;
    centerText(ctx, "Kartınızı burada gösterin · Show your card here", cx, 1400);
    ctx.fillStyle = "#4a5d71"; ctx.font = "500 40px " + SANS;
    centerText(ctx, "Δείξτε την κάρτα σας εδώ", cx, 1470);
    ctx.fillStyle = "#a24812"; ctx.font = "600 38px " + SANS;
    centerText(ctx, location.host + location.pathname.replace(/[^/]*$/, "").replace(/\/$/, ""), cx, 1620);
    saveCanvasPdf(cv, "Lesvos-Pass-sticker.pdf", "Lesvos Pass partner sticker");
  }

  function staffGuide() {
    var W = 1240, H = 1754, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#0e2238"; ctx.fillRect(0, 0, W, 300);
    logo(ctx, 100, 80, 1.2, "#ffffff");
    ctx.textAlign = "left"; ctx.fillStyle = "#ffffff"; ctx.font = "600 64px " + SERIF; ctx.fillText("Lesvos Pass", 270, 160);
    ctx.fillStyle = "#f6c7a3"; ctx.font = "600 40px " + SANS; ctx.fillText(P.t("pt.guideTitle"), 272, 222);
    var steps = I18N[P.lang]["pt.guideSteps"] || I18N.en["pt.guideSteps"];
    var y = 420;
    steps.forEach(function (s, i) {
      ctx.fillStyle = "#e2702a"; ctx.beginPath(); ctx.arc(150, y + 10, 46, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "700 48px " + SANS; centerText(ctx, String(i + 1), 150, y + 27);
      ctx.textAlign = "left"; ctx.fillStyle = "#0e2238"; ctx.font = "700 48px " + SANS; ctx.fillText(s[0], 240, y + 4);
      ctx.fillStyle = "#4a5d71"; ctx.font = "500 36px " + SANS;
      wrap(ctx, s[1], 240, y + 64, 900, 48);
      y += 300;
    });
    function badge(color, label, text, by) {
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(100, by, W - 200, 130, 24) : ctx.rect(100, by, W - 200, 130); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.font = "700 44px " + SANS; ctx.fillText(label, 150, by + 62);
      ctx.font = "500 32px " + SANS; ctx.fillText(text, 150, by + 106);
    }
    badge("#1f7a45", P.t("pt.guideGreen"), P.t("pt.guideGreenText"), 1330);
    badge("#b3261e", P.t("pt.guideRed"), P.t("pt.guideRedText"), 1490);
    saveCanvasPdf(cv, "Lesvos-Pass-staff-guide.pdf", "Lesvos Pass staff guide");
  }
  function wrap(ctx, text, x, y, maxW, lh) {
    var words = text.split(" "), line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; } else line = test;
    });
    if (line) ctx.fillText(line, x, y);
  }
  function whenFonts(fn) { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fn); }

  /* ---------- 4. Help ---------- */
  function renderHelp() {
    var L = I18N[P.lang] || I18N.en;
    $("help-list").innerHTML = (L["pt.help"] || []).map(function (f) {
      return '<details><summary>' + P.esc(f[0]) + '</summary><p>' + P.esc(f[1]) + '</p></details>';
    }).join("");
    var wa = $("support-wa"), mail = $("support-mail");
    wa.hidden = !C.supportWhatsapp; mail.hidden = !C.supportEmail;
    if (C.supportWhatsapp) wa.href = "https://wa.me/" + C.supportWhatsapp;
    if (C.supportEmail) mail.href = "mailto:" + C.supportEmail + "?subject=Lesvos%20Pass%20partner";
  }

  /* ---------- Events ---------- */
  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("login-error"), btn = $("login-btn");
    err.hidden = true; btn.disabled = true;
    LP.login($("email").value.trim(), $("password").value).then(function () {
      $("password").value = ""; tab = "scan"; showView();
    }).catch(function (x) {
      err.textContent = x.status === 400 ? P.t("partner.loginError") : P.t("partner.netError");
      err.hidden = false;
    }).then(function () { btn.disabled = false; });
  });
  $("manual-form").addEventListener("submit", function (e) { e.preventDefault(); check($("card-number").value); });
  $("scan-here").addEventListener("click", startCamera);
  $("scan-stop").addEventListener("click", stopCamera);
  $("logout-btn").addEventListener("click", function () { stopCamera(); shopId = null; stats = null; lastRes = null; LP.logout().then(showView); });
  $("dl-sticker").addEventListener("click", function () { whenFonts(sticker); });
  $("dl-staff").addEventListener("click", function () { whenFonts(staffGuide); });
  document.querySelectorAll(".pt-tabs [data-tab]").forEach(function (b) {
    b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
  });

  P.onLang(function () {
    if (shopId) showShop();
    showResult(); renderStats(); fillKinds(); renderHelp();
  });
  P.setLang(P.lang);
  showView();
})();