# Architecture — Kaizen Art and Craft

## Overview

**Kaizen Art and Craft** is a full-stack e-commerce web application for selling furniture and home decor. It follows a classic client–server architecture with a **React SPA frontend** and a **Node.js/Express REST API backend**, connected to a **MongoDB** database.

```
┌─────────────────────┐       HTTP / REST        ┌─────────────────────┐       Mongoose       ┌───────────┐
│   React Frontend    │  ◄──────────────────────► │  Express Backend    │ ◄──────────────────► │  MongoDB  │
│   (Vite + TS)       │       /api/v1/*           │  (Node.js + TS)     │                      └───────────┘
└─────────────────────┘                           └─────────────────────┘
        │                                                  │
        │ Vercel (frontend)                                │ Deployed separately
        │                                                  │
        ▼                                                  ▼
   vercel.json (SPA rewrites)                     Environment variables
                                                  (MONGODB_URI, JWT_SECRET, etc.)
```

---

## Tech Stack

| Layer        | Technology                                                                 |
| ------------ | -------------------------------------------------------------------------- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), React Router |
| **Backend**  | Node.js, Express 5, TypeScript, Mongoose (MongoDB ODM)                     |
| **Database** | MongoDB (via Mongoose)                                                     |
| **Auth**     | JWT (access + refresh tokens), bcrypt password hashing                     |
| **Email**    | Resend (for contact form emails)                                           |
| **State**    | React Context (Auth, Cart, Wishlist), TanStack React Query                 |
| **UI**       | shadcn/ui components, Lucide icons, Framer Motion, Recharts (admin)        |
| **Payment**  | Razorpay (scaffolded, not yet implemented)                                 |
| **Deploy**   | Vercel (frontend SPA)                                                      |

---

## Project Structure

```
ferniture_website/
├── backend/                   # Express REST API
│   └── src/
│       ├── controllers/       # Request handlers (auth, product, cart, order, category)
│       ├── db/                # MongoDB connection (Mongoose)
│       ├── middleware/        # Auth (JWT verify) & admin guards
│       ├── models/            # Mongoose schemas (User, Product, Order, Collection, etc.)
│       ├── routes/            # Express route definitions
│       ├── seed/              # Database seeder script
│       ├── type/              # Shared TypeScript types (AuthRequest)
│       ├── utils/             # Helpers (session map, Razorpay placeholder)
│       ├── app.ts             # Express app setup (middleware + routes)
│       ├── server.ts          # Entry point — connects to DB & starts server
│       └── constants.ts       # DB name constant
│
├── frontend/                  # React SPA
│   └── src/
│       ├── components/
│       │   ├── layout/        # Layout shell (TopBar, MainNavbar, Footer)
│       │   └── ui/            # shadcn/ui primitives (button, dialog, card, etc.)
│       ├── contexts/          # React Context providers (Auth, Cart, Wishlist)
│       ├── hooks/             # Custom hooks (useProducts, useMobile, useToast)
│       ├── integrations/      # Supabase client (legacy/alternate data source)
│       ├── lib/               # Axios API client, constants, utilities
│       ├── pages/             # Route-level page components
│       │   └── admin/         # Admin dashboard (stats, orders, products, users tables)
│       ├── styles/            # Global CSS animations
│       ├── App.tsx            # Root component — routing + context providers
│       └── main.tsx           # Entry point — renders <App />
│
├── vercel.json                # Vercel deployment config (SPA rewrites)
└── README.md
```

---

## Backend Architecture

### Entry Point

`server.ts` → loads env vars, connects to MongoDB via `db/index.ts`, starts Express on the configured port.

### API Routes

All API endpoints are versioned under `/api/v1/` (with categories at `/api/categories/`):

| Prefix                | Resource   | Key Endpoints                                         |
| --------------------- | ---------- | ----------------------------------------------------- |
| `/api/v1/products`    | Products   | `GET /`, `GET /:id`, `GET /slug/:slug`, `POST`, `PUT`, `DELETE` |
| `/api/v1/user`        | Auth       | `POST /signup`, `POST /login`, `POST /logout`, `GET /profile`, `PUT /profile` |
| `/api/v1/orders`      | Orders     | `POST /cart`, `POST /checkout`, `GET /my`             |
| `/api/v1/wishlist`    | Wishlist   | `GET /`, `POST /`, `DELETE /:productId`               |
| `/api/v1/contact`     | Contact    | `POST /contact` (sends email via Resend)              |
| `/api/categories`     | Categories | `GET /`, `GET /:id/products`                          |

### Data Models (Mongoose)

```
User
├── fullName, username, email, phone, password
├── role: "admin" | "user"
├── cart: [{ productId, quantity }]        (embedded)
├── wishlist: [ObjectId → Product]
└── addresses: [{ label, street, city, state, zip, country }]

Product
├── name, slug (unique), description
├── price, discountPrice, stock
├── category (string), collectionId → Collection
├── sizes: [String], images: [String]
├── featured, bestSeller, isActive (soft delete)
├── averageRating, numReviews
└── reviews: [{ userId → User, rating, comment }]

Order
├── userId → User
├── status: "pending" | "completed" | "cancelled"
├── total
├── items: [{ productId, name, price, quantity, size }]
└── shippingAddress: { street, city, state, zip, country }

Collection (Category)
├── name, slug (unique)
├── description, imageUrl

Wishlist
├── userId → User
└── productId → Product

ContactMessage
├── name, email, message, read
```

