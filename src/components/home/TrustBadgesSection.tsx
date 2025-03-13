
import React from 'react';
import { Shield, Truck, RotateCcw, Award, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustBadgesSection: React.FC = () => {
  const trustFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "100% Secure",
      description: "Full transparency and security of transactions",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Quick Delivery",
      description: "Get your products within 24-48 hours",
    },
    {
      icon: <RotateCcw className="h-6 w-6" />,
      title: "Easy Returns",
      description: "30-day money-back guarantee",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Quality Assured",
      description: "Every product passes our quality checks",
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Get assistance whenever you need it",
    }
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-800 to-teal-600 bg-clip-text text-transparent">
          Why Choose Us?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We pride ourselves on delivering the best experience for our customers
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {trustFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="text-green-600 mb-3 bg-green-50 p-3 rounded-full">
              {feature.icon}
            </div>
            <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
            <p className="text-muted-foreground text-xs">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadgesSection;
