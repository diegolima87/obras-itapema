import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield, Search, Download, FileJson, FileSpreadsheet, Eye, Lock, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogsAuditoria, useEstatisticasAuditoria } from "@/hooks/useLogsAuditoria";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function LogAuditoria() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAcao, setFiltroAcao] = useState("");
  const [filtroTabela, setFiltroTabela] = useState("");
  const [exportando, setExportando] = useState(false);
  const [logSelecionado, setLogSelecionado] = useState<any>(null);

  const { data: logs, isLoading } = useLogsAuditoria({
    acao: filtroAcao || undefined,
    tabela: filtroTabela || undefined,
  });

  const { data: estatisticas } = useEstatisticasAuditoria();

  const handleExportar = async (tipo: "obras" | "contratos" | "medicoes", formato: "csv" | "json") => {
    setExportando(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Você precisa estar autenticado para exportar dados");
        return;
      }

      const response = await fetch(
        `https://xazlcbykmummjteoojvf.supabase.co/functions/v1/exportar-dados?tipo=${tipo}&formato=${formato}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao exportar dados");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tipo}_${new Date().toISOString().split("T")[0]}.${formato}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} exportado com sucesso!`);
    } catch (error: any) {
      console.error("Erro ao exportar:", error);
      toast.error(error.message || "Erro ao exportar dados");
    } finally {
      setExportando(false);
    }
  };

  const filteredLogs = logs?.filter((log) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      log.usuario?.nome?.toLowerCase().includes(searchLower) ||
      log.usuario?.email?.toLowerCase().includes(searchLower) ||
      log.acao.toLowerCase().includes(searchLower) ||
      log.tabela.toLowerCase().includes(searchLower)
    );
  }) || [];

  const acaoColors: Record<string, string> = {
    INSERT: "bg-green-500",
    UPDATE: "bg-blue-500",
    DELETE: "bg-red-500",
    EXPORTACAO: "bg-purple-500",
    LOGIN: "bg-gray-500",
    LOGOUT: "bg-gray-400",
  };

  const tabelasDisponiveis = Array.from(new Set(logs?.map((log) => log.tabela) || []));
  const acoesDisponiveis = Array.from(new Set(logs?.map((log) => log.acao) || []));

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Segurança e Auditoria</h1>
            <p className="text-muted-foreground">
              Logs de auditoria, exportações e conformidade LGPD
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Logs (30 dias)</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{estatisticas.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ações Mais Comuns</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  {Object.entries(estatisticas.acoesPorTipo)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([acao, count]) => (
                      <div key={acao} className="flex justify-between">
                        <span className="text-muted-foreground">{acao}</span>
                        <span className="font-medium text-foreground">{count as number}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tabelas Monitoradas</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Object.keys(estatisticas.acoesPorTabela).length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Separator />

        {/* Seção de Exportação */}
        <Card>
          <CardHeader>
            <CardTitle>Exportações de Dados</CardTitle>
            <CardDescription>
              Exporte dados de obras, contratos e medições em formato CSV ou JSON.
              Todos os dados exportados seguem as diretrizes da LGPD.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Obras</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleExportar("obras", "csv")}
                    disabled={exportando}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleExportar("obras", "json")}
                    disabled={exportando}
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contratos</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleExportar("contratos", "csv")}
                    disabled={exportando}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleExportar("contratos", "json")}
                    disabled={exportando}
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medições</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleExportar("medicoes", "csv")}
                    disabled={exportando}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleExportar("medicoes", "json")}
                    disabled={exportando}
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border">
              <div className="flex items-start gap-2">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Conformidade LGPD</p>
                  <p className="text-xs text-muted-foreground">
                    Todos os dados exportados seguem as boas práticas da Lei Geral de Proteção de Dados (LGPD).
                    Informações pessoais sensíveis não são incluídas em exportações públicas. 
                    Os logs de exportação são registrados para fins de auditoria e governança.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Logs de Auditoria */}
        <Card>
          <CardHeader>
            <CardTitle>Logs de Auditoria</CardTitle>
            <CardDescription>
              Histórico completo de ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Usuário, ação, tabela..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acao">Ação</Label>
                <Select value={filtroAcao} onValueChange={setFiltroAcao}>
                  <SelectTrigger id="acao">
                    <SelectValue placeholder="Todas as ações" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as ações</SelectItem>
                    {acoesDisponiveis.map((acao) => (
                      <SelectItem key={acao} value={acao}>
                        {acao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tabela">Tabela</Label>
                <Select value={filtroTabela} onValueChange={setFiltroTabela}>
                  <SelectTrigger id="tabela">
                    <SelectValue placeholder="Todas as tabelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as tabelas</SelectItem>
                    {tabelasDisponiveis.map((tabela) => (
                      <SelectItem key={tabela} value={tabela}>
                        {tabela}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("");
                    setFiltroAcao("");
                    setFiltroTabela("");
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>

            {/* Tabela de Logs */}
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum log de auditoria encontrado</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Tabela</TableHead>
                      <TableHead>Registro ID</TableHead>
                      <TableHead className="text-right">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(log.created_at).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {log.usuario?.nome || "Sistema"}
                            </p>
                            {log.usuario?.email && (
                              <p className="text-xs text-muted-foreground">
                                {log.usuario.email}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={acaoColors[log.acao] || "bg-gray-500"}>
                            {log.acao}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.tabela}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.registro_id ? log.registro_id.substring(0, 8) + "..." : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLogSelecionado(log)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Log de Auditoria</DialogTitle>
                                <DialogDescription>
                                  Informações completas sobre a ação realizada
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">Data/Hora</Label>
                                    <p className="font-mono text-sm text-foreground">
                                      {new Date(log.created_at).toLocaleString("pt-BR")}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Usuário</Label>
                                    <p className="text-sm text-foreground">
                                      {log.usuario?.nome || "Sistema"}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Ação</Label>
                                    <p className="text-sm text-foreground">{log.acao}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Tabela</Label>
                                    <p className="text-sm text-foreground">{log.tabela}</p>
                                  </div>
                                </div>

                                {log.dados_antes && (
                                  <div>
                                    <Label className="text-muted-foreground">Dados Antes</Label>
                                    <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                                      {JSON.stringify(log.dados_antes, null, 2)}
                                    </pre>
                                  </div>
                                )}

                                {log.dados_depois && (
                                  <div>
                                    <Label className="text-muted-foreground">Dados Depois</Label>
                                    <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                                      {JSON.stringify(log.dados_depois, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
