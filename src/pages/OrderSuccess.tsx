
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocalization } from '@/contexts/LocalizationContext';

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

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();
  const orderId = `GH-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    // Retrieve customer info from localStorage
    const storedInfo = localStorage.getItem('customerInfo');
    if (storedInfo) {
      try {
        setCustomerInfo(JSON.parse(storedInfo));
        // Clear the stored info to prevent reuse
        localStorage.removeItem('customerInfo');
      } catch (e) {
        console.error('Failed to parse customer info', e);
      }
    }
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center py-12"
      >
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{t('orderSuccess')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('orderSuccessMessage')}
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{t('orderReference')}</p>
            <p className="text-xl font-medium">{orderId}</p>
          </div>
          
          {customerInfo && (
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-2">{t('shippingDetails')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('name')}</p>
                  <p>{customerInfo.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('email')}</p>
                  <p>{customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('phoneNumber')}</p>
                  <p>{customerInfo.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('address')}</p>
                  <p>{customerInfo.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('city')}, {t('state')}</p>
                  <p>{customerInfo.city}, {customerInfo.state}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('zipCode')}, {t('country')}</p>
                  <p>{customerInfo.zipCode}, {customerInfo.country}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {t('emailConfirmation')}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/products')}
            className="w-full md:w-auto"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {t('continueShopping')}
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default OrderSuccess;
