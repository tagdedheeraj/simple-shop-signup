
import { Product, Review } from '@/types/product';

// Mock product data
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Whole Wheat Flour',
    description: 'Organic stone-ground wheat flour, perfect for making healthy bread and pastries.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'wheat',
    stock: 50,
    reviews: [
      {
        id: '101',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Excellent quality flour! Made the best bread I\'ve ever baked.',
        date: '2023-07-15T09:30:00Z'
      },
      {
        id: '102',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Very good texture and flavor. Will buy again!',
        date: '2023-08-20T14:15:00Z'
      },
      {
        id: '103',
        userId: 'user3',
        userName: 'Ravi Kumar',
        rating: 5,
        comment: 'Best flour for making chapatis and parathas. My family loves it!',
        date: '2023-09-10T10:45:00Z'
      },
      {
        id: '104',
        userId: 'user4',
        userName: 'Priya Sharma',
        rating: 4,
        comment: 'Great quality product, makes soft rotis every time.',
        date: '2023-10-05T18:20:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Basmati Rice',
    description: 'Premium long-grain aromatic rice grown in the foothills of the Himalayas.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1594385158317-3a8d922c1711?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'rice',
    stock: 75,
    reviews: [
      {
        id: '201',
        userId: 'user3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'The aroma of this rice is incredible! Perfect texture when cooked.',
        date: '2023-09-05T11:45:00Z'
      },
      {
        id: '202',
        userId: 'user5',
        userName: 'Amit Patel',
        rating: 5,
        comment: 'Authentic basmati flavor, reminds me of home. Grains stay separate when cooked.',
        date: '2023-09-15T14:30:00Z'
      },
      {
        id: '203',
        userId: 'user6',
        userName: 'Sarah Wilson',
        rating: 4,
        comment: 'Very fragrant rice, perfect for biryani and pulao.',
        date: '2023-10-10T09:15:00Z'
      }
    ]
  },
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
      },
      {
        id: '303',
        userId: 'user9',
        userName: 'Lisa Chen',
        rating: 3,
        comment: 'Nice, but some leaves were slightly wilted on arrival.',
        date: '2023-10-15T14:20:00Z'
      }
    ]
  },
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
      },
      {
        id: '403',
        userId: 'user12',
        userName: 'James Brown',
        rating: 5,
        comment: 'These red onions add a beautiful color and mild flavor to my dishes.',
        date: '2023-10-20T13:10:00Z'
      }
    ]
  },
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
      },
      {
        id: '503',
        userId: 'user15',
        userName: 'Maria Rodriguez',
        rating: 5,
        comment: 'Great value for money. All fruits were fresh and delicious.',
        date: '2023-10-12T12:20:00Z'
      },
      {
        id: '504',
        userId: 'user16',
        userName: 'Alex Thompson',
        rating: 4,
        comment: 'Nice assortment of seasonal fruits. My kids loved it!',
        date: '2023-10-25T16:10:00Z'
      }
    ]
  }
];

// Simulate API calls with a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  return [...products];
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(500); // Simulate network delay
  return products.find(product => product.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  return products.filter(product => product.category === category);
};

export const addReview = async (productId: string, review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  await delay(500); // Simulate network delay
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID(),
    date: new Date().toISOString()
  };
  
  if (!product.reviews) {
    product.reviews = [];
  }
  
  product.reviews.push(newReview);
  
  // In a real app, this would update the backend
  localStorage.setItem('products', JSON.stringify(products));
  
  return newReview;
};

// Initialize products in localStorage if they don't exist
export const initializeProducts = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
  }
};
