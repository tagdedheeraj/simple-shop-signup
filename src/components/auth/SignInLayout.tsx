
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SignInLayoutProps {
  children: React.ReactNode;
}

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-6">
        <motion.img 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          src="/lovable-uploads/2a6a68af-beec-4906-b6e9-5eb249505820.png" 
          alt="Lakshmikrupa Agriculture Pvt. Ltd." 
          className="mx-auto w-48 h-auto mb-4"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-accent text-emerald-700 mt-2 font-medium tracking-wide"
        >
          Fresh Agricultural Products Direct to You
        </motion.p>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-emerald-100 shadow-xl backdrop-blur-sm bg-white/90 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/10 pointer-events-none rounded-xl" />
          
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-tr from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <CardHeader className="space-y-1 relative z-10">
            <CardTitle className="text-3xl font-heading font-bold text-center bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="font-accent text-center text-emerald-700/70 tracking-wide">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            {children}
          </CardContent>
          
          <CardFooter className="flex justify-center relative z-10 pb-6">
            <p className="text-sm font-accent text-emerald-700">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-800 hover:underline transition-colors">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      
      <div className="mt-8 text-center text-sm font-accent text-emerald-700/80">
        <p>© {new Date().getFullYear()} Lakshmikrupa Agriculture Pvt. Ltd. All rights reserved.</p>
      </div>
    </motion.div>
  );
};

export default SignInLayout;
