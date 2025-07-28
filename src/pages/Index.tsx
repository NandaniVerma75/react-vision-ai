import { useAuth } from '@/hooks/useAuth';
import { Playground } from '@/components/Playground';
import Landing from '@/pages/Landing';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <Playground /> : <Landing />;
};

export default Index;
