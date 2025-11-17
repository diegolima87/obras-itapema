-- Criar bucket para logos e assets dos tenants
insert into storage.buckets (id, name, public)
values ('tenant_assets', 'tenant_assets', true);

-- RLS para tenant_assets
create policy "Admins can upload tenant assets"
  on storage.objects for insert
  with check (
    bucket_id = 'tenant_assets' and
    has_role(auth.uid(), 'admin')
  );

create policy "Anyone can view tenant assets"
  on storage.objects for select
  using (bucket_id = 'tenant_assets');