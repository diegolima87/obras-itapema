import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileSpreadsheet, 
  Send, 
  FileText, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Download
} from "lucide-react";
import { useIntegracoesTCE } from "@/hooks/useIntegracoesTCE";

export default function ESfinge() {
  const { data: integracoes, isLoading } = useIntegracoesTCE();
  
  // Pega apenas os últimos 4 envios
  const ultimosEnvios = (integracoes || []).slice(0, 4);

  const statusConfig = {
    sucesso: { color: "bg-green-500", icon: CheckCircle2, label: "Sucesso" },
    erro: { color: "bg-red-500", icon: AlertCircle, label: "Erro" },
    pendente: { color: "bg-yellow-500", icon: Clock, label: "Pendente" }
  };

  const stats = {
    total: integracoes?.length || 0,
    sucesso: integracoes?.filter(i => i.status === 'sucesso').length || 0,
    erro: integracoes?.filter(i => i.status === 'erro').length || 0,
    pendente: integracoes?.filter(i => i.status === 'pendente').length || 0,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integração e-Sfinge</h1>
          <p className="text-muted-foreground">
            Sistema de integração com TCE/SC para envio de dados de obras públicas
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/e-sfinge/exportacao">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Exportar e Validar
                </CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Exportar dados e validar antes do envio
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/e-sfinge/envio">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Envio Manual
                </CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Enviar dados manualmente ao TCE/SC
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/e-sfinge/logs">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Histórico TCE
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Histórico completo de envios ao TCE-SC
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/e-sfinge/mapeamento">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mapeamento de Campos
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Configurar correspondência de campos
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Envios Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +3 comparado a ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">91.7%</div>
              <p className="text-xs text-muted-foreground mt-1">
                11 de 12 envios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Registros Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                Aguardando validação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos Envios</CardTitle>
            <CardDescription>
              Histórico recente de envios ao e-Sfinge TCE/SC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ultimosEnvios.map((envio) => {
                const StatusIcon = statusConfig[envio.status as keyof typeof statusConfig].icon;
                
                return (
                  <div key={envio.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${statusConfig[envio.status as keyof typeof statusConfig].color}`}>
                        <StatusIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{envio.tipo}</p>
                          <Badge variant={envio.status === 'sucesso' ? 'default' : envio.status === 'erro' ? 'destructive' : 'secondary'}>
                            {statusConfig[envio.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(envio.created_at).toLocaleDateString('pt-BR')}
                          {envio.protocolo && ` • Protocolo: ${envio.protocolo}`}
                        </p>
                        {envio.mensagem_erro && (
                          <p className="text-sm text-red-600 mt-1">{envio.mensagem_erro}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
                      {envio.status === 'sucesso' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Sobre o e-Sfinge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              O e-Sfinge é o sistema oficial do Tribunal de Contas de Santa Catarina (TCE/SC) 
              para recebimento de informações sobre contratos, licitações, obras e medições. 
              Esta integração permite o envio automatizado de dados, garantindo conformidade 
              com as exigências de transparência e prestação de contas.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
