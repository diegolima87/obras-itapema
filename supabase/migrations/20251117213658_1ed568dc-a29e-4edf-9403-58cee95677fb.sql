-- Modificar handle_new_user() para suportar criação automática de tenant via edge function
-- Agora a função só cria o perfil se o tenant_id já estiver definido no metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_tenant_id uuid;
BEGIN
  -- Primeiro, tenta obter tenant_id dos metadados do usuário (definido pela edge function)
  IF NEW.raw_user_meta_data->>'tenant_id' IS NOT NULL THEN
    default_tenant_id := (NEW.raw_user_meta_data->>'tenant_id')::uuid;
    
    -- Cria o perfil com o tenant_id fornecido
    INSERT INTO public.profiles (id, nome, email, tenant_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
      NEW.email,
      default_tenant_id
    );
    
    RETURN NEW;
  END IF;

  -- Se não tem tenant_id no metadata, busca o primeiro tenant ativo (para desenvolvimento/fallback)
  SELECT id INTO default_tenant_id FROM public.tenants WHERE ativo = true LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    -- Cria o perfil com o primeiro tenant ativo encontrado
    INSERT INTO public.profiles (id, nome, email, tenant_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
      NEW.email,
      default_tenant_id
    );
    
    RETURN NEW;
  END IF;

  -- Se não encontrou nenhum tenant, retorna erro
  RAISE EXCEPTION 'Não foi possível criar o perfil: nenhum tenant ativo encontrado';
END;
$$;