### Authentication Flow

1. **Signup/Login** → server returns a JWT `accessToken` (15 min) + `refreshToken` (7 days, set as httpOnly cookie).
2. **Protected routes** use the `protect` middleware that verifies the `Authorization: Bearer <token>` header.
3. **Admin routes** chain `protect` → `isAdmin` middleware to enforce role-based access.
4. Frontend stores the access token in `localStorage` and attaches it via an Axios request interceptor.

### Middleware

- `auth.middleware.ts` → `protect` (JWT verification), `isAdmin` (role check)
- `admin.middleware.ts` / `admin.ts` → alternate admin guard implementations

---

## Frontend Architecture

### Rendering & Routing

The app is a **single-page application** using `react-router-dom` v6 with a shared `<Layout>` component (TopBar → Navbar → `<Outlet>` → Footer).

**Public Pages:**
| Route               | Component           | Description                    |
| -------------------- | ------------------- | ------------------------------ |
| `/`                  | Index               | Homepage with featured products |
| `/shop`              | ShopPage            | All products with search/filter |
| `/collections`       | CollectionsPage     | Browse by collection            |
| `/collections/:slug` | CollectionsPage     | Filtered by collection slug     |
| `/product/:slug`     | ProductDetailPage   | Single product detail           |
| `/about`             | AboutPage           | About the brand                 |
| `/contact`           | ContactPage         | Contact form (sends email)      |
| `/auth`              | AuthPage            | Login / Signup                  |

**Authenticated Pages:**
| Route       | Component     | Description          |
| ----------- | ------------- | -------------------- |
| `/cart`     | CartPage      | Shopping cart         |
| `/wishlist` | WishlistPage  | Saved items           |
| `/profile`  | ProfilePage   | User profile & orders |

**Admin Pages** (nested under `/admin`):
| Route             | Component     | Description              |
| ----------------- | ------------- | ------------------------ |
| `/admin`          | AdminPage     | Dashboard with stats      |
| `/admin/products` | ProductsTable | Manage products           |
| `/admin/orders`   | OrdersTable   | Manage orders             |
| `/admin/users`    | UsersTable    | Manage users              |

### State Management

| Context              | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `AuthContext`         | User session, login/signup/logout, admin role detection   |
| `CartContext`         | Client-side cart (add, remove, update quantity, totals)   |
| `WishlistContext`     | Wishlist count synced with backend, refresh helper        |

- **TanStack React Query** is set up for server-state caching (used in `useProducts` hook with Supabase as a data source — this appears to be a legacy/alternate integration alongside the main Express API).
- The primary API communication uses an **Axios instance** (`lib/api.ts`) configured with `VITE_API_URL` as the base URL and an interceptor for JWT tokens.

### UI Component Library

The frontend uses **shadcn/ui** — a collection of accessible, composable components built on **Radix UI** primitives, styled with **Tailwind CSS**. Over 40 UI components are available under `components/ui/` (buttons, dialogs, forms, tables, tooltips, etc.).

---

## Data Flow

```
User Action (e.g. "Add to Cart")
        │
        ▼
  React Component
        │
        ├── Updates local state via CartContext (client-side cart)
        │   OR
        ├── Calls api.post("/orders/cart", ...) for server-side cart
        │
        ▼
  Axios Interceptor attaches JWT token
        │
        ▼
  Express Route → protect middleware → Controller
        │
        ▼
  Mongoose Model → MongoDB
        │
        ▼
  JSON Response → React state update → UI re-render
```

---

## Key Design Decisions

1. **Dual cart implementation**: The cart exists both client-side (CartContext with `useState`) and server-side (embedded in User model). The client-side cart provides instant UX; the server-side cart persists across sessions for logged-in users.

2. **Soft delete for products**: Products use an `isActive` flag rather than hard deletes, preserving order history integrity.

3. **Slug-based routing**: Products and collections use URL slugs for SEO-friendly URLs (`/product/nordic-lounge-chair`).

4. **Embedded reviews**: Product reviews are embedded within the Product document rather than in a separate collection, optimizing read performance for product detail pages.

5. **Supabase integration (legacy)**: The `useProducts` hook queries Supabase directly, suggesting an earlier data layer that coexists with the Express/MongoDB backend. The primary data flow now goes through the Express API.

6. **Contact form via Resend**: Contact submissions are emailed directly to the business owner rather than stored in the database.

---

## Environment Variables

### Backend
| Variable              | Purpose                    |
| --------------------- | -------------------------- |
| `MONGODB_URI`         | MongoDB connection string  |
| `JWT_SECRET`          | Access token signing key   |
| `JWT_REFRESH_SECRET`  | Refresh token signing key  |
| `RESEND_API_KEY`      | Resend email service key   |
| `PORT`                | Server port (default 5000) |

### Frontend
| Variable       | Purpose                          |
| -------------- | -------------------------------- |
| `VITE_API_URL` | Backend API base URL             |

---

## Scripts

### Backend
```bash
npm run dev      # Start dev server (ts-node-dev)
npm run build    # Compile TypeScript
npm run start    # Run compiled JS (production)
npm run seed     # Seed database with sample data + admin user
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
npm run test     # Run Vitest tests
```
