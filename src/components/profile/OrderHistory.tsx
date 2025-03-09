
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock order type - in a real app, you'd fetch this from your backend
interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: { productId: string; quantity: number; name: string; price: number }[];
}

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const { t, formatPrice } = useLocalization();
  const navigate = useNavigate();
  
  // Mock orders - in a real app, you'd fetch these from localStorage or your backend
  const orders: Order[] = JSON.parse(localStorage.getItem(`orders_${user?.id}`) || '[]');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-green-700" />
          {t('orderHistory')}
        </CardTitle>
        <CardDescription>
          {orders.length > 0 
            ? t('yourOrderHistory', { count: orders.length }) 
            : t('noOrders')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="bg-muted p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{t('orderId')}: {order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('total')}: {formatPrice(order.total)}</p>
                      <p className="text-sm font-medium capitalize">{t('status')}: {order.status}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-2">{t('items')}</h4>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.productId} className="text-sm flex justify-between">
                        <span>{item.quantity} x {item.name}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="min-h-[200px] flex flex-col items-center justify-center">
            <PackageX className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              {t('noOrdersDescription')}
            </p>
            <Button onClick={() => navigate('/products')}>
              {t('browseProducts')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
