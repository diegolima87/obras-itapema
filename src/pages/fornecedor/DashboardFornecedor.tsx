import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Clock, CheckCircle, AlertCircle, Upload, LogOut } from "lucide-react";

export default function DashboardFornecedor() {
  // Mock data do fornecedor
  const fornecedor = {
    nome: "Construtora ABC Ltda",
    cnpj: "12.345.678/0001-90",
  };

  const stats = [
    { titulo: "Obras Ativas", valor: "3", icon: Building2, color: "text-blue-600" },
    { titulo: "Contratos Vigentes", valor: "2", icon: FileText, color: "text-green-600" },
    { titulo: "Medições Pendentes", valor: "1", icon: Clock, color: "text-orange-600" },
    { titulo: "Medições Aprovadas", valor: "5", icon: CheckCircle, color: "text-emerald-600" },
  ];

  const medicoesPendentes = [
    {
      id: 1,
      numero: "002/2025",
      obra: "Pavimentação da Rua das Flores",
      valor: 170000,
      data_envio: "2025-01-10",
      status: "Em Análise",
    },
  ];

  const proximosVencimentos = [
    {
      id: 1,
      documento: "CND Federal",
      vencimento: "2025-02-15",
      dias: 10,
    },
    {
      id: 2,
      documento: "CND Estadual",
      vencimento: "2025-03-01",
      dias: 25,
    },
  ];

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
            <Button variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Portal do Fornecedor</h2>
            <p className="text-muted-foreground">Gerencie suas obras, medições e documentos</p>
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Link to="/fornecedor/medicoes/nova">
                  <Button className="w-full h-20" variant="outline">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6" />
                      <span>Enviar Medição</span>
                    </div>
                  </Button>
                </Link>
                <Link to="/fornecedor/documentos">
                  <Button className="w-full h-20" variant="outline">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-6 w-6" />
                      <span>Enviar Documentos</span>
                    </div>
                  </Button>
                </Link>
                <Link to="/fornecedor/obras">
                  <Button className="w-full h-20" variant="outline">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-6 w-6" />
                      <span>Ver Minhas Obras</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Medições Pendentes */}
            <Card>
              <CardHeader>
                <CardTitle>Medições Pendentes de Análise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicoesPendentes.map((medicao) => (
                    <div key={medicao.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Medição {medicao.numero}</p>
                          <p className="text-sm text-muted-foreground">{medicao.obra}</p>
                        </div>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {medicao.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Enviado em {new Date(medicao.data_envio).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(medicao.valor)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documentos Próximos ao Vencimento */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <AlertCircle className="h-5 w-5 inline mr-2 text-orange-600" />
                  Documentos a Vencer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proximosVencimentos.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{doc.documento}</p>
                          <p className="text-sm text-muted-foreground">
                            Vence em {new Date(doc.vencimento).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Badge variant={doc.dias <= 15 ? "destructive" : "secondary"}>
                          {doc.dias} dias
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Atualizar Documentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
