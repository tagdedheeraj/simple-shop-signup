
import React from 'react';
import { 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Headphones, 
  CreditCard 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ProductFeatures: React.FC = () => {
  return (
    <>
      {/* Trust Features */}
      <div className="grid grid-cols-2 gap-4 pt-6 mt-3 border-t border-border">
        <div className="flex items-start">
          <Truck className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm">Fast Shipping</h3>
            <p className="text-xs text-muted-foreground">
              2-3 day delivery nationwide
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <RotateCcw className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm">Easy Returns</h3>
            <p className="text-xs text-muted-foreground">
              30-day money back guarantee
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <ShieldCheck className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm">Quality Guarantee</h3>
            <p className="text-xs text-muted-foreground">
              100% satisfaction promise
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Headphones className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm">24/7 Support</h3>
            <p className="text-xs text-muted-foreground">
              Live chat & phone support
            </p>
          </div>
        </div>
      </div>

      {/* Customer Support Banner */}
      <Card className="bg-green-50 border-green-100">
        <CardContent className="flex items-center p-4">
          <div className="rounded-full bg-green-100 p-2 mr-3">
            <Headphones className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Need help with this product?</h3>
            <p className="text-xs text-muted-foreground">
              Our experts are here to help you 24/7. Call us at <span className="font-medium">1-800-123-4567</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductFeatures;
