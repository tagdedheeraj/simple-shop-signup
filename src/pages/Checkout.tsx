
import React, { useState } from 'react';
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
import { loadPayPalScript } from '@/services/paypalService';

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
  const { items, totalPrice } = useCart();
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
  
  // Check if cart is empty and redirect if needed
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      toast.error(t('emptyCart'));
    }
  }, [items, navigate, t]);

  // Initialize PayPal when customer info is complete
  React.useEffect(() => {
    const initPayPal = async () => {
      if (isFormComplete()) {
        const success = await loadPayPalScript(currency);
        if (success) {
          setPaypalLoaded(true);
        }
      }
    };

    if (!paypalLoaded) {
      initPayPal();
    }
  }, [customerInfo, currency, paypalLoaded]);

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
      toast.error(t('fillAllFields'));
      return;
    }
    
    // Save customer info to localStorage for retrieval on order success
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    
    // Trigger PayPal checkout
    const paypalButtons = document.querySelector('.paypal-buttons');
    if (paypalButtons) {
      (paypalButtons as HTMLElement).click();
    } else {
      // If PayPal hasn't loaded yet, proceed to cart for fallback payment
      navigate('/cart', { state: { customerInfo } });
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
          <h1 className="text-3xl font-bold">{t('checkout')}</h1>
          <Button variant="outline" size="sm" onClick={handleBackToCart}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('backToCart')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="text-xl font-medium mb-4">{t('customerInformation')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullName')} *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')} *</Label>
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
                <Label htmlFor="phone">{t('phoneNumber')} *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">{t('address')} *</Label>
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
                  <Label htmlFor="city">{t('city')} *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">{t('state')} *</Label>
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
                  <Label htmlFor="zipCode">{t('zipCode')} *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={customerInfo.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">{t('country')} *</Label>
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
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t('proceedToPayment')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium mb-4">{t('orderSummary')}</h2>
              
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
                  <span className="text-muted-foreground">{t('shipping')}</span>
                  <span>{t('free')}</span>
                </div>
                
                <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                  <span>{t('total')}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <div className="hidden paypal-button-container">
                {/* PayPal buttons will be rendered here by the Cart page */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Checkout;
