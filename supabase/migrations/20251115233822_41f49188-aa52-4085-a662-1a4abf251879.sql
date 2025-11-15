-- =====================================================
-- MÓDULO DE DOCUMENTOS E ARQUIVOS
-- Atualizar tabela documentos e criar Storage Buckets
-- =====================================================

-- 1. ATUALIZAR TABELA DOCUMENTOS COM NOVAS COLUNAS
-- =====================================================

-- Adicionar colunas necessárias
ALTER TABLE public.documentos ADD COLUMN IF NOT EXISTS fornecedor_id uuid REFERENCES public.fornecedores(id) ON DELETE CASCADE;
ALTER TABLE public.documentos ADD COLUMN IF NOT EXISTS arquivo_url text;
ALTER TABLE public.documentos ADD COLUMN IF NOT EXISTS arquivo_path text;
ALTER TABLE public.documentos ADD COLUMN IF NOT EXISTS nome_original text;
ALTER TABLE public.documentos ADD COLUMN IF NOT EXISTS mime_type text;

-- Atualizar colunas existentes se necessário
ALTER TABLE public.documentos ALTER COLUMN url DROP NOT NULL;

-- Renomear coluna 'nome' para manter compatibilidade se necessário
-- A coluna 'nome' pode ser usada como 'nome_original' temporariamente

-- 2. CRIAR BUCKETS NO SUPABASE STORAGE
-- =====================================================

-- Bucket para documentos gerais de obras
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos_obras',
  'documentos_obras',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para documentos de contratos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos_contratos',
  'documentos_contratos',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para documentos de medições
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos_medicoes',
  'documentos_medicoes',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para fotos de obras (público para portal)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fotos_obras',
  'fotos_obras',
  true, -- Público para exibir no portal
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. POLÍTICAS RLS PARA STORAGE - documentos_obras
-- =====================================================

CREATE POLICY "Admin/gestor/fiscal podem visualizar documentos obras"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos_obras' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role) OR
    has_role(auth.uid(), 'fiscal'::app_role)
  )
);

CREATE POLICY "Admin/gestor/fiscal podem fazer upload em obras"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos_obras' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role) OR
    has_role(auth.uid(), 'fiscal'::app_role)
  )
);

CREATE POLICY "Admin/gestor podem deletar documentos obras"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentos_obras' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role)
  )
);

-- 4. POLÍTICAS RLS PARA STORAGE - documentos_contratos
-- =====================================================

CREATE POLICY "Admin/gestor/fornecedor podem visualizar docs contratos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos_contratos' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role) OR
    has_role(auth.uid(), 'fornecedor'::app_role)
  )
);

CREATE POLICY "Admin/gestor/fornecedor podem fazer upload em contratos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos_contratos' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role) OR
    has_role(auth.uid(), 'fornecedor'::app_role)
  )
);

CREATE POLICY "Admin/gestor podem deletar docs contratos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentos_contratos' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role)
  )
);

-- 5. POLÍTICAS RLS PARA STORAGE - documentos_medicoes
-- =====================================================

CREATE POLICY "Autenticados podem visualizar docs medicoes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documentos_medicoes');

CREATE POLICY "Admin/gestor/fiscal/fornecedor podem upload em medicoes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos_medicoes' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role) OR
    has_role(auth.uid(), 'fiscal'::app_role) OR
    has_role(auth.uid(), 'fornecedor'::app_role)
  )
);

CREATE POLICY "Admin/gestor podem deletar docs medicoes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentos_medicoes' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role)
  )
);

-- 6. POLÍTICAS RLS PARA STORAGE - fotos_obras (PÚBLICO)
-- =====================================================

CREATE POLICY "Qualquer um pode visualizar fotos públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'fotos_obras');

CREATE POLICY "Admin/gestor/fiscal podem fazer upload de fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'fotos_obras' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role) OR
    has_role(auth.uid(), 'fiscal'::app_role)
  )
);

CREATE POLICY "Admin/gestor podem deletar fotos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'fotos_obras' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'gestor'::app_role)
  )
);

-- 7. ATUALIZAR RLS DA TABELA documentos
-- =====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Admins can manage all documentos" ON public.documentos;
DROP POLICY IF EXISTS "Authenticated users can upload documentos" ON public.documentos;
DROP POLICY IF EXISTS "Authenticated users can view documentos" ON public.documentos;

-- SELECT: Admin, gestor e fiscal veem tudo
CREATE POLICY "Admin/gestor/fiscal podem visualizar todos documentos"
ON public.documentos FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'gestor'::app_role) OR
  has_role(auth.uid(), 'fiscal'::app_role)
);

-- SELECT: Fornecedor vê apenas seus documentos
CREATE POLICY "Fornecedor pode visualizar seus documentos"
ON public.documentos FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'fornecedor'::app_role) AND
  fornecedor_id IN (
    SELECT id FROM fornecedores WHERE user_id = auth.uid()
  )
);

-- INSERT: Admin, gestor e fiscal podem inserir em qualquer entidade
CREATE POLICY "Admin/gestor/fiscal podem inserir documentos"
ON public.documentos FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'gestor'::app_role) OR
  has_role(auth.uid(), 'fiscal'::app_role)
);

-- INSERT: Fornecedor pode inserir apenas documentos vinculados a ele
CREATE POLICY "Fornecedor pode inserir documentos"
ON public.documentos FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'fornecedor'::app_role) AND
  fornecedor_id IN (
    SELECT id FROM fornecedores WHERE user_id = auth.uid()
  )
);

-- DELETE: Apenas admin e gestor
CREATE POLICY "Admin/gestor podem deletar documentos"
ON public.documentos FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'gestor'::app_role)
);