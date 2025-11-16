import { FornecedorLayout } from "@/components/fornecedor/FornecedorLayout";
import { DocumentoUpload } from "@/components/documentos/DocumentoUpload";
import { DocumentoLista } from "@/components/documentos/DocumentoLista";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMeusDocumentos, useFornecedorAtual } from "@/hooks/useFornecedorData";
import { FileText, AlertCircle } from "lucide-react";

export default function DocumentosFornecedor() {
  const { data: fornecedor } = useFornecedorAtual();
  const { data: documentos } = useMeusDocumentos();

  return (
    <FornecedorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meus Documentos</h1>
          <p className="text-muted-foreground">
            Gerencie documentos relacionados aos seus contratos e obras
          </p>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Documentação Obrigatória:</strong> Mantenha seus documentos sempre
            atualizados para garantir a continuidade dos contratos. Certidões vencidas podem
            impedir a aprovação de medições.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Enviar Documento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {fornecedor && (
              <DocumentoUpload
                bucketName="documentos_contratos"
                tipo="outro"
                fornecedorId={fornecedor.id}
                allowedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                maxSize="10MB"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            {fornecedor && (
              <DocumentoLista fornecedorId={fornecedor.id} />
            )}
          </CardContent>
        </Card>
      </div>
    </FornecedorLayout>
  );
}
