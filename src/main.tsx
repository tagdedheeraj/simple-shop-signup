
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

// Initialize app for mobile builds - simplified to avoid localStorage issues
const initializeApp = async () => {
  const isCapacitor = !!(window as any).Capacitor;
  
  if (isCapacitor) {
    console.log('📱 Mobile app detected - using Firebase data only');
    
    // Only set essential timestamp for image loading
    localStorage.setItem('global_timestamp', Date.now().toString());
    
    console.log('✅ Mobile app initialized - Firebase data will be used');
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
