# Frontend Audit Report: Kaizen Art and Craft

**Generated:** `FRONTEND_AUDIT.md` created after Phase 0 audit  
**Overall Stack:** React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router v6, TanStack React Query, Axios, Supabase JS client, framer-motion, embla-carousel-react, recharts, lucide-react  
**Scoping Rule:** Only `frontend/` modified; backend, prisma, and API contracts untouched.

---

## 1. Page & Route Inventory

| Route Path | Page Component | Layout | Key Contexts | Key Hooks | Key Libs |
|---|---|---|---|---|---|
| `/` | `Index` | `Layout` | Auth, Cart, Wishlist, Theme | `useProducts` | `api`, `supabase` |
| `/shop` | `ShopPage` | `Layout` | Auth, Cart, Wishlist, Theme | `useProducts` (TanStack Query) | `api`, `useSearchParams` |
| `/collections` | `CollectionsPage` | `Layout` | Auth, Cart, Wishlist, Theme | `useProducts` | `api`, `supabase` |
| `/collections/:slug` | `CollectionsPage` | `Layout` | Auth, Cart, Wishlist, Theme | `useProducts` | `api`, `supabase` |
| `/product/:slug` | `ProductDetailPage` | `Layout` | Auth, Cart, Wishlist, Theme | `useProducts` | `api`, `getImageUrl` |
| `/about` | `AboutPage` | `Layout` | Auth, Cart, Wishlist, Theme | — | — |
| `/contact` | `ContactPage` | `Layout` | Auth, Cart, Wishlist, Theme | — | `api` (`/contact`) |
| `/cart` | `CartPage` | `Layout` | CartContext, Auth, Wishlist, Theme | — | `api` (`/orders/checkout`) |
| `/wishlist` | `WishlistPage` | `Layout` | WishlistContext, Auth, Theme | — | `api` (`/wishlist`) |
| `/auth` | `AuthPage` | `Layout` | AuthContext (primary) | — | `api` (signin/signup/OTP) |
| `/profile` | `ProfilePage` | `Layout` | AuthContext, CartContext, WishlistContext, Theme | — | `api` (profile/orders/wishlist) |
| `/admin` | `AdminLayout` → `AdminPage` | `AdminLayout` | AuthContext (isAdmin) | `useAdminStats` | `api` (products/orders/users) |
| `/admin/products` | `ProductsTable` | `AdminLayout` | AuthContext | — | `api` (products CRUD, FormData) |
| `/admin/orders` | `OrdersTable` | `AdminLayout` | AuthContext | — | `api` (orders list) |
| `/admin/users` | `UsersTable` | `AdminLayout` | AuthContext | — | `api` (users list) |
| `*` | `NotFound` | `Layout` | — | — | — |

---

## 2. Context Inventory

| Context File | Purpose | Key State | Key Functions |
|---|---|---|---|
| `src/contexts/AuthContext.tsx` | Auth state (login/signup/OTP/profile) | `user`, `loading`, `isAdmin` | `signIn`, `signUp`, `sendOTP`, `verifyLoginOTP`, `verifySignupOTP`, `logout` |
| `src/contexts/CartContext.tsx` | Cart logic (add/remove/update, localStorage persistence) | `items`, `total`, `itemCount` | `addItem`, `removeItem`, `updateQuantity`, `clearCart` |
| `src/contexts/WishlistContext.tsx` | Wishlist count & sync with backend | `wishlistCount`, `wishlistItems` | `refreshWishlist`, `isInWishlist`, `toggleWishlist` |
| `src/contexts/ThemeContext.tsx` | Light/dark theme toggle | `theme`, `toggleTheme` | — |

---

## 3. Hook Inventory

| Hook File | Purpose |
|---|---|
| `src/hooks/useProducts.ts` | TanStack Query hook: fetches products/collections from Supabase with filters (collection_id, inStock, minPrice/maxPrice, search, sort). Also fetches collections table. |
| `src/hooks/use-mobile.tsx` | Media-query utility for "is-mobile" flag. |
| `src/hooks/use-toast.ts` | Wrapper around `sonner` / shadcn toast API. |
| `src/hooks/useAdminStats.ts` (inside `admin/`) | Pulls admin dashboard stats (orders, users, etc.). |

