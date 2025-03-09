
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface ReferralContextType {
  referralCode: string;
  referralLink: string;
  referrals: Referral[];
  totalEarnings: number;
  generateReferralCode: () => void;
  applyReferralCode: (code: string) => boolean;
  recordPurchase: (amount: number, referredUserId: string) => void;
}

interface Referral {
  id: string;
  referredUserId: string;
  referredUserName: string;
  date: string;
  purchases: {
    id: string;
    amount: number;
    commission: number;
    date: string;
  }[];
  totalCommission: number;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  // Load referral data on component mount and when user changes
  useEffect(() => {
    if (user) {
      // Load user's referral code
      const storedReferralCode = localStorage.getItem(`referralCode_${user.id}`);
      if (storedReferralCode) {
        setReferralCode(storedReferralCode);
      } else {
        generateReferralCode();
      }
      
      // Load user's referrals
      const storedReferrals = localStorage.getItem(`referrals_${user.id}`);
      if (storedReferrals) {
        const parsedReferrals = JSON.parse(storedReferrals);
        setReferrals(parsedReferrals);
        
        // Calculate total earnings
        const total = parsedReferrals.reduce(
          (sum: number, referral: Referral) => sum + referral.totalCommission, 
          0
        );
        setTotalEarnings(total);
      }
    } else {
      // Reset state when user logs out
      setReferralCode('');
      setReferrals([]);
      setTotalEarnings(0);
    }
  }, [user]);

  const generateReferralCode = () => {
    if (!user) return;
    
    // Generate a random code
    const newCode = `${user.name.substring(0, 3).toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}`;
    setReferralCode(newCode);
    localStorage.setItem(`referralCode_${user.id}`, newCode);
    toast.success('New referral code generated');
  };

  const applyReferralCode = (code: string): boolean => {
    if (!user) return false;
    
    // Prevent self-referral
    if (code === referralCode) {
      toast.error('You cannot use your own referral code');
      return false;
    }
    
    // Check if the code exists
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let referrerUser = null;
    
    for (const potentialReferrer of allUsers) {
      const referrerCode = localStorage.getItem(`referralCode_${potentialReferrer.id}`);
      if (referrerCode === code) {
        referrerUser = potentialReferrer;
        break;
      }
    }
    
    if (!referrerUser) {
      toast.error('Invalid referral code');
      return false;
    }
    
    // Save the referral relationship
    localStorage.setItem(`referredBy_${user.id}`, referrerUser.id);
    toast.success('Referral code applied successfully');
    return true;
  };

  const recordPurchase = (amount: number, referredUserId: string) => {
    if (!user) return;
    
    // Load referrer's referrals
    const storedReferrals = localStorage.getItem(`referrals_${user.id}`) || '[]';
    const currentReferrals: Referral[] = JSON.parse(storedReferrals);
    
    // Find referral for this user
    const referredUser = JSON.parse(localStorage.getItem('users') || '[]')
      .find((u: any) => u.id === referredUserId);
    
    if (!referredUser) return;
    
    let referral = currentReferrals.find(r => r.referredUserId === referredUserId);
    const commission = amount * 0.05; // 5% commission
    
    if (referral) {
      // Add purchase to existing referral
      referral.purchases.push({
        id: crypto.randomUUID(),
        amount,
        commission,
        date: new Date().toISOString()
      });
      referral.totalCommission += commission;
    } else {
      // Create new referral entry
      referral = {
        id: crypto.randomUUID(),
        referredUserId,
        referredUserName: referredUser.name,
        date: new Date().toISOString(),
        purchases: [{
          id: crypto.randomUUID(),
          amount,
          commission,
          date: new Date().toISOString()
        }],
        totalCommission: commission
      };
      currentReferrals.push(referral);
    }
    
    // Update referrals in localStorage
    localStorage.setItem(`referrals_${user.id}`, JSON.stringify(currentReferrals));
    setReferrals(currentReferrals);
    
    // Update total earnings
    const newTotal = currentReferrals.reduce(
      (sum, ref) => sum + ref.totalCommission, 
      0
    );
    setTotalEarnings(newTotal);
    
    toast.success(`You earned ₹${commission.toFixed(2)} commission!`);
  };

  return (
    <ReferralContext.Provider value={{
      referralCode,
      referralLink,
      referrals,
      totalEarnings,
      generateReferralCode,
      applyReferralCode,
      recordPurchase
    }}>
      {children}
    </ReferralContext.Provider>
  );
};
