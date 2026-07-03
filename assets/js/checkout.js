/* ============================================================
   AURA CLUB — Checkout (summary + validation + success)
   Demo checkout: no real payment, no network, no redirect.
   ============================================================ */
(function () {
  "use strict";
  var A = window.AURA;
  var root = document.getElementById("checkout");
  if (!root) return;

  function shipping(sub) { return sub >= A.FREE_SHIP_THRESHOLD || sub === 0 ? 0 : A.SHIP_FLAT; }

  function summaryHTML() {
    var items = window.Cart.items();
    var sub = window.Cart.subtotal();
    var ship = shipping(sub);
    var lines = items.map(function (it) {
      var p = it.product;
      return (
        '<div class="sum-line">' +
          '<img class="sum-line__img" src="' + p.img + '" alt="' + p.name + '">' +
          '<div><div class="sum-line__name">' + p.name + "</div>" +
          '<div class="sum-line__qty">' + p.gem + " · qty " + it.qty + "</div></div>" +
          '<div class="cart-line__price">' + A.money(it.lineTotal) + "</div>" +
        "</div>"
      );
    }).join("");

    return (
      '<div class="summary__list">' + lines + "</div>" +
      '<div class="sum-row"><span class="muted">Subtotal</span><span>' + A.money(sub) + "</span></div>" +
      '<div class="sum-row"><span class="muted">Shipping</span><span>' + (ship === 0 ? "FREE ✦" : A.money(ship)) + "</span></div>" +
      '<div class="sum-row sum-row--total"><span>Total</span><span>' + A.money(sub + ship) + "</span></div>"
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

  function formHTML() {
    return (
      '<form class="card-panel checkout__form" id="checkout-form" novalidate>' +
        '<h2 class="form-section-title">📮 Where\'s it going?</h2>' +
        '<div class="form-grid">' +
          field("email", "Email", "email", "you@email.com", true) +
          field("phone", "Phone (optional)", "tel", "+1 …", false) +
          field("first", "First name", "text", "Ari", true) +
          field("last", "Last name", "text", "Bloom", true) +
          field("address", "Address", "text", "123 Aura Ave", true, true) +
          field("city", "City", "text", "Los Angeles", true) +
          field("zip", "ZIP / Postcode", "text", "90001", true) +
          field("country", "Country", "text", "United States", true, true) +
        "</div>" +
        '<h2 class="form-section-title" style="margin-top:22px">💳 Payment</h2>' +
        '<p class="muted" style="margin-top:-8px;font-size:.88rem">Demo store — please don\'t enter a real card. Nothing is charged or sent anywhere.</p>' +
        '<div class="form-grid">' +
          field("card", "Card number", "text", "4242 4242 4242 4242", true, true) +
          field("exp", "Expiry", "text", "MM / YY", true) +
          field("cvc", "CVC", "text", "123", true) +
        "</div>" +
        '<button class="btn btn--ink btn--lg btn--block" type="submit" style="margin-top:22px">Place order ✦</button>' +
      "</form>"
    );
  }

  function field(name, label, type, ph, req, full) {
    return (
      '<div class="field' + (full ? " field--full" : "") + '">' +
        '<label for="f-' + name + '">' + label + "</label>" +
        "<input id=\"f-" + name + "\" name=\"" + name + "\" type=\"" + type + "\" placeholder=\"" + ph + "\"" + (req ? " required" : "") + " autocomplete=\"" + name + "\">" +
        '<span class="field__error" data-error-for="' + name + '"></span>' +
      "</div>"
    );
  }

  function render() {
    if (!window.Cart.count()) { root.innerHTML = emptyHTML(); return; }
    root.innerHTML =
      formHTML() +
      '<aside class="card-panel summary" id="order-summary"><h2 class="form-section-title">🧾 Order</h2>' + summaryHTML() + "</aside>";
    wireForm();
  }

  function wireForm() {
    var form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var required = form.querySelectorAll("[required]");
      form.querySelectorAll(".field__error").forEach(function (s) { s.textContent = ""; });

      required.forEach(function (inp) {
        var err = form.querySelector('[data-error-for="' + inp.name + '"]');
        var v = inp.value.trim();
        var msg = "";
        if (!v) msg = "Required ✦";
        else if (inp.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Check your email ✦";
        if (msg) { ok = false; if (err) err.textContent = msg; if (ok === false && inp) inp.setAttribute("aria-invalid", "true"); }
        else inp.removeAttribute("aria-invalid");
      });

      if (!ok) {
        var firstErr = form.querySelector('[aria-invalid="true"]');
        if (firstErr) firstErr.focus();
        return;
      }

      success();
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function success() {
    var name = (((document.getElementById("f-first") || {}).value) || "").trim() || "friend";
    var html =
      '<div class="card-panel checkout__success" style="grid-column:1/-1">' +
        '<span class="checkout__success-emoji">🎉</span>' +
        "<h2>Order placed, " + esc(name) + "!</h2>" +
        '<p class="lead">Your handmade bracelets are officially manifesting. A (pretend) confirmation is on its way ✦</p>' +
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

  // Keep summary in sync if the bag changes elsewhere
  window.addEventListener("cart:change", function () {
    var sum = document.getElementById("order-summary");
    if (!window.Cart.count()) { render(); return; }
    if (sum) sum.innerHTML = '<h2 class="form-section-title">🧾 Order</h2>' + summaryHTML();
  });
})();
