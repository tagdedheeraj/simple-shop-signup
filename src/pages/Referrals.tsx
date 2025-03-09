
import React from 'react';
import Layout from '@/components/layout/Layout';
import ReferralDashboard from '@/components/referrals/ReferralDashboard';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/contexts/AuthContext';

const Referrals: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <PageTransition>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6 text-green-800">Referral Program</h1>
          
          {user ? (
            <ReferralDashboard />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl">Please sign in to access the referral program</p>
            </div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Referrals;
