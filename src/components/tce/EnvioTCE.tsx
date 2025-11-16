import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEnviarTCE, IntegracaoTCE } from "@/hooks/useIntegracoesTCE";
import { Send, Loader2, CheckCircle, AlertCircle, FileJson } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EnvioTCEProps {
  tipo: IntegracaoTCE["tipo"];
  referenciaId: string;
  dadosReferencia?: any;
  titulo?: string;
  descricao?: string;
}

const tipoLabels = {
  contrato: "Contrato",
  aditivo: "Aditivo",
  medicao: "Medição",
  situacao_obra: "Situação da Obra",
};

export function EnvioTCE({
  tipo,
  referenciaId,
  dadosReferencia,
  titulo,
  descricao,
}: EnvioTCEProps) {
  const [ultimoEnvio, setUltimoEnvio] = useState<IntegracaoTCE | null>(null);
  const enviarMutation = useEnviarTCE();

  const handleEnviar = async () => {
    if (
      confirm(
        `Deseja enviar ${tipoLabels[tipo]} para o e-Sfinge/TCE-SC?\n\n` +
          "⚠️ MODO SIMULADO: Este envio será registrado mas não será enviado ao TCE real."
      )
    ) {
      const resultado = await enviarMutation.mutateAsync({
        tipo,
        referenciaId,
        dados: dadosReferencia,
      });
      setUltimoEnvio(resultado);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{titulo || `Envio ao e-Sfinge/TCE-SC`}</CardTitle>
            <CardDescription>
              {descricao ||
                `Enviar dados de ${tipoLabels[tipo].toLowerCase()} para o sistema e-Sfinge do Tribunal de Contas do Estado de Santa Catarina`}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            MODO SIMULADO
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Ambiente de Demonstração:</strong> Este sistema está configurado em modo
            simulado. Em produção, os dados seriam enviados automaticamente para o portal
            e-Sfinge do TCE-SC através de webservice oficial.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button
            onClick={handleEnviar}
            disabled={enviarMutation.isPending}
            size="lg"
            className="min-w-[200px]"
          >
            {enviarMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Enviar para o TCE
              </>
            )}
          </Button>
        </div>

        {ultimoEnvio && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Envio realizado com sucesso!</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Protocolo</p>
                  <p className="font-mono text-sm bg-muted p-2 rounded">
                    {ultimoEnvio.protocolo}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className="bg-green-500">
                    {ultimoEnvio.status === "sucesso" ? "Sucesso" : ultimoEnvio.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  <h4 className="font-semibold text-sm">Payload Enviado</h4>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(ultimoEnvio.payload_enviado, null, 2)}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  <h4 className="font-semibold text-sm">Resposta do TCE</h4>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(ultimoEnvio.payload_resposta, null, 2)}
                </pre>
              </div>

              {ultimoEnvio.payload_resposta?.proximasEtapas && (
                <Alert>
                  <AlertDescription>
                    <strong>Próximas Etapas:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {ultimoEnvio.payload_resposta.proximasEtapas.map(
                        (etapa: string, index: number) => (
                          <li key={index} className="text-sm">
                            {etapa}
                          </li>
                        )
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
