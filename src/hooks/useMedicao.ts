import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Medicao {
  id: string;
  obra_id: string;
  contrato_id: string;
  fornecedor_id: string;
  numero_medicao: string;
  competencia: string | null;
  data_envio: string | null;
  data_aprovacao: string | null;
  status: string;
  etapa: string | null;
  descricao: string | null;
  valor_executado: number | null;
  valor_medido: number | null;
  percentual_executado: number | null;
  percentual_fisico: number | null;
  percentual_financeiro: number | null;
  observacoes: string | null;
  aprovado_por: string | null;
  criado_por: string | null;
  created_at: string;
  updated_at: string;
}

export const useMedicao = (id: string) => {
  return useQuery({
    queryKey: ["medicao", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicoes")
        .select(`
          *,
          obra:obras(*),
          contrato:contratos(*),
          fornecedor:fornecedores(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useEnviarMedicao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicaoId: string) => {
      const { data, error } = await supabase
        .from("medicoes")
        .update({ 
          status: "analise",
          data_envio: new Date().toISOString(),
        })
        .eq("id", medicaoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicao"] });
      toast.success("Medição enviada para análise com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao enviar medição: ${error.message}`);
    },
  });
};

export const useAprovarMedicao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicaoId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("medicoes")
        .update({ 
          status: "aprovado",
          data_aprovacao: new Date().toISOString(),
          aprovado_por: user?.id,
        })
        .eq("id", medicaoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicao"] });
      toast.success("Medição aprovada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao aprovar medição: ${error.message}`);
    },
  });
};

export const useReprovarMedicao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ medicaoId, motivo }: { medicaoId: string; motivo: string }) => {
      const { data, error } = await supabase
        .from("medicoes")
        .update({ 
          status: "reprovado",
          observacoes: motivo,
        })
        .eq("id", medicaoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicao"] });
      toast.success("Medição reprovada!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reprovar medição: ${error.message}`);
    },
  });
};
