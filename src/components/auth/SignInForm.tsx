
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('कृपया अपना email enter करें');
      return;
    }
    
    if (!password.trim()) {
      toast.error('कृपया अपना password enter करें');
      return;
    }
    
    if (isSubmitting) {
      console.log("Submit already in progress, ignoring");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("=== SIGNIN FORM: ATTEMPTING LOGIN ===", { email });
      const result = await login(email, password);
      console.log("=== SIGNIN FORM: LOGIN RESULT ===", result);
      
      if (result.success) {
        console.log("=== SIGNIN FORM: LOGIN SUCCESSFUL ===", { isAdmin: result.isAdmin });
        
        // Small delay to let state update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Navigate based on admin status
        if (result.isAdmin || email === 'admin@example.com') {
          console.log("SignInForm: Redirecting admin to admin panel");
          navigate('/admin', { replace: true });
        } else {
          console.log("SignInForm: Redirecting regular user to home");
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error("SignInForm: Login error:", error);
      toast.error('Login में कोई समस्या हुई है');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-emerald-800 font-accent font-medium tracking-wide">Email</Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-emerald-600 group-hover:text-emerald-800 transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-accent bg-white/70 pl-10 border-emerald-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-emerald-800 font-accent font-medium tracking-wide">Password</Label>
          <Link to="/forgot-password" className="text-xs font-accent text-emerald-600 hover:text-emerald-800 hover:underline transition-colors">
            Forgot password?
          </Link>
        </div>
        
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-emerald-600 group-hover:text-emerald-800 transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="font-accent bg-white/70 pl-10 pr-10 border-emerald-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            {showPassword ? 
              <EyeOff className="h-4.5 w-4.5" /> : 
              <Eye className="h-4.5 w-4.5" />
            }
          </button>
        </div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="pt-2"
      >
        <Button 
          type="submit" 
          className="w-full font-accent tracking-wide font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 h-11 shadow-md shadow-emerald-500/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
              <span className="font-accent">Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4.5 w-4.5" />
              <span className="font-accent">Sign In</span>
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default SignInForm;
