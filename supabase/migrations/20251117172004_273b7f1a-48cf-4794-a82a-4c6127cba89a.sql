-- 1. Criar função security definer para buscar tenant_id (evita recursão infinita)
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = user_id LIMIT 1;
$$;

-- 2. Recriar política de SELECT usando a função (evita recursão)
DROP POLICY IF EXISTS "Users can view profiles from their tenant" ON public.profiles;
CREATE POLICY "Users can view profiles from their tenant" 
ON public.profiles FOR SELECT
USING (
  tenant_id = get_user_tenant_id(auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Recriar política de ALL usando a função (evita recursão)
DROP POLICY IF EXISTS "Admins and gestores can manage users in their tenant" ON public.profiles;
CREATE POLICY "Admins and gestores can manage users in their tenant" 
ON public.profiles FOR ALL
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND (tenant_id = get_user_tenant_id(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
);