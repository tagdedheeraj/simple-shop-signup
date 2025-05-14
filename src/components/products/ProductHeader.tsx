
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ProductHeaderProps {
  refreshing: boolean;
  handleRefresh: () => Promise<void>;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ refreshing, handleRefresh }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <p className="text-muted-foreground">
          Browse our selection of fresh, quality products shipped worldwide
        </p>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRefresh}
        disabled={refreshing}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        {refreshing ? 'Refreshing...' : 'Refresh Products'}
      </Button>
    </div>
  );
};

export default ProductHeader;
