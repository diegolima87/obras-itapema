import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FornecedorLayout } from "@/components/fornecedor/FornecedorLayout";
import {
  useMeusContratos,
  useMinhasMedicoes,
} from "@/hooks/useFornecedorData";
import { Building2, FileText, Clock, CheckCircle, XCircle, Upload, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  analise: "Em Análise",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-500",
  analise: "bg-blue-500",
  aprovado: "bg-green-500",
  reprovado: "bg-red-500",
};

export default function DashboardFornecedor() {
  const { data: contratos, isLoading: loadingContratos } = useMeusContratos();
  const { data: medicoes, isLoading: loadingMedicoes } = useMinhasMedicoes();

  const contratosAtivos = contratos?.filter((c) => c.ativo).length || 0;
  const medicoesEmAnalise = medicoes?.filter((m) => m.status === "analise").length || 0;
  const medicoesAprovadas = medicoes?.filter((m) => m.status === "aprovado").length || 0;
  const medicoesReprovadas = medicoes?.filter((m) => m.status === "reprovado").length || 0;

  const stats = [
    { titulo: "Contratos Ativos", valor: contratosAtivos, icon: FileText, color: "text-blue-600" },
    { titulo: "Medições em Análise", valor: medicoesEmAnalise, icon: Clock, color: "text-orange-600" },
    { titulo: "Medições Aprovadas", valor: medicoesAprovadas, icon: CheckCircle, color: "text-emerald-600" },
    { titulo: "Medições Reprovadas", valor: medicoesReprovadas, icon: XCircle, color: "text-red-600" },
  ];

  const medicoesPendentes = medicoes?.filter(
    (m) => m.status === "pendente" || m.status === "analise"
  ).slice(0, 5);

  return (
    <FornecedorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Portal do Fornecedor</h2>
          <p className="text-muted-foreground">
            Gerencie suas obras, medições e documentos de forma centralizada
          </p>
        </div>

        {loadingContratos || loadingMedicoes ? (
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
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
        )}

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link to="/medicoes/nova">
                <Button className="w-full h-20" variant="outline">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Nova Medição</span>
                  </div>
                </Button>
              </Link>
              <Link to="/fornecedor/documentos">
                <Button className="w-full h-20" variant="outline">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Meus Documentos</span>
                  </div>
                </Button>
              </Link>
              <Link to="/fornecedor/obras">
                <Button className="w-full h-20" variant="outline">
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    <span>Minhas Obras</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Medições Recentes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadingMedicoes ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : medicoesPendentes && medicoesPendentes.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicoesPendentes.map((medicao) => (
                      <TableRow key={medicao.id}>
                        <TableCell className="font-medium">
                          {medicao.numero_medicao}
                        </TableCell>
                        <TableCell>{medicao.obra?.nome || "N/A"}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(medicao.valor_executado || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[medicao.status]}>
                            {statusLabels[medicao.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/medicoes/${medicao.id}/completo`}>
                            <Button variant="ghost" size="sm">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma medição no momento
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FornecedorLayout>
  );
}
