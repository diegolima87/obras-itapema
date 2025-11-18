import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ObraFiltro {
  id: string;
  nome: string;
}

export const useObrasParaFiltro = () => {
  return useQuery({
    queryKey: ["obras-filtro"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.tenant_id) return [];

      const { data, error } = await supabase
        .from("obras")
        .select("id, nome")
        .eq("tenant_id", profile.tenant_id)
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as ObraFiltro[];
    },
  });
};
