
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
  },
  {
    id: '20',
    name: 'Fresh Cabbage',
    description: 'Crisp, green cabbage perfect for slaws and stir-fries.',
    price: 2.29,
    image: 'https://images.unsplash.com/photo-1551889761-9e384b4a2484?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 65,
    reviews: []
  },
  {
    id: '21',
    name: 'Organic Pumpkin',
    description: 'Sweet, orange pumpkin ideal for soups, pies and roasting.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1569976710208-b52636b52c09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 40,
    reviews: []
  },
  {
    id: '22',
    name: 'Capsicum Mix',
    description: 'Colorful mix of red, yellow and green bell peppers.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1526470498-9ae73c665de8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 55,
    reviews: []
  },
  {
    id: '23',
    name: 'Fresh Ginger Root',
    description: 'Aromatic ginger root, essential for Asian cuisine and teas.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1603904338186-45971f549d8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 75,
    reviews: []
  },
  {
    id: '24',
    name: 'Red Chilli',
    description: 'Spicy red chillies to add heat to any dish.',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1548247661-3d7905940716?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 60,
    reviews: []
  },
  {
    id: '25',
    name: 'Organic Garlic',
    description: 'Flavorful garlic bulbs grown without pesticides.',
    price: 1.79,
    image: 'https://images.unsplash.com/photo-1600842481606-78c36915ed72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 85,
    reviews: []
  },
  {
    id: '26',
    name: 'Lady\'s Finger (Okra)',
    description: 'Tender okra pods, perfect for stews and frying.',
    price: 2.89,
    image: 'https://images.unsplash.com/photo-1643118915497-cc91f21e1cc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 45,
    reviews: []
  },
  {
    id: '27',
    name: 'Green Peas',
    description: 'Sweet, tender green peas freshly picked.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1587324438673-56c78a23017c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 70,
    reviews: []
  },
  {
    id: '28',
    name: 'Brinjal (Eggplant)',
    description: 'Glossy purple eggplants, great for curries and grilling.',
    price: 2.79,
    image: 'https://images.unsplash.com/photo-1632252929397-285fb55a76f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'vegetable',
    stock: 50,
    reviews: []
  }
];
