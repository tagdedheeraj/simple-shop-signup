
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { loadPayPalScript, createPayPalOrder, capturePayPalOrder } from '@/services/paypal';
import { PayPalOrder } from '@/services/paypal';

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
        // Set up the transaction
        createOrder: async () => {
          try {
            const orderData: PayPalOrder = {
              orderId: `ORDER-${Date.now()}`,
              totalAmount: totalPrice,
              currency: currency,
              items: items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
              }))
            };
            
            return await createPayPalOrder(orderData);
          } catch (error) {
            console.error('Failed to create order:', error);
            toast.error('Could not create PayPal order');
            throw error;
          }
        },
        
        // Finalize the transaction
        onApprove: async (data: any, actions: any) => {
          setIsProcessing(true);
          try {
            const success = await capturePayPalOrder(data.orderID);
            if (success) {
              clearCart();
              toast.success('Your order has been placed successfully!');
              navigate('/order-success');
            }
          } catch (error) {
            console.error('Error capturing PayPal order:', error);
            toast.error('There was an error processing your payment');
          } finally {
            setIsProcessing(false);
          }
        },
        
        // Handle errors
        onError: (err: any) => {
          console.error('PayPal error:', err);
          toast.error('PayPal encountered an error. Please try again later.');
          setIsProcessing(false);
        }
      }).render(paypalButtonRef.current);
    }
  }, [paypalLoaded, items, totalPrice, clearCart, navigate, currency]);

  const handleLoadPayPal = () => loadPayPalScript(currency);

  return {
    paypalButtonRef,
    paypalLoaded,
    isProcessing,
    handleLoadPayPal
  };
};
