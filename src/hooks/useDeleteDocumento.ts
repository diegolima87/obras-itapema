import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteDocumentoParams {
  documentoId: string;
  bucketName: string;
  filePath: string;
}

export const useDeleteDocumento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentoId, bucketName, filePath }: DeleteDocumentoParams) => {
      // Deletar do Storage primeiro
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) throw storageError;

      // Deletar registro da tabela
      const { error: dbError } = await supabase
        .from("documentos")
        .delete()
        .eq("id", documentoId);

      if (dbError) throw dbError;

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Documento excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir documento: ${error.message}`);
    },
  });
};
