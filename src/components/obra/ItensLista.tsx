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
import { Plus, Upload, Search, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ImportarItens } from "./ImportarItens";
import { NovoItem } from "./NovoItem";

interface ItensListaProps {
  obraId: string;
}

export function ItensLista({ obraId }: ItensListaProps) {
  const [showImport, setShowImport] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [itens] = useState([
    {
      id: "1",
      codigo: "001",
      descricao: "Escavação mecânica de valas",
      unidade: "m³",
      quantidade_contratada: 150,
      quantidade_executada: 45,
      valor_unitario: 85.5,
      valor_total: 12825,
    },
    {
      id: "2",
      codigo: "002",
      descricao: "Aterro compactado",
      unidade: "m³",
      quantidade_contratada: 200,
      quantidade_executada: 80,
      valor_unitario: 62.3,
      valor_total: 12460,
    },
  ]);

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
            <Input placeholder="Buscar itens..." className="pl-9" />
          </div>

          {itens.length === 0 ? (
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
                  {itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.codigo}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell className="text-right">
                        {item.quantidade_contratada.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantidade_executada.toLocaleString("pt-BR")}
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
                        }).format(item.valor_total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
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
