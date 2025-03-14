
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, UserCircle, MessageCircle, X, Send, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const BottomBar: React.FC = () => {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  
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
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-lg shadow-green-500/20 border border-white/20"
          whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          {chatOpen ? <X size={22} /> : <Leaf size={22} />}
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
            className="md:hidden fixed bottom-40 right-4 z-50 w-[300px] rounded-2xl shadow-xl border border-green-100 overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.05)"
            }}
          >
            <div className="p-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-green-800">Eco Support</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Online</span>
              </div>
            </div>
            <div className="p-4 h-[220px] overflow-y-auto flex flex-col gap-3 bg-gradient-to-br from-white to-green-50/50">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-green-100 p-3 rounded-2xl rounded-tl-sm text-sm text-green-800 self-start max-w-[80%] shadow-sm"
              >
                Hello! How can I help you find sustainable products today?
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-600 p-3 rounded-2xl rounded-tr-sm text-sm text-white self-end max-w-[80%] shadow-sm"
              >
                I'm looking for organic vegetables.
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-green-100 p-3 rounded-2xl rounded-tl-sm text-sm text-green-800 self-start max-w-[80%] shadow-sm"
              >
                We have fresh organic vegetables in stock! Check out our produce section for locally-sourced options.
              </motion.div>
            </div>
            <div className="p-3 border-t border-green-100 bg-white">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 text-sm p-3 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-green-50/50"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full text-sm font-medium shadow-md shadow-green-500/20 flex items-center justify-center"
                >
                  <Send size={18} />
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t border-green-100"
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
                    ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5" 
                    : "hover:bg-green-500/5"
                )}>
                  {isActive && (
                    <motion.div
                      layoutId="bottomBarIndicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <item.icon 
                    size={22} 
                    className={cn(
                      "transition-colors duration-300",
                      isActive
                        ? "text-green-600"
                        : "text-gray-500 group-hover:text-green-600"
                    )}
                  />

                  {/* Nature-inspired ripple effect for active item */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-green-400/20 -z-20"
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        opacity: [0.5, 0.2, 0]
                      }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                    />
                  )}
                </div>
                
                <span className={cn(
                  "text-xs mt-1 font-medium transition-colors duration-300",
                  isActive 
                    ? "text-green-700 font-semibold" 
                    : "text-gray-500 group-hover:text-green-700"
                )}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="bottomBarDot"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
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
