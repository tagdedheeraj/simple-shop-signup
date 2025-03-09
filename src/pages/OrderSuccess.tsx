
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const orderId = `GH-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto text-center py-12"
      >
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-2">Order Reference</p>
          <p className="text-xl font-medium mb-4">{orderId}</p>
          
          <div className="border-t pt-4 mt-2">
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/products')}
            className="w-full"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default OrderSuccess;
