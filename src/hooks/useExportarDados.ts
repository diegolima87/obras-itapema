import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExportParams {
  tipo: "obras" | "contratos" | "medicoes";
  formato: "csv" | "json";
}

export const useExportarDados = () => {
  const { toast } = useToast();

  const exportar = useMutation({
    mutationFn: async ({ tipo, formato }: ExportParams) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Usuário não autenticado");
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const url = `${supabaseUrl}/functions/v1/exportar-dados?tipo=${tipo}&formato=${formato}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao exportar dados");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      
      const fileExtension = formato === "json" ? "json" : "csv";
      const timestamp = new Date().toISOString().split("T")[0];
      link.download = `${tipo}_${timestamp}.${fileExtension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { tipo, formato };
    },
    onSuccess: (data) => {
      toast({
        title: "Relatório exportado!",
        description: `Relatório de ${data.tipo} em formato ${data.formato.toUpperCase()} foi baixado com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao exportar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { exportar };
};
