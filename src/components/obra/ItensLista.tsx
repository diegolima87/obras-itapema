import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Upload, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { ImportarItens } from "./ImportarItens";
import { NovoItem } from "./NovoItem";
import { useItensObra, useDeletarItemObra } from "@/hooks/useItensObra";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ItensListaProps {
  obraId: string;
}

export function ItensLista({ obraId }: ItensListaProps) {
  const [showImport, setShowImport] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: itens, isLoading, error } = useItensObra(obraId);
  const deletarItem = useDeletarItemObra();
  
  const itensFiltrados = itens?.filter((item) =>
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      await deletarItem.mutateAsync({ id, obra_id: obraId });
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar itens: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Itens da Obra</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowImport(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Importar Planilha
              </Button>
              <Button onClick={() => setShowNew(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar itens..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : itensFiltrados.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum item cadastrado. Adicione itens manualmente ou importe uma planilha.
            </p>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Qtd. Contratada</TableHead>
                    <TableHead className="text-right">Qtd. Executada</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itensFiltrados.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.codigo || "-"}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell className="text-right">
                        {item.quantidade_total.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.quantidade_executada || 0).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.valor_unitario)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.valor_total || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" disabled>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletarItem.isPending}
                          >
                            {deletarItem.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ImportarItens
        open={showImport}
        onOpenChange={setShowImport}
        obraId={obraId}
      />
      <NovoItem open={showNew} onOpenChange={setShowNew} obraId={obraId} />
    </>
  );
}
