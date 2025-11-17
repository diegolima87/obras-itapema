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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verificar autenticação
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error("Erro de autenticação:", authError);
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Usuário autenticado:", user.id, user.email);

    // Verificar se é admin
    const { data: roles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isAdmin = roles?.some((r) => r.role === "admin" || r.role === "gestor");
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Acesso negado. Apenas administradores." }),
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

    // Buscar dados conforme o tipo
    switch (tipo) {
      case "obras":
        const obrasResult = await supabaseClient.from("obras").select("*");
        data = obrasResult.data || [];
        error = obrasResult.error;
        break;

      case "contratos":
        const contratosResult = await supabaseClient
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
        const medicoesResult = await supabaseClient
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

    // Registrar log de auditoria
    await supabaseClient.from("logs_auditoria").insert({
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
