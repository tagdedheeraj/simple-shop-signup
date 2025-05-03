import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useCart } from '@/contexts/CartContext';
import { Loader2 } from 'lucide-react';
import { loadPayPalScript, createPayPalOrder, capturePayPalOrder } from '@/services/paypal';
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
  
  // Reference to PayPal button container
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  // Initialize PayPal when customer info is complete
  useEffect(() => {
    if (isFormComplete && !paypalLoaded) {
      initializePayPal();
    }
  }, [customerInfo, currency, isFormComplete]);

  const initializePayPal = async () => {
    const success = await loadPayPalScript(currency);
    if (success) {
      setPaypalLoaded(true);
      
      if (!window.paypal) {
        toast.error('PayPal failed to initialize');
        return;
      }

      // Clear previous buttons if they exist
      if (paypalButtonRef.current) {
        paypalButtonRef.current.innerHTML = '';
      }

      try {
        // Render PayPal buttons
        window.paypal.Buttons({
          fundingSource: window.paypal.FUNDING.PAYPAL,
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay'
          },
          
          // Create order
          createOrder: async () => {
            setIsProcessing(true);
            try {
              const itemsForPayPal = items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
              }));

              const orderId = await createPayPalOrder({
                orderId: `ORD-${Date.now()}`,
                totalAmount: totalPrice,
                currency,
                items: itemsForPayPal,
                customerInfo
              });
              
              return orderId;
            } catch (error) {
              console.error('Error creating PayPal order:', error);
              toast.error('Failed to create PayPal order');
              setIsProcessing(false);
              throw error;
            }
          },
          
          // Capture payment
          onApprove: async (data: any, actions: any) => {
            try {
              const success = await capturePayPalOrder(data.orderID);
              if (success) {
                // Save order info to localStorage
                localStorage.setItem('lastOrder', JSON.stringify({
                  items,
                  totalPrice,
                  customerInfo,
                  orderId: data.orderID,
                  paymentId: data.paymentID,
                  date: new Date().toISOString()
                }));
                
                // Clear cart
                clearCart();
                
                // Redirect to success page
                navigate('/order-success');
                toast.success('Payment successful! Thank you for your purchase.');
              }
            } catch (error) {
              console.error('Error capturing PayPal payment:', error);
              toast.error('Failed to process payment');
            } finally {
              setIsProcessing(false);
            }
          },
          
          // Handle errors
          onError: (err: any) => {
            console.error('PayPal Error:', err);
            toast.error('Payment error occurred');
            setIsProcessing(false);
          },
          
          // Handle cancellations
          onCancel: () => {
            toast.info('Payment cancelled');
            setIsProcessing(false);
          }
        }).render(paypalButtonRef.current);
      } catch (error) {
        console.error('PayPal render error:', error);
        toast.error('Failed to load PayPal checkout');
      }
    }
  };

  return (
    <div className="mt-4 min-h-[150px]">
      <div 
        ref={paypalButtonRef}
        className="paypal-button-container"
      ></div>
      
      {!paypalLoaded && isFormComplete && (
        <div className="flex justify-center items-center h-[100px]">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="ml-2 text-sm">Loading payment options...</span>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
