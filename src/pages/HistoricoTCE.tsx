import { MainLayout } from "@/components/layout/MainLayout";
import { HistoricoTCE as HistoricoTCEComponent } from "@/components/tce/HistoricoTCE";
import { Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HistoricoTCE() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Histórico de Integrações TCE-SC</h1>
          </div>
          <p className="text-muted-foreground">
            Visualize o histórico completo de todas as integrações realizadas com o e-Sfinge/TCE-SC
          </p>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-900">
            <strong>Transparência e Conformidade:</strong> Todos os envios ao TCE-SC são
            registrados e podem ser auditados. Mantenha a conformidade com as exigências do
            Tribunal de Contas através desta ferramenta.
          </AlertDescription>
        </Alert>

        <HistoricoTCEComponent />
      </div>
    </MainLayout>
  );
}
