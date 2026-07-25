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

**Lead capture** — by default submitted emails are saved to `localStorage`
(so nothing is lost while you set up). To send leads to a real service, edit
the `submitLead()` function in `script.js` and point the `fetch()` at your
email provider or CRM (Mailchimp, ConvertKit, a webhook, etc.). The example is
already stubbed in the comments.

## Deploy

It's static, so it works on any host: GitHub Pages, Netlify, Vercel,
Cloudflare Pages, or any web server. For GitHub Pages, enable Pages on the
repo and point it at the branch root.

## Before launch checklist

- [ ] Replace placeholder testimonials and stats with real ones
- [ ] Wire `submitLead()` to your real email list
- [ ] Fill in `privacy.html` with your actual policy
- [ ] Update contact email and any legal disclaimers
- [ ] Add a real Open Graph share image

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
