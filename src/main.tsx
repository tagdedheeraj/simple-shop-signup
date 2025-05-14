
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './services/firebase'; // Import Firebase initialization
import { checkAppVersion, generateGlobalTimestamp } from './utils/version-checker';
import { FORCE_REFRESH_ON_START } from './config/app-config';
import { refreshProductData, initializeProducts } from './services/product';

// Generate a global timestamp for this session (used for image caching)
generateGlobalTimestamp();

// Initialize app and check for version updates
const initializeApp = async () => {
  // Check if app version has changed
  await checkAppVersion();
  
  // Initialize products
  await initializeProducts();
  
  // Force refresh product data if configured
  if (FORCE_REFRESH_ON_START) {
    await refreshProductData();
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
