import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Engenheiro {
  id: string;
  nome: string;
  email: string;
  crea: string | null;
}

export const useEngenheiros = () => {
  return useQuery({
    queryKey: ["engenheiros"],
    queryFn: async () => {
      // Busca usuários que têm role 'fiscal' ou 'admin'
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["fiscal", "admin"]);

      if (rolesError) throw rolesError;

      if (!userRoles || userRoles.length === 0) {
        return [];
      }

      const userIds = userRoles.map((ur) => ur.user_id);

      // Busca os perfis desses usuários
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, nome, email, crea")
        .in("id", userIds)
        .order("nome");

      if (profilesError) throw profilesError;

      return profiles as Engenheiro[];
    },
  });
};
