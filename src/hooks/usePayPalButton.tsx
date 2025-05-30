
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { loadPayPalScript } from '@/services/paypal';

interface UsePayPalButtonResult {
  paypalButtonRef: React.RefObject<HTMLDivElement>;
  paypalLoaded: boolean;
  isProcessing: boolean;
  handleLoadPayPal: () => void;
}

export const usePayPalButton = (customerInfo?: any): UsePayPalButtonResult => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { currency } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  // Effect to load PayPal script when items or currency changes
  useEffect(() => {
    const initPayPal = async () => {
      const success = await loadPayPalScript(currency);
      if (success) {
        setPaypalLoaded(true);
      }
    };

    if (items.length > 0) {
      // Reload PayPal whenever currency changes
      setPaypalLoaded(false);
      initPayPal();
    }
  }, [items.length, currency]);

  // Effect to render PayPal button when script is loaded
  useEffect(() => {
    if (paypalLoaded && paypalButtonRef.current && window.paypal) {
      // Clear any existing buttons
      paypalButtonRef.current.innerHTML = '';
      
      // Render the PayPal button
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay'
        },
        
        // Create order - using correct PayPal SDK method
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
        onError: (err: any) => {
          console.error('PayPal error:', err);
          toast.error('PayPal encountered an error. Please try again later.');
          setIsProcessing(false);
        },
        
        // Handle cancellations
        onCancel: () => {
          console.log('Payment cancelled by user');
          toast.info('Payment cancelled');
          setIsProcessing(false);
        }
      }).render(paypalButtonRef.current);
    }
  }, [paypalLoaded, items, totalPrice, clearCart, navigate, currency, customerInfo]);

  const handleLoadPayPal = () => loadPayPalScript(currency);

  return {
    paypalButtonRef,
    paypalLoaded,
    isProcessing,
    handleLoadPayPal
  };
};
