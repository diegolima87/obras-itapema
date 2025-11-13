import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, LogOut, ArrowLeft, MapPin, Calendar } from "lucide-react";

export default function ObrasFornecedor() {
  const fornecedor = {
    nome: "Construtora ABC Ltda",
    cnpj: "12.345.678/0001-90",
  };

  const obras = [
    {
      id: "1",
      nome: "Pavimentação da Rua das Flores",
      endereco: "Rua das Flores, 1000 - Centro",
      status: "andamento",
      contrato: "001/2024",
      valor_contrato: 850000,
      valor_executado: 382500,
      percentual: 45,
      data_inicio: "2024-01-15",
      data_fim_prevista: "2024-12-30",
      medicoes_enviadas: 2,
      medicoes_aprovadas: 1,
    },
    {
      id: "5",
      nome: "Construção de Ponte sobre o Rio Verde",
      endereco: "Acesso Norte - Zona Rural",
      status: "andamento",
      contrato: "003/2024",
      valor_contrato: 2500000,
      valor_executado: 500000,
      percentual: 20,
      data_inicio: "2024-10-01",
      data_fim_prevista: "2025-09-30",
      medicoes_enviadas: 1,
      medicoes_aprovadas: 1,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "andamento":
        return <Badge>Em Andamento</Badge>;
      case "concluida":
        return <Badge variant="default">Concluída</Badge>;
      case "paralisada":
        return <Badge variant="destructive">Paralisada</Badge>;
      default:
        return <Badge variant="secondary">Planejada</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">{fornecedor.nome}</h1>
                <p className="text-sm text-muted-foreground">CNPJ: {fornecedor.cnpj}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/fornecedor/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Minhas Obras</h2>
            <p className="text-muted-foreground">Obras vinculadas aos seus contratos</p>
          </div>

          <div className="grid gap-6">
            {obras.map((obra) => (
              <Card key={obra.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-3">
                        <CardTitle className="text-xl">{obra.nome}</CardTitle>
                        {getStatusBadge(obra.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {obra.endereco}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contrato</p>
                      <p className="font-medium">{obra.contrato}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor do Contrato</p>
                      <p className="font-medium text-lg">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(obra.valor_contrato)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Executado</p>
                      <p className="font-medium text-lg text-green-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(obra.valor_executado)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Execução Física</span>
                      <span className="font-medium">{obra.percentual}%</span>
                    </div>
                    <Progress value={obra.percentual} className="h-3" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Período</p>
                        <p className="font-medium">
                          {new Date(obra.data_inicio).toLocaleDateString("pt-BR")} até{" "}
                          {new Date(obra.data_fim_prevista).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Medições</p>
                      <p className="font-medium">
                        {obra.medicoes_aprovadas} aprovadas / {obra.medicoes_enviadas} enviadas
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Link to={`/fornecedor/medicoes/nova?obra=${obra.id}`} className="flex-1">
                      <Button className="w-full">Enviar Medição</Button>
                    </Link>
                    <Link to={`/obra/${obra.id}`}>
                      <Button variant="outline">Ver Detalhes Públicos</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {obras.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma obra encontrada</h3>
                <p className="text-muted-foreground">
                  Você ainda não possui obras vinculadas aos seus contratos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
