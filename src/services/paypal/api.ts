
import { toast } from 'sonner';
import { PayPalOrder } from './types';

export const createPayPalOrder = async (order: PayPalOrder): Promise<string> => {
  // In a real implementation, this would communicate with your backend
  // which would then create an order with the PayPal API
  
  // For this demo, we're simulating a successful order creation
  console.log('Creating PayPal order:', order);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In sandbox mode, we can return any string as the order ID
  // This is only for testing purposes
  toast.info('Test Mode: PayPal sandbox environment active');
  return `TEST-ORDER-${Math.random().toString(36).substr(2, 9)}`;
};

export const capturePayPalOrder = async (orderId: string): Promise<boolean> => {
  // In a real implementation, this would communicate with your backend
  // which would then capture the payment with the PayPal API
  
  // For this demo, we're simulating a successful payment capture
  console.log(`Capturing payment for order: ${orderId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // This is only for testing purposes
  toast.info('Test Mode: Payment captured in sandbox environment');
  return true;
};
