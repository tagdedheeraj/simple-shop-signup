
import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { Loader2, Search } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading = false }) => {
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading products...</p>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-foreground">No products found</p>
        <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
