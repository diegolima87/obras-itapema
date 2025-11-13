import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  FileText,
  Calendar
} from "lucide-react";

export default function ESfingeLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const logs = [
    {
      id: 1,
      protocolo: "TCE-2024-000123",
      tipo: "Obras",
      data: "2024-01-15 14:30:45",
      status: "sucesso",
      registros: 45,
      usuario: "João Silva",
      detalhes: "Envio mensal de obras concluído"
    },
    {
      id: 2,
      protocolo: "TCE-2024-000122",
      tipo: "Contratos",
      data: "2024-01-15 10:15:30",
      status: "sucesso",
      registros: 23,
      usuario: "Maria Santos",
      detalhes: "Contratos do período validados"
    },
    {
      id: 3,
      protocolo: "TCE-2024-000121",
      tipo: "Medições",
      data: "2024-01-14 16:20:15",
      status: "erro",
      registros: 12,
      usuario: "Pedro Costa",
      detalhes: "Erro: Campos obrigatórios ausentes",
      erro: "Campo 'valor_total' não preenchido em 3 registros"
    },
    {
      id: 4,
      protocolo: "TCE-2024-000120",
      tipo: "Fornecedores",
      data: "2024-01-14 09:00:00",
      status: "pendente",
      registros: 8,
      usuario: "Ana Lima",
      detalhes: "Aguardando processamento pelo TCE"
    },
    {
      id: 5,
      protocolo: "TCE-2024-000119",
      tipo: "Obras",
      data: "2024-01-13 15:45:20",
      status: "sucesso",
      registros: 38,
      usuario: "João Silva",
      detalhes: "Atualização de status de obras"
    },
    {
      id: 6,
      protocolo: "TCE-2024-000118",
      tipo: "Medições",
      data: "2024-01-13 11:30:00",
      status: "erro",
      registros: 15,
      usuario: "Maria Santos",
      detalhes: "Erro: Valor excede limite do contrato",
      erro: "Medição #034 com valor superior ao saldo contratual"
    },
    {
      id: 7,
      protocolo: "TCE-2024-000117",
      tipo: "Contratos",
      data: "2024-01-12 14:20:10",
      status: "sucesso",
      registros: 19,
      usuario: "Pedro Costa",
      detalhes: "Novos contratos cadastrados"
    },
    {
      id: 8,
      protocolo: "TCE-2024-000116",
      tipo: "Fornecedores",
      data: "2024-01-12 09:15:00",
      status: "sucesso",
      registros: 12,
      usuario: "Ana Lima",
      detalhes: "Atualização cadastral de fornecedores"
    }
  ];

  const statusConfig = {
    sucesso: { color: "default", icon: CheckCircle2, label: "Sucesso" },
    erro: { color: "destructive", icon: AlertCircle, label: "Erro" },
    pendente: { color: "secondary", icon: Clock, label: "Pendente" }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filtroStatus || log.status === filtroStatus;
    const matchesTipo = !filtroTipo || log.tipo === filtroTipo;

    return matchesSearch && matchesStatus && matchesTipo;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Logs de Integração</h1>
          <p className="text-muted-foreground">
            Histórico completo de envios ao e-Sfinge TCE/SC
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Envios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bem Sucedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">227</div>
              <p className="text-xs text-muted-foreground mt-1">
                91.5% de taxa de sucesso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Com Erros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">18</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requerem atenção
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em processamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
            <CardDescription>
              Encontre logs específicos de envio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por protocolo, tipo ou usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="sucesso">Sucesso</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Obras">Obras</SelectItem>
                  <SelectItem value="Contratos">Contratos</SelectItem>
                  <SelectItem value="Medições">Medições</SelectItem>
                  <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Histórico de Envios</CardTitle>
                <CardDescription>
                  {filteredLogs.length} registro(s) encontrado(s)
                </CardDescription>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registros</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const StatusIcon = statusConfig[log.status as keyof typeof statusConfig].icon;
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.protocolo}</TableCell>
                      <TableCell>{log.tipo}</TableCell>
                      <TableCell className="text-sm">{log.data}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[log.status as keyof typeof statusConfig].color as any}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[log.status as keyof typeof statusConfig].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.registros}</TableCell>
                      <TableCell>{log.usuario}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
