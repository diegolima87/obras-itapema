-- 1. Atribuir papel 'admin' ao usuário obras@itapema.gov.br
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.profiles
WHERE email = 'obras@itapema.gov.br'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Atualizar política RLS para permitir que gestores também gerenciem roles no seu tenant
DROP POLICY IF EXISTS "Admins can manage roles in their tenant" ON public.user_roles;

CREATE POLICY "Admins and gestores can manage roles in their tenant"
ON public.user_roles
FOR ALL
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = user_roles.user_id 
    AND p.tenant_id = get_user_tenant_id(auth.uid())
  )
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = user_roles.user_id 
    AND p.tenant_id = get_user_tenant_id(auth.uid())
  )
);