
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { cleanupOldUploadedFiles } from '@/utils/file-storage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Clean up old uploaded files on app start
cleanupOldUploadedFiles();

// Initialize app for mobile builds
const initializeApp = async () => {
  // Check if this is a mobile build (Capacitor)
  const isCapacitor = !!(window as any).Capacitor;
  
  if (isCapacitor) {
    console.log('📱 Mobile app detected - ensuring only Firebase data is used...');
    
    // Clear ALL localStorage data except Firebase auth and admin data
    const keysToKeep = ['admin-videos', 'firebase:authUser', 'firebase:host', 'persist:auth'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ Mobile app initialized - only Firebase and admin data preserved');
  }
};

// Initialize app
initializeApp().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
