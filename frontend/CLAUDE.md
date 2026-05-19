# Kaizen Art and Craft - Frontend Documentation

This document provides a comprehensive analysis of the frontend architecture, file structure, API integrations, and development patterns for the Kaizen Art and Craft e-commerce platform.

## 🚀 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Context (Auth, Cart, Wishlist) + TanStack React Query (for Supabase data)
- **Routing:** React Router DOM v6
- **API Clients:** Axios (Custom Backend) & Supabase Client
- **Testing:** Vitest + React Testing Library

---

## 📁 Directory Structure & File Details

### `src/` (Root Source)
- **`main.tsx`**: Entry point of the application.
- **`App.tsx`**: Main application component. Sets up all Context Providers (`QueryClientProvider`, `AuthProvider`, `WishlistProvider`, `CartProvider`, `TooltipProvider`) and defines all routes.
- **`App.css` / `index.css`**: Global styles and Tailwind directives.

### `src/components/` (Reusable Components)
- **`NavLink.tsx`**: Styled navigation link with active state handling.
- **`ProductCard.tsx`**: Component for displaying product thumbnails with "Add to Cart/Wishlist" functionality.
- **`layout/`**:
    - **`Layout.tsx`**: Wrapper component providing the common structure (Navbar, Main Content, Footer).
    - **`MainNavbar.tsx`**: Complex responsive navigation bar including search, user profile menu, and cart/wishlist indicators.
    - **`TopBar.tsx`**: Secondary top navigation for announcements or quick links.
    - **`Footer.tsx`**: Site footer with links, newsletter signup, and payment options.
- **`ui/`**: Radix-based UI primitives from `shadcn/ui` (Button, Input, Dialog, etc.).

### `src/contexts/` (Global State)
- **`AuthContext.tsx`**: Manages user authentication state, including login, signup, OTP verification, and profile loading. Uses the custom Axios `api`.
- **`CartContext.tsx`**: Handles shopping cart logic (adding/removing items, quantity updates) stored in local state.
- **`WishlistContext.tsx`**: Manages the user's wishlist count and synchronization with the backend.

### `src/hooks/` (Custom Hooks)
- **`use-mobile.tsx`**: Utility hook for responsive design detection.
- **`use-toast.ts`**: Wrapper for the `sonner` / `shadcn` toast notification system.
- **`useProducts.ts`**: TanStack Query hooks for fetching products and collections from **Supabase**.

### `src/pages/` (Page Components)
- **`Index.tsx`**: Home page featuring hero sliders, category highlights, and featured products.
- **`ShopPage.tsx`**: Main product listing page with filtering and sorting capabilities.
- **`CollectionsPage.tsx`**: Browsing products by category/collection.
- **`ProductDetailPage.tsx`**: Comprehensive view of a single product with specs, reviews, and related items.
- **`AuthPage.tsx`**: Unified login/signup/OTP verification page.
- **`ProfilePage.tsx`**: User account management and order history.
- **`CartPage.tsx` / `WishlistPage.tsx`**: User-specific product lists.
- **`admin/`**:
    - **`AdminLayout.tsx`**: Dashboard layout for administrative tasks.
    - **`AdminPage.tsx`**: Overview dashboard.
    - **`components/ProductsTable.tsx`**: Full CRUD interface for product management, supporting image uploads via `FormData`.

### `src/lib/` (Utilities & Config)
- **`api.ts`**: Axios instance configured with `VITE_API_URL` and interceptors for JWT Bearer token injection.
- **`constants.ts`**: Static site data, placeholder products/collections, and configuration constants.
- **`utils.ts`**: Helper functions including `cn` for Tailwind class merging and `getImageUrl` for handling backend image paths.

### `src/integrations/`
- **`supabase/`**: Configuration for the Supabase client and TypeScript types for the database schema.

---

## 🔌 API Integration

The project uses a hybrid approach for data fetching:

### 1. Custom Backend (via `src/lib/api.ts`)
Used primarily for Authentication, Wishlist management, and Admin CRUD.

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/user/signup` | POST | Register a new user |
| `/user/login` | POST | Standard email/password login |
| `/user/profile` | GET | Fetch authenticated user details |
| `/otp/send` | POST | Trigger OTP for phone verification |
| `/otp/verify-login` | POST | Verify login OTP |
| `/otp/verify-signup`| POST | Verify signup OTP |
| `/wishlist` | GET | Fetch user's wishlist |
| `/products` | GET/POST| List (admin) or create a new product |
| `/products/:id` | PUT/DELETE| Update or delete a product |
| `/categories` | GET | Fetch product categories |

### 2. Supabase
Used for public-facing product listing and high-performance queries.
- **Table: `products`**: Queried for listing, filtering, and single-product details.
- **Table: `collections`**: Queried for category-based navigation.

---

## 🛠️ Development Patterns

- **Component Structure:** Function components using `export default`.
- **Styling:** Mobile-first approach using Tailwind utility classes.
- **Data Fetching:**
    - Use `useProducts()` hook (React Query) for public data.
    - Use `api` (Axios) inside Contexts for authenticated/write operations.
- **Forms:** Mix of controlled components and `FormData` for file uploads (especially in `ProductsTable.tsx`).
- **Icons:** Always prefer `Lucide` icons.

---

## 🧪 Testing

- **Setup:** Configured in `src/test/setup.ts`.
- **Location:** All tests are located in the `src/test/` directory.
- **Run:** `npm test` or `vitest`.

---

## 🌐 Environment Variables

- `VITE_API_URL`: Base URL for the custom backend API.
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous public key.
