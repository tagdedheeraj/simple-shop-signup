
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './services/firebase'; // Import Firebase initialization
import { checkAppVersion, generateGlobalTimestamp } from './utils/version-checker';
import { FORCE_REFRESH_ON_START } from './config/app-config';
import { initializeProducts } from './services/product';

// Generate a global timestamp for this session (used for image caching)
generateGlobalTimestamp();

// Initialize app and check for version updates
const initializeApp = async () => {
  // Check if app version has changed
  await checkAppVersion();
  
  // Initialize products - do this only once at app startup
  console.log('Initializing products at app startup');
  await initializeProducts();
  
  // Force refresh product data only if explicitly configured
  if (FORCE_REFRESH_ON_START) {
    console.log('Force refresh on start is enabled, checking for missing products');
    // Note: This is now disabled by default in config
  }
  
  // Create root and render app once initialization is complete
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
};

// Start initialization
initializeApp().catch(error => {
  console.error('Error initializing app:', error);
  // Render app even if initialization fails
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
});
