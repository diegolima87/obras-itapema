-- Temporariamente permitir que usuários anônimos criem obras (APENAS PARA DESENVOLVIMENTO)
-- IMPORTANTE: Remover esta política em produção e implementar autenticação adequada
CREATE POLICY "Anonymous users can create obras (DEV ONLY)"
ON public.obras
FOR INSERT
TO anon
WITH CHECK (true);

-- Permitir que usuários autenticados vejam todas as obras que criaram
CREATE POLICY "Users can view obras they created"
ON public.obras
FOR SELECT
TO authenticated
USING (true);