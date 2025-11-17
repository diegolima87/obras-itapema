import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check and refresh session periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const expiresAt = session.expires_at;
        const now = Math.floor(Date.now() / 1000);
        
        // If token expires in less than 5 minutes, refresh it
        if (expiresAt && (expiresAt - now < 300)) {
          console.log('Token próximo de expirar, renovando...');
          const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error('Erro ao renovar sessão:', error);
            await supabase.auth.signOut();
          } else if (newSession) {
            setSession(newSession);
            setUser(newSession.user);
          }
        }
      }
    }, 45 * 60 * 1000); // Check every 45 minutes

    return () => clearInterval(interval);
  }, []);

  const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Erro ao renovar sessão:', error);
      await supabase.auth.signOut();
      return null;
    }
    
    setSession(session);
    setUser(session?.user ?? null);
    return session;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      return { data, error: null };
    } catch (error: any) {
      const errorMessage = error.message === 'Invalid login credentials'
        ? 'Email ou senha incorretos'
        : error.message;
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      // Obter tenant_id do contexto baseado no hostname
      const hostname = window.location.hostname;
      let tenantSlug = 'itampema'; // default
      
      if (hostname.includes('.obrasdigital.com.br')) {
        tenantSlug = hostname.split('.')[0];
      } else if (hostname.includes('localhost')) {
        tenantSlug = 'itampema';
      }
      
      // Buscar tenant_id pelo slug ou subdominio
      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id')
        .or(`slug.eq.${tenantSlug},subdominio.eq.${tenantSlug}`)
        .single();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: nome,
            tenant_id: tenantData?.id,
          }
        }
      });

      if (error) throw error;

      toast.success('Conta criada! Verifique seu email para confirmar.');
      return { data, error: null };
    } catch (error: any) {
      const errorMessage = error.message === 'User already registered'
        ? 'Este email já está cadastrado'
        : error.message;
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logout realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      toast.error('Erro ao fazer logout');
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };
}
