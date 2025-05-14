
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './services/firebase'; // Import Firebase initialization
import { checkAppVersion, generateGlobalTimestamp } from './utils/version-checker';
import { initializeProducts } from './services/product';

// Generate a global timestamp for this session (used for image caching)
generateGlobalTimestamp();

// Initialize app and check for version updates
const initializeApp = async () => {
  // Check if app version has changed
  await checkAppVersion();
  
  // Initialize products - do this only once at app startup
  // But don't refresh or reset products - this prevents re-adding deleted items
  console.log('Initializing products at app startup without forced refresh');
  await initializeProducts({ forceRefresh: false });
  
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
