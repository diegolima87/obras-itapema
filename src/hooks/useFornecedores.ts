import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  ativo: boolean | null;
  user_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useFornecedores = () => {
  return useQuery({
    queryKey: ["fornecedores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data as Fornecedor[];
    },
  });
};

export const useFornecedor = (id: string | undefined) => {
  return useQuery({
    queryKey: ["fornecedores", id],
    queryFn: async () => {
      if (!id) throw new Error("ID do fornecedor não fornecido");
      
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Fornecedor;
    },
    enabled: !!id,
  });
};

export const useCriarFornecedor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novoFornecedor: Omit<Fornecedor, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("fornecedores")
        .insert(novoFornecedor)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast.success("Fornecedor criado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar fornecedor: " + error.message);
    },
  });
};

export const useAtualizarFornecedor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Fornecedor> & { id: string }) => {
      const { data, error } = await supabase
        .from("fornecedores")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      queryClient.invalidateQueries({ queryKey: ["fornecedores", variables.id] });
      toast.success("Fornecedor atualizado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar fornecedor: " + error.message);
    },
  });
};

export const useDeletarFornecedor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast.success("Fornecedor deletado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar fornecedor: " + error.message);
    },
  });
};
