import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token renovado com sucesso');
        }
        
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
        
        if (event === 'USER_UPDATED' && !session) {
          toast.error('Sessão expirada. Faça login novamente.');
          navigate('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);
};
