
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'wheat' | 'rice' | 'vegetable' | 'onion' | 'fruits';
  stock: number;
}
