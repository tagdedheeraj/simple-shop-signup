
import { toast } from 'sonner';

// PayPal test mode settings - using sandbox mode
const PAYPAL_CLIENT_ID = 'sb'; // 'sb' is the sandbox mode client ID

// Declare PayPal global for TypeScript
declare global {
  interface Window {
    paypal: any;
  }
}

export const loadPayPalScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.querySelector('#paypal-script')) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'paypal-script';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    
    script.onload = () => {
      console.log('PayPal script loaded successfully');
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

export interface PayPalOrder {
  orderId: string;
  totalAmount: number;
  items: { name: string; quantity: number; price: number }[];
}

export const createPayPalOrder = async (order: PayPalOrder): Promise<string> => {
  // In a real implementation, this would communicate with your backend
  // which would then create an order with the PayPal API
  
  // For this demo, we're simulating a successful order creation
  console.log('Creating PayPal order:', order);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In sandbox mode, we can return any string as the order ID
  return `TEST-ORDER-${Math.random().toString(36).substr(2, 9)}`;
};

export const capturePayPalOrder = async (orderId: string): Promise<boolean> => {
  // In a real implementation, this would communicate with your backend
  // which would then capture the payment with the PayPal API
  
  // For this demo, we're simulating a successful payment capture
  console.log(`Capturing payment for order: ${orderId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return true;
};
