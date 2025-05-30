
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { cleanupOldUploadedFiles } from '@/utils/file-storage';
import { forceRefreshAppData } from '@/utils/version-checker';

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

// Force refresh app data for mobile builds to ensure fresh content
const initializeApp = async () => {
  // Check if this is a mobile build (Capacitor)
  const isCapacitor = !!(window as any).Capacitor;
  
  if (isCapacitor) {
    console.log('📱 Mobile app detected - force refreshing data...');
    await forceRefreshAppData();
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
