
// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in localStorage if they don't exist
export const initializeProducts = (products: any[]) => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
  }
};
