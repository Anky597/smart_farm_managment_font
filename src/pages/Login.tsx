
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Leaf className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">FarmSense</h1>
      </div>
      
      <LoginForm />
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Enter your credentials to access the dashboard
      </p>
    </div>
  );
};

export default Login;
