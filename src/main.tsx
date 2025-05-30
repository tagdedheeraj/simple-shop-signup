
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
  const isCapacitor = !!(window as any).Capacitor;
  
  if (isCapacitor) {
    console.log('📱 Mobile app detected - performing complete data reset...');
    
    // Clear ALL localStorage data except essential Firebase auth
    const keysToKeep = ['firebase:authUser', 'firebase:host'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
        localStorage.removeItem(key);
        console.log('🗑️ Cleared cache:', key);
      }
    });
    
    // Set fresh timestamp
    localStorage.setItem('global_timestamp', Date.now().toString());
    
    console.log('✅ Mobile app data completely reset - only Firebase data will be used');
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
