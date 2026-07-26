# Win With Dez — Funnel

A fast, conversion-focused landing-page funnel. Pure HTML/CSS/JS — **no build
step, no dependencies**. Open `index.html` in a browser and it works.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Main landing page + opt-in (hero, how-it-works, benefits, testimonials, FAQ, CTA) |
| `thank-you.html` | Post opt-in confirmation page |
| `privacy.html` | Privacy policy (placeholder — replace before launch) |
| `styles.css` | All styling. Brand colors live in the `:root` block at the top |
| `script.js` | Email validation + lead capture + redirect |

## Run locally

Just open the file, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customize

**Brand colors** — edit the CSS variables at the top of `styles.css`:

```css
:root {
  --brand: #6d5efc;    /* primary  */
  --brand-2: #22d3ee;  /* accent   */
  --brand-3: #f0b429;  /* highlight */
}
```

**Copy** — headlines, benefits, testimonials, and FAQ are plain HTML in
`index.html`. Placeholder testimonials and stats are marked in context; swap
them for real ones.

**Lead capture (Kit / ConvertKit)** — the opt-in forms post to **Kit form
`9723242`** at `https://app.kit.com/forms/9723242/subscriptions`, the same form
the live site uses. Kit's automation Rule then adds the subscriber to the
**"Win With Dez — Nurture"** sequence. No backend and no API key are needed —
this is Kit's public form endpoint.

`script.js` submits the form via `fetch` and redirects to `thank-you.html` on
success; if JS is disabled the form still POSTs natively to the same URL and
Kit shows its hosted confirmation page. See `kit-automation-setup.md` (on the
Kit branches) for the full sequence + Rule setup.

## Deploy

It's static, so it works on any host: GitHub Pages, Netlify, Vercel,
Cloudflare Pages, or any web server. For GitHub Pages, enable Pages on the
repo and point it at the branch root.

## Before launch checklist

- [ ] Replace placeholder testimonials and stats with real ones
- [ ] Wire `submitLead()` to your real email list
- [ ] Fill in `privacy.html` with your actual policy
- [ ] Update contact email and any legal disclaimers
- [ ] Point `og:image` at your full absolute URL once the domain is live

## Favicon / app icons

The brand emblem (green rounded square + checkmark) is the site icon, provided
in every format browsers and devices ask for:

| File | Use |
|------|-----|
| `favicon.svg` | Modern browsers (scales infinitely) |
| `favicon.ico` | Legacy fallback (16 + 32px) |
| `favicon-16.png`, `favicon-32.png` | Tab icons |
| `apple-touch-icon.png` | iOS home screen (180px) |
| `icon-192.png`, `icon-512.png` | Android / PWA (via `site.webmanifest`) |

To regenerate them after a color change, re-run
`scripts/make_favicon.py` (pure Python, no dependencies) or just edit
`favicon.svg` directly.

## Social share image (Open Graph)

`og-image.png` (1200×630) is the preview card shown when the funnel link is
posted to Facebook, Instagram, iMessage, X, etc. It's referenced by the
`og:image` / `twitter:image` tags in `index.html`.

To edit it, change `scripts/og-template.html` (plain HTML/CSS) and re-render:

```bash
NODE_PATH="$(npm root -g)" node scripts/make_og.js
```

This screenshots the template with Playwright/Chromium at 2× for crisp text.
**Before launch**, update the `og:image` tag to your full absolute URL
(e.g. `https://yourdomain.com/og-image.png`) — some scrapers ignore relative
paths.
