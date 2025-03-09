
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    avatar: 'RK',
    role: 'Regular Customer',
    content: 'The quality of the organic vegetables is exceptional. I've been buying from Lakshmikrupa for over a year, and I'm always satisfied with the freshness.',
    rating: 5
  },
  {
    id: 2,
    name: 'Priya Sharma',
    avatar: 'PS',
    role: 'Wholesale Buyer',
    content: 'As a restaurant owner, I need reliable suppliers. Their delivery is always on time, and the produce is consistently top-notch.',
    rating: 5
  },
  {
    id: 3,
    name: 'Arun Patel',
    avatar: 'AP',
    role: 'Farmer Partner',
    content: 'Being a partner farmer with Lakshmikrupa has transformed my business. Their fair trade practices and support system are unmatched.',
    rating: 4
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-green-800">What Our Customers Say</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our customers have to say about our products and services.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>
                <p className="flex-grow italic text-muted-foreground mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.id}`} />
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
