import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, PieChart, Calendar, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DashboardFinanceiro() {
  // Mock data financeiro
  const resumoFinanceiro = {
    orcamento_total: 15000000,
    executado: 8500000,
    empenhado: 10200000,
    disponivel: 4800000,
  };

  const stats = [
    {
      titulo: "Orçamento Total",
      valor: resumoFinanceiro.orcamento_total,
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      titulo: "Total Executado",
      valor: resumoFinanceiro.executado,
      percentual: (resumoFinanceiro.executado / resumoFinanceiro.orcamento_total) * 100,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      titulo: "Total Empenhado",
      valor: resumoFinanceiro.empenhado,
      percentual: (resumoFinanceiro.empenhado / resumoFinanceiro.orcamento_total) * 100,
      icon: PieChart,
      color: "text-orange-600",
    },
    {
      titulo: "Saldo Disponível",
      valor: resumoFinanceiro.disponivel,
      percentual: (resumoFinanceiro.disponivel / resumoFinanceiro.orcamento_total) * 100,
      icon: TrendingDown,
      color: "text-purple-600",
    },
  ];

  const execucaoPorObra = [
    {
      id: 1,
      obra: "Pavimentação da Rua das Flores",
      orcado: 850000,
      executado: 382500,
      percentual: 45,
      status: "No Prazo",
    },
    {
      id: 2,
      obra: "Construção de Creche Municipal",
      orcado: 1200000,
      executado: 0,
      percentual: 0,
      status: "Não Iniciada",
    },
    {
      id: 3,
      obra: "Reforma da Praça Central",
      orcado: 350000,
      executado: 350000,
      percentual: 100,
      status: "Concluída",
    },
    {
      id: 4,
      obra: "Construção de Ponte",
      orcado: 2500000,
      executado: 500000,
      percentual: 20,
      status: "No Prazo",
    },
  ];

  const pagamentosPendentes = [
    {
      id: 1,
      medicao: "002/2025",
      obra: "Pavimentação da Rua das Flores",
      fornecedor: "Construtora ABC Ltda",
      valor: 170000,
      vencimento: "2025-02-15",
    },
    {
      id: 2,
      medicao: "001/2025",
      obra: "Construção de Ponte",
      fornecedor: "Obras & Cia",
      valor: 500000,
      vencimento: "2025-02-20",
    },
  ];

  const execucaoPorSecretaria = [
    { secretaria: "Secretaria de Obras", orcado: 8000000, executado: 5200000, percentual: 65 },
    { secretaria: "Secretaria de Educação", orcado: 4000000, executado: 1800000, percentual: 45 },
    { secretaria: "Secretaria de Saúde", orcado: 2000000, executado: 1200000, percentual: 60 },
    { secretaria: "Secretaria de Urbanismo", orcado: 1000000, executado: 300000, percentual: 30 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">Análise da execução orçamentária e financeira das obras</p>
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
                <div className="text-2xl font-bold">{formatCurrency(stat.valor)}</div>
                {stat.percentual && (
                  <div className="mt-2">
                    <Progress value={stat.percentual} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{stat.percentual.toFixed(1)}% do total</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="obras" className="space-y-4">
          <TabsList>
            <TabsTrigger value="obras">Execução por Obra</TabsTrigger>
            <TabsTrigger value="secretarias">Por Secretaria</TabsTrigger>
            <TabsTrigger value="pendencias">Pagamentos Pendentes</TabsTrigger>
          </TabsList>

          <TabsContent value="obras">
            <Card>
              <CardHeader>
                <CardTitle>Execução Orçamentária por Obra</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obra</TableHead>
                      <TableHead>Orçado</TableHead>
                      <TableHead>Executado</TableHead>
                      <TableHead>Execução</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {execucaoPorObra.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.obra}</TableCell>
                        <TableCell>{formatCurrency(item.orcado)}</TableCell>
                        <TableCell>{formatCurrency(item.executado)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress value={item.percentual} className="h-2 flex-1" />
                              <span className="text-sm w-12">{item.percentual}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === "Concluída"
                                ? "default"
                                : item.status === "Não Iniciada"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="secretarias">
            <Card>
              <CardHeader>
                <CardTitle>Execução por Unidade Gestora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {execucaoPorSecretaria.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.secretaria}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(item.executado)} / {formatCurrency(item.orcado)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={item.percentual} className="h-3" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{item.percentual}% executado</span>
                          <span>{formatCurrency(item.orcado - item.executado)} disponível</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pendencias">
            <Card>
              <CardHeader>
                <CardTitle>
                  <AlertCircle className="h-5 w-5 inline mr-2 text-orange-600" />
                  Pagamentos Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medição</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagamentosPendentes.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.medicao}</TableCell>
                        <TableCell>{item.obra}</TableCell>
                        <TableCell>{item.fornecedor}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(item.valor)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(item.vencimento).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Total de Pagamentos Pendentes:</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(pagamentosPendentes.reduce((acc, item) => acc + item.valor, 0))}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
