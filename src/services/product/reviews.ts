
import { Review } from '@/types/product';
import { products } from './data';
import { delay } from './utils';

export const addReview = async (productId: string, review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  await delay(500); // Simulate network delay
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID(),
    date: new Date().toISOString()
  };
  
  if (!product.reviews) {
    product.reviews = [];
  }
  
  product.reviews.push(newReview);
  
  // In a real app, this would update the backend
  localStorage.setItem('products', JSON.stringify(products));
  
  return newReview;
};
