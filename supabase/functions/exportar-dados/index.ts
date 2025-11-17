import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExportQuery {
  tipo: "obras" | "contratos" | "medicoes";
  formato: "csv" | "json";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extrair JWT do header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Token de autenticação não fornecido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jwt = authHeader.replace("Bearer ", "");

    // Cliente com SERVICE_ROLE_KEY para operações administrativas
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Cliente com ANON_KEY para validar o JWT do usuário
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verificar autenticação usando o JWT
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(jwt);

    if (authError || !user) {
      console.error("Erro de autenticação:", authError);
      return new Response(JSON.stringify({ error: "Token inválido ou expirado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Usuário autenticado:", user.id, user.email);

    // Verificar se é admin usando o cliente administrativo
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (rolesError) {
      console.error("Erro ao verificar roles:", rolesError);
    }

    console.log("Roles do usuário:", roles);

    const isAdmin = roles?.some((r) => r.role === "admin" || r.role === "gestor");
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Acesso negado. Apenas administradores podem exportar dados." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(req.url);
    const tipo = url.searchParams.get("tipo") as ExportQuery["tipo"];
    const formato = url.searchParams.get("formato") as ExportQuery["formato"] || "csv";

    if (!tipo || !["obras", "contratos", "medicoes"].includes(tipo)) {
      return new Response(
        JSON.stringify({ error: "Tipo inválido. Use: obras, contratos ou medicoes" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let data: any[] = [];
    let error: any = null;

    // Buscar dados conforme o tipo usando o cliente administrativo
    switch (tipo) {
      case "obras":
        const obrasResult = await supabaseAdmin.from("obras").select("*");
        data = obrasResult.data || [];
        error = obrasResult.error;
        break;

      case "contratos":
        const contratosResult = await supabaseAdmin
          .from("contratos")
          .select(`
            *,
            obra:obras(nome),
            fornecedor:fornecedores(nome, cnpj)
          `);
        data = contratosResult.data || [];
        error = contratosResult.error;
        break;

      case "medicoes":
        const medicoesResult = await supabaseAdmin
          .from("medicoes")
          .select(`
            *,
            obra:obras(nome),
            fornecedor:fornecedores(nome)
          `);
        data = medicoesResult.data || [];
        error = medicoesResult.error;
        break;
    }

    if (error) {
      console.error("Erro ao buscar dados:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Registrar log de auditoria usando o cliente administrativo
    await supabaseAdmin.from("logs_auditoria").insert({
      usuario_id: user.id,
      acao: "EXPORTACAO",
      tabela: tipo,
      registro_id: null,
      dados_depois: {
        tipo,
        formato,
        registros_exportados: data.length,
        data_exportacao: new Date().toISOString(),
      },
    });

    // Retornar em JSON
    if (formato === "json") {
      return new Response(JSON.stringify(data, null, 2), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${tipo}_${new Date().toISOString().split("T")[0]}.json"`,
        },
      });
    }

    // Converter para CSV
    if (data.length === 0) {
      return new Response("Nenhum dado encontrado", {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${tipo}_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Obter headers do primeiro objeto
    const headers = Object.keys(data[0]).filter(
      (key) => typeof data[0][key] !== "object" || data[0][key] === null
    );

    // Criar CSV
    const csvLines = [
      headers.join(","), // Header
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            // Escapar aspas duplas e colocar entre aspas se contém vírgula ou quebra de linha
            const stringValue = String(value).replace(/"/g, '""');
            return stringValue.includes(",") || stringValue.includes("\n")
              ? `"${stringValue}"`
              : stringValue;
          })
          .join(",")
      ),
    ].join("\n");

    return new Response(csvLines, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${tipo}_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Erro na exportação:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Erro interno do servidor" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
