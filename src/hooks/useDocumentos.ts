import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Documento {
  id: string;
  tipo: string;
  obra_id: string | null;
  contrato_id: string | null;
  medicao_id: string | null;
  fornecedor_id: string | null;
  arquivo_url: string | null;
  arquivo_path: string | null;
  nome_original: string | null;
  nome: string;
  url: string;
  mime_type: string | null;
  tamanho: number;
  uploaded_by: string | null;
  created_at: string;
}

interface UseDocumentosParams {
  obraId?: string;
  contratoId?: string;
  medicaoId?: string;
  fornecedorId?: string;
}

export const useDocumentos = (params: UseDocumentosParams) => {
  const { obraId, contratoId, medicaoId, fornecedorId } = params;

  return useQuery({
    queryKey: ["documentos", params],
    queryFn: async () => {
      let query = supabase.from("documentos").select("*");

      if (obraId) query = query.eq("obra_id", obraId);
      if (contratoId) query = query.eq("contrato_id", contratoId);
      if (medicaoId) query = query.eq("medicao_id", medicaoId);
      if (fornecedorId) query = query.eq("fornecedor_id", fornecedorId);

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Documento[];
    },
    enabled: !!(obraId || contratoId || medicaoId || fornecedorId),
  });
};
