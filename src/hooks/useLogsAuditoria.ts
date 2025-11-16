import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LogAuditoria {
  id: string;
  usuario_id: string | null;
  acao: string;
  tabela: string;
  registro_id: string;
  dados_antes: any;
  dados_depois: any;
  created_at: string;
}

export interface LogAuditoriaComUsuario extends LogAuditoria {
  usuario?: {
    nome: string;
    email: string;
  };
}

export const useLogsAuditoria = (filtros?: {
  acao?: string;
  tabela?: string;
  usuario_id?: string;
  data_inicio?: string;
  data_fim?: string;
}) => {
  return useQuery({
    queryKey: ["logs-auditoria", filtros],
    queryFn: async () => {
      let query = supabase
        .from("logs_auditoria")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (filtros?.acao) {
        query = query.eq("acao", filtros.acao);
      }

      if (filtros?.tabela) {
        query = query.eq("tabela", filtros.tabela);
      }

      if (filtros?.usuario_id) {
        query = query.eq("usuario_id", filtros.usuario_id);
      }

      if (filtros?.data_inicio) {
        query = query.gte("created_at", filtros.data_inicio);
      }

      if (filtros?.data_fim) {
        query = query.lte("created_at", filtros.data_fim);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Buscar informações dos usuários
      const logsComUsuario = await Promise.all(
        (data || []).map(async (log) => {
          if (log.usuario_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("nome, email")
              .eq("id", log.usuario_id)
              .single();

            return {
              ...log,
              usuario: profile,
            };
          }
          return { ...log, usuario: null };
        })
      );

      return logsComUsuario as LogAuditoriaComUsuario[];
    },
  });
};

export const useEstatisticasAuditoria = () => {
  return useQuery({
    queryKey: ["estatisticas-auditoria"],
    queryFn: async () => {
      // Total de logs últimos 30 dias
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - 30);

      const { data: logs, error } = await supabase
        .from("logs_auditoria")
        .select("*")
        .gte("created_at", dataInicio.toISOString());

      if (error) throw error;

      // Contar ações por tipo
      const acoesPorTipo = logs.reduce((acc: Record<string, number>, log) => {
        acc[log.acao] = (acc[log.acao] || 0) + 1;
        return acc;
      }, {});

      // Contar ações por tabela
      const acoesPorTabela = logs.reduce((acc: Record<string, number>, log) => {
        acc[log.tabela] = (acc[log.tabela] || 0) + 1;
        return acc;
      }, {});

      return {
        total: logs.length,
        acoesPorTipo,
        acoesPorTabela,
      };
    },
  });
};
