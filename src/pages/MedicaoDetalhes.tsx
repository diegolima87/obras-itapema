import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, X, Download, FileText, Image } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DocumentoUpload } from "@/components/documentos/DocumentoUpload";
import { DocumentoLista } from "@/components/documentos/DocumentoLista";
import { useMedicao } from "@/hooks/useMedicoes";
import { useAprovarMedicao, useReprovarMedicao } from "@/hooks/useMedicao";
import { useMedicoesItens } from "@/hooks/useMedicoesItens";

export default function MedicaoDetalhes() {
  const { id } = useParams();
  const { toast } = useToast();
  const [parecer, setParecer] = useState("");
  
  const { data: medicao, isLoading } = useMedicao(id);
  const { data: itens, isLoading: loadingItens } = useMedicoesItens(id);
  const aprovarMedicao = useAprovarMedicao();
  const reprovarMedicao = useReprovarMedicao();

  const handleAprovar = () => {
    if (!id) return;
    aprovarMedicao.mutate(id);
  };

  const handleReprovar = () => {
    if (!parecer) {
      toast({
        title: "Erro",
        description: "Informe o motivo da reprovação",
        variant: "destructive",
      });
      return;
    }
    if (!id) return;
    reprovarMedicao.mutate({ medicaoId: id, motivo: parecer });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-96" />
          <div className="grid gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!medicao) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-muted-foreground">Medição não encontrada</p>
          <Link to="/medicoes">
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
            <Link to="/medicoes">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Medição {medicao.numero_medicao}</h1>
                <Badge variant={medicao.status === "pendente" ? "secondary" : medicao.status === "aprovado" ? "default" : "destructive"}>
                  {medicao.status === "pendente" ? "Pendente" : medicao.status === "aprovado" ? "Aprovada" : "Reprovada"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{medicao.obras?.nome || "-"}</p>
            </div>
          </div>
          {medicao.status === "pendente" && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default">
                    <Check className="mr-2 h-4 w-4" />
                    Aprovar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Aprovar Medição</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja aprovar esta medição? Esta ação não poderá ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAprovar}>Confirmar Aprovação</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <X className="mr-2 h-4 w-4" />
                    Reprovar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reprovar Medição</AlertDialogTitle>
                    <AlertDialogDescription>
                      Informe o motivo da reprovação desta medição.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Descreva o motivo da reprovação..."
                      value={parecer}
                      onChange={(e) => setParecer(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReprovar} className="bg-destructive hover:bg-destructive/90">
                      Confirmar Reprovação
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <Tabs defaultValue="dados" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dados">Dados Gerais</TabsTrigger>
            <TabsTrigger value="itens">Itens Medidos</TabsTrigger>
            <TabsTrigger value="fotos">Fotos</TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informações da Medição</CardTitle>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Gerar Relatório PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-muted-foreground">Número da Medição</Label>
                    <p className="font-medium">{medicao.numero_medicao}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="font-medium">
                      <Badge variant={medicao.status === "pendente" ? "secondary" : medicao.status === "aprovado" ? "default" : "destructive"}>
                        {medicao.status === "pendente" ? "Pendente de Análise" : medicao.status === "aprovado" ? "Aprovada" : "Reprovada"}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Obra</Label>
                    <p className="font-medium">{medicao.obra}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Fornecedor</Label>
                    <p className="font-medium">{medicao.fornecedor}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Período</Label>
                    <p className="font-medium">
                      {new Date(medicao.periodo_inicio).toLocaleDateString("pt-BR")} até{" "}
                      {new Date(medicao.periodo_fim).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Envio</Label>
                    <p className="font-medium">{new Date(medicao.data_envio).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Valor da Medição</Label>
                    <p className="font-medium text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(medicao.valor)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Percentual Executado</Label>
                    <p className="font-medium text-lg">{medicao.percentual}%</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="font-medium">{medicao.observacoes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itens">
            <Card>
              <CardHeader>
                <CardTitle>Itens da Medição</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itens.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <Label className="text-muted-foreground">Descrição</Label>
                          <p className="font-medium">{item.descricao}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Quantidade</Label>
                          <p className="font-medium">
                            {item.quantidade} {item.unidade}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Valor Unitário</Label>
                          <p className="font-medium">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.valor_unitario)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Valor Total</Label>
                          <p className="font-medium text-lg">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.valor_total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total da Medição:</span>
                      <span className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(medicao.valor)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fotos">
            <div className="space-y-6">
              <DocumentoUpload
                bucketName="documentos_medicoes"
                tipo="medicao"
                medicaoId={id}
                allowedTypes=".pdf,.jpg,.jpeg,.png,.webp"
                maxSize="10MB"
              />
              <DocumentoLista medicaoId={id} showDelete={false} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
