
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layers, 
  Users, 
  BarChart3, 
  Settings, 
  Package, 
  LogOut, 
  Menu, 
  X,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const location = useLocation();

  // Close sidebar by default on mobile devices
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: Layers },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Sales', href: '/admin/sales', icon: BarChart3 },
    { name: 'Hero Banners', href: '/admin/hero-banners', icon: Image },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  // Create overlay for mobile to close sidebar when clicking outside
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle - moved to better position and made more visible */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="default"
          size="icon"
          className="rounded-full bg-primary text-primary-foreground shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar with improved mobile styles */}
      <div
        className={cn(
          "fixed inset-y-0 z-40 flex flex-col bg-card border-r shadow-lg transition-all duration-300 w-[85%] sm:w-72 lg:w-64",
          sidebarOpen ? "left-0" : "-left-full lg:-left-64"
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              className="text-muted-foreground hover:text-foreground"
              title="Logout"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content with improved mobile padding and spacing */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        sidebarOpen ? "lg:pl-64" : "lg:pl-0"
      )}>
        {/* Header for mobile view */}
        <div className="bg-card border-b shadow-sm h-16 flex items-center justify-center lg:hidden">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>
        <div className="flex-1 h-full min-h-screen p-4 pt-16 lg:pt-6 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
