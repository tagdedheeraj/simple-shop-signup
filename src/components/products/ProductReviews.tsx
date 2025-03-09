
import React, { useState } from 'react';
import { Review } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Star, StarHalf, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ProductReviewsProps {
  productId: string;
  reviews: Review[] | undefined;
  onAddReview: (rating: number, comment: string) => Promise<void>;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId, 
  reviews = [], 
  onAddReview 
}) => {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please add a comment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onAddReview(rating, comment);
      setIsAddingReview(false);
      setRating(0);
      setComment('');
      toast.success('Review added successfully');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;
  
  const renderStarRating = (value: number) => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400 h-5 w-5" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="fill-yellow-400 text-yellow-400 h-5 w-5" />);
      } else {
        stars.push(<Star key={i} className="text-gray-300 h-5 w-5" />);
      }
    }
    
    return stars;
  };
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          <div className="flex items-center mt-1">
            <div className="flex mr-2">
              {renderStarRating(averageRating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {reviews.length ? (
                <>
                  {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </>
              ) : (
                'No reviews yet'
              )}
            </span>
          </div>
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
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>
                  Share your experience with this product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-all ${
                            star <= (hoverRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium mb-2">
                      Comment
                    </label>
                    <Textarea
                      id="comment"
                      placeholder="Share details of your experience with this product..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingReview(false);
                        setRating(0);
                        setComment('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="mb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex mt-1">
                    {renderStarRating(review.rating)}
                  </div>
                </div>
                <p className="text-sm mt-2">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No reviews yet. Be the first to share your experience!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductReviews;
