
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

const EmptyCartMessage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();

  return (
    <div className="text-center py-16 space-y-4">
      <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
      <h2 className="text-xl font-medium">{t('emptyCart')}</h2>
      <p className="text-muted-foreground">
        {t('emptyCartMessage')}
      </p>
      <Button onClick={() => navigate('/products')} className="mt-4">
        {t('browseProducts')}
      </Button>
    </div>
  );
};

export default EmptyCartMessage;
