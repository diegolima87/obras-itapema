import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MedicaoItem {
  id: string;
  medicao_id: string;
  item_obra_id: string;
  quantidade_executada: number;
  quantidade_prevista: number | null;
  valor_executado: number;
  valor_unitario: number | null;
  valor_total: number | null;
  created_at: string;
}

export const useMedicoesItens = (medicaoId: string) => {
  return useQuery({
    queryKey: ["medicoes-itens", medicaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicoes_itens")
        .select(`
          *,
          item_obra:itens_obra(*)
        `)
        .eq("medicao_id", medicaoId);

      if (error) throw error;
      return data;
    },
    enabled: !!medicaoId,
  });
};

export const useSalvarMedicoesItens = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itens: Partial<MedicaoItem>[]) => {
      const { data, error } = await supabase
        .from("medicoes_itens")
        .upsert(itens as any)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.length > 0 && variables[0].medicao_id) {
        queryClient.invalidateQueries({ 
          queryKey: ["medicoes-itens", variables[0].medicao_id] 
        });
      }
      toast.success("Itens salvos com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar itens: ${error.message}`);
    },
  });
};

export const useDeletarMedicaoItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("medicoes_itens")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicoes-itens"] });
      toast.success("Item removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover item: ${error.message}`);
    },
  });
};
