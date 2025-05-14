
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import CustomerTestimonials from '@/components/products/CustomerTestimonials';
import ProductActions from '@/components/products/detail/ProductActions';
import ProductContent from '@/components/products/detail/ProductContent';
import { useProductDetail } from '@/components/products/detail/useProductDetail';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    product,
    loading,
    quantity,
    handleAddToCart,
    increaseQuantity,
    decreaseQuantity,
    handleAddReview
  } = useProductDetail(productId);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[600px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[600px] flex flex-col items-center justify-center">
          <p className="text-xl text-muted-foreground">Product not found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/products')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddReviewWithUser = async (rating: number, comment: string, photos?: string[]) => {
    if (!user) return;
    
    try {
      await handleAddReview(rating, comment, photos);
    } catch (error) {
      // Error handling is already in the hook
    }
  };

  return (
    <Layout>
      <ProductActions onGoBack={() => navigate('/products')} />
      
      <ProductContent 
        product={product}
        quantity={quantity}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        handleAddToCart={handleAddToCart}
      />
      
      <CustomerTestimonials productName={product.name} />
      
      <div className="mt-12">
        <ProductReviews 
          productId={product.id}
          reviews={product.reviews || []} 
          onAddReview={handleAddReviewWithUser}
        />
      </div>

      <RelatedProducts productId={product.id} />
    </Layout>
  );
};

export default ProductDetail;
