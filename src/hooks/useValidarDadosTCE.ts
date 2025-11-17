import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ErroValidacao {
  campo: string;
  mensagem: string;
  severidade: "erro" | "aviso";
}

export interface ResultadoValidacao {
  id: string;
  tipo: string;
  valido: boolean;
  erros: ErroValidacao[];
  avisos: ErroValidacao[];
}

export interface ValidacaoResponse {
  success: boolean;
  resultados: ResultadoValidacao[];
  resumo: {
    total: number;
    validos: number;
    invalidos: number;
    avisos: number;
  };
}

export const useValidarDadosTCE = () => {
  return useMutation({
    mutationFn: async ({
      tipo,
      ids,
    }: {
      tipo: "contrato" | "medicao" | "situacao_obra";
      ids: string[];
    }) => {
      const { data, error } = await supabase.functions.invoke("validar-dados-tce", {
        body: {
          tipo,
          ids,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error("Erro ao validar dados");

      return data as ValidacaoResponse;
    },
    onError: (error: Error) => {
      toast.error(`Erro ao validar dados: ${error.message}`);
    },
  });
};
