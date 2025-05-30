
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
      console.log('Saving product:', data);
      
      // Create a properly typed object for the onSave function
      const productData: Omit<Product, 'id'> = {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: data.category,
        image: data.image,
      };
      
      const success = await onSave(productData);
      
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    }
  };

  return {
    form,
    isEditing,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
