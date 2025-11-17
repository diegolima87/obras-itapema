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
      
      return profile;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
}
