
import { 
  Layers, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  ShoppingCart,
  Heart,
  Home
} from 'lucide-react';

export interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  admin?: boolean;
}

export const useSidebarLinks = () => {
  // Main navigation links (accessible to all users)
  const mainLinks: SidebarLink[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
  ];

  // Admin navigation links
  const adminLinks: SidebarLink[] = [
    { name: 'Dashboard', href: '/admin', icon: Layers, admin: true },
    { name: 'Products', href: '/admin/products', icon: Package, admin: true },
    { name: 'Users', href: '/admin/users', icon: Users, admin: true },
    { name: 'Sales', href: '/admin/sales', icon: BarChart3, admin: true },
    { name: 'Settings', href: '/admin/settings', icon: Settings, admin: true },
  ];

  return { mainLinks, adminLinks };
};
