-- FASE 1: Atribuir role 'admin' ao usuário obras@itapema.gov.br
-- Este usuário precisa ter permissões administrativas para acessar funcionalidades do sistema

INSERT INTO public.user_roles (user_id, role)
VALUES ('6f51f385-bf56-43d5-a053-33ffd22a8214', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Comentário: Esta migration atribui o role 'admin' ao usuário obras@itapema.gov.br
-- O ON CONFLICT garante que não haverá erro se o role já existir