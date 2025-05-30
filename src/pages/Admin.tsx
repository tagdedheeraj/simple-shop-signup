
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log("=== ADMIN PAGE RENDER ===", { 
    isAuthenticated, 
    isAdmin, 
    loading, 
    userUid: user?.uid,
    userRole: user?.role
  });
  
  useEffect(() => {
    console.log("=== ADMIN PAGE EFFECT ===", {
      loading,
      isAuthenticated,
      isAdmin,
      pathname: location.pathname
    });
    
    // Don't do anything while still loading
    if (loading) {
      console.log("Admin page: Still loading, waiting...");
      return;
    }
    
    // Handle unauthenticated users
    if (!isAuthenticated) {
      console.log("Admin page: Not authenticated, redirecting to signin");
      navigate('/signin', { state: { from: location }, replace: true });
      return;
    }
    
    // Handle authenticated but non-admin users with longer delay
    if (isAuthenticated && !isAdmin) {
      console.log("Admin page: User authenticated but not admin, checking role...");
      
      // Give more time for role to load properly
      setTimeout(() => {
        console.log("Admin page: Final check - isAdmin:", isAdmin);
        if (!isAdmin) {
          console.log("Admin page: User confirmed as non-admin, redirecting to home");
          toast.error('You do not have permission to access the admin panel');
          navigate('/', { replace: true });
        }
      }, 1000); // Increased delay to 1 second
      return;
    }
    
    console.log("Admin page: User is authenticated and admin, staying on admin page");
  }, [isAuthenticated, isAdmin, loading, navigate, location.pathname]);
  
  // Show loading state longer to prevent flickering
  if (loading) {
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
  
  // Only render admin layout if definitely authenticated and admin
  if (isAuthenticated && isAdmin) {
    console.log("Admin page: Rendering admin layout for admin user");
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }
  
  // Show checking state while authentication is being processed
  console.log("Admin page: Showing permission checking state");
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">Verifying admin access...</p>
      </div>
    </div>
  );
};

export default Admin;
