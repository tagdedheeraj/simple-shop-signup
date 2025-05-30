
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
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
import { ShoppingCart, User, Globe, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { t, language, setLanguage } = useLocalization();
  const navigate = useNavigate();

  const renderUserAvatar = () => {
    if (!user) return <User className="h-5 w-5" />;
    
    if (user.photoUrl) {
      return (
        <Avatar className="h-8 w-8 border border-green-100">
          <AvatarImage src={user.photoUrl} alt={user.name || ''} />
          <AvatarFallback className="bg-green-100 text-green-800 text-xs">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      );
    }
    
    return (
      <Avatar className="h-8 w-8 border border-green-100">
        <AvatarFallback className="bg-green-100 text-green-800 text-xs">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
    );
  };
  
  const getUserInitials = () => {
    if (!user?.name) return '?';
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

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
              
              <Link to="/wishlist" className="relative p-2">
                <Heart className="h-5 w-5 text-green-800" />
                {wishlistItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white rounded-full text-xs">
                    {wishlistItems}
                  </Badge>
                )}
              </Link>
              
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
                    {renderUserAvatar()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-1 mr-1 glass-effect" align="end">
                  <DropdownMenuLabel>
                    <div className="font-normal text-sm text-muted-foreground">{t('signedInAs')}</div>
                    <div className="font-medium">{user?.name || "User"}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    {t('profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/products')}>
                    {t('products')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/certificates')}>
                    Certificates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    {t('wishlist')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    {t('myOrders')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
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
