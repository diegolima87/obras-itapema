import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFornecedorAtual = () => {
  return useQuery({
    queryKey: ["fornecedor-atual"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useMeusContratos = () => {
  return useQuery({
    queryKey: ["meus-contratos"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: fornecedor } = await supabase
        .from("fornecedores")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!fornecedor) throw new Error("Fornecedor não encontrado");

      const { data, error } = await supabase
        .from("contratos")
        .select(`
          *,
          obra:obras(*),
          fornecedor:fornecedores(*)
        `)
        .eq("fornecedor_id", fornecedor.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useMinhasObras = () => {
  return useQuery({
    queryKey: ["minhas-obras"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: fornecedor } = await supabase
        .from("fornecedores")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!fornecedor) throw new Error("Fornecedor não encontrado");

      // Buscar obras através dos contratos
      const { data, error } = await supabase
        .from("contratos")
        .select(`
          obra:obras(*)
        `)
        .eq("fornecedor_id", fornecedor.id);

      if (error) throw error;

      // Extrair e remover duplicatas de obras
      const obras = data
        .map(c => c.obra)
        .filter((obra, index, self) => 
          obra && self.findIndex(o => o?.id === obra.id) === index
        );

      return obras;
    },
  });
};

export const useMinhasMedicoes = () => {
  return useQuery({
    queryKey: ["minhas-medicoes"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: fornecedor } = await supabase
        .from("fornecedores")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!fornecedor) throw new Error("Fornecedor não encontrado");

      const { data, error } = await supabase
        .from("medicoes")
        .select(`
          *,
          obra:obras(*),
          contrato:contratos(*)
        `)
        .eq("fornecedor_id", fornecedor.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useMeusDocumentos = () => {
  return useQuery({
    queryKey: ["meus-documentos"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: fornecedor } = await supabase
        .from("fornecedores")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!fornecedor) throw new Error("Fornecedor não encontrado");

      const { data, error } = await supabase
        .from("documentos")
        .select("*")
        .eq("fornecedor_id", fornecedor.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
