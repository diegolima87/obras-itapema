import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Obra } from "./useObras";
import { useTenant } from "@/contexts/TenantContext";

export interface FiltrosObras {
  bairro?: string;
  cidade?: string;
  status?: string;
  tipo_obra?: string;
  valor_min?: number;
  valor_max?: number;
}

// Hook para listar TODAS as obras públicas (com ou sem coordenadas)
export const useObrasPublicas = (filtros: FiltrosObras, tenantId?: string) => {
  return useQuery({
    queryKey: ["obras", "publicas", filtros, tenantId],
    queryFn: async () => {
      if (!tenantId) {
        console.error('❌ Tentativa de buscar obras sem tenant_id');
        return [];
      }

      let query = supabase
        .from("obras")
        .select("*")
        .eq("publico_portal", true)
        .eq("tenant_id", tenantId);

      if (filtros.bairro) {
        query = query.eq("bairro", filtros.bairro);
      }
      if (filtros.cidade) {
        query = query.eq("cidade", filtros.cidade);
      }
      if (filtros.status) {
        query = query.eq("status", filtros.status as any);
      }
      if (filtros.tipo_obra) {
        query = query.eq("tipo_obra", filtros.tipo_obra);
      }
      if (filtros.valor_min !== undefined) {
        query = query.gte("valor_total", filtros.valor_min);
      }
      if (filtros.valor_max !== undefined) {
        query = query.lte("valor_total", filtros.valor_max);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Obra[];
    },
  });
};

// Hook para obras públicas COM localização (usado pelo portal público)
export const useObrasPublicasComLocalizacao = (filtros: FiltrosObras, tenantId?: string) => {
  return useQuery({
    queryKey: ["obras", "com-localizacao", filtros, tenantId],
    queryFn: async () => {
      if (!tenantId) {
        console.error('❌ Tentativa de buscar obras com localização sem tenant_id');
        return [];
      }

      let query = supabase
        .from("obras")
        .select("*")
        .eq("publico_portal", true)
        .eq("tenant_id", tenantId)
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (filtros.bairro) {
        query = query.eq("bairro", filtros.bairro);
      }
      if (filtros.cidade) {
        query = query.eq("cidade", filtros.cidade);
      }
      if (filtros.status) {
        query = query.eq("status", filtros.status as any);
      }
      if (filtros.tipo_obra) {
        query = query.eq("tipo_obra", filtros.tipo_obra);
      }
      if (filtros.valor_min !== undefined) {
        query = query.gte("valor_total", filtros.valor_min);
      }
      if (filtros.valor_max !== undefined) {
        query = query.lte("valor_total", filtros.valor_max);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Obra[];
    },
  });
};

export const useFiltrosDisponiveis = (tenantId?: string) => {
  return useQuery({
    queryKey: ["obras", "filtros-disponiveis", tenantId],
    queryFn: async () => {
      if (!tenantId) {
        console.error('❌ Tentativa de buscar filtros sem tenant_id');
        return { bairros: [], cidades: [], status: [], tipos: [] };
      }

      const { data, error } = await supabase
        .from("obras")
        .select("bairro, cidade, status, tipo_obra")
        .eq("publico_portal", true)
        .eq("tenant_id", tenantId);

      if (error) throw error;

      // Extrair valores únicos para cada filtro
      const bairros = [...new Set(data.map(o => o.bairro).filter(Boolean))].sort();
      const cidades = [...new Set(data.map(o => o.cidade).filter(Boolean))].sort();
      const status = [...new Set(data.map(o => o.status).filter(Boolean))].sort();
      const tipos = [...new Set(data.map(o => o.tipo_obra).filter(Boolean))].sort();

      return { bairros, cidades, status, tipos };
    },
  });
};
