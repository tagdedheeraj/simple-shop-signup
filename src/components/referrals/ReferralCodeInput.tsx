import React, { useState, useEffect } from 'react';
import { useReferral } from '@/contexts/ReferralContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const ReferralCodeInput: React.FC = () => {
  const [code, setCode] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const { applyReferralCode } = useReferral();
  const { user } = useAuth();

  // Check URL for referral code on component mount
  useEffect(() => {
    if (!user) return;
    
    // Check if user was already referred
    const wasReferred = localStorage.getItem(`referredBy_${user.id}`);
    if (wasReferred) {
      setIsApplied(true);
      return;
    }
    
    // Check URL for referral code
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setCode(refCode);
    }
  }, [user]);

  const handleApplyCode = () => {
    if (!code.trim()) {
      toast.error('Please enter a referral code');
      return;
    }
    
    const success = applyReferralCode(code);
    if (success) {
      setIsApplied(true);
    }
  };

  // If already applied, don't show the input
  if (isApplied) {
    return null;
  }

  return (
    <Card className="border-green-100 bg-green-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-green-800">Got a referral code?</CardTitle>
        <CardDescription>
          Enter a friend's referral code to help them earn commission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label htmlFor="referralCode" className="mb-1 block">Referral Code</Label>
            <Input
              id="referralCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code here"
              className="bg-white"
            />
          </div>
          <Button 
            onClick={handleApplyCode}
            className="bg-green-600 hover:bg-green-700"
          >
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodeInput;
