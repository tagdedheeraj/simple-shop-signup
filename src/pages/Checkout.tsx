
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import { loadPayPalScript, createPayPalOrder, capturePayPalOrder } from '@/services/paypalService';

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { t, formatPrice, currency } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  
  // Reference to PayPal button container
  const paypalButtonRef = React.useRef<HTMLDivElement>(null);
  
  // Check if cart is empty and redirect if needed
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      toast.error(t('emptyCart') || 'Your cart is empty');
    }
  }, [items, navigate, t]);

  // Initialize PayPal when customer info is complete
  useEffect(() => {
    if (isFormComplete() && !paypalLoaded) {
      initializePayPal();
    }
  }, [customerInfo, currency]);

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

  const isFormComplete = () => {
    return (
      customerInfo.fullName.trim() !== '' &&
      customerInfo.email.trim() !== '' &&
      customerInfo.phone.trim() !== '' &&
      customerInfo.address.trim() !== '' &&
      customerInfo.city.trim() !== '' &&
      customerInfo.state.trim() !== '' &&
      customerInfo.zipCode.trim() !== '' &&
      customerInfo.country.trim() !== ''
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete()) {
      toast.error(t('fillAllFields') || 'Please fill all required fields');
      return;
    }
    
    // Save customer info to localStorage for retrieval on order success
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    
    // Scroll to PayPal buttons
    if (paypalButtonRef.current) {
      paypalButtonRef.current.scrollIntoView({ behavior: 'smooth' });
      toast.success('Please proceed with payment below');
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t('checkout') || 'Checkout'}</h1>
          <Button variant="outline" size="sm" onClick={handleBackToCart}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('backToCart') || 'Back to Cart'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="text-xl font-medium mb-4">{t('customerInformation') || 'Customer Information'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullName') || 'Full Name'} *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email') || 'Email'} *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber') || 'Phone Number'} *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">{t('address') || 'Address'} *</Label>
                <Input
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t('city') || 'City'} *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">{t('state') || 'State'} *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">{t('zipCode') || 'Zip Code'} *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={customerInfo.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">{t('country') || 'Country'} *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={customerInfo.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isProcessing || !isFormComplete()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('processing') || 'Processing'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t('proceedToPayment') || 'Proceed to Payment'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="lg:col-span-1">
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
              
              {/* PayPal Button Container */}
              <div className="mt-4 min-h-[150px]">
                <div 
                  ref={paypalButtonRef}
                  className="paypal-button-container"
                ></div>
                
                {!paypalLoaded && isFormComplete() && (
                  <div className="flex justify-center items-center h-[100px]">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    <span className="ml-2 text-sm">Loading payment options...</span>
                  </div>
                )}
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
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Checkout;
