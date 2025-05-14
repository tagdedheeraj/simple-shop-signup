
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductsHeaderProps {
  onNewProduct: () => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onNewProduct }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your product inventory.
        </p>
      </div>
      <Button onClick={onNewProduct}>
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </Button>
    </div>
  );
};

export default ProductsHeader;
