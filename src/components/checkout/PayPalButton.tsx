
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useCart } from '@/contexts/CartContext';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { loadPayPalScript, reloadPayPalScript, isPayPalReady } from '@/services/paypal';
import { PAYPAL_ERROR_MESSAGES } from '@/services/paypal/config';
import { CustomerInfo } from './CustomerInfoForm';
import { Button } from '@/components/ui/button';

interface PayPalButtonProps {
  customerInfo: CustomerInfo;
  isFormComplete: boolean;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ customerInfo, isFormComplete }) => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { currency } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Reference to PayPal button container
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const initAttempts = useRef(0);
  const maxInitAttempts = 3;

  // Initialize PayPal when form is complete
  useEffect(() => {
    if (isFormComplete && !paypalLoaded && !scriptError && !isInitializing) {
      initializePayPal();
    }
  }, [isFormComplete, currency]);

  const initializePayPal = async () => {
    if (initAttempts.current >= maxInitAttempts) {
      console.error('❌ Max initialization attempts reached');
      setScriptError(true);
      toast.error('PayPal initialize नहीं हो सका। Page refresh करके try करें।');
      return;
    }

    initAttempts.current++;
    setIsInitializing(true);
    setScriptError(false);

    try {
      console.log(`🔄 Initializing PayPal (attempt ${initAttempts.current}/${maxInitAttempts})...`);
      toast.loading('PayPal तैयार कर रहे हैं...', { id: 'paypal-loading' });
      
      const success = await loadPayPalScript(currency);
      
      if (!success) {
        throw new Error('PayPal script failed to load');
      }

      if (!isPayPalReady()) {
        throw new Error('PayPal not ready after script load');
      }

      setPaypalLoaded(true);
      toast.dismiss('paypal-loading');
      toast.success('PayPal तैयार है! 💳');
      renderPayPalButton();
    } catch (error) {
      console.error('❌ Error initializing PayPal:', error);
      toast.dismiss('paypal-loading');
      
      if (initAttempts.current < maxInitAttempts) {
        toast.error(`PayPal लोड कर रहे हैं... कोशिश ${initAttempts.current}/${maxInitAttempts}`);
        setTimeout(() => {
          setIsInitializing(false);
          initializePayPal();
        }, 3000);
      } else {
        setScriptError(true);
        toast.error(PAYPAL_ERROR_MESSAGES.SCRIPT_LOAD_FAILED);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const renderPayPalButton = () => {
    if (!paypalButtonRef.current || !isPayPalReady()) {
      console.error('❌ Cannot render PayPal button - container or PayPal not ready');
      return;
    }

    try {
      // Clear previous buttons
      paypalButtonRef.current.innerHTML = '';

      console.log('🎨 Rendering PayPal button...');
      
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          height: 50
        },
        
        // Create order
        createOrder: function(data: any, actions: any) {
          setIsProcessing(true);
          console.log('🛒 Creating PayPal order...');
          
          if (totalPrice <= 0) {
            toast.error(PAYPAL_ERROR_MESSAGES.INVALID_AMOUNT);
            setIsProcessing(false);
            return Promise.reject('Invalid amount');
          }
          
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalPrice.toFixed(2),
                currency_code: currency
              },
              description: `Lakshmikrupa Agriculture - ${items.length} items`,
              custom_id: `order-${Date.now()}`
            }],
            application_context: {
              brand_name: 'Lakshmikrupa Agriculture',
              locale: 'en-IN',
              user_action: 'PAY_NOW'
            }
          }).catch((error: any) => {
            console.error('❌ Error creating order:', error);
            toast.error(PAYPAL_ERROR_MESSAGES.ORDER_CREATION_FAILED);
            setIsProcessing(false);
            throw error;
          });
        },
        
        // Capture payment
        onApprove: function(data: any, actions: any) {
          console.log('✅ Payment approved, capturing order:', data.orderID);
          
          return actions.order.capture().then(function(orderData: any) {
            console.log('✅ PayPal order captured successfully:', orderData);
            
            // Verify payment status
            if (orderData.status !== 'COMPLETED') {
              throw new Error('Payment not completed');
            }
            
            // Save order info to localStorage
            const orderInfo = {
              items,
              totalPrice,
              customerInfo,
              orderId: data.orderID,
              paymentId: orderData.id,
              date: new Date().toISOString(),
              status: 'COMPLETED',
              currency
            };
            
            localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
            
            // Clear cart and navigate
            clearCart();
            navigate('/order-success');
            toast.success('🎉 Payment successful! आपका order confirm हो गया।');
            setIsProcessing(false);
          }).catch(function(error: any) {
            console.error('❌ Error capturing PayPal payment:', error);
            toast.error(PAYPAL_ERROR_MESSAGES.PAYMENT_FAILED);
            setIsProcessing(false);
            throw error;
          });
        },
        
        // Handle errors
        onError: function(err: any) {
          console.error('❌ PayPal Error:', err);
          toast.error(PAYPAL_ERROR_MESSAGES.PAYMENT_FAILED);
          setIsProcessing(false);
        },
        
        // Handle cancellations
        onCancel: function() {
          console.log('⚠️ Payment cancelled by user');
          toast.info(PAYPAL_ERROR_MESSAGES.PAYMENT_CANCELLED);
          setIsProcessing(false);
        }
      }).render(paypalButtonRef.current).then(() => {
        console.log('✅ PayPal button rendered successfully');
      }).catch((error: any) => {
        console.error('❌ PayPal button render error:', error);
        throw error;
      });
      
    } catch (error) {
      console.error('❌ PayPal render error:', error);
      toast.error('PayPal button render नहीं हो सका');
      setScriptError(true);
    }
  };

  const handleRetry = async () => {
    console.log('🔄 User requested PayPal retry');
    setScriptError(false);
    setPaypalLoaded(false);
    initAttempts.current = 0;
    
    toast.loading('PayPal को दोबारा load कर रहे हैं...', { id: 'paypal-retry' });
    
    try {
      const success = await reloadPayPalScript(currency);
      toast.dismiss('paypal-retry');
      
      if (success) {
        setPaypalLoaded(true);
        renderPayPalButton();
        toast.success('PayPal successfully loaded! 🎉');
      } else {
        setScriptError(true);
        toast.error('PayPal load नहीं हो सका। Internet connection check करें।');
      }
    } catch (error) {
      toast.dismiss('paypal-retry');
      setScriptError(true);
      toast.error('Error loading PayPal. कृपया बाद में try करें।');
    }
  };

  if (scriptError) {
    return (
      <div className="mt-4 p-6 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-red-600 text-sm text-center mb-4">
          PayPal payment system load नहीं हो सका। <br />
          कृपया internet connection check करें या बाद में try करें।
        </p>
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          दोबारा कोशिश करें
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 min-h-[150px] relative">
      <div 
        ref={paypalButtonRef}
        className="paypal-button-container min-h-[100px]"
      ></div>
      
      {!paypalLoaded && isFormComplete && !scriptError && (
        <div className="flex flex-col justify-center items-center h-[100px] space-y-2">
          <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
          <span className="text-sm text-gray-600">PayPal load कर रहे हैं...</span>
          <span className="text-xs text-gray-400">कृपया wait करें</span>
        </div>
      )}
      
      {isProcessing && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
            <span className="text-sm font-medium">Payment process कर रहे हैं...</span>
            <span className="text-xs text-gray-500">कृपया page को close न करें</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
