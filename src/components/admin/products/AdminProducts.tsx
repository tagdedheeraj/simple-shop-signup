
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import AdminProductDialog from './AdminProductDialog';
import { useProductOperations } from './hooks/useProductOperations';
import ProductsHeader from './components/ProductsHeader';
import ProductsToolbar from './components/ProductsToolbar';
import ProductsTable from './components/ProductsTable';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { refreshFirestoreProducts } from '@/services/firebase/products/initialization';
import { toast } from 'sonner';

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [forceRefreshing, setForceRefreshing] = useState(false);
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

  const handleForceRefresh = async () => {
    try {
      setForceRefreshing(true);
      console.log('Force cleaning all products from Firebase...');
      
      const success = await refreshFirestoreProducts({ forceReset: true });
      if (success) {
        await fetchProducts();
        toast.success('All products cleared from Firebase. Only manually added products will remain.');
      } else {
        toast.error('Failed to clean products');
      }
    } catch (error) {
      console.error('Error force cleaning products:', error);
      toast.error('Failed to clean products');
    } finally {
      setForceRefreshing(false);
    }
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
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleForceRefresh}
            disabled={forceRefreshing || refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${forceRefreshing ? 'animate-spin' : ''}`} />
            Clear All Products
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={resetDeletedProducts}
            disabled={refreshing || forceRefreshing}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Reset Deleted Products
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">Product Status</h3>
        <p className="text-sm text-blue-800">
          Current products: {products.length} | Filtered: {filteredProducts.length}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Use "Clear All Products" to remove everything from Firebase. Only manually added products will remain.
        </p>
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
