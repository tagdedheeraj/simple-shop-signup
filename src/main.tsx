
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

// Initialize app for Firebase only - no local storage
const initializeApp = async () => {
  console.log('🚀 App starting - Firebase only mode');
  
  // Set essential timestamp for image loading only
  const timestamp = Date.now().toString();
  localStorage.setItem('global_timestamp', timestamp);
  
  console.log('✅ Firebase-only app initialized');
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
