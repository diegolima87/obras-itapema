import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnviarTCE, useIntegracoesTCE, IntegracaoTCE } from "@/hooks/useIntegracoesTCE";
import { Send, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface EnvioRapidoProps {
  tipo: IntegracaoTCE["tipo"];
  referenciaId: string;
  nome: string;
  className?: string;
}

const tipoLabels = {
  contrato: "Contrato",
  aditivo: "Aditivo",
  medicao: "Medição",
  situacao_obra: "Situação da Obra",
};

const statusConfig = {
  sucesso: { color: "text-green-600", icon: CheckCircle },
  erro: { color: "text-red-600", icon: XCircle },
  pendente: { color: "text-yellow-600", icon: Clock },
};

export function EnvioRapido({ tipo, referenciaId, nome, className }: EnvioRapidoProps) {
  const { data: integracoes } = useIntegracoesTCE({ referenciaId, tipo });
  const enviarMutation = useEnviarTCE();
  
  const ultimoEnvio = integracoes?.[0];
  const StatusIcon = ultimoEnvio ? statusConfig[ultimoEnvio.status].icon : null;

  const handleEnviar = async () => {
    try {
      await enviarMutation.mutateAsync({
        tipo,
        referenciaId,
      });
      toast.success(`${tipoLabels[tipo]} enviado ao e-Sfinge com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao enviar ${tipoLabels[tipo]}: ${error.message}`);
    }
  };

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{nome}</p>
        {ultimoEnvio ? (
          <div className="flex items-center gap-2 text-sm">
            {StatusIcon && <StatusIcon className={`h-3 w-3 ${statusConfig[ultimoEnvio.status].color}`} />}
            <span className="text-muted-foreground">
              Enviado em {new Date(ultimoEnvio.created_at).toLocaleDateString("pt-BR")}
            </span>
            {ultimoEnvio.protocolo && (
              <Badge variant="outline" className="font-mono text-xs">
                {ultimoEnvio.protocolo}
              </Badge>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nunca enviado</p>
        )}
      </div>
      
      <Button
        onClick={handleEnviar}
        disabled={enviarMutation.isPending}
        size="sm"
        variant={ultimoEnvio ? "outline" : "default"}
      >
        {enviarMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-3 w-3" />
            {ultimoEnvio ? "Reenviar" : "Enviar"}
          </>
        )}
      </Button>
    </div>
  );
}
