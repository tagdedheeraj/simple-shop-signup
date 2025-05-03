
import { Product } from '@/types/product';

export const vegetableProducts: Product[] = [
  {
    id: '3',
    name: 'Fresh Spinach',
    description: 'Locally grown organic spinach, rich in iron and vitamins.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 30,
    reviews: [
      {
        id: '301',
        userId: 'user7',
        userName: 'Meera Joshi',
        rating: 5,
        comment: 'So fresh and crisp! Perfect for salads and smoothies.',
        date: '2023-09-20T16:45:00Z'
      },
      {
        id: '302',
        userId: 'user8',
        userName: 'Tom Harris',
        rating: 4,
        comment: 'Good quality spinach, stays fresh for days in the refrigerator.',
        date: '2023-10-02T11:30:00Z'
      }
    ]
  },
  {
    id: '17',
    name: 'Fresh Tomatoes',
    description: 'Vine-ripened tomatoes, perfect for salads and cooking.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 80,
    reviews: []
  },
  {
    id: '18',
    name: 'Organic Carrots',
    description: 'Sweet, crunchy organic carrots, freshly harvested.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 90,
    reviews: []
  },
  {
    id: '19',
    name: 'Green Bell Peppers',
    description: 'Crisp, flavorful bell peppers from local organic farms.',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 70,
    reviews: []
  }
];
