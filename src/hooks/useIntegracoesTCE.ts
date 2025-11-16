import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface IntegracaoTCE {
  id: string;
  tipo: "contrato" | "aditivo" | "medicao" | "situacao_obra";
  referencia_id: string;
  payload_enviado: any;
  payload_resposta: any;
  status: "sucesso" | "erro" | "pendente";
  mensagem_erro: string | null;
  protocolo: string | null;
  enviado_por: string | null;
  created_at: string;
  updated_at: string;
}

export const useIntegracoesTCE = (filtros?: {
  tipo?: string;
  referenciaId?: string;
}) => {
  return useQuery({
    queryKey: ["integracoes-tce", filtros],
    queryFn: async () => {
      let query = supabase
        .from("integracoes_tce")
        .select("*")
        .order("created_at", { ascending: false });

      if (filtros?.tipo) {
        query = query.eq("tipo", filtros.tipo);
      }
      if (filtros?.referenciaId) {
        query = query.eq("referencia_id", filtros.referenciaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as IntegracaoTCE[];
    },
  });
};

export const useIntegracaoTCE = (id: string) => {
  return useQuery({
    queryKey: ["integracao-tce", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integracoes_tce")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as IntegracaoTCE;
    },
    enabled: !!id,
  });
};

export const useEnviarTCE = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tipo,
      referenciaId,
      dados,
    }: {
      tipo: IntegracaoTCE["tipo"];
      referenciaId: string;
      dados?: any;
    }) => {
      const { data, error } = await supabase.functions.invoke("enviar-tce", {
        body: {
          tipo,
          referenciaId,
          dados,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Erro ao enviar dados");

      return data.data as IntegracaoTCE;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integracoes-tce"] });
      toast.success("Dados enviados ao e-Sfinge/TCE com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao enviar dados: ${error.message}`);
    },
  });
};
