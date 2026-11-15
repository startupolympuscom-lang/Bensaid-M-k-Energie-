# Bensaid Mek Énergie — site officiel

Official website of **Bensaid Mek Énergie**, a Moroccan multi-service energy company
(LPG distribution, industrial gases, solar solutions and energy services).

Minimal, premium and spacious by design: the composition follows
`Bensaid_Mek_Energie_Website_Assets/references/homepage-final-reference.png`, with the hero
ribbon as the brand's graphical signature.

- **Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4
- **Pages:** `/` (home) · `/a-propos` · `/contact` (quote request) · `/dispagaz` (Dispagaz® product
  landing page) · `/dispagaz/app` (Dispagaz customer web app — demo) · custom 404
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
├── Bensaid_Mek_Energie_Website_Assets/  Approved Bensaid brand asset pack (source of truth, untouched)
├── Dispagaz *.png · Bensaid Mék 24_7 LPG Dispenser (1).png
│                                        Original Dispagaz assets (source of truth, untouched)
├── public/                              Static files served as-is (currently empty)
└── src/
    ├── app/                             Routes (App Router)
    │   ├── layout.tsx                   Root layout: fonts, metadata, skip link, JSON-LD
    │   ├── (bensaid)/                   Corporate pages (route group: URLs unchanged)
    │   │   ├── layout.tsx               Bensaid header + footer
    │   │   ├── page.tsx                 Homepage
    │   │   ├── a-propos/page.tsx        About page
    │   │   └── contact/page.tsx         Contact & quote page
    │   ├── dispagaz/                    Dispagaz® ecosystem
    │   │   ├── layout.tsx               Satoshi typeface (Fontshare API) for the whole subtree
    │   │   ├── (site)/                  Landing page /dispagaz (dark header + footer, JSON-LD)
    │   │   ├── app/                     Customer web app /dispagaz/app (demo)
    │   │   │   ├── (auth)/              connexion · inscription · bienvenue (onboarding)
    │   │   │   └── (main)/              accueil · commander (+ confirmation) · commandes/[id] ·
    │   │   │                            portefeuille (+ recharger) · points · adresses · profil ·
    │   │   │                            notifications — wrapped in the AppShell
    │   │   └── icon.png · apple-icon.png · opengraph-image.png · twitter-image.png
    │   ├── not-found.tsx                404 page
    │   ├── sitemap.ts · robots.ts       SEO routes
    │   ├── globals.css                  Design tokens (colours, type scale, spacing, motion)
    │   └── icon.png · apple-icon.png · favicon.ico · opengraph-image.png · twitter-image.png
    ├── assets/                          Web-ready raster assets (imported via next/image)
    │   ├── brand/                       Bensaid logo lockups and emblem
    │   ├── images/                      Editorial photography
    │   └── dispagaz/                    Dispagaz logos (+ white variants) and dispenser photo
    ├── components/
    │   ├── layout/                      Header, Footer, Logo, MenuToggle, useMobileMenu (shared)
    │   ├── sections/                    Hero, ActivitiesGrid, EditorialSplit, Sectors, About,
    │   │                                Values, CTASection
    │   ├── dispagaz/                    DispagazHeader/Footer/Logo, DispagazHero, DashboardMockup,
    │   │                                DispagazSwoosh, DispagazSections
    │   ├── graphics/                    HeroRibbon, CtaWave (inline SVG brand graphics)
    │   ├── contact/                     QuoteForm
    │   ├── seo/                         OrganizationJsonLd
    │   └── ui/                          Button, SectionEyebrow, Icons, Reveal, Parallax, RichText,
    │                                    CurrentYear
    │   └── app/                         Web app UI kit: AppShell (Sidebar, MobileNavigation,
    │                                    AppHeader), Button, Field (Input/Select/Toggle…), Overlay
    │                                    (Modal/Drawer), Toast, States, ChoicePanel, BottleImage
    ├── features/                        Web app features (auth, profile, wallet, orders, delivery,
    │                                    distributors, home, notifications)
    ├── services/                        Web app MOCK services (auth, profile, wallet, payment, order,
    │                                    product, distributor, notification, demo) + storage layer
    ├── types/dispagaz.ts                Web app domain types
    ├── data/                            Web app mock data (products, distributors, config, seed)
    ├── config/company.ts                ⭐ Official company information (single source of truth)
    ├── config/dispagaz.ts               Dispagaz links (demo, app login, video)
    ├── content/                         All page copy (French), separate from presentation
    └── lib/                             Helpers: company formatting, site URL, metadata, quote logic
                                         and Server Action; lib/dispagaz: app formatting, labels,
                                         routes and the useDemo store hook
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

