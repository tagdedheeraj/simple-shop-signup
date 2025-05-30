
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  console.log("=== ADMIN PAGE ===", { 
    isAuthenticated, 
    isAdmin, 
    loading, 
    userEmail: user?.email,
    userRole: user?.role
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;
    
    // Check authentication
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to signin");
      navigate('/signin', { replace: true });
      return;
    }
    
    // Check admin role
    if (!isAdmin) {
      console.log("Not admin, redirecting to home");
      toast.error('आपको admin panel access करने की permission नहीं है');
      navigate('/', { replace: true });
      return;
    }
    
    console.log("Admin authenticated successfully");
  }, [loading, isAuthenticated, isAdmin, navigate]);
  
  // Show loading while checking auth
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
  
  // Show access denied if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-muted-foreground">आपको admin panel access करने की permission नहीं है।</p>
        </div>
      </div>
    );
  }
  
  // Render admin layout if everything is good
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default Admin;
