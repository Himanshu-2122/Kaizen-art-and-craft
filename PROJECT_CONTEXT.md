# Kaizen Art and Craft - PROJECT CONTEXT

## Repository Overview

**Full-name:** Kaizen Art and Craft  
**Description:** Full-fledged e-commerce website for art and craft products  
**Entry Points:** 
- Frontend: `frontend/src/main.tsx` → renders React app via Vite
- Backend: `backend/src/server.ts` → Express server with MongoDB

---

## Technology Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken), bcryptjs, OTP verification
- **File Upload:** multer
- **Email:** nodemailer
- **Payments:** razorpay
- **Validation:** express-validator (implied)
- **Rate Limiting:** express-rate-limit
- **Testing:** Jest, Supertest, MongoMemoryServer
- **ORM:** Prisma (used alongside Mongoose)
- **Migration:** Prisma Migrate

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Context (Auth, Cart, Wishlist, Theme) + TanStack React Query
- **Routing:** React Router DOM v6
- **API Client:** Axios (custom instance) + Supabase JavaScript client
- **Charts:** recharts
- **Carousel:** embla-carousel-react
- **Animations:** framer-motion
- **Testing:** Vitest, React Testing Library
- **Icons:** Lucide React

### Hybrid API Approach
- **Custom Backend API** (`/api/v1/*`): Auth, wishlist, admin CRUD, OTP, contact forms
- **Supabase:** Public product listing, collections, filtering

---

## Architecture & Data Flow

### Backend Architecture
```
src/
  app.ts              → Express app, middleware, routes
  server.ts           → Entry point, DB connection, server startup
  routes/             → Route handlers (product, auth, order, etc.)
  models/             → Mongoose schemas (User, Product, Category, etc.)
  db/                 → MongoDB connection with memory fallback
  middleware/         → Custom middleware (error handling, CORS, etc.)
  constants.ts        → DB name constant
  types/              → TypeScript type definitions
  utils/              → Utility functions
  seed/               → Seed data for development
```

### Frontend Architecture
```
src/
  main.tsx           → React DOM root render
  App.tsx            → Root component with all Providers + Routes
  pages/             → Page components (Index, Shop, ProductDetail, etc.)
  components/        → Reusable UI components (ProductCard, NavLink, etc.)
  layouts/           → Layout wrappers (Layout, MainNavbar, AdminLayout)
  ui/                → shadcn/ui primitives (Button, Input, Dialog, etc.)
  contexts/          → Global state (Auth, Cart, Wishlist, Theme)
  hooks/             → Custom hooks (useProducts, useMobile, useToast)
  lib/               → Utilities (api.ts, constants.ts, utils.ts)
  integrations/      → Supabase configuration
```

### Data Flow - Product Listing
1. User visits `/` or `/shop` → `Index` or `ShopPage`
2. `useProducts()` hook fetches from Supabase `products` table
3. Filtering/sorting applied locally via React Query
4. Products displayed via `ProductCard` component

### Data Flow - Authentication
1. User submits login/signup form → Axios POST to `/user/signup` or `/user/login`
2. Backend validates, creates JWT, returns token
3. Frontend stores token in context/localStorage
4. `AuthProvider` manages auth state globally
5. Protected routes use `AdminGuard` to restrict access

### Data Flow - File Upload
1. Admin uploads product images via `ProductsTable` component
2. FormData sent to `/api/v1/products` POST endpoint
3. Multer handles `../uploads/` storage
4. Product document saved to MongoDB with image URLs

---

## Database Schema Overview (MongoDB)

### Key Models

**User** (`models/user.model.ts`)
- `fullName`, `username`, `email`, `phone`, `password`
- `role`: "admin" | "user" (default: "user")
- `avatarUrl`, `wishlist` ([Product ObjectId]), `cart` ([{productId, quantity}])
- `addresses` ([{label, street, city, state, zip, country, isDefault}])
- Timestamps: created/updated

**Product** (`models/product.model.ts`)
- `name`, `slug` (unique), `description`
- `category` (lowercase), `collectionId` (ref to Collection)
- `sizes` ([String], required), `storageType` (enum)
- `price`, `mrpPrice`, `discountPercentage` (default: 0)
- `stock` (default: 0), `checkAvailability`, `serviceablePinCodes` ([String])
- `images` ([String], 1-10 required)
- Flags: `featured`, `bestSeller`, `isActive`
- `materialType`, `finishType`
- `dimensions` ({length, width, height}), `netWeight`, `warrantyMonths`
- `averageRating`, `numReviews`, `reviews` ([{userId, rating, comment}])
- **Methods:** `calculateRatings()`
- **Indexes:** category, collectionId, slug, price, averageRating, discountPercentage, stock, name (text)

**Collection** (referenced by product.model.ts `collectionId`)
- Used for category-based navigation

**Other models:** Category, Order, OTP, Contact, Wishlist

---

## API Routes (Backend)

| Prefix | Routes | Purpose |
|--------|--------|---------|
| `/api/v1/products` | GET, POST | List/create products (admin) |
| `/api/v1/products/:id` | PUT, DELETE | Update/delete product |
| `/api/v1/categories` | GET | Fetch categories |
| `/api/v1/user` | POST | Signup/login/profile |
| `/api/v1/auth` | POST | OTP send/verify |
| `/api/v1/orders` | POST | Create order |
| `/api/v1/wishlist` | GET, POST | Fetch/add wishlist |
| `/api/v1/otp` | POST | OTP verification |
| `/api/v1/contact` | POST | Contact form submission |

CORS: Configurable via `CLIENT_URL` env var, defaults to `http://localhost:5173`  
Rate limiting: 15 minutes window, 100 requests per window

---

## Environment Variables

### Backend (`backend/.env`)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret
- `BCRYPT_SALT` - Bcrypt salt rounds
- `CLIENT_URL` - Frontend URL for CORS
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` - Payment keys
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email config

### Frontend (`frontend/.env`)
- `VITE_API_URL` - Custom backend API base URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

---

## Key Directories

```
root/
  backend/          → Node/Express/TypeScript server
  frontend/         → React/Vite/TypeScript client
  package.json      → Root scripts (dev, backend, frontend)
  prisma/           → Prisma ORM (if used)
  uploads/          → Static file storage (multer)
  .gitignore
  vercel.json       → Deployment config
```

---

## Testing

### Backend
- **Framework:** Jest with ts-jest
- **Setup:** `backend/jest.config.js`
- **Tests:** Located in `backend/src/test/`
- **MongoDB:** Uses mongodb-memory-server for in-memory testing
- **Run:** `npm run test` (from backend)

### Frontend
- **Framework:** Vitest + React Testing Library
- **Setup:** `frontend/vitest.config.ts`, `frontend/src/test/setup.ts`
- **Tests:** Located in `frontend/src/test/` and `__tests__` directories
- **Run:** `npm test` (from frontend) or `npm run test` / `npm run test:watch`

---

## Development Scripts

**Root (`package.json`):**
- `backend` - Runs backend dev server
- `frontend` - Runs frontend dev server  
- `dev` - Runs both concurrently

**Backend (`backend/package.json`):**
- `build` - `tsc`
- `start` - `node dist/server.js`
- `dev` - `ts-node-dev src/server.ts`
- `seed` - `ts-node src/seed/seed.ts`
- `test` - `jest`

**Frontend (`frontend/package.json`):**
- `dev` - `vite`
- `build` - `vite build`
- `build:dev` - `vite build --mode development`
- `lint` - `eslint .`
- `preview` - `vite preview`
- `test` - `vitest run`
- `test:watch` - `vitest`