import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, FileText, Plus, Download, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { DocumentoUpload } from "@/components/documentos/DocumentoUpload";
import { DocumentoLista } from "@/components/documentos/DocumentoLista";
import { useContrato } from "@/hooks/useContratos";
import { useAditivos } from "@/hooks/useAditivos";

export default function ContratoDetalhes() {
  const { id } = useParams();
  const { data: contrato, isLoading } = useContrato(id);
  const { data: aditivos, isLoading: loadingAditivos } = useAditivos(id);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-96" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!contrato) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-muted-foreground">Contrato não encontrado</p>
          <Link to="/contratos">
            <Button variant="outline" className="mt-4">Voltar</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/contratos">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Contrato {contrato.numero}</h1>
                <Badge variant={contrato.ativo ? "default" : "secondary"}>
                  {contrato.ativo ? "Ativo" : "Encerrado"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{contrato.objeto}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/integracao-tce/contrato/${id}`}>
              <Button variant="default">
                <Send className="mr-2 h-4 w-4" />
                Enviar ao e-Sfinge TCE/SC
              </Button>
            </Link>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar Contrato
            </Button>
          </div>
        </div>

        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList>
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
            <TabsTrigger value="aditivos">Aditivos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="obras">Obras Vinculadas</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Contrato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-muted-foreground">Número</Label>
                    <p className="font-medium">{contrato.numero}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Modalidade</Label>
                    <p className="font-medium">{contrato.modalidade}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Fornecedor</Label>
                    <p className="font-medium">{contrato.fornecedores?.nome || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">CNPJ</Label>
                    <p className="font-medium">{contrato.fornecedores?.cnpj || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Valor Inicial</Label>
                    <p className="font-medium text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(contrato.valor_inicial)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Valor Atualizado</Label>
                    <p className="font-medium text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(contrato.valor_atualizado)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Assinatura</Label>
                    <p className="font-medium">{new Date(contrato.data_assinatura).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Vencimento</Label>
                    <p className="font-medium">{new Date(contrato.data_vencimento).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-muted-foreground">Objeto</Label>
                    <p className="font-medium">{contrato.objeto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cronograma">
            <Card>
              <CardHeader>
                <CardTitle>Cronograma Físico-Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Em desenvolvimento</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aditivos">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Termos Aditivos</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Aditivo
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Novo Prazo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aditivos?.map((aditivo) => (
                      <TableRow key={aditivo.id}>
                        <TableCell className="font-medium">{aditivo.numero}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{aditivo.tipo}</Badge>
                        </TableCell>
                        <TableCell>{new Date(aditivo.data_assinatura).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          {aditivo.valor_aditado && aditivo.valor_aditado > 0
                            ? new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(aditivo.valor_aditado)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {aditivo.nova_data_vencimento ? new Date(aditivo.nova_data_vencimento).toLocaleDateString("pt-BR") : "-"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentos">
            <div className="space-y-6">
              <DocumentoUpload
                bucketName="documentos_contratos"
                tipo="contrato"
                contratoId={id}
                allowedTypes=".pdf,.doc,.docx"
                maxSize="10MB"
              />
              <DocumentoLista contratoId={id} showDelete={true} />
            </div>
          </TabsContent>

          <TabsContent value="obras">
            <Card>
              <CardHeader>
                <CardTitle>Obras Vinculadas ao Contrato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/obras/1">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">Construção de Ponte sobre o Rio Verde</h3>
                            <p className="text-sm text-muted-foreground">Status: Em Andamento • 50% concluído</p>
                          </div>
                          <Badge>Obra Principal</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
