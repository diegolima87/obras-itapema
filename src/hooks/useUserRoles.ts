import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'super_admin' | 'admin' | 'gestor' | 'fiscal' | 'engenheiro' | 'fornecedor' | 'cidadao';

export function useUserRoles() {
  return useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return roles.map(r => r.role as UserRole);
    },
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
  });
}

export function useHasRole(requiredRole: UserRole) {
  const { data: roles = [], isLoading } = useUserRoles();
  
  return {
    hasRole: roles.includes(requiredRole),
    isLoading,
  };
}

export function useHasAnyRole(requiredRoles: UserRole[]) {
  const { data: roles = [], isLoading } = useUserRoles();
  
  return {
    hasRole: requiredRoles.some(role => roles.includes(role)),
    isLoading,
  };
}

export function useIsSuperAdmin() {
  const { data: roles = [], isLoading } = useUserRoles();
  
  return {
    isSuperAdmin: roles.includes('super_admin'),
    isLoading,
  };
}
