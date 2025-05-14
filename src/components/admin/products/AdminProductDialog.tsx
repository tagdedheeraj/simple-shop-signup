
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { Form } from '@/components/ui/form';
import ProductFormFields from './ProductFormFields';
import { useProductForm } from './useProductForm';

interface AdminProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (data: Omit<Product, 'id'>) => Promise<boolean>;
}

const AdminProductDialog: React.FC<AdminProductDialogProps> = ({ 
  open, 
  onOpenChange, 
  product, 
  onSave 
}) => {
  const { form, isEditing, onSubmit } = useProductForm({ product, onSave, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to the product details below.'
              : 'Enter the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <ProductFormFields form={form} />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>{isEditing ? 'Update' : 'Create'} Product</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProductDialog;
