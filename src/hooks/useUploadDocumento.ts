import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadDocumentoParams {
  file: File;
  tipo: string;
  bucketName: string;
  obraId?: string;
  contratoId?: string;
  medicaoId?: string;
  fornecedorId?: string;
}

export const useUploadDocumento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UploadDocumentoParams) => {
      const { file, tipo, bucketName, obraId, contratoId, medicaoId, fornecedorId } = params;

      // Validar tamanho do arquivo
      const maxSize = bucketName === 'fotos_obras' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB ou 10MB
      if (file.size > maxSize) {
        throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`);
      }

      // Validar tipo de arquivo
      const allowedTypes: Record<string, string[]> = {
        documentos_obras: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        documentos_contratos: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        documentos_medicoes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
        fotos_obras: ['image/jpeg', 'image/png', 'image/webp'],
      };

      if (!allowedTypes[bucketName]?.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido');
      }

      // Montar path único
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const entityPrefix = obraId ? `obra_${obraId}` : contratoId ? `contrato_${contratoId}` : medicaoId ? `medicao_${medicaoId}` : 'geral';
      const filePath = `${entityPrefix}/${timestamp}_${sanitizedFileName}`;

      // Upload para o Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública (se bucket for público) ou assinada
      let fileUrl: string;
      if (bucketName === 'fotos_obras') {
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        fileUrl = publicUrl;
      } else {
        const { data: signedUrlData } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(filePath, 31536000); // 1 ano
        fileUrl = signedUrlData?.signedUrl || '';
      }

      // Obter user ID
      const { data: { user } } = await supabase.auth.getUser();

      // Criar registro na tabela documentos
      const { data: documentoData, error: documentoError } = await supabase
        .from("documentos")
        .insert({
          tipo: tipo as any,
          obra_id: obraId || null,
          contrato_id: contratoId || null,
          medicao_id: medicaoId || null,
          fornecedor_id: fornecedorId || null,
          arquivo_url: fileUrl,
          arquivo_path: filePath,
          nome_original: file.name,
          nome: file.name,
          url: fileUrl,
          mime_type: file.type,
          tamanho: file.size,
          uploaded_by: user?.id || null,
        })
        .select()
        .single();

      if (documentoError) {
        // Se falhar ao criar o registro, deletar o arquivo do Storage
        await supabase.storage.from(bucketName).remove([filePath]);
        throw documentoError;
      }

      return documentoData;
    },
    onSuccess: () => {
      toast.success("Documento enviado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao enviar documento: ${error.message}`);
    },
  });
};
