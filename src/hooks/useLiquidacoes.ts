import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Liquidacao {
  id: string;
  tenant_id: string | null;
  medicao_id: string | null;
  contrato_id: string | null;
  numero_empenho: string;
  numero_liquidacao: string;
  data_liquidacao: string;
  valor_liquidado: number;
  observacoes: string | null;
  dados_esfinge: any;
  created_at: string;
  updated_at: string;
  medicoes?: {
    id: string;
    numero_medicao: string;
  };
  contratos?: {
    id: string;
    numero: string;
  };
}

export const useLiquidacoes = (filters?: {
  contrato_id?: string;
  medicao_id?: string;
}) => {
  return useQuery({
    queryKey: ["liquidacoes", filters],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.tenant_id) return [];
      
      let query = supabase
        .from("liquidacoes")
        .select(`
          *,
          medicoes (id, numero_medicao),
          contratos (id, numero)
        `)
        .eq("tenant_id", profile.tenant_id);

      if (filters?.contrato_id) {
        query = query.eq("contrato_id", filters.contrato_id);
      }
      if (filters?.medicao_id) {
        query = query.eq("medicao_id", filters.medicao_id);
      }

      const { data, error } = await query.order("data_liquidacao", { ascending: false });

      if (error) throw error;
      return data as Liquidacao[];
    },
  });
};
