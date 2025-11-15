-- Atribuir papel de admin ao Diego Lima
INSERT INTO public.user_roles (user_id, role)
VALUES ('6e86b231-17fb-4557-8ecc-ec11bcfd5a67', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Função para prevenir remoção do último admin
CREATE OR REPLACE FUNCTION public.prevent_last_admin_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Se não é uma remoção de papel 'admin', permite a operação
  IF OLD.role != 'admin' THEN
    RETURN OLD;
  END IF;
  
  -- Conta quantos admins restam
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin' AND id != OLD.id;
  
  -- Se for o último admin, impede a remoção
  IF admin_count = 0 THEN
    RAISE EXCEPTION 'Não é possível remover o último administrador do sistema';
  END IF;
  
  RETURN OLD;
END;
$$;

-- Trigger para impedir remoção do último admin
DROP TRIGGER IF EXISTS check_last_admin_removal ON public.user_roles;
CREATE TRIGGER check_last_admin_removal
  BEFORE DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_last_admin_removal();