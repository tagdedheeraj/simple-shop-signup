
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import { loadPayPalScript, createPayPalOrder, capturePayPalOrder } from '@/services/paypal';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { t, formatPrice, currency } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const customerInfo = location.state?.customerInfo;

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

  useEffect(() => {
    if (paypalLoaded && paypalButtonRef.current && window.paypal) {
      // Clear any existing buttons
      paypalButtonRef.current.innerHTML = '';
      
      // Render the PayPal button
      window.paypal.Buttons({
        // Set up the transaction
        createOrder: async () => {
          try {
            const orderData = {
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

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Navigate to checkout page to collect customer information
    navigate('/checkout');
  };

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
          <div className="text-center py-16 space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
            <h2 className="text-xl font-medium">{t('emptyCart')}</h2>
            <p className="text-muted-foreground">
              {t('emptyCartMessage')}
            </p>
            <Button onClick={() => navigate('/products')} className="mt-4">
              {t('browseProducts')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border-b last:border-0 border-border/50 flex items-center"
                  >
                    <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-10 text-center">{item.quantity}</span>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="ml-4 w-20 text-right">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">{t('orderSummary')}</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('subtotal')} ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('shipping')}</span>
                    <span>{t('free')}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                    <span>{t('total')}</span>
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
                    {t('proceedToCheckout')}
                  </Button>
                )}
                
                {/* PayPal Fallback Button */}
                {customerInfo && !paypalLoaded && (
                  <Button 
                    className="w-full mb-4"
                    onClick={() => loadPayPalScript(currency)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('processing')}
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t('checkoutPaypal')}
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
                    {t('continueShop')}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  {t('paypalTestMode')}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Cart;
