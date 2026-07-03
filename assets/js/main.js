/* ============================================================
   AURA CLUB — Shared interactions
   Scroll reveal · aura mood picker · favourite hearts
   ============================================================ */
(function () {
  "use strict";
  var A = window.AURA;

  /* ---------- Scroll reveal ---------- */
  var observer = null;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); observer.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  }
  function observe() {
    var els = document.querySelectorAll(".reveal:not(.in)");
    if (!observer) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    els.forEach(function (el) { observer.observe(el); });
  }
  window.AuraReveal = { refresh: observe };
  observe();

  /* ---------- Aura mood picker ---------- */
  var picker = document.querySelector("[data-picker]");
  if (picker) {
    var result = document.getElementById("picker-result");
    function match(mood) {
      var p = A.products.filter(function (x) { return x.moods.indexOf(mood) !== -1; })[0];
      return p || A.products[0];
    }
    function paint(mood) {
      var p = match(mood);
      if (!result) return;
      result.innerHTML =
        '<img class="picker__result-img anim-pop" src="' + p.img + '" alt="' + p.name + '">' +
        '<div><div class="eyebrow">Your match</div>' +
        '<div class="picker__result-name">' + p.name + "</div>" +
        '<p class="muted" style="margin:2px 0 12px">' + p.vibe + " · " + A.money(p.price) + "</p>" +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<a class="btn btn--sm btn--pink" href="product.html?id=' + p.id + '">See it</a>' +
          '<button class="btn btn--sm btn--ghost" data-add-to-cart="' + p.id + '">Add ✦</button>' +
        "</div></div>";
    }
    picker.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-mood]");
      if (!chip) return;
      picker.querySelectorAll("[data-mood]").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      paint(chip.getAttribute("data-mood"));
    });
  }

  /* ---------- Favourite hearts ---------- */
  document.addEventListener("click", function (e) {
    var f = e.target.closest("[data-fave]");
    if (!f) return;
    var on = f.classList.toggle("is-fave");
    f.textContent = on ? "♥" : "♡";
    f.style.background = on ? "var(--pink)" : "";
    f.style.color = on ? "#fff" : "";
    if (window.Cart) window.Cart.toast(on ? "Saved to faves" : "Removed from faves", on ? "💖" : "🤍");
  });
})();
