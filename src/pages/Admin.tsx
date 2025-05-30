
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  console.log("=== ADMIN PAGE DEBUG ===", { 
    isAuthenticated, 
    isAdmin, 
    loading, 
    userUid: user?.uid,
    userRole: user?.role,
    pathname: location.pathname,
    hasCheckedAuth
  });

  useEffect(() => {
    console.log("=== ADMIN PAGE AUTH CHECK ===", {
      loading,
      isAuthenticated,
      isAdmin,
      hasCheckedAuth
    });
    
    if (!loading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      
      console.log("Performing auth check...", { isAuthenticated, isAdmin });
      
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to signin");
        navigate('/signin', { replace: true });
        return;
      }
      
      if (!isAdmin) {
        console.log("User not admin, redirecting to home");
        toast.error('आपको admin panel access करने की permission नहीं है');
        navigate('/', { replace: true });
        return;
      }
      
      console.log("User is authenticated admin, staying on admin page");
    }
  }, [loading, isAuthenticated, isAdmin, navigate, hasCheckedAuth]);
  
  // Show loading while checking auth
  if (loading || !hasCheckedAuth) {
    console.log("Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // Only render if authenticated and admin
  if (isAuthenticated && isAdmin) {
    console.log("Rendering admin layout");
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }
  
  // Fallback - should not reach here due to redirects
  console.log("Access denied fallback");
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-muted-foreground">आपको admin panel access करने की permission नहीं है।</p>
      </div>
    </div>
  );
};

export default Admin;
