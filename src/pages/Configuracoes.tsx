import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Settings, Upload, Palette, Globe, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [configGeral, setConfigGeral] = useState({
    nome_sistema: "Sistema de Obras Públicas",
    nome_municipio: "Município Exemplo",
    cnpj: "12.345.678/0001-90",
    telefone: "(48) 3333-4444",
    email: "contato@prefeitura.gov.br",
  });

  const [configPortal, setConfigPortal] = useState({
    portal_ativo: true,
    exigir_aprovacao: true,
    mostrar_valores: true,
    mostrar_fornecedores: true,
    permitir_comentarios: false,
  });

  const [configNotificacoes, setConfigNotificacoes] = useState({
    email_medicoes: true,
    email_obras: true,
    email_contratos: false,
    email_documentos: true,
  });

  const handleSalvarGeral = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Configurações salvas!",
        description: "As configurações gerais foram atualizadas",
      });
      setLoading(false);
    }, 1000);
  };

  const handleSalvarPortal = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Configurações do portal salvas!",
        description: "As configurações do portal público foram atualizadas",
      });
      setLoading(false);
    }, 1000);
  };

  const handleSalvarNotificacoes = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Notificações configuradas!",
        description: "As preferências de notificações foram atualizadas",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
            <p className="text-muted-foreground">Gerencie as configurações e personalizações do sistema</p>
          </div>
        </div>

        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="aparencia">Aparência</TabsTrigger>
            <TabsTrigger value="portal">Portal Público</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Informações básicas do sistema e município</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSalvarGeral} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nome_sistema">Nome do Sistema</Label>
                      <Input
                        id="nome_sistema"
                        value={configGeral.nome_sistema}
                        onChange={(e) => setConfigGeral({ ...configGeral, nome_sistema: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nome_municipio">Nome do Município</Label>
                      <Input
                        id="nome_municipio"
                        value={configGeral.nome_municipio}
                        onChange={(e) => setConfigGeral({ ...configGeral, nome_municipio: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={configGeral.cnpj}
                        onChange={(e) => setConfigGeral({ ...configGeral, cnpj: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={configGeral.telefone}
                        onChange={(e) => setConfigGeral({ ...configGeral, telefone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={configGeral.email}
                        onChange={(e) => setConfigGeral({ ...configGeral, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aparencia">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Palette className="h-5 w-5 inline mr-2" />
                  Personalização Visual
                </CardTitle>
                <CardDescription>Personalize a aparência do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logotipo do Sistema</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Fazer Upload
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Formato: PNG, JPG. Tamanho máximo: 2MB</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Cor Primária</Label>
                    <div className="flex items-center gap-4">
                      <Input type="color" className="w-20 h-10" defaultValue="#0ea5e9" />
                      <span className="text-sm text-muted-foreground">Escolha a cor principal do sistema</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Fazer Upload
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Formato: ICO, PNG. Tamanho: 32x32px ou 16x16px</p>
                  </div>
                </div>

                <Button>Salvar Aparência</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portal">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Globe className="h-5 w-5 inline mr-2" />
                  Parâmetros do Portal Público
                </CardTitle>
                <CardDescription>Configure o que será exibido no portal de transparência</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSalvarPortal} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Portal Ativo</Label>
                        <p className="text-sm text-muted-foreground">
                          Habilitar ou desabilitar o portal público de transparência
                        </p>
                      </div>
                      <Switch
                        checked={configPortal.portal_ativo}
                        onCheckedChange={(checked) =>
                          setConfigPortal({ ...configPortal, portal_ativo: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Exigir Aprovação para Publicação</Label>
                        <p className="text-sm text-muted-foreground">
                          Obras precisam ser aprovadas antes de aparecer no portal
                        </p>
                      </div>
                      <Switch
                        checked={configPortal.exigir_aprovacao}
                        onCheckedChange={(checked) =>
                          setConfigPortal({ ...configPortal, exigir_aprovacao: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mostrar Valores Financeiros</Label>
                        <p className="text-sm text-muted-foreground">
                          Exibir valores totais e executados das obras
                        </p>
                      </div>
                      <Switch
                        checked={configPortal.mostrar_valores}
                        onCheckedChange={(checked) =>
                          setConfigPortal({ ...configPortal, mostrar_valores: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mostrar Fornecedores</Label>
                        <p className="text-sm text-muted-foreground">
                          Exibir informações dos fornecedores contratados
                        </p>
                      </div>
                      <Switch
                        checked={configPortal.mostrar_fornecedores}
                        onCheckedChange={(checked) =>
                          setConfigPortal({ ...configPortal, mostrar_fornecedores: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Permitir Comentários Públicos</Label>
                        <p className="text-sm text-muted-foreground">
                          Cidadãos podem comentar nas obras (requer moderação)
                        </p>
                      </div>
                      <Switch
                        checked={configPortal.permitir_comentarios}
                        onCheckedChange={(checked) =>
                          setConfigPortal({ ...configPortal, permitir_comentarios: checked })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Configurações do Portal"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Bell className="h-5 w-5 inline mr-2" />
                  Notificações por Email
                </CardTitle>
                <CardDescription>Configure quando você deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSalvarNotificacoes} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Novas Medições</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber email quando uma medição for enviada
                        </p>
                      </div>
                      <Switch
                        checked={configNotificacoes.email_medicoes}
                        onCheckedChange={(checked) =>
                          setConfigNotificacoes({ ...configNotificacoes, email_medicoes: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Atualizações de Obras</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber email quando uma obra for atualizada
                        </p>
                      </div>
                      <Switch
                        checked={configNotificacoes.email_obras}
                        onCheckedChange={(checked) =>
                          setConfigNotificacoes({ ...configNotificacoes, email_obras: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Vencimento de Contratos</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber email 30 dias antes do vencimento
                        </p>
                      </div>
                      <Switch
                        checked={configNotificacoes.email_contratos}
                        onCheckedChange={(checked) =>
                          setConfigNotificacoes({ ...configNotificacoes, email_contratos: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Documentos Pendentes</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber email sobre documentos obrigatórios pendentes
                        </p>
                      </div>
                      <Switch
                        checked={configNotificacoes.email_documentos}
                        onCheckedChange={(checked) =>
                          setConfigNotificacoes({ ...configNotificacoes, email_documentos: checked })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Preferências"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
