
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { Toaster as SonnerToaster } from "sonner";
import PageTransition from "@/components/layout/PageTransition";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./services/query-client";

// Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Certificates from "./pages/Certificates";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Admin Pages
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Products";
import AdminUsers from "./pages/Admin/Users";
import AdminSales from "./pages/Admin/Sales";
import AdminSettings from "./pages/Admin/Settings";
import AdminHeroBanners from "./pages/Admin/HeroBanners";
import AdminVideos from "./pages/Admin/Videos";

// Initialize services
import { initializeProducts } from "./services/product";

// Initialize mock data WITHOUT forcing refresh - this prevents re-adding deleted products
initializeProducts({ forceRefresh: false });

// Route guard for authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return <PageTransition>{children}</PageTransition>;
};

// Route guard for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/signin" replace />;
  }
  
  return <PageTransition>{children}</PageTransition>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <LocalizationProvider>
              <TooltipProvider>
                <Toaster />
                <SonnerToaster 
                  closeButton
                  position="top-right"
                  toastOptions={{
                    duration: 2000,
                    style: {
                      pointerEvents: "auto",
                      zIndex: 40,
                    },
                  }}
                />
                <AnimatePresence mode="wait">
                  <Routes>
                    {/* Auth routes */}
                    <Route path="/signin" element={<PageTransition><SignIn /></PageTransition>} />
                    <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
                    
                    {/* Home route (landing page) */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } />
                    
                    {/* Product routes */}                      
                    <Route path="/products" element={
                      <ProtectedRoute>
                        <Products />
                      </ProtectedRoute>
                    } />
                    <Route path="/product/:productId" element={
                      <ProtectedRoute>
                        <ProductDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/wishlist" element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    } />
                    <Route path="/order-success" element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } />
                    <Route path="/certificates" element={
                      <ProtectedRoute>
                        <Certificates />
                      </ProtectedRoute>
                    } />
                    
                    {/* Policy pages */}
                    <Route path="/refund-policy" element={
                      <ProtectedRoute>
                        <RefundPolicy />
                      </ProtectedRoute>
                    } />
                    <Route path="/privacy-policy" element={
                      <ProtectedRoute>
                        <PrivacyPolicy />
                      </ProtectedRoute>
                    } />
                    <Route path="/terms-of-service" element={
                      <ProtectedRoute>
                        <TermsOfService />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={<Admin />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="sales" element={<AdminSales />} />
                      <Route path="videos" element={<AdminVideos />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="hero-banners" element={<AdminHeroBanners />} />
                    </Route>
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                  </Routes>
                </AnimatePresence>
              </TooltipProvider>
            </LocalizationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
