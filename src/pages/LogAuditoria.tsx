import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogAuditoria() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAcao, setFiltroAcao] = useState("todas");
  const [filtroUsuario, setFiltroUsuario] = useState("todos");

  // Mock data
  const logs = [
    {
      id: 1,
      data: "2025-01-15 14:32:15",
      usuario: "João Silva",
      acao: "Criou",
      modulo: "Obras",
      descricao: "Criou obra: Pavimentação da Rua das Flores",
      ip: "192.168.1.10",
    },
    {
      id: 2,
      data: "2025-01-15 14:28:03",
      usuario: "Maria Santos",
      acao: "Editou",
      modulo: "Contratos",
      descricao: "Editou contrato 001/2025",
      ip: "192.168.1.15",
    },
    {
      id: 3,
      data: "2025-01-15 13:45:22",
      usuario: "Pedro Oliveira",
      acao: "Aprovou",
      modulo: "Medições",
      descricao: "Aprovou medição 002/2025",
      ip: "192.168.1.20",
    },
    {
      id: 4,
      data: "2025-01-15 11:15:44",
      usuario: "Ana Costa",
      acao: "Visualizou",
      modulo: "Relatórios",
      descricao: "Gerou relatório de obras em PDF",
      ip: "192.168.1.25",
    },
    {
      id: 5,
      data: "2025-01-15 10:08:31",
      usuario: "João Silva",
      acao: "Deletou",
      modulo: "Usuários",
      descricao: "Removeu usuário: Carlos Ferreira",
      ip: "192.168.1.10",
    },
    {
      id: 6,
      data: "2025-01-14 16:52:09",
      usuario: "Maria Santos",
      acao: "Criou",
      modulo: "Fornecedores",
      descricao: "Cadastrou fornecedor: Construtora XYZ Ltda",
      ip: "192.168.1.15",
    },
    {
      id: 7,
      data: "2025-01-14 15:33:18",
      usuario: "Pedro Oliveira",
      acao: "Reprovou",
      modulo: "Medições",
      descricao: "Reprovou medição 001/2025",
      ip: "192.168.1.20",
    },
    {
      id: 8,
      data: "2025-01-14 14:21:55",
      usuario: "João Silva",
      acao: "Editou",
      modulo: "Obras",
      descricao: "Atualizou percentual de execução da obra #3",
      ip: "192.168.1.10",
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.modulo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchAcao = filtroAcao === "todas" || log.acao.toLowerCase() === filtroAcao.toLowerCase();
    const matchUsuario = filtroUsuario === "todos" || log.usuario === filtroUsuario;

    return matchSearch && matchAcao && matchUsuario;
  });

  const acaoColors: Record<string, string> = {
    Criou: "bg-green-500",
    Editou: "bg-blue-500",
    Deletou: "bg-red-500",
    Aprovou: "bg-emerald-500",
    Reprovou: "bg-orange-500",
    Visualizou: "bg-gray-500",
  };

  const usuariosUnicos = Array.from(new Set(logs.map((log) => log.usuario)));

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Log de Auditoria</h1>
            <p className="text-muted-foreground">Histórico completo de ações dos usuários no sistema</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle>Registro de Atividades</CardTitle>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  <Search className="h-4 w-4 inline mr-2" />
                  Buscar
                </Label>
                <Input
                  placeholder="Buscar por usuário, descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <Filter className="h-4 w-4 inline mr-2" />
                  Filtrar por Ação
                </Label>
                <Select value={filtroAcao} onValueChange={setFiltroAcao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Ações</SelectItem>
                    <SelectItem value="criou">Criou</SelectItem>
                    <SelectItem value="editou">Editou</SelectItem>
                    <SelectItem value="deletou">Deletou</SelectItem>
                    <SelectItem value="aprovou">Aprovou</SelectItem>
                    <SelectItem value="reprovou">Reprovou</SelectItem>
                    <SelectItem value="visualizou">Visualizou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filtrar por Usuário</Label>
                <Select value={filtroUsuario} onValueChange={setFiltroUsuario}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Usuários</SelectItem>
                    {usuariosUnicos.map((usuario) => (
                      <SelectItem key={usuario} value={usuario}>
                        {usuario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.data}</TableCell>
                      <TableCell className="font-medium">{log.usuario}</TableCell>
                      <TableCell>
                        <Badge className={acaoColors[log.acao]}>{log.acao}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.modulo}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{log.descricao}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-muted-foreground">
              Mostrando {filteredLogs.length} de {logs.length} registros
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total de Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{logs.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ações Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {logs.filter((l) => l.data.includes("2025-01-15")).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{usuariosUnicos.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ações Críticas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {logs.filter((l) => l.acao === "Deletou").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
