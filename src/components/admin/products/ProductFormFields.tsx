
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormData } from './product-schema';
import ProductBasicFields from './ProductBasicFields';
import ProductImageUpload from './ProductImageUpload';
import ProductImagePreview from './ProductImagePreview';

interface ProductFormFieldsProps {
  form: UseFormReturn<ProductFormData>;
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProductBasicFields form={form} />
      
      <div className="space-y-4">
        <ProductImageUpload form={form} />
        <ProductImagePreview form={form} />
      </div>
    </div>
  );
};

export default ProductFormFields;
