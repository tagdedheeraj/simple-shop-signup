
import React from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useCart } from '@/contexts/CartContext';
import { ShieldCheck } from 'lucide-react';

const OrderSummary: React.FC = () => {
  const { items, totalPrice } = useCart();
  const { t, formatPrice } = useLocalization();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-medium mb-4">{t('orderSummary') || 'Order Summary'}</h2>
      
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.product.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('shipping') || 'Shipping'}</span>
          <span>{t('free') || 'Free'}</span>
        </div>
        
        <div className="border-t pt-3 mt-3 flex justify-between font-medium">
          <span>{t('total') || 'Total'}</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Payment Security Notice */}
      <div className="mt-4 text-xs text-center text-muted-foreground">
        <div className="flex items-center justify-center mb-2">
          <ShieldCheck className="h-4 w-4 text-green-600 mr-1" />
          <span>Secure Payment</span>
        </div>
        <p>All transactions are encrypted and secure. Your payment information is never stored on our servers.</p>
      </div>
    </div>
  );
};

export default OrderSummary;
