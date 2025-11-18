import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTiposObra = () => {
  return useQuery({
    queryKey: ["tipos-obra"],
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
        .select("tipo_obra")
        .eq("tenant_id", profile.tenant_id)
        .not("tipo_obra", "is", null);

      if (error) throw error;
      
      const tiposUnicos = [...new Set(data.map(item => item.tipo_obra))].filter(Boolean);
      return tiposUnicos as string[];
    },
  });
};
