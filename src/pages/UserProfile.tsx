
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { Loader2, User, Heart, Package, LogOut } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import FavoriteProducts from '@/components/profile/FavoriteProducts';
import OrderHistory from '@/components/profile/OrderHistory';

const UserProfile: React.FC = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await updateUserProfile({ name, email });
    
    setLoading(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };
  
  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-700" />
                  <span>{user?.name}</span>
                </CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('signOut')}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-3/4">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">
                  <User className="mr-2 h-4 w-4" />
                  {t('profile')}
                </TabsTrigger>
                <TabsTrigger value="favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  {t('favorites')}
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="mr-2 h-4 w-4" />
                  {t('orders')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('editProfile')}</CardTitle>
                    <CardDescription>
                      {t('updateYourProfileInformation')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('fullName')}</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('fullName')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('email')}
                        />
                      </div>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('saving')}...
                          </>
                        ) : (
                          t('saveChanges')
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-6">
                <FavoriteProducts />
              </TabsContent>
              
              <TabsContent value="orders" className="mt-6">
                <OrderHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
