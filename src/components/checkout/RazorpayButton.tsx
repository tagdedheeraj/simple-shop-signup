
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { loadRazorpayScript, createRazorpayOrder, getRazorpayOptions } from '@/services/razorpay';
import { CustomerInfo } from './CustomerInfoForm';

interface RazorpayButtonProps {
  customerInfo: CustomerInfo;
  isFormComplete: boolean;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ 
  customerInfo, 
  isFormComplete 
}) => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { formatPrice } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRazorpayPayment = async () => {
    if (!isFormComplete) {
      toast.error('कृपया पहले सभी जानकारी भरें');
      return;
    }

    if (totalPrice <= 0) {
      toast.error('Invalid order amount');
      return;
    }

    setIsLoading(true);
    toast.loading('Razorpay loading कर रहे हैं...', { id: 'razorpay-loading' });

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order
      const order = await createRazorpayOrder(totalPrice, 'INR');
      
      toast.dismiss('razorpay-loading');
      setIsLoading(false);
      setIsProcessing(true);

      // Success handler
      const handleSuccess = (response: any) => {
        console.log('✅ Razorpay payment successful:', response);
        
        // Save order info
        const orderInfo = {
          items,
          totalPrice,
          customerInfo,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          date: new Date().toISOString(),
          status: 'COMPLETED',
          paymentMethod: 'razorpay',
          currency: 'INR'
        };
        
        localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
        
        // Clear cart and navigate
        clearCart();
        navigate('/order-success');
        toast.success('🎉 Payment successful! आपका order confirm हो गया।');
        setIsProcessing(false);
      };

      // Failure handler
      const handleFailure = (error: any) => {
        console.error('❌ Razorpay payment failed:', error);
        toast.error('Payment failed। कृपया दोबारा try करें।');
        setIsProcessing(false);
      };

      // Get Razorpay options
      const options = getRazorpayOptions(order, customerInfo, handleSuccess, handleFailure);
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('❌ Error initializing Razorpay:', error);
      toast.dismiss('razorpay-loading');
      toast.error('Razorpay initialize नहीं हो सका। कृपया बाद में try करें।');
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Test Mode Notice */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-orange-700 text-sm">
          <Smartphone className="h-4 w-4" />
          <span className="font-medium">Test Mode Active</span>
        </div>
        <p className="text-xs text-orange-600 mt-1">
          Use test card: 4111 1111 1111 1111, Expiry: 12/25, CVV: 123
        </p>
      </div>

      {/* Razorpay Payment Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
        onClick={handleRazorpayPayment}
        disabled={!isFormComplete || isLoading || isProcessing}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading Razorpay...
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay {formatPrice(totalPrice)} with Razorpay
          </>
        )}
      </Button>

      {/* Payment Info */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Razorpay
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supports Cards, UPI, Net Banking & Wallets
        </p>
      </div>
    </div>
  );
};

export default RazorpayButton;
