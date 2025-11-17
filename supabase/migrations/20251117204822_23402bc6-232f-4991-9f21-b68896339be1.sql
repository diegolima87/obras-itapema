-- =====================================================
-- CORREÇÃO DE SEGURANÇA MULTI-TENANT
-- Remove privilégios globais de 'admin' e garante isolamento por tenant
-- =====================================================

-- =====================================================
-- PROFILES - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Users can view profiles from their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Admins and gestores can manage users in their tenant" ON public.profiles;

-- Usuários só veem perfis do próprio tenant
CREATE POLICY "Users can view profiles from their tenant"
ON public.profiles
FOR SELECT
TO public
USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Admins e gestores só gerenciam usuários do próprio tenant
CREATE POLICY "Admins and gestores can manage users in their tenant"
ON public.profiles
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
);

-- =====================================================
-- USER_ROLES - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Admins só gerenciam roles de usuários do próprio tenant
CREATE POLICY "Admins can manage roles in their tenant"
ON public.user_roles
FOR ALL
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = user_roles.user_id
    AND p.tenant_id = get_user_tenant_id(auth.uid())
  )
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = user_roles.user_id
    AND p.tenant_id = get_user_tenant_id(auth.uid())
  )
);

-- =====================================================
-- OBRAS - Isolamento por Tenant (exceto públicas)
-- =====================================================

DROP POLICY IF EXISTS "Users can view obras from their tenant" ON public.obras;
DROP POLICY IF EXISTS "Admins and gestores can manage obras in their tenant" ON public.obras;

CREATE POLICY "Users can view obras from their tenant"
ON public.obras
FOR SELECT
TO public
USING (
  tenant_id = get_user_tenant_id(auth.uid())
  OR publico_portal = true
);

CREATE POLICY "Admins and gestores can manage obras in their tenant"
ON public.obras
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
);

-- =====================================================
-- CONTRATOS - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Users can view contratos from their tenant" ON public.contratos;
DROP POLICY IF EXISTS "Admins and gestores can manage contratos in their tenant" ON public.contratos;

CREATE POLICY "Users can view contratos from their tenant"
ON public.contratos
FOR SELECT
TO public
USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Admins and gestores can manage contratos in their tenant"
ON public.contratos
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
);

-- =====================================================
-- FORNECEDORES - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Users can view fornecedores from their tenant" ON public.fornecedores;
DROP POLICY IF EXISTS "Admins and gestores can manage fornecedores in their tenant" ON public.fornecedores;

CREATE POLICY "Users can view fornecedores from their tenant"
ON public.fornecedores
FOR SELECT
TO public
USING (
  tenant_id = get_user_tenant_id(auth.uid())
  OR auth.uid() = user_id
);

CREATE POLICY "Admins and gestores can manage fornecedores in their tenant"
ON public.fornecedores
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
);

-- =====================================================
-- MEDICOES - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Users can view medicoes from their tenant" ON public.medicoes;

CREATE POLICY "Users can view medicoes from their tenant"
ON public.medicoes
FOR SELECT
TO public
USING (
  tenant_id = get_user_tenant_id(auth.uid())
  OR EXISTS (
    SELECT 1 FROM fornecedores f
    WHERE f.id = medicoes.fornecedor_id
    AND f.user_id = auth.uid()
  )
);

-- =====================================================
-- ADITIVOS - Isolamento por Tenant via Contrato
-- =====================================================

DROP POLICY IF EXISTS "Users can view aditivos from their tenant" ON public.aditivos;
DROP POLICY IF EXISTS "Admins and gestores can manage aditivos" ON public.aditivos;

CREATE POLICY "Users can view aditivos from their tenant"
ON public.aditivos
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM contratos c
    WHERE c.id = aditivos.contrato_id
    AND c.tenant_id = get_user_tenant_id(auth.uid())
  )
);

CREATE POLICY "Admins and gestores can manage aditivos in their tenant"
ON public.aditivos
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND EXISTS (
    SELECT 1 FROM contratos c
    WHERE c.id = aditivos.contrato_id
    AND c.tenant_id = get_user_tenant_id(auth.uid())
  )
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND EXISTS (
    SELECT 1 FROM contratos c
    WHERE c.id = aditivos.contrato_id
    AND c.tenant_id = get_user_tenant_id(auth.uid())
  )
);

-- =====================================================
-- DOCUMENTOS - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Users can view documentos from their tenant" ON public.documentos;

CREATE POLICY "Users can view documentos from their tenant"
ON public.documentos
FOR SELECT
TO public
USING (
  tenant_id = get_user_tenant_id(auth.uid())
  OR (
    has_role(auth.uid(), 'fornecedor'::app_role)
    AND fornecedor_id IN (
      SELECT id FROM fornecedores WHERE user_id = auth.uid()
    )
  )
);

-- =====================================================
-- PAGAMENTOS - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Users can view pagamentos from their tenant" ON public.pagamentos;
DROP POLICY IF EXISTS "Admins and gestores can manage pagamentos in their tenant" ON public.pagamentos;

CREATE POLICY "Users can view pagamentos from their tenant"
ON public.pagamentos
FOR SELECT
TO public
USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Admins and gestores can manage pagamentos in their tenant"
ON public.pagamentos
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
);

-- =====================================================
-- ITENS_OBRA - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Users can view itens from their tenant" ON public.itens_obra;
DROP POLICY IF EXISTS "Admins and gestores can manage itens in their tenant" ON public.itens_obra;

CREATE POLICY "Users can view itens from their tenant"
ON public.itens_obra
FOR SELECT
TO public
USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Admins and gestores can manage itens in their tenant"
ON public.itens_obra
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
);

-- =====================================================
-- LIQUIDACOES - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Usuários podem visualizar liquidações do seu tenant" ON public.liquidacoes;
DROP POLICY IF EXISTS "Admin/gestor podem gerenciar liquidações" ON public.liquidacoes;

CREATE POLICY "Users can view liquidacoes from their tenant"
ON public.liquidacoes
FOR SELECT
TO public
USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Admins and gestores can manage liquidacoes in their tenant"
ON public.liquidacoes
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = get_user_tenant_id(auth.uid())
);

-- =====================================================
-- TENANTS - Usuários só veem seu próprio tenant
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all tenants" ON public.tenants;
DROP POLICY IF EXISTS "Admins can manage all tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view their tenant" ON public.tenants;
DROP POLICY IF EXISTS "Admins and gestores can update their tenant configuration" ON public.tenants;

-- Usuários veem apenas seu próprio tenant
CREATE POLICY "Users can view their own tenant"
ON public.tenants
FOR SELECT
TO public
USING (id = get_user_tenant_id(auth.uid()));

-- Admins e gestores só gerenciam seu próprio tenant
CREATE POLICY "Admins and gestores can manage their own tenant"
ON public.tenants
FOR ALL
TO public
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND id = get_user_tenant_id(auth.uid())
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND id = get_user_tenant_id(auth.uid())
);

-- =====================================================
-- LOGS_AUDITORIA - Isolamento por Tenant
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all logs" ON public.logs_auditoria;

CREATE POLICY "Admins can view logs from their tenant"
ON public.logs_auditoria
FOR SELECT
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = logs_auditoria.usuario_id
    AND p.tenant_id = get_user_tenant_id(auth.uid())
  )
);