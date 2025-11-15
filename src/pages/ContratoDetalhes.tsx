import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, FileText, Plus, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { DocumentoUpload } from "@/components/documentos/DocumentoUpload";
import { DocumentoLista } from "@/components/documentos/DocumentoLista";

export default function ContratoDetalhes() {
  const { id } = useParams();

  // Mock data
  const contrato = {
    id: id,
    numero: "001/2025",
    modalidade: "Pregão Eletrônico",
    fornecedor: "Construtora ABC Ltda",
    cnpj: "12.345.678/0001-90",
    objeto: "Construção de Ponte sobre o Rio Verde",
    valor: 2500000,
    valor_executado: 1250000,
    data_inicio: "2025-01-15",
    data_termino: "2025-12-31",
    status: "ativo",
  };

  const aditivos = [
    { id: 1, numero: "001/2025", tipo: "Prazo", data: "2025-06-15", valor: 0, novo_prazo: "2026-03-31" },
    { id: 2, numero: "002/2025", tipo: "Valor", data: "2025-08-20", valor: 500000, novo_prazo: null },
  ];

  const cronograma = [
    { id: 1, parcela: "1ª Parcela", previsao: "2025-03-31", valor: 500000, percentual: 20, pago: true },
    { id: 2, parcela: "2ª Parcela", previsao: "2025-06-30", valor: 625000, percentual: 25, pago: true },
    { id: 3, parcela: "3ª Parcela", previsao: "2025-09-30", valor: 750000, percentual: 30, pago: false },
    { id: 4, parcela: "4ª Parcela", previsao: "2025-12-31", valor: 625000, percentual: 25, pago: false },
  ];

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
                <Badge variant={contrato.status === "ativo" ? "default" : "secondary"}>
                  {contrato.status === "ativo" ? "Ativo" : "Encerrado"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{contrato.objeto}</p>
            </div>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Contrato
          </Button>
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
                    <p className="font-medium">{contrato.fornecedor}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">CNPJ</Label>
                    <p className="font-medium">{contrato.cnpj}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Valor Total</Label>
                    <p className="font-medium text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(contrato.valor)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Valor Executado</Label>
                    <p className="font-medium text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(contrato.valor_executado)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Início</Label>
                    <p className="font-medium">{new Date(contrato.data_inicio).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Término</Label>
                    <p className="font-medium">{new Date(contrato.data_termino).toLocaleDateString("pt-BR")}</p>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Previsão</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Percentual</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cronograma.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.parcela}</TableCell>
                        <TableCell>{new Date(item.previsao).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.valor)}
                        </TableCell>
                        <TableCell>{item.percentual}%</TableCell>
                        <TableCell>
                          <Badge variant={item.pago ? "default" : "secondary"}>
                            {item.pago ? "Pago" : "Pendente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    {aditivos.map((aditivo) => (
                      <TableRow key={aditivo.id}>
                        <TableCell className="font-medium">{aditivo.numero}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{aditivo.tipo}</Badge>
                        </TableCell>
                        <TableCell>{new Date(aditivo.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          {aditivo.valor > 0
                            ? new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(aditivo.valor)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {aditivo.novo_prazo ? new Date(aditivo.novo_prazo).toLocaleDateString("pt-BR") : "-"}
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
