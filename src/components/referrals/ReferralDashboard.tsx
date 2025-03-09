
import React, { useState } from 'react';
import { useReferral } from '@/contexts/ReferralContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Copy, 
  RefreshCcw, 
  Share2,
  UserPlus 
} from 'lucide-react';
import { toast } from 'sonner';

const ReferralDashboard: React.FC = () => {
  const { 
    referralCode, 
    referralLink, 
    referrals, 
    totalEarnings,
    generateReferralCode 
  } = useReferral();
  
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard');
      });
  };
  
  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out Lakshmikrupa Agriculture',
          text: 'Use my referral code to get started with Lakshmikrupa Agriculture: ' + referralCode,
          url: referralLink,
        });
        toast.success('Shared successfully');
      } catch (err) {
        console.error('Share failed:', err);
        toast.error('Failed to share');
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-green-800">Your Referral Program</CardTitle>
          <CardDescription>
            Share your referral code with friends and earn 5% commission on their purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Your Referral Code</label>
                <div className="flex">
                  <Input 
                    value={referralCode} 
                    readOnly 
                    className="font-medium text-base" 
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(referralCode)}
                  >
                    <Copy size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={generateReferralCode}
                    title="Generate new code"
                  >
                    <RefreshCcw size={16} />
                  </Button>
                </div>
              </div>
              <div className="sm:max-w-[200px]">
                <label className="text-sm font-medium mb-1 block">Total Earnings</label>
                <div className="text-2xl font-bold text-green-700">₹{totalEarnings.toFixed(2)}</div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Share your referral link</label>
              <div className="flex">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="font-medium text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => copyToClipboard(referralLink)}
                >
                  <Copy size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={shareReferral}
                >
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="pt-3">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={shareReferral}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Friends & Earn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800">Your Referrals</CardTitle>
            <CardDescription>
              Track the status of your referrals and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referred User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Purchases</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.referredUserName}</TableCell>
                    <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                    <TableCell>{referral.purchases.length}</TableCell>
                    <TableCell className="text-right">₹{referral.totalCommission.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferralDashboard;
