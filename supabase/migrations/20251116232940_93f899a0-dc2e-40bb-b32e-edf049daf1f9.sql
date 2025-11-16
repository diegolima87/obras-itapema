-- Adicionar colunas para localização e categorização detalhada das obras
ALTER TABLE public.obras
  ADD COLUMN IF NOT EXISTS bairro TEXT,
  ADD COLUMN IF NOT EXISTS cidade TEXT,
  ADD COLUMN IF NOT EXISTS uf CHAR(2);

-- Adicionar índices para melhorar performance das queries de filtro
CREATE INDEX IF NOT EXISTS idx_obras_bairro ON public.obras(bairro);
CREATE INDEX IF NOT EXISTS idx_obras_cidade ON public.obras(cidade);
CREATE INDEX IF NOT EXISTS idx_obras_status ON public.obras(status);
CREATE INDEX IF NOT EXISTS idx_obras_tipo_obra ON public.obras(tipo_obra);
CREATE INDEX IF NOT EXISTS idx_obras_valor_total ON public.obras(valor_total);

-- Comentários para documentação
COMMENT ON COLUMN public.obras.bairro IS 'Bairro onde a obra está localizada';
COMMENT ON COLUMN public.obras.cidade IS 'Cidade onde a obra está localizada';
COMMENT ON COLUMN public.obras.uf IS 'Unidade Federativa (Estado) onde a obra está localizada';