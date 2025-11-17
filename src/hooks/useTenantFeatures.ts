import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentTenant } from "./useCurrentTenant";
import { useIsSuperAdmin } from "./useUserRoles";

export type FeatureType = 'esfinge' | 'portal_publico' | 'integracao_tce';

export function useTenantFeatures() {
  const { data: currentTenant } = useCurrentTenant();
  
  return useQuery({
    queryKey: ['tenant-features', currentTenant?.tenant_id],
    queryFn: async () => {
      if (!currentTenant?.tenant_id) return [];
      
      const { data, error } = await supabase
        .from('tenant_features')
        .select('*')
        .eq('tenant_id', currentTenant.tenant_id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTenant?.tenant_id,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
}

export function useFeatureEnabled(feature: FeatureType) {
  const { data: features = [], isLoading } = useTenantFeatures();
  const { isSuperAdmin } = useIsSuperAdmin();
  
  const featureData = features.find(f => f.feature === feature);
  
  return {
    isEnabled: featureData?.habilitado || isSuperAdmin || false,
    isLoading,
    feature: featureData,
  };
}
