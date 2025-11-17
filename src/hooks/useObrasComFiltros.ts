import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Obra } from "./useObras";

export interface FiltrosObras {
  bairro?: string;
  cidade?: string;
  status?: string;
  tipo_obra?: string;
  valor_min?: number;
  valor_max?: number;
}

// Hook para listar TODAS as obras públicas (com ou sem coordenadas)
export const useObrasPublicas = (filtros: FiltrosObras) => {
  return useQuery({
    queryKey: ["obras", "publicas", filtros],
    queryFn: async () => {
      let query = supabase
        .from("obras")
        .select("*")
        .eq("publico_portal", true);

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

// Hook para obras COM localização (usado pelo mapa)
export const useObrasComLocalizacao = (filtros: FiltrosObras) => {
  return useQuery({
    queryKey: ["obras", "com-localizacao", filtros],
    queryFn: async () => {
      let query = supabase
        .from("obras")
        .select("*")
        .eq("publico_portal", true)
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

export const useFiltrosDisponiveis = () => {
  return useQuery({
    queryKey: ["obras", "filtros-disponiveis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obras")
        .select("bairro, cidade, status, tipo_obra")
        .eq("publico_portal", true);

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
