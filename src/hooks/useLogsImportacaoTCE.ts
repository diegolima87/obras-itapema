import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LogImportacaoTCE {
  id: string;
  data_importacao: string;
  tipo: string;
  registros_importados: number;
  registros_atualizados: number;
  registros_erros: number;
  status: string;
  mensagem_erro: string | null;
  detalhes: any;
  tempo_execucao_ms: number | null;
  created_at: string;
}

export const useLogsImportacaoTCE = (filters?: {
  status?: string;
  tipo?: string;
}) => {
  return useQuery({
    queryKey: ["logs-importacao-tce", filters],
    queryFn: async () => {
      let query = supabase
        .from("logs_importacao_tce")
        .select("*")
        .order("data_importacao", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.tipo) {
        query = query.eq("tipo", filters.tipo);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data as LogImportacaoTCE[];
    },
  });
};

export const useExecutarImportacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("importar-esfinge");

      if (error) throw error;
      if (!data.success) throw new Error("Erro ao executar importação");

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs-importacao-tce"] });
      queryClient.invalidateQueries({ queryKey: ["liquidacoes"] });
      toast.success("Importação iniciada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao iniciar importação: ${error.message}`);
    },
  });
};
