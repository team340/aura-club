/* ============================================================
   AURA CLUB — Product detail page (reads ?id=)
   ============================================================ */
(function () {
  "use strict";
  var A = window.AURA;
  var root = document.getElementById("pdp");
  if (!root) return;

  function param(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function factsHTML(f) {
    return Object.keys(f).map(function (k) {
      return "<dt>" + k + "</dt><dd>" + f[k] + "</dd>";
    }).join("");
  }

  function priceHTML(p) {
    var s = (p.compareAt && p.compareAt > p.price) ? "<s>" + A.money(p.compareAt) + "</s>" : "";
    return s + A.money(p.price);
  }

  function relatedCard(p) {
    return (
      '<article class="card reveal" style="--accent:' + p.color + '">' +
        '<a class="card__media" href="product.html?id=' + p.id + '" aria-label="' + p.name + '">' +
          '<span class="card__gem">' + p.gem + "</span>" +
          '<img class="card__img" src="' + p.img + '" alt="' + p.name + '" loading="lazy" width="1080" height="1080">' +
        "</a>" +
        '<div class="card__body">' +
          '<h3 class="card__name"><a href="product.html?id=' + p.id + '">' + p.name + "</a></h3>" +
          '<div class="card__row"><span class="card__price">' + A.money(p.price) + "</span>" +
          '<button class="btn btn--sm btn--lime" data-add-to-cart="' + p.id + '" data-open="false">Add ✦</button></div>' +
        "</div>" +
      "</article>"
    );
  }

  var p = A.get(param("id"));

  if (!p) {
    document.title = "Not found ✦ Aura Club";
    root.innerHTML =
      '<div class="empty-state" style="grid-column:1/-1">' +
        '<span class="empty-state__emoji">🔮</span>' +
        "<h2>That bracelet wandered off</h2>" +
        '<p class="muted">The piece you\'re after isn\'t here — but the whole collection is.</p>' +
        '<a class="btn btn--pink" href="shop.html">Back to the shop</a>' +
      "</div>";
    root.style.display = "block";
    var rel0 = document.getElementById("related-wrap");
    if (rel0) rel0.style.display = "none";
    return;
  }

  document.title = p.name + " ✦ Aura Club";
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", p.name + " — " + p.blurb);

  root.style.setProperty("--accent", p.color);
  root.innerHTML =
    '<div class="pdp__media reveal">' +
      '<div class="pdp__stage" style="background:' + p.color + '">' +
        '<img class="pdp__img" src="' + p.img + '" alt="' + p.name + ' handmade ' + p.gem + ' bracelet" width="1080" height="1080">' +
      "</div>" +
      '<div class="pdp__perks">' +
        '<span class="tag">✦ Handmade to order</span>' +
        '<span class="tag">✦ Real ' + p.gem + "</span>" +
        '<span class="tag">✦ Ships in 1–2 days</span>' +
      "</div>" +
    "</div>" +
    '<div class="pdp__info reveal d2">' +
      '<div class="crumbs"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / ' + p.name + "</div>" +
      '<span class="tag pdp__gem">' + p.gem + "</span>" +
      '<h1 class="pdp__title">' + p.name + "</h1>" +
      '<div class="pdp__price">' + priceHTML(p) + "</div>" +
      '<p class="pdp__blurb">' + p.blurb + "</p>" +
      '<div class="pdp__meaning">' +
        "<h4>The vibe ✦ " + p.meaningTitle + "</h4>" +
        "<p class=\"muted\" style=\"margin:0\">" + p.meaning + "</p>" +
      "</div>" +
      '<div class="pdp__buy">' +
        '<div class="qty">' +
          '<button class="qty__btn" data-pdp-dec aria-label="Decrease quantity">–</button>' +
          '<span class="qty__val" id="pdp-qty">1</span>' +
          '<button class="qty__btn" data-pdp-inc aria-label="Increase quantity">+</button>' +
        "</div>" +
        '<button class="btn btn--lg" data-add-to-cart="' + p.id + '" data-qty-source="#pdp-qty" style="flex:1">Add to bag — ' + A.money(p.price) + "</button>" +
      "</div>" +
      '<div class="pdp__facts"><dl>' + factsHTML(p.facts) + "</dl></div>" +
    "</div>";

  // qty stepper
  root.addEventListener("click", function (e) {
    var val = document.getElementById("pdp-qty");
    if (!val) return;
    var n = parseInt(val.textContent, 10) || 1;
    if (e.target.closest("[data-pdp-inc]")) val.textContent = Math.min(20, n + 1);
    else if (e.target.closest("[data-pdp-dec]")) val.textContent = Math.max(1, n - 1);
  });

  // related
  var relGrid = document.getElementById("related");
  if (relGrid) {
    relGrid.innerHTML = A.products.filter(function (x) { return x.id !== p.id; }).map(relatedCard).join("");
  }

  if (window.AuraReveal) window.AuraReveal.refresh();
})();
