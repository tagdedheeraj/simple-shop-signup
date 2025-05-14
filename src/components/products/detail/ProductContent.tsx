
import React from 'react';
import { Product } from '@/types/product';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductFeatures from '@/components/products/ProductFeatures';
import PaymentTrustBadges from '@/components/products/PaymentTrustBadges';
import ProductQuantitySelector from './ProductQuantitySelector';
import ProductSocialShare from './ProductSocialShare';

interface ProductContentProps {
  product: Product;
  quantity: number;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  handleAddToCart: () => void;
}

const ProductContent: React.FC<ProductContentProps> = ({
  product,
  quantity,
  increaseQuantity,
  decreaseQuantity,
  handleAddToCart
}) => {
  const isOrganic = product.category === 'vegetable' || product.category === 'fruits';
  
  // Get social share functionality
  const { socialShareLinks, handleShareProduct } = ProductSocialShare({
    productName: product.name
  });

  return (
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
        />
        
        <ProductQuantitySelector
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
  );
};

export default ProductContent;
