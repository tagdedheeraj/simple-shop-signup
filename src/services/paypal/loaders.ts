
import { toast } from 'sonner';
import { PAYPAL_CLIENT_ID, validatePayPalEnvironment, PAYPAL_ERROR_MESSAGES } from './config';

let scriptLoadPromise: Promise<boolean> | null = null;
let retryCount = 0;
const MAX_RETRIES = 3;

export const loadPayPalScript = (currency = 'USD'): Promise<boolean> => {
  console.log('🔄 Loading PayPal script for currency:', currency);
  
  // Validate environment first
  if (!validatePayPalEnvironment()) {
    toast.error(PAYPAL_ERROR_MESSAGES.GENERAL_ERROR);
    return Promise.resolve(false);
  }

  // If already loading, return the existing promise
  if (scriptLoadPromise) {
    console.log('⏳ PayPal script already loading...');
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve) => {
    // Check if PayPal is already loaded and working
    if (window.paypal && typeof window.paypal.Buttons === 'function') {
      console.log('✅ PayPal script already loaded and ready');
      scriptLoadPromise = null;
      resolve(true);
      return;
    }

    // Remove any existing script to re-initialize with current currency
    const existingScript = document.querySelector('#paypal-script');
    if (existingScript) {
      console.log('🗑️ Removing existing PayPal script');
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.id = 'paypal-script';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture&enable-funding=venmo,card&disable-funding=credit`;
    script.async = true;
    
    const timeoutId = setTimeout(() => {
      console.error('⏰ PayPal script load timeout');
      handleScriptError('Timeout loading PayPal script');
    }, 15000); // 15 second timeout
    
    script.onload = () => {
      clearTimeout(timeoutId);
      console.log(`✅ PayPal script loaded successfully with currency: ${currency}`);
      
      // Verify PayPal object is available and functional
      if (window.paypal && typeof window.paypal.Buttons === 'function') {
        console.log('✅ PayPal Buttons API confirmed working');
        scriptLoadPromise = null;
        retryCount = 0;
        resolve(true);
      } else {
        console.error('❌ PayPal object not properly initialized');
        handleScriptError('PayPal not properly initialized');
      }
    };
    
    script.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error('❌ PayPal script failed to load:', error);
      handleScriptError('Script load error');
    };
    
    const handleScriptError = (errorType: string) => {
      scriptLoadPromise = null;
      
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`🔄 Retrying PayPal script load (${retryCount}/${MAX_RETRIES})`);
        toast.error(`PayPal लोड कर रहे हैं... कोशिश ${retryCount}/${MAX_RETRIES}`);
        
        setTimeout(() => {
          loadPayPalScript(currency).then(resolve);
        }, 2000 * retryCount); // Progressive delay
      } else {
        console.error(`❌ Max retries (${MAX_RETRIES}) reached for PayPal script loading`);
        toast.error(PAYPAL_ERROR_MESSAGES.SCRIPT_LOAD_FAILED);
        retryCount = 0;
        resolve(false);
      }
    };
    
    console.log('📥 Adding PayPal script to document head');
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};

// Helper function to check if PayPal is ready
export const isPayPalReady = (): boolean => {
  return !!(window.paypal && typeof window.paypal.Buttons === 'function');
};

// Force reload PayPal script
export const reloadPayPalScript = (currency = 'USD'): Promise<boolean> => {
  console.log('🔄 Force reloading PayPal script');
  scriptLoadPromise = null;
  retryCount = 0;
  
  // Remove existing script
  const existingScript = document.querySelector('#paypal-script');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Clear window.paypal
  if (window.paypal) {
    delete (window as any).paypal;
  }
  
  return loadPayPalScript(currency);
};