---

## 4. API / Lib Inventory

### Custom Backend (`/api/v1/*` via Axios)
| Endpoint | Method | Purpose | Files Using |
|---|---|---|---|
| `/user/refresh` | POST | Refresh access token via cookie | `api.ts` |
| `/user/profile` | GET | Fetch current user profile | `AuthContext`, `ProfilePage` |
| `/user/login` | POST | Standard email/password login | `AuthContext` |
| `/user/signup` | POST | Register new user | `AuthContext` |
| `/otp/send` | POST | Trigger OTP for phone verification | `AuthContext` |
| `/otp/verify-login` | POST | Verify login OTP | `AuthContext` |
| `/otp/verify-signup` | POST | Verify signup OTP | `AuthContext` |
| `/user/logout` | POST | Log out (ignores errors) | `AuthContext` |
| `/wishlist` | GET | Retrieve user's wishlist | `WishlistContext`, `WishlistPage`, `ProductDetailPage` |
| `/wishlist` | DELETE | Remove item from wishlist | `WishlistContext`, `ProductDetailPage` |
| `/wishlist` | POST | Add item to wishlist | `WishlistContext`, `ProductDetailPage` |
| `/orders/checkout` | POST | Submit order checkout | `CartPage` |
| `/products` | GET/POST | List or create product (admin) | `ProductsTable`, admin pages |
| `/products/:id` | PUT/DELETE | Update/delete product (admin) | `ProductsTable` |
| `/categories` | GET | Fetch product categories | `ShopPage`, `CollectionsPage` |
| `/contact` | POST | Submit contact form message | `ContactPage` |
| `/products/slug/:slug` | GET | Retrieve product by slug | `ProductDetailPage` |
| `/products/check-availability` | POST | Check pincode serviceability | `ProductDetailPage` |
| `/products/:id/reviews` | POST | Submit product review | `ProductDetailPage` |

### Supabase (Public)
| Table | Query | Purpose |
|---|---|---|
| `products` | `select("*, collections(name, slug)")` with filters: `collection_id`, `inStock`, `minPrice`, `maxPrice`, `search` (by name), sort (`price-asc`, `price-desc`, `latest`, `popular`, default `created_at`) | Public product listing, shop/collection pages |
| `products` | `eq("slug", slug).maybeSingle()` | Single product lookup by slug |
| `collections` | `select("*").order("name")` | Navigation / filter sidebar |

---

## 5. Component Inventory

### Layout Components
- `src/components/layout/Layout.tsx` — Common wrapper (Navbar, Main Content, Footer)
- `src/components/layout/MainNavbar.tsx` — Desktop navbar with logo, search, wishlist/cart icons, account menu, sticky on scroll; desktop mega-dropdowns; mobile hamburger → drawer
- `src/components/layout/TopBar.tsx` — Secondary top bar (not extensively used)
- `src/components/layout/Footer.tsx` — Footer with brand blurb, shop links, help links, social icons, newsletter, payment icons strip, copyright
- `src/components/layout/SkipContent` (not yet exist — gap)

### Home Components
- `src/components/home/HeroBanner.tsx` — Hero banner carousel (static/placeholder; needs carousel redesign)
- `src/components/home/FeaturesSection.tsx` — Feature highlights section
- `src/components/home/CollectionsGrid.tsx` — Category tiles grid
- `src/components/home/NewArrivals.tsx` — New arrivals row

### Product Components
- `src/components/ProductCard.tsx` — Product card with image, price, rating, badges, wishlist heart, add-to-cart

### UI Primitives (shadcn/ui ≈ 45 files)
- `button.tsx`, `input.tsx`, `dialog.tsx`, `drawer.tsx`, `tabs.tsx`, `accordion.tsx`, `badge.tsx`, `skeleton.tsx`, `slider.tsx`, `switch.tsx`, `table.tsx`, `carousel.tsx`, `carousel.tsx`, `tooltip.tsx`, `toaster.tsx`, `alert-dialog.tsx`, `menubar.tsx`, `command.tsx`, `avatar.tsx`, `badge.tsx`, `collapsible.tsx`, `separator.tsx`, `progress.tsx`, `radio-group.tsx`, `pagination.tsx`, `sheet.tsx`, `command.tsx`, `context-menu.tsx`

