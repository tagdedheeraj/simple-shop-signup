
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getProductById, addReview } from '@/services/product';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ChevronLeft } from 'lucide-react';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import { toast } from 'sonner';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductFeatures from '@/components/products/ProductFeatures';
import PaymentTrustBadges from '@/components/products/PaymentTrustBadges';
import CustomerTestimonials from '@/components/products/CustomerTestimonials';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const data = await getProductById(productId);
        if (data) {
          setProduct(data);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddReview = async (rating: number, comment: string, photos?: string[]) => {
    if (!product || !user) return;
    
    try {
      await addReview(product.id, {
        userId: user.id,
        userName: user.name,
        rating,
        comment,
        photos
      });
      
      const updatedProduct = await getProductById(product.id);
      if (updatedProduct) {
        setProduct(updatedProduct);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
      throw error;
    }
  };

  const handleShareProduct = () => {
    if (!product) return;
    
    // Get the current URL to share
    const shareUrl = window.location.href;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: shareUrl,
      })
        .then(() => toast.success('Product shared successfully'))
        .catch((error) => console.error('Error sharing product:', error));
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Product link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  // Social share links
  const socialShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product?.name || 'Check out this product!')}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${product?.name}: ${window.location.href}`)}`,
  };

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

  const isOrganic = product.category === 'vegetable' || product.category === 'fruits';

  return (
    <Layout>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/products')}
          className="group"
        >
          <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery 
          productId={product.id}
          image={product.image}
          name={product.name}
          category={product.category}
          isOrganic={isOrganic}
          handleShareProduct={handleShareProduct}
          socialShareLinks={socialShareLinks}
        />
        
        <div className="flex flex-col space-y-6">
          <ProductInfo 
            product={product}
            quantity={quantity}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            handleAddToCart={handleAddToCart}
          />
          
          <ProductFeatures />
          
          <PaymentTrustBadges />
        </div>
      </div>
      
      <CustomerTestimonials productName={product.name} />
      
      <div className="mt-12">
        <ProductReviews 
          productId={product.id}
          reviews={product.reviews || []} 
          onAddReview={handleAddReview}
        />
      </div>

      <RelatedProducts productId={product.id} />
    </Layout>
  );
};

export default ProductDetail;
