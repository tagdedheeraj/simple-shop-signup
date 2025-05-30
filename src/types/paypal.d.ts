
// Enhanced PayPal TypeScript declarations
declare global {
  interface Window {
    paypal?: {
      Buttons: (options: PayPalButtonsOptions) => {
        render: (container: HTMLElement | string) => Promise<void>;
        close: () => void;
        isEligible: () => boolean;
      };
      FUNDING: {
        PAYPAL: string;
        CARD: string;
        CREDIT: string;
        VENMO: string;
      };
      Checkout: any;
    };
  }
}

interface PayPalButtonsOptions {
  style?: {
    layout?: 'vertical' | 'horizontal';
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
    shape?: 'rect' | 'pill';
    label?: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment';
    height?: number;
    tagline?: boolean;
    fundingicons?: boolean;
  };
  
  createOrder: (data: any, actions: PayPalActions) => Promise<string>;
  onApprove: (data: PayPalApprovalData, actions: PayPalActions) => Promise<void>;
  onError?: (err: any) => void;
  onCancel?: (data: any) => void;
  onInit?: (data: any, actions: any) => void;
  onClick?: (data: any, actions: any) => void;
}

interface PayPalActions {
  order: {
    create: (orderData: PayPalOrderRequest) => Promise<string>;
    capture: () => Promise<PayPalCaptureResponse>;
    get: () => Promise<any>;
  };
  reject: () => Promise<void>;
  restart: () => Promise<void>;
}

interface PayPalApprovalData {
  orderID: string;
  payerID?: string;
  subscriptionID?: string;
  billingToken?: string;
}

interface PayPalOrderRequest {
  intent?: 'CAPTURE' | 'AUTHORIZE';
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
      breakdown?: {
        item_total?: {
          currency_code: string;
          value: string;
        };
        shipping?: {
          currency_code: string;
          value: string;
        };
        handling?: {
          currency_code: string;
          value: string;
        };
        tax_total?: {
          currency_code: string;
          value: string;
        };
        shipping_discount?: {
          currency_code: string;
          value: string;
        };
      };
    };
    items?: Array<{
      name: string;
      quantity: string;
      unit_amount: {
        currency_code: string;
        value: string;
      };
      tax?: {
        currency_code: string;
        value: string;
      };
      description?: string;
      sku?: string;
      category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS';
    }>;
    description?: string;
    custom_id?: string;
    invoice_id?: string;
    soft_descriptor?: string;
  }>;
  application_context?: {
    brand_name?: string;
    locale?: string;
    landing_page?: 'LOGIN' | 'BILLING' | 'NO_PREFERENCE';
    shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
    user_action?: 'CONTINUE' | 'PAY_NOW';
    payment_method?: {
      payer_selected?: string;
      payee_preferred?: 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED';
    };
    return_url?: string;
    cancel_url?: string;
  };
}

interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING' | 'REFUNDED';
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
    payee: {
      email_address: string;
      merchant_id: string;
    };
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
        final_capture: boolean;
        create_time: string;
        update_time: string;
      }>;
    };
  }>;
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id: string;
  };
  create_time: string;
  update_time: string;
}

export {};
