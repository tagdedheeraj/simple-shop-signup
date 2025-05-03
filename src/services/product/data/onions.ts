
import { Product } from '@/types/product';

export const onionProducts: Product[] = [
  {
    id: '4',
    name: 'Red Onions',
    description: 'Sweet and mild red onions, perfect for salads and garnishes.',
    price: 2.29,
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'onion',
    stock: 100,
    reviews: [
      {
        id: '401',
        userId: 'user10',
        userName: 'David Williams',
        rating: 5,
        comment: 'These onions are so sweet and flavorful. Great for salads!',
        date: '2023-09-25T10:15:00Z'
      },
      {
        id: '402',
        userId: 'user11',
        userName: 'Neha Singh',
        rating: 4,
        comment: 'Good size and quality. Perfect for daily cooking.',
        date: '2023-10-08T17:45:00Z'
      }
    ]
  }
];
