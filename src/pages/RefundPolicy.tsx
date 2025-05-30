
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RefundPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Return & Refund Policy</h2>
              <p className="text-gray-600 mb-4">
                At GlobalHarvest, we are committed to providing you with the highest quality agricultural products. 
                If you are not completely satisfied with your purchase, we offer a comprehensive return and refund policy.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Eligibility for Returns</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Products must be returned within 7 days of delivery</li>
                <li>Items must be in original condition and packaging</li>
                <li>Perishable items must be reported within 24 hours of delivery</li>
                <li>Proof of purchase is required</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Refund Process</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Refunds will be processed within 5-7 business days</li>
                <li>Refunds will be credited to the original payment method</li>
                <li>Shipping charges are non-refundable unless the return is due to our error</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-600">
                For any questions regarding returns or refunds, please contact our customer service team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RefundPolicy;
