import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { EnvioTCE } from "@/components/tce/EnvioTCE";
import { HistoricoTCE } from "@/components/tce/HistoricoTCE";
import { ArrowLeft, AlertCircle, Shield } from "lucide-react";
import { IntegracaoTCE as IntegracaoTCEType } from "@/hooks/useIntegracoesTCE";

export default function IntegracaoTCE() {
  const { tipo, id } = useParams<{ tipo: string; id: string }>();
  const navigate = useNavigate();

  if (!tipo || !id) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Parâmetros inválidos. Tipo e ID são obrigatórios.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const tipoValido = ["contrato", "aditivo", "medicao", "situacao_obra"].includes(tipo);

  if (!tipoValido) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Tipo inválido. Valores aceitos: contrato, aditivo, medicao, situacao_obra.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const tipoLabels = {
    contrato: "Contrato",
    aditivo: "Aditivo",
    medicao: "Medição",
    situacao_obra: "Situação da Obra",
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Integração e-Sfinge/TCE-SC</h1>
              </div>
              <p className="text-muted-foreground">
                Envio de {tipoLabels[tipo as keyof typeof tipoLabels].toLowerCase()} para o
                Tribunal de Contas do Estado
              </p>
            </div>
          </div>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Sistema e-Sfinge:</strong> O e-Sfinge é o sistema do TCE-SC para
            recebimento de informações sobre contratos, medições e obras públicas. Esta
            integração garante transparência e conformidade com as exigências do Tribunal
            de Contas.
          </AlertDescription>
        </Alert>

        <EnvioTCE
          tipo={tipo as IntegracaoTCEType["tipo"]}
          referenciaId={id}
          titulo={`Enviar ${tipoLabels[tipo as keyof typeof tipoLabels]} ao TCE-SC`}
          descricao={`Transmitir dados de ${tipoLabels[tipo as keyof typeof tipoLabels].toLowerCase()} para o sistema e-Sfinge do Tribunal de Contas`}
        />

        <HistoricoTCE referenciaId={id} tipo={tipo} />
      </div>
    </MainLayout>
  );
}
