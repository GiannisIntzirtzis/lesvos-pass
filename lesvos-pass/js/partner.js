/* Lesvos Pass — partner area (partner.html): sign in, scan or type a card, confirm the use. */
(function () {
  "use strict";
  var P = window.LPPage;
  var stream = null, scanning = false, lastCode = "";

  function $(id) { return document.getElementById(id); }

  function showView() {
    var signed = LP.hasSession();
    $("login-view").hidden = signed;
    $("scan-view").hidden = !signed;
    if (signed) {
      $("partner-email").textContent = LP.email() || "";
      $("scan-here").hidden = !("BarcodeDetector" in window);
    }
  }

  var lastRes = null, lastScanCode = "", shopId = null;

  // Draw the current result (again) in the chosen language.
  function showResult() {
    var out = $("scan-output");
    if (shopId) showOffer(shopId);
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
      lastRes = res; lastScanCode = code; shopId = res.partner || shopId;
      showResult();
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    }).catch(function (e) {
      if (e.status === 401) { LP.logout(); showView(); return; }
      out.innerHTML = '<p class="form-error">' + P.esc(P.t("partner.netError")) + '</p>';
    });
  }

  function confirmUse() {
    LP.scan(lastScanCode, true).then(function (r2) { lastRes = r2; showResult(); })
      .catch(function () { $("scan-output").innerHTML = '<p class="form-error">' + P.esc(P.t("partner.netError")) + '</p>'; });
  }

  function addNewScan(out) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn btn-line"; b.textContent = P.t("scan.new");
    b.addEventListener("click", function () { lastRes = null; out.innerHTML = ""; $("card-number").value = ""; lastCode = ""; window.scrollTo({ top: 0, behavior: "smooth" }); });
    out.appendChild(b);
  }

  function showOffer(partnerId) {
    var p = P.partner(partnerId);
    if (!p) return;
    $("shop-name").textContent = P.tr(p.name);
    $("shop-offer").textContent = P.tr(p.offer);
    $("shop-box").hidden = false;
  }

  // In-page camera scanning where the browser supports it (e.g. Chrome on Android).
  function startCamera() {
    var video = $("scan-video"), detector;
    try { detector = new window.BarcodeDetector({ formats: ["qr_code"] }); } catch (e) { return cameraError(); }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (s) {
      stream = s; video.srcObject = s; video.hidden = false; $("scan-stop").hidden = false; $("scan-here").hidden = true;
      scanning = true;
      video.play();
      (function loop() {
        if (!scanning) return;
        detector.detect(video).then(function (codes) {
          if (codes.length && codes[0].rawValue !== lastCode) { lastCode = codes[0].rawValue; stopCamera(); check(lastCode); }
          else requestAnimationFrame(loop);
        }).catch(function () { requestAnimationFrame(loop); });
      })();
    }).catch(cameraError);
  }
  function stopCamera() {
    scanning = false;
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    stream = null;
    $("scan-video").hidden = true; $("scan-stop").hidden = true; $("scan-here").hidden = !("BarcodeDetector" in window);
  }
  function cameraError() { $("scan-output").innerHTML = '<p class="form-error">' + P.esc(P.t("partner.cameraError")) + '</p>'; }

  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("login-error"), btn = $("login-btn");
    err.hidden = true; btn.disabled = true;
    LP.login($("email").value.trim(), $("password").value).then(function () {
      $("password").value = ""; showView();
    }).catch(function (x) {
      err.textContent = x.status === 400 ? P.t("partner.loginError") : P.t("partner.netError");
      err.hidden = false;
    }).then(function () { btn.disabled = false; });
  });
  $("manual-form").addEventListener("submit", function (e) { e.preventDefault(); check($("card-number").value); });
  $("scan-here").addEventListener("click", startCamera);
  $("scan-stop").addEventListener("click", stopCamera);
  $("logout-btn").addEventListener("click", function () { stopCamera(); LP.logout().then(showView); });

  P.onLang(showResult);
  P.setLang(P.lang);
  showView();
})();
