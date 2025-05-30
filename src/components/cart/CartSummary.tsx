
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { toast } from 'sonner';

interface CartSummaryProps {
  customerInfo?: any;
  paypalButtonRef?: React.RefObject<HTMLDivElement>;
  paypalLoaded: boolean;
  isProcessing: boolean;
  onLoadPayPal: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  customerInfo, 
  paypalButtonRef, 
  paypalLoaded, 
  isProcessing, 
  onLoadPayPal 
}) => {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();
  const { t, formatPrice, currency } = useLocalization();

  const handleCheckout = () => {
    if (totalItems === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Navigate to checkout page to collect customer information
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-medium mb-4">{t('orderSummary') || 'Order Summary'}</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('subtotal') || 'Subtotal'} ({totalItems} items)</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('shipping') || 'Shipping'}</span>
          <span>{t('free') || 'Free'}</span>
        </div>
        <div className="border-t pt-3 mt-3 flex justify-between font-medium">
          <span>{t('total') || 'Total'}</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>
      
      {/* PayPal Button Container */}
      {customerInfo ? (
        <div 
          ref={paypalButtonRef} 
          className={`w-full mb-4 ${paypalLoaded ? 'block' : 'hidden'}`}
        ></div>
      ) : null}
      
      {/* Proceed to Checkout Button */}
      {!customerInfo && (
        <Button 
          className="w-full mb-4"
          onClick={handleCheckout}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {t('proceedToCheckout') || 'Proceed to Checkout'}
        </Button>
      )}
      
      {/* PayPal Fallback Button */}
      {customerInfo && !paypalLoaded && (
        <Button 
          className="w-full mb-4"
          onClick={onLoadPayPal}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('processing') || 'Processing'}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {t('checkoutPaypal') || 'Checkout with PayPal'}
            </>
          )}
        </Button>
      )}
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/products')}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          {t('continueShop') || 'Continue Shopping'}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Secure PayPal Payment Gateway
      </p>
    </div>
  );
};

export default CartSummary;
