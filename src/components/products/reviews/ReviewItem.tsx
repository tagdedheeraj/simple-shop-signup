
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Review } from '@/types/product';
import { motion } from 'framer-motion';
import StarRating from './StarRating';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{review.userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
            </span>
          </div>
          <div className="flex mt-1">
            <StarRating rating={review.rating} />
          </div>
        </div>
        <p className="text-sm mt-2">{review.comment}</p>
        
        {/* Review Photos Display */}
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
  );
};

export default ReviewItem;
