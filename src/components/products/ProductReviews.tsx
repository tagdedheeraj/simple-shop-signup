
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
import { Star, StarHalf, MessageCircle, Image, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ProductReviewsProps {
  productId: string;
  reviews: Review[] | undefined;
  onAddReview: (rating: number, comment: string, photos?: string[]) => Promise<void>;
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
  const [photos, setPhotos] = useState<string[]>([]);
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
      await onAddReview(rating, comment, photos.length > 0 ? photos : undefined);
      setIsAddingReview(false);
      setRating(0);
      setComment('');
      setPhotos([]);
      toast.success('Review added successfully');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // This is a simulated photo upload function
  // In a real app, this would upload to a server/storage
  const handlePhotoUpload = () => {
    // For demonstration - we'll add some sample images
    const demoImages = [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
      "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=300&q=80",
      "https://images.unsplash.com/photo-1467019972079-a273e1bc9173?w=300&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80",
      "https://images.unsplash.com/photo-1598170845058-c2b7cd343e54?w=300&q=80"
    ];
    
    // Add a random image from our sample collection
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    
    // In a real app, we would handle file input and uploads here
    if (photos.length < 3) {
      setPhotos([...photos, randomImage]);
      toast.success("Photo added successfully!");
    } else {
      toast.error("Maximum 3 photos allowed");
    }
  };
  
  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
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
                  
                  {/* Photo Upload Section - NEW */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Add Photos (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={photo} 
                            alt={`User uploaded ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded-md border border-border"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      
                      {photos.length < 3 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-20 h-20 flex flex-col items-center justify-center border-dashed"
                          onClick={handlePhotoUpload}
                        >
                          <Upload className="h-5 w-5 mb-1" />
                          <span className="text-xs">Add Photo</span>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add up to 3 photos showing your experience with this product
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingReview(false);
                        setRating(0);
                        setComment('');
                        setPhotos([]);
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
                
                {/* Review Photos Display - NEW */}
                {review.photos && review.photos.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Image className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Photos from this review</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {review.photos.map((photo, index) => (
                        <motion.div 
                          key={index}
                          className="flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img 
                            src={photo} 
                            alt={`Review photo ${index + 1}`} 
                            className="h-20 w-20 object-cover rounded-md border border-border" 
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
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
