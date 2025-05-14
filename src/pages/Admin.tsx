
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extra effect to handle navigation issues
  useEffect(() => {
    console.log("Admin page state:", { isAuthenticated, isAdmin, loading });
    
    // If we've fully loaded and the user isn't authenticated, navigate away
    if (!loading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to signin");
      navigate('/signin', { state: { from: location }, replace: true });
    }
    
    // If user is authenticated but not admin, show error and redirect
    if (!loading && isAuthenticated && !isAdmin) {
      console.log("Not admin, redirecting to home");
      toast.error('You do not have permission to access the admin panel');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAdmin, loading, navigate, location]);
  
  // Show loading state to prevent flickering and premature redirects
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated, don't render anything (redirects handled by effect)
  if (!isAuthenticated) {
    console.log("Not authenticated in render, returning null");
    return null;
  }
  
  // If user is authenticated but not admin, don't render anything (redirects handled by effect)
  if (!isAdmin) {
    console.log("Not admin in render, returning null");
    return null;
  }
  
  // Only render the admin layout if authenticated as admin
  console.log("Rendering admin layout");
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default Admin;
