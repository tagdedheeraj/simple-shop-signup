
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string, photos?: string[]) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

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
      await onSubmit(rating, comment, photos.length > 0 ? photos : undefined);
    } catch (error) {
      // Error handling is done in the parent component
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

  return (
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
              onClick={onCancel}
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
  );
};

export default ReviewForm;
