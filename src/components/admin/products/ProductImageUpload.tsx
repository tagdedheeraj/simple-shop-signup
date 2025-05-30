
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Link } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormData } from './product-schema';
import { toast } from 'sonner';
import { saveUploadedFile } from '@/utils/file-storage';

interface ProductImageUploadProps {
  form: UseFormReturn<ProductFormData>;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ form }) => {
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      console.log('Uploading file:', file.name);
      
      // Save the file permanently using our storage system
      const permanentUrl = await saveUploadedFile(file);
      
      console.log('File saved with URL:', permanentUrl);
      
      // Set the form value with the permanent URL
      form.setValue('image', permanentUrl);
      
      // Force form to re-render and show the updated image
      form.trigger('image');
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <FormLabel>Product Image</FormLabel>
      
      {/* Upload Method Toggle */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
          className="flex items-center gap-2"
        >
          <Link className="h-4 w-4" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('upload')}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      {uploadMethod === 'url' ? (
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="cursor-pointer"
          />
          {uploading && (
            <p className="text-sm text-muted-foreground">Uploading image...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
