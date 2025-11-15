import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'gestor' | 'fiscal' | 'fornecedor' | 'cidadao';
  created_at: string;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  crea?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  roles?: UserRole[];
}

export function useUsuarios() {
  const queryClient = useQueryClient();

  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', profile.id);

          return {
            ...profile,
            roles: roles || [],
          };
        })
      );

      return usersWithRoles as UserProfile[];
    },
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole['role'] }) => {
      // Check if role already exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', role)
        .single();

      if (existing) {
        throw new Error('Usuário já possui este papel');
      }

      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Papel atribuído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atribuir papel');
    },
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole['role'] }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Papel removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao remover papel');
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<UserProfile> }) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar perfil');
    },
  });

  return {
    usuarios,
    isLoading,
    error,
    assignRole,
    removeRole,
    updateProfile,
  };
}