### Dispagaz®

`/dispagaz` is the landing page of Dispagaz, the Bensaid Mek Énergie solution for LPG
distributors. It is reached from the **“Visiter Dispagaz”** button in the homepage hero and from
the footer.

- **`src/config/dispagaz.ts`** — `demoHref` (where every “Demander une démo” button leads: the
  quote form with “Dispagaz (démo)” preselected via `/contact?besoin=dispagaz#devis`), `appUrl`
  (the header’s “Se connecter”, pointing to the web app) and a ⚠️ À COMPLÉTER `videoUrl`
  placeholder (replaces “Découvrir les solutions” with “Voir la vidéo”; hidden while empty).
- **`src/content/dispagaz.ts`** — all copy of the page.
- The laptop dashboard in the hero is built in HTML/CSS (`DashboardMockup.tsx`); its figures are
  illustrative and labelled “Données d’exemple” in the interface.
- The **“Application mobile”** card opens the customer web app and states that the native app is
  coming soon to the App Store and Google Play.

## Dispagaz customer web app (demo)

`/dispagaz/app` is the authenticated customer application: account, onboarding, profile and
addresses, Dispagaz wallet, LPG ordering (home delivery or Point Dispagaz pickup), payment,
tracking, distributor pickup with empty-bottle exchange, and notifications. It is reached from
the landing page (“Application mobile” card, “Se connecter”). It is excluded from search engines.

### Demo mode

- **Sign-in:** any valid-looking email and a password of 4+ characters signs in; “Continuer avec
  Google” is simulated (`data/google-demo-account.ts`). First sign-in leads to onboarding.
- **Persistence:** everything is stored in the browser (`localStorage`; the session goes to
  `sessionStorage` when “Se souvenir de moi” is off) and survives reloads. Profile → “Réinitialiser
  les données de démonstration” wipes it.
- **Demo history:** after onboarding, each account receives two past orders and wallet movements
  ending on a 350,00 MAD balance (`data/demo-seed.ts`).
- **Payments:** `services/paymentService.ts` is a mock. Card numbers are only validated
  structurally (any well-formed card works, e.g. `4242 4242 4242 4242`) and never stored or sent —
  only the last 4 digits are kept. No real payment provider is integrated.
- **Simulations:** order tracking has a “Simuler l’étape suivante” control; pickup orders simulate
  terminal payment, the empty-bottle deposit (`emptyBottleReturned = true`) and collection.
- **Catalog & points:** brands in `data/products.ts` are fictional placeholders and prices are
  demonstration values; Points Dispagaz in `data/distributors.ts` are demo locations. The map is a
  stylised demo map.

### Architecture (replacing the mocks)

The UI never touches storage directly: it calls the services in `src/services/` (async, returning
`{ ok, data | error }` like an API) and reads state through `useAccount()` / `useDemoState()`
(`lib/dispagaz/useDemo.ts`, a `useSyncExternalStore` over `services/storage.ts`).

| Concern               | Today (mock)                         | Later                                         |
| --------------------- | ------------------------------------ | --------------------------------------------- |
| `authService`         | Any email/password, simulated Google | Supabase / Auth0 / Firebase / Auth.js OAuth   |
| `profileService`      | Local profile & addresses            | User API (e.g. Supabase/PostgreSQL), SMS OTP  |
| `walletService`       | Local ledger in centimes             | Wallet ledger / payment gateway               |
| `paymentService`      | Simulated card, COD, terminal        | Server-side payment provider                  |
| `orderService`        | Local orders & status simulation     | Orders API, ERP Dispagaz, delivery/driver app |
| `distributorService`  | `data/distributors.ts` + local stock | Maps (Google Maps/Mapbox) + machine APIs      |
| `productService`      | `data/products.ts`                   | Catalog / pricing API                         |
| `notificationService` | In-app list                          | Push notifications / SMS                      |

