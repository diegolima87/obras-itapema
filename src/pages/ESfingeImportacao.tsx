import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  Database,
  TrendingUp
} from "lucide-react";
import { useLogsImportacaoTCE, useExecutarImportacao } from "@/hooks/useLogsImportacaoTCE";
import { useLiquidacoes } from "@/hooks/useLiquidacoes";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ESfingeImportacao() {
  const [filtroStatus, setFiltroStatus] = useState<string>("");
  
  const { data: logs = [], isLoading } = useLogsImportacaoTCE({ 
    status: filtroStatus || undefined 
  });
  const { data: liquidacoes = [] } = useLiquidacoes();
  const executarImportacao = useExecutarImportacao();

  const ultimaImportacao = logs[0];
  const importacoesHoje = logs.filter(log => {
    const hoje = new Date().toDateString();
    const dataLog = new Date(log.data_importacao).toDateString();
    return hoje === dataLog;
  });

  const totalImportado = logs.reduce((acc, log) => acc + log.registros_importados, 0);
  const totalErros = logs.reduce((acc, log) => acc + log.registros_erros, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sucesso':
        return <Badge className="bg-green-600"><CheckCircle2 className="mr-1 h-3 w-3" />Sucesso</Badge>;
      case 'erro':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Erro</Badge>;
      case 'concluido_com_erros':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><AlertCircle className="mr-1 h-3 w-3" />Com Erros</Badge>;
      case 'processando':
        return <Badge variant="outline"><RefreshCw className="mr-1 h-3 w-3 animate-spin" />Processando</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Importação Automática e-Sfinge</h1>
          <p className="text-muted-foreground">
            Monitore importações automáticas de dados do TCE/SC
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Importação</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ultimaImportacao ? (
                  formatDistanceToNow(new Date(ultimaImportacao.data_importacao), { 
                    addSuffix: true,
                    locale: ptBR 
                  })
                ) : (
                  'Nunca'
                )}
              </div>
              {ultimaImportacao && (
                <div className="mt-2">
                  {getStatusBadge(ultimaImportacao.status)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Importações Hoje</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{importacoesHoje.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {importacoesHoje.reduce((acc, log) => acc + log.registros_importados, 0)} registros
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Importado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalImportado}</div>
              <p className="text-xs text-muted-foreground mt-1">
                registros processados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liquidações</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liquidacoes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                no banco de dados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Actions Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
                <CardDescription>
                  Execute importação manual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  onClick={() => executarImportacao.mutate()}
                  disabled={executarImportacao.isPending}
                >
                  {executarImportacao.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Executar Importação
                    </>
                  )}
                </Button>

                <div className="space-y-2 pt-4">
                  <p className="text-sm font-medium">Próxima importação automática:</p>
                  <p className="text-sm text-muted-foreground">
                    Diariamente às 06:00 AM
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium">Tipos de dados importados:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Contratos e Aditivos</li>
                    <li>✓ Documentos Contratuais</li>
                    <li>✓ Liquidações</li>
                    <li>✓ Documentos Fiscais</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logs Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Histórico de Importações</CardTitle>
                    <CardDescription>
                      Últimas 50 importações registradas
                    </CardDescription>
                  </div>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="sucesso">Sucesso</SelectItem>
                      <SelectItem value="erro">Erro</SelectItem>
                      <SelectItem value="concluido_com_erros">Com Erros</SelectItem>
                      <SelectItem value="processando">Processando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando logs...
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma importação registrada ainda
                  </div>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(log.status)}
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.data_importacao).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          {log.tempo_execucao_ms && (
                            <Badge variant="outline">
                              {(log.tempo_execucao_ms / 1000).toFixed(2)}s
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Importados</p>
                            <p className="font-medium">{log.registros_importados}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Atualizados</p>
                            <p className="font-medium">{log.registros_atualizados}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Erros</p>
                            <p className="font-medium text-red-600">{log.registros_erros}</p>
                          </div>
                        </div>

                        {log.mensagem_erro && (
                          <div className="mt-2 p-2 bg-destructive/10 rounded text-sm text-destructive">
                            {log.mensagem_erro}
                          </div>
                        )}

                        {log.detalhes?.resultado && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                              Ver detalhes
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                              {JSON.stringify(log.detalhes.resultado, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
