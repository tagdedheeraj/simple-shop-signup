
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';

const Admin: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Only admin users should access this page
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default Admin;
