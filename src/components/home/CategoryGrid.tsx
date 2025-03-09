
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'wheat',
    name: 'Wheat',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Premium quality wheat varieties'
  },
  {
    id: 'rice',
    name: 'Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Organic and traditional rice varieties'
  },
  {
    id: 'vegetable',
    name: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1557844352-761f2deb63b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Fresh farm vegetables'
  },
  {
    id: 'fruits',
    name: 'Fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Seasonal and exotic fruits'
  },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-green-800">Browse Categories</h2>
        <p className="text-muted-foreground mt-2">Find what you're looking for</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link 
              to={`/products?category=${category.id}`}
              className="block h-full"
            >
              <Card className="overflow-hidden h-full hover:shadow-lg transition-all border-green-100">
                <div className="relative h-48">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-xl mb-1">{category.name}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
