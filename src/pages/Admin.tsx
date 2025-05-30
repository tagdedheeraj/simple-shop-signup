
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log("Admin page render - Auth state:", { 
    isAuthenticated, 
    isAdmin, 
    loading, 
    userUid: user?.uid 
  });
  
  // Improved effect with better dependency tracking and delayed redirects
  useEffect(() => {
    // Don't do anything while still loading
    if (loading) {
      console.log("Admin page: Still loading, waiting...");
      return;
    }
    
    console.log("Admin page: Loading complete, checking auth state");
    
    // Handle unauthenticated users
    if (!isAuthenticated) {
      console.log("Admin page: Not authenticated, redirecting to signin");
      navigate('/signin', { state: { from: location }, replace: true });
      return;
    }
    
    // Handle authenticated but non-admin users with delay to ensure state is loaded
    if (isAuthenticated && !isAdmin) {
      console.log("Admin page: Authenticated but not admin, will redirect to home");
      
      // Add a small delay to ensure the role has been properly loaded
      setTimeout(() => {
        console.log("Admin page: Executing delayed redirect to home");
        toast.error('You do not have permission to access the admin panel');
        navigate('/', { replace: true });
      }, 200);
      return;
    }
    
    console.log("Admin page: User is authenticated and admin, staying on admin page");
  }, [isAuthenticated, isAdmin, loading, navigate, location]);
  
  // Show loading state to prevent flickering and premature redirects
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
  
  // If authenticated and admin, directly render the layout
  if (isAuthenticated && isAdmin) {
    console.log("Admin page: Rendering admin layout");
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }
  
  // Return a loading state while redirects are happening (prevents flashing)
  console.log("Admin page: Showing permission checking state");
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    </div>
  );
};

export default Admin;
