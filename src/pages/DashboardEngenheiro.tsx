import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building2, Clock, AlertTriangle, CheckCircle2, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardEngenheiro() {
  // Mock data
  const engenheiro = {
    nome: "João Silva",
    crea: "SC-123456",
  };

  const minhasObras = [
    {
      id: "1",
      nome: "Pavimentação da Rua das Flores",
      status: "andamento",
      percentual: 45,
      prazo_dias: 180,
      dias_decorridos: 90,
      medicoes_pendentes: 1,
    },
    {
      id: "3",
      nome: "Reforma da Praça Central",
      status: "concluida",
      percentual: 100,
      prazo_dias: 270,
      dias_decorridos: 268,
      medicoes_pendentes: 0,
    },
    {
      id: "5",
      nome: "Construção de Ponte",
      status: "andamento",
      percentual: 20,
      prazo_dias: 365,
      dias_decorridos: 30,
      medicoes_pendentes: 0,
    },
  ];

  const medicoesPendentes = [
    {
      id: "1",
      numero: "002/2025",
      obra: "Pavimentação da Rua das Flores",
      valor: 170000,
      data_envio: "2025-01-10",
    },
  ];

  const alertas = [
    {
      id: 1,
      tipo: "prazo",
      mensagem: "Obra: Construção de Ponte - 80% do prazo já consumido",
      severidade: "alta",
    },
    {
      id: 2,
      tipo: "medicao",
      mensagem: "1 medição aguardando análise há mais de 5 dias",
      severidade: "media",
    },
    {
      id: 3,
      tipo: "documento",
      mensagem: "Faltam documentos obrigatórios na obra Reforma da Praça Central",
      severidade: "baixa",
    },
  ];

  const stats = [
    {
      titulo: "Obras Sob Responsabilidade",
      valor: minhasObras.length,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      titulo: "Obras em Andamento",
      valor: minhasObras.filter((o) => o.status === "andamento").length,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      titulo: "Medições Pendentes",
      valor: medicoesPendentes.length,
      icon: FileText,
      color: "text-purple-600",
    },
    {
      titulo: "Obras Concluídas",
      valor: minhasObras.filter((o) => o.status === "concluida").length,
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ];

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case "alta":
        return "bg-red-500";
      case "media":
        return "bg-orange-500";
      case "baixa":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard do Engenheiro</h1>
          <p className="text-muted-foreground">
            {engenheiro.nome} - CREA: {engenheiro.crea}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.titulo}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.titulo}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.valor}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alertas */}
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="h-5 w-5 inline mr-2 text-orange-600" />
              Alertas e Pendências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertas.map((alerta) => (
                <div key={alerta.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge className={getSeveridadeColor(alerta.severidade)}>
                    {alerta.severidade.toUpperCase()}
                  </Badge>
                  <p className="flex-1 text-sm">{alerta.mensagem}</p>
                  <Button variant="ghost" size="sm">
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Minhas Obras */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Obras Sob Minha Responsabilidade</CardTitle>
              <Link to="/obras">
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Execução</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Medições Pendentes</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {minhasObras.map((obra) => (
                  <TableRow key={obra.id}>
                    <TableCell className="font-medium">{obra.nome}</TableCell>
                    <TableCell>
                      <Badge variant={obra.status === "concluida" ? "default" : "secondary"}>
                        {obra.status === "andamento" ? "Em Andamento" : "Concluída"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${obra.percentual}%` }}
                          />
                        </div>
                        <span className="text-sm">{obra.percentual}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>
                          {obra.dias_decorridos} / {obra.prazo_dias} dias
                        </p>
                        <p className="text-muted-foreground">
                          {Math.round((obra.dias_decorridos / obra.prazo_dias) * 100)}% do prazo
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {obra.medicoes_pendentes > 0 ? (
                        <Badge variant="secondary">{obra.medicoes_pendentes}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhuma</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link to={`/obras/${obra.id}`}>
                        <Button variant="ghost" size="sm">
                          Detalhes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Medições Pendentes de Análise */}
        {medicoesPendentes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Clock className="h-5 w-5 inline mr-2" />
                Medições Aguardando Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicoesPendentes.map((medicao) => (
                  <div key={medicao.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Medição {medicao.numero}</p>
                      <p className="text-sm text-muted-foreground">{medicao.obra}</p>
                      <p className="text-sm text-muted-foreground">
                        Enviada em {new Date(medicao.data_envio).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-semibold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(medicao.valor)}
                      </p>
                      <Link to={`/medicoes/${medicao.id}`}>
                        <Button size="sm">Analisar</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Próximas Atividades */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Calendar className="h-5 w-5 inline mr-2" />
              Próximas Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">Vistoria Técnica - Pavimentação da Rua das Flores</p>
                  <p className="text-sm text-muted-foreground">Amanhã, 10:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border-l-4 border-green-500">
                <FileText className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Relatório Mensal - Todas as Obras</p>
                  <p className="text-sm text-muted-foreground">Em 3 dias</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
