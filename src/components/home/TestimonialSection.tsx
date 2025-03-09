
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}

const TestimonialSection: React.FC = () => {
  const { t } = useLocalization();
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Regular Customer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      comment: "I've been ordering from Lakshmikrupa for over a year now. The produce is always fresh and the service is excellent!",
      rating: 5
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Chef",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      comment: "As a professional chef, I'm very particular about ingredients. Lakshmikrupa delivers exceptional quality organic products consistently.",
      rating: 5
    },
    {
      id: 3,
      name: "Vijay Singh",
      role: "Health Enthusiast",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      comment: "The organic vegetables from Lakshmikrupa have made a noticeable difference in my health journey. Highly recommended!",
      rating: 4
    }
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
        <div className="inline-flex items-center justify-center mb-4">
          <Quote className="h-10 w-10 text-green-600 rotate-180" />
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-800 to-teal-600 bg-clip-text text-transparent">
          {t('customerReviews') || 'What Our Customers Say'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('customerReviewsDescription') || 'Discover why our customers love shopping with us'}
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="h-full border-none shadow-md">
              <CardContent className="p-6 pt-8 bg-gradient-to-b from-green-50 to-transparent">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
                <blockquote className="text-muted-foreground italic">"{testimonial.comment}"</blockquote>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-4">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4 ring-2 ring-green-100">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-green-700 text-white">{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-green-800">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
