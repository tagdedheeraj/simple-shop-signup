
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 'sm',
  interactive = false,
  onRatingChange
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8'
  };
  
  const sizeClass = starSizes[size];
  
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const displayRating = interactive ? (hoverRating || rating) : rating;
    
    for (let i = 1; i <= 5; i++) {
      const filled = i <= displayRating;
      const halfFilled = !filled && interactive === false && i === fullStars + 1 && hasHalfStar;
      
      if (halfFilled) {
        stars.push(
          <StarHalf 
            key={i} 
            className={`${sizeClass} fill-yellow-400 text-yellow-400`}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`${sizeClass} ${
              filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(i)}
            onMouseEnter={() => interactive && setHoverRating(i)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        );
      }
    }
    
    return stars;
  };
  
  return <div className="flex">{renderStars()}</div>;
};

export default StarRating;
