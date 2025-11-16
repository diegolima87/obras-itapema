import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIntegracoesTCE } from "@/hooks/useIntegracoesTCE";
import { Loader2, Eye, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface HistoricoTCEProps {
  referenciaId?: string;
  tipo?: string;
}

const tipoLabels = {
  contrato: "Contrato",
  aditivo: "Aditivo",
  medicao: "Medição",
  situacao_obra: "Situação da Obra",
};

const statusIcons = {
  sucesso: CheckCircle,
  erro: XCircle,
  pendente: Clock,
};

const statusColors = {
  sucesso: "bg-green-500",
  erro: "bg-red-500",
  pendente: "bg-yellow-500",
};

export function HistoricoTCE({ referenciaId, tipo }: HistoricoTCEProps) {
  const [integracaoSelecionada, setIntegracaoSelecionada] = useState<any>(null);
  const { data: integracoes, isLoading } = useIntegracoesTCE({
    referenciaId,
    tipo,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Integrações com TCE</CardTitle>
        </CardHeader>
        <CardContent>
          {integracoes && integracoes.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integracoes.map((integracao) => {
                    const StatusIcon = statusIcons[integracao.status];
                    return (
                      <TableRow key={integracao.id}>
                        <TableCell className="font-medium">
                          {new Date(integracao.created_at).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {tipoLabels[integracao.tipo as keyof typeof tipoLabels]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {integracao.protocolo || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={statusColors[integracao.status]}>
                              {integracao.status === "sucesso"
                                ? "Sucesso"
                                : integracao.status === "erro"
                                ? "Erro"
                                : "Pendente"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIntegracaoSelecionada(integracao)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma integração realizada ainda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog
        open={!!integracaoSelecionada}
        onOpenChange={(open) => !open && setIntegracaoSelecionada(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Integração</DialogTitle>
            <DialogDescription>
              Protocolo: {integracaoSelecionada?.protocolo || "N/A"}
            </DialogDescription>
          </DialogHeader>

          {integracaoSelecionada && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                  <p className="font-semibold">
                    {tipoLabels[integracaoSelecionada.tipo as keyof typeof tipoLabels]}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={statusColors[integracaoSelecionada.status]}>
                    {integracaoSelecionada.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Data de Envio
                  </p>
                  <p className="font-semibold">
                    {new Date(integracaoSelecionada.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Protocolo</p>
                  <p className="font-mono text-sm">
                    {integracaoSelecionada.protocolo || "N/A"}
                  </p>
                </div>
              </div>

              {integracaoSelecionada.mensagem_erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Mensagem de Erro:
                  </p>
                  <p className="text-sm text-red-700">
                    {integracaoSelecionada.mensagem_erro}
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Payload Enviado</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-[300px]">
                  {JSON.stringify(integracaoSelecionada.payload_enviado, null, 2)}
                </pre>
              </div>

              {integracaoSelecionada.payload_resposta && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Resposta do TCE</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-[300px]">
                    {JSON.stringify(integracaoSelecionada.payload_resposta, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
