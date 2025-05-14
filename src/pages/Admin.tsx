
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  // If user is not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // If user is authenticated but not admin, show error and redirect to home
  if (!isAdmin) {
    toast.error('You do not have permission to access the admin panel');
    return <Navigate to="/" replace />;
  }
  
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default Admin;
