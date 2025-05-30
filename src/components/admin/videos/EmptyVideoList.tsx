
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyVideoList: React.FC = () => {
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <h3 className="text-lg font-semibold mb-2">कोई videos नहीं हैं</h3>
        <p className="text-gray-600">अपना पहला video add करने के लिए ऊपर form भरें</p>
      </CardContent>
    </Card>
  );
};

export default EmptyVideoList;
