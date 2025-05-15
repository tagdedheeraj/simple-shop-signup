
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import AdminProductDialog from './AdminProductDialog';
import { useProductOperations } from './hooks/useProductOperations';
import ProductsHeader from './components/ProductsHeader';
import ProductsToolbar from './components/ProductsToolbar';
import ProductsTable from './components/ProductsTable';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const {
    products,
    loading,
    refreshing,
    fetchProducts,
    handleRefresh,
    handleSaveProduct,
    handleDeleteProduct,
    resetDeletedProducts
  } = useProductOperations();

  useEffect(() => {
    fetchProducts();
    
    // On component mount, invalidate the product queries to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
  }, [fetchProducts, queryClient]);

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleNewProduct = () => {
    setCurrentProduct(null);
    setDialogOpen(true);
  };

  const handleSaveProductDialog = async (productData: Omit<Product, 'id'>) => {
    return handleSaveProduct(productData, currentProduct?.id || null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ProductsHeader onNewProduct={handleNewProduct} />
      
      <div className="flex justify-between items-center">
        <ProductsToolbar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
        
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={resetDeletedProducts}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Reset Deleted Products
        </Button>
      </div>

      <ProductsTable 
        products={filteredProducts}
        loading={loading}
        filteredProducts={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <AdminProductDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        product={currentProduct}
        onSave={handleSaveProductDialog}
      />
    </div>
  );
};

export default AdminProducts;
