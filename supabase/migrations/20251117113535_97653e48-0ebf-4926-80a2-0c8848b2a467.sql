-- 1. Criar enum para planos
create type public.plano_tenant as enum ('basico', 'premium', 'enterprise');

-- 2. Criar tabela de tenants (prefeituras)
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nome_municipio text not null,
  nome_sistema text default 'Sistema de Gestão de Obras',
  
  -- Identificação
  cnpj text not null,
  uf char(2) not null,
  
  -- Contato
  email text not null,
  telefone text,
  endereco text,
  
  -- Branding
  logo_url text,
  logo_dark_url text,
  favicon_url text,
  cor_primaria text default '#132A72',
  cor_secundaria text default '#142050',
  cor_destaque text,
  
  -- Domínios
  dominio_customizado text unique,
  subdominio text unique not null,
  
  -- Configurações do Portal
  portal_ativo boolean default true,
  mostrar_valores boolean default true,
  mostrar_fornecedores boolean default true,
  exigir_aprovacao boolean default true,
  permitir_comentarios boolean default false,
  
  -- Metadados
  ativo boolean default true,
  plano plano_tenant default 'basico',
  data_contratacao date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices para performance
create index idx_tenants_slug on public.tenants(slug);
create index idx_tenants_subdominio on public.tenants(subdominio);
create index idx_tenants_dominio on public.tenants(dominio_customizado);

-- 3. Adicionar tenant_id em todas as tabelas principais
alter table public.profiles add column tenant_id uuid references public.tenants(id);
alter table public.obras add column tenant_id uuid references public.tenants(id);
alter table public.contratos add column tenant_id uuid references public.tenants(id);
alter table public.fornecedores add column tenant_id uuid references public.tenants(id);
alter table public.medicoes add column tenant_id uuid references public.tenants(id);
alter table public.documentos add column tenant_id uuid references public.tenants(id);
alter table public.pagamentos add column tenant_id uuid references public.tenants(id);
alter table public.aditivos add column tenant_id uuid references public.tenants(id);
alter table public.itens_obra add column tenant_id uuid references public.tenants(id);

-- Criar índices para tenant_id
create index idx_profiles_tenant on public.profiles(tenant_id);
create index idx_obras_tenant on public.obras(tenant_id);
create index idx_contratos_tenant on public.contratos(tenant_id);
create index idx_fornecedores_tenant on public.fornecedores(tenant_id);
create index idx_medicoes_tenant on public.medicoes(tenant_id);
create index idx_documentos_tenant on public.documentos(tenant_id);
create index idx_pagamentos_tenant on public.pagamentos(tenant_id);
create index idx_aditivos_tenant on public.aditivos(tenant_id);
create index idx_itens_obra_tenant on public.itens_obra(tenant_id);

-- 4. Criar tenant inicial (Itampema)
insert into public.tenants (
  slug,
  nome_municipio,
  nome_sistema,
  cnpj,
  uf,
  email,
  telefone,
  subdominio,
  cor_primaria,
  cor_secundaria
) values (
  'itampema',
  'Itampema',
  'Obras Itampema Digital',
  '82.939.218/0001-04',
  'SC',
  'obras@itampema.sc.gov.br',
  '(47) 3268-0100',
  'itampema',
  '#132A72',
  '#142050'
);

-- 5. Atualizar todos os registros existentes com o tenant_id de Itampema
do $$
declare
  itampema_tenant_id uuid;
begin
  -- Obter o ID do tenant Itampema
  select id into itampema_tenant_id from public.tenants where slug = 'itampema';
  
  -- Atualizar todas as tabelas
  update public.profiles set tenant_id = itampema_tenant_id where tenant_id is null;
  update public.obras set tenant_id = itampema_tenant_id where tenant_id is null;
  update public.contratos set tenant_id = itampema_tenant_id where tenant_id is null;
  update public.fornecedores set tenant_id = itampema_tenant_id where tenant_id is null;
  update public.medicoes set tenant_id = itampema_tenant_id where tenant_id is null;
  update public.documentos set tenant_id = itampema_tenant_id where tenant_id is null;
  update public.pagamentos set tenant_id = itampema_tenant_id where tenant_id is null;
  update public.aditivos set tenant_id = itampema_tenant_id where tenant_id is null;
  update public.itens_obra set tenant_id = itampema_tenant_id where tenant_id is null;
