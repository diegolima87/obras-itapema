import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTenant } from "@/contexts/TenantContext";
import { Tables } from "@/integrations/supabase/types";

type TenantUpdate = Partial<Tables<"tenants">>;

const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/[^\d]/g, '');
  return cleaned.length === 14;
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

const validateSubdomain = (subdomain: string): boolean => {
  return /^[a-z0-9-]+$/.test(subdomain);
};

export function useTenantConfig() {
  const { tenant, refetchTenant } = useTenant();
  const queryClient = useQueryClient();

  const updateConfig = useMutation({
    mutationFn: async (updates: TenantUpdate) => {
      if (!tenant) {
        throw new Error("Tenant não encontrado");
      }

      // Validações
      if (updates.cnpj && !validateCNPJ(updates.cnpj)) {
        throw new Error("CNPJ inválido");
      }

      if (updates.email && !validateEmail(updates.email)) {
        throw new Error("Email inválido");
      }

      if (updates.cor_primaria && !validateHexColor(updates.cor_primaria)) {
        throw new Error("Cor primária inválida (use formato #RRGGBB)");
      }

      if (updates.cor_secundaria && !validateHexColor(updates.cor_secundaria)) {
        throw new Error("Cor secundária inválida (use formato #RRGGBB)");
      }

      if (updates.cor_destaque && !validateHexColor(updates.cor_destaque)) {
        throw new Error("Cor de destaque inválida (use formato #RRGGBB)");
      }

      if (updates.subdominio && !validateSubdomain(updates.subdominio)) {
        throw new Error("Subdomínio inválido (use apenas letras minúsculas, números e hífens)");
      }

      // Atualizar tenant
      const { error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', tenant.id);

      if (error) {
        throw new Error(`Erro ao atualizar: ${error.message}`);
      }

      return updates;
    },
    onSuccess: () => {
      toast.success("Configurações atualizadas com sucesso!");
      refetchTenant();
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return {
    tenant,
    updateConfig,
    isLoading: !tenant,
    isUpdating: updateConfig.isPending
  };
}
