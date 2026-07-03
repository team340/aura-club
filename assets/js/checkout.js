/* ============================================================
   AURA CLUB — Checkout (3-step flow: Details → Shipping → Payment)
   Demo checkout: no real payment, no network, no redirect.
   ============================================================ */
(function () {
  "use strict";
  var A = window.AURA;
  var root = document.getElementById("checkout");
  if (!root) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(v) { return A.money(v); }

  /* ---------- Shipping cost ---------- */
  function shipMethodEl() { return document.querySelector('input[name="shipping"]:checked'); }
  function shipCost(sub) {
    var el = shipMethodEl();
    var method = el ? el.value : "Standard";
    if (method === "Express") return 12;
    return sub >= A.FREE_SHIP_THRESHOLD ? 0 : A.SHIP_FLAT; // Standard
  }

  /* ---------- Order summary ---------- */
  function summaryInner() {
    var items = window.Cart.items();
    var sub = window.Cart.subtotal();
    var ship = shipCost(sub);
    var method = (shipMethodEl() || {}).value || "Standard";
    var lines = items.map(function (it) {
      var p = it.product;
      return (
        '<div class="sum-line">' +
          '<img class="sum-line__img" src="' + p.img + '" alt="' + p.name + '">' +
          '<div><div class="sum-line__name">' + p.name + "</div>" +
          '<div class="sum-line__qty">' + p.gem + " · qty " + it.qty + "</div></div>" +
          '<div class="cart-line__price">' + money(it.lineTotal) + "</div>" +
        "</div>"
      );
    }).join("");
    return (
      '<div class="summary__list">' + lines + "</div>" +
      '<div class="sum-row"><span class="muted">Subtotal</span><span>' + money(sub) + "</span></div>" +
      '<div class="sum-row"><span class="muted">Shipping (' + method + ')</span><span>' + (ship === 0 ? "FREE ✦" : money(ship)) + "</span></div>" +
      '<div class="sum-row sum-row--total"><span>Total</span><span>' + money(sub + ship) + "</span></div>"
    );
  }
  function renderSummary() {
    var el = document.getElementById("order-summary");
    if (el) el.innerHTML = '<h2 class="form-section-title">🧾 Order</h2>' + summaryInner();
  }

  /* ---------- Markup ---------- */
  function field(name, label, type, ph, req, full) {
    return (
      '<div class="field' + (full ? " field--full" : "") + '">' +
        '<label for="f-' + name + '">' + label + "</label>" +
        "<input id=\"f-" + name + "\" name=\"" + name + "\" type=\"" + type + "\" placeholder=\"" + ph + "\"" + (req ? " required" : "") + " autocomplete=\"" + name + "\">" +
      "</div>"
    );
  }

  function stepperHTML() {
    return (
      '<ol class="steps-nav" aria-label="Checkout steps">' +
        '<li class="step-dot active" data-dot="1"><span class="step-dot__num">1</span><span class="step-dot__label">Details</span></li>' +
        '<span class="step-line" data-line="1"></span>' +
        '<li class="step-dot" data-dot="2"><span class="step-dot__num">2</span><span class="step-dot__label">Shipping</span></li>' +
        '<span class="step-line" data-line="2"></span>' +
        '<li class="step-dot" data-dot="3"><span class="step-dot__num">3</span><span class="step-dot__label">Payment</span></li>' +
      "</ol>"
    );
  }

  function step1HTML() {
    return (
      '<section class="co-step card-panel" data-step="1">' +
        '<h2 class="form-section-title">📮 Your details</h2>' +
        '<div class="form-grid">' +
          field("email", "Email", "email", "you@email.com", true, true) +
          field("first", "First name", "text", "Ari", true) +
          field("last", "Last name", "text", "Bloom", true) +
          field("address", "Address", "text", "123 Aura St", true, true) +
          field("city", "Suburb / City", "text", "Sydney", true) +
          field("state", "State / Territory", "text", "NSW", true) +
          field("zip", "Postcode", "text", "2000", true) +
          field("country", "Country", "text", "Australia", true) +
          field("phone", "Phone (optional)", "tel", "+61 …", false, true) +
        "</div>" +
        '<button type="button" class="btn btn--ink btn--lg btn--block co-next" data-goto="2" style="margin-top:20px">Continue to shipping →</button>' +
      "</section>"
    );
  }

  function step2HTML() {
    return (
      '<section class="co-step card-panel" data-step="2" hidden>' +
        '<h2 class="form-section-title">🚚 Shipping</h2>' +
        '<div class="pay-methods">' +
          '<label class="pay-option"><input type="radio" name="shipping" value="Standard" checked><span><b>Standard ✦ 3–5 days</b><small>Free over $50, otherwise $5 · tracked</small></span></label>' +
          '<label class="pay-option"><input type="radio" name="shipping" value="Express"><span><b>Express 🚀 1–2 days</b><small>$12 · priority handling</small></span></label>' +
        "</div>" +
        '<p class="muted" style="font-size:.85rem;margin-top:12px">Handmade to order — strung within 1–2 days, then shipped your way ✦</p>' +
        '<div class="co-nav">' +
          '<button type="button" class="btn btn--ghost co-back" data-goto="1">← Back</button>' +
          '<button type="button" class="btn btn--ink btn--block co-next" data-goto="3">Continue to payment →</button>' +
        "</div>" +
      "</section>"
    );
  }

  function step3HTML() {
    return (
      '<section class="co-step card-panel" data-step="3" hidden>' +
        '<h2 class="form-section-title">💳 Payment</h2>' +
        '<div class="pay-methods">' +
          '<label class="pay-option"><input type="radio" name="payment" value="Card" checked><span><b>Credit / Debit card</b><small>Visa · Mastercard · Amex</small></span></label>' +
          '<label class="pay-option"><input type="radio" name="payment" value="PayPal"><span><b>PayPal</b><small>Balance or linked card</small></span></label>' +
          '<label class="pay-option"><input type="radio" name="payment" value="Apple Pay / Google Pay"><span><b>Apple Pay / Google Pay</b><small>Tap to pay</small></span></label>' +
        "</div>" +
        '<p class="muted" style="font-size:.85rem;margin-top:12px">All prices are in AUD and include GST. Demo store — placing an order just shows a confirmation. No card details are entered, nothing is charged, and nothing ships.</p>' +
        '<div class="field field--full" style="margin-top:16px"><label for="f-notes">Order notes (optional)</label><textarea id="f-notes" name="notes" placeholder="Gift note, delivery tips, good vibes…"></textarea></div>' +
        '<label class="co-check"><input type="checkbox" id="f-news"><span>Email me new drops &amp; good vibes ✦ (optional)</span></label>' +
        '<div class="co-nav">' +
          '<button type="button" class="btn btn--ghost co-back" data-goto="2">← Back</button>' +
          '<button type="submit" class="btn btn--pink btn--block btn--lg">Place order ✦</button>' +
        "</div>" +
      "</section>"
    );
  }

  function emptyHTML() {
    return (
      '<div class="empty-state" style="grid-column:1/-1">' +
        '<span class="empty-state__emoji">🛍️</span>' +
        "<h2>Your bag is empty</h2>" +
        '<p class="muted">Add a little sparkle before you check out.</p>' +
        '<a class="btn btn--pink btn--lg" href="shop.html">Shop the drop</a>' +
      "</div>"
    );
  }

  /* ---------- Render + wire ---------- */
  function render() {
    if (!window.Cart.count()) { root.innerHTML = emptyHTML(); return; }
    root.innerHTML =
      stepperHTML() +
      '<form id="checkout-form" novalidate>' + step1HTML() + step2HTML() + step3HTML() + "</form>" +
      '<aside class="card-panel summary" id="order-summary"><h2 class="form-section-title">🧾 Order</h2>' + summaryInner() + "</aside>";
    wire();
  }

  function wire() {
    var form = document.getElementById("checkout-form");
    if (!form) return;
    var steps = [].slice.call(form.querySelectorAll(".co-step"));
    var dots = [].slice.call(document.querySelectorAll(".step-dot"));
    var lineEls = [].slice.call(document.querySelectorAll(".step-line"));
    var current = 1;

    function stepOf(n) { return steps.filter(function (s) { return parseInt(s.getAttribute("data-step"), 10) === n; })[0]; }

    function goTo(n) {
      current = n;
      steps.forEach(function (s) { s.hidden = parseInt(s.getAttribute("data-step"), 10) !== n; });
      dots.forEach(function (d) {
        var i = parseInt(d.getAttribute("data-dot"), 10);
        d.classList.toggle("active", i === n);
        d.classList.toggle("done", i < n);
      });
      lineEls.forEach(function (l) { l.classList.toggle("done", parseInt(l.getAttribute("data-line"), 10) < n); });
      var active = stepOf(n);
      if (active) {
        var f = active.querySelector('input:not([type="radio"]):not([type="checkbox"]), textarea');
        if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
      }
      var nav = document.querySelector(".steps-nav");
      if (nav) nav.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function validateStep(n) {
      var sec = stepOf(n);
      if (!sec) return true;
      var controls = [].slice.call(sec.querySelectorAll("input, textarea, select"));
      for (var i = 0; i < controls.length; i++) {
        if (!controls[i].checkValidity()) { controls[i].reportValidity(); return false; }
      }
      return true;
    }

    form.querySelectorAll(".co-next").forEach(function (b) {
      b.addEventListener("click", function () { if (validateStep(current)) goTo(parseInt(b.getAttribute("data-goto"), 10)); });
    });
    form.querySelectorAll(".co-back").forEach(function (b) {
      b.addEventListener("click", function () { goTo(parseInt(b.getAttribute("data-goto"), 10)); });
    });
    form.querySelectorAll('input[name="shipping"]').forEach(function (r) {
      r.addEventListener("change", renderSummary);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!window.Cart.count()) return;
      for (var n = 1; n <= 3; n++) {
        var sec = stepOf(n);
        var bad = [].slice.call(sec.querySelectorAll("input, textarea, select")).filter(function (c) { return !c.checkValidity(); })[0];
        if (bad) { goTo(n); setTimeout(function () { bad.reportValidity(); }, 120); return; }
      }
      success();
    });
  }

  function success() {
    var name = (((document.getElementById("f-first") || {}).value) || "").trim() || "friend";
    var ref = "AC-" + Date.now().toString(36).toUpperCase();
    var html =
      '<div class="card-panel checkout__success" style="grid-column:1/-1">' +
        '<span class="checkout__success-emoji">🎉</span>' +
        "<h2>Order placed, " + esc(name) + "!</h2>" +
        '<p style="font-weight:600;margin-bottom:4px">Reference <span style="font-family:var(--font-mono)">' + ref + "</span></p>" +
        '<p class="lead">Your handmade bracelets are officially manifesting ✦</p>' +
        '<p class="muted">This is a demo store, so no payment was taken and nothing was shipped.</p>' +
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px">' +
          '<a class="btn btn--pink" href="shop.html">Keep shopping</a>' +
          '<a class="btn btn--ghost" href="index.html">Back home</a>' +
        "</div>" +
      "</div>";
    window.Cart.clear();
    root.innerHTML = html;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render();

  // Keep the summary (and empty state) in sync if the bag changes elsewhere
  window.addEventListener("cart:change", function () {
    if (!window.Cart.count()) { render(); return; }
    if (document.getElementById("order-summary")) renderSummary();
  });
})();
