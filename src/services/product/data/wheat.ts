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
  },
  {
    id: '7',
    name: 'Premium Semolina',
    description: 'Fine-ground durum wheat semolina, ideal for pasta making and desserts.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1608062368721-b3fdb9f985d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 65,
    reviews: []
  },
  {
    id: '10',
    name: 'Pearl Millet (Bajra)',
    description: 'Nutritious pearl millet grains, high in protein and minerals.',
    price: 4.79,
    image: 'https://images.unsplash.com/photo-1622970236141-c51a55932077?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 45,
    reviews: []
  },
  {
    id: '11',
    name: 'Bajra Flour',
    description: 'Stone-ground pearl millet flour, perfect for traditional flatbreads.',
    price: 5.29,
    image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 35,
    reviews: []
  },
  {
    id: '12',
    name: 'Sorghum (Jowar) Grains',
    description: 'Whole sorghum grains, gluten-free with a mild, sweet flavor.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1631209121750-a9f355ebe522?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 50,
    reviews: []
  },
  {
    id: '13',
    name: 'Jowar Flour',
    description: 'Fine sorghum flour, perfect for gluten-free baking and traditional recipes.',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1616663364399-cdb4c699349a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 40,
    reviews: []
  },
  {
    id: '29',
    name: 'Hard White Wheat',
    description: 'High-protein white wheat ideal for bread and pastries with a milder flavor.',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1565429501018-8a254d6c8f5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 55,
    reviews: []
  },
  {
    id: '30',
    name: 'Khorasan Wheat',
    description: 'Ancient grain with rich, nutty flavor and high nutritional value.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1533167649158-6d508895b680?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 35,
    reviews: []
  },
  {
    id: '31',
    name: 'Spelt Wheat',
    description: 'Ancient wheat variety with a distinctive nutty flavor, perfect for baking.',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 40,
    reviews: []
  },
  {
    id: '32',
    name: 'Einkorn Wheat',
    description: 'One of the oldest wheat varieties with high protein content and rich taste.',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1530407389687-5f73f0a5c966?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 30,
    reviews: []
  },
  {
    id: '33',
    name: 'Rye Grain',
    description: 'Hearty rye grain perfect for robust breads and traditional recipes.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1550507164-9e576eba0db9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 45,
    reviews: []
  },
  {
    id: '34',
    name: 'Soft White Wheat',
    description: 'Low protein wheat perfect for pastries, cookies, and cakes.',
    price: 5.29,
    image: 'https://images.unsplash.com/photo-1570701123784-5dffe1c85bdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 50,
    reviews: []
  },
  {
    id: '35',
    name: 'Hard Red Wheat',
    description: 'High protein wheat with robust flavor, ideal for hearty breads and baking.',
    price: 5.79,
    image: 'https://images.unsplash.com/photo-1540661116512-12e516d30ce4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 60,
    reviews: []
  }
];
