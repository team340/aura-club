/* ============================================================
   AURA CLUB — Shared chrome: header, footer, cart drawer, toast
   Injected on every page so links live in ONE place (no dead links).
   ============================================================ */
(function () {
  "use strict";

  var ICON = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
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

    // Newsletter = friendly fake action (no external redirects)
    document.addEventListener("submit", function (e) {
      if (e.target && e.target.id === "news-form") {
        e.preventDefault();
        if (window.Cart) window.Cart.toast("You're on the list", "💌");
        e.target.reset();
      }
    });

    if (window.Cart) window.Cart.init();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
