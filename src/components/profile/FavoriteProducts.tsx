
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Product } from '@/types/product';
import { Heart, HeartOff } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Import product service to fetch products
import { getAllProducts } from '@/services/productService';

const FavoriteProducts: React.FC = () => {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  
  // Get all products then filter favorites
  const products = getAllProducts();
  const favoriteProducts = products.filter(product => 
    user?.favorites?.includes(product.id)
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          {t('favorites')}
        </CardTitle>
        <CardDescription>
          {favoriteProducts.length > 0 
            ? t('yourFavoriteProducts', { count: favoriteProducts.length }) 
            : t('noFavoriteProducts')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {favoriteProducts.length > 0 ? (
          <ProductGrid 
            products={favoriteProducts} 
          />
        ) : (
          <div className="min-h-[200px] flex flex-col items-center justify-center">
            <HeartOff className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              {t('noFavoriteProductsDescription')}
            </p>
            <Button onClick={() => navigate('/products')}>
              {t('browseProducts')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteProducts;
