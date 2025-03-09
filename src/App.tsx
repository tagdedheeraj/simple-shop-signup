import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationBanner from "@/components/notifications/NotificationBanner";

// Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

// Initialize services
import { initializeProducts } from "./services/productService";

// Initialize mock data
initializeProducts();

const queryClient = new QueryClient();

// Route guard for authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LocalizationProvider>
                <NotificationProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <AnimatePresence mode="wait">
                      <NotificationBanner />
                      <Routes>
                        {/* Auth routes */}
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        
                        {/* Public product routes */}
                        <Route path="/" element={<Navigate to="/products" replace />} />
                        
                        {/* Protected routes */}
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
                        
                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </BrowserRouter>
                </NotificationProvider>
              </LocalizationProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
