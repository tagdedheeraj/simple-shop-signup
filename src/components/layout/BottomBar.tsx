
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
      <motion.div 
        className="md:hidden fixed bottom-24 right-4 z-50"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <motion.button 
          onClick={toggleChat}
          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </motion.button>
      </motion.div>

      {/* Chat Popup */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="md:hidden fixed bottom-40 right-4 z-50 bg-white/95 backdrop-blur-sm w-[300px] rounded-2xl shadow-xl border border-emerald-100 overflow-hidden"
          >
            <div className="p-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-emerald-800">Chat Support</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Online</span>
              </div>
            </div>
            <div className="p-4 h-[220px] overflow-y-auto flex flex-col gap-3 bg-gradient-to-br from-white to-emerald-50/50">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-emerald-100 p-3 rounded-2xl rounded-tl-sm text-sm text-emerald-800 self-start max-w-[80%] shadow-sm"
              >
                Hello! How can I help you with your shopping today?
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-emerald-600 p-3 rounded-2xl rounded-tr-sm text-sm text-white self-end max-w-[80%] shadow-sm"
              >
                I'm looking for fresh vegetables.
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-emerald-100 p-3 rounded-2xl rounded-tl-sm text-sm text-emerald-800 self-start max-w-[80%] shadow-sm"
              >
                We have fresh vegetables in stock! Check out our vegetables section for the best options.
              </motion.div>
            </div>
            <div className="p-3 border-t border-emerald-100 bg-white">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 text-sm p-3 border border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-emerald-50/50"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-full text-sm font-medium shadow-md shadow-emerald-500/20"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t border-emerald-100"
      >
        <div className="flex justify-around items-center h-18 px-2 py-3 bg-gradient-to-b from-white/70 to-white/95">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center group"
              >
                <div className={cn(
                  "relative p-2 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5" 
                    : "hover:bg-emerald-500/5"
                )}>
                  {isActive && (
                    <motion.div
                      layoutId="bottomBarIndicator"
                      className="absolute inset-0 rounded-xl bg-emerald-500/10 -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <item.icon 
                    size={22} 
                    className={cn(
                      "transition-colors duration-300",
                      isActive
                        ? "text-emerald-600"
                        : "text-gray-500 group-hover:text-emerald-600"
                    )}
                  />
                </div>
                
                <span className={cn(
                  "text-xs mt-1 font-medium transition-colors duration-300",
                  isActive 
                    ? "text-emerald-700" 
                    : "text-gray-500 group-hover:text-emerald-700"
                )}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="bottomBarDot"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default BottomBar;
