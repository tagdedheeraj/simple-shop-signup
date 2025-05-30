
// PayPal production/sandbox configuration
export const PAYPAL_CLIENT_ID = 'ARMzFRvB5ZEtJ3JTSwmRpEF9gmDotkdxxKFZOft0ILpG0nyWCn7gYgWehSxOAIh4EePyfeslaTjVQOA0';
export const PAYPAL_CLIENT_SECRET = 'EDBys_6f8Q9SxYkpXqASQtnT-D3ZORD55m5Rxz0Yy2xOBAUvUkisckL351PbEZwRIKUxT30EawxU9fEV';
export const PAYPAL_EMAIL = 'somnathkharade777@gmail.com';

// Environment setting with proper typing
export const PAYPAL_ENVIRONMENT: 'sandbox' | 'live' = 'sandbox'; // Change to 'live' for production

// PayPal validation helper
export const validatePayPalEnvironment = (): boolean => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.error('❌ PayPal credentials missing');
    return false;
  }
  
  console.log(`✅ PayPal configured for ${PAYPAL_ENVIRONMENT} environment`);
  return true;
};

// Error messages in Hindi for better user experience
export const PAYPAL_ERROR_MESSAGES = {
  SCRIPT_LOAD_FAILED: 'PayPal सिस्टम लोड नहीं हो सका। कृपया दोबारा कोशिश करें।',
  PAYMENT_FAILED: 'पेमेंट में समस्या आई है। कृपया दोबारा कोशिश करें।',
  NETWORK_ERROR: 'इंटरनेट कनेक्शन में समस्या है। कृपया चेक करें।',
  INVALID_AMOUNT: 'गलत राशि। कृपया सही amount डालें।',
  ORDER_CREATION_FAILED: 'ऑर्डर बनाने में समस्या आई है।',
  PAYMENT_CANCELLED: 'पेमेंट रद्द कर दिया गया है।',
  GENERAL_ERROR: 'कुछ गलत हुआ है। कृपया बाद में कोशिश करें।'
};
