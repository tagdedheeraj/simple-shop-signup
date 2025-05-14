
import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle2,
  MapPin,
  ShoppingBag,
  Clock3,
  Package,
  Truck,
  Check,
  Home,
  Bell,
  Heart,
  Download,
  ThumbsUp,
  Award,
  Gift,
  Sparkles,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const orderHistory = [
  {
    id: "ORD-38291",
    date: "May 12, 2023",
    total: "$129.99",
    status: "Delivered",
    items: 3
  },
  {
    id: "ORD-37128",
    date: "April 23, 2023",
    total: "$79.50",
    status: "Delivered",
    items: 2
  },
  {
    id: "ORD-36091",
    date: "March 15, 2023",
    total: "$214.30",
    status: "Delivered",
    items: 4
  }
];

const addresses = [
  {
    id: "addr-1",
    name: "Home",
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    country: "United States",
    isDefault: true
  },
  {
    id: "addr-2",
    name: "Office",
    street: "456 Market Street, Suite 300",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "United States",
    isDefault: false
  }
];

const UserProfile: React.FC = () => {
  const { user, updateProfile, updatePassword, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('account');
  
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
  const [showProfileImage, setShowProfileImage] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProfileImage(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  const memberSince = 'June 2023';
  
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
  
  const getPasswordStrength = () => {
    if (!passwordData.newPassword) return 0;
    
    let strength = 0;
    
    if (passwordData.newPassword.length >= 6) strength += 1;
    if (passwordData.newPassword.length >= 10) strength += 1;
    
    if (/[A-Z]/.test(passwordData.newPassword)) strength += 1;
    if (/[0-9]/.test(passwordData.newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(passwordData.newPassword)) strength += 1;
    
    return Math.min(strength, 5);
  };
  
  const passwordStrength = getPasswordStrength();
  
  const renderOrderStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
          <Check className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      case "Processing":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
          <Package className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      case "Shipped":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
          <Truck className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">{status}</Badge>;
    }
  };

  const achievements = [
    { name: "First Order", icon: <ShoppingBag className="h-5 w-5" />, completed: true },
    { name: "5 Orders", icon: <Award className="h-5 w-5" />, completed: true },
    { name: "Profile Completed", icon: <CheckCircle2 className="h-5 w-5" />, completed: true },
    { name: "Left a Review", icon: <ThumbsUp className="h-5 w-5" />, completed: false },
    { name: "Referred a Friend", icon: <Gift className="h-5 w-5" />, completed: false },
  ];

  return (
    <Layout>
      <div className="container max-w-6xl py-6 md:py-12">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12 overflow-hidden rounded-3xl shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 opacity-90">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          </div>
          
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-1/3 left-1/4 h-32 w-32 rounded-full bg-white/5 blur-xl"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 right-12 h-[500px] w-[500px] rounded-full border border-white/10 opacity-20"></div>
            <div className="absolute -bottom-40 left-12 h-[400px] w-[400px] rounded-full border border-white/10 opacity-20"></div>
            <div className="absolute top-1/4 right-1/3 h-24 w-24 rounded-full border border-white/20 opacity-30"></div>
          </div>
          
          <div className="relative z-10 backdrop-blur-sm">
            <div className="mx-auto max-w-5xl p-6 md:p-10">
              <div className="grid gap-8 md:grid-cols-[auto_1fr_auto] items-center">
                <AnimatePresence>
                  {showProfileImage && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100,
                        damping: 15,
                        delay: 0.1
                      }}
                      className="relative group"
                    >
                      <motion.div 
                        animate={{ 
                          boxShadow: ["0px 0px 0px 0px rgba(255,255,255,0.2)", "0px 0px 0px 8px rgba(255,255,255,0.2)", "0px 0px 0px 0px rgba(255,255,255,0.2)"]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="absolute inset-0 rounded-full"
                      ></motion.div>
                      <div className="relative">
                        <div className="p-1 bg-white/20 backdrop-blur-md rounded-full">
                          <Avatar className="h-36 w-36 border-4 border-white/30 ring-2 ring-white/10 shadow-2xl">
                            <AvatarImage src={previewImage || undefined} alt={user.name || ''} className="object-cover" />
                            <AvatarFallback className="text-3xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white">
                              {renderInitials()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={triggerFileInput}
                          className="absolute bottom-1 right-1 bg-white text-purple-700 p-3 rounded-full shadow-lg hover:bg-purple-50 transition-colors z-10"
                        >
                          <Camera className="h-5 w-5" />
                        </motion.button>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex flex-wrap items-center gap-3 mb-2"
                    >
                      <h1 className="text-4xl font-bold text-white tracking-tight">{user.name || "User"}</h1>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-medium py-1.5">
                        <Sparkles className="h-3.5 w-3.5 mr-1" /> Premium Member
                      </Badge>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6"
                    >
                      <div className="flex items-center gap-2 text-white/90 backdrop-blur-md bg-white/10 px-3 py-1.5 rounded-full">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-white/90 backdrop-blur-md bg-white/10 px-3 py-1.5 rounded-full">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm font-medium">{user.phone}</span>
                        </div>
                      )}
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 flex items-center gap-1.5 text-white/80"
                    >
                      <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 px-3 py-1.5 rounded-full">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span className="text-xs">Member since {memberSince}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="ml-auto flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <motion.div 
                        whileHover={{ y: -3, scale: 1.05 }}
                        className="bg-white/10 backdrop-blur-md p-4 rounded-xl"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-9 h-9 mb-2 rounded-full bg-white/20 flex items-center justify-center">
                            <motion.span 
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.8, 1] 
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop"
                              }}
                              className="h-2.5 w-2.5 rounded-full bg-green-300"
                            ></motion.span>
                          </div>
                          <span className="text-lg font-semibold text-white">Active</span>
                          <span className="text-xs mt-1 text-white/60">Status</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -3, scale: 1.05 }}
                        className="bg-white/10 backdrop-blur-md p-4 rounded-xl"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-9 h-9 mb-2 rounded-full bg-white/20 flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-white/80" />
                          </div>
                          <span className="text-lg font-semibold text-white">{orderHistory.length}</span>
                          <span className="text-xs mt-1 text-white/60">Orders</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -3, scale: 1.05 }}
                        className="bg-white/10 backdrop-blur-md p-4 rounded-xl"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-9 h-9 mb-2 rounded-full bg-white/20 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-white/80" />
                          </div>
                          <span className="text-lg font-semibold text-white">{addresses.length}</span>
                          <span className="text-xs mt-1 text-white/60">Addresses</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <Tabs 
          defaultValue="account" 
          className="w-full"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <div className="relative">
            <TabsList className="mb-10 w-full max-w-2xl mx-auto grid grid-cols-5 h-16 rounded-2xl bg-white shadow-lg border border-green-100 p-2">
              <TabsTrigger 
                value="account"
                className="rounded-xl text-base data-[state=active]:bg-green-50 data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <UserIcon className="h-5 w-5" />
                  <span className="text-xs hidden md:inline">Account</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="rounded-xl text-base data-[state=active]:bg-green-50 data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <Shield className="h-5 w-5" />
                  <span className="text-xs hidden md:inline">Security</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="rounded-xl text-base data-[state=active]:bg-green-50 data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="text-xs hidden md:inline">Orders</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="addresses"
                className="rounded-xl text-base data-[state=active]:bg-green-50 data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs hidden md:inline">Addresses</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="achievements"
                className="rounded-xl text-base data-[state=active]:bg-green-50 data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <Award className="h-5 w-5" />
                  <span className="text-xs hidden md:inline">Achievements</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <motion.div 
              className="absolute left-0 right-0 -bottom-4 flex justify-center pointer-events-none"
              initial={false}
              animate={{ 
                x: activeTab === 'account' ? '-40%' : 
                   activeTab === 'security' ? '-20%' : 
                   activeTab === 'orders' ? '0%' : 
                   activeTab === 'addresses' ? '20%' : '40%'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="h-1 w-10 bg-green-500 rounded-full"></div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="h-fit"
            >
              <Card className="sticky top-24 bg-white backdrop-blur-sm border-green-100 shadow-md rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
                  <CardTitle className="text-base text-green-800 flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Profile Summary
                  </CardTitle>
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
                    
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-50 text-green-700">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{orderHistory.length} Orders</h3>
                        <p className="text-xs text-gray-500">Purchase History</p>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-50 text-green-700">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{addresses.length} Addresses</h3>
                        <p className="text-xs text-gray-500">Saved Locations</p>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <Separator className="my-2 bg-gray-100" />
                  
                  <div className="pt-2 space-y-2">
                    <motion.div 
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full border-green-200 hover:bg-green-50 hover:text-green-800 text-sm h-9 gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full border-green-200 hover:bg-green-50 hover:text-green-800 text-sm h-9 gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download My Data
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <TabsContent key="account" value="account" className="m-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-green-100 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/30 border-b border-green-100 pb-6">
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
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button 
                              type="submit" 
                              className="bg-green-600 hover:bg-green-700 text-white transition-colors shadow-md"
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
                          </motion.div>
                        </CardFooter>
                      </form>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent key="security" value="security" className="m-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-green-100 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/30 border-b border-green-100 pb-6">
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
                              <div className="mb-2.5 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${passwordStrength * 20}%` }}
                                  transition={{ duration: 0.3 }}
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    passwordStrength <= 1 ? 'bg-red-500' :
                                    passwordStrength <= 2 ? 'bg-orange-500' :
                                    passwordStrength <= 3 ? 'bg-yellow-500' :
                                    passwordStrength <= 4 ? 'bg-green-500' : 'bg-green-600'
                                  }`}
                                ></motion.div>
                              </div>
                              
                              <ul className="text-xs space-y-2 mt-3">
                                {[
                                  { condition: passwordData.newPassword.length >= 6, text: 'At least 6 characters long' },
                                  { condition: /[A-Z]/.test(passwordData.newPassword), text: 'Contains uppercase letter' },
                                  { condition: /[0-9]/.test(passwordData.newPassword), text: 'Contains a number' },
                                  { condition: passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== '', text: 'Passwords match' }
                                ].map((item, index) => (
                                  <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-1.5"
                                  >
                                    <motion.div 
                                      animate={item.condition ? { scale: [1, 1.3, 1] } : {}}
                                      transition={{ duration: 0.3 }}
                                      className={`h-2 w-2 rounded-full ${item.condition ? 'bg-green-600' : 'bg-gray-300'}`}
                                    ></motion.div>
                                    <span className={item.condition ? 'text-green-700' : 'text-gray-500'}>
                                      {item.text}
                                    </span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 py-4 flex justify-end">
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button 
                              type="submit" 
                              className="bg-green-600 hover:bg-green-700 text-white transition-colors shadow-md"
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
                          </motion.div>
                        </CardFooter>
                      </form>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent key="orders" value="orders" className="m-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-green-100 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/30 border-b border-green-100 pb-6">
                        <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5" />
                          Order History
                        </CardTitle>
                        <CardDescription className="text-green-600">
                          View and manage your previous orders
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        {orderHistory.length > 0 ? (
                          <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="divide-y divide-gray-100"
                          >
                            {orderHistory.map((order, index) => (
                              <motion.div
                                key={order.id}
                                variants={itemVariants}
                                className="p-4 hover:bg-gray-50 transition-colors"
                                whileHover={{ x: 4 }}
                              >
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-medium">{order.id}</h3>
                                      {renderOrderStatusBadge(order.status)}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <Clock3 className="h-3.5 w-3.5" />
                                        <span>{order.date}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Package className="h-3.5 w-3.5" />
                                        <span>{order.items} items</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-green-700">{order.total}</span>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button variant="outline" size="sm" className="h-8 text-xs border-green-200 hover:bg-green-50 hover:text-green-800">
                                        View Details
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="py-12 px-4 text-center"
                          >
                            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                              <ShoppingBag className="h-7 w-7 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No orders yet</h3>
                            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                              <Button className="bg-green-600 hover:bg-green-700 text-white">
                                Start Shopping
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-gray-50/70 border-t border-gray-100 py-4 flex justify-between">
                        <p className="text-sm text-gray-500">
                          Need help with an order? <a href="#" className="text-green-600 hover:underline">Contact Support</a>
                        </p>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button variant="outline" className="border-green-200 hover:bg-green-50 hover:text-green-800 text-sm">
                            View All Orders
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent key="addresses" value="addresses" className="m-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-green-100 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/30 border-b border-green-100 pb-6">
                        <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Shipping Addresses
                        </CardTitle>
                        <CardDescription className="text-green-600">
                          Manage your shipping address information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 grid gap-4 sm:grid-cols-2">
                        {addresses.map((address, index) => (
                          <motion.div 
                            key={address.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2, boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.1)" }}
                            className={`p-4 border rounded-xl ${
                              address.isDefault 
                                ? 'border-green-200 bg-green-50/50' 
                                : 'border-gray-200 hover:border-gray-300'
                            } transition-all duration-200`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-800">{address.name}</h3>
                                {address.isDefault && (
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                <span className="sr-only">Edit address</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20V4M4 12h16" />
                                </svg>
                              </Button>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>{address.street}</p>
                              <p>{address.city}, {address.state} {address.zip}</p>
                              <p>{address.country}</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="sm" className="h-8 text-xs">
                                  Edit
                                </Button>
                              </motion.div>
                              {!address.isDefault && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button variant="outline" size="sm" className="h-8 text-xs">
                                    Set as Default
                                  </Button>
                                </motion.div>
                              )}
                              {!address.isDefault && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                                    Remove
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                        
                        <motion.div 
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.02 }}
                          className="p-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                            <motion.div
                              animate={{ 
                                rotate: [0, 90, 180, 270, 360],
                              }}
                              transition={{ 
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </motion.div>
                          </div>
                          <h3 className="font-medium text-gray-700 mb-1">Add New Address</h3>
                          <p className="text-sm text-gray-500">Add a new shipping destination</p>
                        </motion.div>
                      </CardContent>
                      <CardFooter className="bg-gray-50/70 border-t border-gray-100 py-4 flex justify-between">
                        <p className="text-sm text-gray-500">
                          Addresses are used for shipping and billing
                        </p>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button className="bg-green-600 hover:bg-green-700 text-white transition-colors shadow-md">
                            <Home className="h-4 w-4 mr-2" />
                            Add New Address
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent key="achievements" value="achievements" className="m-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-green-100 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/30 border-b border-green-100 pb-6">
                        <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Achievements
                        </CardTitle>
                        <CardDescription className="text-green-600">
                          Track your milestones and accomplishments
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {achievements.map((achievement, index) => (
                            <motion.div
                              key={achievement.name}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -2, boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.1)" }}
                              className={`p-4 rounded-xl border ${
                                achievement.completed
                                  ? 'bg-green-50/50 border-green-200'
                                  : 'bg-gray-50/50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                  achievement.completed
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {achievement.icon}
                                </div>
                                <div>
                                  <h3 className={`font-medium ${
                                    achievement.completed ? 'text-green-800' : 'text-gray-600'
                                  }`}>
                                    {achievement.name}
                                  </h3>
                                  {achievement.completed ? (
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                      <Check className="h-3 w-3" />
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-500">
                                      In Progress
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile;
