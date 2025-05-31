
import { RAZORPAY_CONFIG } from './config';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  // Convert amount to paise (Razorpay expects amount in smallest currency unit)
  const amountInPaise = Math.round(amount * 100);
  
  // In a real app, this should be done on your backend
  // For demo purposes, we'll create a mock order
  return {
    id: `order_${Date.now()}`,
    amount: amountInPaise,
    currency: currency,
    receipt: `receipt_${Date.now()}`
  };
};

// Razorpay payment options
export const getRazorpayOptions = (
  order: any,
  customerInfo: any,
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
) => {
  return {
    key: RAZORPAY_CONFIG.KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: RAZORPAY_CONFIG.COMPANY_NAME,
    description: 'Agricultural Products Purchase',
    image: RAZORPAY_CONFIG.COMPANY_LOGO,
    order_id: order.id,
    
    // Customer details
    prefill: {
      name: customerInfo.fullName,
      email: customerInfo.email,
      contact: customerInfo.phone
    },
    
    // Address details
    shipping: {
      name: customerInfo.fullName,
      address: customerInfo.address,
      city: customerInfo.city,
      state: customerInfo.state,
      zipcode: customerInfo.zipCode,
      country: customerInfo.country
    },
    
    // Theme
    theme: RAZORPAY_CONFIG.THEME,
    
    // Test mode configuration
    config: {
      display: {
        blocks: {
          banks: {
            name: 'Pay using ' + (RAZORPAY_CONFIG.TEST_MODE ? 'Test Cards' : 'Net Banking'),
            instruments: RAZORPAY_CONFIG.TEST_MODE ? [
              { method: 'card' },
              { method: 'upi' }
            ] : undefined
          }
        },
        sequence: ['block.banks'],
        preferences: {
          show_default_blocks: true
        }
      }
    },
    
    // Handlers
    handler: onSuccess,
    modal: {
      ondismiss: () => {
        console.log('Razorpay checkout modal dismissed');
        onFailure({ error: 'Payment cancelled by user' });
      }
    },
    
    // Notes for reference
    notes: {
      customer_id: customerInfo.email,
      order_type: 'ecommerce'
    }
  };
};