### Admin Components
- `src/pages/admin/AdminLayout.tsx` — Dashboard layout with sidebar + topbar, collapsible on mobile
- `src/pages/admin/ProductsTable.tsx` — Full CRUD: search, filter, sort, pagination, bulk select, status toggle, delete confirm, multi-image upload with preview, drag reorder, remove
- `src/pages/admin/OrdersTable.tsx` — Orders list with status tracking
- `src/pages/admin/UsersTable.tsx` — Users list

### Form / Utility Components
- `src/components/NavLink.tsx` — Styled nav link with active state
- `src/components/admin/ProductsTable` sub-components (forms, modals, drag handlers)

---

## 6. Visual / UX Problems (Ranked by Severity)

### `/` (Home)
- **Ugly: 8** — Inline hex colors `#FF6E31`, `#111111`, `#EEEEEE`, `#F8F8F8`, `#555555`, `#999999`, `#FFF4EE`, `#E55F20` everywhere
- **Inconsistent: 5** — Mixed patterns between FlashSale grid and AboutStrip; different badge styles, price formatting, hover effects
- **Missing State: 3** — No skeleton loading states for FlashSale or AboutStrip; no error states
- **Not Responsive: 2** — `aspectRatio: "16/9"` and `aspectRatio: "4/3"` inline; may not reflow well

### `/about`
- **Ugly: 7** — Inconsistent color usage: `#FF6E31`, `#111111`, `#555555`, `#F8F8F8`, `#EEEEEE`, `#FFF4EE`
- **Inconsistent: 5** — Three different card styling patterns across features/vision/contact strips
- **Missing State: 3** — No skeleton loading states; no error states for image loading

### `/shop`
- **Missing State: 5** — Skeleton loading uses generic `animate-pulse` divs, not true skeleton components; empty state uses `🎨` emoji
- **Inconsistent: 4** — Mixed border colors `#EEEEEE`/`#E8E8E8`/`#EFEFFF`; filter chip vs sort select styles vary
- **Ugly: 3** — Inline colors `#FF6E31`, `#EEEEEE`, `#111111`, `#555555`, `#999999`, `#F5F5F5`
- **Not Responsive: 2** — Mobile drawer `fixed bottom-0` with `max-h-[92dvh]`; may overflow on smaller screens

### `/product/:slug`
- **Inconsistent: 7** — Multiple design patterns for price display, rating stars, badge styles, CTA buttons; varying shadow patterns
- **Missing State: 5** — Loading spinner only; no skeleton for image thumbnails or related products section
- **Ugly: 4** — Inline colors `#FF6E31`, `#EEEEEE`, `#111111`, `#999999`, `#2E7D32` (discount green), `#F8F8F8`, `#FFF4EE`
- **Not Responsive: 2** — `aspect-square` main image; related products grid may not reflow

### `/cart`
- **Missing State: 5** — Empty state present but no skeleton during initial load; address form has no loading state
- **Inconsistent: 4** — Step indicator colors `#EEEEEE`/`#FF6E31`; order summary sidebar different border treatment
- **Ugly: 3** — Inline colors `#FF6E31`, `#EEEEEE`, `#111111`, `#555555`, `#F5F5F5`, `#F8F8F8`
- **Not Responsive: 2** — Address form `lg:hidden` summary; sticky sidebar behavior

### `/wishlist`
- **Missing State: 4** — Skeleton pulses during loading (generic `bg-[#F5F5F5]` divs); empty state decent but could be more themed
- **Inconsistent: 3** — Remove button uses `bg-white hover:bg-red-50 text-red-500` (theme conflict: red vs site orange)
- **Ugly: 3** — Inline colors `#FF6E31`, `#E8E8E8`, `#212121`, `#666666`, `#FFF4EE`
- **Not Responsive: 1** — Grid adjusts 2→3→4 columns; may have breakpoint issues

