
import React, { useState } from 'react';
import { Review } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Import our new sub-components
import ReviewForm from './reviews/ReviewForm';
import ReviewItem from './reviews/ReviewItem';
import EmptyReviews from './reviews/EmptyReviews';
import ReviewStats from './reviews/ReviewStats';

interface ProductReviewsProps {
  productId: string;
  reviews: Review[] | undefined;
  onAddReview: (rating: number, comment: string, photos?: string[]) => Promise<void>;
  productCategory?: 'wheat' | 'rice';
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId, 
  reviews = [], 
  onAddReview,
  productCategory 
}) => {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  // Filter reviews to only show relevant ones for wheat and rice products
  const filteredReviews = reviews.filter(review => {
    // If we have product category, we can add more specific filtering logic here
    // For now, we'll show all reviews but this can be enhanced
    return true;
  });
  
  const handleSubmitReview = async (rating: number, comment: string, photos?: string[]) => {
    try {
      setIsSubmitting(true);
      await onAddReview(rating, comment, photos);
      setIsAddingReview(false);
      toast.success('Review added successfully');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          <ReviewStats reviews={filteredReviews} />
          {productCategory && (
            <p className="text-sm text-muted-foreground mt-1">
              Reviews for {productCategory} products
            </p>
          )}
        </div>
        
        {user && !isAddingReview && (
          <Button 
            onClick={() => setIsAddingReview(true)}
            size="sm"
            className="flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>
      
      <AnimatePresence>
        {isAddingReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => setIsAddingReview(false)}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <EmptyReviews />
      )}
    </div>
  );
};

export default ProductReviews;
