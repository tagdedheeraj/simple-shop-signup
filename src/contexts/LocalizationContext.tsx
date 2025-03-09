
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages and their translations
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  zh: '中文',
  ja: '日本語',
  hi: 'हिन्दी',
  ar: 'العربية',
  ru: 'Русский',
  pt: 'Português',
};

// Define supported currencies
export const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  RUB: { symbol: '₽', name: 'Russian Ruble' },
};

// Map countries to language and currency
const COUNTRY_MAPPINGS: Record<string, { language: string; currency: string }> = {
  US: { language: 'en', currency: 'USD' },
  IN: { language: 'en', currency: 'INR' },
  NP: { language: 'en', currency: 'NPR' },
  GB: { language: 'en', currency: 'GBP' },
  FR: { language: 'fr', currency: 'EUR' },
  DE: { language: 'de', currency: 'EUR' },
  ES: { language: 'es', currency: 'EUR' },
  IT: { language: 'it', currency: 'EUR' },
  JP: { language: 'ja', currency: 'JPY' },
  CN: { language: 'zh', currency: 'CNY' },
  RU: { language: 'ru', currency: 'RUB' },
  BR: { language: 'pt', currency: 'BRL' },
  // Add more countries as needed
};

// Basic translations for common phrases
export const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome to GlobalHarvest',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    products: 'Products',
    cart: 'Cart',
    checkout: 'Checkout',
    addToCart: 'Add to Cart',
    continueShop: 'Continue Shopping',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    orderSuccess: 'Order Placed Successfully!',
    thankYou: 'Thank you for your purchase.',
    emptyCart: 'Your cart is empty',
    browseProducts: 'Browse Products',
  },
  fr: {
    welcome: 'Bienvenue à GlobalHarvest',
    signIn: 'Se Connecter',
    signUp: 'S\'inscrire',
    email: 'E-mail',
    password: 'Mot de passe',
    name: 'Nom',
    products: 'Produits',
    cart: 'Panier',
    checkout: 'Paiement',
    addToCart: 'Ajouter au panier',
    continueShop: 'Continuer vos achats',
    orderSummary: 'Récapitulatif de la commande',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    total: 'Total',
    orderSuccess: 'Commande passée avec succès!',
    thankYou: 'Merci pour votre achat.',
    emptyCart: 'Votre panier est vide',
    browseProducts: 'Parcourir les produits',
  },
  es: {
    welcome: 'Bienvenido a GlobalHarvest',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    email: 'Correo',
    password: 'Contraseña',
    name: 'Nombre',
    products: 'Productos',
    cart: 'Carrito',
    checkout: 'Pagar',
    addToCart: 'Añadir al carrito',
    continueShop: 'Seguir comprando',
    orderSummary: 'Resumen del pedido',
    subtotal: 'Subtotal',
    shipping: 'Envío',
    total: 'Total',
    orderSuccess: '¡Pedido realizado con éxito!',
    thankYou: 'Gracias por su compra.',
    emptyCart: 'Tu carrito está vacío',
    browseProducts: 'Explorar productos',
  },
  // Add more languages as needed
};

// Default to English
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_CURRENCY = 'USD';

// Context type definition
interface LocalizationContextType {
  language: string;
  currency: string;
  currencySymbol: string;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
  setLanguage: (language: string) => void;
  setCurrency: (currency: string) => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    // Detect user's country
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        
        // Special case for India, Nepal, and USA (use English)
        if (countryCode === 'IN' || countryCode === 'NP' || countryCode === 'US') {
          setLanguage('en');
          setCurrency(countryCode === 'US' ? 'USD' : countryCode === 'IN' ? 'INR' : 'NPR');
        } else {
          // For other countries, use local language and currency
          const mapping = COUNTRY_MAPPINGS[countryCode];
          if (mapping) {
            setLanguage(mapping.language);
            setCurrency(mapping.currency);
          }
        }
      } catch (error) {
        console.error('Failed to detect country, using defaults:', error);
      }
    };

    detectCountry();
  }, []);

  // Translate function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations[DEFAULT_LANGUAGE][key] || key;
  };

  // Format price function
  const formatPrice = (price: number): string => {
    const currencyData = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES] || SUPPORTED_CURRENCIES.USD;
    
    // Apply exchange rates (simplified - in a real app you would use a currency API)
    const exchangeRates: Record<string, number> = {
      USD: 1,
      EUR: 0.93,
      GBP: 0.79,
      INR: 83.44,
      JPY: 151.72,
      CNY: 7.23,
      AUD: 1.52,
      CAD: 1.37,
      BRL: 5.15,
      RUB: 92.45,
      NPR: 132.72,
    };
    
    const rate = exchangeRates[currency] || 1;
    const convertedPrice = price * rate;
    
    return `${currencyData.symbol}${convertedPrice.toFixed(2)}`;
  };

  const currencySymbol = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES]?.symbol || '$';

  const value = {
    language,
    currency,
    currencySymbol,
    t,
    formatPrice,
    setLanguage,
    setCurrency,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
