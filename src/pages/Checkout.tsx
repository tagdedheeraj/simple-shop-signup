
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CustomerInfoForm, { CustomerInfo } from '@/components/checkout/CustomerInfoForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PayPalButton from '@/components/checkout/PayPalButton';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const { t } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
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
      toast.error(t('emptyCart') || 'Your cart is empty');
    }
  }, [items, navigate, t]);

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
    const paypalButtonContainer = document.querySelector('.paypal-button-container');
    if (paypalButtonContainer) {
      paypalButtonContainer.scrollIntoView({ behavior: 'smooth' });
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
            <CustomerInfoForm
              customerInfo={customerInfo}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isProcessing={isProcessing}
              isFormComplete={isFormComplete}
            />
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary />
            <PayPalButton 
              customerInfo={customerInfo}
              isFormComplete={isFormComplete()}
            />
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Checkout;
