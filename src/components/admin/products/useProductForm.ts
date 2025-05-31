
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from './product-schema';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface UseProductFormProps {
  product: Product | null;
  onSave: (data: Omit<Product, 'id'>) => Promise<boolean>;
  onOpenChange: (open: boolean) => void;
}

export const useProductForm = ({ product, onSave, onOpenChange }: UseProductFormProps) => {
  const isEditing = !!product;
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      category: product?.category || 'wheat',
      image: product?.image || '',
    },
  });
  
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        image: product.image,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'wheat',
        image: '',
      });
    }
  }, [product, form]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log('Form submission started:', data);
      
      // Validate required fields
      if (!data.name?.trim()) {
        toast.error('Product name is required');
        return;
      }
      
      if (!data.description?.trim()) {
        toast.error('Product description is required');
        return;
      }
      
      if (!data.image?.trim()) {
        toast.error('Product image URL is required');
        return;
      }
      
      if (data.price <= 0) {
        toast.error('Product price must be greater than 0');
        return;
      }
      
      if (data.stock < 0) {
        toast.error('Product stock cannot be negative');
        return;
      }
      
      // Create a properly typed object for the onSave function
      const productData: Omit<Product, 'id'> = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.category,
        image: data.image.trim(),
      };
      
      console.log('Saving product data:', productData);
      
      const success = await onSave(productData);
      
      if (success) {
        console.log('Product saved successfully');
        toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
        onOpenChange(false);
      } else {
        console.error('Failed to save product');
        toast.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to save product');
    }
  };

  return {
    form,
    isEditing,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
