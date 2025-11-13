import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Save, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ESfingeMapeamento() {
  const { toast } = useToast();
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);

  const mapeamentoObras = [
    { 
      campoSistema: "nome", 
      campoTCE: "ds_obra", 
      obrigatorio: true, 
      tipo: "texto",
      descricao: "Nome/Descrição da obra"
    },
    { 
      campoSistema: "tipo", 
      campoTCE: "tp_obra", 
      obrigatorio: true, 
      tipo: "lista",
      descricao: "Tipo da obra (1=Construção, 2=Reforma, 3=Ampliação)"
    },
    { 
      campoSistema: "local", 
      campoTCE: "ds_local", 
      obrigatorio: true, 
      tipo: "texto",
      descricao: "Localização da obra"
    },
    { 
      campoSistema: "valor_estimado", 
      campoTCE: "vl_estimado", 
      obrigatorio: true, 
      tipo: "numerico",
      descricao: "Valor estimado da obra"
    },
    { 
      campoSistema: "data_inicio", 
      campoTCE: "dt_inicio", 
      obrigatorio: true, 
      tipo: "data",
      descricao: "Data de início da obra"
    },
    { 
      campoSistema: "data_prevista", 
      campoTCE: "dt_previsao", 
      obrigatorio: true, 
      tipo: "data",
      descricao: "Data prevista de conclusão"
    },
    { 
      campoSistema: "status", 
      campoTCE: "st_obra", 
      obrigatorio: true, 
      tipo: "lista",
      descricao: "Status (1=Planejada, 2=Em Andamento, 3=Concluída)"
    }
  ];

  const mapeamentoContratos = [
    { 
      campoSistema: "numero", 
      campoTCE: "nr_contrato", 
      obrigatorio: true, 
      tipo: "texto",
      descricao: "Número do contrato"
    },
    { 
      campoSistema: "objeto", 
      campoTCE: "ds_objeto", 
      obrigatorio: true, 
      tipo: "texto",
      descricao: "Objeto do contrato"
    },
    { 
      campoSistema: "fornecedor", 
      campoTCE: "nr_cpf_cnpj", 
      obrigatorio: true, 
      tipo: "texto",
      descricao: "CPF/CNPJ do contratado"
    },
    { 
      campoSistema: "valor", 
      campoTCE: "vl_contrato", 
      obrigatorio: true, 
      tipo: "numerico",
      descricao: "Valor total do contrato"
    },
    { 
      campoSistema: "data_assinatura", 
      campoTCE: "dt_assinatura", 
      obrigatorio: true, 
      tipo: "data",
      descricao: "Data de assinatura"
    },
    { 
      campoSistema: "vigencia", 
      campoTCE: "dt_vigencia", 
      obrigatorio: true, 
      tipo: "data",
      descricao: "Data de vigência"
    }
  ];

  const handleSalvar = () => {
    toast({
      title: "Mapeamento salvo",
      description: "Configurações atualizadas com sucesso",
    });
    setAlteracoesPendentes(false);
  };

  const handleResetar = () => {
    toast({
      title: "Mapeamento resetado",
      description: "Configurações padrão restauradas",
    });
    setAlteracoesPendentes(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mapeamento de Campos</h1>
          <p className="text-muted-foreground">
            Configure a correspondência entre campos do sistema e e-Sfinge TCE/SC
          </p>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Sobre o Mapeamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              O mapeamento de campos define como os dados do seu sistema são convertidos 
              para o formato exigido pelo e-Sfinge do TCE/SC.
            </p>
            <p>
              Campos marcados como <strong>obrigatórios</strong> devem estar sempre preenchidos 
              para que a exportação seja bem-sucedida.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        {alteracoesPendentes && (
          <Card className="border-yellow-200 dark:border-yellow-900">
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Você tem alterações não salvas</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleResetar}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Descartar
                </Button>
                <Button size="sm" onClick={handleSalvar}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mapping Tables */}
        <Tabs defaultValue="obras" className="space-y-4">
          <TabsList>
            <TabsTrigger value="obras">Obras</TabsTrigger>
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
            <TabsTrigger value="medicoes">Medições</TabsTrigger>
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          </TabsList>

          <TabsContent value="obras">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mapeamento de Obras</CardTitle>
                    <CardDescription>
                      Configuração de campos para exportação de obras
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações Avançadas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo no Sistema</TableHead>
                      <TableHead className="text-center">
                        <ArrowRight className="h-4 w-4 mx-auto" />
                      </TableHead>
                      <TableHead>Campo no e-Sfinge</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mapeamentoObras.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {item.campoSistema}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                            {item.campoTCE}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.obrigatorio ? (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Obrigatório
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Opcional</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.descricao}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contratos">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mapeamento de Contratos</CardTitle>
                    <CardDescription>
                      Configuração de campos para exportação de contratos
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações Avançadas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo no Sistema</TableHead>
                      <TableHead className="text-center">
                        <ArrowRight className="h-4 w-4 mx-auto" />
                      </TableHead>
                      <TableHead>Campo no e-Sfinge</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mapeamentoContratos.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {item.campoSistema}
                          </code>
                        </TableCell>
                        <TableCell className="text-center">
                          <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                            {item.campoTCE}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.obrigatorio ? (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Obrigatório
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Opcional</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.descricao}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medicoes">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Configuração de mapeamento de medições em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fornecedores">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Configuração de mapeamento de fornecedores em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleResetar}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restaurar Padrão
          </Button>
          <Button onClick={handleSalvar}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
