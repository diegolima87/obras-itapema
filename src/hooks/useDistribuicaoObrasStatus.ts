import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DadosDistribuicaoStatus {
  status: string;
  statusKey: string;
  quantidade: number;
  percentual: number;
  valor: number;
  fill: string;
}

const STATUS_LABELS: Record<string, string> = {
  planejada: "Planejada",
  andamento: "Em Andamento",
  concluida: "Concluída",
  paralisada: "Paralisada",
};

const STATUS_COLORS: Record<string, string> = {
  planejada: "hsl(217, 91%, 60%)",
  andamento: "hsl(142, 76%, 36%)",
  concluida: "hsl(215, 20%, 65%)",
  paralisada: "hsl(38, 92%, 50%)",
};

export const useDistribuicaoObrasStatus = () => {
  return useQuery({
    queryKey: ["distribuicao-obras-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.tenant_id) return [];

      const { data: obras, error } = await supabase
        .from("obras")
        .select("status, valor_total")
        .eq("tenant_id", profile.tenant_id);

      if (error) throw error;
      if (!obras || obras.length === 0) return [];

      const distribuicao = new Map<string, { quantidade: number; valor: number }>();

      obras.forEach(obra => {
        const status = obra.status || 'planejada';
        if (!distribuicao.has(status)) {
          distribuicao.set(status, { quantidade: 0, valor: 0 });
        }
        const dados = distribuicao.get(status)!;
        dados.quantidade++;
        dados.valor += Number(obra.valor_total || 0);
      });

      const totalObras = obras.length;
      const resultado: DadosDistribuicaoStatus[] = Array.from(distribuicao.entries())
        .map(([status, dados]) => ({
          status: STATUS_LABELS[status] || status,
          statusKey: status,
          quantidade: dados.quantidade,
          percentual: (dados.quantidade / totalObras) * 100,
          valor: dados.valor,
          fill: STATUS_COLORS[status] || "hsl(var(--primary))",
        }))
        .sort((a, b) => b.quantidade - a.quantidade);

      return resultado;
    },
  });
};

export { STATUS_COLORS, STATUS_LABELS };
