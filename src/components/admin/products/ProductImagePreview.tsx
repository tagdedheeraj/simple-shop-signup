
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormData } from './product-schema';
import { getUploadedFileUrl } from '@/utils/file-storage';

interface ProductImagePreviewProps {
  form: UseFormReturn<ProductFormData>;
}

const ProductImagePreview: React.FC<ProductImagePreviewProps> = ({ form }) => {
  const [displayUrl, setDisplayUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Get the current image URL for preview
  const formImageUrl = form.watch('image');

  useEffect(() => {
    const updateDisplayUrl = async () => {
      if (!formImageUrl) {
        setDisplayUrl('');
        return;
      }

      // If it's our custom local storage URL, convert it to displayable format
      if (formImageUrl.startsWith('local-storage://') || formImageUrl.startsWith('firebase-storage://')) {
        setIsLoading(true);
        try {
          const resolvedUrl = await getUploadedFileUrl(formImageUrl);
          setDisplayUrl(resolvedUrl);
        } catch (error) {
          console.error('Error resolving image URL:', error);
          setDisplayUrl('');
        } finally {
          setIsLoading(false);
        }
      } else {
        setDisplayUrl(formImageUrl);
      }
    };

    updateDisplayUrl();
  }, [formImageUrl]);

  return (
    <div className="border rounded-md overflow-hidden mt-2">
      <Label className="block px-3 py-2 bg-muted/50 border-b text-xs font-medium">
        Image Preview
      </Label>
      <div className="p-2 bg-background/50">
        <AspectRatio ratio={3/2}>
          <div className="w-full h-full bg-muted/30 rounded flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading image...
              </div>
            ) : displayUrl ? (
              <img 
                src={displayUrl} 
                alt="Product preview" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image load error:', displayUrl);
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', displayUrl);
                }}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No image provided
              </div>
            )}
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export default ProductImagePreview;
