
import React from 'react';
import Header from './Header';
import BottomBar from './BottomBar';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Loader2 } from 'lucide-react';
import { COMPANY_ADDRESS } from '@/config/app-config';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50/50 to-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-7xl">
        {children}
      </main>
      <footer className="py-6 border-t border-border/40 bg-background hidden md:block">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-4">
          <div className="flex justify-center space-x-6 mb-4">
            <Link to="/certificates" className="hover:text-primary transition-colors">
              Certificates
            </Link>
            <Link to="/refund-policy" className="hover:text-primary transition-colors">
              Refund Policy
            </Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p>© {new Date().getFullYear()} GlobalHarvest. All rights reserved.</p>
          <p className="text-xs">{COMPANY_ADDRESS}</p>
        </div>
      </footer>
      <BottomBar />
    </div>
  );
};

export default Layout;
