-- Criar política para permitir que admins e gestores atualizem configurações do seu tenant
CREATE POLICY "Admins and gestores can update their tenant configuration"
ON public.tenants
FOR UPDATE
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);