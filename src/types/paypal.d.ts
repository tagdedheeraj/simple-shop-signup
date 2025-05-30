
declare global {
  interface Window {
    paypal: {
      Buttons: (config: PayPalButtonsConfig) => {
        render: (container: HTMLElement) => void;
      };
    };
  }
}

export interface PayPalButtonsConfig {
  style?: {
    layout?: 'vertical' | 'horizontal';
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
    shape?: 'rect' | 'pill';
    label?: 'pay' | 'buynow' | 'paypal' | 'checkout' | 'credit';
  };
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
  onError?: (err: any) => void;
  onCancel?: () => void;
}

export interface PayPalApprovalData {
  orderID: string;
  payerID: string;
}

export interface PayPalActions {
  order: {
    create: (orderData: any) => Promise<string>;
    capture: () => Promise<any>;
  };
}
