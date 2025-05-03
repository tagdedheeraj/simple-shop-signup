
export interface PayPalOrder {
  orderId: string;
  totalAmount: number;
  currency: string;
  items: { name: string; quantity: number; price: number }[];
  customerInfo?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Add PayPal global type definition 
declare global {
  interface Window {
    paypal: any;
  }
}
