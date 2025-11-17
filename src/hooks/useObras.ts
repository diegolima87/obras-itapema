import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Obra {
  id: string;
  nome: string;
  descricao: string | null;
  endereco: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  unidade_gestora: string;
  valor_total: number;
  valor_executado: number;
  percentual_executado: number;
  data_inicio: string | null;
  data_fim_prevista: string | null;
  data_fim_real: string | null;
  tipo_obra: string | null;
  publico_portal: boolean;
  engenheiro_fiscal_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useObras = () => {
  return useQuery({
    queryKey: ["obras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Obra[];
    },
  });
};

export const useObrasPublicas = () => {
  return useQuery({
    queryKey: ["obras", "publicas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .eq("publico_portal", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Obra[];
    },
  });
};

export const useObrasComLocalizacao = () => {
  return useQuery({
    queryKey: ["obras", "com-localizacao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Obra[];
    },
  });
};

export const useObra = (id: string | undefined) => {
  return useQuery({
    queryKey: ["obras", id],
    queryFn: async () => {
      if (!id) throw new Error("ID da obra não fornecido");
      
      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Obra;
    },
    enabled: !!id,
  });
};

export const useAtualizarObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Obra> & { id: string }) => {
      const { data, error } = await supabase
        .from("obras")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obras"] });
      queryClient.invalidateQueries({ queryKey: ["obras", variables.id] });
      toast.success("Obra atualizada com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar obra: " + error.message);
    },
  });
};

export const useDeletarObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("obras")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obras"] });
      toast.success("Obra excluída com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir obra: " + error.message);
    },
  });
};
