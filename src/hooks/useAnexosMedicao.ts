import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnexoMedicao {
  id: string;
  medicao_id: string;
  tipo: "foto" | "video" | "diario_obra" | "documento_tecnico";
  url: string;
  arquivo_path: string | null;
  nome_original: string | null;
  mime_type: string | null;
  tamanho: number | null;
  descricao: string | null;
  criado_por: string | null;
  created_at: string;
}

export const useAnexosMedicao = (medicaoId: string) => {
  return useQuery({
    queryKey: ["anexos-medicao", medicaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anexos_medicao")
        .select("*")
        .eq("medicao_id", medicaoId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AnexoMedicao[];
    },
    enabled: !!medicaoId,
  });
};

export const useUploadAnexoMedicao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      medicaoId,
      file,
      tipo,
      descricao,
    }: {
      medicaoId: string;
      file: File;
      tipo: AnexoMedicao["tipo"];
      descricao?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split(".").pop();
      const fileName = `${medicaoId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("anexos_medicoes")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("anexos_medicoes")
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from("anexos_medicao")
        .insert({
          medicao_id: medicaoId,
          tipo,
          url: publicUrl,
          arquivo_path: fileName,
          nome_original: file.name,
          mime_type: file.type,
          tamanho: file.size,
          descricao,
          criado_por: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ["anexos-medicao", data.medicao_id] 
      });
      toast.success("Anexo enviado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao enviar anexo: ${error.message}`);
    },
  });
};

export const useDeletarAnexoMedicao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (anexoId: string) => {
      const { data: anexo, error: fetchError } = await supabase
        .from("anexos_medicao")
        .select("*")
        .eq("id", anexoId)
        .single();

      if (fetchError) throw fetchError;

      if (anexo.arquivo_path) {
        const { error: deleteStorageError } = await supabase.storage
          .from("anexos_medicoes")
          .remove([anexo.arquivo_path]);

        if (deleteStorageError) throw deleteStorageError;
      }

      const { error: deleteError } = await supabase
        .from("anexos_medicao")
        .delete()
        .eq("id", anexoId);

      if (deleteError) throw deleteError;

      return anexo.medicao_id;
    },
    onSuccess: (medicaoId) => {
      queryClient.invalidateQueries({ 
        queryKey: ["anexos-medicao", medicaoId] 
      });
      toast.success("Anexo removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover anexo: ${error.message}`);
    },
  });
};
