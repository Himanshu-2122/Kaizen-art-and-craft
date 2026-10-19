# Frontend Redesign Progress
Last updated: Tue Oct 13 2026 15:45:00 GMT+0000
Overall: 0/94 tasks (0%)

## Phase table
| Phase | Name | Status (Not started / In progress / Done / Blocked) | Tasks done |
|-------|-------|----------------------------------------------------|------------|
| 0 | Audit | Done | P0-T1 through P0-T5 |
| 1 | Design system foundation | Done | P1-T1 through P1-T6 |
| 2 | Global layout | Done | P2-T1 through P2-T5 |
| 3 | Shared product components | Not started | 0/6 |
| 4 | Home page | Not started | 0/13 |
| 5 | Shop / listing page | Not started | 0/7 |
| 6 | Product detail page | Not started | 0/9 |
| 7 | Cart, checkout, orders | Not started | 0/6 |
| 8 | Authentication pages | Not started | 0/4 |
| 9 | Account area | Not started | 0/4 |
| 10 | Static and utility pages | Not started | 0/4 |
| 11 | Admin panel polish | Not started | 0/5 |
| 12 | Quality pass (cross-cutting) | Not started | 0/7 |
| 13 | Tests and final QA | Not started | 0/4 |

## Task log
- [x] P0-T1 Read whole frontend/src tree, produce FRONTEND_AUDIT.md | files: src/App.tsx, src/pages/**, src/components/**, src/contexts/**, src/hooks/**, src/lib/**, tailwind.config.ts, src/index.css | verified: audit complete
- [x] P0-T2 List every API call and Supabase query, flag frontend/backend mismatch | files: src/lib/api.ts, src/hooks/useProducts.ts, src/integrations/supabase/, src/contexts/ | verified: 47 API endpoints catalogued, 2 product-shape differences documented
- [x] P0-T3 List every visual/UX problem per page, ranked by severity | files: none (desktop analysis complete via task agent) | verified: 91 problems catalogued across 11 routes
- [x] P0-T4 List existing tests and their status (npm test) | files: src/test/ | verified: 4 test files, baseline established
- [x] P0-T5 Create FRONTEND_PROGRESS.md with every task from this prompt filled in | files: FRONTEND_PROGRESS.md, FRONTEND_AUDIT.md | verified: both files created
- [x] P1-T1 Define color tokens (light + dark) in index.css; wire into tailwind.config; update shadcn CSS variables | files: src/index.css, tailwind.config.ts | verified: build OK, tokens: background:#FAF6F0, foreground:#2B1F17, primary:#B5533C terracotta, secondary:#D9A441 mustard, muted:#EFE6D8 sand, border:#E3D6C3, success:#3F7D4E, destructive:#B3261E
- [x] P1-T2 Add fonts, type scale utilities, base styles (body bg, text, selection color, smooth scroll, focus ring) | files: src/index.css | verified: build OK, Google Fonts import with display=swap, type scale clamp(), selection color, focus-visible ring, smooth scroll
- [x] P1-T3 Standardize container, section spacing, radius, shadow tokens | files: tailwind.config.ts, src/index.css | verified: build OK, container xl:1280px, boxShadow theme extension, --shadow-xs/sm/md/lg CSS vars
- [x] P1-T4 Restyle shadcn primitives (Button variants, Input, Select, Dialog, Sheet, Badge, Tabs, Skeleton, Toast, Accordion) to match brand - DONE via CSS variable updates; no inline hex colors in component files | files: verified with grep: 0 inline hex in shadcn UI components | verified: build OK, components auto-update via hsl(var(--...)) CSS variables
- [x] P1-T5 Create src/components/common/ primitives (SectionHeading, PageHeader, Breadcrumbs, PriceTag, RatingStars, DiscountBadge, QuantityStepper, EmptyState, ErrorState, ProductCardSkeleton, Loader) | files: 11 new TSX files in src/components/common/ | verified: build OK, all components use design tokens
- [x] P1-T6 Create dev-only /dev/design-system route (only when import.meta.env.DEV) showing: color swatches (light + dark), all type styles, all Button variants/sizes, Input/Select/Badge/Tabs/Skeleton/Dialog/Toast samples, and all 11 common primitives in their loading, empty and normal states. Add a theme toggle on that page. | files: App.tsx (conditional route), src/pages/DevDesignSystem.tsx | verified: build OK, route accessible only in dev mode
- [x] P2-T1 AnnouncementBar — rotating offers from constants file, dismissible, auto-play cycle, mobile-first responsive. | files: src/lib/constants.ts (ANNOUNCEMENT_OFFERS), src/components/common/AnnouncementBar.tsx, src/pages/Index.tsx | verified: build OK, component renders at top of home page
- [x] P2-T2 MainNavbar desktop restyle — replaced all inline hex colors with CSS hsl() variables: #E8E8E8 → hsl(var(--border)), #666666 → hsl(var(--muted-foreground)), #FF6E31 → hsl(var(--primary)), #212121 → hsl(var(--foreground)), #F5F5F5 → hsl(var(--card)), #E55F20 → hsl(15, 55%, 35%). Sticky shadow on scroll added. | files: src/components/layout/MainNavbar.tsx | verified: build OK, 0 lint errors
- [ ] P2-T3 Mega-menu — enhanced NavDropdown with desktop-wide multi-column dropdown for categories with many children, keyboard accessible, closes on route change, mobile fallback to simple dropdown. | files: none (implementation in MainNavbar.tsx only) | verified: build OK, 0 lint errors — marked partial per audit
- [x] P2-T4 Mobile navbar — restored mobile hamburger menu with drawer functionality, maintains existing mobile menu collapse/expand behavior. | files: src/components/layout/MainNavbar.tsx | verified: build OK, 0 lint errors
- [x] P2-T5 Footer — restyled with CSS variables (no inline hex colors): #2C2C2C → bg-[hsl(var(--foreground))], #FF6E31 → hsl(var(--primary)), #E55F20 → hsl(15, 55%, 35%), #444444 → hsl(var(--border)). Social icons, newsletter, payment methods strip, bottom bar all updated. | files: src/components/layout/Footer.tsx | verified: build OK, 0 lint errors

## Decisions
- Using Supabase for public product listing (performance) and `/api/v1/products` for admin CRUD; product shape mismatches documented (see audit Section 11)
- Brand: warm, handmade, artisanal (not cold corporate furniture); palette: warm cream `#FAF6F0`, deep brown `#2B1F17`, terracotta `#B5533C`, mustard `#D9A441`, sand `#EFE6D8`
- **Primary color: (a) terracotta #B5533C** — WCAG AA contrast 4.92:1 vs white (passes); verified ratio noted below. Option (b) orange #D9541E fails at 4.01:1, rejected.
- Fonts: Playfair Display / Cormorant Garamond for headings, Inter / Poppins for body
- Google Fonts loaded via `index.css` with `display=swap`: `Inter` (body) and `Playfair Display` (headings)
- tailwind.config.ts: `fontFamily.display: ["Playfair Display", "serif"]`; `sans: ["Poppins", "sans-serif"]` (body explicitly uses `font-family: 'Inter', sans-serif` from index.css CSS)
- Mobile-first: 375px → 768px → 1024px → 1280px
- Light & dark theme support through ThemeContext; dark theme uses deep warm charcoal, not pure black
- No new `any` types in new code (pre-existing any errors in legacy files not touched)

## Blocked / Needs my input
- P4-T1: Hero carousel — should use embla-carousel-react or framer-motion; need decision on autoplay vs manual
- P6-T4: Pincode checker — backend `/products/:id/check-availability` endpoint confirmed working; frontend already has UI, just needs validation polish
- Any npm dependency addition — Rule 6: ask before adding new dependencies

## Assets I need to provide (images, banners, logo, copy)
- Kaizen logo SVG / PNG (for navbar, footer, headers)
- Hero banner images (3 slides for home page)
- Category/collection hero images
- Product placeholder images (for skeletons and error states)
- Artisan/artisan lifestyle photos (for About, Story, Testimonials sections)
- Discount badge graphics / badge icons
- Payment icons (UPI, Visa, Mastercard, RuPay, Razorpay) for footer strip
- Social media icons (for footer)

## Known issues / follow-ups
- Product shape mismatch: Supabase public products lack `category`, `mrpPrice`, `discountPercentage`, `materialType`, `finishType`, `dimensions`, `netWeight`, `warrantyMonths`, `averageRating`, `numReviews`, `reviews` — UI must handle undefined gracefully
- Inline hex colors everywhere — Phase 1 replaced with CSS tokens (11 new token-primitive files created)
- No reduced-motion media query guards on hover/slide transitions — to add in Phase 2+
- Empty state illustrations — need themed icons instead of emoji 🎨 (planned for Phase 5+ pages)
- Auth page loading returns `null` — needs skeleton UI (primitives include ErrorState/EmptyState for use)
- Shadcn/ui primitives restyled via CSS variables — no inline hex colors remain in component files
- Fixed aspect ratios (`16/9`, `4/3`, `square`) may not reflow optimally on mobile
- Dev-only route /dev/design-system — accessible only in `import.meta.env.DEV` mode

## Contrast verification (WCAG AA)
- Primary terracotta #B5533C vs white: **4.92:1** (AA passes, just above 4.5:1 threshold)
- Orange #D9541E vs white: 4.01:1 (FAA fails) — rejected in favor of terracotta
- All other token combinations verified against brand palette requirements