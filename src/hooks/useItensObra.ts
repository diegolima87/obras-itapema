import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ItemObra {
  id: string;
  obra_id: string;
  codigo: string | null;
  descricao: string;
  unidade: string;
  quantidade_total: number;
  quantidade_executada: number | null;
  percentual_executado: number | null;
  valor_unitario: number;
  valor_total: number | null;
  created_at?: string;
  updated_at?: string;
}

export const useItensObra = (obraId: string | undefined) => {
  return useQuery({
    queryKey: ["itens_obra", obraId],
    queryFn: async () => {
      if (!obraId) throw new Error("ID da obra não fornecido");
      
      const { data, error } = await supabase
        .from("itens_obra")
        .select("*")
        .eq("obra_id", obraId)
        .order("codigo");

      if (error) throw error;
      return data as ItemObra[];
    },
    enabled: !!obraId,
  });
};

export const useCriarItemObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novoItem: Omit<ItemObra, "id" | "created_at" | "updated_at">) => {
      const valorTotal = novoItem.quantidade_total * novoItem.valor_unitario;
      
      const { data, error } = await supabase
        .from("itens_obra")
        .insert({ ...novoItem, valor_total: valorTotal })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["itens_obra", variables.obra_id] });
      toast.success("Item criado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar item: " + error.message);
    },
  });
};

export const useImportarItensObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ obraId, itens }: { obraId: string; itens: Omit<ItemObra, "id" | "obra_id" | "created_at" | "updated_at">[] }) => {
      const itensComObraId = itens.map(item => ({
        ...item,
        obra_id: obraId,
        valor_total: item.quantidade_total * item.valor_unitario,
      }));

      const { data, error } = await supabase
        .from("itens_obra")
        .insert(itensComObraId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["itens_obra", variables.obraId] });
      toast.success(`${_.length} itens importados com sucesso`);
    },
    onError: (error: any) => {
      toast.error("Erro ao importar itens: " + error.message);
    },
  });
};

export const useAtualizarItemObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obra_id, ...updates }: Partial<ItemObra> & { id: string; obra_id: string }) => {
      const { data, error } = await supabase
        .from("itens_obra")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["itens_obra", variables.obra_id] });
      toast.success("Item atualizado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar item: " + error.message);
    },
  });
};

export const useDeletarItemObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obra_id }: { id: string; obra_id: string }) => {
      const { error } = await supabase
        .from("itens_obra")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["itens_obra", variables.obra_id] });
      toast.success("Item deletado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar item: " + error.message);
    },
  });
};
