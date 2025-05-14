
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
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
  
  // If user is not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // If user is authenticated but not admin, show error and redirect to home
  if (!isAdmin) {
    toast.error('You do not have permission to access the admin panel');
    return <Navigate to="/" replace />;
  }
  
  // Only render the admin layout if authenticated as admin
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default Admin;
