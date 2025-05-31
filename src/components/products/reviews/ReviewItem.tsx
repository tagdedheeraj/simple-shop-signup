
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Review } from '@/types/product';
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
      </CardContent>
    </Card>
  );
};

export default ReviewItem;
