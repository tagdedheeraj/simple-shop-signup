
import { Product } from '@/types/product';

export const riceProducts: Product[] = [
  {
    id: '2',
    name: 'Basmati Rice',
    description: 'Premium long-grain aromatic rice grown in the foothills of the Himalayas.',
    price: 8.99,
    image: '/lovable-uploads/d0f264a7-374d-4e2d-98aa-2a9f1427b94e.png',
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
    image: '/lovable-uploads/9646d92f-ac2e-46f5-ac58-961b615e3686.png',
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
  }
];
