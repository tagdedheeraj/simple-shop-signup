
import { toast } from 'sonner';
import { PayPalOrder } from './types';
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENVIRONMENT, PAYPAL_ERROR_MESSAGES } from './config';

const PAYPAL_API_BASE = PAYPAL_ENVIRONMENT === 'live' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

let cachedAccessToken: { token: string; expires: number } | null = null;

// Get PayPal access token with caching
const getAccessToken = async (): Promise<string> => {
  // Check if we have a valid cached token
  if (cachedAccessToken && Date.now() < cachedAccessToken.expires) {
    console.log('✅ Using cached PayPal access token');
    return cachedAccessToken.token;
  }

  console.log('🔄 Getting new PayPal access token...');
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  
  try {
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ PayPal token request failed:', response.status, errorText);
      throw new Error(`Failed to get PayPal access token: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the token (expires in 9 hours, we'll cache for 8 hours)
    cachedAccessToken = {
      token: data.access_token,
      expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
    };
    
    console.log('✅ Got new PayPal access token');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal access token:', error);
    throw new Error('PayPal authorization failed');
  }
};

export const createPayPalOrder = async (order: PayPalOrder): Promise<string> => {
  try {
    console.log('🛒 Creating PayPal order...');
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
          name: item.name.substring(0, 127), // PayPal limit
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: order.currency,
            value: item.price.toFixed(2),
          },
        })),
        description: 'Lakshmikrupa Agriculture Products'
      }],
      application_context: {
        return_url: `${window.location.origin}/order-success`,
        cancel_url: `${window.location.origin}/checkout`,
        brand_name: 'Lakshmikrupa Agriculture',
        locale: 'en-IN',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      },
    };

    console.log('📦 PayPal order data:', orderData);

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `order-${Date.now()}`, // Idempotency key
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ PayPal order creation failed:', response.status, errorData);
      throw new Error(`Failed to create PayPal order: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ PayPal order created successfully:', data);
    return data.id;
  } catch (error) {
    console.error('❌ Error creating PayPal order:', error);
    toast.error(PAYPAL_ERROR_MESSAGES.ORDER_CREATION_FAILED);
    throw error;
  }
};

export const capturePayPalOrder = async (orderId: string): Promise<boolean> => {
  try {
    console.log('💰 Capturing PayPal order:', orderId);
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `capture-${orderId}-${Date.now()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ PayPal order capture failed:', response.status, errorData);
      throw new Error(`Failed to capture PayPal order: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ PayPal order captured successfully:', data);
    
    if (data.status === 'COMPLETED') {
      toast.success('🎉 Payment successful! आपका order confirm हो गया।');
      return true;
    } else {
      console.error('⚠️ Payment status not completed:', data.status);
      toast.error('Payment complete नहीं हुआ। Customer service से contact करें।');
      return false;
    }
  } catch (error) {
    console.error('❌ Error capturing PayPal order:', error);
    toast.error(PAYPAL_ERROR_MESSAGES.PAYMENT_FAILED);
    throw error;
  }
};

// Verify order status
export const getOrderDetails = async (orderId: string): Promise<any> => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get order details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error getting order details:', error);
    throw error;
  }
};
