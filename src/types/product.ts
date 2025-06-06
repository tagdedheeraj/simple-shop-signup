
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'wheat' | 'rice'; // Removed unused categories
  stock: number;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  photos?: string[];
}
