
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
    reviews: []
  },
  {
    id: '4',
    name: 'Red Onions',
    description: 'Sweet and mild red onions, perfect for salads and garnishes.',
    price: 2.29,
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'onion',
    stock: 100,
    reviews: []
  },
  {
    id: '5',
    name: 'Seasonal Fruit Basket',
    description: 'A selection of fresh seasonal fruits including apples, oranges, and berries.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'fruits',
    stock: 20,
    reviews: []
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
