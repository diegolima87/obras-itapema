-- Etapa 1: Atualizar trigger handle_new_user para incluir tenant_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_tenant_id uuid;
BEGIN
  -- Tenta obter tenant_id dos metadados do usuário
  -- Se não existir, pega o primeiro tenant ativo disponível
  IF NEW.raw_user_meta_data->>'tenant_id' IS NOT NULL THEN
    default_tenant_id := (NEW.raw_user_meta_data->>'tenant_id')::uuid;
  ELSE
    SELECT id INTO default_tenant_id FROM public.tenants WHERE ativo = true LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, nome, email, tenant_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.email,
    default_tenant_id
  );
  
  RETURN NEW;
END;
$$;

-- Etapa 4: Atualizar políticas RLS para garantir isolamento por tenant
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view profiles from their tenant"
ON public.profiles
FOR SELECT
USING (
  tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins and gestores can manage users in their tenant"
ON public.profiles
FOR ALL
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Etapa 6: Associar usuários órfãos ao primeiro tenant ativo
UPDATE public.profiles
SET tenant_id = (SELECT id FROM public.tenants WHERE ativo = true LIMIT 1)
WHERE tenant_id IS NULL;