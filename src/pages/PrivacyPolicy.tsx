
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Name and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information</li>
                <li>Order history and preferences</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your account or orders</li>
                <li>Improve our products and services</li>
                <li>Send you promotional communications (with your consent)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Security</h3>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
