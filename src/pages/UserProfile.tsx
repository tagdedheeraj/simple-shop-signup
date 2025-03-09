
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
import { 
  Camera, 
  Key, 
  Loader2, 
  User as UserIcon, 
  Shield, 
  Clock, 
  Mail, 
  Phone, 
  CalendarDays,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
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
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  // Check password strength
  const getPasswordStrength = () => {
    if (!passwordData.newPassword) return 0;
    
    let strength = 0;
    
    // Length check
    if (passwordData.newPassword.length >= 6) strength += 1;
    if (passwordData.newPassword.length >= 10) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(passwordData.newPassword)) strength += 1;
    if (/[0-9]/.test(passwordData.newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(passwordData.newPassword)) strength += 1;
    
    return Math.min(strength, 5);
  };
  
  const passwordStrength = getPasswordStrength();
  
  return (
    <Layout>
      <div className="container max-w-5xl py-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-green-400 p-8 shadow-lg"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-white/5"></div>
          <div className="absolute bottom-1/3 left-1/3 h-16 w-16 rounded-full bg-white/5"></div>
          
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative"
              >
                <Avatar className="h-28 w-28 ring-4 ring-white/30 ring-offset-2 ring-offset-green-500 shadow-xl">
                  <AvatarImage src={previewImage || undefined} alt={user.name} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-white/10 to-white/5 text-white">
                    {renderInitials()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <button 
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-white text-green-700 p-2 rounded-full shadow-md hover:bg-green-50 transition-colors"
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
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">Premium Member</Badge>
                </div>
                <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6 text-white/80">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-white/70">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="text-xs">Member since {memberSince}</span>
                </div>
              </motion.div>
            </div>
            
            <div className="ml-auto mt-4 md:mt-0 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-full md:w-auto flex items-center justify-center gap-3">
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-white/70">Status</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse"></span>
                        <span className="text-sm font-medium text-white">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Tabs and Content Area */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-8 w-full max-w-md mx-auto grid grid-cols-2 h-14 rounded-xl bg-white shadow-md border border-green-100 p-1.5">
            <TabsTrigger 
              value="account"
              className="rounded-lg text-base data-[state=active]:bg-green-50 data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="rounded-lg text-base data-[state=active]:bg-green-50 data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
            {/* Profile Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="h-fit bg-white backdrop-blur-sm border-green-100 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="pb-3 bg-green-50/50">
                  <CardTitle className="text-base text-green-800">Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-5">
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-50 text-green-700">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{user.name}</h3>
                        <p className="text-xs text-gray-500">Full Name</p>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-50 text-green-700">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{user.email}</h3>
                        <p className="text-xs text-gray-500">Email Address</p>
                      </div>
                    </motion.div>
                    
                    {user.phone && (
                      <motion.div variants={itemVariants} className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-50 text-green-700">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{user.phone}</h3>
                          <p className="text-xs text-gray-500">Phone Number</p>
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-50 text-green-700">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Premium Plan</h3>
                        <p className="text-xs text-gray-500">Account Type</p>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <Separator className="my-2 bg-gray-100" />
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-green-200 hover:bg-green-50 hover:text-green-800 text-sm h-9 gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      View Purchase History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <div className="space-y-8">
              <TabsContent value="account" className="m-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-green-100 shadow-md rounded-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-100 pb-4">
                      <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        Account Information
                      </CardTitle>
                      <CardDescription className="text-green-600">
                        Update your profile details and contact information
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleProfileSubmit}>
                      <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                          <div className="relative">
                            <Input
                              id="name"
                              defaultValue={user.name}
                              disabled
                              className="bg-gray-50 border-gray-200 focus-visible:ring-green-500 pl-9"
                            />
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 italic">Name cannot be changed after account creation</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              placeholder="your.email@example.com"
                              className="border-gray-200 focus-visible:ring-green-500 pl-9"
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              placeholder="+1 (555) 000-0000"
                              className="border-gray-200 focus-visible:ring-green-500 pl-9"
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50/70 border-t border-gray-100 py-4 flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-green-600 hover:bg-green-700 text-white transition-colors shadow-sm"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-green-100 shadow-md rounded-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-100 pb-4">
                      <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Password & Security
                      </CardTitle>
                      <CardDescription className="text-green-600">
                        Change your password and manage security settings
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handlePasswordSubmit}>
                      <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-gray-700 font-medium">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="border-gray-200 focus-visible:ring-green-500 pl-9"
                            />
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-gray-700 font-medium">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="border-gray-200 focus-visible:ring-green-500 pl-9"
                            />
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="border-gray-200 focus-visible:ring-green-500 pl-9"
                            />
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="rounded-xl overflow-hidden border border-green-100">
                          <div className="bg-green-50 py-3 px-4 border-b border-green-100">
                            <h4 className="text-sm font-medium text-green-800">Password Strength</h4>
                          </div>
                          
                          <div className="p-4 bg-white">
                            <div className="mb-2.5 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  passwordStrength <= 1 ? 'bg-red-500' :
                                  passwordStrength <= 2 ? 'bg-orange-500' :
                                  passwordStrength <= 3 ? 'bg-yellow-500' :
                                  passwordStrength <= 4 ? 'bg-green-500' : 'bg-green-600'
                                }`}
                                style={{ width: `${passwordStrength * 20}%` }}
                              ></div>
                            </div>
                            
                            <ul className="text-xs space-y-2 mt-3">
                              <li className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 rounded-full ${passwordData.newPassword.length >= 6 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                <span className={passwordData.newPassword.length >= 6 ? 'text-green-700' : 'text-gray-500'}>
                                  At least 6 characters long
                                </span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 rounded-full ${/[A-Z]/.test(passwordData.newPassword) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                <span className={/[A-Z]/.test(passwordData.newPassword) ? 'text-green-700' : 'text-gray-500'}>
                                  Contains uppercase letter
                                </span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 rounded-full ${/[0-9]/.test(passwordData.newPassword) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                <span className={/[0-9]/.test(passwordData.newPassword) ? 'text-green-700' : 'text-gray-500'}>
                                  Contains a number
                                </span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 rounded-full ${passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== '' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                <span className={passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== '' ? 'text-green-700' : 'text-gray-500'}>
                                  Passwords match
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50/70 border-t border-gray-100 py-4 flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-green-600 hover:bg-green-700 text-white transition-colors shadow-sm"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Update Password
                            </>
                          )}
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
