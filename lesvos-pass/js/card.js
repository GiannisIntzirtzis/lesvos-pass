/* Lesvos Pass — the visitor's card page (card.html#TOKEN). */
(function () {
  "use strict";
  var P = window.LPPage;
  var TKEY = "lp-card-token", IKEY = "lp-card-info";
  var fromLink = location.hash.slice(1);
  var partnerMode = LP.hasSession();   // a partner scanned this code with their phone camera
  var token = fromLink;
  var info = null, offline = false;

  // Remember the visitor's own card on this phone (never on a partner's phone).
  if (!partnerMode) {
    try {
      if (token) localStorage.setItem(TKEY, token);
      else token = localStorage.getItem(TKEY) || "";
      info = JSON.parse(localStorage.getItem(IKEY) || "null");
      if (info && info.token !== token) info = null;
    } catch (e) { /* storage unavailable */ }
  }

  function cardUrl() {
    return location.origin + location.pathname.replace(/[^/]*$/, "") + "card.html#" + token;
  }

  function qrSvg(text) {
    var m = window.makeQR(text), n = m.length, q = 2, d = "";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (m[r][c]) d += "M" + (c + q) + " " + (r + q) + "h1v1h-1z";
    var size = n + q * 2;
    return '<svg class="pass-qr-svg" viewBox="0 0 ' + size + " " + size + '" shape-rendering="crispEdges" role="img" aria-label="QR"><rect width="' + size + '" height="' + size + '" fill="#fff"/><path d="' + d + '" fill="#0e2238"/></svg>';
  }

  function render() {
    var box = document.getElementById("card-view");
    if (!token) {
      box.innerHTML = '<div class="pass pass-empty"><p class="pass-empty-title">' + P.esc(P.t("card.none")) + '</p>' +
        '<p class="muted">' + P.esc(P.t("card.noneHint")) + '</p>' +
        '<a class="btn btn-sun" href="index.html#buy">' + P.esc(P.t("hero.buy")) + '</a></div>';
      return;
    }
    var state = info ? info.state : "loading";
    var badge = { valid: "card.valid", expired: "card.expired", void: "card.void", inactive: "card.inactive", not_found: "card.notfound" }[state];
    var used = (info && info.used) || [];
    var total = (window.PARTNERS || []).length;
    var usedNames = used.map(function (id) { var p = P.partner(id); return p ? P.tr(p.name) : id; });

    box.innerHTML =
      (offline ? '<p class="pass-note">' + P.esc(P.t("card.offline")) + '</p>' : '') +
      '<article class="pass state-' + state + '">' +
        '<div class="pass-top">' +
          '<div class="pass-brand"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="46" r="22" fill="#e2702a"/><path d="M12 84q12-10 24 0t24 0t24 0t24 0" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M12 104q12-10 24 0t24 0t24 0t24 0" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".45"/></svg><span>Lesvos Pass</span></div>' +
          (badge ? '<span class="pass-badge">' + P.esc(P.t(badge)) + '</span>' : '<span class="pass-badge is-loading">' + P.esc(P.t("scan.checking")) + '</span>') +
        '</div>' +
        '<div class="pass-qr">' + qrSvg(cardUrl()) + '</div>' +
        '<p class="pass-show">' + P.esc(P.t("card.show")) + '</p>' +
        '<div class="pass-meta">' +
          '<div><span class="pm-label">' + P.esc(P.t("card.number")) + '</span><span class="pm-value">' + P.esc(info && info.number ? info.number : "—") + '</span></div>' +
          (info && info.expires_at ? '<div><span class="pm-label">' + P.esc(P.t("card.validTo")) + '</span><span class="pm-value">' + P.esc(P.date(info.expires_at)) + '</span></div>' : '') +
        '</div>' +
      '</article>' +
      (info && info.state === "valid" ? '<div class="pass-used">' +
        '<p class="pu-title">' + P.esc(used.length ? P.fmt(P.t("card.used"), { n: used.length, total: total }) : P.t("card.usedNone")) + '</p>' +
        (used.length ? '<ul>' + usedNames.map(function (n) { return '<li>' + P.esc(n) + '</li>'; }).join("") + '</ul>' : '') +
      '</div>' : '') +
      (!partnerMode ? '<div class="pass-actions">' +
        (info && info.number ? '<div class="pass-downloads">' +
          '<button type="button" class="btn btn-sun" id="dl-pdf">' + dlIcon() + P.esc(P.t("card.pdf")) + '</button>' +
          '<button type="button" class="btn btn-line" id="dl-png">' + dlIcon() + P.esc(P.t("card.png")) + '</button>' +
        '</div>' : '') +
        '<a class="text-link" href="index.html#offers">' + P.esc(P.t("card.offers")) + '</a></div>' : '');
    var bp = document.getElementById("dl-pdf"), bi = document.getElementById("dl-png");
    if (bp) bp.addEventListener("click", function () { download("pdf"); });
    if (bi) bi.addEventListener("click", function () { download("png"); });
  }

  function dlIcon() { return '<svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11 M7 10l5 5 5-5 M5 20h14"/></svg>'; }

  /* ---- Download the card as an image (PNG) or a PDF, drawn on the phone (works offline) ---- */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function drawCard() {
    var W = 1080, H = 1620, cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");
    var serif = '"Literata", Georgia, serif', sans = '"Commissioner", "Segoe UI", Arial, sans-serif';

    ctx.fillStyle = "#0e2238"; ctx.fillRect(0, 0, W, H);
    var g = ctx.createRadialGradient(W * 0.8, 0, 0, W * 0.8, 0, 900);
    g.addColorStop(0, "rgba(226,112,42,0.18)"); g.addColorStop(1, "rgba(226,112,42,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // Logo: sun and two waves
    ctx.save(); ctx.translate(90, 86); ctx.scale(0.9, 0.9);
    ctx.fillStyle = "#e2702a"; ctx.beginPath(); ctx.arc(60, 46, 22, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 10; ctx.lineCap = "round";
    ctx.stroke(new Path2D("M12 84q12-10 24 0t24 0t24 0t24 0"));
    ctx.globalAlpha = 0.45; ctx.stroke(new Path2D("M12 104q12-10 24 0t24 0t24 0t24 0"));
    ctx.restore();

    ctx.fillStyle = "#ffffff"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
    ctx.font = "600 64px " + serif; ctx.fillText("Lesvos Pass", 220, 160);
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "500 30px " + sans; ctx.fillText(P.t("footer.tagline"), 222, 204);

    // Status badge
    var badge = P.t({ valid: "card.valid", expired: "card.expired", void: "card.void", inactive: "card.inactive" }[info.state] || "card.valid");
    ctx.font = "700 28px " + sans; var bw = ctx.measureText(badge).width + 48;
    ctx.fillStyle = info.state === "valid" ? "#1f7a45" : "#b3261e"; roundRect(ctx, W - 90 - bw, 112, bw, 56, 28); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.fillText(badge, W - 90 - bw / 2, 150);

    // QR on white
    var qx = 150, qy = 290, qs = 780;
    ctx.fillStyle = "#ffffff"; roundRect(ctx, qx, qy, qs, qs, 36); ctx.fill();
    var m = window.makeQR(cardUrl()), n = m.length, pad = 50, cell = (qs - pad * 2) / n;
    ctx.fillStyle = "#0e2238";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (m[r][c]) {
      ctx.fillRect(Math.floor(qx + pad + c * cell), Math.floor(qy + pad + r * cell), Math.ceil(cell), Math.ceil(cell));
    }

    ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.font = "500 32px " + sans;
    ctx.fillText(P.t("card.show"), W / 2, 1140);

    // Perforation
    ctx.strokeStyle = "rgba(255,255,255,0.28)"; ctx.lineWidth = 3; ctx.setLineDash([14, 12]);
    ctx.beginPath(); ctx.moveTo(90, 1210); ctx.lineTo(W - 90, 1210); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(0, 1210, 34, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W, 1210, 34, 0, Math.PI * 2); ctx.fill();

    // Number and validity
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "500 28px " + sans;
    ctx.fillText(P.t("card.number"), 90, 1290); ctx.fillText(P.t("card.validTo"), 590, 1290);
    ctx.fillStyle = "#ffffff"; ctx.font = "700 46px " + sans;
    ctx.fillText(info.number, 90, 1350); ctx.fillText(P.date(info.expires_at), 590, 1350);

    // Where to see the offers
    var site = location.host + location.pathname.replace(/[^/]*$/, "");
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "500 26px " + sans;
    ctx.fillText(P.t("card.imgOffers"), 90, 1470);
    ctx.fillStyle = "#f6c7a3"; ctx.font = "600 28px " + sans;
    ctx.fillText(site.replace(/\/$/, ""), 90, 1512);
    return cv;
  }

  // A one-page PDF (A5) with the card image, built without external libraries.
  function makePdf(jpegBytes, imgW, imgH, title) {
    var enc = new TextEncoder(), parts = [], offsets = [], size = 0;
    function add(x) { var b = typeof x === "string" ? enc.encode(x) : x; parts.push(b); size += b.length; }
    function obj(i, body) { offsets[i] = size; add(i + " 0 obj\n"); body(); add("\nendobj\n"); }
    var pw = 420, ph = 595, dw = 360, dh = dw * imgH / imgW, dx = (pw - dw) / 2, dy = (ph - dh) / 2;
    var content = "q " + dw.toFixed(2) + " 0 0 " + dh.toFixed(2) + " " + dx.toFixed(2) + " " + dy.toFixed(2) + " cm /Im1 Do Q";
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

  function saveBlob(blob, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }

  function download(kind) {
    if (!info || !info.number) return;
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () {
      var cv = drawCard(), name = "Lesvos-Pass-" + info.number;
      if (kind === "png") {
        cv.toBlob(function (b) { saveBlob(b, name + ".png"); }, "image/png");
      } else {
        cv.toBlob(function (b) {
          b.arrayBuffer().then(function (buf) { saveBlob(makePdf(new Uint8Array(buf), cv.width, cv.height, "Lesvos Pass " + info.number), name + ".pdf"); });
        }, "image/jpeg", 0.92);
      }
    });
  }

  function load() {
    if (!token) { render(); return; }
    render();
    LP.cardInfo(token).then(function (res) {
      info = res; offline = false;
      if (!partnerMode) { try { res.token = token; localStorage.setItem(IKEY, JSON.stringify(res)); } catch (e) { /* ignore */ } }
      render();
    }).catch(function () { offline = true; render(); });
  }

  // Partner mode: check the card for this partner and allow confirming the use.
  function partnerCheck() {
    var el = document.getElementById("partner-check");
    if (!partnerMode || !token) { el.hidden = true; return; }
    el.hidden = false;
    var body = el.querySelector(".pc-body");
    body.innerHTML = '<p class="muted">' + P.esc(P.t("scan.checking")) + '</p>';
    LP.scan(token, false).then(function (res) {
      P.renderScan(body, res, function () {
        LP.scan(token, true).then(function (r2) { P.renderScan(body, r2); load(); })
          .catch(function () { body.innerHTML = '<p class="form-error">' + P.esc(P.t("partner.netError")) + '</p>'; });
      });
    }).catch(function (e) {
      body.innerHTML = '<p class="form-error">' + P.esc(e.status === 401 ? P.t("scan.not_partner") : P.t("partner.netError")) + '</p>';
    });
  }

  P.onLang(function () { render(); if (partnerMode) partnerCheck(); });
  P.setLang(P.lang);
  load();
})();
