
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const EmptyReviews: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center text-muted-foreground">
        <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
        <p>No reviews yet. Be the first to share your experience!</p>
      </CardContent>
    </Card>
  );
};

export default EmptyReviews;
