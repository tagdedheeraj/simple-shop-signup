
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(name, email, password);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
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
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent"
          >
            Join Lakshmikrupa
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-700 mt-1 font-medium"
          >
            Access premium agricultural products worldwide
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
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-center text-emerald-700/70">
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-emerald-800 font-medium">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 group-hover:text-emerald-800 transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-white/70 pl-10 border-emerald-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-emerald-800 font-medium">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 group-hover:text-emerald-800 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/70 pl-10 border-emerald-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-emerald-800 font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 group-hover:text-emerald-800 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-white/70 pl-10 pr-10 border-emerald-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-800 transition-colors"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-emerald-800 font-medium">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 group-hover:text-emerald-800 transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-white/70 pl-10 pr-10 border-emerald-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-800 transition-colors"
                    >
                      {showConfirmPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 h-11 shadow-md shadow-emerald-500/20"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center relative z-10 pb-6">
              <p className="text-sm text-emerald-700">
                Already have an account?{' '}
                <Link to="/signin" className="font-semibold text-emerald-600 hover:text-emerald-800 hover:underline transition-colors">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-emerald-700/80">
          <p>© {new Date().getFullYear()} Lakshmikrupa Agriculture Pvt. Ltd. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
