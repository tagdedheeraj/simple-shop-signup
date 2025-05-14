
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // More efficient effect with improved dependencies tracking
  useEffect(() => {
    console.log("Admin page state:", { isAuthenticated, isAdmin, loading });
    
    // Only redirect if fully loaded and conditions aren't met
    if (!loading) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to signin");
        navigate('/signin', { state: { from: location }, replace: true });
        return;
      }
      
      if (!isAdmin) {
        console.log("Not admin, redirecting to home");
        toast.error('You do not have permission to access the admin panel');
        navigate('/', { replace: true });
        return;
      }
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
  
  // If authenticated and admin, directly render the layout without conditional redirects
  if (isAuthenticated && isAdmin) {
    console.log("Rendering admin layout");
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }
  
  // Return a loading state while redirects are happening (prevents flashing)
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
