
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './services/firebase'; // Import Firebase initialization

// Create root and render with a slight delay to ensure DOM is ready
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
