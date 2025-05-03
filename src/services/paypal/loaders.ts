
import { toast } from 'sonner';
import { PAYPAL_CLIENT_ID } from './config';

export const loadPayPalScript = (currency = 'USD'): Promise<boolean> => {
  return new Promise((resolve) => {
    // Remove any existing script to re-initialize with current currency
    const existingScript = document.querySelector('#paypal-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.id = 'paypal-script';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.async = true;
    
    script.onload = () => {
      console.log(`PayPal script loaded successfully with currency: ${currency}`);
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load PayPal script');
      toast.error('PayPal payment system could not be loaded');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};
