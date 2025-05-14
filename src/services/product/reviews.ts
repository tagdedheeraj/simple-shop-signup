
import { Product, Review } from '@/types/product';
import { getFirestoreProductById, saveFirestoreProduct } from '../firebase/products';

export const addReview = async (
  productId: string,
  reviewData: {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    photos?: string[];
  }
): Promise<boolean> => {
  try {
    // Get the product
    const product = await getFirestoreProductById(productId);
    if (!product) {
      console.error('Product not found');
      return false;
    }

    // Create a new review object
    const review: Review = {
      id: `review-${Date.now()}`,
      userId: reviewData.userId,
      userName: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
      photos: reviewData.photos,
    };

    // Initialize reviews array if it doesn't exist
    const existingReviews = product.reviews || [];
    
    // Add the new review
    const updatedProduct: Product = {
      ...product,
      reviews: [...existingReviews, review],
    };

    // Save the updated product
    await saveFirestoreProduct(updatedProduct);
    
    return true;
  } catch (error) {
    console.error('Error adding review:', error);
    return false;
  }
};
