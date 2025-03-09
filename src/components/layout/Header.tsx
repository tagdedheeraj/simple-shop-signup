
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLocalization, SUPPORTED_LANGUAGES } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Globe, Heart, Settings, Package, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { t, language, setLanguage } = useLocalization();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-gray-100 animate-slide-down">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/2a6a68af-beec-4906-b6e9-5eb249505820.png" 
            alt="Lakshmikrupa Agriculture Pvt. Ltd." 
            className="h-10 w-auto"
          />
          <span className="text-green-800 font-semibold hidden md:inline-block">Lakshmikrupa</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                    {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                      <DropdownMenuRadioItem key={code} value={code}>
                        {name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="h-5 w-5 text-green-800" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-700 text-white rounded-full text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-1 mr-1 glass-effect" align="end">
                  <DropdownMenuLabel>
                    <div className="font-normal text-sm text-muted-foreground">{t('signedInAs')}</div>
                    <div className="font-medium">{user?.name}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    {t('profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile?tab=favorites')}>
                    <Heart className="mr-2 h-4 w-4" />
                    {t('favorites')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile?tab=orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    {t('myOrders')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/products')}>
                    {t('products')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                className="text-sm text-green-800"
                onClick={() => navigate('/signin')}
              >
                {t('signIn')}
              </Button>
              <Button
                className="text-sm bg-green-700 text-white hover:bg-green-800"
                onClick={() => navigate('/signup')}
              >
                {t('signUp')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
