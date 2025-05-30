
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormData } from './product-schema';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Upload, Link } from 'lucide-react';
import { toast } from 'sonner';
import { saveUploadedFile, getUploadedFileUrl } from '@/utils/file-storage';

interface ProductFormFieldsProps {
  form: UseFormReturn<ProductFormData>;
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ form }) => {
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

  // Get the current image URL for preview
  const getCurrentImageUrl = () => {
    const formImageUrl = form.watch('image');
    if (!formImageUrl) return '';
    
    // If it's our custom local storage URL, convert it to displayable format
    if (formImageUrl.startsWith('local-storage://')) {
      return getUploadedFileUrl(formImageUrl);
    }
    
    return formImageUrl;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  placeholder="Product description" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="fruits">Fruits</option>
                  <option value="vegetable">Vegetable</option>
                  <option value="rice">Rice</option>
                  <option value="wheat">Wheat</option>
                  <option value="onion">Onion</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="space-y-4">
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
        
        <div className="border rounded-md overflow-hidden mt-2">
          <Label className="block px-3 py-2 bg-muted/50 border-b text-xs font-medium">
            Image Preview
          </Label>
          <div className="p-2 bg-background/50">
            <AspectRatio ratio={3/2}>
              <div className="w-full h-full bg-muted/30 rounded flex items-center justify-center overflow-hidden">
                {getCurrentImageUrl() ? (
                  <img 
                    src={getCurrentImageUrl()} 
                    alt="Product preview" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Image load error:', getCurrentImageUrl());
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', getCurrentImageUrl());
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
      </div>
    </div>
  );
};

export default ProductFormFields;
