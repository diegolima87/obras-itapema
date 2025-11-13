import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileText, Download, FileSpreadsheet, Calendar, Building2, FileBarChart, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Relatorios() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGerarRelatorio = (tipo: string, formato: string) => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Relatório gerado!",
        description: `Relatório ${tipo} em formato ${formato} está pronto para download`,
      });
      setLoading(false);
    }, 2000);
  };

  const relatoriosDisponiveis = [
    {
      id: "obras",
      titulo: "Relatório de Obras",
      descricao: "Listagem completa das obras com status, valores e andamento",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      id: "contratos",
      titulo: "Relatório de Contratos",
      descricao: "Contratos ativos, vencidos e valores totais por fornecedor",
      icon: FileText,
      color: "text-green-600",
    },
    {
      id: "medicoes",
      titulo: "Relatório de Medições",
      descricao: "Medições aprovadas, pendentes e reprovadas por período",
      icon: FileBarChart,
      color: "text-purple-600",
    },
    {
      id: "fisico-financeiro",
      titulo: "Relatório Físico-Financeiro",
      descricao: "Análise consolidada da execução física e financeira das obras",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      id: "aditivos",
      titulo: "Relatório de Aditivos",
      descricao: "Termos aditivos por contrato com valores e prazos",
      icon: FileText,
      color: "text-red-600",
    },
    {
      id: "tce",
      titulo: "Relatório para TCE/SC",
      descricao: "Relatório formatado para envio ao Tribunal de Contas (e-Sfinge)",
      icon: FileSpreadsheet,
      color: "text-indigo-600",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Gere relatórios gerenciais em PDF ou Excel</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {relatoriosDisponiveis.map((relatorio) => (
            <Card key={relatorio.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${relatorio.color}`}>
                    <relatorio.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{relatorio.titulo}</CardTitle>
                    <CardDescription className="mt-2">{relatorio.descricao}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data Início</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Data Fim</Label>
                    <Input type="date" />
                  </div>
                </div>

                {relatorio.id === "obras" && (
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue="todos">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Status</SelectItem>
                        <SelectItem value="andamento">Em Andamento</SelectItem>
                        <SelectItem value="planejada">Planejadas</SelectItem>
                        <SelectItem value="concluida">Concluídas</SelectItem>
                        <SelectItem value="paralisada">Paralisadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {relatorio.id === "medicoes" && (
                  <div className="space-y-2">
                    <Label>Status da Medição</Label>
                    <Select defaultValue="todos">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas</SelectItem>
                        <SelectItem value="aprovado">Aprovadas</SelectItem>
                        <SelectItem value="pendente">Pendentes</SelectItem>
                        <SelectItem value="reprovado">Reprovadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    disabled={loading}
                    onClick={() => handleGerarRelatorio(relatorio.titulo, "PDF")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    disabled={loading}
                    onClick={() => handleGerarRelatorio(relatorio.titulo, "Excel")}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <Calendar className="h-5 w-5 inline mr-2" />
              Relatórios Programados
            </CardTitle>
            <CardDescription>Configure relatórios automáticos enviados por email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Relatório Mensal de Obras</p>
                  <p className="text-sm text-muted-foreground">Enviado todo dia 1º de cada mês</p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Relatório Semanal de Medições</p>
                  <p className="text-sm text-muted-foreground">Enviado toda segunda-feira</p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Adicionar Novo Relatório Programado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
