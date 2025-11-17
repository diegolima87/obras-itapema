import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EstatisticasDashboard {
  totalObras: number;
  obrasEmAndamento: number;
  obrasConcluidas: number;
  valorTotal: number;
  valorExecutado: number;
  percentualGeral: number;
}

export interface EstatisticasFinanceiras {
  orcamentoTotal: number;
  valorExecutado: number;
  valorEmpenhado: number;
  valorPago: number;
  percentualExecutado: number;
  percentualPago: number;
}

export const useEstatisticasDashboard = () => {
  return useQuery({
    queryKey: ["estatisticas", "dashboard"],
    queryFn: async () => {
      const { data: obras, error } = await supabase
        .from("obras")
        .select("status, valor_total, valor_executado, percentual_executado");

      if (error) throw error;

      const totalObras = obras.length;
      const obrasEmAndamento = obras.filter(o => o.status === "andamento").length;
      const obrasConcluidas = obras.filter(o => o.status === "concluida").length;
      const valorTotal = obras.reduce((sum, o) => sum + (o.valor_total || 0), 0);
      const valorExecutado = obras.reduce((sum, o) => sum + (o.valor_executado || 0), 0);
      const percentualGeral = valorTotal > 0 ? (valorExecutado / valorTotal) * 100 : 0;

      return {
        totalObras,
        obrasEmAndamento,
        obrasConcluidas,
        valorTotal,
        valorExecutado,
        percentualGeral,
      } as EstatisticasDashboard;
    },
  });
};

export const useEstatisticasFinanceiras = () => {
  return useQuery({
    queryKey: ["estatisticas", "financeiras"],
    queryFn: async () => {
      const { data: obras, error: obrasError } = await supabase
        .from("obras")
        .select("valor_total, valor_executado");

      if (obrasError) throw obrasError;

      const { data: pagamentos, error: pagamentosError } = await supabase
        .from("pagamentos")
        .select("valor, status");

      if (pagamentosError) throw pagamentosError;

      const orcamentoTotal = obras.reduce((sum, o) => sum + (o.valor_total || 0), 0);
      const valorExecutado = obras.reduce((sum, o) => sum + (o.valor_executado || 0), 0);
      const valorPago = pagamentos
        .filter(p => p.status === "pago")
        .reduce((sum, p) => sum + p.valor, 0);
      const valorEmpenhado = pagamentos.reduce((sum, p) => sum + p.valor, 0);

      return {
        orcamentoTotal,
        valorExecutado,
        valorEmpenhado,
        valorPago,
        percentualExecutado: orcamentoTotal > 0 ? (valorExecutado / orcamentoTotal) * 100 : 0,
        percentualPago: valorEmpenhado > 0 ? (valorPago / valorEmpenhado) * 100 : 0,
      } as EstatisticasFinanceiras;
    },
  });
};

export const useEstatisticasEngenheiro = (fiscalId: string | undefined) => {
  return useQuery({
    queryKey: ["estatisticas", "engenheiro", fiscalId],
    queryFn: async () => {
      if (!fiscalId) throw new Error("ID do fiscal não fornecido");

      const { data: obras, error: obrasError } = await supabase
        .from("obras")
        .select("id, status, valor_total, valor_executado")
        .eq("engenheiro_fiscal_id", fiscalId);

      if (obrasError) throw obrasError;

      const { data: medicoes, error: medicoesError } = await supabase
        .from("medicoes")
        .select("status, obra_id")
        .in("obra_id", obras.map(o => o.id));

      if (medicoesError) throw medicoesError;

      const totalObras = obras.length;
      const obrasEmAndamento = obras.filter(o => o.status === "andamento").length;
      const medicoesPendentes = medicoes.filter(m => m.status === "pendente").length;
      const valorTotal = obras.reduce((sum, o) => sum + (o.valor_total || 0), 0);

      return {
        totalObras,
        obrasEmAndamento,
        medicoesPendentes,
        valorTotal,
      };
    },
    enabled: !!fiscalId,
  });
};
