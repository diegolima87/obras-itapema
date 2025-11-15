-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'gestor', 'fiscal', 'fornecedor', 'cidadao');
CREATE TYPE public.status_obra AS ENUM ('planejada', 'andamento', 'concluida', 'paralisada');
CREATE TYPE public.status_medicao AS ENUM ('pendente', 'analise', 'aprovado', 'reprovado');
CREATE TYPE public.tipo_documento AS ENUM ('contrato', 'aditivo', 'medicao', 'pagamento', 'projeto', 'foto', 'outro');
CREATE TYPE public.status_esfinge AS ENUM ('pendente', 'processando', 'enviado', 'erro');

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    crea TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER ROLES TABLE (SECURITY CRITICAL)
-- =============================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- =============================================
-- FORNECEDORES TABLE
-- =============================================
CREATE TABLE public.fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;

-- =============================================
-- OBRAS TABLE
-- =============================================
CREATE TABLE public.obras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    endereco TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status status_obra DEFAULT 'planejada',
    unidade_gestora TEXT NOT NULL,
    tipo_obra TEXT,
    valor_total DECIMAL(15, 2) DEFAULT 0,
    valor_executado DECIMAL(15, 2) DEFAULT 0,
    percentual_executado DECIMAL(5, 2) DEFAULT 0,
    data_inicio DATE,
    data_fim_prevista DATE,
    data_fim_real DATE,
    engenheiro_fiscal_id UUID REFERENCES auth.users(id),
    publico_portal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CONTRATOS TABLE
-- =============================================
CREATE TABLE public.contratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE NOT NULL,
    fornecedor_id UUID REFERENCES public.fornecedores(id) NOT NULL,
    numero TEXT UNIQUE NOT NULL,
    modalidade TEXT NOT NULL,
    objeto TEXT,
    valor_inicial DECIMAL(15, 2) NOT NULL,
    valor_atualizado DECIMAL(15, 2) NOT NULL,
    data_assinatura DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    origem_recurso TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- ADITIVOS TABLE
-- =============================================
CREATE TABLE public.aditivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE CASCADE NOT NULL,
    numero TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'prazo' ou 'valor'
    valor_aditado DECIMAL(15, 2) DEFAULT 0,
    prazo_aditado INTEGER DEFAULT 0, -- em dias
    nova_data_vencimento DATE,
    justificativa TEXT,
    data_assinatura DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.aditivos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- ITENS OBRA TABLE
-- =============================================
CREATE TABLE public.itens_obra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE NOT NULL,
    codigo TEXT,
    descricao TEXT NOT NULL,
    unidade TEXT NOT NULL,
    quantidade_total DECIMAL(15, 4) NOT NULL,
    quantidade_executada DECIMAL(15, 4) DEFAULT 0,
    valor_unitario DECIMAL(15, 2) NOT NULL,
    valor_total DECIMAL(15, 2) GENERATED ALWAYS AS (quantidade_total * valor_unitario) STORED,
    percentual_executado DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.itens_obra ENABLE ROW LEVEL SECURITY;

-- =============================================
-- MEDICOES TABLE
-- =============================================
CREATE TABLE public.medicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE NOT NULL,
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE CASCADE NOT NULL,
    fornecedor_id UUID REFERENCES public.fornecedores(id) NOT NULL,
    numero_medicao TEXT NOT NULL,
    etapa TEXT,
    descricao TEXT,
    percentual_executado DECIMAL(5, 2) DEFAULT 0,
    valor_executado DECIMAL(15, 2) DEFAULT 0,
    status status_medicao DEFAULT 'pendente',
    data_envio DATE DEFAULT CURRENT_DATE,
    data_aprovacao DATE,
    aprovado_por UUID REFERENCES auth.users(id),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(obra_id, numero_medicao)
);

ALTER TABLE public.medicoes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- MEDICOES ITENS TABLE
-- =============================================
CREATE TABLE public.medicoes_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicao_id UUID REFERENCES public.medicoes(id) ON DELETE CASCADE NOT NULL,
    item_obra_id UUID REFERENCES public.itens_obra(id) ON DELETE CASCADE NOT NULL,
    quantidade_executada DECIMAL(15, 4) NOT NULL,
    valor_executado DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.medicoes_itens ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PAGAMENTOS TABLE
-- =============================================
CREATE TABLE public.pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicao_id UUID REFERENCES public.medicoes(id) ON DELETE CASCADE NOT NULL,
    contrato_id UUID REFERENCES public.contratos(id) NOT NULL,
    fornecedor_id UUID REFERENCES public.fornecedores(id) NOT NULL,
    numero_empenho TEXT,
    valor DECIMAL(15, 2) NOT NULL,
    data_pagamento DATE,
    data_prevista DATE,
    status TEXT DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- DOCUMENTOS TABLE
