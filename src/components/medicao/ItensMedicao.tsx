import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMedicoesItens, useSalvarMedicoesItens, useDeletarMedicaoItem, MedicaoItem } from "@/hooks/useMedicoesItens";
import { Loader2, Save, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface ItensMedicaoProps {
  medicaoId: string;
  readOnly?: boolean;
}

export function ItensMedicao({ medicaoId, readOnly = false }: ItensMedicaoProps) {
  const { data: itens, isLoading } = useMedicoesItens(medicaoId);
  const salvarMutation = useSalvarMedicoesItens();
  const deletarMutation = useDeletarMedicaoItem();
  
  const [itensEditaveis, setItensEditaveis] = useState<Partial<MedicaoItem>[]>([]);

  useEffect(() => {
    if (itens) {
      setItensEditaveis(itens);
    }
  }, [itens]);

  const handleChange = (index: number, field: keyof MedicaoItem, value: any) => {
    const novosItens = [...itensEditaveis];
    novosItens[index] = {
      ...novosItens[index],
      [field]: value,
    };

    // Calcular valor total automaticamente
    if (field === "quantidade_executada" || field === "valor_unitario") {
      const qtd = parseFloat(novosItens[index].quantidade_executada as any) || 0;
      const valorUnit = parseFloat(novosItens[index].valor_unitario as any) || 0;
      novosItens[index].valor_total = qtd * valorUnit;
      novosItens[index].valor_executado = qtd * valorUnit;
    }

    setItensEditaveis(novosItens);
  };

  const handleSalvar = async () => {
    if (itensEditaveis.length === 0) {
      toast.error("Adicione pelo menos um item à medição");
      return;
    }

    await salvarMutation.mutateAsync(itensEditaveis);
  };

  const handleDeletar = async (itemId: string) => {
    if (confirm("Deseja realmente remover este item?")) {
      await deletarMutation.mutateAsync(itemId);
    }
  };

  const calcularTotal = () => {
    return itensEditaveis.reduce((sum, item) => sum + (item.valor_total || 0), 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Itens da Medição</CardTitle>
        {!readOnly && (
          <Button
            onClick={handleSalvar}
            disabled={salvarMutation.isPending}
            size="sm"
          >
            {salvarMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Itens
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Descrição</TableHead>
                <TableHead className="text-right">Qtd. Prevista</TableHead>
                <TableHead className="text-right">Qtd. Executada</TableHead>
                <TableHead className="text-right">Valor Unitário</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                {!readOnly && <TableHead className="w-[100px]">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {itensEditaveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={readOnly ? 5 : 6} className="text-center text-muted-foreground py-8">
                    Nenhum item adicionado à medição
                  </TableCell>
                </TableRow>
              ) : (
                itensEditaveis.map((item, index) => (
                  <TableRow key={item.id || index}>
                    <TableCell className="font-medium">
                      {(item as any).item_obra?.descricao || "Item sem descrição"}
                    </TableCell>
                    <TableCell className="text-right">
                      {readOnly ? (
                        <span>{item.quantidade_prevista || 0}</span>
                      ) : (
                        <Input
                          type="number"
                          step="0.01"
                          value={item.quantidade_prevista || ""}
                          onChange={(e) =>
                            handleChange(index, "quantidade_prevista", parseFloat(e.target.value))
                          }
                          className="text-right"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {readOnly ? (
                        <span>{item.quantidade_executada || 0}</span>
                      ) : (
                        <Input
                          type="number"
                          step="0.01"
                          value={item.quantidade_executada || ""}
                          onChange={(e) =>
                            handleChange(index, "quantidade_executada", parseFloat(e.target.value))
                          }
                          className="text-right"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {readOnly ? (
                        <span>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.valor_unitario || 0)}
                        </span>
                      ) : (
                        <Input
                          type="number"
                          step="0.01"
                          value={item.valor_unitario || ""}
                          onChange={(e) =>
                            handleChange(index, "valor_unitario", parseFloat(e.target.value))
                          }
                          className="text-right"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.valor_total || 0)}
                    </TableCell>
                    {!readOnly && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletar(item.id!)}
                          disabled={deletarMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
              {itensEditaveis.length > 0 && (
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={4} className="text-right">
                    TOTAL:
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(calcularTotal())}
                  </TableCell>
                  {!readOnly && <TableCell />}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
