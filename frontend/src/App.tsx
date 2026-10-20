import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import Layout from "@/components/layout/Layout";
import AdminGuard from "@/components/AdminGuard";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Loader } from "@/components/common/Loader";
import Index from "./pages/Index";
import "./styles/GlobalAnimations.css";

// Route-level code splitting for faster initial page load
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const OrdersTable = lazy(() => import("@/pages/admin/components/OrdersTable"));
const ProductsTable = lazy(() => import("@/pages/admin/components/ProductsTable"));
const CategoriesTable = lazy(() => import("@/pages/admin/components/CategoriesTable"));
const UsersTable = lazy(() => import("@/pages/admin/components/UsersTable"));
const DevDesignSystem = lazy(() => import("./pages/DevDesignSystem"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader size="md" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <Suspense fallback={<PageFallback />}>
                    <Routes>
                      <Route element={<Layout />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/collections" element={<CollectionsPage />} />
                        <Route
                          path="/collections/:slug"
                          element={<CollectionsPage />}
                        />
                        <Route
                          path="/product/:slug"
                          element={<ProductDetailPage />}
                        />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
                          <Route index element={<AdminPage />} />
                          <Route path="products" element={<ProductsTable />} />
                          <Route path="categories" element={<CategoriesTable />} />
                          <Route path="orders" element={<OrdersTable />} />
                          <Route path="users" element={<UsersTable />} />
                        </Route>
                        {import.meta.env.DEV && (
                          <Route path="/dev/design-system" element={<DevDesignSystem />} />
                        )}
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