-- =============================================
CREATE TABLE public.documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo tipo_documento NOT NULL,
    nome TEXT NOT NULL,
    url TEXT NOT NULL,
    tamanho BIGINT,
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE CASCADE,
    medicao_id UUID REFERENCES public.medicoes(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- LOGS AUDITORIA TABLE
-- =============================================
CREATE TABLE public.logs_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tabela TEXT NOT NULL,
    registro_id UUID NOT NULL,
    acao TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    usuario_id UUID REFERENCES auth.users(id),
    dados_antes JSONB,
    dados_depois JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.logs_auditoria ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CONFIGURACOES SISTEMA TABLE
-- =============================================
CREATE TABLE public.configuracoes_sistema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave TEXT UNIQUE NOT NULL,
    valor TEXT,
    descricao TEXT,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;

-- =============================================
-- INTEGRACAO E-SFINGE TABLE
-- =============================================
CREATE TABLE public.integracao_esfinge_envios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL, -- 'obras', 'contratos', 'medicoes', 'pagamentos'
    status status_esfinge DEFAULT 'pendente',
    dados JSONB,
    resposta JSONB,
    mensagem_erro TEXT,
    enviado_por UUID REFERENCES auth.users(id),
    data_envio TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.integracao_esfinge_envios ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - PROFILES
-- =============================================
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - USER ROLES
-- =============================================
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - FORNECEDORES
-- =============================================
CREATE POLICY "Fornecedores can view their own data"
    ON public.fornecedores FOR SELECT
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

CREATE POLICY "Admins and gestores can manage fornecedores"
    ON public.fornecedores FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

-- =============================================
-- RLS POLICIES - OBRAS
-- =============================================
CREATE POLICY "Public works visible to everyone"
    ON public.obras FOR SELECT
    USING (publico_portal = TRUE);

CREATE POLICY "Fiscais can view their assigned obras"
    ON public.obras FOR SELECT
    USING (
        auth.uid() = engenheiro_fiscal_id 
        OR public.has_role(auth.uid(), 'admin') 
        OR public.has_role(auth.uid(), 'gestor')
    );

CREATE POLICY "Admins and gestores can manage obras"
    ON public.obras FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

-- =============================================
-- RLS POLICIES - CONTRATOS
-- =============================================
CREATE POLICY "Authenticated users can view contratos"
    ON public.contratos FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Admins and gestores can manage contratos"
    ON public.contratos FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

-- =============================================
-- RLS POLICIES - ADITIVOS
-- =============================================
CREATE POLICY "Authenticated users can view aditivos"
    ON public.aditivos FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Admins and gestores can manage aditivos"
    ON public.aditivos FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

-- =============================================
-- RLS POLICIES - ITENS OBRA
-- =============================================
CREATE POLICY "Authenticated users can view itens"
    ON public.itens_obra FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Admins and gestores can manage itens"
    ON public.itens_obra FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

-- =============================================
-- RLS POLICIES - MEDICOES
-- =============================================
CREATE POLICY "Fornecedores can view their own medicoes"
    ON public.medicoes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.fornecedores f
            WHERE f.id = medicoes.fornecedor_id AND f.user_id = auth.uid()
        )
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'gestor')
        OR public.has_role(auth.uid(), 'fiscal')
    );

CREATE POLICY "Fornecedores can insert their own medicoes"
    ON public.medicoes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.fornecedores f
            WHERE f.id = medicoes.fornecedor_id AND f.user_id = auth.uid()
        )
    );

CREATE POLICY "Fiscais and admins can update medicoes"
    ON public.medicoes FOR UPDATE
    USING (
        public.has_role(auth.uid(), 'admin') 
        OR public.has_role(auth.uid(), 'gestor')
        OR public.has_role(auth.uid(), 'fiscal')
    );

-- =============================================
-- RLS POLICIES - MEDICOES ITENS
-- =============================================
CREATE POLICY "Users can view medicoes_itens"
    ON public.medicoes_itens FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Fornecedores can insert medicoes_itens"
    ON public.medicoes_itens FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.medicoes m
            JOIN public.fornecedores f ON m.fornecedor_id = f.id
            WHERE m.id = medicoes_itens.medicao_id AND f.user_id = auth.uid()
        )
    );

-- =============================================
-- RLS POLICIES - PAGAMENTOS
-- =============================================
CREATE POLICY "Authenticated users can view pagamentos"
    ON public.pagamentos FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Admins and gestores can manage pagamentos"
    ON public.pagamentos FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

-- =============================================
-- RLS POLICIES - DOCUMENTOS
-- =============================================
CREATE POLICY "Authenticated users can view documentos"
    ON public.documentos FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Authenticated users can upload documentos"
    ON public.documentos FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all documentos"
    ON public.documentos FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - LOGS AUDITORIA
-- =============================================
CREATE POLICY "Admins can view all logs"
    ON public.logs_auditoria FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - CONFIGURACOES
-- =============================================
CREATE POLICY "Admins can view configuracoes"
    ON public.configuracoes_sistema FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage configuracoes"
    ON public.configuracoes_sistema FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - E-SFINGE
-- =============================================
CREATE POLICY "Admins and gestores can view esfinge logs"
    ON public.integracao_esfinge_envios FOR SELECT
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

CREATE POLICY "Admins and gestores can manage esfinge"
    ON public.integracao_esfinge_envios FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON public.fornecedores
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON public.obras
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON public.contratos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aditivos_updated_at BEFORE UPDATE ON public.aditivos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_itens_obra_updated_at BEFORE UPDATE ON public.itens_obra
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicoes_updated_at BEFORE UPDATE ON public.medicoes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON public.pagamentos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRIGGER FOR AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, nome, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- INSERT DEFAULT CONFIGURACOES
-- =============================================
INSERT INTO public.configuracoes_sistema (chave, valor, descricao) VALUES
    ('nome_prefeitura', 'Prefeitura Municipal', 'Nome da prefeitura'),
    ('unidade_gestora', 'Secretaria de Obras', 'Unidade gestora padrão'),
    ('portal_publico_ativo', 'true', 'Ativar portal público'),
    ('esfinge_url', '', 'URL do e-Sfinge TCE/SC'),
    ('esfinge_usuario', '', 'Usuário e-Sfinge'),
    ('competencia_mes', '', 'Mês de competência'),
    ('competencia_ano', '', 'Ano de competência');