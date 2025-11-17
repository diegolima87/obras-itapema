import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Palette, Globe, Bell, Loader2 } from "lucide-react";
import { useTenantConfig } from "@/hooks/useTenantConfig";
import { ColorPicker } from "@/components/configuracoes/ColorPicker";
import { LogoUploader } from "@/components/configuracoes/LogoUploader";
import { Skeleton } from "@/components/ui/skeleton";

export default function Configuracoes() {
  const { tenant, updateConfig, isLoading, isUpdating } = useTenantConfig();

  const [configGeral, setConfigGeral] = useState({
    nome_sistema: "",
    nome_municipio: "",
    cnpj: "",
    uf: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  const [configWhitelabel, setConfigWhitelabel] = useState({
    cor_primaria: "#132A72",
    cor_secundaria: "#142050",
    cor_destaque: "#3B82F6",
    subdominio: "",
    dominio_customizado: "",
  });

  const [configPortal, setConfigPortal] = useState({
    portal_ativo: true,
    exigir_aprovacao: true,
    mostrar_valores: true,
    mostrar_fornecedores: true,
    permitir_comentarios: false,
  });

  useEffect(() => {
    if (tenant) {
      setConfigGeral({
        nome_sistema: tenant.nome_sistema || "",
        nome_municipio: tenant.nome_municipio || "",
        cnpj: tenant.cnpj || "",
        uf: tenant.uf || "",
        telefone: tenant.telefone || "",
        email: tenant.email || "",
        endereco: tenant.endereco || "",
      });

      setConfigWhitelabel({
        cor_primaria: tenant.cor_primaria || "#132A72",
        cor_secundaria: tenant.cor_secundaria || "#142050",
        cor_destaque: tenant.cor_destaque || "#3B82F6",
        subdominio: tenant.subdominio || "",
        dominio_customizado: tenant.dominio_customizado || "",
      });

      setConfigPortal({
        portal_ativo: tenant.portal_ativo ?? true,
        exigir_aprovacao: tenant.exigir_aprovacao ?? true,
        mostrar_valores: tenant.mostrar_valores ?? true,
        mostrar_fornecedores: tenant.mostrar_fornecedores ?? true,
        permitir_comentarios: tenant.permitir_comentarios ?? false,
      });
    }
  }, [tenant]);

  const handleSalvarGeral = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig.mutate(configGeral);
  };

  const handleSalvarWhitelabel = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig.mutate(configWhitelabel);
  };

  const handleSalvarPortal = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig.mutate(configPortal);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </MainLayout>
    );
  }

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
            <TabsTrigger value="whitelabel">Whitelabel</TabsTrigger>
            <TabsTrigger value="portal">Portal Público</TabsTrigger>
          </TabsList>

          {/* ABA GERAL */}
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
                        placeholder="Sistema de Gestão de Obras"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nome_municipio">Nome do Município</Label>
                      <Input
                        id="nome_municipio"
                        value={configGeral.nome_municipio}
                        onChange={(e) => setConfigGeral({ ...configGeral, nome_municipio: e.target.value })}
                        placeholder="Itampema"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="uf">UF</Label>
                      <Input
                        id="uf"
                        value={configGeral.uf}
                        onChange={(e) => setConfigGeral({ ...configGeral, uf: e.target.value.toUpperCase() })}
                        placeholder="SC"
                        maxLength={2}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={configGeral.cnpj}
                        onChange={(e) => setConfigGeral({ ...configGeral, cnpj: e.target.value })}
                        placeholder="00.000.000/0001-00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={configGeral.telefone}
                        onChange={(e) => setConfigGeral({ ...configGeral, telefone: e.target.value })}
                        placeholder="(00) 0000-0000"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={configGeral.email}
                        onChange={(e) => setConfigGeral({ ...configGeral, email: e.target.value })}
                        placeholder="contato@prefeitura.gov.br"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={configGeral.endereco}
                        onChange={(e) => setConfigGeral({ ...configGeral, endereco: e.target.value })}
                        placeholder="Rua Principal, 123 - Centro"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Configurações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA WHITELABEL */}
          <TabsContent value="whitelabel">
            <div className="space-y-6">
              {/* Identidade Visual */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>Identidade Visual</CardTitle>
                      <CardDescription>Personalize logos e cores do sistema</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload de Logos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LogoUploader
                      title="Logo Principal"
                      description="Tema claro (PNG/SVG, máx 2MB)"
                      currentUrl={tenant?.logo_url}
                      type="logo_url"
                    />

                    <LogoUploader
                      title="Logo Escura"
                      description="Tema escuro (PNG/SVG, máx 2MB)"
                      currentUrl={tenant?.logo_dark_url}
                      type="logo_dark_url"
                    />

                    <LogoUploader
                      title="Favicon"
                      description="Ícone do site (ICO/PNG, máx 500KB)"
                      currentUrl={tenant?.favicon_url}
                      type="favicon_url"
                      accept="image/x-icon,image/png,image/vnd.microsoft.icon"
                    />
                  </div>

                  {/* Cores do Sistema */}
                  <form onSubmit={handleSalvarWhitelabel} className="space-y-6">
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4">Cores do Sistema</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ColorPicker
                          label="Cor Primária"
                          value={configWhitelabel.cor_primaria}
                          onChange={(value) => setConfigWhitelabel({ ...configWhitelabel, cor_primaria: value })}
                          defaultColor="#132A72"
                        />

                        <ColorPicker
                          label="Cor Secundária"
                          value={configWhitelabel.cor_secundaria}
                          onChange={(value) => setConfigWhitelabel({ ...configWhitelabel, cor_secundaria: value })}
                          defaultColor="#142050"
                        />

                        <ColorPicker
                          label="Cor de Destaque"
                          value={configWhitelabel.cor_destaque || "#3B82F6"}
                          onChange={(value) => setConfigWhitelabel({ ...configWhitelabel, cor_destaque: value })}
                          defaultColor="#3B82F6"
                        />
                      </div>

                      <Alert className="mt-4">
                        <Palette className="h-4 w-4" />
                        <AlertDescription>
                          As cores serão aplicadas automaticamente em todo o sistema após salvar.
                        </AlertDescription>
                      </Alert>
                    </div>

                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Salvar Cores
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Domínios */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>Domínios e Acesso</CardTitle>
                      <CardDescription>Configure como os usuários acessam o sistema</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSalvarWhitelabel} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subdominio">Subdomínio</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="subdominio"
                          value={configWhitelabel.subdominio}
                          onChange={(e) =>
                            setConfigWhitelabel({
                              ...configWhitelabel,
                              subdominio: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                            })
                          }
                          placeholder="itampema"
                          pattern="^[a-z0-9-]+$"
                          required
                        />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          .obrasdigital.com.br
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        URL de acesso: https://{configWhitelabel.subdominio || "seu-municipio"}.obrasdigital.com.br
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dominio_customizado">Domínio Customizado (Opcional)</Label>
                      <Input
                        id="dominio_customizado"
                        value={configWhitelabel.dominio_customizado}
                        onChange={(e) =>
                          setConfigWhitelabel({ ...configWhitelabel, dominio_customizado: e.target.value })
                        }
                        placeholder="obras.itampema.sc.gov.br"
                      />
                      <Alert>
                        <AlertDescription className="text-xs">
                          Para usar domínio customizado, configure os seguintes registros DNS:
                          <ul className="list-disc ml-4 mt-2 space-y-1">
                            <li>Tipo A (@): aponte para 185.158.133.1</li>
                            <li>Tipo A (www): aponte para 185.158.133.1</li>
                            <li>
                              Tipo TXT (_lovable): lovable_verify=SEU_CODIGO (entre em contato com o suporte)
                            </li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>

                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Salvar Domínios
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ABA PORTAL PÚBLICO */}
          <TabsContent value="portal">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Portal Público</CardTitle>
                <CardDescription>Defina o que será visível no portal de transparência</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSalvarPortal} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label htmlFor="portal_ativo">Portal Ativo</Label>
                        <p className="text-sm text-muted-foreground">Ativar ou desativar o portal público</p>
                      </div>
                      <Switch
                        id="portal_ativo"
                        checked={configPortal.portal_ativo}
                        onCheckedChange={(checked) => setConfigPortal({ ...configPortal, portal_ativo: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label htmlFor="exigir_aprovacao">Exigir Aprovação</Label>
                        <p className="text-sm text-muted-foreground">
                          Exigir aprovação antes de publicar obras no portal
                        </p>
                      </div>
                      <Switch
                        id="exigir_aprovacao"
                        checked={configPortal.exigir_aprovacao}
                        onCheckedChange={(checked) =>
                          setConfigPortal({ ...configPortal, exigir_aprovacao: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label htmlFor="mostrar_valores">Mostrar Valores</Label>
                        <p className="text-sm text-muted-foreground">Exibir valores financeiros das obras</p>
                      </div>
                      <Switch
                        id="mostrar_valores"
                        checked={configPortal.mostrar_valores}
                        onCheckedChange={(checked) => setConfigPortal({ ...configPortal, mostrar_valores: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label htmlFor="mostrar_fornecedores">Mostrar Fornecedores</Label>
                        <p className="text-sm text-muted-foreground">Exibir informações dos fornecedores</p>
                      </div>
                      <Switch
                        id="mostrar_fornecedores"
                        checked={configPortal.mostrar_fornecedores}
                        onCheckedChange={(checked) =>
                          setConfigPortal({ ...configPortal, mostrar_fornecedores: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label htmlFor="permitir_comentarios">Permitir Comentários</Label>
                        <p className="text-sm text-muted-foreground">Permitir cidadãos comentarem nas obras</p>
                      </div>
                      <Switch
                        id="permitir_comentarios"
                        checked={configPortal.permitir_comentarios}
                        onCheckedChange={(checked) =>
                          setConfigPortal({ ...configPortal, permitir_comentarios: checked })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Configurações
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