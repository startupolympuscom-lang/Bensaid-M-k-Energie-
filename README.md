# Bensaid Mek Énergie — site officiel

Official website of **Bensaid Mek Énergie**, a Moroccan multi-service energy company
(LPG distribution, industrial gases, solar solutions and energy services).

Minimal, premium and spacious by design: the composition follows
`Bensaid_Mek_Energie_Website_Assets/references/homepage-final-reference.png`, with the hero
ribbon as the brand's graphical signature.

- **Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4
- **Pages:** `/` (home) · `/a-propos` · `/contact` (quote request) · custom 404
- **Language:** French (`lang="fr"`, `fr_MA` Open Graph locale)

---

## Local development

Requirements: **Node.js ≥ 20.9** and npm.

```bash
npm install
```

```bash
npm run dev
```

The site runs on <http://localhost:3000>. Without any form-delivery variable configured, quote
requests submitted locally are printed in the terminal.

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. All variables are optional for
local development.

| Variable               | Purpose                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Public base URL (e.g. `https://www.example.ma`). Used for canonical URLs, sitemap, robots, OG. |
| `RESEND_API_KEY`       | Quote form option A — Resend API key (secret).                                                 |
| `QUOTE_TO_EMAIL`       | Quote form option A — recipient(s), comma-separated.                                           |
| `QUOTE_FROM_EMAIL`     | Quote form option A — verified sender address.                                                 |
| `QUOTE_WEBHOOK_URL`    | Quote form option B — endpoint receiving each request as JSON (Make, Zapier, n8n, CRM…).       |

**Site URL resolution:** `NEXT_PUBLIC_SITE_URL` → `website` in `src/config/company.ts` → Vercel
production URL → `http://localhost:3000`.

**Quote form delivery:** Resend is used when `RESEND_API_KEY` and `QUOTE_TO_EMAIL` are set,
otherwise the webhook when `QUOTE_WEBHOOK_URL` is set. In production with neither configured, the
form refuses the request and invites the visitor to call (so no request is silently lost). The
form includes a honeypot field against basic spam bots.

## Build commands

| Command             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Development server with hot reload                     |
| `npm run build`     | Production build (all pages are prerendered as static) |
| `npm run start`     | Serve the production build                             |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TypeScript rules)    |
| `npm run typecheck` | Generate route types and run the TypeScript compiler   |
| `npm run format`    | Format with Prettier (Tailwind classes sorted)         |
| `npm run check`     | Lint + typecheck + format check (use in CI)            |

## Deployment

### Vercel (recommended)

1. Import the GitHub repository in Vercel. `vercel.json` pins the framework to **Next.js**, so the
   project builds correctly even if it was created before the code existed (Vercel would otherwise
   keep the "Other" static preset and serve a 404 on every page).
2. Deploy, then attach the company's domain. **No database or storage is needed** — skip any
   "Connect database" suggestion in the Vercel dashboard. All environment variables are optional;
   add them later under **Project → Settings → Environment Variables** (`NEXT_PUBLIC_SITE_URL`
   and one quote-delivery option) and redeploy.

Preview deployments are automatically excluded from search engines (`robots.txt` disallows all
when `VERCEL_ENV=preview`).

### Any Node.js host

```bash
npm ci
```

```bash
npm run build
```

```bash
npm run start
```

`next start` listens on port 3000 by default (`-p` to change it). Image optimisation and the quote
Server Action require the Node.js server, so a purely static export is not supported.

## Project structure

