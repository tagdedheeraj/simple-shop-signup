
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import CustomerInfoForm, { CustomerInfo } from '@/components/checkout/CustomerInfoForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentTrustBadges from '@/components/products/PaymentTrustBadges';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import TrustBadges from '@/components/checkout/TrustBadges';
import PaymentSection from '@/components/checkout/PaymentSection';
import HelpSection from '@/components/checkout/HelpSection';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems } = useCart();
  const { t } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSection, setActiveSection] = useState<'info' | 'payment'>('info');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    // Try to load saved customer info from localStorage
    const savedInfo = localStorage.getItem('savedCustomerInfo');
    if (savedInfo) {
      try {
        return JSON.parse(savedInfo);
      } catch (e) {
        console.error('Failed to parse saved customer info', e);
      }
    }
    return {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    };
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
    // and for future checkouts
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    localStorage.setItem('savedCustomerInfo', JSON.stringify(customerInfo));
    
    // Move to payment section
    setActiveSection('payment');
    
    // Scroll to PayPal buttons
    setTimeout(() => {
      const paymentSection = document.getElementById('payment-section');
      if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth' });
      }
      toast.success('Please proceed with payment below');
    }, 100);
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleBackToInfo = () => {
    setActiveSection('info');
    // Scroll to info section
    const infoSection = document.getElementById('info-section');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto pb-16"
      >
        <CheckoutHeader 
          totalItems={totalItems}
          onBackToCart={handleBackToCart}
        />
        
        {/* Checkout steps */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <CheckoutSteps activeSection={activeSection} />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {/* Customer Info Section */}
            <div 
              id="info-section" 
              className={`transition-opacity duration-300 ${activeSection === 'payment' ? 'opacity-50' : 'opacity-100'}`}
            >
              <CustomerInfoForm
                customerInfo={customerInfo}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isProcessing={isProcessing}
                isFormComplete={isFormComplete}
              />
              
              <TrustBadges />
            </div>
            
            {/* Payment Section - Only visible when activeSection is 'payment' */}
            {activeSection === 'payment' && (
              <PaymentSection 
                customerInfo={customerInfo}
                isFormComplete={isFormComplete()}
                onBackToInfo={handleBackToInfo}
              />
            )}
          </motion.div>
          
          <motion.div 
            className="lg:col-span-1"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="sticky top-24">
              <OrderSummary />
              
              {/* Payment Trust Badges Component */}
              <motion.div 
                className="mt-6"
                variants={itemVariants}
              >
                <PaymentTrustBadges />
              </motion.div>
              
              <HelpSection />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Checkout;
