# Claude Code Prompt — Bensaid Mek Énergie Website

Build the production-ready website for **Bensaid Mek Énergie**, a Moroccan energy distribution and energy-solutions company. Use the assets in this repository as the visual source of truth, especially `references/homepage-final-reference.png`, `logo/`, and `graphics/`.

## 1. Design direction
The site must feel **Apple-level minimal**: extremely clean, premium, calm, spacious, confident and corporate. Do not create a busy “energy company template.” Avoid visual clutter, excessive cards, icon walls, gradients everywhere, decorative illustrations, counters, badges, or dashboard-like UI.

Use generous whitespace, strong typography, restrained motion, thin dividers, high-quality photography and only a few purposeful brand accents.

### Approved palette
- Charcoal: `#171B1D`
- Soft charcoal: `#2B3033`
- Orange: `#FF9500`
- Deep orange: `#FF6B00`
- Teal: `#0B8F84`
- Light teal: `#19B6A7`
- Off-white: `#FAFAF8`
- Light gray: `#F5F5F3`
- Border gray: `#E7E8E6`

**Do not introduce blue.**

### Typography
Use **Montserrat** for headings and key navigation, and **Source Sans 3** for body/UI text. Keep weights restrained: 600–700 for headings, 400–600 for body/UI.

## 2. Brand assets
Use:
- `logo/bme-logo-header-transparent.png` in the navigation.
- `logo/bme-logo-primary-transparent.png` where the larger corporate lockup is needed.
- `logo/bme-mark-transparent.png` only for small brand accents.
- `graphics/hero-ribbon.svg` as the dominant hero artwork.
- `graphics/cta-wave.svg` only inside the dark CTA banner.
- `graphics/section-accent.svg` as a subtle label accent.
- `graphics/watermark-mark.svg` only where a very subtle watermark is useful.

Do not redraw or replace the logo. Do not add a blue version. Do not distort the emblem.

## 3. Homepage structure

### Header
White / off-white background, sticky but visually light.
Left: Bensaid Mek Énergie logo.
Center/right navigation:
- Accueil
- Nos activités
- À propos
- Contact
Right CTA: `Demander un devis`

The active link should have a very short orange underline. Keep header height compact.

### Hero
Large editorial two-column composition.
Left:
- Eyebrow: `ÉNERGIE & SOLUTIONS DURABLES`
- H1: `Gaz, énergie et solutions durables.`
- Supporting copy: `Distribution de GPL, gaz industriels et solutions énergétiques pour les particuliers, les professionnels et les industries.`
- Primary CTA: `Nos activités`
- Secondary CTA: `Nous contacter`

Right:
Use `graphics/hero-ribbon.svg` at large scale. It should feel like part of the brand, not an illustration placed inside a card. Allow it to bleed partly outside the viewport on desktop. On mobile it should move below the text and crop elegantly.

Do **not** use icons beneath the hero.

### Nos activités
Eyebrow: `NOS ACTIVITÉS`
Heading: `Une offre énergétique complète et intégrée.`

Four minimalist cards, text-first, with no large icons:
1. `GPL`
   `Butane et propane pour les particuliers et les professionnels.`
2. `Gaz industriels`
   `Oxygène, CO₂, azote, argon et autres gaz techniques.`
3. `Solutions solaires`
   `Fourniture et installation de systèmes photovoltaïques et thermiques.`
4. `Services & consulting`
   `Conseil et accompagnement en solutions énergétiques.`

Cards should use a very subtle off-white fill, thin border or soft elevation, rounded corners and a short orange/teal line at the top. No arrow icons unless needed for interaction.

### Notre engagement
Split section:
Left: one large image using `images/gas-storage-reference.png` as the current reference asset.
Right:
- Eyebrow: `NOTRE ENGAGEMENT`
- Heading: `Une énergie fiable, sûre et responsable.`
- Copy: `Nous accompagnons nos clients avec des solutions performantes et durables, de la distribution de gaz à la transition énergétique.`

Do not add three icon features. Keep the section editorial and simple.

### Nos secteurs
Left:
- Eyebrow: `NOS SECTEURS`
- Heading: `Des solutions pour tous les besoins.`
- Inline text list separated by thin rules:
  `Particuliers | Commerces | Hôtellerie & restauration | Industrie | Collectivités`

Right:
Use `images/solar-reference.png` as the current visual reference.

Avoid icon grids.

### About
A compact, optional editorial section before the CTA:
- Eyebrow: `À PROPOS`
- Heading: `Bensaid Mek Énergie`
- Short copy describing the company as a multi-service energy actor serving Morocco through LPG distribution, industrial gases, solar solutions and energy services.
Keep it simple: text + whitespace, no cards.

### CTA
Dark charcoal rounded banner:
- `Un projet ou un besoin énergétique ?`
- `Notre équipe vous accompagne dans la mise en place de la solution adaptée.`
- Button: `Demander un devis`
Use `graphics/cta-wave.svg` very subtly at the far right.

### Footer
Very clean, white background.
Logo on the left.
Two simple columns:
- Liens utiles
- Contact
Include the company address/contact details supplied in the project configuration.
No social-media icons unless actual profiles are supplied.

## 4. Functional requirements
Build with:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Semantic HTML
- Reusable React components
- Mobile-first responsive layout
- Accessible navigation and keyboard states
- `next/image` for raster imagery
- SVG assets used directly where appropriate

Create reusable components:
- `Header`
- `Hero`
- `SectionEyebrow`
- `ActivitiesGrid`
- `EditorialSplit`
- `Sectors`
- `About`
- `CTASection`
- `Footer`

## 5. Motion
Motion must be subtle:
- 200–450ms transitions.
- Small fade/translate reveals on scroll.
- Very slight hero ribbon parallax only on desktop.
- Buttons may shift arrow by a few pixels on hover.
- Respect `prefers-reduced-motion`.

Do not use bouncing, glowing, rotating or continuous decorative animation.

## 6. Responsive behavior
Desktop: large whitespace and editorial two-column layouts.
Tablet: reduce typography and ribbon size.
Mobile:
- single-column content
- compact header with menu
- hero ribbon beneath copy
- activity cards stacked
- editorial images full-width
- CTA stacked vertically

## 7. Content and data
Do not invent telephone numbers, addresses, certifications, partner logos, client counts or statistics. Put business/contact data in one configuration file such as `src/config/company.ts` so it can be updated without editing components.

## 8. SEO / quality
Add:
- French metadata
- Open Graph metadata
- sitemap
- robots.txt
- Organization JSON-LD
- descriptive alt text
- excellent Core Web Vitals
- optimized image formats
- no layout shift
- accessible contrast

## 9. Final quality bar
The result should look closer to a premium Apple / modern architecture / high-end industrial brand than a conventional utility-company website. Every element must justify its presence.

Before finishing:
1. Compare the implementation visually with `references/homepage-final-reference.png`.
2. Remove anything that makes the page feel crowded.
3. Check that no blue has been introduced.
4. Confirm the logo has not been altered.
5. Confirm icons are used only when functionally necessary.
6. Make spacing and typography consistent across desktop, tablet and mobile.

Also include a concise README with local setup, build and deployment instructions.