```
├── Bensaid_Mek_Energie_Website_Assets/  Approved brand asset pack (source of truth, untouched)
├── public/                              Static files served as-is (currently empty)
└── src/
    ├── app/                             Routes (App Router)
    │   ├── layout.tsx                   Root layout: fonts, metadata, header, footer, JSON-LD
    │   ├── page.tsx                     Homepage
    │   ├── a-propos/page.tsx            About page
    │   ├── contact/page.tsx             Contact & quote page
    │   ├── contact/actions.ts           Quote Server Action (validation + delivery)
    │   ├── not-found.tsx                404 page
    │   ├── sitemap.ts · robots.ts       SEO routes
    │   ├── globals.css                  Design tokens (colours, type scale, spacing, motion)
    │   └── icon.png · apple-icon.png · favicon.ico · opengraph-image.png · twitter-image.png
    ├── assets/                          Web-ready raster assets (imported via next/image)
    │   ├── brand/                       Logo lockups and emblem
    │   └── images/                      Editorial photography
    ├── components/
    │   ├── layout/                      Header (incl. mobile menu), Footer, Logo
    │   ├── sections/                    Hero, ActivitiesGrid, EditorialSplit, Sectors, About,
    │   │                                Values, CTASection
    │   ├── graphics/                    HeroRibbon, CtaWave (inline SVG brand graphics)
    │   ├── contact/                     QuoteForm
    │   ├── seo/                         OrganizationJsonLd
    │   └── ui/                          Button, SectionEyebrow, Icons, Reveal, Parallax, RichText
    ├── config/company.ts                ⭐ Official company information (single source of truth)
    ├── content/                         All page copy (French), separate from presentation
    └── lib/                             Helpers: company formatting, site URL, metadata, quote logic
```

## Where company information is configured

**`src/config/company.ts`** — the only place where the company name, address, phone numbers,
email, website, RC, ICE and social profiles are defined. The header, footer, contact page,
metadata and Organization JSON-LD all read from it.

- Empty values (`""`) are treated as _not available_ and are **not rendered** anywhere (no empty
  lines, no placeholder text, nothing in structured data).
- Fields marked **⚠️ À COMPLÉTER** (legal name, street, postal code, email, website, RC, ICE)
  must be confirmed from official records before launch — see
  `Bensaid_Mek_Energie_Website_Assets/docs/DATA_VERIFICATION.md`. Candidate values seen on the
  charter mock-ups are noted in comments for verification; they are intentionally not published.
- Social links are only displayed when a real profile URL is provided.

Page copy (headings, descriptions, sectors, values…) lives in `src/content/`.

## Where visual assets are stored

| Location                              | Contents                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `Bensaid_Mek_Energie_Website_Assets/` | Original approved pack: logos, SVG graphics, photos, references, tokens. |
| `src/assets/brand/`                   | Web derivatives of the logos (see below).                                |
| `src/assets/images/`                  | Web derivatives of the photographs.                                      |
| `src/components/graphics/`            | `HeroRibbon.tsx` and `CtaWave.tsx`: inline copies of `graphics/*.svg`.   |
| `src/app/`                            | Favicon, app icons and the social sharing image.                         |

About the web derivatives (originals are never modified):

- **Logos** — the faint semi-transparent white haze left by background removal was made fully
  transparent and the empty canvas trimmed so the logo aligns with the grid. Logo pixels, colours
  and proportions are unchanged. They are designed to sit on white / off-white backgrounds.
- **Photographs** — cropped ~22 px on each side to remove the white rounded corners baked into the
  source files (rounding is applied in CSS). `next/image` serves AVIF/WebP at the right size with a
  blur placeholder.
- **SVG graphics** — `hero-ribbon.svg` and `cta-wave.svg` are inlined as React components (same
  paths and gradients, namespaced IDs). If a source SVG changes, mirror the change in
  `src/components/graphics/`.

## Design system notes

- **Palette:** charcoal `#171B1D`, soft charcoal `#2B3033`, orange `#FF9500`, deep orange
  `#FF6B00`, teal `#0B8F84`, light teal `#19B6A7`, off-white `#FAFAF8`, light gray `#F5F5F3`,
  border `#E7E8E6`. Tailwind's default palette is disabled in `globals.css`, so no other colour
  (and no blue) can be used by accident. Text greys derive from charcoal and meet WCAG AA.
- **Typography:** Montserrat (headings, navigation, buttons) and Source Sans 3 (body, forms),
  self-hosted at build time by `next/font`.
- **Motion:** subtle 450 ms reveals for below-the-fold content, a very slight desktop parallax on
  the hero ribbon, and arrow nudges on hover. Everything is disabled with
  `prefers-reduced-motion`.
- **Accessibility:** semantic landmarks, skip link, one `h1` per page, labelled form fields with
  inline errors, keyboard-accessible mobile menu (focus trap, Escape, `aria-expanded`), visible
  teal focus rings.
