
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import CustomerInfoForm, { CustomerInfo } from '@/components/checkout/CustomerInfoForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PayPalButton from '@/components/checkout/PayPalButton';
import { Separator } from '@/components/ui/separator';

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
        <motion.div 
          className="flex items-center justify-between mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-3xl font-bold">
            {t('checkout') || 'Checkout'} 
            <span className="ml-3 text-base font-normal text-gray-500">
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          </motion.h1>
          <motion.div variants={itemVariants}>
            <Button variant="outline" size="sm" onClick={handleBackToCart}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('backToCart') || 'Back to Cart'}
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Checkout steps */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${activeSection === 'info' ? 'text-amber-700 font-medium' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${activeSection === 'info' ? 'bg-amber-100 border-2 border-amber-500' : 'bg-gray-100 border border-gray-300'}`}>
                <ShoppingBag className={`h-4 w-4 ${activeSection === 'info' ? 'text-amber-700' : 'text-gray-500'}`} />
              </div>
              <span>Customer Info</span>
            </div>
            
            <div className="w-20 h-[2px] mx-4 bg-gray-200 relative">
              {activeSection === 'payment' && (
                <motion.div 
                  className="absolute inset-0 bg-amber-500 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              )}
            </div>
            
            <div className={`flex items-center ${activeSection === 'payment' ? 'text-amber-700 font-medium' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${activeSection === 'payment' ? 'bg-amber-100 border-2 border-amber-500' : 'bg-gray-100 border border-gray-300'}`}>
                <CreditCard className={`h-4 w-4 ${activeSection === 'payment' ? 'text-amber-700' : 'text-gray-500'}`} />
              </div>
              <span>Payment</span>
            </div>
          </motion.div>
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
              
              {/* Trust badges below form */}
              <motion.div 
                className="mt-6 p-4 bg-white/50 rounded-lg border border-gray-100 flex flex-col space-y-3"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Your personal information is secure and encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-amber-600" />
                  <span>Free shipping on orders above ₹500</span>
                </div>
              </motion.div>
            </div>
            
            {/* Payment Section - Only visible when activeSection is 'payment' */}
            {activeSection === 'payment' && (
              <motion.div 
                id="payment-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">{t('payment') || 'Payment'}</h2>
                  <Button variant="ghost" size="sm" onClick={handleBackToInfo}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Edit Information
                  </Button>
                </div>
                
                <Separator className="mb-6" />
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{customerInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span>{customerInfo.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <span>{customerInfo.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Address:</span>
                    <span className="text-right">
                      {customerInfo.address}, {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}, {customerInfo.country}
                    </span>
                  </div>
                </div>
                
                <PayPalButton 
                  customerInfo={customerInfo}
                  isFormComplete={isFormComplete()}
                />
              </motion.div>
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
              
              {/* Secured by section */}
              <motion.div 
                className="mt-6 p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 shadow-sm"
                variants={itemVariants}
              >
                <h3 className="text-sm font-medium mb-3 text-gray-700">Secured By</h3>
                <div className="flex flex-wrap gap-3 items-center justify-center">
                  <img src="https://cdn.tinyurl.com/paypal-logo" alt="PayPal" className="h-6 object-contain" />
                  <img src="https://cdn.tinyurl.com/visa-logo" alt="Visa" className="h-6 object-contain" />
                  <img src="https://cdn.tinyurl.com/mastercard-logo" alt="Mastercard" className="h-6 object-contain" />
                </div>
              </motion.div>
              
              {/* Help section */}
              <motion.div 
                className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100"
                variants={itemVariants}
              >
                <h3 className="text-sm font-medium mb-2 text-amber-800">Need Help?</h3>
                <p className="text-xs text-amber-700 mb-2">
                  Having trouble with your order? Contact our support team.
                </p>
                <div className="text-xs text-amber-800 font-medium">
                  📞 +91 9876543210 | ✉️ support@example.com
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Checkout;
