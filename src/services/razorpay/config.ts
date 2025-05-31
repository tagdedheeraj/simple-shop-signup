
// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  // Test mode keys - Replace with live keys for production
  KEY_ID: 'rzp_test_9999999999', // Replace with your test key
  KEY_SECRET: 'test_secret_key_here', // This should be in backend/environment variables
  
  // Test mode settings
  TEST_MODE: true,
  
  // Currency settings
  CURRENCY: 'INR',
  
  // Company details
  COMPANY_NAME: 'Lakshmikrupa Agriculture',
  COMPANY_LOGO: '/favicon.ico',
  
  // Theme configuration
  THEME: {
    color: '#f59e0b', // Amber color matching your site theme
    backdrop_color: 'rgba(0, 0, 0, 0.7)'
  }
};

// Test card details for testing
export const TEST_CARDS = {
  SUCCESS: {
    number: '4111111111111111',
    expiry: '12/25',
    cvv: '123'
  },
  FAILURE: {
    number: '4000000000000002',
    expiry: '12/25', 
    cvv: '123'
  }
};