### `/collections`
- **Missing State: 5** — Loading skeletons use generic `animate-pulse` divs with `bg-[#F5F5F5]`; empty states use `🎨` emoji
- **Inconsistent: 4** — Collection grid `aspect-[4/3]` fixed ratio; product grid `grid-cols-2 md:grid-cols-4`
- **Ugly: 3** — Inline colors `#E8E8E8`, `#212121`, `#666666`, `#FF6E31`, `#F5F5F5`
- **Not Responsive: 2** — Collection grid `grid-cols-1 md:grid-cols-3`; product grid `grid-cols-2 md:grid-cols-4`

### `/contact`
- **Inconsistent: 6** — Form input `inputClass` variable mixed with inline styles; CTA card `bg-[#111111]` vs form `bg-white`
- **Missing State: 4** — Form has button loading state but no skeleton during initial load or error state display
- **Ugly: 3** — Inline colors `#FF6E31`, `#EEEEEE`, `#111111`, `#555555`, `#999999`, `#FFF4EE`
- **Not Responsive: 1** — `md:grid-cols-[340px_1f]` adapts well

### `/auth`
- **Inconsistent: 8** — Left panel gradient (`linear-gradient(145deg, #FF6E31 0%, #E55F20 45%, #111111 100%)`) vs right panel `bg-[#F5F5F5]` — massive color inconsistency
- **Ugly: 7** — Inline colors `#FF6E31`, `#E55F20`, `#111111`, `#555555`, `#999999`, `#FFFFFF` and variants, `#F5F5F5`, `#EEEEEE`, `#FFF4EE`
- **Missing State: 3** — Auth page returns `null` when loading; no skeleton loading UI
- **Not Responsive: 2** — Left panel `hidden lg:flex lg:w-[44%]`; right panel adapts but layout is split

### `/profile`
- **Inconsistent: 7** — Multiple design patterns for stats cards, nav tabs, settings toggles, form fields; varying shadow `shadow-[0_2px_8px_rgba(0,0,0,0.06)]`
- **Missing State: 5** — Data loading states present (skeleton divs) but inconsistent implementation; empty states used but varying icons/styles
- **Ugly: 5** — Inline colors `#FF6E31`, `#EEEEEE`, `#111111`, `#555555`, `#999999`, `#FFF4EE`, `#F5F5F5`, `#F0F0F0`, various `red-500`, `green-500`, `amber-500`
- **Not Responsive: 2** — Sidebar `lg:grid-cols-[280px_1fr]`; main content adapts but may feel cramped

### Admin Routes
- Minor inconsistencies: sidebar `bg-[#212121]` vs content `bg-[#F5F5F5]`; active items `bg-[#FF6E31] text-white`

---

## 7. Summary of Inline Hex Colors (Top 15)

| Color | Usage Count | Typical Use |
|---|---|---|
| `#FF6E31` | ~40+ | Primary accent orange — buttons, badges, icons, hover states |
| `#111111` | ~20+ | Dark text — headings, labels, on light backgrounds |
| `#EEEEEE` | ~20+ | Light borders — inputs, divs, separators |
| `#555555` | ~15+ | Muted text — secondary text, placeholders |
| `#999999` | ~12+ | Secondary muted text — line-through, placeholders, disabled states |
| `#F8F8F8` | ~10+ | Card/background color — price blocks, feature badges |
| `#F5F5F5` | ~10+ | Subtle background — auth right panel, profile stats |
| `#FFF4EE` | ~8+ | Warm white/cream — category tags, auth forms, empty states |
| `#E8E8E8` | ~6+ | Borders/backgrounds — navbar, collections grid |
| `#212121` | ~4+ | Dark backgrounds — admin sidebar |
| `#E55F20` | ~4+ | Darker orange hover — buttons |
| `#2E7D32` | ~2+ | Discount green — price line-through |
| `#666666` | ~4+ | Inactive text — navbar suggestions, footer |
| `#FFF4EE` | ~8+ | Warm white/cream — category tags, auth forms |

---

## 8. Non-Semantic HTML & Accessibility Gaps

