/* ============================================================
   AURA CLUB — Shared chrome: header, footer, cart drawer, toast
   Injected on every page so links live in ONE place (no dead links).
   ============================================================ */
(function () {
  "use strict";

  var ICON = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    tk: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.3 1.7 3.9 4 4.2v3c-1.5 0-2.8-.4-4-1.1V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1c-.3-.1-.7-.2-1-.2a3 3 0 1 0 3 3V3h3Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a8 8 0 0 0-3 15.4c-.1-1.2-.2-3 .1-4.2l1-4s-.3-.5-.3-1.3c0-1.2.7-2.1 1.6-2.1.7 0 1.1.6 1.1 1.3 0 .8-.5 2-.8 3.1-.2.9.5 1.6 1.4 1.6 1.7 0 2.8-2.1 2.8-4.6 0-1.9-1.3-3.3-3.6-3.3A4.1 4.1 0 0 0 9.4 12c0 .8.3 1.4.6 1.8l-.4 1.5c-.5-.2-1.4-1.4-1.4-3A6 6 0 1 1 12 3Z"/></svg>'
  };

  var NAV = [
    { href: "index.html", label: "Home" },
    { href: "shop.html", label: "Shop" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" }
  ];

  function currentFile() {
    var path = location.pathname.split("/").pop() || "index.html";
    return path === "" ? "index.html" : path;
  }

  function marquee(items, cls) {
    var group = items.map(function (t) { return '<span class="marquee__item">' + t + "</span>"; }).join("");
    return '<div class="marquee ' + (cls || "") + '"><div class="marquee__track" aria-hidden="true">' + group + group + "</div></div>";
  }

  function buildHeader(active) {
    var links = NAV.map(function (n) {
      var is = n.href === active;
      return '<a class="nav__link' + (is ? " nav__link--active" : "") + '" href="' + n.href + '"' + (is ? ' aria-current="page"' : "") + ">" + n.label + "</a>";
    }).join("");

    return (
      '<a class="skip-link sr-only" href="#main">Skip to content</a>' +
      '<div class="announce">' +
        marquee(["Handmade in tiny batches", "Real gemstones only", "Free shipping over $50", "Good-vibes guaranteed"]) +
      "</div>" +
      '<header class="header"><div class="wrap header__inner">' +
        '<a class="brand" href="index.html"><span class="brand__logo" aria-hidden="true"></span> Aura&nbsp;Club</a>' +
        '<nav class="nav" id="site-nav" aria-label="Primary">' + links + "</nav>" +
        '<div class="header__actions">' +
          '<button class="cart-btn" data-open-cart aria-label="Open your bag">' + ICON.bag +
            '<span class="hide-mobile">Bag</span><span class="cart-btn__count" style="display:none">0</span>' +
          "</button>" +
          '<button class="menu-toggle" id="menu-toggle" aria-label="Menu" aria-expanded="false">' + ICON.menu + "</button>" +
        "</div>" +
      "</div></header>"
    );
  }

  function buildFooter() {
    var year = new Date().getFullYear();
    var shopLinks = window.AURA.products.map(function (p) {
      return '<a class="footer__link" href="product.html?id=' + p.id + '">' + p.name + "</a>";
    }).join("");

    return (
      '<footer class="footer">' +
        '<div class="footer__band">' + marquee(["Aura Club", "Wear your aura", "Handmade with love", "Stay shiny"]) + "</div>" +
        '<div class="wrap footer__top">' +
          '<div class="footer__brand">' +
            '<div class="footer__brand-name"><span class="brand__logo" aria-hidden="true"></span> Aura Club</div>' +
            "<p>Handmade crystal bracelets for your softest, boldest, luckiest era. Strung one bead at a time — good vibes included.</p>" +
            '<form class="footer__news" id="news-form" novalidate>' +
              '<input type="email" name="email" placeholder="your@email.com" aria-label="Email for newsletter" required>' +
              '<button class="btn btn--lime btn--sm" type="submit">Join ✦</button>' +
            "</form>" +
            '<div class="footer__social">' +
              '<button class="soc-btn" data-soc aria-label="Instagram">' + ICON.ig + "</button>" +
              '<button class="soc-btn" data-soc aria-label="TikTok">' + ICON.tk + "</button>" +
              '<button class="soc-btn" data-soc aria-label="Pinterest">' + ICON.pin + "</button>" +
            "</div>" +
          "</div>" +
          '<div class="footer__col"><h4>Shop</h4>' +
            '<a class="footer__link" href="shop.html">Shop all</a>' + shopLinks +
          "</div>" +
          '<div class="footer__col"><h4>Help</h4>' +
            '<a class="footer__link" href="faq.html">FAQ</a>' +
            '<a class="footer__link" href="shipping.html">Shipping</a>' +
            '<a class="footer__link" href="returns.html">Returns</a>' +
            '<a class="footer__link" href="contact.html">Contact</a>' +
          "</div>" +
          '<div class="footer__col"><h4>The fine print</h4>' +
            '<a class="footer__link" href="about.html">Our story</a>' +
            '<a class="footer__link" href="privacy.html">Privacy</a>' +
            '<a class="footer__link" href="terms.html">Terms</a>' +
          "</div>" +
        "</div>" +
        '<div class="wrap footer__bottom">' +
          "<span>© " + year + " Aura Club — made by hand, worn with intention.</span>" +
          '<span>✦ Crystals are for vibes, not medical claims ✦</span>' +
        "</div>" +
      "</footer>"
    );
  }

  function buildDrawer() {
    return (
      '<div class="drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Your bag">' +
        '<div class="drawer__overlay"></div>' +
        '<div class="drawer__panel">' +
          '<div class="drawer__head">' +
            '<h2 class="drawer__title">Your bag ✦</h2>' +
            '<button class="drawer__close" data-cart-close aria-label="Close bag">✕</button>' +
          "</div>" +
          '<div class="drawer__body" id="cart-body"></div>' +
          '<div class="drawer__foot" id="cart-foot"></div>' +
        "</div>" +
      "</div>"
    );
  }

  function mount() {
    var active = currentFile();

    var head = document.getElementById("site-header");
    if (head) head.innerHTML = buildHeader(active);
    else { var h = document.createElement("div"); h.innerHTML = buildHeader(active); document.body.insertBefore(h, document.body.firstChild); }

    var foot = document.getElementById("site-footer");
    if (foot) foot.innerHTML = buildFooter();
    else { var f = document.createElement("div"); f.innerHTML = buildFooter(); document.body.appendChild(f); }

    // Drawer + toast holder
    document.body.insertAdjacentHTML("beforeend", buildDrawer());
    if (!document.querySelector(".toast-wrap")) {
      document.body.insertAdjacentHTML("beforeend", '<div class="toast-wrap" role="status" aria-live="polite" aria-atomic="true"></div>');
    }

    // Give <main> a target id for the skip link
    var mainEl = document.querySelector("main");
    if (mainEl && !mainEl.id) mainEl.id = "main";

    // Mobile menu
    var toggle = document.getElementById("menu-toggle");
    var nav = document.getElementById("site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll(".nav__link").forEach(function (a) {
        a.addEventListener("click", function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
      });
    }

    // Newsletter + social = friendly fake actions (no external redirects)
    document.addEventListener("submit", function (e) {
      if (e.target && e.target.id === "news-form") {
        e.preventDefault();
        if (window.Cart) window.Cart.toast("You're on the list", "💌");
        e.target.reset();
      }
    });
    document.addEventListener("click", function (e) {
      var s = e.target.closest("[data-soc]");
      if (s && window.Cart) window.Cart.toast("DMs open soon", "💌");
    });

    if (window.Cart) window.Cart.init();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
