
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';

interface ProductActionsProps {
  product: Product;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLocalization();
  
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
        onClick={() => addToCart(product)}
      >
        <ShoppingCart className="h-4 w-4 mr-1" />
        {t('add')}
      </Button>
    </div>
  );
};

export default ProductActions;
