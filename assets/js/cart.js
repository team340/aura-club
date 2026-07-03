/* ============================================================
   AURA CLUB — Cart engine (localStorage + drawer + toast)
   ============================================================ */
(function () {
  "use strict";

  var KEY = "aura_cart_v1";
  var A = window.AURA;

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      // keep only lines whose product still exists
      return arr.filter(function (l) { return l && A.get(l.id); })
                .map(function (l) { return { id: l.id, qty: Math.max(1, parseInt(l.qty, 10) || 1) }; });
    } catch (e) { return []; }
  }
  var persistWarned = false;
  function write(lines) {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch (e) {
      if (!persistWarned && window.Cart) { persistWarned = true; window.Cart.toast("Couldn't save your bag on this device", "⚠️"); }
    }
    window.dispatchEvent(new CustomEvent("cart:change"));
  }

  var Cart = {
    lines: read(),

    items: function () {
      return this.lines.map(function (l) {
        var p = A.get(l.id);
        return { id: l.id, qty: l.qty, product: p, lineTotal: p.price * l.qty };
      });
    },
    count: function () {
      return this.lines.reduce(function (n, l) { return n + l.qty; }, 0);
    },
    subtotal: function () {
      return this.items().reduce(function (s, it) { return s + it.lineTotal; }, 0);
    },
    add: function (id, qty) {
      if (!A.get(id)) return;
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var found = null;
      this.lines.forEach(function (l) { if (l.id === id) found = l; });
      if (found) found.qty = Math.min(99, found.qty + qty); else this.lines.push({ id: id, qty: Math.min(99, qty) });
      write(this.lines);
      this.render();
      this.bumpCount();
      var p = A.get(id);
      this.toast("Added to bag", p.gem === "Turquoise" ? "🍀" : "✨");
    },
    setQty: function (id, qty) {
      qty = parseInt(qty, 10) || 0;
      if (qty <= 0) return this.remove(id);
      qty = Math.min(99, qty);
      this.lines.forEach(function (l) { if (l.id === id) l.qty = qty; });
      write(this.lines);
      this.render();
    },
    remove: function (id) {
      this.lines = this.lines.filter(function (l) { return l.id !== id; });
      write(this.lines);
      this.render();
    },
    clear: function () {
      this.lines = [];
      write(this.lines);
      this.render();
    },

    /* ---------- UI ---------- */
    open: function () {
      var d = document.getElementById("cart-drawer");
      if (!d) return;
      this._lastFocus = document.activeElement;
      d.classList.add("open");
      document.body.style.overflow = "hidden";
      var closeBtn = d.querySelector("[data-cart-close]");
      if (closeBtn) closeBtn.focus();
    },
    close: function () {
      var d = document.getElementById("cart-drawer");
      if (!d) return;
      d.classList.remove("open");
      document.body.style.overflow = "";
      if (this._lastFocus && this._lastFocus.focus) this._lastFocus.focus();
    },
    bumpCount: function () {
      var el = document.querySelector(".cart-btn__count");
      if (!el) return;
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
    },
    updateCount: function () {
      var n = this.count();
      document.querySelectorAll(".cart-btn__count").forEach(function (el) {
        el.textContent = n;
        el.style.display = n > 0 ? "" : "none";
      });
      document.querySelectorAll(".cart-btn").forEach(function (b) {
        b.setAttribute("aria-label", n > 0 ? ("Open your bag, " + n + " item" + (n === 1 ? "" : "s")) : "Open your bag");
      });
    },
    toast: function (msg, emoji) {
      var wrap = document.querySelector(".toast-wrap");
      if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; wrap.setAttribute("role", "status"); wrap.setAttribute("aria-live", "polite"); document.body.appendChild(wrap); }
      var t = document.createElement("div");
      t.className = "toast";
      t.innerHTML = '<span class="toast__emoji">' + (emoji || "✨") + "</span> " + msg;
      wrap.appendChild(t);
      requestAnimationFrame(function () { t.classList.add("show"); });
      setTimeout(function () {
        t.classList.remove("show");
        setTimeout(function () { t.remove(); }, 320);
      }, 2200);
    },

    render: function () {
      this.updateCount();
      var body = document.getElementById("cart-body");
      var foot = document.getElementById("cart-foot");
      if (!body || !foot) return;

      var items = this.items();
      if (!items.length) {
        body.innerHTML =
          '<div class="drawer__empty">' +
            '<span class="drawer__empty-emoji">🫧</span>' +
            '<h3>Your bag is feeling light</h3>' +
            '<p class="muted">Zero beads, infinite potential. Let\'s fix that.</p>' +
            '<a class="btn btn--pink" href="shop.html">Shop the drop</a>' +
          "</div>";
        foot.innerHTML = "";
        foot.style.display = "none";
        return;
      }
      foot.style.display = "";

      body.innerHTML = items.map(function (it) {
        var p = it.product;
        return (
          '<div class="cart-line" data-line="' + p.id + '">' +
            '<img class="cart-line__img" src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
            '<div class="cart-line__info">' +
              '<div class="cart-line__name">' + p.name + "</div>" +
              '<div class="cart-line__gem">' + p.gem + "</div>" +
              '<div class="qty" style="margin-top:8px">' +
                '<button class="qty__btn" data-dec="' + p.id + '" aria-label="Decrease quantity">–</button>' +
                '<span class="qty__val">' + it.qty + "</span>" +
                '<button class="qty__btn" data-inc="' + p.id + '" aria-label="Increase quantity">+</button>' +
              "</div>" +
            "</div>" +
            '<div class="cart-line__right">' +
              '<div class="cart-line__price">' + A.money(it.lineTotal) + "</div>" +
              '<button class="cart-line__remove" data-remove="' + p.id + '">remove</button>' +
            "</div>" +
          "</div>"
        );
      }).join("");

      var sub = this.subtotal();
      var threshold = A.FREE_SHIP_THRESHOLD;
      var pct = Math.min(100, Math.round((sub / threshold) * 100));
      var shipNote = sub >= threshold
        ? '<div class="drawer__note">🎉 You unlocked <strong>free shipping</strong>!</div>'
        : '<div class="drawer__note">You\'re <strong>' + A.money(threshold - sub) + '</strong> away from free shipping ✦</div>';
      var meter =
        '<div style="height:10px;border:2px solid var(--ink);border-radius:99px;background:var(--white);overflow:hidden;margin-bottom:10px">' +
          '<div style="height:100%;width:' + pct + '%;background:var(--aura);background-size:200% 200%;transition:width .4s cubic-bezier(.22,1,.36,1)"></div>' +
        "</div>";

      foot.innerHTML =
        meter + shipNote +
        '<div class="drawer__row"><span class="muted">Subtotal</span><span class="drawer__subtotal">' + A.money(sub) + "</span></div>" +
        '<a class="btn btn--ink btn--block btn--lg" href="checkout.html" style="margin-top:10px">Checkout →</a>' +
        '<button class="btn btn--ghost btn--block" data-cart-close style="margin-top:8px">Keep shopping</button>';
    },

    /* ---------- wiring ---------- */
    init: function () {
      var self = this;

      // Delegated clicks for the whole document
      document.addEventListener("click", function (e) {
        var t = e.target.closest("[data-add-to-cart],[data-open-cart],[data-cart-close],[data-inc],[data-dec],[data-remove]");
        if (!t) return;

        if (t.hasAttribute("data-add-to-cart")) {
          e.preventDefault();
          var sel = t.getAttribute("data-qty-source");
          var qEl = sel ? document.querySelector(sel) : null;
          var qty = qEl ? parseInt(qEl.textContent, 10) : parseInt(t.getAttribute("data-qty"), 10) || 1;
          self.add(t.getAttribute("data-add-to-cart"), qty);
          if (t.getAttribute("data-open") !== "false") self.open();
        } else if (t.hasAttribute("data-open-cart")) {
          e.preventDefault(); self.open();
        } else if (t.hasAttribute("data-cart-close")) {
          e.preventDefault(); self.close();
        } else if (t.hasAttribute("data-inc")) {
          var idI = t.getAttribute("data-inc");
          self.setQty(idI, self._q(idI) + 1);
        } else if (t.hasAttribute("data-dec")) {
          var idD = t.getAttribute("data-dec");
          self.setQty(idD, self._q(idD) - 1);
        } else if (t.hasAttribute("data-remove")) {
          self.remove(t.getAttribute("data-remove"));
        }
      });

      // Close on overlay click / Esc
      document.addEventListener("click", function (e) {
        if (e.target.classList && e.target.classList.contains("drawer__overlay")) self.close();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") self.close();
      });

      // Focus trap inside the open drawer
      document.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;
        var d = document.getElementById("cart-drawer");
        if (!d || !d.classList.contains("open")) return;
        var panel = d.querySelector(".drawer__panel");
        var f = [].slice.call(panel.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'))
                  .filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });

      // Re-render when storage changes in another tab
      window.addEventListener("storage", function (e) {
        if (e.key === KEY) { self.lines = read(); self.render(); }
      });

      this.render();
    },
    _q: function (id) {
      var found = 0;
      this.lines.forEach(function (l) { if (l.id === id) found = l.qty; });
      return found;
    }
  };

  window.Cart = Cart;
})();
