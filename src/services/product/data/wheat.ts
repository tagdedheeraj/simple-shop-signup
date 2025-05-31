
import { Product } from '@/types/product';

export const wheatProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Whole Wheat Flour',
    description: 'Organic stone-ground wheat flour, perfect for making healthy bread and pastries.',
    price: 5.99,
    image: '/lovable-uploads/5c040d9b-b9c9-4d14-b7b6-7df9e79592a6.png',
    category: 'wheat',
    stock: 50,
    reviews: [
      {
        id: '101',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Excellent quality flour! Made the best bread I\'ve ever baked.',
        date: '2023-07-15T09:30:00Z',
        photos: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80',
          'https://images.unsplash.com/photo-1612204321161-9e9b8a4cb122?w=300&q=80'
        ]
      },
      {
        id: '102',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Very good texture and flavor. Will buy again!',
        date: '2023-08-20T14:15:00Z'
      }
    ]
  },
  {
    id: '6',
    name: 'Organic Wheat Berries',
    description: 'Whole grain wheat berries for sprouting or grinding into flour at home.',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1556060880-053a05a35b43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 40,
    reviews: [
      {
        id: '601',
        userId: 'user15',
        userName: 'Lisa Brown',
        rating: 5,
        comment: 'Perfect for homemade flour and sprouting! Very fresh quality.',
        date: '2023-11-12T08:30:00Z'
      }
    ]
  }
];
