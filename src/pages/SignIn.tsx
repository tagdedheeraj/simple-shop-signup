
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import SignInLayout from '@/components/auth/SignInLayout';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

const SignIn: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect them immediately
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("User is authenticated, redirecting...", { isAdmin });
      
      if (isAdmin) {
        console.log("Redirecting to admin panel");
        navigate('/admin');
      } else {
        console.log("Redirecting to home page");
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, navigate, loading]);

  // If authentication is in progress, show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <SignInLayout>
        <SignInForm />
      </SignInLayout>
    </div>
  );
};

export default SignIn;
