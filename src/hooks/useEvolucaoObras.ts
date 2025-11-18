import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface DadosEvolucaoMensal {
  mes: string;
  mesData: Date;
  percentualFisico: number;
  percentualFinanceiro: number;
  valorExecutado: number;
  numeroMedicoes: number;
}

export const useEvolucaoObras = (mesesRetroativos: number = 12) => {
  return useQuery({
    queryKey: ["evolucao-obras", mesesRetroativos],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.tenant_id) return [];

      const dataLimite = new Date();
      dataLimite.setMonth(dataLimite.getMonth() - mesesRetroativos);

      const { data: medicoes, error } = await supabase
        .from("medicoes")
        .select("competencia, percentual_fisico, percentual_financeiro, valor_executado, status")
        .eq("tenant_id", profile.tenant_id)
        .eq("status", "aprovado")
        .gte("competencia", dataLimite.toISOString().split('T')[0])
        .order("competencia", { ascending: true });

      if (error) throw error;
      if (!medicoes || medicoes.length === 0) return [];

      const dadosPorMes = new Map<string, {
        percentualFisico: number[];
        percentualFinanceiro: number[];
        valorExecutado: number;
        numeroMedicoes: number;
        mesData: Date;
      }>();

      medicoes.forEach(medicao => {
        if (!medicao.competencia) return;

        const data = parseISO(medicao.competencia);
        const mesChave = format(startOfMonth(data), "MMM/yy", { locale: ptBR });

        if (!dadosPorMes.has(mesChave)) {
          dadosPorMes.set(mesChave, {
            percentualFisico: [],
            percentualFinanceiro: [],
            valorExecutado: 0,
            numeroMedicoes: 0,
            mesData: startOfMonth(data),
          });
        }

        const dados = dadosPorMes.get(mesChave)!;
        
        if (medicao.percentual_fisico !== null) {
          dados.percentualFisico.push(Number(medicao.percentual_fisico));
        }
        if (medicao.percentual_financeiro !== null) {
          dados.percentualFinanceiro.push(Number(medicao.percentual_financeiro));
        }
        dados.valorExecutado += Number(medicao.valor_executado || 0);
        dados.numeroMedicoes++;
      });

      const resultado: DadosEvolucaoMensal[] = Array.from(dadosPorMes.entries())
        .map(([mes, dados]) => ({
          mes,
          mesData: dados.mesData,
          percentualFisico: dados.percentualFisico.length > 0
            ? dados.percentualFisico.reduce((a, b) => a + b, 0) / dados.percentualFisico.length
            : 0,
          percentualFinanceiro: dados.percentualFinanceiro.length > 0
            ? dados.percentualFinanceiro.reduce((a, b) => a + b, 0) / dados.percentualFinanceiro.length
            : 0,
          valorExecutado: dados.valorExecutado,
          numeroMedicoes: dados.numeroMedicoes,
        }))
        .sort((a, b) => a.mesData.getTime() - b.mesData.getTime());

      return resultado;
    },
  });
};
