
export interface PayPalOrder {
  orderId: string;
  totalAmount: number;
  currency: string;
  items: PayPalOrderItem[];
  customerInfo?: any;
}

export interface PayPalOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PayPalResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}
