import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Pagamento {
  id: string;
  medicao_id: string;
  contrato_id: string;
  fornecedor_id: string;
  valor: number;
  status: string | null;
  data_prevista: string | null;
  data_pagamento: string | null;
  numero_empenho: string | null;
  observacoes: string | null;
  created_at?: string;
  updated_at?: string;
  medicoes?: {
    id: string;
    numero_medicao: string;
  };
  fornecedores?: {
    id: string;
    nome: string;
  };
}

export const usePagamentos = (filters?: { status?: string }) => {
  return useQuery({
    queryKey: ["pagamentos", filters],
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
        .from("pagamentos")
        .select(`
          *,
          medicoes (id, numero_medicao),
          fornecedores (id, nome)
        `)
        .eq("tenant_id", profile.tenant_id);

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Pagamento[];
    },
  });
};

export const useCriarPagamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novoPagamento: Omit<Pagamento, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("pagamentos")
        .insert(novoPagamento)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      toast.success("Pagamento criado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar pagamento: " + error.message);
    },
  });
};

export const useAtualizarPagamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pagamento> & { id: string }) => {
      const { data, error } = await supabase
        .from("pagamentos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      toast.success("Pagamento atualizado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar pagamento: " + error.message);
    },
  });
};