end $$;

-- 6. RLS para tabela tenants
alter table public.tenants enable row level security;

create policy "Admins can view all tenants"
  on public.tenants for select
  using (has_role(auth.uid(), 'admin'));

create policy "Users can view their tenant"
  on public.tenants for select
  using (
    id = (
      select tenant_id 
      from public.profiles 
      where id = auth.uid()
    )
  );

create policy "Admins can manage all tenants"
  on public.tenants for all
  using (has_role(auth.uid(), 'admin'));

-- 7. Atualizar RLS policies existentes para incluir tenant_id

-- Profiles
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (
    auth.uid() = id
    or has_role(auth.uid(), 'admin')
  );

-- Obras
drop policy if exists "Users can view obras they created" on public.obras;
create policy "Users can view obras from their tenant"
  on public.obras for select
  using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
    or publico_portal = true
    or has_role(auth.uid(), 'admin')
  );

drop policy if exists "Admins and gestores can manage obras" on public.obras;
create policy "Admins and gestores can manage obras in their tenant"
  on public.obras for all
  using (
    (has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'gestor'))
    and tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

-- Contratos
drop policy if exists "Authenticated users can view contratos" on public.contratos;
create policy "Users can view contratos from their tenant"
  on public.contratos for select
  using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
    or has_role(auth.uid(), 'admin')
  );

drop policy if exists "Admins and gestores can manage contratos" on public.contratos;
create policy "Admins and gestores can manage contratos in their tenant"
  on public.contratos for all
  using (
    (has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'gestor'))
    and tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

-- Fornecedores
drop policy if exists "Fornecedores can view their own data" on public.fornecedores;
create policy "Users can view fornecedores from their tenant"
  on public.fornecedores for select
  using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
    or auth.uid() = user_id
    or has_role(auth.uid(), 'admin')
  );

drop policy if exists "Admins and gestores can manage fornecedores" on public.fornecedores;
create policy "Admins and gestores can manage fornecedores in their tenant"
  on public.fornecedores for all
  using (
    (has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'gestor'))
    and tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

-- Medicoes
drop policy if exists "Fornecedores can view their own medicoes" on public.medicoes;
create policy "Users can view medicoes from their tenant"
  on public.medicoes for select
  using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
    or exists (
      select 1 from fornecedores f
      where f.id = medicoes.fornecedor_id 
      and f.user_id = auth.uid()
    )
    or has_role(auth.uid(), 'admin')
  );

-- Pagamentos
drop policy if exists "Authenticated users can view pagamentos" on public.pagamentos;
create policy "Users can view pagamentos from their tenant"
  on public.pagamentos for select
  using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
    or has_role(auth.uid(), 'admin')
  );

drop policy if exists "Admins and gestores can manage pagamentos" on public.pagamentos;
create policy "Admins and gestores can manage pagamentos in their tenant"
  on public.pagamentos for all
  using (
    (has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'gestor'))
    and tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

-- Aditivos
drop policy if exists "Authenticated users can view aditivos" on public.aditivos;
create policy "Users can view aditivos from their tenant"
  on public.aditivos for select
  using (
    exists (
      select 1 from contratos c
      where c.id = aditivos.contrato_id
      and c.tenant_id = (select tenant_id from public.profiles where id = auth.uid())
    )
    or has_role(auth.uid(), 'admin')
  );

-- Itens obra
drop policy if exists "Authenticated users can view itens" on public.itens_obra;
create policy "Users can view itens from their tenant"
  on public.itens_obra for select
  using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
    or has_role(auth.uid(), 'admin')
  );

drop policy if exists "Admins and gestores can manage itens" on public.itens_obra;
create policy "Admins and gestores can manage itens in their tenant"
  on public.itens_obra for all
  using (
    (has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'gestor'))
    and tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

-- Documentos
drop policy if exists "Admin/gestor/fiscal podem visualizar todos documentos" on public.documentos;
create policy "Users can view documentos from their tenant"
  on public.documentos for select
  using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
    or (has_role(auth.uid(), 'fornecedor') and fornecedor_id in (
      select id from fornecedores where user_id = auth.uid()
    ))
    or has_role(auth.uid(), 'admin')
  );

-- 8. Trigger para updated_at na tabela tenants
create trigger update_tenants_updated_at
  before update on public.tenants
  for each row
  execute function public.update_updated_at_column();