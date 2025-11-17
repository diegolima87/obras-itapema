import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCurrentTenant() {
  return useQuery({
    queryKey: ['currentUserTenant'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.tenant_id) {
        console.error('❌ ERRO: Usuário sem tenant_id!', user.id);
        throw new Error('Usuário não está associado a nenhum tenant');
      }
      
      return profile;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
}
