
import { Product } from '@/types/product';

export const fruitProducts: Product[] = [
  {
    id: '5',
    name: 'Seasonal Fruit Basket',
    description: 'A selection of fresh seasonal fruits including apples, oranges, and berries.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'fruits',
    stock: 20,
    reviews: [
      {
        id: '501',
        userId: 'user13',
        userName: 'Emma Davis',
        rating: 5,
        comment: 'Amazing variety and everything was perfectly ripe!',
        date: '2023-09-18T15:30:00Z'
      },
      {
        id: '502',
        userId: 'user14',
        userName: 'Rajesh Gupta',
        rating: 3,
        comment: 'Good selection, but some fruits were a bit bruised during delivery.',
        date: '2023-10-05T09:45:00Z'
      }
    ]
  },
  {
    id: '14',
    name: 'Organic Apples',
    description: 'Fresh, crisp organic apples picked at peak ripeness.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1567306226408-c302e9a70439?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'fruits',
    stock: 100,
    reviews: []
  },
  {
    id: '15',
    name: 'Premium Bananas',
    description: 'Sweet, organic bananas perfect for snacking or baking.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'fruits',
    stock: 120,
    reviews: []
  },
  {
    id: '16',
    name: 'Sweet Mangoes',
    description: 'Juicy, tropical mangoes with sweet, fiber-free flesh.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'fruits',
    stock: 50,
    reviews: []
  }
];
