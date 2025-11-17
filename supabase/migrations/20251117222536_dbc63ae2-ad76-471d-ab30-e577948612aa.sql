-- Criar ENUM para features
CREATE TYPE feature_type AS ENUM ('esfinge', 'portal_publico', 'integracao_tce');

-- Criar tabela de features por tenant
CREATE TABLE tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature feature_type NOT NULL,
  habilitado BOOLEAN NOT NULL DEFAULT false,
  data_habilitacao TIMESTAMP WITH TIME ZONE,
  habilitado_por UUID,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, feature)
);

-- Habilitar RLS
ALTER TABLE tenant_features ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Super admins can manage all tenant features"
  ON tenant_features
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'))
  WITH CHECK (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their tenant features"
  ON tenant_features
  FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_tenant_features_updated_at
  BEFORE UPDATE ON tenant_features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir features padrão para tenants existentes (desabilitado por padrão)
INSERT INTO tenant_features (tenant_id, feature, habilitado)
SELECT id, 'esfinge', false
FROM tenants
WHERE NOT EXISTS (
  SELECT 1 FROM tenant_features 
  WHERE tenant_id = tenants.id AND feature = 'esfinge'
);