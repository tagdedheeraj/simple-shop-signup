
import React from 'react';
import { toast } from 'sonner';

interface ProductSocialShareProps {
  productName: string;
}

const ProductSocialShare: React.FC<ProductSocialShareProps> = ({ productName }) => {
  // Social share links
  const socialShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(productName || 'Check out this product!')}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${productName}: ${window.location.href}`)}`,
  };

  const handleShareProduct = () => {
    // Get the current URL to share
    const shareUrl = window.location.href;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Check out this product: ${productName}`,
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

  return {
    socialShareLinks,
    handleShareProduct
  };
};

export default ProductSocialShare;
