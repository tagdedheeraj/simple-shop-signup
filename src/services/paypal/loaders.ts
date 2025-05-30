
import { toast } from 'sonner';
import { PAYPAL_CLIENT_ID } from './config';

let scriptLoadPromise: Promise<boolean> | null = null;

export const loadPayPalScript = (currency = 'USD'): Promise<boolean> => {
  // If already loading, return the existing promise
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve) => {
    // Check if PayPal is already loaded
    if (window.paypal) {
      console.log('PayPal script already loaded');
      resolve(true);
      return;
    }

    // Remove any existing script to re-initialize with current currency
    const existingScript = document.querySelector('#paypal-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.id = 'paypal-script';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture`;
    script.async = true;
    
    script.onload = () => {
      console.log(`PayPal script loaded successfully with currency: ${currency}`);
      // Reset the promise so it can be called again if needed
      scriptLoadPromise = null;
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load PayPal script');
      toast.error('PayPal payment system could not be loaded');
      scriptLoadPromise = null;
      resolve(false);
    };
    
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};
