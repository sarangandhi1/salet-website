# Salet website

The public site for Salet (salet.uk): a buyer-only property concierge for NRIs and overseas buyers of UK property.

Strategy, offer and brand rules live in the Company OS repo at `domains/property/salet/`. Public copy must follow `brand.md` there (plain British English, no em or en dashes, no exclamation marks) and the four compliance guardrails (no deal marketing, no investment selling, no counterparty names, no financial advice claims).

## Stack

Astro 5 + Tailwind CSS 4, fully static output. Fonts self-hosted via Fontsource (Fraunces, Inter). No server dependencies.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the built site
```

## Outstanding wiring (search TODO in src/)

- Cal.com booking link in `src/pages/contact.astro` (`CAL_LINK`)
- Formspree endpoints in `src/pages/contact.astro` and `src/pages/guide.astro`
- Testimonials and track-record case studies as engagements complete

## Deploy

Static host (Cloudflare Pages first choice). Build command `npm run build`, output directory `dist`. DNS instructions: `dns-setup.md` (created at deploy time).