Amounts are integers in **centimes** (`formatMAD()` renders `350,00 MAD`). Demo settings (delivery
fee, reservation time, top-up limits, latency) live in `data/config.ts`.

### Typeface

The Dispagaz ecosystem uses **Satoshi**. It is distributed under the ITF Free Font License, which
does not allow sharing the font files through a public repository, so it is loaded from the
official Fontshare API (`src/app/dispagaz/layout.tsx`) with `Inter, Arial, sans-serif` as fallback.
To self-host it instead (allowed for your own websites), download it from fontshare.com into a
non-public location and serve it with `next/font/local`.

## Where visual assets are stored

| Location                              | Contents                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `Bensaid_Mek_Energie_Website_Assets/` | Original approved pack: logos, SVG graphics, photos, references, tokens. |
| `src/assets/brand/`                   | Web derivatives of the logos (see below).                                |
| `src/assets/images/`                  | Web derivatives of the photographs.                                      |
| `src/components/graphics/`            | `HeroRibbon.tsx` and `CtaWave.tsx`: inline copies of `graphics/*.svg`.   |
| `src/app/`                            | Favicon, app icons and the social sharing image.                         |
| Repository root `Dispagaz *.png`      | Original Dispagaz logos and the 24/7 dispenser photo.                    |
| `src/assets/dispagaz/`                | Web derivatives of the Dispagaz assets (see below).                      |
| `src/app/dispagaz/`                   | Dispagaz app icons and social sharing image.                             |

About the web derivatives (originals are never modified):

- **Logos** — the faint semi-transparent white haze left by background removal was made fully
  transparent and the empty canvas trimmed so the logo aligns with the grid. Logo pixels, colours
  and proportions are unchanged. They are designed to sit on white / off-white backgrounds.
- **Photographs** — cropped ~22 px on each side to remove the white rounded corners baked into the
  source files (rounding is applied in CSS). `next/image` serves AVIF/WebP at the right size with a
  blur placeholder.
- **Dispagaz logos** — trimmed; `*-white.png` variants for dark backgrounds turn only the charcoal
  lettering/D white (orange flame untouched), matching the reversed logo of the Dispagaz design.
- **SVG graphics** — `hero-ribbon.svg` and `cta-wave.svg` are inlined as React components (same
  paths and gradients, namespaced IDs). If a source SVG changes, mirror the change in
  `src/components/graphics/`.

## Design system notes

- **Palette:** charcoal `#171B1D`, soft charcoal `#2B3033`, orange `#FF9500`, deep orange
  `#FF6B00`, teal `#0B8F84`, light teal `#19B6A7`, off-white `#FAFAF8`, light gray `#F5F5F3`,
  border `#E7E8E6`. Tailwind's default palette is disabled in `globals.css`, so no other colour
  (and no blue) can be used by accident. Text greys derive from charcoal and meet WCAG AA.
- **Dispagaz:** charcoal surfaces (`#101214`–`#171B1D`) with the brand oranges. Orange buttons use
  charcoal text (6:1 contrast; white on this orange would fail WCAG AA), and small orange text on
  light backgrounds uses the darker `--color-orange-text` (`#B54A00`).
- **Dispagaz web app:** approved identity tokens `--color-dz-*` — charcoal `#0D0D0D`, orange
  `#FF7A00` (actions), teal `#006D66` (secondary/positive), white, light gray `#F2F2F2`, surface
  `#F7F7F6`, border `#E4E4E4`. Orange buttons use charcoal text (7.4:1); orange focus rings use
  `#D96500` (3.6:1) and small orange text `#A84A00` (5.8:1) for WCAG AA.
- **Typography:** Montserrat (headings, navigation, buttons) and Source Sans 3 (body, forms),
  self-hosted at build time by `next/font`.
- **Motion:** subtle 450 ms reveals for below-the-fold content, a very slight desktop parallax on
  the hero ribbon, and arrow nudges on hover. Everything is disabled with
  `prefers-reduced-motion`.
- **Accessibility:** semantic landmarks, skip link, one `h1` per page, labelled form fields with
  inline errors, keyboard-accessible mobile menu (focus trap, Escape, `aria-expanded`), visible
  teal focus rings.
