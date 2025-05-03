
import { Product } from '@/types/product';

export const riceProducts: Product[] = [
  {
    id: '2',
    name: 'Basmati Rice',
    description: 'Premium long-grain aromatic rice grown in the foothills of the Himalayas.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'rice',
    stock: 75,
    reviews: [
      {
        id: '201',
        userId: 'user3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'The aroma of this rice is incredible! Perfect texture when cooked.',
        date: '2023-09-05T11:45:00Z',
        photos: [
          'https://images.unsplash.com/photo-1516901121982-4ba280115a36?w=300&q=80'
        ]
      },
      {
        id: '202',
        userId: 'user5',
        userName: 'Amit Patel',
        rating: 5,
        comment: 'Authentic basmati flavor, reminds me of home. Grains stay separate when cooked.',
        date: '2023-09-15T14:30:00Z'
      }
    ]
  },
  {
    id: '8',
    name: 'Jasmine Rice',
    description: 'Fragrant Thai jasmine rice with a subtle floral aroma.',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1626236104356-12c2d206d692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'rice',
    stock: 85,
    reviews: [
      {
        id: '801',
        userId: 'user16',
        userName: 'Sarah Chen',
        rating: 5,
        comment: 'Authentic jasmine rice with wonderful aroma. Perfect with curries!',
        date: '2023-10-22T19:15:00Z'
      }
    ]
  },
  {
    id: '9',
    name: 'Brown Rice',
    description: 'Whole grain brown rice rich in fiber and nutrients.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'rice',
    stock: 70,
    reviews: []
  }
];
