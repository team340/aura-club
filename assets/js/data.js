/* ============================================================
   AURA CLUB — Product catalog (single source of truth)
   Every page reads from window.AURA so prices/links never drift.
   ============================================================ */
(function () {
  "use strict";

  var PRODUCTS = [
    {
      id: "aquamarine",
      name: "Aquamarine Dream",
      gem: "Aquamarine",
      price: 38,
      compareAt: null,
      color: "#5FD3D8",
      img: "assets/img/products/aquamarine.png",
      badge: "restock ✦",
      vibe: "float-through-it calm",
      moods: ["calm", "dreamy", "focused"],
      blurb: "Cool-toned clarity for your softest era. Aquamarine is the deep-breath bead — the ocean's chill without leaving your chair.",
      meaningTitle: "Calm & Clarity",
      meaning: "Aquamarine is the stone of steady seas. It's said to quiet the overthinking, unlock honest words, and keep your head clear when the group chat turns to chaos.",
      facts: {
        Beads: "8mm genuine polished aquamarine",
        Fit: "Stretch elastic, ~16–20cm (fits most wrists)",
        Made: "Hand-strung & knotted to order",
        Finish: "Natural stone — every bead is a little different"
      }
    },
    {
      id: "lapis-lazuli",
      name: "Lapis Lore",
      gem: "Lapis Lazuli",
      price: 44,
      compareAt: 52,
      color: "#2E4BD0",
      img: "assets/img/products/lapis-lazuli.png",
      badge: "bestseller ✦",
      vibe: "big brain, deep thoughts",
      moods: ["wise", "bold", "creative"],
      blurb: "Royal blue with gold pyrite flecks — the bracelet version of a 3am thought that actually slaps. For truth-tellers and daydream scholars.",
      meaningTitle: "Wisdom & Truth",
      meaning: "Worn by pharaohs, now worn by you between lectures. Lapis is the wisdom stone — said to sharpen intuition and hand you the confidence to say the real thing.",
      facts: {
        Beads: "8mm genuine lapis lazuli with pyrite",
        Fit: "Stretch elastic, ~16–20cm (fits most wrists)",
        Made: "Hand-strung & knotted to order",
        Finish: "Natural stone — gold flecks vary bead to bead"
      }
    },
    {
      id: "red-jasper",
      name: "Red Jasper Rush",
      gem: "Red Jasper",
      price: 36,
      compareAt: null,
      color: "#D24A3B",
      img: "assets/img/products/red-jasper.png",
      badge: "fan fave ✦",
      vibe: "hot & grounded",
      moods: ["confident", "grounded", "energised"],
      blurb: "Earthy red that reads main-character-but-make-it-stable. Red Jasper is your hype bead for gym days, first dates, and hard launches.",
      meaningTitle: "Strength & Grounding",
      meaning: "The endurance stone. Red Jasper is said to steady your nerves, stoke your fire, and keep you rooted when your ambition tries to leave your body.",
      facts: {
        Beads: "8mm genuine red jasper",
        Fit: "Stretch elastic, ~16–20cm (fits most wrists)",
        Made: "Hand-strung & knotted to order",
        Finish: "Natural stone — warm reds shift in the light"
      }
    },
    {
      id: "turquoise",
      name: "Turquoise Talisman",
      gem: "Turquoise",
      price: 40,
      compareAt: null,
      color: "#16C7B5",
      img: "assets/img/products/turquoise.png",
      badge: "lucky ✦",
      vibe: "lucky-girl energy",
      moods: ["lucky", "protected", "playful"],
      blurb: "The good-luck bead. Turquoise has been a protection charm for centuries — now it's your daily reminder that things are quietly working out for you.",
      meaningTitle: "Protection & Luck",
      meaning: "Ancient travelers wore turquoise to guard the journey and invite fortune. Consider it your wearable green light — delusion optional, but encouraged.",
      facts: {
        Beads: "8mm genuine turquoise (howlite-matrix)",
        Fit: "Stretch elastic, ~16–20cm (fits most wrists)",
        Made: "Hand-strung & knotted to order",
        Finish: "Natural stone — matrix veining is one of a kind"
      }
    }
  ];

  var PERKS = ["✦ Handmade to order", "✦ Free shipping over $50", "✦ 30-day vibe guarantee"];

  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  window.AURA = {
    products: PRODUCTS,
    perks: PERKS,
    get: function (id) { return byId[id] || null; },
    money: function (v) {
      var n = Number(v) || 0;
      return "$" + n.toFixed(2);
    },
    FREE_SHIP_THRESHOLD: 50,
    SHIP_FLAT: 5
  };
})();
