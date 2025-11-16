-- Adicionar colunas faltantes na tabela medicoes
ALTER TABLE public.medicoes
  ADD COLUMN IF NOT EXISTS competencia DATE,
  ADD COLUMN IF NOT EXISTS percentual_fisico NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS percentual_financeiro NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS valor_medido NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS criado_por UUID REFERENCES auth.users(id);

-- Adicionar colunas em medicoes_itens
ALTER TABLE public.medicoes_itens
  ADD COLUMN IF NOT EXISTS quantidade_prevista NUMERIC(14,4),
  ADD COLUMN IF NOT EXISTS valor_unitario NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS valor_total NUMERIC(14,2);

-- Criar tabela de anexos de medição
CREATE TABLE IF NOT EXISTS public.anexos_medicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicao_id UUID NOT NULL REFERENCES public.medicoes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('foto', 'video', 'diario_obra', 'documento_tecnico')),
  url TEXT NOT NULL,
  arquivo_path TEXT,
  nome_original TEXT,
  mime_type TEXT,
  tamanho BIGINT,
  descricao TEXT,
  criado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela anexos_medicao
ALTER TABLE public.anexos_medicao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para anexos_medicao
CREATE POLICY "Fornecedores podem visualizar anexos de suas medições"
ON public.anexos_medicao FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.medicoes m
    JOIN public.fornecedores f ON m.fornecedor_id = f.id
    WHERE m.id = anexos_medicao.medicao_id
    AND f.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'gestor'::app_role)
  OR has_role(auth.uid(), 'fiscal'::app_role)
);

CREATE POLICY "Fornecedores podem inserir anexos em suas medições"
ON public.anexos_medicao FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.medicoes m
    JOIN public.fornecedores f ON m.fornecedor_id = f.id
    WHERE m.id = anexos_medicao.medicao_id
    AND f.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'gestor'::app_role)
  OR has_role(auth.uid(), 'fiscal'::app_role)
);

CREATE POLICY "Admin/gestor podem deletar anexos"
ON public.anexos_medicao FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'gestor'::app_role)
);

-- Criar bucket de storage para anexos de medições
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'anexos_medicoes',
  'anexos_medicoes',
  false,
  52428800, -- 50MB
  ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/x-msvideo',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies para o bucket anexos_medicoes
CREATE POLICY "Fornecedores podem visualizar anexos de suas medições"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'anexos_medicoes'
  AND (
    EXISTS (
      SELECT 1 FROM public.anexos_medicao a
      JOIN public.medicoes m ON a.medicao_id = m.id
      JOIN public.fornecedores f ON m.fornecedor_id = f.id
      WHERE a.arquivo_path = storage.objects.name
      AND f.user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'gestor'::app_role)
    OR has_role(auth.uid(), 'fiscal'::app_role)
  )
);

CREATE POLICY "Fornecedores podem fazer upload de anexos de suas medições"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'anexos_medicoes'
  AND (
    has_role(auth.uid(), 'fornecedor'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'gestor'::app_role)
    OR has_role(auth.uid(), 'fiscal'::app_role)
  )
);

CREATE POLICY "Admin/gestor podem deletar anexos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'anexos_medicoes'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'gestor'::app_role)
  )
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_anexos_medicao_medicao_id ON public.anexos_medicao(medicao_id);
CREATE INDEX IF NOT EXISTS idx_anexos_medicao_tipo ON public.anexos_medicao(tipo);
CREATE INDEX IF NOT EXISTS idx_medicoes_itens_medicao_id ON public.medicoes_itens(medicao_id);

-- Comentários para documentação
COMMENT ON TABLE public.anexos_medicao IS 'Armazena anexos (fotos, vídeos, documentos) das medições';
COMMENT ON COLUMN public.medicoes.competencia IS 'Mês/ano de referência da medição';
COMMENT ON COLUMN public.medicoes.percentual_fisico IS 'Percentual de execução física da medição';
COMMENT ON COLUMN public.medicoes.percentual_financeiro IS 'Percentual de execução financeira da medição';
COMMENT ON COLUMN public.medicoes.valor_medido IS 'Valor total medido nesta medição';