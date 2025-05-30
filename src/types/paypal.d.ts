
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonsConfig) => {
        render: (container: HTMLElement | null) => Promise<void>;
      };
      FUNDING: {
        PAYPAL: string;
      };
    };
  }
}

interface PayPalButtonsConfig {
  style?: {
    layout?: string;
    color?: string;
    shape?: string;
    label?: string;
  };
  fundingSource?: string;
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string; paymentID?: string }, actions?: any) => Promise<void>;
  onError?: (err: any) => void;
  onCancel?: () => void;
}

export {};
