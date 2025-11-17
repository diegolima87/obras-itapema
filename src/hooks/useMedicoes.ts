import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Medicao {
  id: string;
  numero_medicao: string;
  obra_id: string;
  contrato_id: string;
  fornecedor_id: string;
  etapa: string | null;
  descricao: string | null;
  percentual_executado: number | null;
  percentual_fisico: number | null;
  percentual_financeiro: number | null;
  valor_executado: number | null;
  valor_medido: number | null;
  status: "pendente" | "analise" | "aprovado" | "reprovado" | null;
  data_envio: string | null;
  data_aprovacao: string | null;
  competencia: string | null;
  observacoes: string | null;
  criado_por: string | null;
  aprovado_por: string | null;
  created_at?: string;
  updated_at?: string;
  obras?: {
    id: string;
    nome: string;
  };
  contratos?: {
    id: string;
    numero: string;
  };
  fornecedores?: {
    id: string;
    nome: string;
  };
}

export const useMedicoes = (filters?: {
  status?: string;
  obra_id?: string;
  fornecedor_id?: string;
}) => {
  return useQuery({
    queryKey: ["medicoes", filters],
    queryFn: async () => {
      let query = supabase
        .from("medicoes")
        .select(`
          *,
          obras (id, nome),
          contratos (id, numero),
          fornecedores (id, nome)
        `);

      if (filters?.status) {
        query = query.eq("status", filters.status as any);
      }
      if (filters?.obra_id) {
        query = query.eq("obra_id", filters.obra_id);
      }
      if (filters?.fornecedor_id) {
        query = query.eq("fornecedor_id", filters.fornecedor_id);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Medicao[];
    },
  });
};

export const useCriarMedicao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novaMedicao: Omit<Medicao, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("medicoes")
        .insert([novaMedicao])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicoes"] });
      toast.success("Medição criada com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar medição: " + error.message);
    },
  });
};
