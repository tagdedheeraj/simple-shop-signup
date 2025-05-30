
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useCart } from '@/contexts/CartContext';
import { Loader2 } from 'lucide-react';
import { loadPayPalScript } from '@/services/paypal';
import { CustomerInfo } from './CustomerInfoForm';

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
  
  // Reference to PayPal button container
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  // Initialize PayPal when customer info is complete
  useEffect(() => {
    if (isFormComplete && !paypalLoaded && !scriptError) {
      initializePayPal();
    }
  }, [isFormComplete, currency]);

  const initializePayPal = async () => {
    try {
      console.log('Loading PayPal script...');
      const success = await loadPayPalScript(currency);
      
      if (!success) {
        setScriptError(true);
        return;
      }

      if (!window.paypal) {
        console.error('PayPal object not found on window');
        toast.error('PayPal failed to initialize');
        setScriptError(true);
        return;
      }

      setPaypalLoaded(true);
      renderPayPalButton();
    } catch (error) {
      console.error('Error initializing PayPal:', error);
      setScriptError(true);
      toast.error('Failed to load PayPal');
    }
  };

  const renderPayPalButton = () => {
    if (!paypalButtonRef.current || !window.paypal) return;

    // Clear previous buttons
    paypalButtonRef.current.innerHTML = '';

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay'
        },
        
        // Create order - using the correct PayPal SDK method
        createOrder: function(data: any, actions: any) {
          setIsProcessing(true);
          console.log('Creating PayPal order...');
          
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalPrice.toFixed(2),
                currency_code: currency
              },
              description: `Order from Green Haven - ${items.length} items`
            }]
          });
        },
        
        // Capture payment
        onApprove: function(data: any, actions: any) {
          console.log('Capturing PayPal payment for order:', data.orderID);
          
          return actions.order.capture().then(function(orderData: any) {
            console.log('PayPal order captured successfully:', orderData);
            
            // Save order info to localStorage
            localStorage.setItem('lastOrder', JSON.stringify({
              items,
              totalPrice,
              customerInfo,
              orderId: data.orderID,
              paymentId: orderData.id,
              date: new Date().toISOString()
            }));
            
            // Clear cart and navigate
            clearCart();
            navigate('/order-success');
            toast.success('Payment successful! Thank you for your purchase.');
            setIsProcessing(false);
          }).catch(function(error: any) {
            console.error('Error capturing PayPal payment:', error);
            toast.error('Failed to process payment');
            setIsProcessing(false);
          });
        },
        
        // Handle errors
        onError: function(err: any) {
          console.error('PayPal Error:', err);
          toast.error('Payment error occurred');
          setIsProcessing(false);
        },
        
        // Handle cancellations
        onCancel: function() {
          console.log('Payment cancelled by user');
          toast.info('Payment cancelled');
          setIsProcessing(false);
        }
      }).render(paypalButtonRef.current);
      
      console.log('PayPal button rendered successfully');
    } catch (error) {
      console.error('PayPal render error:', error);
      toast.error('Failed to load PayPal checkout');
      setScriptError(true);
    }
  };

  if (scriptError) {
    return (
      <div className="mt-4 p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm text-center">
          PayPal is currently unavailable. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 min-h-[150px] relative">
      <div 
        ref={paypalButtonRef}
        className="paypal-button-container"
      ></div>
      
      {!paypalLoaded && isFormComplete && !scriptError && (
        <div className="flex justify-center items-center h-[100px]">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="ml-2 text-sm">Loading PayPal...</span>
        </div>
      )}
      
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
          <div className="flex items-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <span className="ml-2 text-sm">Processing payment...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
