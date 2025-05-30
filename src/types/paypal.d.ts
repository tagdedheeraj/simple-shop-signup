
interface PayPalOrderRequest {
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
    description?: string;
  }>;
}

interface PayPalOrder {
  id: string;
  status: string;
}

interface PayPalApprovalData {
  orderID: string;
}

interface PayPalButtonStyle {
  layout?: 'vertical' | 'horizontal';
  color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
  shape?: 'rect' | 'pill';
  label?: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment' | 'subscribe' | 'donate';
  tagline?: boolean;
}

interface PayPalButtonConfig {
  style?: PayPalButtonStyle;
  createOrder: () => Promise<string>;
  onApprove: (data: PayPalApprovalData) => Promise<void>;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

interface PayPalButtons {
  (config: PayPalButtonConfig): {
    render: (container: HTMLElement) => void;
  };
}

interface PayPalOrders {
  create: (order: PayPalOrderRequest) => Promise<PayPalOrder>;
  capture: (orderId: string) => Promise<PayPalOrder>;
}

interface PayPal {
  Buttons: PayPalButtons;
  Orders: () => PayPalOrders;
}

declare global {
  interface Window {
    paypal?: PayPal;
  }
}

export {};
