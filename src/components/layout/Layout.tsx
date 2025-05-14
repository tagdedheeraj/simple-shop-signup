
import React from 'react';
import Header from './Header';
import BottomBar from './BottomBar';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner";

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
      {/* Configure Sonner toaster with all improved settings */}
      <Toaster 
        className="!top-[4.5rem] md:!top-[5.5rem]"
        closeButton={true}
        toastOptions={{
          duration: 2000, // 2 seconds auto-dismiss
          style: { 
            zIndex: 40, // Lower z-index so it doesn't block UI
            pointerEvents: "auto", // Allow interaction with toast
          },
          className: "overflow-visible pointer-events-auto" // Ensure interactivity
        }}
      /> 
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-7xl">
        {children}
      </main>
      <footer className="py-6 border-t border-border/40 bg-background hidden md:block">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GlobalHarvest. All rights reserved.
        </div>
      </footer>
      <BottomBar />
    </div>
  );
};

export default Layout;
