
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CustomerTestimonialsProps {
  productName: string;
}

const CustomerTestimonials: React.FC<CustomerTestimonialsProps> = ({ productName }) => {
  return (
    <div className="mt-10 bg-gray-50 rounded-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Why Customers Love {productName}</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardContent className="p-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm mt-3">"This product exceeded my expectations! The quality is exceptional and the delivery was super fast."</p>
            <p className="text-xs font-medium mt-3">- Sarah Johnson</p>
          </CardContent>
        </Card>
        
        <Card className="md:w-1/3">
          <CardContent className="p-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm mt-3">"I've been using this for months now and it's consistently great. Will definitely buy again!"</p>
            <p className="text-xs font-medium mt-3">- Michael Chen</p>
          </CardContent>
        </Card>
        
        <Card className="md:w-1/3">
          <CardContent className="p-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm mt-3">"The attention to detail and quality packaging made the whole experience premium. Highly recommend!"</p>
            <p className="text-xs font-medium mt-3">- Priya Sharma</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerTestimonials;
