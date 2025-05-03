
import React from 'react';
import { Review } from '@/types/product';
import StarRating from './StarRating';

interface ReviewStatsProps {
  reviews: Review[];
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews }) => {
  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="flex items-center">
      <div className="flex mr-2">
        <StarRating rating={averageRating} />
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
  );
};

export default ReviewStats;
