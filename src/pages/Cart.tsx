
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CartList from '@/components/cart/CartList';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCartMessage from '@/components/cart/EmptyCartMessage';
import { usePayPalButton } from '@/hooks/usePayPalButton';

const Cart: React.FC = () => {
  const { items, clearCart } = useCart();
  const { t } = useLocalization();
  const location = useLocation();
  const customerInfo = location.state?.customerInfo;
  
  const {
    paypalButtonRef,
    paypalLoaded,
    isProcessing,
    handleLoadPayPal
  } = usePayPalButton(customerInfo);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t('cart')}</h1>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart}>
              <Trash2 className="h-4 w-4 mr-1" />
              {t('clear')}
            </Button>
          )}
        </div>
        
        {items.length === 0 ? (
          <EmptyCartMessage />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <CartList />
            </div>
            
            <div className="lg:col-span-1">
              <CartSummary
                customerInfo={customerInfo}
                paypalButtonRef={paypalButtonRef}
                paypalLoaded={paypalLoaded}
                isProcessing={isProcessing}
                onLoadPayPal={handleLoadPayPal}
              />
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Cart;
