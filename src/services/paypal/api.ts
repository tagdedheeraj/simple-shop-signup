
import { toast } from 'sonner';
import { PayPalOrder } from './types';
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENVIRONMENT } from './config';

const PAYPAL_API_BASE = PAYPAL_ENVIRONMENT === 'live' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

// Get PayPal access token
const getAccessToken = async (): Promise<string> => {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
};

export const createPayPalOrder = async (order: PayPalOrder): Promise<string> => {
  try {
    const accessToken = await getAccessToken();
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: order.currency,
          value: order.totalAmount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: order.currency,
              value: order.totalAmount.toFixed(2)
            }
          }
        },
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: order.currency,
            value: item.price.toFixed(2),
          },
        })),
      }],
      application_context: {
        return_url: `${window.location.origin}/order-success`,
        cancel_url: `${window.location.origin}/checkout`,
        brand_name: 'Green Haven',
        locale: 'en-US',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      },
    };

    console.log('Creating PayPal order with data:', orderData);

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('PayPal order creation failed:', errorData);
      throw new Error(`Failed to create PayPal order: ${response.status}`);
    }

    const data = await response.json();
    console.log('PayPal order created successfully:', data);
    return data.id;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    toast.error('Failed to create PayPal order');
    throw error;
  }
};

export const capturePayPalOrder = async (orderId: string): Promise<boolean> => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('PayPal order capture failed:', errorData);
      throw new Error(`Failed to capture PayPal order: ${response.status}`);
    }

    const data = await response.json();
    console.log('PayPal order captured successfully:', data);
    
    if (data.status === 'COMPLETED') {
      toast.success('Payment successful!');
      return true;
    } else {
      toast.error('Payment was not completed');
      return false;
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    toast.error('Failed to capture payment');
    throw error;
  }
};
