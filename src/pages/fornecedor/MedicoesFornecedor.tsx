import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FornecedorLayout } from "@/components/fornecedor/FornecedorLayout";
import { useMinhasMedicoes } from "@/hooks/useFornecedorData";
import { FileText, Loader2, Plus } from "lucide-react";
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

export default function MedicoesFornecedor() {
  const { data: medicoes, isLoading } = useMinhasMedicoes();

  return (
    <FornecedorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minhas Medições</h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe o status de suas medições
            </p>
          </div>
          <Link to="/medicoes/nova">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Medição
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : medicoes && medicoes.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Todas as Medições</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data Envio</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicoes.map((medicao) => (
                      <TableRow key={medicao.id}>
                        <TableCell className="font-medium">
                          {medicao.numero_medicao}
                        </TableCell>
                        <TableCell>{medicao.obra?.nome || "N/A"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {medicao.contrato?.numero || "N/A"}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(medicao.valor_executado || 0)}
                        </TableCell>
                        <TableCell>
                          {medicao.data_envio
                            ? new Date(medicao.data_envio).toLocaleDateString("pt-BR")
                            : "-"}
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
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma medição encontrada</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Você ainda não possui medições cadastradas. Clique no botão abaixo para
                criar sua primeira medição.
              </p>
              <Link to="/medicoes/nova">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Medição
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </FornecedorLayout>
  );
}
