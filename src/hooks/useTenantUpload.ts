import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTenant } from "@/contexts/TenantContext";

interface UploadTenantAssetParams {
  file: File;
  type: 'logo_url' | 'logo_dark_url' | 'favicon_url';
}

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FAVICON_SIZE = 500 * 1024; // 500KB

const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const ALLOWED_FAVICON_TYPES = ['image/x-icon', 'image/png', 'image/vnd.microsoft.icon'];

export function useTenantUpload() {
  const { tenant, refetchTenant } = useTenant();
  const queryClient = useQueryClient();

  const uploadAsset = useMutation({
    mutationFn: async ({ file, type }: UploadTenantAssetParams) => {
      if (!tenant) {
        throw new Error("Tenant não encontrado");
      }

      // Validar tipo de arquivo
      const allowedTypes = type === 'favicon_url' ? ALLOWED_FAVICON_TYPES : ALLOWED_LOGO_TYPES;
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Tipo de arquivo não permitido. Use: ${allowedTypes.join(', ')}`);
      }

      // Validar tamanho
      const maxSize = type === 'favicon_url' ? MAX_FAVICON_SIZE : MAX_LOGO_SIZE;
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / 1024 / 1024;
        throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      }

      // Gerar nome único
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      const fileName = `${tenant.slug}_${type}_${timestamp}.${ext}`;
      const filePath = `${tenant.id}/${fileName}`;

      // Upload para storage
      const { error: uploadError } = await supabase.storage
        .from('tenant_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('tenant_assets')
        .getPublicUrl(filePath);

      // Atualizar tenant no banco
      const { error: updateError } = await supabase
        .from('tenants')
        .update({ [type]: publicUrl })
        .eq('id', tenant.id);

      if (updateError) {
        throw new Error(`Erro ao atualizar tenant: ${updateError.message}`);
      }

      return publicUrl;
    },
    onSuccess: (_, { type }) => {
      const labels = {
        logo_url: 'Logo principal',
        logo_dark_url: 'Logo escura',
        favicon_url: 'Favicon'
      };
      
      toast.success(`${labels[type]} atualizado com sucesso!`);
      refetchTenant();
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const removeAsset = useMutation({
    mutationFn: async (type: 'logo_url' | 'logo_dark_url' | 'favicon_url') => {
      if (!tenant) {
        throw new Error("Tenant não encontrado");
      }

      const { error } = await supabase
        .from('tenants')
        .update({ [type]: null })
        .eq('id', tenant.id);

      if (error) {
        throw new Error(`Erro ao remover: ${error.message}`);
      }
    },
    onSuccess: () => {
      toast.success("Imagem removida com sucesso!");
      refetchTenant();
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return { 
    uploadAsset, 
    removeAsset,
    isUploading: uploadAsset.isPending || removeAsset.isPending
  };
}
