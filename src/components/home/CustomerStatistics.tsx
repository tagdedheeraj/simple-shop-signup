
import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Star, Heart } from 'lucide-react';

const CustomerStatistics: React.FC = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: "10,000+",
      label: "Happy Customers",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      value: "25,000+",
      label: "Orders Delivered",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <Star className="h-8 w-8" />,
      value: "4.8/5",
      label: "Customer Rating",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      value: "98%",
      label: "Satisfaction Rate",
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-8 bg-gray-50 rounded-2xl">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center text-center p-4"
          >
            <div className={`${stat.bgColor} ${stat.color} p-4 rounded-full mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CustomerStatistics;
