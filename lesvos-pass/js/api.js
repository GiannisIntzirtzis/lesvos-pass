/* Lesvos Pass — talking to the database (no external libraries, so it also loads offline). */
(function () {
  "use strict";
  var C = window.LP_CONFIG;
  var SKEY = "lp-partner-session";

  function headers(token) {
    var h = { "apikey": C.supabaseKey, "Content-Type": "application/json" };
    if (token) h["Authorization"] = "Bearer " + token;
    return h;
  }

  function post(path, body, token) {
    return fetch(C.supabaseUrl + path, { method: "POST", headers: headers(token), body: JSON.stringify(body || {}) })
      .then(function (r) {
        return r.json().catch(function () { return null; }).then(function (data) {
          if (!r.ok) {
            var e = new Error((data && (data.error_description || data.msg || data.message)) || ("HTTP " + r.status));
            e.status = r.status;
            throw e;
          }
          return data;
        });
      });
  }

  function load() { try { return JSON.parse(localStorage.getItem(SKEY) || "null"); } catch (e) { return null; } }
  function save(s) { try { if (s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); } catch (e) { /* ignore */ } }
  function fromAuth(d) {
    return {
      access_token: d.access_token,
      refresh_token: d.refresh_token,
      expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
      email: d.user && d.user.email
    };
  }

  var LP = {
    hasSession: function () { return !!load(); },
    email: function () { var s = load(); return s && s.email; },

    login: function (email, password) {
      return post("/auth/v1/token?grant_type=password", { email: email, password: password }).then(function (d) {
        var s = fromAuth(d); save(s); return s;
      });
    },

    logout: function () {
      var s = load();
      save(null);
      return s ? post("/auth/v1/logout", {}, s.access_token).catch(function () {}) : Promise.resolve();
    },

    // A valid access token for the signed-in partner (refreshed automatically).
    token: function () {
      var s = load();
      if (!s) return Promise.resolve(null);
      if (s.expires_at - 60 > Date.now() / 1000) return Promise.resolve(s.access_token);
      return post("/auth/v1/token?grant_type=refresh_token", { refresh_token: s.refresh_token }).then(function (d) {
        var n = fromAuth(d);
        if (!n.email) n.email = s.email;
        save(n);
        return n.access_token;
      }).catch(function (e) {
        if (e.status === 400 || e.status === 401) save(null);
        throw e;
      });
    },

    cardInfo: function (cardToken) {
      return post("/rest/v1/rpc/card_info", { p_token: cardToken });
    },

    scan: function (code, redeem) {
      return LP.token().then(function (t) {
        if (!t) { var e = new Error("not signed in"); e.status = 401; throw e; }
        return post("/rest/v1/rpc/partner_scan", { p_code: code, p_redeem: !!redeem }, t);
      });
    },
    
    // Calls for the signed-in partner
    me: function () { return LP.authRpc("partner_me", {}); },
    stats: function () { return LP.authRpc("partner_stats", {}); },
    request: function (kind, message) { return LP.authRpc("submit_partner_request", { p_kind: kind, p_message: message }); },
    authRpc: function (name, body) {
      return LP.token().then(function (t) {
        if (!t) { var e = new Error("not signed in"); e.status = 401; throw e; }
        return post("/rest/v1/rpc/" + name, body, t);
      });
    },

    submitLead: function (data) {
      return post("/rest/v1/rpc/submit_partner_lead", data);
    },

    // Accepts a full card link, a raw token or a card number, returns what the database expects.
    extractCode: function (text) {
      var s = String(text || "").trim();
      if (s.indexOf("#") > -1) return s.slice(s.lastIndexOf("#") + 1);
      var m = s.match(/[?&]t=([^&]+)/);
      if (m) return decodeURIComponent(m[1]);
      if (s.indexOf("/c/") > -1) return s.slice(s.lastIndexOf("/c/") + 3);
      return s;
    }
  };

  window.LP = LP;
})();
