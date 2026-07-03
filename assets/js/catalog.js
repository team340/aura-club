/* ============================================================
   AURA CLUB — Product grids + shop filtering
   ============================================================ */
(function () {
  "use strict";
  var A = window.AURA;

  function priceHTML(p) {
    var now = '<span>' + A.money(p.price) + "</span>";
    if (p.compareAt && p.compareAt > p.price) {
      return "<s>" + A.money(p.compareAt) + "</s>" + now;
    }
    return now;
  }

  function card(p, i) {
    var d = (i % 5) + 1;
    return (
      '<article class="card reveal d' + d + '" style="--accent:' + p.color + '">' +
        '<a class="card__media" href="product.html?id=' + p.id + '" aria-label="' + p.name + '">' +
          '<span class="card__gem">' + p.gem + "</span>" +
          '<img class="card__img" src="' + p.img + '" alt="' + p.name + ' handmade ' + p.gem + ' bracelet" loading="lazy" width="1080" height="1080">' +
        "</a>" +
        '<button class="card__fave" data-fave aria-label="Save ' + p.name + '">♡</button>' +
        '<div class="card__body">' +
          '<h3 class="card__name"><a href="product.html?id=' + p.id + '">' + p.name + "</a></h3>" +
          '<p class="card__vibe">' + p.vibe + "</p>" +
          '<div class="card__row">' +
            '<span class="card__price">' + priceHTML(p) + "</span>" +
            '<button class="btn btn--sm btn--lime" data-add-to-cart="' + p.id + '" data-open="false">Add ✦</button>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderGrid(grid) {
    var limit = parseInt(grid.getAttribute("data-limit"), 10) || 0;
    var filter = grid.getAttribute("data-filter") || "all";
    var list = A.products.filter(function (p) {
      return filter === "all" || p.moods.indexOf(filter) !== -1;
    });
    if (limit > 0) list = list.slice(0, limit);
    grid.innerHTML = list.length
      ? list.map(card).join("")
      : '<div class="empty-state" style="grid-column:1/-1"><span class="empty-state__emoji">🔮</span><h3>No matches for that mood</h3><p class="muted">Try another vibe ✦</p></div>';
    if (window.AuraReveal) window.AuraReveal.refresh();
  }

  function init() {
    document.querySelectorAll("[data-product-grid]").forEach(renderGrid);

    // Shop filter bar
    var bar = document.querySelector("[data-filter-bar]");
    if (bar) {
      var grid = document.querySelector('[data-product-grid][data-shop]');
      bar.addEventListener("click", function (e) {
        var b = e.target.closest("[data-filter]");
        if (!b || !grid) return;
        bar.querySelectorAll("[data-filter]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        grid.setAttribute("data-filter", b.getAttribute("data-filter"));
        renderGrid(grid);
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
