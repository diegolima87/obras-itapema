import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Aditivo {
  id: string;
  contrato_id: string;
  numero: string;
  tipo: string;
  data_assinatura: string;
  valor_aditado: number | null;
  prazo_aditado: number | null;
  nova_data_vencimento: string | null;
  justificativa: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useAditivos = (contratoId: string | undefined) => {
  return useQuery({
    queryKey: ["aditivos", contratoId],
    queryFn: async () => {
      if (!contratoId) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.tenant_id) return [];
      
      const { data, error } = await supabase
        .from("aditivos")
        .select("*")
        .eq("contrato_id", contratoId)
        .eq("tenant_id", profile.tenant_id)
        .order("data_assinatura", { ascending: false });

      if (error) throw error;
      return data as Aditivo[];
    },
    enabled: !!contratoId,
  });
};

export const useCriarAditivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novoAditivo: Omit<Aditivo, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("aditivos")
        .insert(novoAditivo)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["aditivos", variables.contrato_id] });
      queryClient.invalidateQueries({ queryKey: ["contratos", variables.contrato_id] });
      toast.success("Aditivo criado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar aditivo: " + error.message);
    },
  });
};

export const useAtualizarAditivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, contrato_id, ...updates }: Partial<Aditivo> & { id: string; contrato_id: string }) => {
      const { data, error } = await supabase
        .from("aditivos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["aditivos", variables.contrato_id] });
      queryClient.invalidateQueries({ queryKey: ["contratos", variables.contrato_id] });
      toast.success("Aditivo atualizado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar aditivo: " + error.message);
    },
  });
};
