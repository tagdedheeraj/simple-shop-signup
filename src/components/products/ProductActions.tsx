
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { toast } from 'sonner';

interface ProductActionsProps {
  product: Product;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLocalization();
  
  const handleAddToCart = () => {
    try {
      console.log('Adding product to cart:', product);
      addToCart(product, 1);
      toast.success(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };
  
  return (
    <div className="px-4 pb-4 mt-1 flex items-center justify-between">
      <Button 
        size="sm" 
        variant="outline"
        className="rounded-full"
        asChild
      >
        <Link to={`/product/${product.id}`}>
          <Eye className="h-4 w-4 mr-1" />
          {t('details')}
        </Link>
      </Button>
      
      <Button 
        size="sm" 
        className="rounded-full"
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
      >
        <ShoppingCart className="h-4 w-4 mr-1" />
        {product.stock <= 0 ? 'Out of Stock' : t('add')}
      </Button>
    </div>
  );
};

export default ProductActions;
