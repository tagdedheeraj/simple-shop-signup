
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using GlobalHarvest's services, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Use of Service</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>You must be at least 18 years old to use our services</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You will not use our service for any unlawful purposes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Product Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>We strive to display product information accurately</li>
                <li>Prices are subject to change without notice</li>
                <li>Product availability may vary</li>
                <li>We reserve the right to limit quantities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Limitation of Liability</h3>
              <p className="text-gray-600">
                GlobalHarvest shall not be liable for any direct, indirect, incidental, special, 
                or consequential damages resulting from the use or inability to use our services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TermsOfService;
