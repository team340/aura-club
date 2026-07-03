# Aura Club ✦

A playful, fully animated **Gen-Z handmade crystal-bracelet store** — built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no dependencies.

## ✨ Features

- **Pure-CSS animations** — floating beads, morphing blobs, holographic gradient text, marquees, jelly buttons, scroll-reveal, twinkling stars (all respect `prefers-reduced-motion`).
- **Working cart** — add / remove / change quantity, slide-out drawer, free-shipping meter, toast notifications, `localStorage` persistence, live totals, and a full checkout flow with validation.
- **Single source of truth** — every product lives in `assets/js/data.js`, so prices, links, and images can never drift out of sync.
- **Shared chrome** — the header, footer, nav, and cart drawer are injected once by `assets/js/layout.js`, so there are **no broken internal links**.
- **Responsive** — mobile-first, tested down to 360px; hamburger nav on small screens.
- **Accessible** — semantic HTML, alt text, focus states, `aria` on the drawer/menu, keyboard-closable cart.

## 📁 Structure

```
Aura Club/
├── index.html          Home (hero, drop, aura picker, story, reviews)
├── shop.html           All products + mood filters
├── product.html        Product detail (reads ?id=)
├── checkout.html       Cart summary + checkout (demo, no real payment)
├── about.html          Brand story
├── contact.html        Contact form
├── faq.html            FAQ accordion
├── shipping.html · returns.html · privacy.html · terms.html   Policies
├── 404.html            Self-contained custom 404
└── assets/
    ├── css/            tokens · base · animations · components · pages
    ├── js/             data · cart · layout · catalog · product · checkout · main
    └── img/products/   The four bracelet photos
```

## 🚀 Run it locally

Any static server works. From this folder:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open the printed URL. (Opening the files directly with `file://` mostly works, but a server is recommended.)

## 🌐 Live deployment

| | |
|---|---|
| **Live URL** | https://team340.github.io/aura-club/ |
| **Repository** | https://github.com/team340/aura-club |
| **GitHub account** | **`team340`** (⚠️ different from the PepCare site, which uses `Sylrix`) |
| **Hosting** | GitHub Pages — `main` branch, root — free, HTTPS enforced |

To push updates, make sure the **team340** account is active first:

```bash
gh auth switch --user team340
git add -A && git commit -m "your change" && git push
```

> See `../SITES.md` for the overview of both sites and their accounts.

## 🛠 Customising

- **Products / prices / copy** → `assets/js/data.js`
- **Colours / fonts / spacing** → `assets/css/tokens.css`
- **Nav & footer links** → `assets/js/layout.js`

---

*Crystal meanings are shared for vibes and intention, not medical claims.*
