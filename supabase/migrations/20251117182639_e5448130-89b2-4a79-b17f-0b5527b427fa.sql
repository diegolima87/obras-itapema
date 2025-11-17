-- Criar tabela de liquidações
CREATE TABLE public.liquidacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id),
  medicao_id UUID REFERENCES public.medicoes(id),
  contrato_id UUID REFERENCES public.contratos(id),
  numero_empenho TEXT NOT NULL,
  numero_liquidacao TEXT NOT NULL,
  data_liquidacao DATE NOT NULL,
  valor_liquidado NUMERIC NOT NULL,
  observacoes TEXT,
  dados_esfinge JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de logs de importação TCE
CREATE TABLE public.logs_importacao_tce (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_importacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tipo TEXT NOT NULL,
  registros_importados INT DEFAULT 0,
  registros_atualizados INT DEFAULT 0,
  registros_erros INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processando',
  mensagem_erro TEXT,
  detalhes JSONB,
  tempo_execucao_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.liquidacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_importacao_tce ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para liquidacoes
CREATE POLICY "Admin/gestor podem gerenciar liquidações"
  ON public.liquidacoes
  FOR ALL
  USING (
    has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'gestor')
  );

CREATE POLICY "Usuários podem visualizar liquidações do seu tenant"
  ON public.liquidacoes
  FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- Políticas RLS para logs_importacao_tce
CREATE POLICY "Admin/gestor podem visualizar logs de importação"
  ON public.logs_importacao_tce
  FOR SELECT
  USING (
    has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'gestor')
  );

CREATE POLICY "Admin/gestor podem inserir logs"
  ON public.logs_importacao_tce
  FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'gestor')
  );

-- Índices para melhor performance
CREATE INDEX idx_liquidacoes_medicao_id ON public.liquidacoes(medicao_id);
CREATE INDEX idx_liquidacoes_contrato_id ON public.liquidacoes(contrato_id);
CREATE INDEX idx_liquidacoes_tenant_id ON public.liquidacoes(tenant_id);
CREATE INDEX idx_logs_importacao_data ON public.logs_importacao_tce(data_importacao DESC);
CREATE INDEX idx_logs_importacao_status ON public.logs_importacao_tce(status);

-- Trigger para atualizar updated_at em liquidacoes
CREATE TRIGGER update_liquidacoes_updated_at
  BEFORE UPDATE ON public.liquidacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.liquidacoes IS 'Armazena liquidações importadas do e-Sfinge TCE/SC';
COMMENT ON TABLE public.logs_importacao_tce IS 'Registra histórico de importações automáticas do e-Sfinge';
COMMENT ON COLUMN public.liquidacoes.dados_esfinge IS 'JSON bruto dos dados recebidos do e-Sfinge';
COMMENT ON COLUMN public.logs_importacao_tce.detalhes IS 'Detalhes técnicos da importação (erros, avisos, etc)';