- **Emoji as content**: `🎨` used on empty states (Shop, Collections, Wishlist) — decorative only, not descriptive
- **Heart icon** in wishlist empty state — used as primary visual, lacks alt text meaning
- **Low contrast pairs**: `#555555` on `#F5F5F5` (Auth left panel, Profile stats), `#999999` on `#F8F8F8` (Product Detail price/desc), `#666666` on `#F5F5F5` (Navbar suggestions, Footer links)
- **Fixed-height elements**: HeroBanner `minHeight: 460`, FlashSale `aspectRatio: "16/9"`, Collections `aspect-[4/3]`, ProductDetail `aspect-square` — may not adapt well to mobile
- **`lg:`-dependent layouts**: Sidebar disappears on mobile, drawer opens; various `lg:` breakpoint dependencies
- **No reduced-motion fallback**: Hover transitions `duration-300`/`duration-500` without `prefers-reduced-motion` guard

---

## 9. Skeleton Loading States (Present but Inadequate)

| Page | Current State |
|---|---|
| ShopPage | `animate-pulse` on generic `div` with `bg-[#F5F5F5]` |
| CollectionsPage | `animate-pulse` on `div` with `aspect-[4/3] bg-[#F5F5F5]` |
| ProductDetailPage | Spinner only (`border-[3px] border-[#FF6E31]/20 border-t-[#FF6E31] rounded-full animate-spin`) — no skeleton for image area |
| WishlistPage | `animate-pulse` on `div` with `bg-[#F5F5F5]` |
| AuthPage | Returns `null` (no loading UI) |
| ProfilePage | Spinner with `border-[#FF6E31]/30` |

---

## 10. Error States (Present but Inconsistent)

| Page | Current State |
|---|---|
| ProductDetailPage | "Product not found" with Package icon + Back to Shop button |
| ShopPage | "No products found" / "No results for" text + CTA button |
| CollectionsPage | "No collections yet" / "No products in this collection yet" + emoji + CTA |
| CartPage | "Your Cart is Empty" message |
| WishlistPage | "Your wishlist is empty" + Heart icon |
| ContactPage | Toast errors on submit failure |
| AuthPage | Toast errors for OTP failures |
| ProfilePage | Toast errors for failed updates |

---

## 11. Known API Shape Mismatches (Supabase vs `/api/v1/products`)

| Field | Supabase (`public.products`) | Backend (`/api/v1/products`) | Impact |
|---|---|---|---|
| `category` | **Missing** | Present (required, lowercase) | Frontend cannot rely on category from public listing; only available via admin/backend |
| `storageType` | **Missing** | `"Without Storage" \| "Ready to Hang" \| "Freestanding" \| "Packaged"` | Not available to shoppers |
| `mrpPrice` | **Missing** | Required number | Discount calculation uses Supabase data only when `mrpPrice` exists; may be undefined |
| `discountPercentage` | **Missing** | Required number (default 0) | Frontend must compute from `mrpPrice - price`; may show 0 even when on sale |
| `checkAvailability` | **Missing** | Boolean (default true) | Pincode checker unavailable from public listing |
| `serviceablePinCodes` | **Missing** | `string[]` (default []) | Pincode validation cannot be pre-fetched |
| `materialType` | **Missing** | Required string | Specifications panel cannot show material |
| `finishType` | **Missing** | Required string | Specifications panel cannot show finish |
| `dimensions` | **Missing** | `{ length, width, height }` (all cm) | Specifications panel cannot display |
| `netWeight` | **Missing** | Required number | Specifications panel cannot display |
| `warrantyMonths` | **Missing** | Required number | Feature badges may show `—` |
| `averageRating` | **Missing** | Number (default 0) | Rating display may show 0 |
| `numReviews` | **Missing** | Number (default 0) | Review count may show 0 |
| `reviews` | **Missing** | `Review[]` array | Reviews tab cannot display from public data |
| `best_seller` / `featured` | Nullable boolean | Non-nullable boolean | Feature/BestSeller badge logic may need adjustment |

**Note:** The frontend currently uses Supabase for public product listing (optimal performance) and the custom `/api/v1/products` for admin CRUD. The product shape difference means some UI elements (discount badges, specs, warranty) will need fallback logic when using Supabase data.

---

## 12. Files Created
- `FRONTEND_AUDIT.md` — this file

---

**Next Step:** Print Phase 0 report and wait for "continue" before starting Phase 1.