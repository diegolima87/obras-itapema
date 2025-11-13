import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye, EyeOff } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { mockObras, statusColors, statusLabels } from "@/lib/mockData";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ItensLista } from "@/components/obra/ItensLista";

export default function ObraDetalhes() {
  const { id } = useParams();
  const obra = mockObras.find((o) => o.id === id);
  const [publicoPortal, setPublicoPortal] = useState(false);

  if (!obra) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Obra não encontrada</h2>
          <Link to="/obras">
            <Button className="mt-4">Voltar para Obras</Button>
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
            <Link to="/obras">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{obra.nome}</h1>
                <Badge className={statusColors[obra.status as keyof typeof statusColors]}>
                  {statusLabels[obra.status as keyof typeof statusLabels]}
                </Badge>
              </div>
              <p className="text-muted-foreground">{obra.descricao}</p>
            </div>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Obra
          </Button>
        </div>

        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="contrato">Contrato</TabsTrigger>
            <TabsTrigger value="medicoes">Medições</TabsTrigger>
            <TabsTrigger value="itens">Itens</TabsTrigger>
            <TabsTrigger value="fotos">Fotos</TabsTrigger>
            <TabsTrigger value="aditivos">Aditivos</TabsTrigger>
            <TabsTrigger value="checklists">Checklists</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="transparencia">Transparência</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle>Dados Gerais da Obra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-muted-foreground">Unidade Gestora</Label>
                    <p className="font-medium">{obra.unidade_gestora}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Engenheiro Responsável</Label>
                    <p className="font-medium">{obra.engenheiro_nome}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Valor Total</Label>
                    <p className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(obra.valor_total)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Percentual Executado</Label>
                    <p className="font-medium">{obra.percentual_executado}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contrato">
            <Card>
              <CardHeader>
                <CardTitle>Contrato Vinculado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhum contrato vinculado a esta obra.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medicoes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Medições da Obra</CardTitle>
                  <Button>Nova Medição</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhuma medição registrada.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itens">
            <ItensLista obraId={obra.id} />
          </TabsContent>

          <TabsContent value="fotos">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Galeria de Fotos</CardTitle>
                  <Button>Upload de Fotos</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhuma foto cadastrada.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aditivos">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Aditivos</CardTitle>
                  <Button>Novo Aditivo</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhum aditivo registrado.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklists">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Documentos e Checklists</CardTitle>
                  <Button>Upload de Documento</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhum documento cadastrado.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle>Histórico da Obra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhum registro no histórico.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transparencia">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Transparência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publico-portal">Exibir no Portal da Transparência</Label>
                    <p className="text-sm text-muted-foreground">
                      Quando ativado, esta obra será visível no portal público
                    </p>
                  </div>
                  <Switch
                    id="publico-portal"
                    checked={publicoPortal}
                    onCheckedChange={setPublicoPortal}
                  />
                </div>
                {publicoPortal && (
                  <div className="space-y-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4 text-primary" />
                        <span className="font-medium">Esta obra está pública</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cidadãos podem visualizar informações desta obra no portal de transparência
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`/obra/${obra.id}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver no Portal Público
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
                {!publicoPortal && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Esta obra está privada</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Apenas usuários internos podem visualizar esta obra
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
