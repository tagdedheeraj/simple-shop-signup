
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, UserCircle, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const BottomBar: React.FC = () => {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/products' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
  ];

  const toggleChat = () => setChatOpen(prev => !prev);

  return (
    <>
      {/* Chat Popup Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-50">
        <button 
          onClick={toggleChat}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg"
        >
          {chatOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </button>
      </div>

      {/* Chat Popup */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed bottom-32 right-4 z-50 bg-white w-[280px] rounded-lg shadow-xl border border-gray-200"
          >
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-medium text-sm">Chat Support</h3>
                </div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
            <div className="p-4 h-[200px] overflow-y-auto flex flex-col">
              <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-800 self-start max-w-[80%] mb-2">
                Hello! How can I help you with your shopping today?
              </div>
              <div className="bg-green-100 p-2 rounded-lg text-sm text-gray-800 self-end max-w-[80%] mb-2">
                I'm looking for fresh vegetables.
              </div>
              <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-800 self-start max-w-[80%]">
                We have fresh vegetables in stock! Check out our vegetables section for the best options.
              </div>
            </div>
            <div className="p-3 border-t border-gray-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button className="bg-green-600 text-white p-2 rounded-md text-sm">Send</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full relative",
                  isActive ? "text-green-700" : "text-gray-500"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomBarIndicator"
                    className="absolute -top-1 w-1/2 h-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <item.icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BottomBar;
