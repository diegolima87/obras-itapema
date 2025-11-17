import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Contrato {
  id: string;
  numero: string;
  modalidade: string;
  objeto: string | null;
  obra_id: string;
  fornecedor_id: string;
  valor_inicial: number;
  valor_atualizado: number;
  data_assinatura: string;
  data_vencimento: string;
  origem_recurso: string | null;
  ativo: boolean | null;
  created_at?: string;
  updated_at?: string;
  obras?: {
    id: string;
    nome: string;
  };
  fornecedores?: {
    id: string;
    nome: string;
    cnpj: string;
  };
}

export const useContratos = () => {
  return useQuery({
    queryKey: ["contratos"],
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
        .from("contratos")
        .select(`
          *,
          obras (id, nome),
          fornecedores (id, nome, cnpj)
        `)
        .eq("tenant_id", profile.tenant_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Contrato[];
    },
  });
};

export const useContrato = (id: string | undefined) => {
  return useQuery({
    queryKey: ["contratos", id],
    queryFn: async () => {
      if (!id) throw new Error("ID do contrato não fornecido");
      
      const { data, error } = await supabase
        .from("contratos")
        .select(`
          *,
          obras (
            id,
            nome,
            descricao,
            status,
            unidade_gestora,
            valor_total,
            percentual_executado
          ),
          fornecedores (
            id,
            nome,
            cnpj,
            email,
            telefone,
            endereco,
            cidade,
            estado
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Contrato;
    },
    enabled: !!id,
  });
};

export const useCriarContrato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novoContrato: Omit<Contrato, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("contratos")
        .insert(novoContrato)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
      toast.success("Contrato criado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar contrato: " + error.message);
    },
  });
};

export const useAtualizarContrato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Contrato> & { id: string }) => {
      const { data, error } = await supabase
        .from("contratos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
      queryClient.invalidateQueries({ queryKey: ["contratos", variables.id] });
      toast.success("Contrato atualizado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar contrato: " + error.message);
    },
  });
};

export const useDeletarContrato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contratos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
      toast.success("Contrato deletado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar contrato: " + error.message);
    },
  });
};
