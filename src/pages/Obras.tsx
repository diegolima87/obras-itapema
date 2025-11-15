import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Search, Eye, AlertCircle } from "lucide-react";
import { statusColors, statusLabels } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { useObras } from "@/hooks/useObras";

export default function Obras() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: obras, isLoading, error } = useObras();

  const obrasFiltradas = obras?.filter((obra) =>
    obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Obras</h1>
            <p className="text-muted-foreground">
              Gestão completa de obras públicas
            </p>
          </div>
          <Link to="/obras/nova">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Obra
            </Button>
          </Link>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar obras..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar obras: {(error as Error).message}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {obrasFiltradas?.map((obra) => (
              <Card key={obra.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{obra.nome}</CardTitle>
                    <Badge className={statusColors[obra.status as keyof typeof statusColors]}>
                      {statusLabels[obra.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {obra.descricao}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unidade:</span>
                      <span className="font-medium">{obra.unidade_gestora}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(obra.valor_total)}
                      </span>
                    </div>
                    {obra.status !== "planejada" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Progresso:</span>
                        <span className="font-medium">{obra.percentual_executado}%</span>
                      </div>
                    )}
                  </div>
                  <Link to={`/obras/${obra.id}`}>
                    <Button className="w-full" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}