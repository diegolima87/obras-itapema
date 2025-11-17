-- Step 2: Grant super_admin role and create RLS policies

-- Grant super_admin role to deklima@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role
FROM auth.users
WHERE email = 'deklima@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Update RLS policies for cross-tenant access by super_admin

-- Profiles: super_admin can view and manage all profiles
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;
CREATE POLICY "Super admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- User roles: super_admin can manage all roles
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;
CREATE POLICY "Super admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Tenants: super_admin can view and manage all tenants
DROP POLICY IF EXISTS "Super admins can manage all tenants" ON public.tenants;
CREATE POLICY "Super admins can manage all tenants"
ON public.tenants
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Obras: super_admin can view and manage all obras
DROP POLICY IF EXISTS "Super admins can manage all obras" ON public.obras;
CREATE POLICY "Super admins can manage all obras"
ON public.obras
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Contratos: super_admin can view and manage all contratos
DROP POLICY IF EXISTS "Super admins can manage all contratos" ON public.contratos;
CREATE POLICY "Super admins can manage all contratos"
ON public.contratos
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Fornecedores: super_admin can view and manage all fornecedores
DROP POLICY IF EXISTS "Super admins can manage all fornecedores" ON public.fornecedores;
CREATE POLICY "Super admins can manage all fornecedores"
ON public.fornecedores
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Medicoes: super_admin can view and manage all medicoes
DROP POLICY IF EXISTS "Super admins can manage all medicoes" ON public.medicoes;
CREATE POLICY "Super admins can manage all medicoes"
ON public.medicoes
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Itens obra: super_admin can view and manage all itens
DROP POLICY IF EXISTS "Super admins can manage all itens_obra" ON public.itens_obra;
CREATE POLICY "Super admins can manage all itens_obra"
ON public.itens_obra
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Documentos: super_admin can view and manage all documentos
DROP POLICY IF EXISTS "Super admins can manage all documentos" ON public.documentos;
CREATE POLICY "Super admins can manage all documentos"
ON public.documentos
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Pagamentos: super_admin can view and manage all pagamentos
DROP POLICY IF EXISTS "Super admins can manage all pagamentos" ON public.pagamentos;
CREATE POLICY "Super admins can manage all pagamentos"
ON public.pagamentos
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Aditivos: super_admin can view and manage all aditivos
DROP POLICY IF EXISTS "Super admins can manage all aditivos" ON public.aditivos;
CREATE POLICY "Super admins can manage all aditivos"
ON public.aditivos
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Liquidacoes: super_admin can view and manage all liquidacoes
DROP POLICY IF EXISTS "Super admins can manage all liquidacoes" ON public.liquidacoes;
CREATE POLICY "Super admins can manage all liquidacoes"
ON public.liquidacoes
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Logs auditoria: super_admin can view all logs
DROP POLICY IF EXISTS "Super admins can view all logs" ON public.logs_auditoria;
CREATE POLICY "Super admins can view all logs"
ON public.logs_auditoria
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));