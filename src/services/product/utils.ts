
// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in localStorage if they don't exist
export const initializeProducts = (options?: { forceRefresh?: boolean }) => {
  const shouldRefresh = options?.forceRefresh === true;
  
  if (shouldRefresh || !localStorage.getItem('products')) {
    // Import products from data when needed
    const { products } = require('./data');
    localStorage.setItem('products', JSON.stringify(products));
  }
};
