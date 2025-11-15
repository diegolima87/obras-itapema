-- Adicionar política para permitir que usuários autenticados criem obras
CREATE POLICY "Authenticated users can create obras"
ON public.obras
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);