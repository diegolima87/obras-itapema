-- Criar tabela de integrações com TCE/e-Sfinge
CREATE TABLE IF NOT EXISTS public.integracoes_tce (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('contrato', 'aditivo', 'medicao', 'situacao_obra')),
  referencia_id UUID NOT NULL,
  payload_enviado JSONB NOT NULL,
  payload_resposta JSONB,
  status TEXT NOT NULL CHECK (status IN ('sucesso', 'erro', 'pendente')) DEFAULT 'pendente',
  mensagem_erro TEXT,
  protocolo TEXT,
  enviado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.integracoes_tce ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para integracoes_tce
CREATE POLICY "Admin/gestor podem visualizar todas integrações"
ON public.integracoes_tce FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'gestor'::app_role)
);

CREATE POLICY "Admin/gestor podem inserir integrações"
ON public.integracoes_tce FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'gestor'::app_role)
);

CREATE POLICY "Admin/gestor podem atualizar integrações"
ON public.integracoes_tce FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'gestor'::app_role)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_integracoes_tce_tipo ON public.integracoes_tce(tipo);
CREATE INDEX IF NOT EXISTS idx_integracoes_tce_referencia ON public.integracoes_tce(referencia_id);
CREATE INDEX IF NOT EXISTS idx_integracoes_tce_status ON public.integracoes_tce(status);
CREATE INDEX IF NOT EXISTS idx_integracoes_tce_created ON public.integracoes_tce(created_at DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_integracoes_tce_updated_at
BEFORE UPDATE ON public.integracoes_tce
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.integracoes_tce IS 'Armazena histórico de integrações com e-Sfinge/TCE-SC';
COMMENT ON COLUMN public.integracoes_tce.tipo IS 'Tipo de dado enviado: contrato, aditivo, medicao ou situacao_obra';
COMMENT ON COLUMN public.integracoes_tce.referencia_id IS 'ID do registro referenciado (obra, contrato, medição, etc)';
COMMENT ON COLUMN public.integracoes_tce.payload_enviado IS 'JSON enviado para o e-Sfinge';
COMMENT ON COLUMN public.integracoes_tce.payload_resposta IS 'JSON recebido como resposta do e-Sfinge';
COMMENT ON COLUMN public.integracoes_tce.protocolo IS 'Número do protocolo retornado pelo TCE';