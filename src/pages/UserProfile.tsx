
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, Key, Loader2, User as UserIcon, Shield, Clock, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const UserProfile: React.FC = () => {
  const { user, updateProfile, updatePassword, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    photoUrl: user?.photoUrl || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(user?.photoUrl || null);
  
  if (!user) {
    navigate('/signin');
    return null;
  }
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!profileData.email) {
      toast.error('Email is required');
      return;
    }
    
    const success = await updateProfile({
      email: profileData.email,
      phone: profileData.phone,
      photoUrl: previewImage || undefined,
    });
    
    if (success) {
      toast.success('Profile updated successfully');
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('All password fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    const success = await updatePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );
    
    if (success) {
      // Clear password fields after successful update
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const renderInitials = () => {
    if (!user?.name) return '?';
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  // Sample data for member since date - would typically come from user object
  const memberSince = 'June 2023';
  
  return (
    <Layout>
      <div className="container max-w-5xl py-8">
        <div className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-green-50 via-green-100 to-green-50 p-8">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-green-200/50 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-green-200/50 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-8">
            <div className="relative group">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="h-24 w-24 ring-4 ring-white ring-offset-2 shadow-lg">
                  <AvatarImage src={previewImage || undefined} alt={user.name} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-green-600 to-green-800 text-white">
                    {renderInitials()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <button 
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-white text-green-700 p-1.5 rounded-full shadow-md hover:bg-green-50 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Premium Member</Badge>
              </div>
              <div className="mt-1 flex items-center gap-3 text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1 text-gray-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Member since {memberSince}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6 w-full max-w-md mx-auto grid grid-cols-2 h-14 rounded-lg bg-green-50 p-1">
            <TabsTrigger 
              value="account"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-800 data-[state=active]:shadow-sm"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-800 data-[state=active]:shadow-sm"
            >
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
            <Card className="h-fit bg-white/70 backdrop-blur-sm border-green-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-700">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-green-700" />
                  <div>
                    <h3 className="font-medium text-gray-800">{user.name}</h3>
                    <p className="text-xs text-gray-500">Full Name</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-700" />
                  <div>
                    <h3 className="font-medium text-gray-800">{user.email}</h3>
                    <p className="text-xs text-gray-500">Email Address</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-700" />
                    <div>
                      <h3 className="font-medium text-gray-800">{user.phone}</h3>
                      <p className="text-xs text-gray-500">Phone Number</p>
                    </div>
                  </div>
                )}
                <Separator className="my-2 bg-green-100" />
                <div className="pt-2">
                  <Button variant="outline" className="w-full border-green-200 hover:bg-green-50 hover:text-green-800 text-sm h-9">
                    View Purchase History
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-8">
              <TabsContent value="account" className="m-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-green-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-green-50/50 border-b border-green-100 pb-4">
                      <CardTitle className="text-lg text-gray-800">Account Information</CardTitle>
                      <CardDescription>
                        Update your profile details and contact information
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleProfileSubmit}>
                      <CardContent className="space-y-5 pt-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                          <Input
                            id="name"
                            defaultValue={user.name}
                            disabled
                            className="bg-gray-50 border-gray-200 focus-visible:ring-green-500"
                          />
                          <p className="text-xs text-gray-500">Name cannot be changed after account creation</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            placeholder="your.email@example.com"
                            className="border-gray-200 focus-visible:ring-green-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            placeholder="+1 (555) 000-0000"
                            className="border-gray-200 focus-visible:ring-green-500"
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50/50 border-t border-gray-100 py-4 flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-green-700 hover:bg-green-800"
                          disabled={loading}
                        >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-green-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-green-50/50 border-b border-green-100 pb-4">
                      <CardTitle className="text-lg text-gray-800">Password & Security</CardTitle>
                      <CardDescription>
                        Change your password and manage security settings
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handlePasswordSubmit}>
                      <CardContent className="space-y-5 pt-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-gray-700">Current Password</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="border-gray-200 focus-visible:ring-green-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="border-gray-200 focus-visible:ring-green-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="border-gray-200 focus-visible:ring-green-500"
                          />
                        </div>
                        
                        <div className="rounded-md bg-green-50/80 p-3 border border-green-100">
                          <h4 className="text-sm font-medium text-green-800 mb-1">Password Requirements</h4>
                          <ul className="text-xs text-green-700 space-y-1">
                            <li className="flex items-center gap-1.5">
                              <div className={`h-1.5 w-1.5 rounded-full ${passwordData.newPassword.length >= 6 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                              At least 6 characters long
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className={`h-1.5 w-1.5 rounded-full ${passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== '' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                              Passwords match
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50/50 border-t border-gray-100 py-4 flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-green-700 hover:bg-green-800"
                          disabled={loading}
                        >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Update Password
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </motion.div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile;
