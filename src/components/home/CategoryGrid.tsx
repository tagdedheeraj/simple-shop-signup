
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Leaf, Apple, Wheat, Coffee, Egg, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const CategoryGrid: React.FC = () => {
  const { t } = useLocalization();
  
  const categories: Category[] = [
    {
      id: 'vegetables',
      name: t('vegetables') || 'Vegetables',
      icon: <Leaf className="h-8 w-8" />,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    {
      id: 'fruits',
      name: t('fruits') || 'Fruits',
      icon: <Apple className="h-8 w-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      id: 'grains',
      name: t('grains') || 'Grains',
      icon: <Wheat className="h-8 w-8" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'dairy',
      name: t('dairy') || 'Dairy',
      icon: <Egg className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'beverages',
      name: t('beverages') || 'Beverages',
      icon: <Coffee className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'packaged',
      name: t('packagedGoods') || 'Packaged Goods',
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];
  
  return (
    <section className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-800 to-teal-600 bg-clip-text text-transparent">
          {t('browseCategories') || 'Browse Categories'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('browseCategoriesDescription') || 'Find the best organic products organized by category for easy shopping'}
        </p>
      </motion.div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Link to={`/products?category=${category.id}`}>
              <Card className="hover:shadow-md transition-all border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className={`rounded-full ${category.bgColor} ${category.color} p-4 mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
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
