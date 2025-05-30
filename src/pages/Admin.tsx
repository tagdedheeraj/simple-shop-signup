
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialCheck, setInitialCheck] = useState(false);
  
  console.log("=== ADMIN PAGE RENDER ===", { 
    isAuthenticated, 
    isAdmin, 
    loading, 
    userUid: user?.uid,
    userRole: user?.role,
    pathname: location.pathname,
    initialCheck
  });

  useEffect(() => {
    console.log("=== ADMIN PAGE EFFECT ===", {
      loading,
      isAuthenticated,
      isAdmin,
      pathname: location.pathname,
      initialCheck
    });
    
    // Wait for initial auth check to complete
    if (!loading && !initialCheck) {
      setInitialCheck(true);
      
      if (!isAuthenticated) {
        console.log("Admin page: Not authenticated, redirecting to signin");
        navigate('/signin', { state: { from: location }, replace: true });
        return;
      }
      
      if (isAuthenticated && !isAdmin) {
        console.log("Admin page: User authenticated but not admin, redirecting to home");
        toast.error('You do not have permission to access the admin panel');
        navigate('/', { replace: true });
        return;
      }
      
      // If we reach here, user is authenticated and admin
      console.log("Admin page: User is authenticated admin, staying on admin page");
    }
  }, [isAuthenticated, isAdmin, loading, navigate, location, initialCheck]);
  
  // Show loading state while checking authentication
  if (loading || !initialCheck) {
    console.log("Admin page: Showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // Only render admin layout if authenticated and admin
  if (isAuthenticated && isAdmin) {
    console.log("Admin page: Rendering admin layout for admin user");
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }
  
  // This should not be reached due to redirects above, but kept as fallback
  console.log("Admin page: Access denied fallback");
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
