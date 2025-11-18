import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface DadosObraMensal {
  mes: string;
  mesData: Date;
  [key: string]: number | string | Date;
}

export interface ObraInfo {
  id: string;
  nome: string;
  nomeAbreviado: string;
  cor: string;
}

const CORES_OBRAS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 100%, 65%)",
  "hsl(340, 82%, 52%)",
  "hsl(199, 89%, 48%)",
  "hsl(45, 93%, 47%)",
  "hsl(28, 80%, 52%)",
];

export const useEvolucaoObrasPorObra = (
  mesesRetroativos: number = 12,
  limitarObras: number = 8,
  dataInicial?: Date | null,
  dataFinal?: Date | null
) => {
  return useQuery({
    queryKey: ["evolucao-obras-por-obra", mesesRetroativos, limitarObras, dataInicial, dataFinal],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { dadosMensais: [], obrasInfo: [] };
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.tenant_id) return { dadosMensais: [], obrasInfo: [] };

      let dataLimite: Date;
      let dataFim: Date = new Date();

      if (dataInicial && dataFinal) {
        dataLimite = dataInicial;
        dataFim = dataFinal;
      } else {
        dataLimite = new Date();
        dataLimite.setMonth(dataLimite.getMonth() - mesesRetroativos);
      }

      const { data: medicoes, error } = await supabase
        .from("medicoes")
        .select(`
          competencia,
          valor_executado,
          obra_id,
          obras!inner(id, nome)
        `)
        .eq("tenant_id", profile.tenant_id)
        .eq("status", "aprovado")
        .gte("competencia", dataLimite.toISOString().split('T')[0])
        .lte("competencia", dataFim.toISOString().split('T')[0])
        .order("competencia", { ascending: true });

      if (error) throw error;
      if (!medicoes || medicoes.length === 0) return { dadosMensais: [], obrasInfo: [] };

      const valorPorObra = new Map<string, { nome: string; valor: number }>();
      
      medicoes.forEach(medicao => {
        const obraId = medicao.obra_id;
        const obraNome = medicao.obras?.nome || 'Sem nome';
        const valor = Number(medicao.valor_executado || 0);
        
        if (!valorPorObra.has(obraId)) {
          valorPorObra.set(obraId, { nome: obraNome, valor: 0 });
        }
        valorPorObra.get(obraId)!.valor += valor;
      });

      const topObras = Array.from(valorPorObra.entries())
        .sort((a, b) => b[1].valor - a[1].valor)
        .slice(0, limitarObras)
        .map(([id]) => id);

      const obrasInfo: ObraInfo[] = topObras.map((obraId, index) => {
        const info = valorPorObra.get(obraId)!;
        return {
          id: obraId,
          nome: info.nome,
          nomeAbreviado: info.nome.length > 25 ? info.nome.substring(0, 25) + '...' : info.nome,
          cor: CORES_OBRAS[index % CORES_OBRAS.length],
        };
      });

      const dadosPorMes = new Map<string, {
        mesData: Date;
        obras: Map<string, number>;
      }>();

      medicoes.forEach(medicao => {
        if (!medicao.competencia) return;
        if (!topObras.includes(medicao.obra_id)) return;

        const data = parseISO(medicao.competencia);
        const mesChave = format(startOfMonth(data), "MMM/yy", { locale: ptBR });

        if (!dadosPorMes.has(mesChave)) {
          dadosPorMes.set(mesChave, {
            mesData: startOfMonth(data),
            obras: new Map(),
          });
        }

        const dados = dadosPorMes.get(mesChave)!;
        const valorAtual = dados.obras.get(medicao.obra_id) || 0;
        dados.obras.set(medicao.obra_id, valorAtual + Number(medicao.valor_executado || 0));
      });

      const dadosMensais: DadosObraMensal[] = Array.from(dadosPorMes.entries())
        .map(([mes, dados]) => {
          const registro: DadosObraMensal = {
            mes,
            mesData: dados.mesData,
          };

          obrasInfo.forEach(obra => {
            registro[obra.id] = dados.obras.get(obra.id) || 0;
          });

          return registro;
        })
        .sort((a, b) => a.mesData.getTime() - b.mesData.getTime());

      return { dadosMensais, obrasInfo };
    },
  });
};
